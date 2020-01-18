<!-- 题库模块 -->

<template>
  <div class="questionLibrary-box" @click="hiddenQuestionLibrary" v-if="allTopics.length !== 0">
    <article>
      <div class="delete" v-if="type !== 0">
        <Button
          type="text"
          style="color:#aaa;"
          ghost
          @click="deleteAnswerRecord"
        >{{$t("btn.clearance")}}</Button>
      </div>
      <Button
        class="btn" 
        shape="circle"
        v-for="(item, index) in allTopics"
        :key="index"
        :style="{color: item.consequence === 1 ? '#19be6b' : item.consequence === 2 ? '#ed4014' : '#aaa',borderColor:item.consequence === 1 ? '#19be6b' : item.consequence === 2 ? '#ed4014' : '#ffffff' }"
        @click="onClickBtn(item._id)"
      >{{index+1}}</Button>
    </article>
  </div>
</template>

<script>
export default {
  props: {
    allTopics: Array,
    type: Number
  },
  methods: {
    deleteAnswerRecord() {
      if (this.type === 1 || this.type === 2) {
        this.$emit("deleteAnswerRecord");
      }
    },
    onClickBtn(id) {
      this.$emit("onClickCheck", id);
    },
    hiddenQuestionLibrary() {
      this.$emit("openTime");
      this.$emit("hiddenQuestionLibrary");
    }
  }
};
</script>

<style lang="less" scoped>
.questionLibrary-box {
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  article {
    width: 60%;
    height: 50%;
    z-index: 100;
    border-radius: 10px;
    background-color: #f3f3f3;
    overflow-x: hidden;
    overflow-y: scroll;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */

    // 滚动条整体部分，可以设置宽度等
    &::-webkit-scrollbar {
      display: none;
    }

    .btn {
      margin: 10px;
    }

    .delete {
      padding: 5px;
      text-align: right;
      color: #333;
    }
  }
}
</style>