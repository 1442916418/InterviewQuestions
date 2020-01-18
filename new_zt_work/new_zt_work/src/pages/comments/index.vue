<!-- 评论组件 -->

<template>
  <div class="comments-box">
    <div class="list">
      <div class="item-null" v-if="row.length === 0">
        <span>暂无评论</span>
      </div>
      <div v-else>
        <transition-group
          name="comment-list"
          tag="div"
          enter-active-class="animated fade fadeIn"
          leave-active-class="animated fade fadeOut"
        >
          <div class="item" v-for="(item) in row" :key="item._id">
            <p class="name">{{ item.commentators }}</p>
            <p class="content">{{ item.comment_content }}</p>
            <div class="footer">
              <p class="footer-left">
                <span>{{ setTime(item.add_time) }}</span>
              </p>
              <p class="footer-right">
                <Button
                  type="error"
                  size="small"
                  class="delete"
                  ghost
                  v-if="item.Remove_permissions === 1"
                  @click="delectComment(item._id)"
                >删除</Button>
              </p>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
    <p class="more-comments" v-show="this.row.length >= 10 " @click="clickMoreComments">查看更多评论</p>
  </div>
</template>

<script>
export default {
  props: {
    row: Array
  },
  name: "comments",
  methods: {
    clickMoreComments() {
      this.$emit("getAddComments");
    },
    delectComment(id) {
      this.$api.learning
        .deleteArticleComment({
          id: id
        })
        .then(res => {
          if (res.data.code === 0) {
            this.$Message.success(this.$t("tip.deleteSuccess"));
            this.$emit("getComments");
          }
        })
        .catch(() => {
          this.$Message.error(this.$t("tip.requestError"));
        });
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
.comments-box {
  width: 100%;
  max-height: 800px;
  overflow: auto;
  padding: 10px 0;

  &::-webkit-scrollbar {
    display: none;
  }
}

.list {
  width: 100%;

  .item-null {
    padding: 10px;
    text-align: center;
    span {
      color: #ccc;
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
</style>