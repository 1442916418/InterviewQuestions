<!-- 产品线管理 -->

<template>
  <div class="productLineManagement-box">
    <div class="productLineManagement-header">
      <div class="hedaer-left">
        <Button type="primary" icon="md-add" @click="addData">{{$t('btn.newlyAdded')}}</Button>
      </div>
    </div>
    <div class="productLineManagement-body">
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
          let tempData = vm.handleBackdata(currentRow);
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
  name: "productLineManagement",
  data() {
    return {
      columnsList: [
        {
          type: "index",
          title: "序号",
          align: "center"
        },
        {
          align: "center",
          title: "产品线ID",
          key: "id"
        },
        {
          align: "center",
          title: "产品线名称",
          key: "name",
          editable: true
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
      addProduct: {
        name: null
      },
      productData: []
    };
  },
  created() {
    this.$Modal.remove();
    this.getProductData();
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
    this.addProduct = {
      name: null
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
    subminProduct() {
      let d = this.addProduct;
      if (!this.$RegExp.verifyIsNull(d.name)) {
        this.$Message.warning(this.$t("tip.pleaseEneterTheProductLineName"));
        this.addProduct.name = null;
        return;
      } else {
        let data = {
          name: d.name
        };

        this.$api.monitor1
          .addProduct(data)
          .then(res => {
            if (res.data.code === 0) {
              this.$Message.success(this.$t("tip.addSuccess"));

              this.$Modal.remove();
              this.reduction();
              this.getProductData();
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
                innerHTML: this.$t("tip.pleaseEneterTheProductLineName")
              },
              style: {
                "text-align": "left",
                "padding-top": "10px"
              }
            }),
            h("Input", {
              props: {
                value: this.addProduct.name,
                autofocus: true,
                placeholder: this.$t("tip.pleaseEneterTheProductLineName")
              },
              style: {
                "margin-top": "10px",
                "margin-padding": "10px"
              },
              on: {
                input: val => {
                  this.addProduct.name = val.trim();
                }
              }
            }),
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
                        this.subminProduct();
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
      this.addProduct = {
        name: null
      };
    },
    saveData(row, index) {
      let data = {
        product_id: row.id,
        name: row.name
      };

      this.$api.monitor1
        .editProduct(data)
        .then(res => {
          if (res.data.code === 0) {
            this.$Modal.remove();
            row.saving = false;
            row.editting = false;
            this.$Message.success(this.$t("tip.editSuccess"));
            this.getProductData();
            this.init();
          }
        })
        .catch(error => {
          this.$Modal.remove();
          row.saving = false;
          row.editting = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    deleteData(row, index) {
      let data = {
        product_id: row.id
      };

      this.$api.monitor1
        .deleteProduct(data)
        .then(res => {
          if (res.data.code === 0) {
            this.$Message.success(this.$t("tip.deleteSuccess"));

            this.getProductData();
            this.init();
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
            let currentRow = that.cloneDataList[param.index];
            let children = [];
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
    getProductData() {
      this.loading = true;
      let data = {
        page_index: this.queryData.page_index,
        page_size: this.queryData.page_size
      };

      this.$api.monitor1
        .getProductData(data)
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
      let clonedData = JSON.parse(JSON.stringify(object));
      delete clonedData.editting;
      delete clonedData.saving;
      return clonedData;
    },
    handleSizeChange(val) {
      this.queryData.page_index = 1;
      this.queryData.page_size = val;
      this.getProductData();
      this.init();
    },
    handleIndexChange(val) {
      this.queryData.page_index = val;
      this.getProductData();
      this.init();
    }
  }
};
</script>

<style lang="less" scoped>
.productLineManagement-box {
  .single-page-container;

  .productLineManagement-header {
    .header;

    .hedaer-left {
      float: left;
    }
  }

  .productLineManagement-body {
    .body;

    .page {
      padding: 20px 0;
      text-align: center;
    }
  }
}
</style>