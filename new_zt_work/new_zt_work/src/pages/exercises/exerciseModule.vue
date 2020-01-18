<!-- 习题模块 -->

<template>
  <div class="exerciseModule-box-error" v-if="data.length === 0">
    <span>加载失败...</span>
  </div>
  <div class="exerciseModule-box" v-else>
    <header>
      <nav>
        <span>{{$t("tip.title")}}</span>
        <span>{{ currentData.item_content }}</span>
        <span>({{ setQuestionType(currentData.question_types) }})</span>
      </nav>
    </header>

    <article>
      <div class="content">
        <p
          ref="item"
          class="item"
          v-for="(item, index) in currentData.options"
          :key="index"
          @click="onClickItem(index, item._id, item.serial_number)"
        >
          <span>{{ item.serial_number }}</span>
          <span>{{ item.option }}</span>
        </p>
      </div>
      <p class="answer-remark" v-if="currentData.answer_remark !== undefined">
        <span>{{$t("tip.remarks")}}</span>
        <span>{{ currentData.answer_remark }}</span>
      </p>
      <div class="user-answer" v-if="currentData.the_answer !== undefined">
        <p v-for="(k, j) in currentData.the_answer" :key="j">
          <span style>{{ $t("tip.userSelectedItems") }}</span>
          <span v-if="k > currentData.options.length">{{$t("statusCode.noAnswer")}}</span>
          <span v-else>{{ `${k}、${currentData.options[k-1].option}` }}</span>
        </p>
      </div>
    </article>

    <footer>
      <Button
        type="info"
        :disabled="submitDisabled"
        v-if="currentData.question_types === 2"
        long
        @click="submitAnswers"
      >{{$t("btn.confirm")}}</Button>

      <Button
        class="animated fade fadeIn"
        style="margin: 15px 0"
        long
        @click="nextQuestion"
      >{{$t("btn.nextQuestion")}}</Button>

      <Button
        type="primary"
        v-if="type === 0"
        long
        @click="assessmentSubmittedModal"
      >{{$t("btn.submitAnswers")}}</Button>

      <div class="view-box">
        <div class="color">
          <Tooltip v-for="(d, z) in tooltipData" :key="z" :content="d.content" placement="bottom">
            <div
              :style="{display: 'inline-block',width:'60px',height:'20px',backgroundColor: d.color}"
            ></div>
          </Tooltip>
        </div>
        <Button type="dashed" @click="checkItemBank">{{$t("tip.checkItemBank")}}</Button>
      </div>
    </footer>

    <div ref="questionLibrary">
      <questionLibrary
        :type="type"
        :allTopics="allTopics"
        @hiddenQuestionLibrary="hiddenQuestionLibrary"
        @onClickCheck="onClickCheck"
        @deleteAnswerRecord="deleteAnswerRecord"
        @openTime="openTime"
      />
    </div>

    <Modal
      v-model="isFraction"
      :closable="false"
      :mask-closable="false"
      :fullscreen="false"
      :mask="false"
      :title="$t('tip.totalScore')"
    >
      <div class="fraction-box">
        <div class="item">
          <p>{{$t("tip.totalScore")}}:</p>
          <p>{{totalScore === null ? null : totalScore}}</p>
        </div>
        <div class="item-btn">
          <Button type="primary" long @click="onClickCancel">{{ $t('btn.close') }}</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import questionLibrary from "./questionLibrary";

