<!-- App -->

<template>
  <div id="app" class="map-box">
    <router-view style="position: absolute;" name="page"></router-view>

    <div class="header" ref="header">
      <headerIndex :menuList="menuList" />
    </div>

    <div class="left-sider" ref="leftSider">
      <leftSider
        :openMenuName="openMenuName"
        :menuList="menuList"
        :isShowShrinkLeftMenu="isShowShrinkLeftMenu"
        @hideMenu="hideMenu"
      />
    </div>

    <div class="right-content" ref="rightContent">
      <div class="right-content-tag" ref="contentTag">
        <TagPage></TagPage>
      </div>
      <transition :name="transitionName">
        <keep-alive :include="cachePage">
          <router-view style="position: absolute;"></router-view>
        </keep-alive>
      </transition>
    </div>
  </div>
</template>

<script>
import initRouter from "./router/initRouter";
import routerMapComponents from "./plugin/routes/routerMapComponent";

import zh from "./plugin/language/zh.js";

import { Base64 } from "js-base64";
import moment from "moment";

import TagPage from "@/pages/tag/tag";
import headerIndex from "@/pages/header/index";
import leftSider from "@/pages/leftSider/index";

const browser = {
  versions: (function() {
    let u = navigator.userAgent,
      app = navigator.appVersion;
    return {
      //移动终端浏览器版本信息
      trident: u.indexOf("Trident") > -1, //IE内核
      presto: u.indexOf("Presto") > -1, //opera内核
      webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
      gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, //火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, //android终端或uc浏览器
      iPhone: u.indexOf("iPhone") > -1, //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf("iPad") > -1, //是否iPad
      webApp: u.indexOf("Safari") == -1 //是否web应该程序，没有头部与底部
    };
  })(),
  language: (navigator.browserLanguage || navigator.language).toLowerCase()
};

