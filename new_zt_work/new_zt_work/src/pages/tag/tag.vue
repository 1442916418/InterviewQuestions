<!-- 历史记录标签 -->

<template>
  <div class="tag-box" v-show="historicalData.length > 0">
    <Button icon="ios-arrow-back" class="btn-left" @click="buttonLeft"></Button>
    <div class="inner-frame" ref="tag">
      <Tag
        class="tag"
        v-for="(item, index) in historicalData"
        :key="index"
        type="dot"
        :closable="item.name === 'baiduMap' ? false : true"
        :color="item.state ? 'success' : ''"
        :name="item.name"
        @on-close="handleClose(item)"
      >
        <router-link
          class="link"
          :to="item.path"
          @click.native="handleClick(item)"
        >{{ item.meta.name }}</router-link>
      </Tag>
    </div>
    <Button icon="ios-arrow-forward" class="btn-right" @click="buttonRight"></Button>
    <Poptip trigger="hover" class="right-poptip" placement="bottom-end">
      <Button icon="ios-close-circle-outline" class="btn-right-close"></Button>
      <div class="poptip-content" slot="content">
        <Button type="text" style="margin: 5px;" @click="closeAllTag">{{$t('tip.closeAll')}}</Button>
        <Button type="text" style="margin: 5px;" @click="claseOtherTag">{{$t('tip.closeOther')}}</Button>
      </div>
    </Poptip>
  </div>
</template>

<script>
import zh from "../../plugin/language/zh.js";
import en from "../../plugin/language/en.js";

export default {
  data() {
    return {
      color: "",
      historicalData: []
    };
  },
  created() {
    this.switchLanguage();
  },
  watch: {
    $route: {
      handler(to, from) {
        let currentName = to.name;
        let arr = null;
        let routerInfo = JSON.parse(sessionStorage.getItem("routerInfo"));
        let currentIndex = 0;

        if (routerInfo === null) {
          return [];
        }

        arr = routerInfo;

        let newArr = [];
        let n = {};
        for (let i = 0; i < arr.length; i++) {
          if (!n[arr[i].path]) {
            newArr.push(arr[i]);
            n[arr[i].path] = 1;
          } else {
            n[arr[i].path]++;
          }
        }

        for (let j = 0; j < newArr.length; j++) {
          newArr[j].state = false;
        }

        if (newArr.length === 0) {
        } else {
          for (let i = 0; i < newArr.length; i++) {
            let name = newArr[i].name;
            if (currentName === name) {
              newArr[i].state = true;
              currentIndex = i;
            } else {
              newArr[i].state = false;
            }

            if (name === "" || name === null || null === undefined) {
              newArr.splice(i, 1);
            }
          }
        }
        this.historicalData = newArr;
      },
      deep: true
    }
  },
  methods: {
    distinct(array) {
      let obj = {};
      return array.filter(function(item, index, array) {
        return obj.hasOwnProperty(typeof item + item)
          ? false
          : (obj[typeof item + item] = true);
      });
    },
    switchLanguage() {
      let locale = this.$i18n.locale;
      let routerInfo = JSON.parse(sessionStorage.getItem("routerInfo"));
      let cloneHis = JSON.parse(JSON.stringify(routerInfo));
      let zhSid = zh.leftSidebar;
      let enSid = en.leftSidebar;

      if (routerInfo === null) {
        return [];
      }

      if (locale === "zh") {
        for (let i = 0; i < routerInfo.length; i++) {
          for (let key in enSid) {
            if (routerInfo[i].meta.name === enSid[key]) {
              this.$set(cloneHis[i].meta, "name", zhSid[key]);
            }
          }
        }
      } else {
        for (let i = 0; i < routerInfo.length; i++) {
          for (let key in zhSid) {
            if (routerInfo[i].meta.name === zhSid[key]) {
              this.$set(cloneHis[i].meta, "name", enSid[key]);
            }
          }
        }
      }

      sessionStorage.setItem("routerInfo", JSON.stringify(cloneHis));
    },
    claseOtherTag() {
      let currentName = this.$route.name;
      let his = this.historicalData;
      let cloneHis = JSON.parse(JSON.stringify(his));
      let len = his.length;

      for (let i = len - 1; i > 0; i--) {
        if (his[i].name === currentName && his[i].state) {
        } else {
          if (his[i].name === "baiduMap") {
          } else {
            cloneHis.splice(i, 1);
          }
        }
      }
      this.historicalData = cloneHis;
      sessionStorage.setItem("routerInfo", JSON.stringify(cloneHis));
    },
    closeAllTag() {
      sessionStorage.removeItem("routerInfo");
      this.$router.push({ name: "baiduMap" });
    },
    buttonLeft() {
      this.$refs.tag.scrollLeft -= "100";
    },
    buttonRight() {
      this.$refs.tag.scrollLeft += "100";
    },
    handleClick(item) {
      // console.log(this.historicalData, " <------------- ", item);
    },
    handleClose(item) {
      let his = this.historicalData,
        ind = null;

      for (let i = 0; i < his.length; i++) {
        if (his[i].name === item.name) {
          ind = i;
        }
      }

      his.splice(ind, 1);
      this.historicalData = his;
      if (item.state) {
        let path = his[his.length - 1].path;
        this.$router.replace({
          path: path
        });
      }
      sessionStorage.setItem("routerInfo", JSON.stringify(his));
    }
  }
};
</script>

<style lang="less" scoped>
.tag-box {
  height: 50px;
  margin: 0 115px 0 70px;
  padding: 10px 0px 0;
  white-space: nowrap;
  position: relative;

  .inner-frame {
    width: 100%;
    overflow: hidden;
    position: absolute;
    left: 0;
    // overflow-x: scroll;
    // overflow-y: hidden;
    // scrollbar-width: none; /* Firefox */
    // -ms-overflow-style: none; /* IE 10+ */
    white-space: nowrap;

    // 滚动条整体部分，可以设置宽度等
    &::-webkit-scrollbar {
      display: none;
      width: 100%;
      height: 10px;
      background-color: #eeeeee;
      border-radius: 5px;
    }

    // 滚动条两端的按钮
    &::-webkit-scrollbar-button {
      width: 10px;
      background-color: #aaa;
    }

    // 滚动的滑块
    &::-webkit-scrollbar-thumb {
      width: 10px;
      background-color: #dddddd;
    }

    .link {
      color: black;
    }
  }

  .btn-left {
    position: absolute;
    top: 12px;
    left: -50px;
  }

  .right-poptip {
    position: absolute;
    top: 12px;
    right: -95px;

    .poptip-content {
      display: flex;
      flex-direction: column;
    }
  }

  .btn-right {
    position: absolute;
    top: 12px;
    right: -50px;
  }
}
</style>