<!-- 试卷增加题目组件 -->

<template>
  <div class="addSubject-box">
    <div class="list-box">
      <div class="item-button">
        <Button
          size="small"
          type="text"
          style="margin-right:10px;"
          @click="onClickUnfoldAll('open')"
        >{{ $t("tip.unfoldAll") }}</Button>
        <Button
          size="small"
          type="text"
          @click="onClickUnfoldAll('close')"
        >{{ $t("tip.alltelescopic") }}</Button>
      </div>
      <div class="list-item-box">
        <div v-for="(item, index) in data" :key="index">
          <div class="info">
            <div class="title">
              <Icon
                :type="item.isShow ? 'md-arrow-dropup-circle' : 'md-arrow-dropdown-circle'"
                color="#3eaf7c"
                style="vertical-align: sub;cursor: pointer;"
                size="20"
                @click="onClickIsShow(item)"
              />
              {{ `${index+1}、${$t('tip.title')}:${item.item_content}` }}
              <span>{{ `(${setQuestionType(item.question_types)})` }}</span>
              <Icon
                type="md-add-circle"
                style="margin-left:10px;vertical-align: sub;cursor: pointer;"
                color="#2db7f5"
                size="20"
                @click="onClickAdd(item)"
              />
            </div>
            <div class="content" v-show="item.isShow">
              <p
                v-for="(opt, j) in item.options"
                :key="j"
              >{{ `${opt.serial_number}、${opt.option}` }}</p>
              <p class="answer-remark">
                <span>{{$t("tip.remarks")}}</span>
                <span>{{ item.answer_remark }}</span>
              </p>
              <div class="user-answer">
                <p v-for="(k, j) in item.answer" :key="j">
                  <span style>{{ $t("tip.answersToQuestions") }}</span>
                  <span v-if="k > item.options.length">{{$t("statusCode.queryFailed")}}</span>
                  <span v-else>{{ `${k}、${item.options[k-1].option}` }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="item-btn">
        <Button type="primary" @click="cancel" long>{{ $t('tip.complete') }}</Button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: Array,
    id: String
  },
  data() {
    return {};
  },
  methods: {
    cancel() {
      this.$emit("esc");
    },
    onClickAdd(item) {
      this.$api.learning
        .addQuestion({
          test_paper_id: this.id,
          _id: item._id
        })
        .then(res => {
          if (res.data.code === 0) {
            this.$Message.success(this.$t("tip.addSuccess"));
          }
        })
        .catch(() => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    onClickUnfoldAll(val) {
      let t = this.data;
      if (val === "open") {
        for (let i = 0; i < t.length; i++) {
          this.data[i].isShow = true;
        }
      } else {
        for (let i = 0; i < t.length; i++) {
          this.data[i].isShow = false;
        }
      }
      this.$forceUpdate();
    },
    setQuestionType(val) {
      let t = ["单选题", "多选题", "判断题"],
        v = null;
      switch (val) {
        case 1:
          v = t[0];
          return v;
          break;
        case 2:
          v = t[1];
          return v;
          break;
        case 3:
          v = t[2];
          return v;
          break;

        default:
          v = null;
          return v;
          break;
      }
    },
    onClickIsShow(item) {
      let d = this.data;
      for (let i = 0; i < d.length; i++) {
        if (item._id === d[i]._id) {
          if (d[i].isShow) {
            this.data[i].isShow = false;
          } else {
            this.data[i].isShow = true;
          }
        }
      }
      this.$forceUpdate();
    }
  }
};
</script>

<style lang="less" scoped>
.addSubject-box {
  width: 100%;
}
.list-item-box {
  width: 100%;
  height: 500px;
  overflow: auto;
}

.title {
  padding: 5px 0;
  transition: color 0.3s linear;

  &:hover {
    color: #3eaf7c;
  }

  span {
    color: #ccc;
  }
}

.content {
  padding: 5px 0 5px 20px;
  font-size: 14px;

  p {
    padding: 4px 0;
  }
}

.item-button {
  text-align: right;
  padding-right: 15px;
}

.item-btn {
  padding: 10px;
}

.answer-remark {
  padding: 5px 0;

  span:first-child:after {
    content: ":";
  }
}

.user-answer {
  padding: 5px 0;

  p {
    span:last-child {
      color: #3eaf7c;
    }
  }
}
</style>