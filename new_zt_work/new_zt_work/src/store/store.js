import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

let store = new Vuex.Store({
    // 声明全局变量
    state: {
        userInfo: sessionStorage["userInfo"] ? JSON.parse(sessionStorage["userInfo"]) : null,
        NetWorkState: true,
        dev: config.dev,
        deviceMn: null,
        selectStartDate: null,
        selectEndDate: null,
        menuName: null,
        routerInfo: null,
        resolveUserInformation: null,
    },
    // 获取 state 数据
    getters: {
        userInfo: state => state.userInfo
    },
    // 唯一方法是提交 mutation（同步）
    mutations: {
        changeUserInfo(state, obj) {
            if (obj) {
                state.userInfo = obj;
            } else {
                state.userInfo = null;
            }
        },
        changeNetWorkState(state, obj) {
            state.NetWorkState = obj;
        },
        changeDeviceMn(state, obj) {
            state.deviceMn = obj;
        },
        changeSelectStartDate(state, obj) {
            state.selectStartDate = obj;
        },
        changeSelectEndDate(state, obj) {
            state.selectEndDate = obj;
        },
        changeMenuName(state, obj) {
            state.menuName = obj;
        },
        changeRouterInfo(state, obj) {
            state.routerInfo = obj
        },
        changeUserInformationAfterParsing(state, obj){
            state.resolveUserInformation = obj;
        }
    },
    // Action 提交的是 mutation，而不是直接变更状态。
    // Action 可以包含任意异步操作。（异步）
    actions: {
        // 保存用户信息
        saveUserInfo({ commit }, obj) {
            commit("changeUserInfo", obj);
            sessionStorage.setItem("userInfo", JSON.stringify(obj));
        },
        // 清除用户信息
        clearUserInfo({ commit }) {
            commit("changeUserInfo", null);
            sessionStorage.removeItem("userInfo");
        },
        // 设置断电信息
        saveNetWorkState({ commit }, obj) {
            commit("changeNetWorkState", obj);
        },
        // 保存设备 mn
        saveDeviceMn({ commit }, obj) {
            commit("changeDeviceMn", obj);
        },
        // 保存开始时间
        saveSelectStartDate({ commit }, obj) {
            commit("changeSelectStartDate", obj);
        },
        // 保存结束时间
        saveSelectEndDate({ commit }, obj) {
            commit("changeSelectEndDate", obj);
        },
        // 保存当前菜单name
        saveMenuName({ commit }, obj) {
            commit("changeMenuName", obj);
        },
        // 保存当前路由信息
        saveRouterInfo({ commit }, obj) {
            commit("changeRouterInfo", obj);
        },
        // 保存解析后的用户信息
        saveUserInformationAfterParsing({ commit }, obj) {
            commit("changeUserInformationAfterParsing", obj);
        }
    },
});

export default store;