<!-- 文章详情组件 -->

<template>
  <div class="article-details-box">
    <div class="box">
      <articleBody :row="row" :isHeader="isHeader" />
      <div class="comment-box" id="comment">
        <a name="comment">
          <addComment @getComments="getComments" :row="row" :count="commentCount" />
        </a>
        <comment :row="commentData" @getComments="getComments" @getAddComments="getAddComments" />
      </div>
    </div>
    <div class="left-box">
      <div class="sidebar">
        <div class="list-item">
          <Poptip placement="left" class="icon" trigger="hover" :content="poptipContent">
            <Icon type="ios-heart" size="30" :color="iconHeartColor" @click="onClickHeart" />
          </Poptip>
          <Badge :count="commentCount" type="success" class="icon">
            <a href="#comment">
              <Icon type="md-chatboxes" size="30" color="#c5c8ce" />
            </a>
          </Badge>
        </div>
      </div>
    </div>

    <BackTop></BackTop>
  </div>
</template>

<script>
import addComment from "@/pages/addComment/index";
import articleBody from "@/pages/article/articleBody";
import comment from "@/pages/comments/index";

let iconColor = ["#c5c8ce", "#3eaf7c"],
  iconContent = ["点击收藏", "已收藏"];

export default {
  props: {
    row: Object,
    isHeader: Boolean
  },
  components: {
    addComment,
    articleBody,
    comment
  },
  data() {
    return {
      commentCount: 0,
      commentData: [],
      iconHeartColor: iconColor[0],
      poptipContent: iconContent[0],
      queryCommentData: {
        page_index: 1,
        page_size: 10,
        _id: null
      }
    };
  },
  mounted() {},
  watch: {
    row: function(newVal) {
      if (newVal._id !== undefined) {
        this.getArticleCollectState();
        this.getArticleComments();
      }
    }
  },
  methods: {
    getAddComments() {
      this.queryCommentData.page_size = this.queryCommentData.page_size + 10;
      this.getArticleComments();
    },
    getComments() {
      this.queryCommentData.page_index = 1;
      this.getArticleComments();
    },
    getArticleComments() {
      let q = this.queryCommentData;
      let d = {
        page_index: q.page_index,
        page_size: q.page_size,
        _id: this.row._id
      };

      this.$api.learning
        .getArticleComment(d)
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data;
            this.commentCount = list.page_count;
            this.commentData = list.data_info;
          }
        })
        .catch(() => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    collection() {
      this.$api.learning
        .collectArticle({
          _id: this.row._id,
          headline: this.row.headline,
          content: this.row.content
        })
        .then(res => {
          if (res.data.code === 0) {
            this.iconHeartColor = iconColor[1];
            this.poptipContent = iconContent[1];
          }
        })
        .catch(() => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    cancelCollection() {
      this.$api.learning
        .cancelArticleComment({
          _id: this.row._id
        })
        .then(res => {
          if (res.data.code === 0) {
            this.iconHeartColor = iconColor[0];
            this.poptipContent = iconContent[0];
          }
        })
        .catch(() => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    onClickHeart() {
      if (this.poptipContent === iconContent[0]) {
        this.collection();
      } else {
        this.cancelCollection();
      }
    },
    getArticleCollectState() {
      this.$api.learning
        .checkArticleBrowse({
          _id: this.row._id
        })
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data;
            if (list.collect_state === 1) {
              this.iconHeartColor = iconColor[1];
              this.poptipContent = iconContent[1];
            } else {
              this.iconHeartColor = iconColor[0];
              this.poptipContent = iconContent[0];
            }
          } else if (res.data.code === 138) {
            // this.$emit("esc");
          }
        })
        .catch(() => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    esc() {
      this.$emit("esc");
    },
    setTime(val) {
      let v = this.$moment(val)
        .subtract(8, "hour")
        .format("YYYY-MM-DD HH:mm:ss");
      return v;
    }
  }
};
</script>

<style lang="less" scoped>
.article-details-box {
  width: 100%;
  height: 100%;
  padding: 10px;
  position: relative;

  &:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }

  .box {
    float: left;
    width: 90%;
    background-color: white;
  }
}

.comment-box {
  width: 100%;
  padding: 10px 0;
}

.icon {
  padding-bottom: 15px;
  cursor: pointer;
}

.left-box {
  width: 10%;
  height: 100%;
  float: right;
  position: relative;

  .sidebar {
    height: 300px;
    padding-left: 10px;
    position: fixed;
    top: 260px;

    .list-item {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
    }
  }
}

.esc-box {
  padding: 15px 10px;
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

iframe {
  width: 100%;
}
</style>