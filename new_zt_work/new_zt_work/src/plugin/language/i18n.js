import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

// import zhLocale from "view-design/src/locale/lang/zh-CN";
// import enLocale from "view-design/src/locale/lang/en-US";

import zh from './zh'
import en from './en'

export default new VueI18n({
    locale: sessionStorage.getItem("language") || "zh",
    messages: {
        'zh': Object.assign(zh),
        'en': Object.assign(en),
    }
})