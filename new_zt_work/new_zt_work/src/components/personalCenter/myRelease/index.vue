<!-- 我的发布 -->

<template>
  <div class="myRelease-box">
    <div class="myRelease-body">
      <DefaultTable
        :isPage="true"
        :isSelection="false"
        :columnsList="columnsList"
        :dataList="dataList"
        :loading="loading"
        :queryData="queryArticleData"
        @handleSizeChange="handleSizeChange"
        @handleIndexChange="handleIndexChange"
      />
    </div>
  </div>
</template>

<script>
import expandRow from "@/pages/article/articleBody";

export default {
  name: "myRelease",
  data() {
    return {
      columnsList: [
        {
          type: "index",
          title: "序号",
          minWidth: 80,
          align: "center",
          sortable: true
        },
        {
          type: "expand",
          minWidth: 50,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row,
                isHeader: false
              }
            });
          }
        },
        {
          title: "文章标题",
          minWidth: 200,
          align: "center",
          key: "headline",
          sortable: true
        },
        {
          title: "创建时间",
          minWidth: 200,
          align: "center",
          key: "add_time",
          sortable: true,
          render: (h, params) => {
            let t = params.row.add_time,
              v = null;
            v = this.$moment(t)
              .subtract(8, "hour")
              .format("YYYY-MM-DD HH:mm:ss");
            return h("span", v);
          }
        },
        {
          title: "作者",
          minWidth: 120,
          align: "center",
          key: "author",
          sortable: true
        },
        {
          title: "文章类型",
          minWidth: 120,
          align: "center",
          key: "category",
          sortable: true
        }
      ],
      queryArticleData: {
        page_index: 1,
        page_size: 10,
        count: 0
      },
      loading: false,
      dataList: []
    };
  },
  created() {
    this.getMyArticle();
  },
  methods: {
    handleSizeChange(size) {
      this.queryArticleData.page_index = 1;
      this.queryArticleData.page_size = size;
      this.getMyArticle();
    },
    handleIndexChange(index) {
      this.queryArticleData.page_index = index;
      this.getMyArticle();
    },

    getMyArticle() {
      this.$api.learning
        .checkMyIssueArticle({
          page_index: this.queryArticleData.page_index,
          page_size: this.queryArticleData.page_size
        })
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data;
            this.dataList = list.data_info;
            this.queryArticleData.count = list.page_count;
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
.myRelease-box {
  .single-page-container;

  .myRelease-header {
    .header;

    .header-left {
      float: left;
    }

    .header-right {
      float: right;
    }
  }

  .myRelease-body {
    .body;
  }
}
</style>