export default {
  name: "app",
  data() {
    return {
      cachePage: [
        "baiduMap",
        "alarmStatistics",
        "alarmInquiry",
        "qualityControlDataQuery",
        "overStandardDataQuery",
        "realTimeDataQuery",
        "historcalDataQuery",
        "environmentParameterLog",
        "instrumentAlarmLog",
        "instrumentProcessLog",
        "instrumentStatusLog",
        "keyParameterLog",
        "systemAlarmLog",
        "systemProcessLog",
        "daylyReportData",
        "monthlyReportData",
        "weeklyReportData",
        "hardDiskDrive",
        "realTimeMonitoring",
        "videoList",
        "learningMaterials"
      ],
      leftSetTimeout: null,
      isShowShrinkLeftMenu: false,
      isShowLeftMenu: false,
      isShowMenu: false,
      openMenuName: [],
      transitionName: "slide-left",
      menuList: [
        {
          oneName: "1",
          oneIcon: "md-planet",
          oneMenuName: "首页",
          oneChildren: [
            {
              twoName: "1-1",
              twoMenuName: "首页",
              twoMenuUrl: "/baiduMap"
            }
          ]
        }
      ],
      allMenuListData: null,
    };
  },
  components: {
    TagPage,
    headerIndex,
    leftSider
  },
  watch: {
    $route(to, from) {
      const toDepth = to.path.split("/").length;
      const fromDepth = from.path.split("/").length;
      this.transitionName = toDepth < fromDepth ? "slide-right" : "slide-left";

      let r = sessionStorage.getItem("routes");
      let s = this.$store.store;

      if (r === null && s === undefined) {
        this.init();
      }

      if (to.name === "login") {
        this.$refs.leftSider.className = "hide-left-arrow";
        this.$refs.rightContent.style.width = "100%";
        this.$refs.rightContent.style.marginLeft = 0;
      }

      if (to.name === "baiduMap") {
        this.isShowLeftMenu = false;
        this.isShowShrinkLeftMenu = false;
        this.$refs.leftSider.style.width = "";
        this.$refs.rightContent.style.width = "100%";
        this.$refs.rightContent.style.marginLeft = "";
        this.$refs.leftSider.getElementsByClassName(
          "menu-box"
        )[0].style.display = "block";
      } else {
        if (window.innerWidth <= 1400) {
          if (to.name === "login") {
            this.$refs.leftSider.className = "hide-left-arrow";
            this.$refs.rightContent.style.width = "100%";
            this.$refs.rightContent.style.marginLeft = 0;
          } else {
            this.$refs.rightContent.style.width = "calc(100% - 50px)";
            this.$refs.rightContent.style.marginLeft = "50px";
            this.$refs.contentTag.style.left = "50px";
          }
        } else {
          this.$refs.leftSider.style.width = "220px";

          this.leftSetTimeout = setTimeout(() => {
            this.$refs.leftSider.getElementsByClassName(
              "menu-box"
            )[0].style.display = "block";
          }, 300);
          this.$refs.rightContent.style.width = "calc(100% - 220px)";
          this.$refs.rightContent.style.marginLeft = "220px";
          this.$refs.contentTag.style.left = "220px";
          if (to.name === "login") {
            this.$refs.rightContent.style.width = "100%";
            this.$refs.rightContent.style.marginLeft = 0;
          }
          this.isShowLeftMenu = false;
          this.isShowShrinkLeftMenu = false;
        }
      }

      if (to.name === "baiduMap" || to.name === "login") {
        this.$refs.contentTag.className = "hide-right-content-tag";
        this.$refs.header.className = "header";
        this.$refs.leftSider.className = "left-sider";
        this.$refs.rightContent.className = "right-content";
      } else {
        this.$refs.contentTag.className = "right-content-tag";
        this.$refs.header.className = "other-header";
        this.$refs.leftSider.className = "other-left-sider";
        this.$refs.rightContent.className = "other-right-content";
      }

      if (to.name === "baiduMap") {
        this.openMenuName = ["1"];
        // this.$nextTick(() => {
        //   this.$refs.menu.updateOpened();
        //   this.$refs.menu.updateActiveName();
        // });

        this.isShowMenu = true;
        this.$refs.leftSider.className = "map-new-left-sider";

        if (sessionStorage.getItem("routes")) {
          this.getMenuListData();
        }

        if (this.menuList.length <= 1) {
          this.getMenuListData();
        }
      }

      if (window.innerWidth <= 1400) {
        if (to.name === "baiduMap" || to.name === "login") {
        } else {
          this.isShowLeftMenu = true;
          this.isShowShrinkLeftMenu = true;
          this.$refs.leftSider.style.width = "50px";
          this.$refs.leftSider.getElementsByClassName(
            "menu-box"
          )[0].style.display = "none";
          this.$refs.rightContent.style.width = "calc(100% - 50px)";
          this.$refs.rightContent.style.marginLeft = "50px";
        }
      }
    }
  },
  methods: {
    // 隐藏左侧菜单栏
    hideMenu() {
      let n = this.$route.name;
      if (!this.isShowLeftMenu) {
        this.isShowLeftMenu = !this.isShowLeftMenu;
        this.isShowShrinkLeftMenu = !this.isShowShrinkLeftMenu;
        this.$refs.leftSider.style.width = "50px";
        this.$refs.leftSider.getElementsByClassName(
          "menu-box"
        )[0].style.display = "none";

        if (n === "baiduMap" || n === "login") {
          return;
        }

        this.$refs.rightContent.style.width = "calc(100% - 50px)";
        this.$refs.rightContent.style.marginLeft = "50px";
        this.$refs.contentTag.style.left = "50px";
      } else {
        this.isShowLeftMenu = !this.isShowLeftMenu;
        this.isShowShrinkLeftMenu = !this.isShowShrinkLeftMenu;
        this.$refs.leftSider.style.width = "220px";

        this.leftSetTimeout = setTimeout(() => {
          this.$refs.leftSider.getElementsByClassName(
            "menu-box"
          )[0].style.display = "block";
        }, 300);
        if (n === "baiduMap" || n === "login") {
          return;
        }
        this.$refs.rightContent.style.width = "calc(100% - 220px)";
        this.$refs.rightContent.style.marginLeft = "220px";
        this.$refs.contentTag.style.left = "220px";
      }
    },
    // 还原菜单为初始状态
    init() {
      let list = [
        {
          oneName: "1",
          oneIcon: "md-planet",
          oneMenuName: this.$t("leftSidebar.home"),
          oneChildren: [
            {
              twoName: "1-1",
              twoMenuName: this.$t("leftSidebar.home"),
              twoMenuUrl: "/baiduMap"
            }
          ]
        }
      ];
      this.menuList = list;
    },
    // 设置菜单列表
    setMenuList() {
      let list = this.allMenuListData,
        menus = [],
        routes = [],
        videoCenter = "logo-youtube",
        learningCenter = "ios-book",
        dataAnalysisIcon = "md-analytics",
        dataReportIcon = "ios-paper",
        devOpsIcon = "md-cube",
        alarmStatisticsIcon = "ios-stats",
        runningLogIcon = "md-list-box",
        intelligentControlIcon = "ios-hammer",
        permissionConfigurationIcon = "md-settings",
        xuxiliaryFunction = "md-notifications",
        personalCenter = "md-contact";
      this.menuList = [
        {
          oneName: "1",
          oneIcon: "md-planet",
          oneMenuName: this.$t("leftSidebar.home"),
          oneChildren: [
            {
              twoName: "1-1",
              twoMenuName: this.$t("leftSidebar.home"),
              twoMenuUrl: "/baiduMap"
            }
          ]
        }
      ];

      for (let i = 0; i < list.length; i++) {
        let kid = list[i].kid,
          childrenMenus = [],
          icon = "md-settings";

        for (let j = 0; j < kid.length; j++) {
          routes.push({
            path: "/" + kid[j].power_url,
            name: kid[j].power_url,
            component: routerMapComponents[kid[j].power_url],
            meta: {
              name: `${this.$t(this.setTowMenuName(kid[j].power_url))}`
            }
          });

          childrenMenus.push({
            twoName: i + 2 + "-" + (j + 1).toString(),
            twoMenuName: `${this.$t(this.setTowMenuName(kid[j].power_url))}`,
            twoMenuUrl: "/" + kid[j].power_url
          });
        }

        switch (list[i].menu_name) {
          case "数据分析":
            icon = dataAnalysisIcon;
            break;
          case "数据报表":
            icon = dataReportIcon;
            break;
          case "运维管理":
            icon = devOpsIcon;
            break;
          case "报警统计":
            icon = alarmStatisticsIcon;
            break;
          case "运行日志":
            icon = runningLogIcon;
            break;
          case "智能控制":
            icon = intelligentControlIcon;
            break;
          case "设置":
            icon = permissionConfigurationIcon;
            break;
          case "学习中心":
            icon = learningCenter;
            break;
          case "视频中心":
            icon = videoCenter;
            break;
          case "辅助功能":
            icon = xuxiliaryFunction;
            break;
          case "个人中心":
            icon = personalCenter;
            break;
        }

        menus.push({
          oneName: (i + 2).toString(),
          oneIcon: icon,
          oneMenuName: `${this.$t(this.setMenuName(list[i].menu_name))}`,
          meta: {
            name: list[i].menu_name
          },
          oneChildren: childrenMenus
        });
      }
      this.menuList = this.menuList.concat(menus);

      console.log(this.menuList, "><");

      routes.push({
        path: "*",
        redirect: "/"
      });

      let newRoutes = initRouter.concat(routes);

      sessionStorage.setItem("routes", true);
      this.$router.addRoutes(newRoutes);
    },
    setMenuName(val) {
      let k = null;
      switch (val) {
        case "报警统计":
          k = "leftSidebar.alarmStatistics";
          return k;
          break;
        case "数据分析":
          k = "leftSidebar.dataAnalysis";
          return k;
          break;
        case "运维管理":
          k = "leftSidebar.operationsManagement";
          return k;
          break;
        case "设置":
          k = "leftSidebar.settings";
          return k;
          break;
        case "数据报表":
          k = "leftSidebar.dataReports";
          return k;
          break;
        case "智能控制":
          k = "leftSidebar.intelligentControl";
          return k;
          break;
        case "运行日志":
          k = "leftSidebar.runTheLog";
          return k;
          break;
        case "学习中心":
          k = "leftSidebar.learningCenter";
          return k;
          break;
        case "视频中心":
          k = "leftSidebar.videoCenter";
          return k;
          break;
        case "辅助功能":
          k = "leftSidebar.xuxiliaryFunction";
          return k;
          break;
        case "个人中心":
          k = "leftSidebar.personalCenter";
          return k;
          break;
      }
    },
    setTowMenuName(val) {
      let sid = zh.leftSidebar;
      for (let key in sid) {
        if (val === key) {
          return `leftSidebar.${key}`;
        }
      }
    },
    // 获取菜单
    getMenuListData() {
      this.$api.auth_login
        .getMenuLoadList()
        .then(res => {
          if (res.data.code === 0) {
            this.allMenuListData = null;
            this.allMenuListData = res.data.data;

            if (res.data.data.length === 0) {
            } else {
              this.setMenuList();
            }
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    setStore() {
      let store = this.$store.state;
      console.log(store, "App store <----------------------------");

      if (store.userInfo === null) {
        if (this.$route.name !== "appDownloadPage") {
          // 判断是否登录
          let user = sessionStorage.getItem("userInfo");
          if (user === null) {
            this.$store.dispatch({
              type: "clearUserInfo"
            });
            sessionStorage.clear();
            this.$router.replace({ path: "/" });
          }
        }
      }

      if (store.resolveUserInformation === null) {
        if (store.userInfo === null) {
          if (this.$route.name !== "appDownloadPage") {
            // 判断是否登录
            let user = sessionStorage.getItem("userInfo");
            if (user === null) {
              this.$store.dispatch({
                type: "clearUserInfo"
              });
              sessionStorage.clear();
              this.$router.replace({ path: "/" });
            }
          }
        } else {
          if (store.userInfo.obj === null) {
            if (this.$route.name !== "appDownloadPage") {
              // 判断是否登录
              let user = sessionStorage.getItem("userInfo");
              if (user === null) {
                this.$store.dispatch({
                  type: "clearUserInfo"
                });
                sessionStorage.clear();
                this.$router.replace({ path: "/" });
              }
            }
          } else {
            let token = store.userInfo.obj.access_token,
              info = token.split("."),
              baseInfo = JSON.parse(Base64.decode(info[1]));

            this.$store.dispatch({
              type: "saveUserInformationAfterParsing",
              obj: baseInfo
            });
          }
        }
      }

      if (store.selectStartDate === null || store.selectEndDate === null) {
        this.$store.dispatch({
          type: "saveSelectStartDate",
          obj: `${moment()
            .subtract(30, "d")
            .format("YYYY-MM-DD HH:mm:ss")}`
        });
        this.$store.dispatch({
          type: "saveSelectEndDate",
          obj: `${moment().format("YYYY-MM-DD HH:mm:ss")}`
        });
      }
    }
  },
  created() {
    this.setStore();

    if (this.$route.name === "appDownloadPage") {
    } else {
      // 判断是否登录
      let user = sessionStorage.getItem("userInfo");
      if (user === null) {
        this.$store.dispatch({
          type: "clearUserInfo"
        });
        sessionStorage.clear();
        this.$router.replace({ path: "/" });
      }
    }

    if (this.$route.name === "appDownloadPage") {
      let app = sessionStorage.getItem("isAppDownloadPage");
      if (!app) {
        // 判断在哪个平台打开
        if (browser.versions.mobile) {
          //判断是否是移动设备打开。
          let ua = navigator.userAgent.toLowerCase(); //获取判断用的对象
          if (ua.match(/MicroMessenger/i) == "micromessenger") {
            //或if(ua.indexOf('micromessenger') != -1){}
            //在微信中打开
            window.location.href = "https://www.waterqm.com/appDownloadPage";
          }
          if (ua.match(/WeiBo/i) == "weibo") {
            //在新浪微博客户端打开
            window.location.href = "https://www.waterqm.com/appDownloadPage";
          }
          if (ua.match(/QQ/i) == "qq") {
            //在QQ空间打开
            window.location.href = "https://www.waterqm.com/appDownloadPage";
          }
          if (browser.versions.ios) {
            //是否在IOS浏览器打开
            window.location.href = "https://www.waterqm.com/appDownloadPage";
          }
          if (browser.versions.android) {
            //是否在安卓浏览器打开
            window.location.href = "https://www.waterqm.com/appDownloadPage";
          }
        } else {
          //否则就是PC浏览器打开
        }
        sessionStorage.setItem("isAppDownloadPage", true);
      }
    } else {
      // 判断在哪个平台打开
      if (browser.versions.mobile) {
        //判断是否是移动设备打开。
        let ua = navigator.userAgent.toLowerCase(); //获取判断用的对象
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
          //或if(ua.indexOf('micromessenger') != -1){}
          //在微信中打开
          window.location.href = "https://www.waterqm.com/appDownloadPage";
        }
        if (ua.match(/WeiBo/i) == "weibo") {
          //在新浪微博客户端打开
          window.location.href = "https://www.waterqm.com/appDownloadPage";
        }
        if (ua.match(/QQ/i) == "qq") {
          //在QQ空间打开
          window.location.href = "https://www.waterqm.com/appDownloadPage";
        }
        if (browser.versions.ios) {
          //是否在IOS浏览器打开
          window.location.href = "https://www.waterqm.com/appDownloadPage";
        }
        if (browser.versions.android) {
          //是否在安卓浏览器打开
          window.location.href = "https://www.waterqm.com/appDownloadPage";
        }
      } else {
        //否则就是PC浏览器打开
      }
    }
  },
  mounted() {
    this.$Modal.remove();

    this.isShowLeftMenu = false;
    this.isShowShrinkLeftMenu = false;

    let s = sessionStorage.getItem("routes");
    if (s) {
      this.getMenuListData();
    }

    if (this.$route.name === "login" || this.$route.name === "baiduMap") {
      this.$refs.header.className = "header";
      this.$refs.leftSider.className = "left-sider";
      this.$refs.rightContent.className = "right-content";
    } else {
      this.isShowMenu = false;
      this.$refs.header.className = "other-header";
      this.$refs.leftSider.className = "other-left-sider";
      this.$refs.rightContent.className = "other-right-content";
    }

    if (this.$route.name === "baiduMap") {
      this.isShowMenu = true;
      this.$refs.leftSider.className = "map-new-left-sider";
    }
  },
  beforeDestroy() {
    clearTimeout(this.leftSetTimeout);
  }
};
</script>

<style lang="less">
// 重写 iview Modal 底部按钮样式
.ivu-modal-confirm-footer {
  display: none;
  margin-top: 20px;
  text-align: right;
}
.ivu-modal-footer {
  display: none;
}

// 去除地图 logo
.BMap_cpyCtrl {
  display: none;
}
.anchorBL {
  display: none;
}

#app {
  width: 100%;
  height: 100%;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: @bg;
  -webkit-text-size-adjust: none; 
  overflow: hidden;
}

.map-box {
  width: @wh;
  height: @wh;
  background-color: @bg;
  position: relative;

  .header {
    display: none;
    width: 0;
    height: 0;
    padding: 0 80px;
    background-color: @bg;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-bottom: 1px solid #dcdee2;
  }
  .app-real-name {
    position: relative;
    height: 100%;
    max-height: @otherHeader;
    line-height: @otherHeader;
    float: right;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: end;
    -ms-flex-pack: end;
    justify-content: flex-end;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    font-size: 16px;

    .real-name-avatar {
      margin-left: 5px;
    }

    .user-info {
      position: absolute;
      top: 44px;
      right: -7px;
      display: block;
      width: 230px;

      .arrow {
        border-style: solid;
        border-width: 0 7px 8px;
        border-color: transparent transparent #41b883;
        top: 10px;
        right: 17px;
        position: absolute;
      }

      .info-detail-B {
        border-radius: 2px;
        background-color: #fff;
        width: 230px;
        position: absolute;
        top: 17px;
        right: 0;
        box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.3);

        .real-name {
          width: 100%;
          position: relative;
          background-color: #41b883;

          .real-name-item {
            line-height: 25px;
            padding: 4px 10px;
            font-size: 14px;
            color: white;
          }

          .real-list-item {
            line-height: 25px;
            padding: 0 10px;
            background-color: #f1f1f1;

            div:first-child {
              cursor: pointer;
              span {
                font-size: 14px;
                color: #444444;
              }
            }
          }
        }

        .exit {
          line-height: 25px;
          width: 100%;
          position: relative;
          padding: 2px 10px;
          background-color: white;
          color: #999;
          text-align: right;

          .real-name-exit {
            cursor: pointer;
            font-size: 14px;
            color: #999;

            &:hover {
              color: #41b883;
            }
          }
        }
      }
    }
  }

  .left-sider {
    display: none;
    width: 0;
    height: 0;
    background-color: @bg;
    position: relative;
  }

  .right-content {
    width: @wh;
    height: @wh;
    border: none;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background-color: @bg;
    position: relative;
    -webkit-transition: width 0.5s ease, height 0.5s ease;
    transition: width 0.5s ease, height 0.5s ease;
  }
}

.map-new-left-sider {
  display: block;
  z-index: 300;
  position: fixed;
  top: 75px;
  left: 15px;
  bottom: 15px;
  border-radius: 2px;
  -webkit-box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.15);
  box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.15);
  display: block;
  width: @mapNewLeftSider;
  background-color: white;

  .menu-box {
    width: 100%;
    height: calc(100% - 40px);
    background-color: white;
    overflow-y: scroll;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */

    &::-webkit-scrollbar {
      width: 0 !important;
    }
  }
}

