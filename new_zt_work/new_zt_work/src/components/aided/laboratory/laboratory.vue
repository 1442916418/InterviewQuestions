<!-- 实验室 -->

<template>
  <div class="laboratory-box">
    <div class="laboratory-body" v-if="!isShowDetails">
      <Scroll
        class="scroll"
        height="800"
        :distance-to-edge="[15, 15]"
        :on-reach-bottom="onReachBottom"
        :on-reach-top="onReachTop"
      >
        <Card class="card" v-for="(item, index) in dataList" :key="index">
          <div class="card-box" @click="viewDetails(item)">
            <div class="title">{{ item.headline }}</div>
            <div class="author">
              <span>{{ item.author }}</span>
              <span>{{ setTime(item.add_time) }}</span>
            </div>
          </div>
        </Card>
      </Scroll>
    </div>
    <div class="details-box" v-else>
      <articleDetails :isHeader="true" @esc="esc" :row="currentInfo" />
    </div>
  </div>
</template>

<script>
import articelDetails from "@/pages/articelDeatils/articelDeatils";

export default {
  name: "laboratory",
  components: {
    articleDetails: articelDetails
  },
  data() {
    return {
      queryData: {
        page_index: 1,
        page_size: 10,
        encryption: -2,
        category: -2,
        count: 0
      },
      dataList: [],
      isShowDetails: false,
      currentInfo: {}
    };
  },
  created() {
    this.getCheckArticleData();
  },
  beforeDestroy() {
    this.queryData = {
      page_index: 1,
      page_size: 10,
      encryption: -2,
      category: -2,
      count: 0
    };
    this.dataList = [];
    this.isShowDetails = false;
    this.currentInfo = {};
  },
  methods: {
    esc() {
      this.getCheckArticleData();
      this.isShowDetails = !this.isShowDetails;
    },
    viewDetails(val) {
      this.currentInfo = val;
      this.isShowDetails = !this.isShowDetails;
    },
    onReachBottom() {
      return new Promise(resolve => {
        this.queryData.page_size = ++this.queryData.page_size;
        this.getCheckArticleData();

        resolve();
      });
    },
    onReachTop() {
      return new Promise(resolve => {
        this.queryData.page_index = 1;
        this.getCheckArticleData();

        resolve();
      });
    },
    setTime(val) {
      let v = this.$moment(val)
        .subtract(8, "hour")
        .format("YYYY-MM-DD HH:mm:ss");
      return v;
    },
    getCheckArticleData() {
      let q = this.queryData;
      let d = {
        page_index: q.page_index,
        page_size: q.page_size,
        encryption: q.encryption,
        category: q.category
      };

      this.$api.learning
        .checkArticle(d)
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data;
            if (q.page_index === 1) {
              this.dataList = list.data_info;
            } else {
              this.dataList = [...this.dataList, ...list.data_info];
            }
            this.queryData.count = list.page_count;
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    }
  }
};
</script>

<style lang="less" scoped>
.laboratory-box {
  .single-page-container;

  .laboratory-body {
    .body;
  }

  .scroll {
    width: 100%;
  }

  .card {
    margin: 15px;
  }
}

.card-box {
  .title {
    font-size: 16px;
    font-weight: 600;
    color: #17233d;
  }

  .author {
    padding-top: 5px;
    font-size: 14px;

    span:first-child {
      color: #515a6e;
    }
    span:last-child {
      color: #808695;
    }
  }
}
</style>