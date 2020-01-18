<!-- 侧边栏 -->

<template>
  <div class="leftsider-box">
    <div class="menu-box" ref="leftSiderMenu">
      <Menu
        ref="menu"
        width="100"
        height="100"
        style="width: 100%;height: 100%;"
        accordion
        :theme="theme3"
        :open-names="openMenuName"
      >
        <Submenu v-for="(item, i) in menuList" :name="item.oneName" :key="i">
          <template slot="title">
            <div style="display:flex;align-items: center;">
              <Icon :type="item.oneIcon" size="22" />
              <p style="padding-left:10px;">{{item.oneMenuName}}</p>
            </div>
          </template>
          <MenuItem
            v-for="(k, j) in item.oneChildren"
            :name="k.twoName"
            :to="k.twoMenuUrl"
            :key="j"
          >{{k.twoMenuName}}</MenuItem>
        </Submenu>
      </Menu>
    </div>

    <div class="shrink-left-menu" v-show="isShowShrinkLeftMenu">
      <div class="shrink-menu">
        <div class="shrink-menu-item" v-for="(item, i) in menuList" :key="i">
          <Poptip trigger="hover" placement="right-start">
            <div class="poptip-title">
              <Icon :type="item.oneIcon" size="20" />
              <span style="font-size:10px;">{{item.oneMenuName}}</span>
            </div>
            <div class="item" slot="content">
              <router-link
                v-for="(k, j) in item.oneChildren"
                :to="k.twoMenuUrl"
                :key="j"
              >{{k.twoMenuName}}</router-link>
            </div>
          </Poptip>
        </div>
      </div>
    </div>

    <div class="menu-left-btn" @click="hideMenu">
      <Icon type="md-menu" size="25" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    openMenuName: Array,
    menuList: Array,
    isShowShrinkLeftMenu: Boolean
  },
  name: "leftsider",
  data() {
    return {
      theme3: "light"
    };
  },
  created() {},
  mounted() {},
  methods: {
    hideMenu() {
      this.$emit("hideMenu");
    }
  }
};
</script>

<style lang="less" scoped>
.leftsider-box {
  width: 100%;
  height: 100%;
  position: relative;

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

  .shrink-left-menu {
    width: 100%;
    height: 100%;
    padding-bottom: 50px;
    background-color: white;
    overflow-y: scroll;
    overflow-x: hidden;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */
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

    .shrink-menu {
      .shrink-menu-item {
        width: 100%;
        padding: 10px 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .poptip-title {
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          span {
            margin-top: 2px;
            font-size: 10px;
            color: #515a6e;
          }
        }

        .item {
          width: 240px;

          a {
            display: block;
            padding: 5px;
            font-size: 14px;

            &:hover {
              background-color: #f7f7f7;
            }

            &:link {
              color: #515a6e;
            } /* 未访问链接*/
            &:visited {
              color: #515a6e;
            } /* 已访问链接 */
            &:hover {
              color: #41b883;
            } /* 鼠标移动到链接上 */
            &:active {
              color: #4efbad;
            } /* 鼠标点击时 */
          }
        }
      }
    }
  }

  .menu-left-btn {
    z-index: 1000;
    background-color: white;
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    padding: 10px 0 10px 12px;
    cursor: pointer;
  }
}
</style>