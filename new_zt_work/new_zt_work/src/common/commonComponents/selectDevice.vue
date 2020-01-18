<!-- 公用设备下拉选择框 -->

<template>
  <div class="selectDevice-box">
    <Input
      v-model="sName"
      :icon="icon"
      :placeholder="$t('tip.pleaseSelectSite')"
      class="selectInput"
      search
      @on-focus="inputFocus"
      @on-search="inputSearch"
      v-clickoutside="handleClose"
      @on-click="clickIcon"
    />

    <Scroll
      ref="scroll"
      :on-reach-top="handleReachTop"
      :on-reach-bottom="handleReachBottom"
      height="200"
      v-show="isShow"
      :class="{'scroll': true, 'animated fade fadeIn': isShow, 'animated fade fadeOut': !isShow}"
      :distance-to-edge="[5, 5]"
      v-if="$route.name === 'virtualData'"
    >
      <div
        v-for="(item, index) in deviceData"
        :key="index"
        class="route-scroll-item"
        @click="selectItem(item.name, item.mn, item.id, item.product_id, item.fakedata_status)"
      >
        <span>{{ item.name }}</span>
        <span
          :style="{float:'right',color: item.fakedata_status === 0 ? '#ccc' : '#41b883' }"
        >{{ item.fakedata_status === 0 ? $t('tip.closed') : $t('tip.opened') }}</span>
      </div>
    </Scroll>

    <Scroll
      v-else
      ref="scroll"
      :on-reach-top="handleReachTop"
      :on-reach-bottom="handleReachBottom"
      height="200"
      v-show="isShow"
      :class="{'scroll': true, 'animated fade fadeIn': isShow, 'animated fade fadeOut': !isShow}"
      :distance-to-edge="[5, 5]"
    >
      <div class="device-count">
        <span>
          {{ $t('tip.currentDisplay') }}
          <b>{{ PAGESIZE >= PAGECOUNT ? PAGECOUNT : PAGESIZE }}</b>
          {{ $t('tip.number') }}
        </span>
        <span>
          {{ $t('tip.inTotal') }}
          <b>{{ PAGECOUNT }}</b>
          {{ $t('tip.number') }}
        </span>
      </div>
      <div
        v-for="(item, index) in deviceData"
        :key="index"
        :class="{'scroll-item': true, 'first-child': index === 0}"
        @click="selectItem(item.name, item.mn, item.id, item.product_id, item.fakedata_status)"
      >
        <p>{{ item.name }}</p>
        <p>{{ item.province_name }}{{ item.city_name }}{{ item.district_name }}</p>
      </div>
    </Scroll>
  </div>
</template>

