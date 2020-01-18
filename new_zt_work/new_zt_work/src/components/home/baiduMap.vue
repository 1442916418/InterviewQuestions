<!-- 水质自动检测（百度地图） -->

<template>
  <div class="map-box">
    <baidu-map
      :center="center"
      :zoom="zoom"
      dragging
      scroll-wheel-zoom
      inertial-dragging
      pinch-to-zoom
      auto-resiz
      keyboard
      double-click-zoom
      class="bm-view"
      @ready="handler"
      @dragging="dragging"
      @zoomstart="zoomstart"
      @click="clickMap"
    >
      <bm-scale anchor="BMAP_ANCHOR_BOTTOM_LEFT"></bm-scale>

      <bml-marker-clusterer :averageCenter="true">
        <bm-marker
          v-for="item in allMarkerData"
          :key="item.id"
          :position="item.location"
          :title="item.name"
          :icon="{url: item.icon, size:{width: 32, height: 32}}"
          animation="BMAP_ANIMATION_DROP"
          @click="markerClick"
          :zIndex="markerZIndex"
          :top="markerTop"
          ref="marker"
        >
          <bm-label
            :content="item.name"
            :labelStyle="{color: item.color, fontSize : '14px', borderColor: item.color}"
            :offset="{height: -25}"
            @click="clickLabel"
          />
        </bm-marker>
      </bml-marker-clusterer>

      <div class="label-box" ref="labelBox" v-show="isShowLabelDeviceItem">
        <div
          class="label-item"
          v-for="(item, i) in repeatLabel"
          @click="selectRepeatLabel(item.value)"
          :key="i"
        >{{item.label}}</div>
      </div>

      <bm-info-window
        :width="700"
        :position="windowInfoPosition"
        :show="isShowWindowInfo"
        @open="windowInfoOpen"
        @close="windowInfoClose"
      >
        <div class="window-info">
          <div class="window-info-header">
            <div
              class="select-marker-device"
              v-if="repeatMarker.length > 1"
              @click="clickMarkerDevice"
            >{{$t('tip.pleaseSelectSite')}}</div>
            <div class="d" v-show="isShowDeviceItem">
              <div
                class="device-item"
                v-for="(item, i) in repeatMarker"
                @click="selectRepeatMarker(item.value)"
                :key="i"
              >{{item.label}}</div>
            </div>
            <div class="header-title">{{ windowInfoTitle === null ? null : windowInfoTitle}}</div>
            <div class="header-newTime">
              <span>{{$t('tip.newTime')}}</span>
              <span>{{ NewDeviceData === null ? null : NewDeviceData.body.length === 0 ? null : NewDeviceData.body[0].DateTime}}</span>
              <div class="code" @click="scanningDevice">
                <img src="../../../static/imgs/code.png" alt="code" width="16" height="16" />
              </div>
            </div>
            <div id="qrcode" class="qrcode" ref="qrcode"></div>
          </div>

          <div class="window-info-body">
            <div class="lngAndLat">
              <div class="body-item">
                <span>{{$t('tip.longitude')}}:</span>
                <span>{{ windowInfoPosition.lng === null ? null : windowInfoPosition.lng }}</span>
              </div>
              <div class="body-item">
                <span>{{$t('tip.dimension')}}</span>
                <span>{{ windowInfoPosition.lat === null ? null : windowInfoPosition.lat }}</span>
              </div>
            </div>

            <div class="new-body-item">
              <div
                class="body-item"
                v-for="(item, i) in NewDeviceData === null ? [] : NewDeviceData.body.length === 0 ? [] : NewDeviceData.header"
                :key="i"
              >
                <span>{{ item.name }}</span>
                <span>{{ NewDeviceData.body[0][item.key] }}{{ item.component }}</span>
              </div>
            </div>
            <div id="chart" :style="{ width: '700px', height: '240px'}" ref="chart"></div>
            <div class="hidden-chart"></div>
          </div>
          <Spin size="large" class="spin-show2" v-if="spinShow2"></Spin>
        </div>
      </bm-info-window>
    </baidu-map>

    <div class="right-top-box">
      <div class="cascader-box">
        <Cascader
          :data="initCascader"
          style="width: 200px;"
          v-model="cascaderDefault"
          :load-data="loadData"
          @on-change="changeCascader"
          :placeholder="$t('tip.pleaseSelectProvinceOrCity')"
          @on-visible-change="visibleCHangeCascader"
          :not-found-text="$t('tip.oneMomentPlease')"
          change-on-select
        ></Cascader>
      </div>
      <div class="cascader-input-box">
        <Input
          :placeholder="$t('tip.pleaseEnterTheSiteName')"
          style="width: 200px;"
          icon="ios-search"
          v-model="searchDevice"
          @on-enter="enterSearchDevice"
        />

        <div
          class="new-device-list"
          ref="newDeviceList"
          :style="{'max-height': deviceListHeight + 'px'}"
        >
          <div class="hidden-list" v-show="allMarkerData.length > 0" @click="hiddenList">
            <span>{{ isShowList ? $t('tip.close') : $t('tip.expand') }}</span>
          </div>
          <div class="device-list" v-show="isShowList">
            <Scroll :on-reach-bottom="reachBottom" height="500" :distance-to-edge="[5,5]">
              <Card class="device-item" v-for="(item, i) in allMarkerData" :key="i">
                <div @click="deviceItemDetails(item, i)" class="device-item-box">
                  <span class="device-item-name">{{item.name}}</span>
                  <span
                    class="device-item-statu"
                    :style="{background: item.color}"
                  >{{ setDeviceStatu(item.statu) }}</span>
                </div>
              </Card>
            </Scroll>
          </div>
        </div>
      </div>
      <div class="user-logo" @click="showUser">
        <Avatar
          icon="ios-person"
          size="large"
          style="background-color: #41B883"
          v-clickoutside="handleClose"
        />
        <div class="user-info" v-show="showUserInfo">
          <div class="arrow"></div>
          <div class="info-detail">
            <div class="real-name">
              <div>
                <span>{{ $t('header.realName') }} :</span>
                {{ realName === null ? null : realName }}
              </div>
              <div>
                <span>{{ $t('header.userAccount') }} :</span>
                {{ userAccout === null ? null : userAccout }}
              </div>
            </div>
            <div class="real-list-item">
              <div @click="modifyPassword">
                <span>{{ $t('header.changePassword') }}</span>
              </div>
            </div>
            <div class="exit">
              <span @click="signOut">{{ $t('header.signOut') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="map-logo">
      <img
        src="../../../static/imgs/logo32.png"
        alt="杭州启绿科技"
        width="38"
        height="38"
        style="vertical-align: -10px;"
      />
      <span class="logo-text">水质在线监测系统平台</span>
    </div>

    <div class="right-code">
      <a :href="qrcodeUri" target="_blank">
        <div class="baiduMap_qrcode" id="baiduMap_qrcode"></div>
      </a>
    </div>

    <Spin size="large" class="spin-Show" v-if="spinShow"></Spin>
  </div>
</template>

<script>
import { BmlMarkerClusterer } from "vue-baidu-map";
import QRCode from "qrcodejs2";
import { Base64 } from "js-base64";
let echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/bar");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/grid");

const clickoutside = {
  bind(el, binding, vnode) {
    function documentHandler(e) {
      if (el.contains(e.target)) {
        return false;
      }
      if (binding.expression) {
        binding.value(e);
      }
    }
    el.__vueClickOutside__ = documentHandler;
    document.addEventListener("click", documentHandler);
  },
  update() {},
  unbind(el, binding) {
    document.removeEventListener("click", el.__vueClickOutside__);
    delete el.__vueClickOutside__;
  }
};

export default {
  directives: { clickoutside },
  data() {
    return {
      qrcodeUri: this.$glb.appUri,
      modifyPwd: {
        oldPwd: "",
        newPwd: "",
        newPwd2: ""
      },
      isCascader: false,
      newData: [],
      isShowLabelDeviceItem: false,
      repeatLabel: [],
      spinShow2: false,
      isShowDeviceItem: false,
      isShowList: false,
      defaultMarker: null,
      repeatMarker: [],
      markerZIndex: 0,
      deviceListHeight: 580,
      spinShow: false,
      select: false,
      cloneAlldeviceData: [],
      searchDevice: "",
      markerTop: false,
      A: null,
      currentLocation: {
        province: null,
        city: null,
        area: null
      },
      provinceId: null,
      cityId: null,
      areaId: null,
      provinceData: [],
      cityData: [],
      areaData: [],
      DEVICENAME: "",
      MN: "",
      PROVINCEID: -2,
      CITYID: -2,
      AGREEMENTID: -2,
      PRODUCTID: -2,
      DISTRICTID: -2,
      PAGEINDEX: 1,
      PAGESIZE: 10,
      initCascader: [],
      cascaderDefault: [],
      realName: null,
      userAccout: null,
      showUserInfo: false,
      BMAP: null,
      MAP: null,
      center: { lng: 120.1709072625, lat: 30.1670866938 },
      autoLocationPoint: { lng: 0, lat: 0 },
      zoom: 15,
      allDevicesData: [],
      allDevicesStatusData: [],
      allMarkerData: [],
      allComponentData: null,
      NewMn: null,
      NewDeviceData: null,
      isShowWindowInfo: false,
      windowInfoTitle: null,
      windowInfoPosition: {
        lng: null,
        lat: null
      },
      QC: null,
      qrCodeContent: null,
      setInt: null
    };
  },
  components: {
    BmlMarkerClusterer
  },
  mounted() {
    let user = sessionStorage.getItem("userInfo");

    if (user === null) {
      this.$store.dispatch({
        type: "clearUserInfo"
      });
      sessionStorage.clear();
      this.$router.replace({ path: "/" });
    }

    this.qrcode2();
    this.spinShow = false;
    this.deviceListHeight = window.innerHeight - 100;
    this.getComponentData();
  },
  beforeDestroy() {
    if (this.setInt) {
      clearInterval(this.setInt);
    }
    this.modifyPwd = {
      oldPwd: "",
      newPwd: "",
      newPwd2: ""
    };
    this.isCascader = false;
    this.newData = [];
    this.isShowLabelDeviceItem = false;
    this.repeatLabel = [];
    this.spinShow2 = false;
    this.isShowDeviceItem = false;
    this.isShowList = false;
    this.defaultMarker = null;
    this.repeatMarker = [];
    this.markerZIndex = 0;
    this.deviceListHeight = 580;
    this.spinShow = false;
    this.select = false;
    this.cloneAlldeviceData = [];
    this.searchDevice = "";
    this.markerTop = false;
    this.A = null;
    this.currentLocation = {
      province: null,
      city: null,
      area: null
    };
    this.provinceId = null;
    this.cityId = null;
    this.areaId = null;
    this.provinceData = [];
    this.cityData = [];
    this.areaData = [];
    this.DEVICENAME = "";
    this.MN = "";
    this.PROVINCEID = -2;
    this.CITYID = -2;
    this.AGREEMENTID = -2;
    this.PRODUCTID = -2;
    this.DISTRICTID = -2;
    this.PAGEINDEX = 1;
    this.PAGESIZE = 10;
    this.initCascader = [];
    this.cascaderDefault = [];
    this.realName = null;
    this.userAccout = null;
    this.showUserInfo = false;
    this.BMAP = null;
    this.MAP = null;
    this.center = { lng: 120.1709072625, lat: 30.1670866938 };
    this.autoLocationPoint = { lng: 0, lat: 0 };
    this.zoom = 15;
    this.allDevicesData = [];
    this.allDevicesStatusData = [];
    this.allMarkerData = [];
    this.allComponentData = null;
    this.NewMn = null;
    this.NewDeviceData = null;
    this.isShowWindowInfo = false;
    this.windowInfoTitle = null;
    this.windowInfoPosition = {
      lng: null,
      lat: null
    };
    this.QC = null;
    this.qrCodeContent = null;
    this.setInt = null;
  },
  methods: {
    qrcode2() {
      new QRCode("baiduMap_qrcode", {
        width: 50,
        height: 50,
        text: this.$glb.appUri,
        correctLevel: 3,
        render: "table"
      });
    },
    handleClose(e) {
      this.showUserInfo = false;
    },
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
        this.$Message.warning(this.$t("tip.passwordMinimumSixDigits"));
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
    clickMap() {
      // this.s();
    },
    s() {
      this.$refs.labelBox.style.top = 0 + "px";
      this.$refs.labelBox.style.left = 0 + "px";
      this.isShowLabelDeviceItem = false;
    },
    zoomstart({ type, target }) {
      this.s();
      this.isShowWindowInfo = false;
      this.windowInfoTitle = null;
      this.windowInfoPosition = {
        lng: null,
        lat: null
      };
    },
    dragging({ type, target, pixel, point }) {
      this.s();
    },
    selectRepeatLabel(value) {
      this.s();
      this.qrCodeContent = null;
      this.$refs.qrcode.innerHTML = null;
      let allDevice = this.allDevicesData;

      for (let i = 0; i < allDevice.length; i++) {
        if (allDevice[i].mn === value) {
          this.windowInfoTitle = allDevice[i].name;
          let c = allDevice[i].location_point;
          let a = c.split(",");

          this.windowInfoPosition = {
            lng: parseFloat(a[0]),
            lat: parseFloat(a[1])
          };
        }
      }

      this.NewMn = value;
      this.getNewDeviceLastData();
    },
    clickLabel({ type, target, point, pixel }) {
      let c = `${target.point.lng},${target.point.lat}`,
        allDevice = this.allDevicesData;
      this.repeatLabel = [];
      this.repeatMarker = [];

      for (let i = 0; i < allDevice.length; i++) {
        let loc = allDevice[i].location_point;
        if (c === loc) {
          this.repeatLabel.push({
            label: allDevice[i].name,
            value: allDevice[i].mn
          });
          this.repeatMarker.push({
            label: allDevice[i].name,
            value: allDevice[i].mn
          });
        }
      }

      this.$refs.labelBox.style.top = pixel.y + "px";
      this.$refs.labelBox.style.left = pixel.x + "px";
      this.isShowLabelDeviceItem = true;
    },
    windowInfoOpen() {
      this.setInt = setInterval(() => {
        if (this.setInt != null) {
          clearInterval(this.setInt);
          this.setInt = null;
        }
        this.isShowWindowInfo = true;
      }, 100);
    },
    reachBottom() {
      return new Promise(resolve => {
        this.PAGEINDEX = this.PAGEINDEX + 1;
        this.getConditionDevicesData();

        resolve();
      });
    },
    clickMarkerDevice() {
      if (this.isShowDeviceItem) {
        this.isShowDeviceItem = false;
      } else {
        this.isShowDeviceItem = true;
      }
    },
    visibleCHangeCascader(val) {
      let c = this.initCascader;
      if (val) {
        if (c.length === 0) {
          this.getDeviceProvinceData();
        }
      }
    },
    selectRepeatMarker(value) {
      this.isShowDeviceItem = false;
      this.qrCodeContent = null;
      this.$refs.qrcode.innerHTML = null;
      let allDevice = this.allDevicesData;

      for (let i = 0; i < allDevice.length; i++) {
        if (allDevice[i].mn === value) {
          this.windowInfoTitle = allDevice[i].name;
          let c = allDevice[i].location_point;
          let a = c.split(",");

          this.windowInfoPosition = {
            lng: parseFloat(a[0]),
            lat: parseFloat(a[1])
          };
        }
      }

      this.NewMn = value;
      this.getNewDeviceLastData();
    },
    hiddenList() {
      if (this.isShowList) {
        this.deviceListHeight = 26;
        this.isShowList = false;
      } else {
        this.deviceListHeight = window.innerHeight - 100;
        this.isShowList = true;
      }
    },
    enterSearchDevice() {
      this.DEVICENAME = this.searchDevice;
      this.getConditionDevicesData();
    },
    handler({ BMap, map }) {
      this.BMAP = BMap;
      this.MAP = map;

      this.setRealName();
    },
    setRealName() {
      let store = this.$store.state;
      if (store.userInfo === null || store.userInfo === undefined) {
      } else {
        if (store.userInfo.obj === null) {
          this.realName = null;
          this.userAccout = null;
        } else {
          this.realName = store.userInfo.obj.real_name;
          this.userAccout = store.userInfo.obj.username;
          let token = store.userInfo.obj.access_token;
          let info = token.split(".");
          let baseInfo = JSON.parse(Base64.decode(info[1]));
          this.A = baseInfo.role_id;

          // 0:超级管理员   非0:管理员、普通用户等
          // if (baseInfo.role_id === 0) {
          //   this.spinShow = true;
          //   this.setSuperAdministrators();
          // } else {
          //   this.setAdministratorsAndUser();
          // }

          // 后期需求都是用超级管理、管理员、等所需的相关操作
          this.setAdministratorsAndUser();
        }
      }
    },
    setSuperAdministrators() {
      this.getProvinceData();
      this.getComponentData();
    },
    getSuperAdministratorsCurrentPosition() {
      let bmap = this.BMAP;
      let that = this;
      let geolocation = new bmap.Geolocation();
      geolocation.getCurrentPosition(
        function(r) {
          that.getAddress(r.point);
        },
        { enableHighAccuracy: true }
      );
    },
    setAdministratorsAndUser() {
      this.spinShow = true;
      this.getComponentData();
      this.getConditionDevicesData();
    },
    setBarSimple(data) {
      let h = data.header,
        b = data.body,
        getXName = [],
        sData = [];

      let c = this.$refs.chart;

      let chart = echarts.init(c);
      chart.setOption({
        grid: {
          top: "8%",
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          nameGap: 15,
          offset: 0,
          type: "category",
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            show: true,
            interval: 0,
            formatter: function(value) {
              var res = value;
              if (res.length > 7) {
                res = res.substring(0, 6) + "..";
              }
              return res;
            }
          }
        },
        yAxis: {
          type: "value"
        }
      });

      if (h.length === 0 && b.length === 0) {
        getXName = [];
        sData = [];

        chart.setOption({
          legend: {
            data: getXName
          },
          xAxis: {
            data: getXName
          },
          series: [
            {
              data: sData,
              barWidth: "30",
              type: "bar",
              itemStyle: {
                normal: {
                  color: function(d) {
                    return (
                      "#" +
                      Math.floor(
                        Math.random() * (256 * 256 * 256 - 1)
                      ).toString(16)
                    );
                  }
                }
              }
            }
          ]
        });
      } else {
        for (let i = 0; i < h.length; i++) {
          getXName.push(h[i].name);
          if (b.length != 0) {
            sData.push(b[0][h[i].key]);
          }
        }

        chart.setOption({
          legend: {
            data: getXName
          },
          xAxis: {
            data: getXName
          },
          series: [
            {
              data: sData,
              barWidth: "30",
              type: "bar",
              itemStyle: {
                normal: {
                  color: function(d) {
                    return (
                      "#" +
                      Math.floor(
                        Math.random() * (256 * 256 * 256 - 1)
                      ).toString(16)
                    );
                  }
                }
              },
              label: {
                normal: {
                  show: true,
                  position: "top",
                  textStyle: {
                    color: "black"
                  }
                }
              }
            }
          ]
        });
      }

      this.spinShow2 = false;
    },
    getAddress(pt) {
      let bmap = this.BMAP;
      let myGeo = new bmap.Geocoder();
      let that = this;

      myGeo.getLocation(pt, function(res) {
        let address = res.addressComponents;

        that.currentLocation = {
          province: null,
          city: null,
          area: null
        };

        that.currentLocation = {
          province: address.province,
          city: address.city,
          area: address.district
        };

        that.getDefaultDevice();
      });
    },
    deviceItemDetails(item, index) {
      this.markerTop = true;
      this.center = {
        lng: item.location.lng,
        lat: item.location.lat
      };
    },
    setDeviceStatu(k) {
      switch (k) {
        case 0:
          return "稍后";
          break;
        case 1:
          return "在线";
          break;
        case 2:
          return "报警";
          break;
        case 3:
          return "离线";
          break;
      }
    },
    async getDefaultDevice() {
      let province = this.provinceData,
        location = this.currentLocation,
        d = [];

      for (let i = 0; i < province.length; i++) {
        if (province[i].area_name === location.province) {
          this.provinceId = province[i].area_id;
          await this.getProvinceByCityData();
          break;
        }
      }

      let city = this.cityData;

      for (let j = 0; j < city.length; j++) {
        if (city[j].area_name === location.city) {
          this.cityId = city[j].area_id;
          await this.getCityByArea();
          break;
        }
      }

      let area = this.areaData;
      for (let k = 0; k < area.length; k++) {
        if (area[k].area_name === location.area) {
          this.areaId = area[k].area_id;
          break;
        }

        if (
          location.area === null ||
          location.area === "" ||
          location.area === undefined
        ) {
          this.areaId = area[0].area_id;
        }
      }

      d.push(this.provinceId);
      d.push(this.cityId);
      d.push(this.areaId);

      if (this.areaId != null) {
        this.cascaderDefault = [];
        this.cascaderDefault = d;

        this.PROVINCEID = this.provinceId;
        this.CITYID = this.cityId;
        this.DISTRICTID = this.areaId;

        this.getConditionDevicesData();
      }
    },
    changeCascader(val) {
      this.spinShow = true;

      if (val.length === 1) {
        this.PROVINCEID = val[0];
      } else if (val.length === 2) {
        this.PROVINCEID = val[0];
        this.CITYID = val[1];
      }

      this.isCascader = true;
      this.PAGEINDEX = 1;
      this.PAGESIZE = 10;
      this.getConditionDevicesData();
    },
    getConditionDevicesData() {
      let data = {
        device_name: this.DEVICENAME,
        mn: this.MN,
        province_id: this.PROVINCEID,
        city_id: this.CITYID,
        district_id: this.DISTRICTID,
        agreement_id: this.AGREEMENTID,
        product_id: this.PRODUCTID,
        page_index: this.PAGEINDEX,
        page_size: this.PAGESIZE
      };

      let ids = [],
        list = null;

      this.$api.monitor1
        .getConditionDevice(data)
        .then(res => {
          if (res.data.code === 0) {
            list = res.data.data.data_info;
            if (this.isCascader) {
              this.allDevicesData = list;
            } else {
              this.allDevicesData = this.allDevicesData.concat(list);
            }

            if (list.length > 0) {
              this.setMarkerData();

              for (let i = 0; i < list.length; i++) {
                ids.push(list[i].id);
              }

              if (ids.length > 0) {
                this.getAllDevicesStatu(ids);
              }
            } else {
              this.spinShow = false;
              this.$Message.warning(this.$t("tip.noEquipment"));
            }
          }
          this.spinShow = false;
        })
        .catch(error => {
          this.spinShow = false;
          this.allMarkerData = [];
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    async loadData(item, callback) {
      // if (this.A === 0) {
      //   if (item.type === "PROVINCE") {
      //     item.loading = true;

      //     this.provinceId = item.area_id;
      //     await this.getProvinceByCityData();

      //     // 城市列表
      //     let cityData = this.cityData;

      //     if (cityData.length === 0) {
      //       this.$Message.warning(this.$t('tip.noCity'));
      //       return;
      //     } else {
      //       if (item.value === this.provinceId) {
      //         for (let i = 0; i < cityData.length; i++) {
      //           cityData[i].label = cityData[i].area_name;
      //           cityData[i].value = cityData[i].area_id;
      //           cityData[i].children = [];
      //           cityData[i].type = "CITY";
      //           cityData[i].loading = false;

      //           item.children.push(cityData[i]);
      //         }
      //       }

      //       item.loading = false;
      //       callback();
      //     }
      //   } else if (item.type === "CITY") {
      //     item.loading = true;

      //     this.cityId = item.area_id;
      //     await this.getCityByArea();

      //     // 区域列表
      //     let area = this.areaData;

      //     if (area.length === 0) {
      //       this.$Message.warning(this.$t('tip.noArea'));
      //       return;
      //     } else {
      //       if (item.value === this.cityId) {
      //         for (let i = 0; i < area.length; i++) {
      //           area[i].label = area[i].area_name;
      //           area[i].value = area[i].area_id;

      //           item.children.push(area[i]);
      //         }
      //       }

      //       item.loading = false;
      //       callback();
      //     }
      //   }
      // } else {
      if (item.type === "PROVINCE") {
        item.loading = true;

        this.provinceId = item.area_id;
        await this.getProvinceByCityData();

        // 城市列表
        let cityData = this.cityData;

        if (cityData.length === 0) {
          this.$Message.warning(this.$t("tip.noCity"));
          return;
        } else {
          // 0 和 非0 下的市名称字段不同
          let c = null;
          // if (this.A === 0) {
          //   c = "area_name";
          // } else {
          //   c = "city_center";
          // }

          c = "city_center";

          if (item.value === this.provinceId) {
            for (let i = 0; i < cityData.length; i++) {
              cityData[i].label = cityData[i][c];
              cityData[i].value = cityData[i].area_id;

              item.children.push(cityData[i]);
            }
          }

          item.loading = false;
          callback();
        }
      }
      // }
    },
    async getCityByArea() {
      let data = {
        city_id: this.cityId
      };

      await this.$api.monitor1
        .getByCityData(data)
        .then(res => {
          if (res.data.code === 0) {
            this.areaData = res.data.data;
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    async getProvinceByCityData() {
      // if (this.A === 0) {
      //   let data = {
      //     province_id: this.provinceId
      //   };
      //   await this.$api.monitor1
      //     .getByProvinceData(data)
      //     .then(res => {
      //       if (res.data.code === 0) {
      //         this.cityData = res.data.data;
      //       }
      //     })
      //     .catch(error => {
      //       this.$Message.error("请求错误");
      //     });
      // } else {
      let data = {
        province: this.provinceId
      };

      await this.$api.monitor1
        .getCityData(data)
        .then(res => {
          if (res.data.code === 0) {
            this.cityData = res.data.data;
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
      // }
    },
    getProvinceData() {
      this.$api.monitor1
        .getProvinceData()
        .then(res => {
          if (res.data.code === 0) {
            this.initCascader = [];
            this.provinceData = [];
            let list = res.data.data;
            this.initCascader = list;
            this.provinceData = list;

            if (list.length === 0) {
              this.$Message.warning(this.$t("tip.noInfo"));
              return;
            } else {
              for (let i = 0; i < list.length; i++) {
                this.initCascader[i].label = list[i].area_name;
                this.initCascader[i].value = list[i].area_id;
                this.initCascader[i].children = [];
                this.initCascader[i].type = "PROVINCE";
                this.initCascader[i].loading = false;
              }

              this.getSuperAdministratorsCurrentPosition();
            }
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    showUser() {
      if (this.showUserInfo) {
        this.showUserInfo = false;
      } else {
        this.showUserInfo = true;
      }
    },
    signOut() {
      this.$store.dispatch({
        type: "clearUserInfo"
      });
      sessionStorage.clear();
      this.$router.push({ name: "login" });
    },
    scanningDevice() {
      let data = {
        mn: this.NewMn
      };

      if (this.qrCodeContent === null) {
        this.$api.monitor1
          .getDevicesCode(data)
          .then(res => {
            if (res.data.code === 0) {
              this.qrCodeContent = res.data.data.device_code;

              this.qrcode();
            }
          })
          .catch(error => {
            this.$Message.error(this.$t("tip.requestError"));
          });
      } else {
        this.qrCodeContent = null;
        this.$refs.qrcode.innerHTML = null;
      }
    },
    windowInfoClose() {
      this.isShowWindowInfo = false;
      this.windowInfoTitle = null;
      this.windowInfoPosition = {
        lng: null,
        lat: null
      };
    },
    markerClick({ type, target }) {
      this.s();
      let currentDevice = target.z.title,
        allDevice = this.allDevicesData,
        cLng = target.z.point.lng,
        cLat = target.z.point.lat,
        c = `${cLng},${cLat}`;
      this.windowInfoTitle = null;
      this.windowInfoPosition = {
        lng: null,
        lat: null
      };
      this.repeatMarker = [];

      for (let i = 0; i < allDevice.length; i++) {
        let loc = allDevice[i].location_point;

        if (c === loc) {
          this.repeatMarker.push({
            label: allDevice[i].name,
            value: allDevice[i].mn
          });
        }

        if (currentDevice === allDevice[i].name) {
          this.windowInfoTitle = target.z.title;

          this.windowInfoPosition = {
            lng: target.point.lng,
            lat: target.point.lat
          };

          this.NewMn = allDevice[i].mn;

          this.getNewDeviceLastData();
          break;
        }
      }
    },
    getComponentData() {
      let data = {
        page_index: 1,
        page_size: 100
      };

      this.$api.monitor1
        .getComponentData(data)
        .then(res => {
          if (res.data.code === 0) {
            this.allComponentData = res.data.data.data_info;
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    getNewDeviceLastData() {
      this.windowInfoOpen();
      this.spinShow2 = true;
      this.isShowDeviceItem = false;
      let data = {
        mn: this.NewMn
      };

      this.$api.monitor1
        .getNewOneRealTimeData(data)
        .then(res => {
          if (res.data.code === 0) {
            this.NewDeviceData = null;
            let d = res.data.data;
            this.NewDeviceData = d;

            let h = this.NewDeviceData.header,
              components = this.allComponentData;

            if (h.length > 0) {
              for (let i = 0; i < h.length; i++) {
                if (components.length > 0) {
                  for (let j = 0; j < components.length; j++) {
                    if (h[i].key === components[j].key) {
                      let val = components[j].unit;

                      h[i].component = val;
                    }
                  }
                }
              }
            }
            this.setBarSimple(this.NewDeviceData);
            this.spinShow2 = false;
          }
        })
        .catch(error => {
          this.spinShow2 = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    getAllDevicesData() {
      let data = {
        page_index: 1,
        page_size: 200
      };

      let ids = [],
        list = null;

      this.$api.monitor1
        .getAllDevicesList(data)
        .then(res => {
          if (res.data.code === 0) {
            this.initCascader = [];
            this.provinceData = [];
            this.cityData = [];
            this.areaData = [];
            list = res.data.data.data_info;
            this.allDevicesData = res.data.data.data_info;

            this.spinShow = false;

            if (list.length > 0) {
              this.setMarkerData();

              for (let i = 0; i < list.length; i++) {
                ids.push(list[i].id);
              }

              if (ids.length > 0) {
                this.getAllDevicesStatu(ids);
              }
            } else {
              this.spinShow = false;
              this.$Message.warning(this.$t("tip.noEquipment"));
            }
          }
        })
        .catch(error => {
          this.spinShow = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    getAllDevicesStatu(data) {
      let param = {
        device_ids: data
      };
      this.$api.monitor1
        .getDeviceStatus(param)
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data;
            this.allDevicesStatusData = this.allDevicesStatusData.concat(list);

            this.setMarkerStatusData();
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    setMarkerData() {
      let devices = this.allDevicesData,
        markerData = [],
        redUrl = require("../../../static/imgs/red.png"),
        greenUrl = require("../../../static/imgs/green.png"),
        yellowUrl = require("../../../static/imgs/yellow.png");
      if (this.isCascader) {
        this.allMarkerData = [];
      }

      if (this.A === 0) {
      } else {
        let lng = null,
          lat = null,
          point = devices[0].location_point,
          si = point.indexOf(",");
        lng = parseFloat(point.substr(0, si));
        lat = parseFloat(point.substr(si + 1));

        this.center = { lng: lng, lat: lat };
      }

      for (let i = 0; i < devices.length; i++) {
        let lon = null,
          lat = null,
          iconUrl = greenUrl,
          color = "#00CC00";

        let location_point = devices[i].location_point,
          splitIndex = location_point.indexOf(",");
        lon = parseFloat(location_point.substr(0, splitIndex));
        lat = parseFloat(location_point.substr(splitIndex + 1));

        markerData.push({
          id: devices[i].id,
          name: devices[i].name,
          statu: 0,
          icon: iconUrl,
          color: color,
          location: {
            lng: lon,
            lat: lat
          }
        });
      }

      this.isCascader = false;
      this.spinShow = false;
      this.allMarkerData = markerData;
    },
    setMarkerStatusData() {
      let devicesStatus = this.allDevicesStatusData,
        allMarkerData = this.allMarkerData,
        redUrl = require("../../../static/imgs/red.png"),
        greenUrl = require("../../../static/imgs/green.png"),
        yellowUrl = require("../../../static/imgs/yellow.png");

      for (let i = 0; i < allMarkerData.length; i++) {
        for (let j = 0; j < devicesStatus.length; j++) {
          if (allMarkerData[i].id === devicesStatus[j].device_id) {
            let iconUrl = null,
              color = null;

            if (devicesStatus[j].device_status === 1) {
              iconUrl = greenUrl;
              color = "#00CC00";
            } else if (devicesStatus[j].device_status === 2) {
              iconUrl = yellowUrl;
              color = "#FFFF00";
            } else {
              iconUrl = redUrl;
              color = "#FF0000";
            }

            this.allMarkerData[i].statu = devicesStatus[j].device_status;
            this.allMarkerData[i].color = color;
            this.allMarkerData[i].icon = iconUrl;
          }
        }
      }

      this.allMarkerData = this.allMarkerData.sort(
        this.sortMarkerData("statu")
      );

      this.isCascader = false;
    },
    sortMarkerData(prop) {
      return function(obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (val1 < val2) {
          return -1;
        } else if (val1 > val2) {
          return 1;
        } else {
          return 0;
        }
      };
    },
    qrcode() {
      this.QC = new QRCode("qrcode", {
        width: 100,
        height: 100,
        text: this.qrCodeContent,
        render: "canvas",
        background: "#f0f",
        foreground: "#ff0"
      });
    },
    getDeviceProvinceData() {
      this.spinShow = true;
      this.$api.monitor1
        .getDevicesProvinceData()
        .then(res => {
          if (res.data.code === 0) {
            this.initCascader = [];
            this.provinceData = [];
            let list = res.data.data;
            this.initCascader = list;
            this.provinceData = list;

            if (list.length === 0) {
              this.$Message.warning(this.$t("tip.noInfo"));
              return;
            } else {
              for (let i = 0; i < list.length; i++) {
                this.initCascader[i].label = list[i].province;
                this.initCascader[i].value = list[i].area_id;
                this.initCascader[i].children = [];
                this.initCascader[i].type = "PROVINCE";
                this.initCascader[i].loading = false;
              }
            }
          }
          this.spinShow = false;
        })
        .catch(error => {
          this.spinShow = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    }
  }
};
</script>

<style lang="less" scoped>
.map-logo {
  position: fixed;
  top: 15px;
  left: 15px;
  padding: 5px 10px;
  cursor: pointer;

  .logo-text {
    font-size: 20px;
    font-weight: 600;
    color: black;
  }
}

.map-box {
  width: 100%;
  height: 100%;
  background-color: white;
  position: relative;
  z-index: 100;
}

.bm-view {
  width: 100%;
  height: 100%;
}

.window-info {
  padding: 5px;
  font-size: 12px;
  color: #333;
  position: relative;

  .window-info-header {
    position: relative;
    padding-top: 0;
    padding-bottom: 10px;

    .select-marker-device {
      width: 200px;
      height: 25px;
      line-height: 25px;
      position: relative;
      color: #4bd497;
      cursor: pointer;

      &:hover {
        color: #41b883;
      }
    }

    .d {
      width: 200px;
      height: 130px;
      position: absolute;
      top: 25px;
      overflow: auto;
      margin: 5px 0;
      padding: 5px 0;
      background-color: #fff;
      box-sizing: border-box;
      border-radius: 4px;
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);

      .device-item {
        padding: 5px 15px;
        background-color: white;
        cursor: pointer;

        &:hover {
          background-color: #eee;
          cursor: pointer;
        }
      }
    }

    .header-title {
      font-size: 16px;
      font-weight: 500;
      color: black;
    }

    .header-newTime {
      .code {
        float: right;
        cursor: pointer;
      }
    }

    .qrcode {
      padding: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .window-info-body {
    border-top: 1px solid #e8eaec;
    padding-top: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;

    .lngAndLat {
      width: 100%;
      padding: 2px;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .body-item {
        padding: 5px;
        padding-right: 10px;
      }
    }

    .new-body-item {
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      overflow: auth;

      .body-item {
        min-width: 60px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        
        span {
          padding: 4px;
        }
      }
    }
  }
}

.right-top-box {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 500;
  padding: 5px;
  display: flex;
  align-items: center;

  .user-logo {
    z-index: 1000;
    cursor: pointer;

    .user-info {
      position: absolute;
      right: 0;
      display: block;
      width: 230px;

      .arrow {
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 7px 8px;
        border-color: transparent transparent #41b883;
        top: 10px;
        right: 17px;
        position: absolute;
      }

      .info-detail {
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

          div {
            padding: 4px 10px;
            font-size: 14px;
            color: white;
          }
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

        .exit {
          width: 100%;
          position: relative;
          padding: 2px 10px;
          background-color: white;
          color: #999;
          text-align: right;
        }
      }
    }
  }

  .cascader-box {
    margin: 0 10px;
  }

  .cascader-input-box {
    margin: 0 10px;
    position: relative;

    .new-device-list {
      z-index: -1;
      position: absolute;
      top: 50px;
      width: 100%;
      overflow-y: scroll;
      transition: height 1s;
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE 10+ */
      transition: all 0.5s ease;
      background-color: white;

      &::-webkit-scrollbar {
        width: 0 !important;
      }
      .hidden-list {
        position: fixed;
        width: 200px;
        height: 26px;
        z-index: 100;
        cursor: pointer;
        padding: 4px 0;
        text-align: center;
        background-color: #f7f7f7;
        color: #41d895;
        transition: 0.25s linear;

        &:hover {
          background-color: #41d895;
          color: #fff;
        }
      }

      .device-list {
        margin-top: 30px;
        width: 100%;
        height: 100%;
        border-radius: 2px;
        background-color: white;
        transition: height 0.5s linear;

        .device-item {
          margin: 10px 2px;

          .device-item-box {
            width: 100%;
            height: 100%;
            cursor: pointer;

            .device-item-name {
              width: 105px;
              display: inline-block;
              overflow: hidden; //超出的文本隐藏
              text-overflow: ellipsis; //溢出用省略号显示
              white-space: nowrap; //溢出不换行
            }

            .device-item-statu {
              float: right;
              padding: 0 5px;
              color: white;
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}

.spin-Show {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%); /* IE9及以上支持 */
  -webkit-transform: translate(-50%, -50%); /* Safari and Chrome */
  -o-transform: translate(-50%, -50%); /* Opera */
  -moz-transform: translate(-50%, -50%); /* Firefox */
}

.spin-show2 {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%); /* IE9及以上支持 */
  -webkit-transform: translate(-50%, -50%); /* Safari and Chrome */
  -o-transform: translate(-50%, -50%); /* Opera */
  -moz-transform: translate(-50%, -50%); /* Firefox */
}

.hidden-chart {
  width: 700px;
  height: 250px;
  background-color: rgba(0, 0, 0, 0);
  z-index: 10000;
  position: absolute;
  top: 170px;
  left: 0;
}

#chart {
  z-index: 500;
}

.repeat-marker {
  padding: 5px;
  border: 1px solid #ccc;
  background-color: white;
}

.label-box {
  position: fixed;
  margin: 5px 0;
  padding: 5px 0;
  background-color: #fff;
  box-sizing: border-box;
  border-radius: 4px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);

  .label-item {
    padding: 5px 15px;
    background-color: white;
    cursor: pointer;

    &:hover {
      background-color: #eee;
      cursor: pointer;
    }
  }
}

.right-code {
  position: fixed;
  right: 15px;
  bottom: 15px;

  .baiduMap_qrcode {
    width: 50px;
    height: 50px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      margin-bottom: 50px;
      margin-right: 50px;
      transform: scale(3);
      box-shadow: 0 0 10px rgba(21, 21, 21, 0.2);
    }
  }
}
</style>