<!-- 头部组件 -->

<template>
  <div class="header-box">
    <versionDetails :drawer1="drawer1" @closeVersionDetails="closeVersionDetails" />

    <div class="app-logo">
      <img
        src="../../../static/imgs/logo32.png"
        :alt="logoTxt"
        width="32"
        height="32"
        style="vertical-align: -10px;"
        @click="() => this.$router.push({ path: '/baiduMap'})"
      />
      <span
        id="app-header-logo"
        class="logo-text"
        @click="() => this.$router.push({ path: '/baiduMap'})"
      >水质在线监测系统平台</span>
      <div @click="clickVersion" class="version">
        <div>V {{ version === null ? null : version }}</div>
      </div>
      <div class="logo-img" id="app-header-logo-img">
        <a :href="qrcodeUri" target="_blank">
          <div class="app_qrcode" id="app_qrcode"></div>
        </a>
      </div>
    </div>
    <div class="app-real-name" @click="showUser">
      <div class="search-box">
        <Select
          class="select"
          v-model="fuzzySearchMenu"
          :placeholder="$t('tip.fuzzySearch')"
          filterable
          clearable
          prefix="ios-search"
          size="small"
          @on-change="onSearchMenuChange"
        >
          <OptionGroup v-for="(item, index) in menuList" :key="index" :label="item.oneMenuName">
            <Option
              v-for="t in item.oneChildren"
              :key="t.twoMenuName"
              :value="t.twoMenuUrl"
              :label="t.twoMenuName"
            >
              <router-link :to="t.twoMenuUrl">{{t.twoMenuName}}</router-link>
            </Option>
          </OptionGroup>
        </Select>
      </div>
      <Icon
        class="ios-navigate-outline"
        type="ios-navigate-outline"
        size="22"
        @click.stop="clickDriver"
        style="margin-right:10px;"
      />
      <Icon
        class="expandIcon"
        :type="expandIcon"
        size="22"
        @click.stop="expand"
        style="margin-right:10px;"
      />
      <img
        style="margin-right:10px;"
        :src="zhAndEn"
        alt="中英切换"
        width="20"
        height="20"
        class="zhAndEn"
        @click.stop="clickZh"
      />
      <Icon
        style="margin-right:10px;"
        type="ios-alarm"
        size="23"
        color="#41b883"
        class="meetingRoomAppointment"
        @click.stop="$router.replace({ path: 'meetingRoomAppointment' })"
      />
      <div class="real-name-box">{{ RealName }}</div>
      <div class="avatar-box">
        <Avatar
          icon="ios-person"
          class="real-name-avatar"
          style="background-color: #41B883;cursor: pointer;"
          v-clickoutside="handleClose"
        />
        <div class="user-info" v-show="showUserInfo">
          <div class="arrow"></div>
          <div class="info-detail-B">
            <div class="real-name">
              <div class="real-name-item">
                <span>{{ $t('header.realName') }} :</span>
                <span>{{ RealName === null ? null : RealName }}</span>
              </div>
              <div class="real-name-item">
                <span>{{ $t('header.userAccount') }} :</span>
                <span>{{ userAccout === null ? null : userAccout }}</span>
              </div>
              <div class="real-list-item">
                <div @click="modifyPassword">
                  <span>{{ $t('header.changePassword') }}</span>
                </div>
              </div>
            </div>
            <div class="exit">
              <span @click="signOut" class="real-name-exit">{{ $t('header.signOut') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const version = require("../../../package.json");
import versionDetails from "@/components/versionDetails/versionDetails";
import Driver from "driver.js";
import "driver.js/dist/driver.min.css";
import steps from "../../plugin/guide/guide.js";
import QRCode from "qrcodejs2";

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

const clickoutside = {
  // 初始化指令
  bind(el, binding, vnode) {
    function documentHandler(e) {
      // 这里判断点击的元素是否是本身，是本身，则返回
      if (el.contains(e.target)) {
        return false;
      }
      // 判断指令中是否绑定了函数
      if (binding.expression) {
        // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
        binding.value(e);
      }
    }
    // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
    el.__vueClickOutside__ = documentHandler;
    document.addEventListener("click", documentHandler);
  },
  update() {},
  unbind(el, binding) {
    // 解除事件监听
    document.removeEventListener("click", el.__vueClickOutside__);
    delete el.__vueClickOutside__;
  }
};

export default {
  props: {
    menuList: Array
  },
  components: {
    versionDetails
  },
  directives: { clickoutside },
  name: "headerBox",
  data() {
    return {
      modifyPwd: {
        oldPwd: "",
        newPwd: "",
        newPwd2: ""
      },
      logoTxt: "水质在线监测系统平台",
      showUserInfo: false,
      userAccout: null,
      RealName: null,
      zhAndEn: require("../../../static/imgs/en.png"),
      zh: require("../../../static/imgs/zh.png"),
      en: require("../../../static/imgs/en.png"),
      expandIcon: "ios-expand",
      fuzzySearchMenu: `/${this.$route.name}`,
      qrcodeUri: this.$glb.appUri,
      version: null,
      drawer1: false
    };
  },
  created() {
    this.drawer1 = false;
    this.version = version.version;
    this.driver = new Driver({
      animate: true,
      opacity: 0.75,
      doneBtnText: this.$t("tip.complete"),
      closeBtnText: this.$t("tip.close"),
      nextBtnText: this.$t("tip.Next"),
      prevBtnText: this.$t("tip.last")
    });
  },
  mounted() {
    this.qrcode();
    this.setRealName();

    this.$i18n.locale === "zh"
      ? (this.zhAndEn = this.en)
      : (this.zhAndEn = this.zh);
  },
  methods: {
    qrcode() {
      new QRCode("app_qrcode", {
        width: 30,
        height: 30,
        text: this.$glb.appUri,
        correctLevel: 3,
        render: "table"
      });
    },
    // 退出登陆
    signOut() {
      this.$store.dispatch({
        type: "clearUserInfo"
      });
      sessionStorage.clear();
      this.$router.push({ name: "login" });
    },
    // 注销
    logout(val) {
      if (val === "logout") {
        this.signOut();
      }
    },
    // 显示用户信息
    showUser() {
      console.log(this.showUserInfo, '<<<<>>>>');
      if (this.showUserInfo) {
        this.showUserInfo = false;
      } else {
        if (this.userAccout === null || this.RealName === null) {
          this.setRealName();
        }
        this.showUserInfo = true;
      }
    },
    // 关闭
    handleClose(e) {
      this.showUserInfo = false;
    },
    // 确认修改密码
    subModifyPassword() {
      let m = this.modifyPwd;
      if (m.oldPwd === "") {
        this.$Message.warning(this.$t("tip.pleaseEnterTheOldPassword"));
        return;
      } else if (m.newPwd === "") {
        this.$Message.warning(this.$t("tip.pleaseEnterTheNewPassword"));
        return;
      } else if (m.newPwd2 === "") {
        this.$Message.warning(this.$t("tip.pleaseEnterANewPasswordToConfirm"));
        return;
      } else if (m.newPwd != m.newPwd2) {
        this.$Message.warning(this.$t("tip.enterPasswordForTheSecoundTime"));
        this.modifyPwd.newPwd = "";
        this.modifyPwd.newPwd2 = "";
        return;
      } else if (m.newPwd.length < 6 || m.newPwd2.length < 6) {
        this.$Message.warning(this.$t("tip.minimumSixDigitsOfNewPassword"));
        return;
      } else {
        let data = {
          old_password: m.oldPwd.trim(),
          new_password: m.newPwd2.trim()
        };

        this.$api.auth_login
          .modifyPassword(data)
          .then(res => {
            if (res.data.code === 0) {
              this.$Message.success(this.$t("tip.editSuccess"));
              this.$Modal.remove();
            }
          })
          .catch(error => {
            this.$Message.error(this.$t("tip.requestError"));
          });
      }
    },
    // 修改密码弹框
    modifyPassword() {
      this.$Modal.confirm({
        scrollable: true,
        render: h => {
          return h("div", [
            h("div", {
              domProps: {
                innerHTML: this.$t("tip.pleaseEnterTheOldPassword")
              },
              style: {
                "margin-top": "10px",
                "margin-bottom": "10px"
              }
            }),
            h("Input", {
              props: {
                type: "password",
                value: this.modifyPwd.oldPwd,
                autofocus: true,
                placeholder: this.$t("tip.pleaseEnterTheOldPassword")
              },
              on: {
                input: val => {
                  this.modifyPwd.oldPwd = val;
                }
              }
            }),
            h("div", {
              domProps: {
                innerHTML: this.$t("tip.pleaseEnterTheNewPassword")
              },
              style: {
                "margin-top": "10px",
                "margin-bottom": "10px"
              }
            }),
            h("Input", {
              props: {
                type: "password",
                value: this.modifyPwd.newPwd,
                autofocus: true,
                placeholder: this.$t("tip.pleaseEnterTheNewPassword")
              },
              on: {
                input: val => {
                  this.modifyPwd.newPwd = val;
                }
              }
            }),
            h("div", {
              domProps: {
                innerHTML: this.$t("tip.pleaseEnterANewPasswordToConfirm")
              },
              style: {
                "margin-top": "10px",
                "margin-bottom": "10px"
              }
            }),
            h("Input", {
              props: {
                type: "password",
                value: this.modifyPwd.newPwd2,
                autofocus: true,
                placeholder: this.$t("tip.pleaseEnterANewPasswordToConfirm")
              },
              on: {
                input: val => {
                  this.modifyPwd.newPwd2 = val;
                }
              }
            }),
            h(
              "div",
              {
                slot: "footer",
                style: {
                  width: "100%",
                  height: "55px",
                  lineHeight: "55px",
                  paddingTop: "10px",
                  paddingBottom: "10px"
                }
              },
              [
                h(
                  "Button",
                  {
                    props: {
                      type: "primary"
                    },
                    style: {
                      float: "right",
                      "margin-top": "10px",
                      "margin-bottom": "10px"
                    },
                    on: {
                      click: () => {
                        this.subModifyPassword();
                      }
                    }
                  },
                  this.$t("tip.determine")
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "text"
                    },
                    style: {
                      float: "right",
                      "margin-top": "10px",
                      "margin-bottom": "10px"
                    },
                    on: {
                      click: () => {
                        this.$Modal.remove();
                        this.modifyPwd = {
                          oldPwd: "",
                          newPwd: "",
                          newPwd2: ""
                        };
                      }
                    }
                  },
                  this.$t("tip.cancel")
                )
              ]
            )
          ]);
        }
      });
    },
    // 设置名称
    setRealName() {
      let store = this.$store.state;
      if (store.userInfo === null || store.userInfo === undefined) {
      } else {
        if (store.userInfo.obj === null) {
          this.RealName = null;
          this.userAccout = null;
        } else {
          this.RealName = store.userInfo.obj.real_name;
          this.userAccout = store.userInfo.obj.username;
        }
      }
    },
    clickZh() {
      let lan = ["zh", "en"];
      if (this.$i18n.locale === lan[0]) {
        this.$i18n.locale = lan[1];
        this.zhAndEn = this.zh;
      } else {
        this.$i18n.locale = lan[0];
        this.zhAndEn = this.en;
      }
      sessionStorage.setItem("language", this.$i18n.locale);
      this.$router.go(0);
    },
    // 全屏
    expand() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        this.expandIcon = "ios-expand";
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
        this.expandIcon = "ios-contract";
      }
      this.fullscreen = !this.fullscreen;
    },
    clickDriver() {
      this.driver.defineSteps(steps);
      this.driver.start();
    },
    onSearchMenuChange(val) {
      this.$router.push({ path: val });
    },
    closeVersionDetails(val) {
      this.drawer1 = val;
    },
    // 根据账号ID查看版本详情
    clickVersion() {
      let store = this.$store.state;
      let s = this.$store.state.dev;
      if (store.userInfo === null || store.userInfo === undefined) {
        this.drawer1 = false;
      } else {
        if (store.userInfo.obj !== null) {
          let n = store.userInfo.obj.user_id;

          if (s === "TEST") {
            if (n === 125 || n === 90 || n === 92 || n === 3) {
              this.drawer1 = !this.drawer1;
            }
          } else {
            if (
              n === 125 ||
              n === 90 ||
              n === 92 ||
              n === 3 ||
              n === 68 ||
              n === 76
            ) {
              this.drawer1 = !this.drawer1;
            }
          }
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.header-box {
  width: 100%;
  height: 100%;
  position: relative;

  .app-logo {
    position: relative;
    height: 100%;
    line-height: @otherHeader;
    float: left;
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
    cursor: pointer;

    .logo-text {
      font-size: 20px;
      font-weight: 600;
      color: black;
      margin: 0 5px;
    }

    .version {
      cursor: pointer;

      div {
        display: inline-block;
        font-size: 12px;
        vertical-align: -5px;
      }
    }

    .logo-img {
      margin-left: 10px;
      -moz-margin-left: 10px;

      // a {
      //   .app_qrcode {
      //     img {
      //       width: 30px;
      //       height: 30px;
      //       cursor: pointer;
      //       vertical-align: middle;
      //       transition: all 0.3s;

      //       &:hover {
      //         margin-top: 60px;
      //         transform: scale(4);
      //         box-shadow: 0 0 10px rgba(21, 21, 21, 0.2);
      //       }
      //     }
      //   }
      // }
    }
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

    .real-name-box {
      display: inline-block;
      padding: 0 5px;
      text-align: center;
      max-width: 200px;
    }

    .search-box {
      min-width: 150px;
      max-width: 200px;
      margin-right: 10px;

      .select {
        width: 100%;
      }
    }

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
}
</style>