<script>
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
  data() {
    return {
      setColor: "#ccc",
      sName: null,
      isShow: false,
      deviceData: [],
      icon: "ios-arrow-down",
      DEVICENAME: "",
      MN: "",
      PROVINCEID: -2,
      CITYID: -2,
      DISTRICTID: -2,
      AGREEMENTID: -2,
      PRODUCTID: -2,
      PAGEINDEX: 1,
      PAGESIZE: 10,
      PAGECOUNT: 0
    };
  },
  directives: { clickoutside },
  mounted() {
    this.isShow = false;
    this.icon = "ios-arrow-down";
    this.getDeviceData();
  },
  beforeDestroy() {
    this.setColor = "#ccc";
    this.sName = null;
    this.isShow = false;
    this.deviceData = [];
    this.icon = "ios-arrow-down";
    this.DEVICENAME = "";
    this.MN = "";
    this.PROVINCEID = -2;
    this.CITYID = -2;
    this.DISTRICTID = -2;
    this.AGREEMENTID = -2;
    this.PRODUCTID = -2;
    this.PAGEINDEX = 1;
    this.PAGESIZE = 10;
    this.PAGECOUNT = 0;
  },
  methods: {
    // 输入框 图标 事件
    clickIcon() {
      if (this.isShow) {
        this.isShow = false;
        this.icon = "ios-arrow-down";
      } else {
        this.isShow = true;
        this.icon = "ios-arrow-up";
      }
    },
    // 关闭
    handleClose(e) {
      this.isShow = false;
      this.icon = "ios-arrow-down";
    },
    // 模糊查询
    inputSearch(value) {
      console.log(value);
      this.DEVICENAME = value;
      this.getDeviceData();
    },
    // 选择设备
    selectItem(name, mn, id, product_id, fakedata_status) {
      console.log(name, mn, id, product_id);
      this.sName = name;
      let d = {
        mn: mn,
        name: name,
        id: id,
        product_id: product_id,
        fakedata_status: fakedata_status
      };
      this.$emit("changeMn", d);
      this.icon = "ios-arrow-down";
      this.isShow = false;
    },
    // 输入框获取焦点触发
    inputFocus() {
      if (this.isShow) {
        this.isShow = false;
        this.icon = "ios-arrow-down";
      } else {
        this.isShow = true;
        this.icon = "ios-arrow-up";
      }
    },
    // 顶部触发
    handleReachTop() {
      return new Promise(resolve => {
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

        this.$api.monitor1
          .getConditionDevice(data)
          .then(res => {
            if (res.data.code === 0) {
              this.deviceData = [];
              let list = res.data.data.data_info;
              this.PAGECOUNT = res.data.data.page_count;

              this.deviceData = list;
            }
          })
          .catch(error => {
            console.log(error);
            this.$Message.error(this.$t("tip.requestError"));
          });
        resolve();
      });
    },
    // 无限滚动，底部触发
    handleReachBottom() {
      return new Promise(resolve => {
        this.PAGESIZE = this.PAGESIZE + 10;
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

        this.$api.monitor1
          .getConditionDevice(data)
          .then(res => {
            if (res.data.code === 0) {
              this.deviceData = [];
              let list = res.data.data.data_info;
              this.PAGECOUNT = res.data.data.page_count;

              this.deviceData = list;
            }
          })
          .catch(error => {
            console.log(error);
            this.$Message.error(this.$t("tip.requestError"));
          });
        resolve();
      });
    },
    // 获取设备
    getDeviceData() {
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

      this.$api.monitor1
        .getConditionDevice(data)
        .then(res => {
          if (res.data.code === 0) {
            this.deviceData = [];
            let list = res.data.data.data_info;
            this.PAGECOUNT = res.data.data.page_count;

            let d = {
              mn: list[0].mn,
              name: list[0].name,
              id: list[0].id,
              product_id: list[0].product_id,
              fakedata_status: list[0].fakedata_status
            };
            this.$emit("initMn", d);
            let route = this.$route;
            if (
              route.name === "hardDiskDrive" ||
              route.name === "videoList" ||
              route.name === "realTimeMonitoring"
            ) {
            } else {
              this.sName = list[0].name;
            }

            this.deviceData = list;
          }
        })
        .catch(error => {
          console.log(error);
          this.$Message.error(this.$t("tip.requestError"));
        });
    }
  }
};
</script>

<style lang="less" scoped>
.selectDevice-box {
  display: inline-block;
  width: 230px;
  margin-right: 10px;
  position: relative;

  .selectInput {
    width: 230px;
    margin-right: 10px;
    cursor: pointer;

    &:hover {
      cursor: pointer;
    }
  }

  .scroll {
    position: absolute;
    top: 35px;
    width: 230px;
    z-index: 200;
    padding: 5px 0;
    background-color: #fff;
    box-sizing: border-box;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    position: absolute;

    .route-scroll-item {
      cursor: pointer;
      padding: 5px 15px;
      background-color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &:hover {
        cursor: pointer;
        background-color: #eee;
      }
    }

    .device-count {
      position: absolute;
      top: 0;
      left: 0;
      right: 18px;
      padding: 5px 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: white;

      span {
        font-size: 12px;
        color: #bbbbbb;

        b {
          font-size: 10px;
          color: #67c69c;
        }
      }
    }

    .scroll-item {
      padding: 5px 10px;
      background-color: white;
      cursor: pointer;

      &:hover {
        background-color: #eee;
        cursor: pointer;
      }

      p {
        text-align: left;
      }

      p:first-child {
        font-size: 14px;
        color: #515a6e;
      }

      p:last-child {
        font-size: 10px;
        color: #bbbbbb;
      }
    }
  }
}

.first-child {
  margin-top: 10px;
}
</style>