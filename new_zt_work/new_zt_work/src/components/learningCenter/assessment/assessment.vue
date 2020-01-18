<!-- 考核 -->

<template>
  <div class="assessment-box">
    <div class="view-box" v-if="!isStartExamination">
      <div @click="onClickStartExamination">{{ $t('tip.startExamination') }}</div>
    </div>
    <div class="box" v-else>
      <header>
        <Button icon="md-time" :type="timeBtnType ? 'warning' : 'primary'" ghost>{{ countDown }}</Button>
        <strong>{{ examinationQuestionsData.length === 0 ? "" : examinationQuestionsData[0].test_paper_name }}</strong>
        <span>
          <Button
            icon="md-refresh"
            type="primary"
            ghost
            size="large"
            shape="circle"
            style="margin-right: 10px;"
            @click="getExaminationQuestions"
          ></Button>
          <Button
            icon="md-close"
            type="error"
            ghost
            size="large"
            shape="circle"
            @click="cancelExamination"
          ></Button>
        </span>
      </header>

      <article>
        <exerciseModule
          :type="0"
          :data="examinationQuestionsData"
          @nextQuestion="getExaminationQuestions"
          @stopTime="stopTime"
          @openTime="openTime"
          @setTime="setTime"
          @onClcikReset="onClcikReset"
        />
      </article>
    </div>
  </div>
</template>

<script>
// type 0 考核
import exerciseModule from "@/pages/exercises/exerciseModule";

export default {
  components: {
    exerciseModule
  },
  data() {
    return {
      isLastQuestion: false,
      isStartExamination: false,
      assessmentData: [],
      userInfo: null,
      queryData: {
        page_index: -1
      },
      examinationQuestionsData: [],
      countDown: "00:00",
      currentSeconds: 0,
      t: null,
      timeBtnType: false
    };
  },
  created() {
    this.isLastQuestion = false;
    this.isStartExamination = false;
    this.getUserInfo();
  },
  beforeDestroy() {
    if (this.t) {
      clearInterval(this.t);
    }
    this.isStartExamination = false;
    this.assessmentData = [];
    this.userInfo = null;
    this.queryData = {
      page_index: -1
    };
    this.examinationQuestionsData = [];
    this.countDown = "00:00";
    this.currentSeconds = 0;
    this.t = null;
    this.timeBtnType = false;
    this.isLastQuestion = false;
  },
  methods: {
    onClcikReset() {
      this.isStartExamination = !this.isStartExamination;
    },
    cancelExamination() {
      if (this.t) {
        clearInterval(this.t);
      }
      this.queryData.page_index = -1;
      this.isStartExamination = !this.isStartExamination;
    },
    onClickStartExamination() {
      this.getExaminationQuestions();
      this.isStartExamination = !this.isStartExamination;
    },
    openTime() {
      let i = this.currentSeconds === 0 ? 30 : this.currentSeconds;
      if (this.examinationQuestionsData[0].the_answer === undefined) {
        this.t = setInterval(() => {
          let k = --i;
          this.currentSeconds = k;
          if (k > 9) {
            this.countDown = `00:${k}`;
          } else {
            this.timeBtnType = k % 2 === 0 ? true : false;
            this.countDown = `00:0${k}`;
          }
          if (i === 0) {
            this.timeBtnType = false;
            this.countDown = `00:00`;
            clearInterval(this.t);
            i = 30;
            this.currentSeconds = 0;
            this.unansweredExaminationAnswer();
          }
        }, 1000);
      }
    },
    stopTime() {
      if (this.t) {
        clearTimeout(this.t);
      }
    },
    getExaminationQuestions() {
      this.$LoadingBar.start();
      this.stopTime();
      let q = this.queryData;
      let data = {
        page_index: ++q.page_index
      };
      this.$api.learning
        .getExaminationQuestions(data)
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data;
            if (list === "") {
              this.stopTime();
            } else {
              if (JSON.stringify(list.data_info) === "[]") {
                this.$Message.warning(this.$t("tip.lastQuestion"));
                this.queryData.page_index = -1;
              } else {
                this.examinationQuestionsData = list.data_info;
                if (list.data_info[0].the_answer === undefined) {
                  this.setTime();
                }
              }
            }

            this.$LoadingBar.finish();
          } else if (res.data.code === 112) {
            this.$LoadingBar.finish();
            let list = res.data.data;
            if (list === "") {
              this.stopTime();
              this.isStartExamination = false;
            }
          }
          this.$LoadingBar.finish();
        })
        .catch(error => {
          this.$LoadingBar.error();
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    setTime() {
      let i = 30;
      this.t = setInterval(() => {
        let k = --i;
        this.currentSeconds = k;
        if (k > 9) {
          this.countDown = `00:${k}`;
        } else {
          this.timeBtnType = k % 2 === 0 ? true : false;
          this.countDown = `00:0${k}`;
        }
        if (i === 0) {
          this.timeBtnType = false;
          this.countDown = `00:00`;
          clearInterval(this.t);
          i = 30;
          this.currentSeconds = 0;
          this.unansweredExaminationAnswer();
        }
      }, 1000);
    },
    unansweredExaminationAnswer() {
      console.log(
        "父组件 code = 10 getExaminationQuestionsAnswer",
        this.countDown
      );
      let data = {
        _id: this.examinationQuestionsData[0]._id,
        answer: [10]
      };
      this.$api.learning
        .getExaminationQuestionsAnswer(data)
        .then(res => {
          if (res.data.code === 96) {
            this.getExaminationQuestions();
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    getUserInfo() {
      let store = this.$store.state;
      if (
        store.resolveUserInformation !== null ||
        store.resolveUserInformation === undefined
      ) {
        if (store.resolveUserInformation.obj !== null) {
          this.userInfo = store.resolveUserInformation.obj;
        }
      }
    }
  }
};
</script>
 
<style lang="less" scoped>
.assessment-box {
  .single-page-container;
}

.view-box {
  margin: 0 20px;
  height: 90%;
  background-color: white;
  box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
  -webkit-box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
  -moz-box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
  -o-box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
  -ms-box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);

  div:last-child {
    font-size: 20px;
    cursor: pointer;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: black;
    transition: all 0.3 linear;

    &:hover {
      font-weight: 600;
      color: rgb(65, 184, 131);
    }
  }
}

.box {
  margin: 0 20px;
  height: 90%;
  background-color: white;
  box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
  -webkit-box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
  -moz-box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
  -o-box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
  -ms-box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
  overflow-x: hidden;
  overflow-y: scroll;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */

  // 滚动条整体部分，可以设置宽度等
  &::-webkit-scrollbar {
    display: none;
  }
}

header {
  padding: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;

  strong {
    font-size: 20px;
  }
}

article {
  position: relative;
  height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
</style>