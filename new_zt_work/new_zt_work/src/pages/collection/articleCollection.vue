<!-- 文章收藏 -->

<template>
  <div class="articleCollection-box">
    <div class="content" v-if="row.length > 0">
      <Button
        class="btn"
        shape="circle"
        v-for="(item, index) in row"
        :key="index"
      >{{item.collect_name}}</Button>
    </div>
    <div class="footer" v-if="row.length >= 100">
      <Button type="primary" long @click="check">查看更多</Button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    row: Array
  },
  name: "articleCollection",
  methods: {
    check() {
      this.$emit("clickMoreData");
    }
  }
};
</script>

<style lang="less" scoped>
.articleCollection-box {
  width: 100%;

  .content {
    padding: 5px;
    max-height: 450px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;

    &::-webkit-scrollbar {
      display: none;
    }

    .btn {
      margin: 4px;
    }
  }

  .footer {
    padding: 10px;
  }
}
</style>