export default {
  props: {
    type: Number, //  2 随机练习，1 顺序练习, 0 考核
    data: Array
  },
  components: {
    questionLibrary
  },
  data() {
    return {
      alertType: "info",
      currentData: [],
      multipleChoiceAnswers: [],
      multipleChoiceAnswers2: [],
      userInfo: null,
      isError: false,
      checkAnswer: false,
      submitDisabled: false,
      allTopics: [],
      showTopicContent: false,
      tooltipData: [
        {
          color: "#01fd7e",
          content: "正确答案"
        },
        {
          color: "#ed4014",
          content: "错误答案"
        },
        {
          color: "#ff912a",
          content: "您选择的答案"
        }
      ],
      isAnswer: false,
      isFraction: false,
      totalScore: null,
      setTimeoutStyle: null
    };
  },
  watch: {
    data: function(newVal, oldVal) {
      console.log(newVal, " 数据 <=================>", oldVal);
      this.currentData = newVal[0];

      let item = this.$refs.item;
      if (this.$refs.item) {
        item.map((item, index) => {
          this.$refs.item[index].className = "item";
        });
      }

      if (this.currentData.the_answer !== undefined) {
        this.isAnswer = true;
        this.submitDisabled = true;
      }
    },
    isAnswer: function(newVal, oldVal) {
      console.log(newVal, " 是否已回答 <------------------", oldVal);

      if (newVal) {
        this.setTimeoutAnswer = setTimeout(() => {
          this.setAnswerStyle();
          this.isAnswer = false;
        }, 1000);
      }
    },
    showTopicContent: function(newVal, oldVal) {
      console.log(newVal, " 点击查看题目详情 <------------------", oldVal);

      if (newVal) {
        this.setAnswerStyle();
        this.submitDisabled = true;
        this.showTopicContent = false;
      }
    },
    checkAnswer: function(newVal, oldVal) {
      console.log(newVal, " 点击查看题目答案 <------------------", oldVal);

      if (newVal) {
        this.setAnswerStyle();
        this.submitDisabled = true;
        this.checkAnswer = false;
      }
    }
  },
  created() {
    this.submitDisabled = false;
    this.checkAnswer = false;
    this.getUserInfo();
  },
  beforeDestroy() {
    if (this.setTimeoutAnswer) {
      clearTimeout(this.setTimeoutAnswer);
    }
    if (this.setTimeoutStyle) {
      clearTimeout(this.setTimeoutStyle);
    }
  },
  methods: {
    onClickCancel() {
      this.$emit("stopTime");
      this.isFraction = !this.isFraction;
      this.$emit("onClcikReset");
    },
    openTime() {
      this.$emit("openTime");
    },
    assessmentSubmitted() {
      this.$api.learning
        .submitPapers({
          user_id: this.userInfo.user_id
        })
        .then(res => {
          if (res.data.code === 0) {
            this.$emit("stopTime");
            this.$Modal.remove();
            this.totalScore = res.data.data[0].Score;
            this.isFraction = !this.isFraction;

            this.$Message.success(this.$t("statusCode.submitSuccessfuly"));
          } else {
            this.$Modal.remove();
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    assessmentSubmittedModal() {
      this.$Modal.confirm({
        title: this.$t("btn.confirmSubmission"),
        render: h => {
          return h("div", [
            h(
              "div",
              {
                slot: "footer",
                style: {
                  width: "100%",
                  height: "55px",
                  lineHeight: "55px",
                  paddingTop: "10px",
                  paddingBottom: "10px"
                }
              },
              [
                h(
                  "Button",
                  {
                    props: {
                      type: "primary"
                    },
                    style: {
                      float: "right",
                      "margin-top": "10px",
                      "margin-bottom": "10px"
                    },
                    on: {
                      click: () => {
                        this.assessmentSubmitted();
                      }
                    }
                  },

                  this.$t("tip.determine")
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "text"
                    },
                    style: {
                      float: "right",
                      "margin-top": "10px",
                      "margin-bottom": "10px"
                    },
                    on: {
                      click: () => {
                        this.$Modal.remove();
                      }
                    }
                  },
                  this.$t("tip.cancel")
                )
              ]
            )
          ]);
        }
      });
    },
    deleteAnswerRecord() {
      this.$api.learning
        .deleteAnswerRecord({
          user_id: this.userInfo.user_id,
          bz: this.type
        })
        .then(res => {
          if (res.data.code === 0) {
            this.$Message.success(this.$t("tip.successfulEliminate"));
            this.hiddenQuestionLibrary();
            this.$emit("nextQuestion");
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    onClickCheck(id) {
      if (this.type === 1 || this.type === 2) {
        let data = {
          _id: id,
          user_id: this.userInfo.user_id,
          bz: this.type
        };

        let item = this.$refs.item;

        if (this.$refs.item) {
          item.map((item, index) => {
            this.$refs.item[index].className = "item";
          });
        }

        this.$api.learning
          .displayTopics(data)
          .then(res => {
            if (res.data.code === 0) {
              let list = res.data.data;
              this.currentData = list[0];

              if (list[0].answer === undefined) {
                this.showTopicContent = false;
              } else {
                this.showTopicContent = true;
              }
            }
          })
          .catch(error => {
            this.$Message.error(this.$t("tip.requestError"));
          });
      } else {
        let data = {
          _id: id
        };
        this.$api.learning
          .chaeckExamination(data)
          .then(res => {
            if (res.data.code === 0) {
              let list = res.data.data;
              this.currentData = list[0];
              this.checkAnswer = true;

              if (list[0].the_answer === undefined) {
                this.$emit("setTime");
              } else {
                this.$emit("stopTime");
              }

              if (list[0].answer !== undefined) {
                this.showTopicContent = true;
              }
            }
          })
          .catch(error => {
            this.$Message.error(this.$t("tip.requestError"));
          });
      }
    },
    hiddenQuestionLibrary() {
      this.$refs.questionLibrary.className =
        "hidden-questionLibrary-box animated fade fadeOutDownBig";
    },
    checkItemBank() {
      if (this.type === 1 || this.type === 2) {
        this.$LoadingBar.start();
        let data = {
          user_id: this.userInfo.user_id,
          bz: this.type
        };

        this.$api.learning
          .viewStatus(data)
          .then(res => {
            if (res.data.code === 0) {
              let list = res.data.data;
              if (list.length !== 0) {
                this.allTopics = list;
                this.$refs.questionLibrary.className =
                  "show-questionLibrary-box animated fade fadeInUpBig";
              }
              this.$LoadingBar.finish();
            }
            this.$LoadingBar.finish();
          })
          .catch(error => {
            this.$LoadingBar.error();
            this.$Message.error(this.$t("tip.requestError"));
          });
      } else {
        this.$LoadingBar.start();
        let c = this.$refs.questionLibrary.className;
        if (!this.$RegExp.verifyIsNull(c)) {
          this.$emit("stopTime");
        }

        let data = {
          _id: this.currentData._id,
          user_id: this.userInfo.user_id
        };

        this.$api.learning
          .getExamination(data)
          .then(res => {
            if (res.data.code === 0) {
              let list = res.data.data;
              if (list.length !== 0) {
                this.allTopics = list;
                this.$refs.questionLibrary.className =
                  "show-questionLibrary-box animated fade fadeInUpBig";
              }
              this.$LoadingBar.finish();
            }
            this.$LoadingBar.finish();
          })
          .catch(error => {
            this.$LoadingBar.start();
            this.$Message.error(this.$t("tip.requestError"));
          });
      }
    },
    nextQuestion() {
      this.submitDisabled = false;
      this.checkAnswer = false;
      this.$emit("nextQuestion");
    },
    onClickItem(index, id, answer) {
      if (this.currentData.the_answer !== undefined) {
        this.$Message.warning(this.$t("statusCode.answered"));
        return;
      }

      // this.type  2随机练习，1顺序练习，0考核
      // this.currentData.question_types 1:单选题，2:多选题，3:判断题
      let c = this.currentData;
      let bg = this.$refs.item[index].className;

      if (bg === "item") {
        this.$refs.item[index].className = "active";
      } else {
        this.$refs.item[index].className = "item";
      }

      if (c.question_types === 1 || c.question_types === 3) {
        if (this.type === 2 || this.type === 1) {
          let data = {
            user_id: this.userInfo.user_id,
            _id: c._id,
            answer: [answer],
            bz: this.type
          };
          this.titleAnswer(data);
        } else if (this.type === 0) {
          let data = {
            _id: c._id,
            answer: [answer]
          };

          this.examinationQuestionAnswer(data);
        }
      } else if (c.question_types === 2) {
        if (this.type === 2 || this.type === 1) {
          let c = this.$refs.item[index].className;
          if (c === "active") {
            this.multipleChoiceAnswers.push(answer);
          } else if (c === "item") {
            let len = this.multipleChoiceAnswers;
            let cur = JSON.parse(JSON.stringify(this.multipleChoiceAnswers));
            for (let i = 0; i < len.length; i++) {
              if (len[i] === answer) {
                cur.splice(i, 1);
              }
            }
            this.multipleChoiceAnswers = cur;
          }
        } else {
          let c = this.$refs.item[index].className;
          if (c === "active") {
            this.multipleChoiceAnswers2.push(answer);
          } else if (c === "item") {
            let len = this.multipleChoiceAnswers2;
            let cur = JSON.parse(JSON.stringify(this.multipleChoiceAnswers2));
            for (let i = 0; i < len.length; i++) {
              if (len[i] === answer) {
                cur.splice(i, 1);
              }
            }
            this.multipleChoiceAnswers2 = cur;
          }
        }
      }
    },
    examinationQuestionAnswer(data) {
      console.log("子组件  获取考核题答题");
      if (data.answer.length === 0) {
        this.$Message.warning(
          `${this.$t("tip.pleaseSelect")}${this.$t("tip.answersToQuestions")}`
        );
        return;
      }
      this.$api.learning
        .getExaminationQuestionsAnswer(data)
        .then(res => {
          if (res.data.code === 83) {
            this.$emit("nextQuestion");
          } else if (res.data.code === 86) {
            let list = res.data.data;
            this.currentData = list[0];

            if (list[0].the_answer === undefined) {
            } else {
              this.$emit("stopTime");
              this.checkAnswer = true;
            }
          }
        })
        .catch(error => {
          console.log(error);
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    submitAnswers() {
      if (this.type === 2 || this.type === 1) {
        let c = this.currentData;
        let data = {
          user_id: this.userInfo.user_id,
          _id: c._id,
          answer: this.multipleChoiceAnswers,
          bz: this.type
        };
        this.titleAnswer(data);
      } else {
        let data = {
          _id: this.currentData._id,
          answer: this.multipleChoiceAnswers2
        };

        this.examinationQuestionAnswer(data);
      }
    },
    titleAnswer(data) {
      if (data.answer.length === 0) {
        this.$Message.warning(
          `${this.$t("tip.pleaseSelect")}${this.$t("tip.answersToQuestions")}`
        );
        return;
      }
      this.$api.learning
        .questionBankAnswer(data)
        .then(res => {
          if (res.data.code === 83) {
            this.$emit("nextQuestion");
          } else if (res.data.code === 86) {
            let list = res.data.data;
            this.currentData = list[0];
            this.checkAnswer = true;
          }
        })
        .catch(error => {
          console.log(error);
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    setAnswerStyle() {
      let answer = this.currentData.answer,
        option = this.currentData.options;

      if (this.setTimeoutStyle) {
        clearTimeout(this.setTimeoutStyle);
      }

      this.setTimeoutStyle = setTimeout(() => {
        option.map((item, index) => {
          this.$refs.item[index].className = "error";

          let txt = option[index].serial_number;
          answer.map((k, j) => {
            if (parseInt(txt) === parseInt(k)) {
              this.$refs.item[index].className = "correct";
            }
          });
        });
      }, 500);
    },
    setQuestionType(val) {
      let text = ["单选题", "多选题", "判断题"],
        t = null;
      if (val === 1) {
        t = text[0];
      } else if (val === 2) {
        t = text[1];
      } else if (val === 3) {
        t = text[2];
      }
      return t;
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
.exerciseModule-box {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 30px;
  background-color: white;
  box-sizing: content-box;
}

.correct {
  margin: 10px 0;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  color: #fff;
  background-color: #01fd7e;
  transition: background-color 0.2s ease-in-out;

  span:first-child {
    font-weight: 600;

    &::after {
      content: "、";
    }
  }

  &:hover {
    color: #333;
    font-weight: 600;
    background-color: rgb(245, 245, 245);
  }
}

.check-answer {
  margin: 10px 0;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  color: #fff;
  background-color: #ff912a;
  transition: background-color 0.2s ease-in-out;

  span:first-child {
    font-weight: 600;

    &::after {
      content: "、";
    }
  }

  &:hover {
    color: #333;
    font-weight: 600;
    background-color: rgb(245, 245, 245);
  }
}

.error {
  margin: 10px 0;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  color: #fff;
  background-color: #ed4014;
  transition: background-color 0.2s ease-in-out;

  span:first-child {
    font-weight: 600;

    &::after {
      content: "、";
    }
  }

  &:hover {
    color: #333;
    font-weight: 600;
    background-color: rgb(245, 245, 245);
  }
}

.no-active {
  background-color: white;
}

.active {
  margin: 10px 0;
  padding: 10px;
  font-size: 16px;
  color: #666;
  cursor: pointer;
  background-color: #f5f5f5;
  transition: background-color 0.2s ease-in-out;

  span:first-child {
    font-weight: 600;

    &::after {
      content: "、";
    }
  }

  &:hover {
    color: #333;
    font-weight: 600;
    background-color: rgb(245, 245, 245);
  }
}

header {
  nav {
    padding: 10px;
    font-size: 16px;
    font-weight: 600;
    background-color: rgb(245, 245, 245);

    span:first-child {
      color: black;

      &::after {
        content: ":";
      }
    }

    span:last-child {
      color: #aaa;
      font-weight: 400;
    }
  }
}

.item {
  margin: 10px 0;
  padding: 10px;
  font-size: 16px;
  color: #666;
  cursor: pointer;
  background-color: white;
  transition: background-color 0.2s ease-in-out;

  span:first-child {
    font-weight: 600;

    &::after {
      content: "、";
    }
  }

  //   &:link {
  //     color: #666;
  //     background-color: white;
  //   }

  //   &:visited {
  //     color: #666;
  //     background-color: white;
  //   }

  &:hover {
    color: #333;
    font-weight: 600;
    background-color: rgb(245, 245, 245);
  }

  //   &:active {
  //     color: black;
  //     background-color: rgb(230, 230, 230);
  //   }
}

article {
  padding: 25px 0;

  .content {
    padding: 5px;
  }

  .answer-remark {
    padding: 10px 0;
    font-size: 16px;

    span:first-child {
      font-weight: 600;
      margin-right: 10px;

      &::after {
        content: ":";
      }
    }
  }
}

footer {
  padding: 20px 0;

  .view-box {
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.show-questionLibrary-box {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 1;
  z-index: 10;
}

.hidden-questionLibrary-box {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 0;
}

.user-answer {
  padding: 10px 0;
  font-size: 16px;
  color: black;

  p {
    span:last-child {
      color: #ff912a;
    }
  }
}

.exerciseModule-box-error {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  box-sizing: content-box;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 100px;
  padding-left: 82px;
  font-size: 25px;
}

.fraction-box {
  padding: 10px;

  .item {
    padding: 10px;
    font-size: 16px;
  }

  .item-btn {
    padding: 20px 0;
  }
}
</style>