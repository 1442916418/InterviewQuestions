<!-- 题目详情 -->

<template>
  <div class="rowDetails-box">
    <div class="title">
      <p>
        <b>标题:</b>
        <b>{{row.item_content}}</b>
      </p>
    </div>
    <div class="content">
      <div class="options">
        <p v-for="(item, index) in row.options" :key="index">
          <span>{{item.serial_number}}、</span>
          <span>{{item.option}}</span>
        </p>
      </div>
      <div class="answer">
        <span style="color:#41b883;">
          正确答案:
          <span
            style="padding: 0 10px;"
            v-for="(an, index) in row.answer"
            :key="index"
          >{{`${an}、${row.options[an - 1].option}`}}</span>
        </span>
      </div>
      <div class="answer-remark">
        <span>
          备注:
          <span>{{row.answer_remark}}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    row: Object
  }
};
</script>

<style lang="less" scoped>
.rowDetails-box {
  padding: 5px;

  .title {
    padding: 2px;
    background-color: #eee;

    p {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      font-size: 16px;

      b:first-child {
        padding-right: 10px;
      }
    }
  }

  .content {
    padding: 5px;

    .options {
      padding: 5px 0;

      p {
        padding: 5px 0;

        span:first-child {
          padding-right: 5px;
        }
      }
    }
  }

  .answer-remark,
  .answer {
    padding: 5px 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
}
</style>