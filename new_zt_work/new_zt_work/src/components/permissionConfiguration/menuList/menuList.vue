<!-- 菜单列表 -->

<template>
  <div class="menu-list" style="position: relative;">
    <div class="table-header">
      <Button type="primary" icon="md-add" @click="addMenu">{{$t('btn.newlyAdded')}}</Button>
    </div>

    <div class="table-body">
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
        type: currentRow.editting ? "success" : "primary",
        loading: currentRow.saving
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
  name: "menuList",
  data() {
    return {
      columnsList: [
        {
          title: "菜单ID",
          key: "id",
          align: "center"
        },
        {
          title: "菜单名称",
          key: "name",
          align: "center",
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
        page_index: 1,
        page_size: 10,
        count: 0
      },
      addMenuName: ""
    };
  },
  created() {
    this.$Modal.remove();
    this.getMenuList();
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
    this.addMenuName = "";
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
      this.getMenuList();
      this.init();
    },
    handleIndexChange(val) {
      this.queryData.page_index = val;
      this.getMenuList();
      this.init();
    },
    changePage(index) {
      this.queryData.page_index = index;
      this.getMenuList();
      this.init();
    },
    getMenuList() {
      this.loading = true;
      let data = {
        page_index: this.queryData.page_index,
        page_size: this.queryData.page_size
      };

      this.$api.auth_login
        .getMenuList(data)
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data;
            this.dataList = list.data_info;
            this.queryData.count = list.page_count;

            this.cloneDataList = JSON.parse(JSON.stringify(list.data_info)).map(
              item => {
                item.editting = false;
                item.saving = false;
                return item;
              }
            );
            this.loading = false;
          } else {
            this.loading = false;
          }
        })
        .catch(error => {
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
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
    handleBackdata(object) {
      let clonedData = JSON.parse(JSON.stringify(object));
      delete clonedData.editting;
      delete clonedData.saving;
      return clonedData;
    },
    saveData(currentRow, index) {
      let data = {
        menu_id: currentRow.id,
        menu_name: currentRow.name
      };

      this.$api.auth_login
        .editMenu(data)
        .then(res => {
          if (res.data.code === 0) {
            this.$Modal.remove();
            currentRow.saving = false;
            currentRow.editting = false;
            this.$Message.success(this.$t("tip.editSuccess"));

            this.getMenuList();
            this.init();
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    deleteData(currentRow, index) {
      let data = {
        menu_id: currentRow.id
      };
      this.$api.auth_login
        .deleteMenu(data)
        .then(res => {
          if (res.data.code === 0) {
            this.$delete(this.dataList, index);
            this.$delete(this.cloneDataList, index);
            this.$Message.success(this.$t("tip.requestError"));

            this.getMenuList();
            this.init();
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    addMenuNameA() {
      if (this.addMenuName.trim() === "") {
        this.$Message.warning(this.$t("tip.pleaseEnterMenuNmae"));
        return;
      } else {
        let data = {
          menu_name: this.addMenuName
        };

        this.$api.auth_login
          .addMenu(data)
          .then(res => {
            if (res.data.code === 0) {
              this.$Message.success(this.$t("tip.addSuccess"));

              this.$Modal.remove();
              this.addMenuName = "";
              this.getMenuList();
              this.init();
            }
          })
          .catch(error => {
            this.$Modal.remove();
            this.addMenuName = "";
            this.$Message.error(this.$t("tip.requestError"));
          });
      }
    },
    addMenu() {
      this.$Modal.confirm({
        scrollable: true,
        render: h => {
          return h("div", [
            h("div", {
              domProps: {
                innerHTML: this.$t("tip.pleaseEnterMenuNmae")
              },
              style: {
                "margin-top": "10px",
                "margin-bottom": "10px"
              }
            }),
            h("Input", {
              props: {
                value: this.addMenuName,
                autofocus: true,
                placeholder: this.$t("tip.pleaseEnterMenuNmae")
              },
              on: {
                input: val => {
                  this.addMenuName = val;
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
                        this.addMenuNameA();
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
                        this.addMenuName = "";
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
    }
  }
};
</script>

<style lang="less" scoped>
.menu-list {
  .single-page-container;

  .table-header {
    .header;
  }
  .table-body {
    .body;
    .page {
      padding: 20px 0;
      text-align: center;
    }
  }
}

.spin-box {
  .global-spin;
}
</style>