<!-- 404 -->

<template>
  <div class="error-box">
    <div>
      <p>{{ $t('tip.NetworkDeviation') }}~~~</p>
      <Button type="primary" style="margin-left: 10px;" @click="() => { $router.replace({ path: '/' }) }">返回{{$t('btn.signIn')}}</Button>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {};
  }
};
</script>

<style lang="less" scoped>
.error-box {
  .single-page-container;
  display: flex;
  justify-content: center;
  align-items: center;

  div {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;

    p {
      font-size: 16px;
    }
  }
}
</style>