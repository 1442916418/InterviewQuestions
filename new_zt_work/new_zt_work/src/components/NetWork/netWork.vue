<!-- 超时页 -->

<template>
  <div class="netWork-box">
    <div class="box">
      <img src="../../../static/imgs/wl.png" alt="超时了" width="400" height="400" />
      <h1>
        {{ $t('tip.NetworkDeviation') }}~~
        <router-link :to="routerName">{{$t('btn.ret')}}</router-link>
      </h1>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      routerName: ""
    };
  },
  created() {
    this.$Modal.remove();
  },
  mounted() {
    this.routerName = this.$route.query.redirect;
  }
};
</script>

<style lang="less" scoped>
.netWork-box {
  .single-page-container;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;

  .box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>