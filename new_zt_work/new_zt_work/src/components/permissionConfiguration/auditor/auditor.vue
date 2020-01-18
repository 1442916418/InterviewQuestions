<!-- 审核员列表 -->

<template>
  <div class="auditor-box">
    <div class="auditor-header">
      <Button type="primary" icon="md-add" @click="addAuditor">{{$t('btn.newlyAdded')}}</Button>
    </div>
    <div class="auditor-body">
      <DefaultTable
        :isPage="false"
        :isSelection="false"
        :columnsList="columnsList"
        :dataList="dataList"
        :loading="loading"
      />

      <Paging
        :queryData="queryData"
        @previousPage="previousPage"
        @nextPage="nextPage"
        @selectPage="selectPage"
      />
    </div>
  </div>
</template>

<script>
let deleteButton = function(vm, h, currentRow, index) {
  return h(
    "Poptip",
    {
      props: {
        confirm: true,
        title:
          currentRow.WRAPDATASTATUS != vm.$t("btn.delete")
            ? vm.$t("tip.confirmDeletion")
            : vm.$t("tip.revocationAndDeletion"),
        transfer: true,
        placement: "left",
        cancelText: vm.$t("btn.cancel"),
        okText: vm.$t("btn.determine")
      },
      on: {
        "on-ok": function() {
          vm.deleteData(currentRow, index);
        }
      }
    },
    [
      h(
        "Button",
        {
          domProps: {
            title: vm.$t("btn.delete")
          },
          props: {
            size: "small",
            type: "error"
          }
        },
        vm.$t("btn.delete")
      )
    ]
  );
};

export default {
  name: "",
  data() {
    return {
      auditorData: [],
      userData: [],
      queryData: {
        page_index: 1,
        page_size: 10
      },
      dataList: [],
      loading: false,
      cloneDataList: [],
      selectUserID: "",
      pageList: this.$glb.elementSelectDefaultPageSizes,
      columnsList: [
        {
          title: "序号",
          type: "index",
          align: "center"
        },
        {
          title: "审核员ID",
          key: "id",
          align: "center"
        },
        {
          title: "用户ID",
          key: "user_id",
          align: "center"
        },
        {
          title: "用户姓名",
          key: "name",
          align: "center"
        },
        {
          title: "操作",
          align: "center",
          key: "handle",
          handle: ["delete"]
        }
      ]
    };
  },
  created() {
    this.getUser();
    this.getOperationCheckData();
    this.init();
  },
  beforeDestroy() {
    this.auditorData = [];
    this.userData = [];
    this.queryData = {
      page_index: 1,
      page_size: 10
    };
    this.dataList = [];
    this.loading = false;
    this.cloneDataList = [];
    this.selectUserID = "";
  },
  methods: {
    deleteData(currentRow, index) {
      this.loading = true;
      let data = {
        user_id: currentRow.user_id
      };

      this.$api.monitor2
        .deleteOperationCheck(data)
        .then(res => {
          if (res.data.code === 0) {
            this.$Message.success(this.$t("tip.deleteSuccess"));
            this.$delete(this.dataList, index);
            this.$delete(this.cloneDataList, index);
            this.getOperationCheckData();
            this.init();
          }
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    addAuditorUser() {
      if (this.selectUserID === "") {
        this.$Message.warning(this.$t("tip.pleaseSelectUsers"));
        return;
      }

      this.loading = true;

      let data = {
        user_id: this.selectUserID
      };

      this.$api.monitor2
        .addOperationCheck(data)
        .then(res => {
          if (res.data.code === 0) {
            this.$Modal.remove();
            this.$Message.success(this.$t("tip.addSuccess"));
            this.getOperationCheckData();
            this.init();
          }
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    addAuditor() {
      this.$Modal.confirm({
        scrollable: true,
        loading: this.modalLoading,
        render: h => {
          return h("div", [
            h("div", {
              domProps: {
                innerHTML: this.$t("tip.pleaseSelectUsers")
              },
              style: {
                "text-align": "left",
                "padding-top": "10px"
              }
            }),
            h(
              "Select",
              {
                props: {
                  placeholder: this.$t("tip.pleaseSelectUsers")
                },
                on: {
                  "on-change": value => {
                    this.selectUserID = Number(value);
                  }
                },
                style: {
                  "margin-top": "10px",
                  "margin-padding": "10px"
                }
              },
              [
                this.userData.map(function(type) {
                  return h(
                    "Option",
                    {
                      props: {
                        value: type.id
                      }
                    },
                    type.real_name
                  );
                })
              ]
            ),
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
                        this.addAuditorUser();
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
                        this.selectUserID = "";
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
    selectPage(value) {
      this.queryData.page_size = value;
      this.getOperationCheckData();
      this.init();
    },
    nextPage() {
      this.queryData.page_index += 1;
      this.getOperationCheckData();
      this.init();
    },
    previousPage() {
      if (this.queryData.page_index === 1) {
        this.$Message.warning(this.$t("tip.firstPage"));
        return;
      } else {
        this.queryData.page_index -= 1;
        this.getOperationCheckData();
        this.init();
      }
    },
    init() {
      let that = this;
      this.columnsList.forEach(function(item) {
        if (item.editable) {
          item.render = function(h, params) {
            let currentRow = that.cloneDataList[params.index];

            if (!currentRow.editting) {
              return h("span", currentRow[item.key]);
            } else {
              return h("Input", {
                props: {
                  type: item.input || "text",
                  rows: 3,
                  value: currentRow[params.column.key]
                },
                on: {
                  "on-change"(event) {
                    that.$set(
                      currentRow,
                      params.column.key,
                      event.target.value
                    );
                  }
                }
              });
            }
          };
        }

        if (item.handle) {
          item.render = function(h, param) {
            let currentRow = that.cloneDataList[param.index];
            let children = [];
            item.handle.forEach(function(item) {
              if (item === "delete") {
                children.push(deleteButton(that, h, currentRow, param.index));
              }
            });
            return h("div", children);
          };
        }
      });
      this.loading = false;
    },
    getUser() {
      let data = {
        page_index: 1,
        page_size: 500
      };

      this.userData = [];

      this.$api.auth_login
        .getUserDataList(data)
        .then(res => {
          if (res.data.code === 0) {
            this.userData = res.data.data.data_info;
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    getOperationCheckData() {
      this.loading = true;
      let q = this.queryData;
      let data = {
        page_index: q.page_index,
        page_size: q.page_size
      };

      this.auditorData = [];

      this.$api.monitor2
        .getOperationCheckData(data)
        .then(res => {
          if (res.data.code === 0) {
            this.auditorData = res.data.data;
            this.dataList = res.data.data;

            let user = this.userData;

            for (let i = 0; i < this.dataList.length; i++) {
              for (let j = 0; j < user.length; j++) {
                if (this.dataList[i].user_id === user[j].id) {
                  this.dataList[i].name = user[j].real_name;
                }
              }
            }

            this.cloneDataList = JSON.parse(JSON.stringify(this.dataList)).map(
              function(item) {
                item.editting = false;
                item.saving = false;
                return item;
              }
            );

            this.init();
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
.auditor-box {
  .single-page-container;

  .auditor-header {
    .header;
  }
  .auditor-body {
    .body;

    .page {
      padding: 20px;
      text-align: center;
    }
  }
}
</style>