/**
 * 
 *  axios 封装
 *  请求拦截、响应拦截、错误统一处理
 * 
 */

import axios from "axios";
import router from "../router/index"
import store from "../store/store"
import { Message } from 'view-design'
import i18n from '../plugin/language/i18n'
import errorInfo from './error/index'


/**
 *  提示函数
 */
const tip = msg => {
    Message.warning({
        content: i18n.t(msg),
        duration: 1.5,
        closable: true
    });
}

/**
 *  跳转登陆页
 *  携带当前页面路由，以在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
    router.replace({
        path: '/',
        query: {
            redirect: router.currentRoute.fullPath
        }
    })
}

/**
 *  请求失败统一处理
 */
const errorHandle = (status, other) => {
    for (let i = 0; i < errorInfo.length; i++) {
        if (status === errorInfo[i].code) {
            tip(errorInfo[i].tip);

            if (errorInfo[i].isLogin !== undefined && errorInfo[i].isClear !== undefined) {
                if (errorInfo[i].isLogin && errorInfo[i].isClear) {
                    store.dispatch({
                        type: 'clearUserInfo'
                    })
                    setTimeout(() => {
                        toLogin();
                    }, 1000);
                }
            }
        }
    }
}

// 创建 axios 实例
let instance = axios.create({ timeout: 1000 * 60 });

// 设置 post 请求头
instance.defaults.headers.post["Content-Type"] = "application/json";

// 表示是否跨域访问请求
instance.defaults.withCredentials = true;

/**
 *  "请求"拦截器
 *  每次请求前，如果存在 token 则在请求头中携带 token
 */
instance.interceptors.request.use(
    config => {
        let f = null;
        let n = navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i);
        if (n == "ios") {
            f = "iOS";
        } else if (n == "Android") {
            f = "Android";
        } else {
            f = "Web"
        }
        config.headers.OperationPlatform = f;

        const userInfo = store.state.userInfo;

        if (userInfo === null || userInfo.obj === null || userInfo.obj === undefined) {
            return config;
        } else {
            const access_token = userInfo.obj.access_token;
            access_token && (config.headers.access_token = access_token);
            return config;
        }
    },
    error => {
        return Promise.reject(error);
    }
)

/**
 *  "响应"拦截器
 */
instance.interceptors.response.use(
    res => {
        console.log('"响应"拦截器', res);
        if (res.status === 200) {
            if (res.data.code === 0) {
                return Promise.resolve(res);
            } else {
                errorHandle(res.data.code, res.data.message);
                return Promise.resolve(res);
            }
        } else {
            return Promise.reject(res);
        }
    },
    error => {
        console.log('"响应"拦截器', error);
        const { response } = error;
        if (response) {
            errorHandle(response.status, response.data.message);
            return Promise.reject(response);
        } else {
            store.dispatch({
                type: 'saveNetWorkState',
                obj: false
            })

            router.replace({
                path: 'netWork',
                query: {
                    redirect: router.currentRoute.fullPath
                }
            });
        }
    }
);

export default instance;