<!-- 题库 -->

<template>
  <div class="questionBank-box">
    <div class="questionBank-header">
      <div class="header-left">
        <ButtonGroup>
          <Button type="error" :loading="delLoading" @click="batchDeletion">
            <Icon type="ios-trash" size="15" style="margin-top:-3px;" />
            {{$t("btn.batchDeletion")}}
          </Button>
          <Button type="info" @click="() => isUpload = !isUpload">
            <Icon type="ios-cloud-upload" size="15" style="margin-top:-3px;" />
            {{$t("btn.upload")}}
          </Button>
          <Button type="warning" :loading="delAllLoading" @click="emptyItemBank">
            <Icon type="md-close" size="15" style="margin-top:-3px;" />
            {{$t("tip.emptyItemBank")}}
          </Button>
          <Button type="primary" @click="selectPaper">
            <Icon type="ios-paper" size="15" style="margin-top:-3px;" />
            {{$t("tip.testPaper")}}
          </Button>
        </ButtonGroup>
      </div>
      <div class="header-right">
        <Select
          @on-change="searchData"
          style="margin-right:10px;width:150px;"
          v-model="queryData.question_types"
          :placeholder="$t('tip.pleaseInput')+$t('tip.titleOptions')"
        >
          <Option
            v-for="item in questionTypes"
            :value="item.value"
            :key="item.value"
            :label="item.label"
          ></Option>
        </Select>
      </div>
    </div>

    <div class="questionBank-body">
      <DefaultTable
        :isPage="true"
        :isSelection="true"
        :columnsList="columnsList"
        :dataList="dataList"
        :loading="loading"
        :queryData="queryData"
        @handleSizeChange="handleSizeChange"
        @handleIndexChange="handleIndexChange"
        @onSelectionChange="onSelectionChange"
      />
    </div>

    <Modal v-model="isEditData" :title="$t('tip.edit')">
      <div class="edit-data-box">
        <div class="item">
          <p>{{ `${$t('tip.pleaseInput')}${$t('tip.title')}` }}</p>
          <Input
            v-model="editData.item_content"
            :placeholder="$t('tip.pleaseInput')+$t('tip.title')"
            clearable
          />
        </div>
        <div class="item">
          <p>
            {{ `${$t('tip.pleaseInput')}${$t('tip.titleOptions')}` }}
            <Icon
              type="ios-add-circle-outline"
              @click="editDataTitleOptions"
              class="addTitleOptions"
              size="20"
              color="#41b883"
            />
          </p>
          <p class="item-option" v-for="(item, index) in editData.options" :key="index">
            <Input-number
              :max="100"
              :min="1"
              v-model="item.serial_number"
              style="width:50px;margin-right:10px;"
            ></Input-number>
            <Input
              v-model="item.option"
              :placeholder="$t('tip.pleaseInput')+$t('tip.titleOptions')"
            />
            <Icon
              class="addTitleOptions"
              @click="editDataDeleteOption(index)"
              type="md-trash"
              size="20"
              color="#ed4014"
            />
          </p>
        </div>
        <div class="item">
          <p>
            {{ `${$t('tip.pleaseInput')}${$t('tip.answersToQuestions')}` }}
            <Icon
              type="ios-add-circle-outline"
              @click="editDataAnswer"
              class="addTitleOptions"
              size="20"
              color="#41b883"
            />
          </p>
          <p class="item-answer" v-for="(an, index) in editData.answer" :key="index">
            <Input-number
              :max="100"
              :min="1"
              style="width:100%;"
              v-model="editData.answer[index]"
              :placeholder="$t('tip.pleaseInput')+$t('tip.answersToQuestions')"
            ></Input-number>
            <Icon
              class="addTitleOptions"
              @click="editDataDeleteAnswer(index)"
              type="md-trash"
              size="20"
              color="#ed4014"
            />
          </p>
        </div>
        <div class="item">
          <p>{{ $t('tip.pleaseEnterComments') }}</p>
          <Input
            type="textarea"
            :autosize="{minRows: 5,maxRows: 10}"
            v-model="editData.answer_remark"
            :placeholder="$t('tip.pleaseEnterComments')"
          />
        </div>
        <div class="item-btn">
          <Button @click="editCancel">{{ $t('tip.cancel') }}</Button>
          <Button
            :loading="subLoading"
            @click="editSumbit"
            style="margin-left: 10px;"
            type="primary"
          >{{ $t('tip.determine') }}</Button>
        </div>
      </div>
    </Modal>

    <Modal v-model="isUpload" :title="$t('btn.upload')">
      <div class="upload-box">
        <div class="item-upload">
          <Upload class="upload" action :before-upload="handleUpload" ref="upload">
            <div style="padding: 20px 0;">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>{{$t('tip.uploadItem')}}</p>
            </div>
          </Upload>
          <p v-if="file.name !== null">
            {{$t('tip.fileName')}}: {{ file.name }}
            <Icon
              type="md-trash"
              @click="deleteFile"
              size="20"
              color="#ed4014"
              style="margin-left:10px;vertical-align: sub"
            />
          </p>
        </div>
        <div class="item-btn">
          <Button
            long
            type="primary"
            :loading="uploadLoading"
            @click="uploadSubmit"
            style="margin-bottom:10px;"
          >{{$t('btn.confirmUpload')}}</Button>
          <Button @click="uploadCancel" long>{{ $t('tip.cancel') }}</Button>
        </div>
      </div>
    </Modal>

    <Modal v-model="selectPaperModal" :title="$t('tip.testPaper')">
      <div class="paper-box">
        <div class="item">
          <p>{{ `${$t('tip.pleaseInput')}${$t('tip.testPaper')}${$t('tip.name')}` }}</p>
          <Input
            v-model="addTestPaper.name"
            :placeholder="$t('tip.pleaseInput')+$t('tip.testPaper')+$t('tip.name')"
            style="width:100%;"
          />
        </div>
        <div class="item">
          <p>{{ `${$t('tip.pleaseSelect')}${$t('tip.departmentName')}` }}</p>
          <Select
            style="width:100%;"
            v-model="addTestPaper.departmentId"
            :placeholder="$t('tip.pleaseSelect')+$t('tip.departmentName')"
          >
            <Option
              v-for="item in departmentData"
              :value="item.id"
              :key="item.id"
              :label="item.name"
            ></Option>
          </Select>
        </div>
        <div class="item">
          <div class="item-len">
            总共
            <span>{{ dataList.length }}</span>
            题，已选
            <span>{{ selectAllData.length }}</span>
            题
          </div>
        </div>
        <div class="item-btn">
          <Button
            long
            type="primary"
            :loading="paperLoading"
            @click="paperSubmit"
            style="margin-bottom:10px;"
          >{{`${$t('btn.confirmUpload')}${$t('tip.testPaper')}`}}</Button>
          <Button @click="paperCancel" long>{{ $t('tip.cancel') }}</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import details from "@/pages/questionBankDetails/rowDetails";
