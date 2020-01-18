<!-- 监测项管理(组分) -->

<template>
  <div class="monitoringItemManagement-box">
    <div class="monitoringItemManagement-header">
      <div class="hedaer-left">
        <Button type="primary" icon="md-add" @click="addData">{{$t('btn.newlyAdded')}}</Button>
      </div>
    </div>
    <div class="monitoringItemManagement-body">
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
        click: function() {
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
  name: "monitoringItemManagement",
  data() {
    return {
      columnsList: [
        {
          type: "index",
          align: "center",
          title: "序号",
        },
        {
          align: "center",
          title: "组分ID",
          key: "id"
        },
        {
          align: "center",
          title: "组分名称",
          key: "name",
          editable: true
        },
        {
          align: "center",
          title: "组分单位",
          key: "unit",
          editable: true,
          sortable: true
        },
        {
          align: "center",
          title: "国标参数",
          key: "key",
          editable: true,
          sortable: true
        },
        {
          align: "center",
          title: "产品线",
          key: "product_name",
          option: true,
          editable: true,
          sortable: true
        },
        {
          title: "操作",
          align: "center",
          key: "handle",
          handle: ["edit", "delete"]
        }
      ],
      loading: false,
      dataList: [],
      cloneDataList: [],
      queryData: {
        count: 0,
        page_index: 1,
        page_size: 10
      },
      modalLoading: true,
      addComponent: {
        name: null,
        unit: null,
        key: null,
        department: null
      },
      productData: []
    };
  },
  created() {
    this.$Modal.remove();
    this.getProductData();
    this.getComponentData();
    this.init();
  },
  beforeDestroy() {
    this.loading = false;
    this.dataList = [];
    this.cloneDataList = [];
    this.queryData = {
      page_index: 1,
      page_size: 10,
      count: 0
    };
    this.modalLoading = true;
    this.addComponent = {
      name: null,
      unit: null,
      key: null,
      department: null
    };
    this.productData = [];
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
    subminComponent() {
      let d = this.addComponent;
      if (!this.$RegExp.verifyIsNull(d.name)) {
        this.$Message.warning(this.$t("tip.pleaseFillInTheComponentName"));
        this.addComponent.name = null;
        return;
      } else if (!this.$RegExp.verifyIsNull(d.unit)) {
        this.$Message.warning(this.$t("tip.pleaseFillInTheComponentUnit"));
        this.addComponent.unit = null;
        return;
      } else if (!this.$RegExp.verifyIsNull(d.key)) {
        this.$Message.warning(
          this.$t("tip.pleaseFillInTheNationalStandardParameters")
        );
        this.addComponent.key = null;
        return;
      } else if (!this.$RegExp.verifyIsNull(d.department)) {
        this.$Message.warning(this.$t("tip.pleaseSelectAProductLine"));
        this.addComponent.key = null;
        return;
      } else {
        let data = {
          name: d.name,
          unit: d.unit,
          key: d.key,
          department: d.department
        };

        this.$api.monitor1
          .addComponent(data)
          .then(res => {
            if (res.data.code === 0) {
              this.$Message.success(this.$t("tip.addSuccess"));
              this.$Modal.remove();
              this.reduction();
              this.getComponentData();
              this.init();
            }
          })
          .catch(error => {
            this.$Modal.remove();
            this.$Message.error(this.$t("tip.requestError"));
          });
        this.$Modal.remove();
      }
    },
    addData() {
      this.$Modal.confirm({
        width: "520",
        scrollable: true,
        loading: this.modalLoading,
        render: h => {
          return h("div", [
            h("div", {
              domProps: {
                innerHTML: this.$t("tip.pleaseFillInTheComponentName")
              },
              style: {
                "text-align": "left",
                "padding-top": "10px"
              }
            }),
            h("Input", {
              props: {
                value: this.addComponent.name,
                autofocus: true,
                placeholder: this.$t("tip.pleaseFillInTheComponentName")
              },
              style: {
                "margin-top": "10px",
                "margin-padding": "10px"
              },
              on: {
                input: val => {
                  this.addComponent.name = val.trim();
                }
              }
            }),
            h("div", {
              domProps: {
                innerHTML: this.$t("tip.pleaseFillInTheComponentUnit")
              },
              style: {
                "text-align": "left",
                "padding-top": "10px"
              }
            }),
            h("Input", {
              props: {
                value: this.addComponent.unit,
                autofocus: true,
                placeholder: this.$t("tip.pleaseFillInTheComponentUnit")
              },
              style: {
                "margin-top": "10px",
                "margin-padding": "10px"
              },
              on: {
                input: val => {
                  this.addComponent.unit = val.trim();
                }
              }
            }),
            h("div", {
              domProps: {
                innerHTML: this.$t(
                  "tip.pleaseFillInTheNationalStandardParameters"
                )
              },
              style: {
                "text-align": "left",
                "padding-top": "10px"
              }
            }),
            h("Input", {
              props: {
                value: this.addComponent.key,
                autofocus: true,
                placeholder: this.$t(
                  "tip.pleaseFillInTheNationalStandardParameters"
                )
              },
              style: {
                "margin-top": "10px",
                "margin-padding": "10px"
              },
              on: {
                input: val => {
                  this.addComponent.key = val.trim();
                }
              }
            }),
            h("div", {
              domProps: {
                innerHTML: this.$t("tip.pleaseSelectAProductLine")
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
                  value: this.addComponent.department,
                  placeholder: this.$t("tip.pleaseSelectAProductLine")
                },
                on: {
                  "on-change": value => {
                    this.addComponent.department = value;
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
                this.productData.map(function(type) {
                  return h(
                    "Option",
                    {
                      props: {
                        value: type.id
                      }
                    },
                    type.name
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
                        this.subminComponent();
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
                        this.reduction();
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
    reduction() {
      this.addComponent = {
        name: null,
        unit: null,
        key: null,
        department: null
      };
    },
    saveData(row, index) {
      let dep = null;
      if (typeof row.product_name === "string") {
        for (let i = 0; i < this.productData.length; i++) {
          if (this.productData[i].name === row.product_name) {
            dep = this.productData[i].id;
            break;
          }
        }
      } else {
        dep = row.product_name;
      }
      let data = {
        component_id: row.id,
        name: row.name,
        unit: row.unit,
        key: row.key,
        department: dep
      };

      this.$api.monitor1
        .editComponent(data)
        .then(res => {
          if (res.data.code === 0) {
            row.saving = false;
            row.editting = false;
            this.$Message.success(this.$t("tip.editSuccess"));
            this.getComponentData();
            this.init();
          }
        })
        .catch(error => {
          row.saving = false;
          row.editting = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    deleteData(row, index) {
      let data = {
        component_id: row.id
      };

      this.$api.monitor1
        .deleteComponent(data)
        .then(res => {
          if (res.data.code === 0) {
            this.$Message.success(this.$t("tip.deleteSuccess"));

            this.getComponentData();
            this.init();
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    getProductData() {
      let data = {
        page_index: 1,
        page_size: 100
      };
      this.$api.monitor1
        .getProductData(data)
        .then(res => {
          if (res.data.code === 0) {
            this.productData = [];
            this.productData = res.data.data.data_info;
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    init() {
      let that = this;
      this.columnsList.forEach((item, index) => {
        if (item.editable) {
          item.render = (h, params) => {
            let currentRow = this.cloneDataList[params.index];
            if (!currentRow.editting) {
              return h("span", currentRow[item.key]);
            } else {
              if (item.option) {
                return h(
                  "Select",
                  {
                    props: {
                      value: currentRow["department"],
                      placeholder: this.$t("tip.pleaseSelectAProductLine")
                    },
                    on: {
                      "on-change": value => {
                        that.$set(currentRow, params.column.key, value);
                      }
                    }
                  },
                  [
                    this.productData.map(function(type) {
                      return h(
                        "Option",
                        {
                          props: {
                            value: type.id
                          }
                        },
                        type.name
                      );
                    })
                  ]
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
          item.render = (h, param) => {
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
    getComponentData() {
      this.loading = true;
      let data = {
        page_index: this.queryData.page_index,
        page_size: this.queryData.page_size
      };

      this.$api.monitor1
        .getComponentData(data)
        .then(res => {
          if (res.data.code === 0) {
            this.dataList = [];
            this.cloneDataList = [];
            this.dataList = res.data.data.data_info;
            this.queryData.count = res.data.data.page_count;

            this.cloneDataList = JSON.parse(JSON.stringify(this.dataList)).map(
              function(item) {
                item.editting = false;
                item.saving = false;
                return item;
              }
            );

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
    handleSizeChange(val) {
      this.queryData.page_index = 1;
      this.queryData.page_size = val;
      this.getComponentData();
      this.init();
    },
    handleIndexChange(val) {
      this.queryData.page_index = val;
      this.getComponentData();
      this.init();
    }
  }
};
</script>

<style lang="less" scoped>
.monitoringItemManagement-box {
  .single-page-container;

  .monitoringItemManagement-header {
    .header;

    .hedaer-left {
      float: left;
    }
  }

  .monitoringItemManagement-body {
    .body;

    .page {
      padding: 20px 0;
      text-align: center;
    }
  }
}
</style>