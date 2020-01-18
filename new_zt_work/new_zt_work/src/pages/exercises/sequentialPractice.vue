<!-- 顺序练习模块 -->

<template>
  <div class="sequentialPractice-box">
    <header>
      <Button icon="md-return-left" size="large" style="width:100px;" @click="esc"></Button>
      <strong>顺序练习</strong>
      <Button
        icon="md-refresh"
        type="primary"
        ghost
        size="large"
        shape="circle"
        @click="getSequentialParactice"
      ></Button>
    </header>

    <article>
      <exerciseModule
        :type="1"
        :data="sequentialPracticeData"
        @nextQuestion="getSequentialParactice"
      />
    </article>
  </div>
</template>

<script>
import exerciseModule from "./exerciseModule";

export default {
  components: {
    exerciseModule
  },
  props: {
    userInfo: Object,
    isShow: Number
  },
  data() {
    return {
      sequentialPracticeData: [],
      queryData: {
        page_index: 0,
        page_size: 1
      }
    };
  },
  watch: {
    isShow: function(newVal, oldVal) {
      if (newVal === 2) {
        this.getSequentialParactice();
      }
    }
  },
  methods: {
    getSequentialParactice() {
      this.$LoadingBar.start();
      this.$api.learning
        .sequentialParactice({
          page_index: ++this.queryData.page_index,
          page_size: this.queryData.page_size
        })
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data;
            if (
              JSON.stringify(list) === "[]" &&
              this.queryData.page_index !== 1
            ) {
              this.$Message.warning(this.$t("tip.lastQuestion"));
              this.queryData.page_index = 0;
            } else {
              this.sequentialPracticeData = list;
            }
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
.sequentialPractice-box {
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