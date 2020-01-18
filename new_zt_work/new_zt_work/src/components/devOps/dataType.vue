<!-- 数据类型 -->

<template>
  <div class="dataType-box">
    <div class="dataType-header">
      <div class="header-left">
        <Button type="primary" icon="md-add" @click="addDataT">{{$t('btn.newlyAdded')}}</Button>
      </div>
      <div class="header-right"></div>
    </div>
    <div class="dataType-body">
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
  </div>
</template>

<script>
let editButton = function(vm, h, currentRow, index) {
  return h(
    "Button",
    {
      props: {
        size: "small",
        type: currentRow.editting ? "success" : "primary"
      },
      style: {
        margin: "0 5px"
      },
      on: {
        click: function(event) {
          event.preventDefault();

          let af = currentRow;

          var tempData = vm.handleBackdata(currentRow);
          if (!currentRow.editting) {
            currentRow.editting = true;
          } else {
            vm.$Modal.confirm({
              title: vm.$t("tip.confirmRevision"),
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
                              if (
                                JSON.stringify(tempData) ==
                                JSON.stringify(vm.dataList[index])
                              ) {
                                vm.$Modal.remove();
                                vm.$Message.warning(vm.$t("tip.notChanged"));
                                return (currentRow.editting = false);
                              }
                              vm.saveData(currentRow, index);
                              currentRow.saving = true;
                            }
                          }
                        },
                        vm.$t("tip.determine")
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
                              vm.$Modal.remove();
                              vm.editCancal(currentRow.id);
                              currentRow.editting = false;
                            }
                          }
                        },
                        vm.$t("tip.cancel")
                      )
                    ]
                  )
                ]);
              }
            });
          }
        }
      }
    },
    currentRow.editting ? vm.$t("tip.preservation") : vm.$t("tip.edit")
  );
};

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
  name: "dataType",
  data() {
    return {
      modalLoading: true,
      addData: {
        data_name: "",
        cn: "",
        type: 1
      },
      loading: false,
      dataList: [],
      cloneDataList: [],
      queryData: {
        page_index: 1,
        page_size: 10,
        count: 0
      },
      typeDataList: [],
      type: [
        {
          value: 1,
          label: "普通数据"
        },
        {
          value: 2,
          label: "质控数据"
        }
      ],
      columnsList: [
        {
          title: "序号",
          type: "index",
          minWidth: 50,
          align: "center"
        },
        {
          align: "center",
          title: "数据名称",
          key: "data_name",
          editable: true
        },
        {
          align: "center",
          title: "CN单位",
          key: "cn",
          editable: true
        },
        {
          align: "center",
          title: "数据类型",
          key: "type",
          option: true,
          editable: true
        },
        {
          title: "操作",
          align: "center",
          key: "handle",
          handle: ["edit", "delete"]
        }
      ]
    };
  },
  created() {
    this.$Modal.remove();
    this.getDataTypeList();
    this.init();
  },
  beforeDestroy() {
    this.modalLoading = true;
    this.addData = {
      data_name: "",
      cn: "",
      type: 1
    };
    this.loading = false;
    this.dataList = [];
    this.cloneDataList = [];
    this.queryData = {
      page_index: 1,
      page_size: 10,
      count: 0
    };
  },
  methods: {
    editCancal(id) {
      let d = this.dataList;
      let c = this.cloneDataList;

      for (let i = 0; i < d.length; i++) {
        if (d[i].id === id) {
          for (let k in d[i]) {
            this.$set(c[i], k, d[i][k]);
          }
        }
      }
    },
    handleSizeChange(val) {
      this.queryData.page_index = 1;
      this.queryData.page_size = val;
      this.getDataTypeList();
      this.init();
    },
    handleIndexChange(val) {
      this.queryData.page_index = val;
      this.getDataTypeList();
      this.init();
    },
    saveData(row, index) {
      let data = {
        data_type_id: row.id,
        data_name: row.data_name,
        cn: row.cn,
        type: row.type
      };

      this.$api.monitor1
        .editDataTypeList(data)
        .then(res => {
          if (res.data.code === 0) {
            this.$Message.success(this.$t("tip.editSuccess"));

            this.$Modal.remove();
            this.getDataTypeList();
            this.init();
          }
        })
        .catch(error => {
          this.$Modal.remove();
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    deleteData(row, index) {
      this.loading = true;
      let data = {
        data_type_id: row.id
      };

      this.$api.monitor1
        .deleteDataTypeList(data)
        .then(res => {
          if (res.data.code === 0) {
            this.$Message.success(this.$t("tip.deleteSuccess"));

            this.loading = false;
            this.getDataTypeList();
            this.init();
          }
        })
        .catch(error => {
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    init() {
      let that = this;
      this.columnsList.forEach(function(item, index) {
        if (item.editable) {
          item.render = function(h, params) {
            let currentRow = that.cloneDataList[params.index];

            if (!currentRow.editting) {
              if (item.key === "type") {
                let a = null;
                if (currentRow["type"] === 1) {
                  a = "普通数据";
                } else {
                  a = "质控数据";
                }
                return h("span", a);
              }
              return h("span", currentRow[item.key]);
            } else {
              if (item.option) {
                return h(
                  "Select",
                  {
                    props: {
                      value: currentRow[params.column.key]
                    },
                    on: {
                      "on-change": function(value) {
                        that.$set(currentRow, params.column.key, value);
                      }
                    }
                  },
                  that.type.map(function(item) {
                    return h(
                      "Option",
                      {
                        props: {
                          value: item.value,
                          label: item.label
                        }
                      },
                      item.label
                    );
                  })
                );
              }

              return h("Input", {
                props: {
                  type: "text",
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
            var currentRow = that.cloneDataList[param.index];
            var children = [];
            item.handle.forEach(function(item) {
              if (item === "edit") {
                children.push(editButton(that, h, currentRow, param.index));
              } else if (item === "delete") {
                children.push(deleteButton(that, h, currentRow, param.index));
              }
            });
            return h("div", children);
          };
        }
      });
    },
    getDataTypeList() {
      this.loading = true;
      let data = {
        page_index: this.queryData.page_index,
        page_size: this.queryData.page_size
      };

      this.$api.monitor1
        .getDataTypeList(data)
        .then(res => {
          if (res.data.code === 0) {
            this.dataList = [];
            this.cloneDataList = [];

            this.dataList = res.data.data.data_info;
            this.queryData.count = res.data.data.page_count;

            this.cloneDataList = JSON.parse(
              JSON.stringify(res.data.data.data_info)
            ).map(function(item) {
              item.editting = false;
              item.saving = false;
              return item;
            });

            this.loading = false;
          }
        })
        .catch(error => {
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    handleBackdata(object) {
      var clonedData = JSON.parse(JSON.stringify(object));
      delete clonedData.editting;
      delete clonedData.saving;
      return clonedData;
    },
    subminDataType() {
      let d = this.addData;
      if (!this.$RegExp.verifyIsNull(d.data_name)) {
        this.$Message.warning(this.$t("tip.pleaseFillInTheDataTypeName"));
        this.addData.data_name = "";
        return;
      } else if (!this.$RegExp.verifyIsNull(d.cn)) {
        this.$Message.warning(this.$t("tip.pleaseFillInCNName"));
        this.addData.cn = "";
        return;
      } else {
        let data = {
          data_name: d.data_name,
          cn: d.cn,
          type: d.type
        };

        this.$api.monitor1
          .addDataTypeList(data)
          .then(res => {
            if (res.data.code === 0) {
              this.$Message.success(this.$t("tip.addSuccess"));
              this.$Modal.remove();

              this.getDataTypeList();
              this.init();
              this.initAdd();
            }
          })
          .catch(error => {
            this.$Message.error(this.$t("tip.requestError"));
          });
      }
    },
    addDataT() {
      this.$Modal.confirm({
        width: "520",
        scrollable: true,
        loading: this.modalLoading,
        render: h => {
          return h("div", [
            h("div", {
              domProps: {
                innerHTML: this.$t("tip.plaseEnterADataTypeName")
              },
              style: {
                "text-align": "left",
                "padding-top": "10px"
              }
            }),
            h("Input", {
              props: {
                value: this.addData.data_name,
                autofocus: true,
                placeholder: this.$t("tip.plaseEnterADataTypeName")
              },
              style: {
                "margin-top": "10px",
                "margin-padding": "10px"
              },
              on: {
                input: val => {
                  this.addData.data_name = val.trim();
                }
              }
            }),
            h("div", {
              domProps: {
                innerHTML: this.$t("tip.pleaseFillInCNName")
              },
              style: {
                "text-align": "left",
                "padding-top": "10px"
              }
            }),
            h("Input", {
              props: {
                value: this.addData.cn,
                placeholder: this.$t("tip.pleaseFillInCNName")
              },
              style: {
                "margin-top": "10px",
                "margin-padding": "10px"
              },
              on: {
                input: val => {
                  this.addData.cn = val.trim();
                }
              }
            }),
            h("div", {
              domProps: {
                innerHTML: this.$t("tip.pleaseSelectDataType")
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
                  value: this.addData.type,
                  placeholder: this.$t("tip.pleaseSelectDataType")
                },
                on: {
                  "on-change": value => {
                    this.addData.type = value;
                  }
                },
                style: {
                  width: "150px",
                  "margin-top": "10px",
                  "margin-padding": "10px",
                  "margin-right": "25px"
                }
              },
              [
                this.type.map(function(type) {
                  return h(
                    "Option",
                    {
                      props: {
                        value: type.value
                      }
                    },
                    type.label
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
                        this.subminDataType();
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
                        this.initAdd();
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
    initAdd() {
      this.addData = {
        data_name: "",
        cn: "",
        type: 1
      };
    }
  }
};
</script>

<style lang="less" scoped>
.dataType-box {
  .single-page-container;

  .dataType-header {
    .header;

    .header-left {
      float: left;
    }

    .header-right {
      float: right;
    }
  }

  .dataType-body {
    .body;

    .page {
      padding: 20px 0;
      text-align: center;
    }
  }
}
</style>