import axios from "axios";

export default {
  name: "questionBank",
  data() {
    return {
      columnsList: [
        {
          type: "selection",
          minWidth: 60,
          align: "center"
        },
        {
          title: "序号",
          type: "index",
          minWidth: 80,
          align: "center",
          sortable: true
        },
        {
          type: "expand",
          minWidth: 50,
          render: (h, params) => {
            return h(details, {
              props: {
                row: params.row
              }
            });
          }
        },
        {
          align: "center",
          minWidth: 200,
          title: "题目名称",
          key: "item_content"
        },
        {
          align: "center",
          minWidth: 100,
          title: "题目类型",
          sortable: true,
          key: "question_types",
          render: (h, params) => {
            let txt = ["单选题", "多选题", "判断题"],
              t = null,
              c = params.row.question_types;
            if (c === 1) {
              t = txt[0];
            } else if (c === 2) {
              t = txt[1];
            } else {
              t = txt[2];
            }
            return h("span", t);
          }
        },
        {
          align: "center",
          minWidth: 200,
          title: "题目备注",
          key: "answer_remark"
        },
        {
          title: "操作",
          align: "center",
          key: "handle",
          minWidth: 100,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "info",
                    ghost: true
                  },
                  on: {
                    click: () => {
                      let p = params.row;
                      this.editData = {
                        _id: p._id,
                        item_content: p.item_content,
                        options: p.options,
                        answer: p.answer,
                        answer_remark: p.answer_remark
                      };
                      this.isEditData = true;
                    }
                  }
                },
                this.$t("tip.edit")
              )
            ]);
          }
        }
      ],
      queryData: {
        page_index: 1,
        page_size: 10,
        question_types: 0,
        count: 0
      },
      selectPaperModal: false,
      paperLoading: false,
      loading: false,
      dataList: [],
      cloneDataList: [],
      tableHeight: 520,
      isEditData: false,
      subLoading: false,
      delLoading: false,
      delAllLoading: false,
      isUpload: false,
      uploadLoading: false,
      selectAllData: [],
      questionBanUrl: "", // 练习题库
      assessQuestionBankUrl: "", // 考核题库
      file: {
        file: null,
        name: null
      },
      uploadData: {
        type: 1
      },
      editData: {
        _id: null,
        item_content: null,
        options: null,
        answer: null,
        answer_remark: null
      },
      type: [
        {
          value: 1,
          label: "练习题"
        },
        {
          value: 2,
          label: "考核题"
        }
      ],
      questionTypes: [
        {
          value: 0,
          label: "全选"
        },
        {
          value: 1,
          label: "单选题"
        },
        {
          value: 2,
          label: "多选题"
        },
        {
          value: 3,
          label: "判断题"
        }
      ],
      queryDepartmentData: {
        name: "",
        page_index: 1,
        page_size: 100
      },
      departmentData: [],
      addTestPaper: {
        departmentId: 0,
        name: null
      }
    };
  },
  created() {
    this.getQuestionBank();
    this.getDepartmentData();
  },
  mounted() {
    if (config.dev === "TEST") {
      this.questionBanUrl =
        "http://192.168.199.104:2213/learning_center/question_bank/upload";
    } else {
      this.questionBanUrl =
        "https://www.waterqm.com/learning_center/learning_center/question_bank/upload";
    }
  },
  beforeDestroy() {
    this.queryData = {
      page_index: 1,
      page_size: 10,
      question_types: 0,
      count: 0
    };
    this.loading = false;
    this.dataList = [];
    this.cloneDataList = [];
    this.tableHeight = 520;
    this.isEditData = false;
    this.subLoading = false;
    this.delLoading = false;
    this.delAllLoading = false;
    this.isUpload = false;
    this.uploadLoading = false;
    this.selectAllData = [];
    this.questionBanUrl = "";
    this.assessQuestionBankUrl = "";
    this.file = {
      file: null,
      name: null
    };
    this.uploadData = {
      type: 1
    };
    this.editData = {
      _id: null,
      item_content: null,
      options: null,
      answer: null,
      answer_remark: null
    };
  },
  methods: {
    onSelectionChange(val) {
      this.selectAllData = [];
      this.selectAllData = val;
    },
    paperSubmit() {
      if (!this.$RegExp.verifyIsNull(this.addTestPaper.name)) {
        this.$Message.warning(
          `${this.$t("tip.pleaseSelect")}${this.$t("tip.testPaper")}${this.$t(
            "tip.name"
          )}`
        );
        return;
      }

      if (this.addTestPaper.departmentId === 0) {
        this.$Message.warning(
          `${this.$t("tip.pleaseSelect")}${this.$t("tip.departmentName")}`
        );
        return;
      }

      this.paperLoading = true;
      let d = this.selectAllData;
      let ids = [];
      for (let i = 0; i < d.length; i++) {
        ids.push(d[i]._id);
      }

      let add = this.addTestPaper;
      let data = {
        ids: ids,
        department_id: add.departmentId,
        test_paper_name: add.name
      };

      this.$api.learning
        .selectExaminationQuestions(data)
        .then(res => {
          if (res.data.code === 0) {
            this.paperLoading = false;
            this.selectPaperModal = false;
            this.$Message.success(this.$t("statusCode.submitSuccessfuly"));
          }
          this.paperLoading = false;
        })
        .catch(() => {
          this.paperLoading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    paperCancel() {
      this.selectPaperModal = !this.selectPaperModal;
    },
    selectPaper() {
      if (this.selectAllData.length === 0) {
        this.$Message.warning(
          `${this.$t("tip.pleaseSelect")}${this.$t("tip.data")}`
        );
        return;
      }

      this.selectPaperModal = !this.selectPaperModal;
    },
    getDepartmentData() {
      let q = this.queryDepartmentData;
      let data = {
        name: q.name,
        page_index: q.page_index,
        page_size: q.page_size
      };

      this.$api.auth_login
        .getDepartmentData(data)
        .then(res => {
          if (res.data.code === 0) {
            this.departmentData = res.data.data.data_info;
          }
        })
        .catch(() => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    deleteFile() {
      this.file = {
        file: null,
        name: null
      };
    },
    uploadSubmit() {
      this.uploadLoading = false;
      let type = this.uploadData.type;
      let url = this.questionBanUrl;

      let userInfo = this.$store.state.userInfo;
      let access_token = null;

      if (
        userInfo === null ||
        userInfo.obj === null ||
        userInfo.obj === undefined
      ) {
      } else {
        access_token = userInfo.obj.access_token;
      }

      let f = null;
      let n = navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i);
      if (n == "ios") {
        f = "iOS";
      } else if (n == "Android") {
        f = "Android";
      } else {
        f = "Web";
      }

      let formData = new FormData();
      formData.append("file", this.file.file);

      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
          access_token: access_token,
          OtherParameter: f
        }
      };

      axios
        .post(url, formData, config)
        .then(res => {
          if (res.data.code === 0) {
            this.uploadLoading = false;
            this.$Message.success(this.$t("tip.uploadSuccess"));
            this.$refs.upload.clearFiles();

            this.queryData.page_index = 1;
            this.uploadCancel();
            this.getQuestionBank();
          }
          this.uploadLoading = false;
        })
        .catch(error => {
          this.uploadLoading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    handleUpload(file) {
      this.file.file = file;
      this.file.name = file.name;
      return false;
    },
    uploadCancel() {
      this.isUpload = false;
      this.file = {
        file: null,
        name: null
      };
      this.uploadData = {
        type: 1
      };
    },
    searchData(val) {
      this.queryData.question_types = val;
      this.queryData.page_index = 1;
      this.getQuestionBank();
    },
    submitEmptyItemBank() {
      this.delAllLoading = true;
      this.$api.learning
        .emptyItemBank()
        .then(res => {
          if (res.data.code === 0) {
            this.delAllLoading = false;
            this.$Modal.remove();
            this.$Message.success(this.$t("tip.deleteSuccess"));
            this.getQuestionBank();
          }
          this.delAllLoading = false;
        })
        .catch(error => {
          this.delAllLoading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    emptyItemBank() {
      this.$Modal.confirm({
        title: `${this.$t("tip.determine")}${this.$t("tip.emptyItemBank")}?`,
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
                        this.submitEmptyItemBank();
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
    submitBatchDeletion() {
      this.delLoading = true;
      let d = this.selectAllData;
      let ids = [];
      for (let i = 0; i < d.length; i++) {
        ids.push(d[i]._id);
      }

      this.$api.learning
        .deletesQuestionBank({
          _ids: ids
        })
        .then(res => {
          if (res.data.code === 0) {
            this.$Modal.remove();
            this.delLoading = false;
            this.$Message.success(this.$t("tip.deleteSuccess"));
            this.getQuestionBank();
          }
          this.delLoading = false;
        })
        .catch(error => {
          this.$Modal.remove();
          this.delLoading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    batchDeletion() {
      if (this.selectAllData.length === 0) {
        this.$Message.warning(
          `${this.$t("tip.pleaseSelect")}${this.$t("tip.data")}`
        );
        return;
      }

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
                        this.submitBatchDeletion();
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
    editSumbit() {
      let e = this.editData;
      if (!this.$RegExp.verifyIsNull(e.item_content)) {
        this.$Message.warning(`${$t("tip.pleaseInput")}${$t("tip.title")}`);
        return;
      }
      this.subLoading = true;
      let data = {
        _id: e._id,
        item_content: e.item_content,
        options: e.options,
        answer: e.answer,
        answer_remark: e.answer_remark
      };

      this.$api.learning
        .editQuestionBank(data)
        .then(res => {
          if (res.data.code === 0) {
            this.subLoading = false;
            this.isEditData = false;
            this.$Message.success(this.$t("tip.editSuccess"));
            this.getQuestionBank();
          }
          this.subLoading = false;
        })
        .catch(error => {
          this.subLoading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    editDataDeleteAnswer(index) {
      let list = JSON.parse(JSON.stringify(this.editData));

      if (list.answer.length === 1) {
        this.$Message.warning(this.$t("tip.minimumOne"));
        return;
      }

      list.answer.splice(index, 1);

      this.editData = list;
    },
    editDataAnswer() {
      let len = this.editData.answer.length;
      this.editData.answer.push(++len);
    },
    editDataDeleteOption(index) {
      let list = JSON.parse(JSON.stringify(this.editData));

      if (list.options.length === 2) {
        this.$Message.warning(this.$t("tip.minimumTwo"));
        return;
      }

      list.options.splice(index, 1);

      this.editData = list;
    },
    editDataTitleOptions() {
      let len = this.editData.options.length;
      this.editData.options.push({
        option: "",
        serial_number: ++len
      });
    },
    editCancel() {
      this.isEditData = false;
      this.editData = {
        _id: null,
        item_content: null,
        options: null,
        answer: null,
        answer_remark: null
      };
    },
    handleSizeChange(val) {
      this.queryData.page_index = 1;
      this.queryData.page_size = val;
      this.getQuestionBank();
    },
    handleIndexChange(val) {
      this.queryData.page_index = val;
      this.getQuestionBank();
    },
    getQuestionBank() {
      this.loading = true;
      let q = this.queryData;
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

            this.dataList = list.data_info;
            this.queryData.count = list.page_count;
            this.loading = false;
          }
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    }
  }
};
</script>

<style lang="less" scoped>
.questionBank-box {
  .single-page-container;

  .questionBank-header {
    .header;

    .header-left {
      float: left;
    }

    .header-right {
      float: right;
      display: flex;
    }
  }

  .questionBank-body {
    .body;

    .page {
      padding: 20px 0;
      text-align: center;
    }
  }
}

.edit-data-box {
  .item {
    padding: 5px;

    p {
      font-size: 14px;
      padding-bottom: 5px;
    }
  }

  .item-btn {
    padding: 15px 5px;
    text-align: right;
  }

  .item-option {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .addTitleOptions {
    margin-left: 5px;
    vertical-align: sub;
  }

  .item-answer {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
}

.upload-box {
  .item {
    p {
      font-size: 14px;
      padding-bottom: 5px;
    }
  }

  .item-upload {
    padding: 20px 0;

    p {
      padding: 10px 0;
      text-align: center;
    }

    .upload {
      background: #fff;
      border: 1px dashed #dcdee2;
      border-radius: 4px;
      text-align: center;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: border-color 0.2s ease;
    }
  }
}

.paper-box {
  .item {
    padding: 10px 0;

    p {
      font-size: 14px;
      padding-bottom: 10px;
    }
  }

  .item-btn {
    padding: 15px 5px;
    text-align: right;
  }

  .item-len {
    text-align: center;

    span {
      color: #3eaf7c;
    }
  }
}
</style>