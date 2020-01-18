<!-- 角色 -->

<template>
  <div class="role-list" style="position: relative;">
    <div class="table-header">
      <Button type="primary" icon="md-add" @click="addRole">{{$t('btn.newlyAdded')}}</Button>
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
              closable: true,
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
                              // currentRow.saving = true;
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
  name: "roleList",
  data() {
    return {
      columnsList: [
        {
          type: "index",
          align: "center",
          title: "序号"
        },
        {
          title: "角色ID",
          key: "id",
          align: "center"
        },
        {
          title: "角色名称",
          key: "role_name",
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
      addRoleName: ""
    };
  },
  created() {
    this.$Modal.remove();
    this.getRoleList();
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
    this.addRoleName = "";
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
      this.getRoleList();
      this.init();
    },
    handleIndexChange(val) {
      this.queryData.page_index = val;
      this.getRoleList();
      this.init();
    },
    getRoleList() {
      this.loading = true;
      let data = {
        page_index: this.queryData.page_index,
        page_size: this.queryData.page_size
      };

      this.$api.auth_login
        .getRoleList(data)
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
      if (!this.$RegExp.verifyIsNull(currentRow.role_name.trim())) {
        this.$Modal.remove();
        this.$Message.warning(this.$t("tip.pleaseEnterTheRoleName"));
        return;
      }

      let data = {
        role_id: currentRow.id,
        role_name: currentRow.role_name
      };

      this.$api.auth_login
        .editRole(data)
        .then(res => {
          if (res.data.code === 0) {
            this.$Modal.remove();
            currentRow.saving = false;
            currentRow.editting = false;
            this.$Message.success(this.$t("tip.editSuccess"));

            this.getRoleList();
            this.init();
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    deleteData: function(currentRow, index) {
      let data = {
        role_id: currentRow.id
      };
      this.$api.auth_login
        .deleteRole(data)
        .then(res => {
          if (res.data.code === 0) {
            this.$delete(this.dataList, index);
            this.$delete(this.cloneDataList, index);
            this.$Message.success(this.$t("tip.deleteSuccess"));

            this.getRoleList();
            this.init();
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    addRoleNameA() {
      if (!this.$RegExp.verifyIsNull(this.addRoleName.trim())) {
        this.$Message.warning(this.$t("tip.pleaseEnterTheRoleName"));
        return;
      } else {
        let data = {
          role_name: this.addRoleName.trim()
        };

        this.$api.auth_login
          .addRole(data)
          .then(res => {
            if (res.data.code === 0) {
              this.$Message.success(this.$t("tip.addSuccess"));

              this.$Modal.remove();
              this.getRoleList();
              this.init();
            }
          })
          .catch(error => {
            this.$Modal.remove();
            this.$Message.error(this.$t("tip.requestError"));
          });
      }
    },
    addRole() {
      this.$Modal.confirm({
        scrollable: true,
        render: h => {
          return h("div", [
            h("div", {
              domProps: {
                innerHTML: this.$t("tip.pleaseEnterTheRoleName")
              },
              style: {
                "margin-top": "10px",
                "margin-bottom": "10px"
              }
            }),
            h("Input", {
              props: {
                value: this.addRoleName,
                autofocus: true,
                placeholder: this.$t("tip.pleaseEnterTheRoleName")
              },
              on: {
                input: val => {
                  this.addRoleName = val;
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
                        this.addRoleNameA();
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
                        this.addRoleName = "";
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
.role-list {
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
</style>