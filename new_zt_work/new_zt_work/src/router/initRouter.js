// 初始路由

import i18n from '../plugin/language/i18n'
import BaiduMap from '@/components/home/baiduMap'
import Login from '@/components/login/login'
import NetWork from "@/components/NetWork/netWork"
import Error404 from "@/components/NetWork/error404"
import AppDownloadPage from "@/components/appDownloadPage/appDownloadPage"

const initRouter = [
    // 登陆页
    {
        path: '/',
        name: 'login',
        component: Login,
        meta: {
            name: i18n.t('leftSidebar.signIn')
        }
    },
    // // 重定向
    // {
    //     path: '*',
    //     redirect: '/'
    // },
    // 百度地图（水质自动监测）
    {
        path: '/baiduMap',
        name: 'baiduMap',
        component: BaiduMap,
        meta: {
            name: i18n.t('leftSidebar.home')
        }
    },
    // 超时页
    {
        path: '/netWork',
        name: 'netWork',
        component: NetWork,
        meta: {
            name: i18n.t('leftSidebar.overtime')
        }
    },
    // 404
    {
        path: '/error404',
        name: 'error404',
        component: Error404,
        meta: {
            name: i18n.t('leftSidebar._404')
        }
    },
    // App 下载页
    {
        path: '/appDownloadPage',
        name: 'appDownloadPage',
        components: {
            page: AppDownloadPage
        },
        meta: {
            name: i18n.t('leftSidebar.downloadApp')
        }
    },
]

export default initRouter;