<!-- 权限组 -->

<template>
  <div class="powerGroup-list" style="position: relative;">
    <div class="table-header">
      <Button type="primary" @click="addPowerGroup">{{$t('btn.newlyAdded')}}</Button>
    </div>

    <div class="table-body">
      <Table
        :columns="columnsList"
        :data="dataList"
        ref="table"
        :height=" pageSize > 10 ? pageSize === 10 ? 520 : currentHeight : 0"
      ></Table>

      <div class="page" v-if="pageCount >= 10">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageCount"
        ></el-pagination>
      </div>
    </div>

    <div class="spin-box" v-if="spinShow">
      <div class="spin">
        <span class="spin-dot"></span>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from "../../../plugin/language/i18n";
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
            if (
              JSON.stringify(tempData) == JSON.stringify(vm.dataList[index])
            ) {
              vm.$Message.warning(i18n.t("tip.notChanged"));
              return (currentRow.editting = false);
            }
            vm.saveData(currentRow, index);
            currentRow.saving = true;
          }
        }
      }
    },
    currentRow.editting ? i18n.t("tip.preservation") : i18n.t("tip.edit")
  );
};
let deleteButton = function(vm, h, currentRow, index) {
  return h(
    "Poptip",
    {
      props: {
        confirm: true,
        title:
          currentRow.WRAPDATASTATUS != i18n.t("btn.delete")
            ? i18n.t("tip.confirmDeletion")
            : i18n.t("tip.revocationAndDeletion"),
        transfer: true,
        placement: "left",
        cancelText: i18n.t("btn.cancel"),
        okText: i18n.t("btn.determine")
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
            title: i18n.t("btn.delete")
          },
          props: {
            size: "small",
            type: "error"
          }
        },
        i18n.t("btn.delete")
      )
    ]
  );
};

export default {
  name: "powerGroupList",
  data() {
    return {
      pageSizes: this.$glb.tableDefaultPageSizes,
      columnsList: [
        {
          title: "ID",
          key: "id",
          align: "center"
        },
        {
          title: "名称",
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
      spinShow: false,
      dataList: [],
      cloneDataList: [],
      pageIndex: 1,
      pageSize: 10,
      pageCount: 0,
      addPowerGroupName: "",
      currentHeight: 500
    };
  },
  beforeDestroy() {
    this.spinShow = false;
    this.dataList = [];
    this.cloneDataList = [];
    this.pageIndex = 1;
    this.pageSize = 10;
    this.pageCount = 0;
    this.addPowerGroupName = "";
    this.currentHeight = 500;
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.getPowerGroupList();
      this.init();
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getPowerGroupList();
      this.init();
    },
    getPowerGroupList() {
      this.spinShow = true;
      let data = {
        page_index: this.pageIndex,
        page_size: this.pageSize
      };

      this.$api.auth_login
        .getPowerGroupList(data)
        .then(res => {
          if (res.data.code === 0) {
            this.dataList = res.data.data.data_info;
            this.pageCount = res.data.data.page_count;

            this.cloneDataList = JSON.parse(JSON.stringify(this.dataList)).map(
              function(item) {
                item.editting = false;
                item.saving = false;
                return item;
              }
            );

            this.spinShow = false;
          } else {
            this.spinShow = false;
          }
        })
        .catch(error => {
          this.spinShow = false;
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
    handleBackdata: function(object) {
      let clonedData = JSON.parse(JSON.stringify(object));
      delete clonedData.editting;
      delete clonedData.saving;
      return clonedData;
    },
    saveData: function(currentRow, index) {
      let data = {
        power_group_id: currentRow.id,
        power_group_name: currentRow.name
      };

      this.$api.auth_login
        .editPowerGroup(data)
        .then(res => {
          if (res.data.code === 0) {
            currentRow.saving = false;
            currentRow.editting = false;
            this.$Message.success(this.$t("tip.editSuccess"));

            this.getPowerGroupList();
            this.init();
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    deleteData(currentRow, index) {
      let data = {
        power_group_id: currentRow.id
      };
      this.$api.auth_login
        .deletePowerGroup(data)
        .then(res => {
          if (res.data.code === 0) {
            this.$delete(this.dataList, index);
            this.$delete(this.cloneDataList, index);
            this.$Message.success(this.$t("tip.deleteSuccess"));

            this.getPowerGroupList();
            this.init();
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    addPowerGroupNameA() {
      if (this.addPowerGroupName.trim() === "") {
        this.$Message.warning(this.$t("tip.pleaseEnterTheRoleName"));
        return;
      } else {
        let data = {
          power_group_name: this.addPowerGroupName
        };

        this.$api.auth_login
          .addPowerGroup(data)
          .then(res => {
            if (res.data.code === 0) {
              this.$Message.success(this.$t("tip.addSuccess"));

              this.$Modal.remove();
              this.getPowerGroupList();
              this.init();
            }
          })
          .catch(error => {
            this.$Modal.remove();
            this.$Message.error(this.$t("tip.requestError"));
          });
      }
    },
    addPowerGroup() {
      this.$Modal.confirm({
        scrollable: true,
        render: h => {
          return h("div", [
            h("div", {
              domProps: {
                innerHTML: this.$t("tip.pleaseEnterPermissionGroupName")
              },
              style: {
                "margin-top": "10px",
                "margin-bottom": "10px"
              }
            }),
            h("Input", {
              props: {
                value: this.addPowerGroupName,
                autofocus: true,
                placeholder: this.$t("tip.pleaseEnterPermissionGroupName")
              },
              on: {
                input: val => {
                  this.addPowerGroupName = val;
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
                        this.addPowerGroupNameA();
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
                        this.addPowerGroupName = "";
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
  },
  created() {
    this.$Modal.remove();
    this.getPowerGroupList();
    this.init();
  },
  mounted() {
    this.tableHeight =
      window.innerHeight -
      this.$refs.table.$el.offsetTop -
      this.$glb.tableDefaultHeight;
  }
};
</script>

<style lang="less" scoped>
.powerGroup-list {
  .single-page-container;

  .table-header {
    width: 100%;
    padding: 20px 50px;
  }
  .table-body {
    width: 100%;
    height: 90%;
    padding: 20px 50px;

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