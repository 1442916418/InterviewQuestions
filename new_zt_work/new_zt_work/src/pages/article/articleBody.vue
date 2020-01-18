<!-- 文章内容组件 -->

<template>
  <div class="articleBody-box">
    <div class="box">
      <div class="esc-box" v-if="isHeader">
        <Button icon="md-return-left" size="large" style="width:100px;" @click="esc"></Button>
      </div>
      <header>
        <h1 v-html="row.headline"></h1>
        <p class="author">
          <span>{{ row.author }}</span>
          <span>{{ setTime(row.add_time) }}</span>
        </p>
      </header>
      <article v-html="row.content"></article>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    row: Object,
    isHeader: Boolean
  },
  name: "articleBody",
  data() {
    return {};
  },
  methods: {
    setTime(val) {
      let v = this.$moment(val)
        .subtract(8, "hour")
        .format("YYYY-MM-DD HH:mm:ss");
      return v;
    },
    esc() {}
  }
};
</script>

<style lang="less" scoped>
.articleBody-box {
  width: 100%;
  text-align: center;
  background-color: white;

  .box {
    width: 100%;
    padding: 5px;

    .esc-box {
      padding: 15px 10px;
    }
  }
}

header,
article {
  padding: 10px;
  text-align: center;
}

header {
  color: #17233d;

  .author {
    font-size: 12px;
    span:first-child {
      color: #515a6e;
      padding-right: 7px;
    }
    span:last-child {
      color: #808695;
    }
  }
}

article {
  font-size: 15px;
  color: #515a6e;
}
</style>