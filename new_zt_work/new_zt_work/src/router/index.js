import Vue from 'vue'
import Router from 'vue-router'
import { LoadingBar } from 'view-design';
Vue.use(Router)

import initRouter from './initRouter'

let router = new Router({
  mode: 'history',
  routes: initRouter
})

router.beforeEach((to, from, next) => {
  LoadingBar.start();
  let info = sessionStorage.getItem("routerInfo");

  if (info === null) {
    sessionStorage.setItem("routerInfo", JSON.stringify([to]));
  } else {
    let parseInfo = JSON.parse(info);
    parseInfo.push(to);

    let newArr = [];
    let n = {};
    for (let i = 0; i < parseInfo.length; i++) {
      if (!n[parseInfo[i].path]) {
        newArr.push(parseInfo[i]);
        n[parseInfo[i].path] = 1;
      } else {
        n[parseInfo[i].path]++;
      }
    }

    sessionStorage.setItem("routerInfo", JSON.stringify(newArr));
  }

  next();
});

router.afterEach(route => {
  LoadingBar.finish();
});

export default router;