<!-- 单篇文章评论显示组件 -->

<template>
  <div class="singleComment-box">
    <div class="comment">
      <div class="item" v-for="(item, index) in row" :key="index">
        <p class="name">{{ item.commentators }}</p>
        <p class="content">{{ item.comment_content }}</p>
        <div class="footer">
          <p class="footer-right">
            <Button
              type="error"
              size="small"
              class="delete"
              ghost
              @click="delectComment(item._id)"
            >删除</Button>
          </p>
        </div>
      </div>
    </div>
    <div class="comment-footer">
      <p class="more-comments" v-show="this.row.length >= 100 " @click="clickMoreComments">查看更多评论</p>

      <Card class="card" v-show="currentArticleInfo.headline !== undefined">
        <div class="card-box" @click="viewDetails">
          <div class="title">{{ currentArticleInfo.headline }}</div>
          <div class="author">
            <span>{{ currentArticleInfo.author }}</span>
            <span>{{ setTime(currentArticleInfo.add_time) }}</span>
          </div>
        </div>
      </Card>
    </div>

    <Modal
      v-model="isShowDetails"
      :title="$t('tip.seeDetails')"
      width="700px"
      @on-visible-change="onVisibleChange"
    >
      <div class="single-comment-details">
        <articleDetails :row="currentArticleInfo" :isHeader="false" />
      </div>
    </Modal>
  </div>
</template>

<script>
import articelDetails from "@/pages/articelDeatils/articelDeatils";

export default {
  props: {
    row: Array,
    currentArticleInfo: Object
  },
  components: {
    articleDetails: articelDetails
  },
  name: "singleComment",
  data() {
    return {
      isShowDetails: false
    };
  },
  methods: {
    onVisibleChange(val) {
      if (!val) {
        this.$emit("getNewArticleCommentData");
      }
    },
    viewDetails() {
      this.isShowDetails = !this.isShowDetails;
    },
    setTime(val) {
      let v = this.$moment(val)
        .subtract(8, "hour")
        .format("YYYY-MM-DD HH:mm:ss");
      return v;
    },
    clickMoreComments() {
      this.$emit("getAddArticleCommentData");
    },
    delectComment(id) {
      this.$api.learning
        .deleteArticleComment({
          id: id
        })
        .then(res => {
          if (res.data.code === 0) {
            this.$Message.success(this.$t("tip.deleteSuccess"));
            this.$emit("getNewArticleCommentData");
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
.singleComment-box {
  width: 100%;

  .comment {
    padding: 5px;
    max-height: 350px;
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}

.item {
  padding: 10px 5px;
  border-top: 1px solid #f2f2f2;

  &:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }

  .name {
    padding-bottom: 4px;
    font-size: 14px;
    color: #3eaf7c;
  }

  .content {
    font-size: 16px;
    line-height: 22px;
    color: #222;
  }

  .footer {
    padding-top: 6px;

    .footer-left {
      float: left;
    }

    .footer-right {
      float: right;

      .delete {
        color: #ed4014;
        cursor: pointer;
      }
    }

    &:after {
      content: ".";
      display: block;
      height: 0;
      clear: both;
      visibility: hidden;
    }
  }
}

.comment-footer {
  .more-comments {
    color: #aaa;
    font-size: 14px;
    line-height: 30px;
    text-align: center;
    background-color: #f4f5f6;
    margin-top: 10px;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: #222;
    }
  }

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

.single-comment-details {
  width: 100%;
  display: inline-block;
}
</style>