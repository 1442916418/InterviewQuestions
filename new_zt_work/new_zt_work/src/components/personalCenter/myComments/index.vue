<!-- 我的评论 -->

<template>
  <div class="myComments-box">
    <div class="myComments-body">
      <DefaultTable
        :isPage="true"
        :isSelection="false"
        :columnsList="columnsList"
        :dataList="dataList"
        :loading="loading"
        :queryData="querytData"
        @handleSizeChange="handleSizeChange"
        @handleIndexChange="handleIndexChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "myComments",
  data() {
    return {
      columnsList: [],
      querytData: {
        page_index: 1,
        page_size: 10,
        count: 0
      },
      loading: false,
      dataList: []
    };
  },
  created() {
    this.checkMyArticleComment();
  },
  methods: {
    handleSizeChange(size) {
      this.querytData.page_index = 1;
      this.querytData.page_size = size;
      this.checkMyArticleComment();
    },
    handleIndexChange(index) {
      this.querytData.page_index = index;
      this.checkMyArticleComment();
    },
    checkMyArticleComment() {
      this.$api.learning
        .checkMyArticleComment({
          page_index: this.querytData.page_index,
          page_size: this.querytData.page_size
        })
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data;
            this.dataList = list.data_info;
            this.querytData.count = list.page_count;
          }
        })
        .catch(() => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    }
  }
};
</script>

<style lang="less" scoped>
.myComments-box {
  .single-page-container;

  .myComments-header {
    .header;

    .header-left {
      float: left;
    }

    .header-right {
      float: right;
    }
  }

  .myComments-body {
    .body;
  }
}
</style>