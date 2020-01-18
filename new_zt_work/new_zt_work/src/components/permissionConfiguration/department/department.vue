<!-- 部门 -->

<template>
  <div class="department-box">
    <div class="department-header">
      <div class="header-left">
        <Button
          type="primary"
          icon="md-add"
          @click="() => isShowAddData = !isShowAddData"
        >{{$t('btn.newlyAdded')}}</Button>
      </div>
      <div class="header-right">
        <Input
          prefix="ios-search"
          v-model="queryData.name"
          :placeholder="$t('tip.addDepartmentName')"
          @keyup.enter.native="queryDataName"
        />
      </div>
    </div>
    <div class="department-body">
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

    <Modal width="350" v-model="isShowAddData" :title="$t('tip.departmentName')">
      <div class="add-box">
        <p>{{ $t('tip.addDepartmentName') }}</p>
        <Input v-model.trim="addData.name" clearable :placeholder="$t('tip.addDepartmentName')" />
      </div>
      <div class="modal-item-btn">
        <Button style="margin-right:10px;" @click="cancelBtn">{{ $t('tip.cancel') }}</Button>
        <Button type="primary" @click="subminAddData">{{ $t('tip.determine') }}</Button>
      </div>
    </Modal>
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
                              vm.editData(currentRow);
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
          vm.deleteData(currentRow);
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
  name: "department",
  data() {
    return {
      isShowAddData: false,
      addData: {
        name: null
      },
      queryData: {
        name: "",
        page_index: 1,
        page_size: 10,
        count: 0
      },
      dataList: [],
      cloneDataList: [],
      tableHeight: 520,
      loading: false,
      columnsList: [
        {
          title: "序号",
          type: "index",
          align: "center"
        },
        {
          title: "ID",
          key: "id",
          align: "center",
          sortable: true
        },
        {
          title: "名称",
          key: "name",
          align: "center",
          sortable: true,
          editable: true
        },
        {
          title: "操作",
          align: "center",
          key: "handle",
          minWidth: 200,
          handle: ["edit", "delete"]
        }
      ],
      pageSizes: this.$glb.tableDefaultPageSizes
    };
  },
  created() {
    this.getDepartmentData();
    this.setTable();
  },
  beforeDestroy() {
    this.isShowAddData = false;
    this.addData = {
      name: null
    };
    this.queryData = {
      name: "",
      page_index: 1,
      page_size: 10,
      count: 0
    };
    this.dataList = [];
    this.cloneDataList = [];
    this.loading = false;
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
      this.getDepartmentData();
      this.setTable();
    },
    handleIndexChange(val) {
      this.queryData.page_index = val;
      this.getDepartmentData();
      this.setTable();
    },
    queryDataName() {
      this.queryData.page_index = 1;
      this.getDepartmentData();
      this.setTable();
    },
    editData(row) {
      if (!this.$RegExp.verifyIsNull(row.name)) {
        this.$Message.warning(
          `${this.$t("tip.inputBox")}${this.$t("tip.canNotBeEmpty")}`
        );
        return;
      } else if (!this.$RegExp.isFullwidthChar(row.name)) {
        let msg = `${this.$t("tip.pleaseInput")}${this.$t(
          "tip.chinese"
        )}、${this.$t("tip.letter")}、${this.$t("tip.n")}`;
        this.$Message.warning(msg);
        return;
      }

      this.loading = true;
      let d = {
        id: row.id,
        name: row.name
      };

      this.$api.auth_login
        .editDepartment(d)
        .then(res => {
          if (res.data.code === 0) {
            this.loading = false;
            this.$Modal.remove();
            this.$Message.success(this.$t("tip.editSuccess"));
            this.getDepartmentData();
            this.setTable();
          }
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    deleteData(row) {
      this.loading = true;
      this.$api.auth_login
        .deleteDepartment({
          id: row.id
        })
        .then(res => {
          if (res.data.code === 0) {
            this.$Message.success(this.$t("tip.deleteSuccess"));
            this.loading = false;
            this.getDepartmentData();
            this.setTable();
          }
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    setTable() {
      let that = this;
      this.columnsList.forEach(function(item, index) {
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
                attrs: {
                  clearable: true
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
    getDepartmentData() {
      this.loading = true;
      let q = this.queryData;
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
            this.dataList = list.data_info;
            this.queryData.count = list.page_count;

            this.cloneDataList = JSON.parse(JSON.stringify(list.data_info)).map(
              function(item) {
                item.editting = false;
                item.saving = false;
                return item;
              }
            );

            this.loading = false;
          }
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    subminAddData() {
      if (!this.$RegExp.verifyIsNull(this.addData.name)) {
        this.$Message.warning(
          `${this.$t("tip.inputBox")}${this.$t("tip.canNotBeEmpty")}`
        );
        return;
      } else if (!this.$RegExp.isFullwidthChar(this.addData.name)) {
        let msg = `${this.$t("tip.pleaseInput")}${this.$t(
          "tip.chinese"
        )}、${this.$t("tip.letter")}、${this.$t("tip.n")}`;
        this.$Message.warning(msg);
        return;
      }

      this.$api.auth_login
        .addDepartment({
          name: this.addData.name
        })
        .then(res => {
          if (res.data.code === 0) {
            this.$Message.success(this.$t("tip.addSuccess"));
            this.isShowAddData = false;
            this.addData.name = null;

            this.getDepartmentData();
            this.setTable();
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    cancelBtn() {
      this.isShowAddData = false;
      this.addData.name = null;
    }
  }
};
</script>

<style lang="less" scoped>
.department-box {
  .single-page-container;

  .department-header {
    .header;

    .header-left {
      float: left;
    }

    .header-right {
      float: right;
      display: flex;
    }
  }

  .department-body {
    .body;

    .page {
      text-align: center;
    }
  }
}

.add-box {
  width: 100%;
  padding: 10px 0;

  p {
    font-size: 14px;
    padding-bottom: 5px;
  }
}

.modal-item-btn {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>