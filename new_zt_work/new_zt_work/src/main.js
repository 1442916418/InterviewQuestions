import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store'
import api from './request/api/index'

Vue.config.productionTip = false

Vue.prototype.$api = api;

import Vuex from 'vuex'
Vue.use(Vuex)

import './plugin/iview/index'

import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap, {
  ak: '1mDCfjNjvNZG3HArR1BlAcEZpYTvXopz'
})

import moment from 'moment'
Vue.prototype.$moment = moment;

import Device from './common/controlComponents/device'
Vue.use(Device);

import Time from './common/controlComponents/time'
Vue.use(Time);

import User from './common/controlComponents/User'
Vue.use(User);

import DTable from './common/controlComponents/table'
Vue.use(DTable);

import Paging from './common/controlComponents/paging'
Vue.use(Paging);

import _global from './plugin/global/Global.js'
Vue.prototype.$glb = _global;

import i18n from './plugin/language/i18n.js'

import FileSaver from "file-saver";
import XLSX from "xlsx";

Vue.prototype.$FileSaver = FileSaver;
Vue.prototype.$XLSX = XLSX;

import regExp from './plugin/regExp/regExp.js'
Vue.prototype.$RegExp = regExp;

import animate from 'animate.css'
Vue.use(animate)

import GlobalError from './plugin/error/error'
Vue.use(GlobalError)

new Vue({
  el: '#app',
  i18n,
  router,
  store,
  components: { App },
  template: '<App/>'
})