<!-- 添加评论 -->

<template>
  <div class="add-comment">
    <div class="txt-box">
      <p v-if="count === 0"></p>
      <p class="txt-n" v-else>
        <em>{{ count }}</em>
        <span>条评论</span>
      </p>
      <div class="txt-content">
        <Input
          v-model.trim="content"
          type="textarea"
          class="textarea"
          :rows="4"
          :placeholder="$t('tip.comment')"
        />
        <div class="btn">
          <Button
            class="send-out"
            type="primary"
            :loading="loading"
            @click="addArticleComment"
          >{{ $t('btn.comment') }}</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    row: Object,
    count: Number
  },
  name: "addComment",
  data() {
    return {
      loading: false,
      content: null
    };
  },
  methods: {
    addArticleComment() {
      if (!this.$RegExp.verifyIsNull(this.content)) {
        this.$Message.warning(this.$t("tip.comment"));
        return;
      }
      this.loading = true;
      this.$api.learning
        .addArticleComment({
          _id: this.row._id,
          comment_content: this.content
        })
        .then(res => {
          if (res.data.code === 0) {
            this.loading = false;
            this.content = null;
            this.$emit("getComments");
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
.add-comment {
  width: 100%;
  padding: 10px;
  position: relative;

  .txt-box {
    width: 100%;
    position: relative;

    .txt-n {
      position: relative;
      margin-bottom: 20px;
      font-size: 16px;
      font-weight: 700;
      color: #657180;

      em {
        font: 22px/24px Georgia;
        color: #3eaf7c;
      }
    }

    .txt-content {
      position: relative;

      .btn {
        width: 100%;
        position: absolute;
        bottom: 5px;
        text-align: right;
        padding: 10px;
      }

      .textarea {
        padding-left: 15px;
        padding-bottom: 60px;
        border: none;
      }
    }
  }
}
</style>