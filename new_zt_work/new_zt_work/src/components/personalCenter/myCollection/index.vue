<!-- 我的收藏 -->

<template>
  <div class="myCollection-box">
    <div class="myCollection-body">
      <DefaultTable
        :isPage="true"
        :isSelection="false"
        :columnsList="columnsList"
        :dataList="dataList"
        :loading="loading"
        :queryData="queryCollectData"
        @handleSizeChange="handleSizeChange"
        @handleIndexChange="handleIndexChange"
      />
    </div>

    <Modal
      width="600px"
      v-model="isShowModal"
      @on-visible-change="onVisibleChange"
      :title="$t('tip.seeDetails')"
    >
      <div class="my-collection-article-datils">
        <articleDetails :row="articleDetails" :isHeader="false" />
      </div>
    </Modal>
  </div>
</template>

<script>
import articleDetails from "@/pages/articelDeatils/articelDeatils";

export default {
  name: "myCollection",
  components: {
    articleDetails
  },
  data() {
    return {
      articleDetails: {},
      isShowModal: false,
      columnsList: [
        {
          title: "序号",
          align: "center",
          minWidth: 80,
          type: "index",
          sortable: true
        },
        {
          title: "文章标题",
          align: "center",
          minWidth: 300,
          key: "headline",
          sortable: true
        },
        {
          title: "操作",
          align: "center",
          minWidth: 100,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "info"
                  },
                  on: {
                    click: () => {
                      this.checkArticleDetails(params.row.article_id);
                    }
                  }
                },
                this.$t("tip.see")
              )
            ]);
          }
        }
      ],
      queryCollectData: {
        page_index: 1,
        page_size: 10,
        count: 0
      },
      loading: false,
      dataList: []
    };
  },
  created() {
    this.getCollectArticleData();
  },
  methods: {
    onVisibleChange(val) {
      if (!val) {
        this.getCollectArticleData();
      }
    },
    checkArticleDetails(id) {
      this.$api.learning
        .checkArticleBrowse({
          _id: id
        })
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data;
            this.articleDetails = list.data_info[0];
            this.isShowModal = true;
          }
        })
        .catch(() => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    handleSizeChange(size) {
      this.queryDqueryCollectDataata.page_index = 1;
      this.queryCollectData.page_size = size;
      this.getCollectArticleData();
    },
    handleIndexChange(index) {
      this.queryCollectData.page_index = index;
      this.getCollectArticleData();
    },

    getCollectArticleData() {
      this.loading = true;
      this.$api.learning
        .getCollectArticleData({
          page_index: this.queryCollectData.page_index,
          page_size: this.queryCollectData.page_size
        })
        .then(res => {
          if (res.data.code === 0) {
            this.loading = false;
            let list = res.data.data;
            this.dataList = list.data_info;
            this.queryCollectData.count = list.page_count;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;

          this.$Message.error(this.$t("tip.requestError"));
        });
    }
  }
};
</script>

<style lang="less" scoped>
.myCollection-box {
  .single-page-container;

  .myCollection-header {
    .header;

    .header-left {
      float: left;
    }

    .header-right {
      float: right;
    }
  }

  .myCollection-body {
    .body;
  }
}

.my-collection-article-datils {
  width: 100%;
  position: relative;
  display: inline-block;
}
</style>