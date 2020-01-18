<!-- 新闻 -->

<template>
  <div class="journalism-box">
    <div class="journalism-header">
      <div class="body-right-search">
        <Input
          v-model="queryArticleData.headline"
          search
          enter-button
          placeholder="搜索"
          @on-search="onSearchActile"
        />
      </div>
    </div>
    <div class="journalism-body">
      <div class="body-left">
        <Menu class="left-menu" ref="menu" :active-name="activeName">
          <div class="menu-title">TITLE</div>
          <MenuItem name="1-1" class="menu-item">
            <p class="menu-item-p" @click="onSelectMenu('全部')">全部</p>
          </MenuItem>
          <MenuItem
            class="menu-item"
            v-for="(item, index) in acticleTypeData"
            :key="index"
            :name="'2-'+(index+1)"
          >
            <p class="menu-item-p" @click="onSelectMenu(item.type_name)">{{ item.type_name }}</p>
          </MenuItem>
        </Menu>
      </div>
      <div class="body-right">
        <div class="wrapper" v-show="!isShowDetails" ref="wrapper">
          <Scroll
            class="scroll"
            height="600"
            :distance-to-edge="[15, 15]"
            :on-reach-bottom="onReachBottom"
            :on-reach-top="onReachTop"
          >
            <div class="null-data" v-if="articleData.length === 0">
              <span>暂无数据</span>
            </div>
            <div>
              <Card class="card" v-for="(item, index) in articleData" :key="index">
                <div class="card-box" @click="viewDetails(item)">
                  <div class="title">{{ item.headline }}</div>
                  <div class="author">
                    <span>{{ item.author }}</span>
                    <span>{{ setTime(item.add_time) }}</span>
                    <span>{{ setDepartmentData(item.department_id) }}</span>
                  </div>
                </div>
              </Card>
            </div>
          </Scroll>
        </div>
        <transition
          name="details-transition"
          enter-active-class="animated fade fadeInLeftBig faster"
          leave-active-class="animated fade fadeOutRightBig fast"
        >
          <div class="details-box" v-show="isShowDetails">
            <articleDetails :row="currentInfo" :isHeader="false" />
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import articelDetails from "@/pages/articelDeatils/articelDeatils";

export default {
  name: "journalism",
  components: {
    articleDetails: articelDetails
  },
  data() {
    return {
      currentInfo: {},
      isShowDetails: false,
      acticleTypeData: [],
      articleData: [],
      departmentData: [],
      activeName: "1-1",
      queryArticleType: {
        page_index: 1,
        page_size: 100
      },
      queryArticleData: {
        category: "",
        headline: "",
        page_index: 1,
        page_size: 10
      },
      queryDepartmentData: {
        name: "",
        page_index: 1,
        page_size: 100
      }
    };
  },
  created() {
    this.getDepartmentData();
    this.getCheckArticleType();
  },
  methods: {
    setDepartmentData(val) {
      let d = this.departmentData,
        v = null;
      d.map((item, index) => {
        if (val === item.id) {
          v = item.name;
        }
      });
      return v;
    },
    getDepartmentData() {
      let q = this.queryDepartmentData;
      let d = {
        name: q.name,
        page_index: q.page_index,
        page_size: q.page_size
      };

      this.$api.auth_login
        .getDepartmentData(d)
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data;
            this.departmentData = list.data_info;
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    onSearchActile(val) {
      this.queryArticleData.headline = val;
      this.getCheckArticleData();
    },
    viewDetails(val) {
      this.currentInfo = val;
      this.isShowDetails = !this.isShowDetails;
    },
    setTime(val) {
      let v = this.$moment(val)
        .subtract(8, "hour")
        .format("YYYY-MM-DD HH:mm:ss");
      return v;
    },
    onReachBottom() {
      console.log("下下下");
      return new Promise(resolve => {
        this.queryArticleData.page_size = this.queryArticleData.page_size + 10;
        this.getCheckArticleData();

        resolve();
      });
    },
    onReachTop() {
      return new Promise(resolve => {
        this.queryArticleData.page_index = 1;
        this.getCheckArticleData();

        resolve();
      });
    },
    getCheckArticleData() {
      this.$LoadingBar.start();
      let q = this.queryArticleData;
      let d = {
        category: q.category,
        headline: q.headline,
        page_index: q.page_index,
        page_size: q.page_size
      };
      this.$api.learning
        .checkArticle2(d)
        .then(res => {
          if (res.data.code === 0) {
            this.isShowDetails = false;
            this.$LoadingBar.finish();
            let list = res.data.data;
            this.articleData = list.data_info;
          }
          this.$LoadingBar.finish();
        })
        .catch(() => {
          this.$LoadingBar.error();
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    onSelectMenu(name) {
      this.queryArticleData.headline = "";
      if (name === "全部") {
        this.queryArticleData.category = "";
      } else {
        this.queryArticleData.category = name;
      }
      this.getCheckArticleData();
    },
    getCheckArticleType() {
      this.$api.learning
        .checkArticleType({
          page_index: this.queryArticleType.page_index,
          page_size: this.queryArticleType.page_size
        })
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data;
            if (list.data_info.length === 0) {
              this.acticleTypeData = [];
              this.activeName = "1-1";
              this.getCheckArticleData();
            } else {
              this.activeName = "2-1";
              this.queryArticleData.category = list.data_info[0].type_name;
              this.acticleTypeData = list.data_info;
              this.getCheckArticleData();
            }

            this.$nextTick(() => {
              this.$refs.menu.updateOpened();
              this.$refs.menu.updateActiveName();
            });
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
.journalism-box {
  width: 100%;
  height: 100%;
  margin-top: 50px;
  z-index: 10;

  .journalism-header {
    .header;
  }

  .journalism-body {
    .body;
    height: 100%;
    overflow: auto;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    // 滚动条整体部分，可以设置宽度等
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .body-left {
    width: 25%;
    height: 100%;
    min-width: 200px;
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  .body-right {
    width: 75%;
    height: 100%;
    min-width: 500px;
    overflow: auto;
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    // 滚动条整体部分，可以设置宽度等
    &::-webkit-scrollbar {
      display: none;
    }
  }
}

.left-menu {
  width: 120px;
  padding: 5px;
}

.menu-title {
  font-size: 20px;
  font-weight: 600;
  color: #3eaf7c;
  text-align: center;
}

.menu-item {
  text-align: center;
}

.wrapper {
  width: 100%;
  height: 100%;
}

.scroll {
  padding: 0 20px 10px 10px;
  .card {
    margin: 10px;
    .card-box {
      .title {
        font-size: 16px;
        font-weight: 600;
        color: #17233d;
      }

      .author {
        padding-top: 5px;
        font-size: 14px;
        color: #515a6e;

        span:nth-of-type(2) {
          padding: 0 10px;
        }
      }
    }
  }
}

.null-data {
  padding: 20px;
  text-align: center;

  span {
    color: #ccc;
  }
}

.details-box {
  width: 100%;
  height: 100%;
  position: relative;
}

.menu-item-p {
  padding: 14px 24px;
}

.body-right-search {
  width: 100%;
}

.ivu-menu-vertical.ivu-menu-light:after {
  background-color: white;
}

.ivu-menu-vertical .ivu-menu-item,
.ivu-menu-vertical .ivu-menu-submenu-title {
  padding: 0;
}
</style>