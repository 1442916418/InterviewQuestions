<!-- 公用用户下拉选择框 -->

<template>
  <div class="selectDevice-box">
    <Input
      v-model="sName"
      :icon="icon"
      :placeholder="$t('tip.pleaseSelectUsers')"
      class="selectInput"
      search
      @on-focus="inputFocus"
      @on-search="inputSearch"
      v-clickoutside="handleClose"
      @on-click="clickIcon"
    />
    <Scroll
      :on-reach-bottom="handleReachBottom"
      height="200"
      v-show="isShow"
      class="scroll"
      :distance-to-edge="[5, 5]"
    >
      <div
        v-for="(item, index) in userData"
        :key="index"
        class="scroll-item"
        @click="selectItem(item.id, item.name, item.real_name)"
      >{{ item.real_name }}</div>
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
      sName: null,
      isShow: false,
      userData: [],
      icon: "ios-arrow-down",
      queryData: {
        real_name: "",
        mobile: "",
        role_id: -2,
        department_id: -2,
        page_index: 1,
        page_size: 10
      }
    };
  },
  directives: { clickoutside },
  mounted() {
    this.isShow = false;
    this.icon = "ios-arrow-down";
    this.getUserData();
  },
  beforeDestroy() {
    this.sName = null;
    this.isShow = false;
    this.userData = [];
    this.icon = "ios-arrow-down";
    this.queryData = {
      real_name: "",
      mobile: "",
      role_id: -2,
      department_id: -2,
      page_index: 1,
      page_size: 10
    };
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
    //
    handleClose(e) {
      this.isShow = false;
      this.icon = "ios-arrow-down";
    },
    // 模糊查询
    inputSearch(value) {
      this.queryData.real_name = value;
      this.getUserData();
    },
    // 选择用户
    selectItem(id, name, real_name) {
      this.sName = real_name;
      let d = {
        id: id,
        name: name,
        real_name: real_name
      };
      this.$emit("changeUser", d);
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
    // 无限滚动，底部触发
    handleReachBottom() {
      return new Promise(resolve => {
        let q = this.queryData;
        q.page_size = q.page_size + 10;
        let data = {
          real_name: q.real_name,
          mobile: q.mobile,
          role_id: q.role_id,
          department_id: q.department_id,
          page_index: q.page_index,
          page_size: q.page_size
        };

        this.$api.auth_login
          .getUserOther(data)
          .then(res => {
            if (res.data.code === 0) {
              this.userData = [];
              let list = res.data.data.data_info;

              this.userData = list;
            }
          })
          .catch(error => {
            console.log(error);
            this.$Message.error(this.$t("tip.requestError"));
          });
        resolve();
      });
    },
    // 获取用户
    getUserData() {
      let q = this.queryData;
      let data = {
        real_name: q.real_name,
        mobile: q.mobile,
        role_id: q.role_id,
        department_id: q.department_id,
        page_index: q.page_index,
        page_size: q.page_size
      };

      this.$api.auth_login
        .getUserOther(data)
        .then(res => {
          if (res.data.code === 0) {
            this.userData = [];
            let list = res.data.data.data_info;

            this.userData = list;
            this.userData.unshift({
              real_name: "全部用户",
              id: -2,
              name: "全部用户"
            });
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    }
  }
};
</script>

<style lang="less" scoped>
.selectDevice-box {
  display: inline-block;
  width: 220px;
  margin-right: 10px;
  position: relative;

  .selectInput {
    width: 220px;
    margin-right: 10px;
    cursor: pointer;

    &:hover {
      cursor: pointer;
    }
  }

  .scroll {
    position: absolute;
    top: 35px;
    width: 220px;
    z-index: 200;
    padding: 5px 0;
    background-color: #fff;
    box-sizing: border-box;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    position: absolute;

    .scroll-item {
      padding: 5px 15px;
      background-color: white;
      cursor: pointer;

      &:hover {
        background-color: #eee;
        cursor: pointer;
      }
    }
  }
}
</style>