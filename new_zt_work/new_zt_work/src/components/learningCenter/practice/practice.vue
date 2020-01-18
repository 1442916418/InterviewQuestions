<!-- 练习 -->

<template>
  <div class="practice-box">
    <div class="view-box" ref="view" v-show="isShow === 0">
      <div class="box-left animated fade fadeInDownBig">
        <div class="sequential-practice" @click="onClickSequentialPractice">
          <span>{{$t("tip.sequentialPractice")}}</span>
          <img
            src="/static/imgs/lianxi.png"
            :alt="$t('tip.sequentialPractice')"
            width="240"
            height="320"
          />
        </div>
      </div>
      <div class="box-right animated fade fadeInUpBig">
        <div class="random-practice" @click="onClickRandomPractice">
          <span>{{$t("tip.randomPractice")}}</span>
          <img
            src="/static/imgs/suiji.png"
            :alt="$t('tip.randomPractice')"
            width="240"
            height="320"
          />
        </div>
      </div>
    </div>

    <div class="reandom-practice-box" ref="randomPractice" v-show="isShow === 1">
      <randomPractice :isShow="isShow" :userInfo="userInfo" @backHomePage="backHomePage" />
    </div>

    <div class="rsequential-practice-box" ref="sequentialPractice" v-show="isShow === 2">
      <sequentialPractice :isShow="isShow" @backHomePage="backHomePage" />
    </div>
  </div>
</template>

<script>
import randomPractice from "@/pages/exercises/randomPractice"; // 随机练习
import sequentialPractice from "@/pages/exercises/sequentialPractice"; // 顺序练习

export default {
  components: {
    randomPractice,
    sequentialPractice
  },
  data() {
    return {
      isShow: 0, // 0主页，1随机练习，2顺序练习
      userInfo: {}
    };
  },
  created() {
    this.isShow = 0;
    this.getUserInfo();
  },
  beforeDestroy() {
    this.isShow = 0;
    this.userInfo = {};
    if (this.backTime) {
      clearTimeout(this.backTime);
    }
  },
  methods: {
    backHomePage(val) {
      if (val === 1) {
        this.$refs.randomPractice.className =
          "reandom-practice-box animated zoom zoomOut";
      } else {
        this.$refs.sequentialPractice.className =
          "rsequential-practice-box animated zoom zoomOut";
      }
      this.backTime = setTimeout(() => {
        this.isShow = 0;
      }, 200);
    },
    onClickSequentialPractice() {
      this.$refs.sequentialPractice.className =
        "rsequential-practice-box animated zoom zoomIn";
      this.isShow = 2;
    },
    onClickRandomPractice() {
      this.$refs.randomPractice.className =
        "reandom-practice-box animated zoom zoomIn";
      this.isShow = 1;
    },
    getUserInfo() {
      let store = this.$store.state;
      if (
        store.resolveUserInformation !== null ||
        store.resolveUserInformation === undefined
      ) {
        if (store.resolveUserInformation.obj !== null) {
          this.userInfo = store.resolveUserInformation.obj;
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.practice-box {
  .single-page-container;

  .view-box {
    width: 100%;
    height: 100%;
    box-sizing: content-box;
    display: flex;
    justify-content: space-around;
    align-items: center;

    .box-left,
    .box-right {
      width: 40%;
      height: 80%;
      background-color: white;
      box-sizing: content-box;
    }
  }
}

.sequential-practice,
.random-practice {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  span {
    font-size: 25px;
    font-weight: 600;
  }

  &:hover {
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    border-color: #eee;
  }
}

.content-box {
  width: 100%;
  height: 100%;
}

.reandom-practice-box,
.rsequential-practice-box {
  width: 100%;
  height: 100%;
}
</style>