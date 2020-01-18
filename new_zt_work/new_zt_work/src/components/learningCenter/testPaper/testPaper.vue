<!-- 试卷 -->

<template>
  <div class="testPaper-box">
    <div class="testPaper-body">
      <DefaultTable
        :isPage="true"
        :isSelection="false"
        :columnsList="columnsList"
        :dataList="dataList"
        :loading="loading"
        :queryData="queryData"
        @handleSizeChange="handleSizeChange"
        @handleIndexChange="handleIndexChange"
      />
    </div>

    <Modal width="600px" v-model="isViewCompleteTestPapaer" :title="$t('tip.completeTestPaper')">
      <div class="completeTestPaper-box">
        <div class="item-box">
          <div v-if="completeTestPaperData.length === 0" class="item-null">
            <span>{{$t("statusCode.queryFailed")}}</span>
          </div>
          <div class="item" v-else>
            <div class="item-button">
              <div>
                <Button
                  type="primary"
                  size="small"
                  @click="() => isAddSubject = !isAddSubject"
                >{{ `${$t('btn.newlyAdded')}` }}</Button>
              </div>
              <div>
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
            </div>
            <div class="info-box-auto">
              <div class="info-box" v-for="(item, index) in completeTestPaperData" :key="index">
                <div class="info">
                  <div class="title">
                    <Icon
                      :type="item.isShow ? 'md-arrow-dropup-circle' : 'md-arrow-dropdown-circle'"
                      color="#3eaf7c"
                      style="vertical-align: sub;cursor: pointer;"
                      size="20"
                      @click="onClickIsShow(item)"
                    />
                    <Icon
                      type="md-trash"
                      style="vertical-align: sub;cursor: pointer;"
                      color="#ed4014"
                      size="20"
                      @click="onClickDelete(item)"
                    />
                    {{ `${index+1}、${$t('tip.title')}:${item.item_content}` }}
                    <span>{{ `(${setQuestionType(item.question_types)})` }}</span>
                  </div>
                  <div class="content" v-show="item.isShow">
                    <p
                      v-for="(opt, j) in item.options"
                      :key="j"
                    >{{ `${opt.serial_number}、${opt.option}` }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="item-btn">
            <Button long @click="onClose">{{ $t("btn.close") }}</Button>
          </div>
        </div>
      </div>
    </Modal>

    <Modal
      width="650px"
      @on-visible-change="onVisibleChangeAddModal"
      v-model="isAddSubject"
      :title="$t('btn.newlyAdded')"
    >
      <addSubject @esc="esc" :data="questionBankData" :id="completeTestPaperId" />
    </Modal>
  </div>
</template>

<script>
import addSubject from "@/pages/testPaper/viewAndAdd";

export default {
  components: {
    addSubject
  },
  name: "testPaper",
  data() {
    return {
      queryData: {
        page_index: 1,
        page_size: 10,
        count: 0
      },
      queryQuestionBank: {
        page_index: 1,
        page_size: 1000,
        question_types: 0
      },
      queryDepartmentData: {
        name: "",
        page_index: 1,
        page_size: 1000
      },
      loading: false,
      isViewCompleteTestPapaer: false,
      isAddSubject: false,
      dataList: [],
      questionBankData: [],
      departmentData: [],
      completeTestPaperData: [],
      completeTestPaperId: null,
      currentTableCompleteTestPaperId: null,
      columnsList: [
        {
          title: "序号",
          type: "index",
          align: "center",
          minWidth: 80,
          sortable: true
        },
        {
          title: "试卷名称",
          key: "test_paper_name",
          minWidth: 150,
          align: "center",
          sortable: true
        },
        {
          title: "上传人",
          key: "author",
          minWidth: 100,
          align: "center",
          sortable: true
        },
        {
          title: "部门",
          key: "department_id",
          minWidth: 100,
          align: "center",
          sortable: true,
          render: (h, params) => {
            let d = params.row.department_id,
              v = null,
              dep = this.departmentData;
            for (let i = 0; i < dep.length; i++) {
              if (dep[i].id === d) {
                v = dep[i].name;
              }
            }
            return h("span", v);
          }
        },
        {
          title: "题目",
          key: "question_id",
          minWidth: 200,
          align: "center",
          sortable: true,
          render: (h, params) => {
            let q = params.row.question_id,
              que = this.questionBankData,
              u = [];
            for (let i = 0; i < que.length; i++) {
              for (let j = 0; j < q.length; j++) {
                if (q[j] === que[i]._id) {
                  u.push(que[i].item_content);
                }
              }
            }
            return h(
              "div",
              {
                style: {
                  textAlign: "left",
                  maxHeight: "200px",
                  overflow: "auto"
                }
              },
              u.map((item, index) => {
                return h(
                  "p",
                  {
                    style: {
                      padding: "4px 0"
                    }
                  },
                  `${parseInt(index + 1)}、${item}`
                );
              })
            );
          }
        },
        {
          title: "操作",
          minWidth: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "info",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.getCheckTestPaperInfo(params.row._id);
                    }
                  }
                },
                `${this.$t("tip.see")}${this.$t("tip.completeTestPaper")}`
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.deleteTestPaperModal(params.row._id);
                    }
                  }
                },
                this.$t("btn.delete")
              )
            ]);
          }
        }
      ]
    };
  },
  created() {
    this.getDepartmentData();
    this.getQuestionBank();
    this.getCheckTestPaper();
  },
  beforeDestroy() {
    this.queryData = {
      page_index: 1,
      page_size: 10,
      count: 0
    };
    this.queryQuestionBank = {
      page_index: 1,
      page_size: 1000,
      question_types: 0
    };
    this.queryDepartmentData = {
      name: "",
      page_index: 1,
      page_size: 1000
    };
    this.loading = false;
    this.isViewCompleteTestPapaer = false;
    this.isAddSubject = false;
    this.dataList = [];
    this.questionBankData = [];
    this.departmentData = [];
    this.completeTestPaperData = [];
    this.completeTestPaperId = null;
    this.currentTableCompleteTestPaperId = null;
  },
  methods: {
    onVisibleChangeAddModal(val) {
      if (!val) {
        this.esc();
      }
    },
    esc() {
      this.getCheckTestPaperInfo(this.currentTableCompleteTestPaperId);
      this.isAddSubject = false;
    },
    onClickDelete(item) {
      this.$LoadingBar.start();
      let d = {
        _id: item._id,
        test_paper_id: this.completeTestPaperId
      };

      this.$api.learning
        .deleteTestPaperOne(d)
        .then(res => {
          if (res.data.code === 0) {
            this.$LoadingBar.finish();
            this.$Message.success(this.$t("tip.deleteSuccess"));
            this.getCheckTestPaperInfo(this.currentTableCompleteTestPaperId);
          }
          this.$LoadingBar.finish();
        })
        .catch(() => {
          this.$LoadingBar.error();
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    onClickIsShow(item) {
      let d = this.completeTestPaperData;
      for (let i = 0; i < d.length; i++) {
        if (item._id === d[i]._id) {
          if (d[i].isShow) {
            this.completeTestPaperData[i].isShow = false;
          } else {
            this.completeTestPaperData[i].isShow = true;
          }
        }
      }
      this.$forceUpdate();
    },
    onClose() {
      this.getCheckTestPaper();
      this.isViewCompleteTestPapaer = !this.isViewCompleteTestPapaer;
      this.completeTestPaperData = [];
    },
    onClickUnfoldAll(val) {
      let t = this.completeTestPaperData;
      if (val === "open") {
        for (let i = 0; i < t.length; i++) {
          this.completeTestPaperData[i].isShow = true;
        }
      } else {
        for (let i = 0; i < t.length; i++) {
          this.completeTestPaperData[i].isShow = false;
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
    getCheckTestPaperInfo(id) {
      this.$LoadingBar.start();
      this.currentTableCompleteTestPaperId = id;
      this.$api.learning
        .checkTestPaperInfo({
          _id: id
        })
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data;
            this.completeTestPaperData = list.data_info;
            this.completeTestPaperId = list.test_paper_id;

            for (let i = 0; i < this.completeTestPaperData.length; i++) {
              this.completeTestPaperData[i].isShow = false;
            }

            this.isViewCompleteTestPapaer = true;
            this.$LoadingBar.finish();
          }
          this.$LoadingBar.finish();
        })
        .catch(() => {
          this.$LoadingBar.error();
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    deleteTestPaperSumbit(id) {
      this.loading = true;
      this.$api.learning
        .deleteTestPaper({
          _id: id
        })
        .then(res => {
          if (res.data.code === 0) {
            this.$Modal.remove();
            this.loading = false;
            this.$Message.success(this.$t("tip.deleteSuccess"));
            this.getCheckTestPaper();
          }
          this.loading = false;
        })
        .catch(() => {
          this.$Modal.remove();
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    deleteTestPaperModal(id) {
      this.$Modal.confirm({
        title: this.$t("tip.confirmationDelete"),
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
                        this.deleteTestPaperSumbit(id);
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
    getQuestionBank() {
      let q = this.queryQuestionBank;
      let data = {
        page_index: q.page_index,
        page_size: q.page_size,
        question_types: q.question_types
      };

      this.$api.learning
        .getQuestionBank(data)
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data;
            this.questionBankData = list.data_info;
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    getCheckTestPaper() {
      this.loading = true;
      this.$api.learning
        .checkTestPaper({
          page_index: this.queryData.page_index,
          page_size: this.queryData.page_size
        })
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data;
            this.loading = false;
            this.dataList = list.data_info;
            this.queryData.count = list.page_count;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    handleSizeChange(val) {
      this.queryData.page_index = 1;
      this.queryData.page_size = val;
      this.checkTestPaper();
    },
    handleIndexChange() {
      this.queryData.page_index = val;
      this.checkTestPaper();
    }
  }
};
</script>

<style lang="less" scoped>
.testPaper-box {
  .single-page-container;

  .testPaper-header {
    .header;

    .header-left {
      float: left;
    }

    .header-right {
      float: right;
      display: flex;
    }
  }

  .testPaper-body {
    .body;
  }
}

.completeTestPaper-box {
  width: 100%;

  .item-box {
    width: 100%;

    .item-null {
      padding: 20px 0;
      text-align: center;
      font-size: 14px;
    }

    .item-btn {
      padding: 10px 0;
      text-align: right;
    }

    .item {
      padding: 10px 0;
    }
  }
}

.item-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: right;
}

.info-box {
  padding: 10px 0;
  font-size: 14px;

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
}

.info-box-auto {
  max-height: 500px;
  overflow: auto;
}

.content {
  padding: 5px 0 5px 60px;

  p {
    padding: 4px 0;
  }
}
</style>