.hide-left-arrow {
  display: none;
}

.map-hide-left-arrow {
  z-index: 500;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  overflow-y: scroll;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */

  &::-webkit-scrollbar {
    width: 0 !important;
  }
}

.other-header {
  // position: fixed;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  width: @wh;
  max-height: @otherHeader;
  min-height: @otherHeader;
  display: inline-block;
  box-shadow: 0 2px 4px rgba(33, 33, 33, 0.2);
  -webkit-box-shadow: 0 2px 4px rgba(33, 33, 33, 0.2);
  -moz-box-shadow: 0 2px 4px rgba(33, 33, 33, 0.2);
  -o-box-shadow: 0 2px 4px rgba(33, 33, 33, 0.2);
  -ms-box-shadow: 0 2px 4px rgba(33, 33, 33, 0.2);
  padding: 0 40px;
  color: black;
  background-color: white;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;

  &:after {
    content: "";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
}

.other-left-sider {
  // position: fixed;
  position: absolute;
  top: @otherHeader;
  left: 0;
  // bottom: 15px;
  width: @mapNewLeftSider;
  height: calc(@wh - @otherHeader);
  background-color: white;
  box-shadow: 0 0 10px 0 rgba(33, 33, 33, 0.2);
  -webkit-box-shadow: 0 0 10px 0 rgba(33, 33, 33, 0.2);
  -moz-box-shadow: 0 0 10px 0 rgba(33, 33, 33, 0.2);
  -o-box-shadow: 0 0 10px 0 rgba(33, 33, 33, 0.2);
  -ms-box-shadow: 0 0 10px 0 rgba(33, 33, 33, 0.2);
  z-index: 300;
  transition: width 0.5s;

  .menu-box {
    width: 100%;
    height: calc(100% - 40px);
    background-color: white;
    overflow-y: scroll;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */

    &::-webkit-scrollbar {
      width: 0 !important;
    }
  }

  &:after {
    content: "";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
}

.other-right-content {
  display: inline-block;
  box-sizing: border-box;
  width: calc(@wh - @mapNewLeftSider);
  height: calc(@wh - @otherHeader);
  margin-top: @otherHeader;
  margin-left: @mapNewLeftSider;
  border: none;
  background-color: @bg;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  position: relative;
  -webkit-transition: width 0.5s ease, height 0.5s ease;
  transition: width 0.5s ease, height 0.5s ease;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  transition: width 0.5s, margin-left 0.6s;

  &::-webkit-scrollbar {
    width: 0 !important;
  }
}

.right-content-tag {
  z-index: 100;
  background-color: #f3f3f3;
  position: fixed;
  top: 60px;
  left: 220px;
  right: 0;
  transition: left 0.6s;
}

.hide-right-content-tag {
  display: none;
}
</style>