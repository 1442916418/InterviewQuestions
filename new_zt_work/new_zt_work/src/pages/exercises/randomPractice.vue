<!-- 随机练习模块 -->

<template>
  <div class="randomPractive-box">
    <header>
      <Button icon="md-return-left" size="large" style="width:100px;" @click="esc"></Button>
      <strong>随机练习</strong>
      <Button
        icon="md-refresh"
        type="primary"
        ghost
        size="large"
        shape="circle"
        @click="getRandomParacticeData"
      ></Button>
    </header>

    <article>
      <exerciseModule :type="2" :data="randomParacticeData" @nextQuestion="getRandomParacticeData" />
    </article> 
  </div>
</template>

<script>
import exerciseModule from "./exerciseModule";

export default {
  props: {
    userInfo: Object,
    isShow: Number
  },
  components: {
    exerciseModule
  },
  data() {
    return {
      randomParacticeData: []
    };
  },
  watch: {
    isShow: function(newVal, oldVal) {
      if (newVal === 1) {
        this.getRandomParacticeData();
      }
    }
  },
  methods: {
    getRandomParacticeData() {
      this.$LoadingBar.start();
      this.$api.learning
        .randomParactice({
          user_id: this.userInfo.user_id
        })
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data;
            this.randomParacticeData = list;
            this.$LoadingBar.finish();
          }
          this.$LoadingBar.finish();
        })
        .catch(error => {
          console.log(error);
          this.$LoadingBar.error();
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    esc() {
      this.$emit("backHomePage", 1);
    }
  }
};
</script>

<style lang="less" scoped>
.randomPractive-box {
  height: 90%;
  background-color: white;
  margin: 0 20px;
  overflow: hidden;
}

header {
  padding: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;

  strong {
    font-size: 20px;
  }
}

article {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
</style>