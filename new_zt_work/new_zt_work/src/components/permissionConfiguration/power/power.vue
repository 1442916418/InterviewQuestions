<!-- 权限 -->

<template>
  <div class="power-list" style="position: relative;">
    <div class="table-header">
      <Button type="info" icon="md-add" @click="addPower">{{$t('btn.newlyAdded')}}</Button>
      <div class="table-header-right">
        <Select
          prefix="ios-search"
          v-model="queryData.type"
          style="width:200px"
          @on-change="onChangeType"
        >
          <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
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
  name: "powerList",
  data() {
    return {
      columnsList: [
        {
          title: "ID",
          key: "id",
          align: "center"
        },
        {
          title: "权限名称",
          key: "power_name",
          align: "center",
          editable: true
        },
        {
          title: "权限码",
          key: "power_url",
          align: "center",
          editable: true
        },
        {
          title: "权限类型",
          key: "type",
          align: "center",
          option: true,
          editable: true
        },
        {
          title: "操作",
          align: "center",
          key: "handle",
          handle: ["delete"]
        }
      ],
      typeArray: [
        {
          value: "1",
          label: "接口"
        },
        {
          value: "2",
          label: "菜单"
        },
        {
          value: "3",
          label: "产品"
        },
        {
          value: "4",
          label: "设备"
        }
      ],
      cityList: [
        {
          value: 0,
          label: "全部"
        },
        {
          value: 1,
          label: "接口"
        },
        {
          value: 2,
          label: "菜单"
        },
        {
          value: 3,
          label: "产品"
        },
        {
          value: 4,
          label: "设备"
        }
      ],
      loading: false,
      dataList: [],
      cloneDataList: [],
      queryData: {
        page_index: 1,
        page_size: 10,
        count: 0,
        type: 0
      },
      addPowerName: "",
      addPowerUrl: "",
      addSelectType: "",
      modalLoading: true,
      editSeleteRoleId: "",
      selectType: 0
    };
  },
  created() {
    this.$Modal.remove();
    this.getPowerList();
    this.init();
  },
  beforeDestroy() {
    this.loading = false;
    this.dataList = [];
    this.cloneDataList = [];
    this.queryData = {
      page_index: 1,
      page_size: 10,
      count: 0,
      type: 0
    };
    this.addPowerName = "";
    this.addPowerUrl = "";
    this.addSelectType = "";
    this.modalLoading = true;
    this.editSeleteRoleId = "";
    this.selectType = 0;
  },
  methods: {
    onChangeType(val) {
      this.queryData.type = val;
      this.getPowerList();
      this.init();
    },
    setPowerName(name) {
      let n = null;
      switch (name) {
        case 1:
          n = "接口";
          return n;
          break;
        case 2:
          n = "菜单";
          return n;
          break;
        case 3:
          n = "产品";
          return n;
          break;
        case 4:
          n = "设备";
          return n;
          break;
      }
    },
    handleSizeChange(val) {
      this.queryData.page_size = val;
      this.getPowerList();
      this.init();
    },
    handleIndexChange(val) {
      this.queryData.page_index = val;
      this.getPowerList();
      this.init();
    },
    query() {
      this.queryData.type = this.selectType;
      this.getPowerList();
      this.init();
    },
    getPowerList() {
      this.loading = true;
      let q = this.queryData;
      let data = {
        type: q.type,
        page_index: q.page_index,
        page_size: q.page_size
      };

      this.$api.auth_login
        .getPowerList(data)
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
            var currentRow = that.cloneDataList[params.index];

            if (!currentRow.editting) {
              if (item.key === "type") {
                let name = that.setPowerName(currentRow["type"]);
                return h("span", name);
              }

              return h("span", currentRow[item.key]);
            } else {
              if (item.option) {
                return h(
                  "Select",
                  {
                    props: {
                      value: currentRow[params.column.key],
                      placeholder: this.$t("tip.pleaseSelect")
                    },
                    on: {
                      "on-change": value => {
                        that.editSeleteRoleId = value.toString();
                        that.$set(currentRow, params.column.key, value);
                      }
                    }
                  },
                  [
                    that.addRoleId.map(function(t) {
                      return h(
                        "Option",
                        {
                          props: {
                            value: t.id
                          }
                        },
                        t.role_name
                      );
                    })
                  ]
                );
              } else {
                return h("Input", {
                  props: {
                    type: "text",
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
            }
          };
        }

        if (item.handle) {
          item.render = function(h, param) {
            var currentRow = that.cloneDataList[param.index];
            var children = [];
            item.handle.forEach(function(item) {
              if (item === "delete") {
                children.push(deleteButton(that, h, currentRow, param.index));
              }
            });
            return h("div", children);
          };
        }
      });
    },
    handleBackdata: function(object) {
      var clonedData = JSON.parse(JSON.stringify(object));
      delete clonedData.editting;
      delete clonedData.saving;
      return clonedData;
    },
    deleteData: function(currentRow, index) {
      let data = {
        power_id: currentRow.id
      };

      this.$api.auth_login
        .deletePower(data)
        .then(res => {
          if (res.data.code === 0) {
            this.$delete(this.dataList, index);
            this.$delete(this.cloneDataList, index);
            this.$Message.success(this.$t("tip.deleteSuccess"));
            this.getPowerList();
            this.init();
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    addPowerA() {
      if (this.addPowerName.trim() === "") {
        this.$Message.warning(this.$t("tip.pleaseEnterThePermissionName"));
        return;
      } else if (this.addPowerUrl.trim() === "") {
        this.$Message.warning(this.$t("tip.pleaseEnterThePermissionCode"));
        return;
      } else if (this.addSelectType === "") {
        this.$Message.warning(this.$t("tip.pleaseEnterThePermissionType"));
        return;
      } else {
        let data = {
          power_name: this.addPowerName,
          power_url: this.addPowerUrl,
          type: this.addSelectType
        };

        this.$api.auth_login
          .addPower(data)
          .then(res => {
            if (res.data.code === 0) {
              this.$Message.success(this.$t("tip.addSuccess"));
              this.$Modal.remove();
              this.getPowerList();
              this.init();
            }
          })
          .catch(error => {
            this.$Message.error(this.$t("tip.requestError"));
          });
      }
    },
    addPower() {
      this.addPowerName = "";
      this.addPowerUrl = "";

      this.$Modal.confirm({
        scrollable: true,
        loading: this.modalLoading,
        render: h => {
          return h("div", [
            h("div", {
              domProps: {
                innerHTML: this.$t("tip.pleaseEnterThePermissionName")
              },
              style: {
                "text-align": "left",
                "padding-top": "10px"
              }
            }),
            h("Input", {
              props: {
                value: this.addPowerName,
                autofocus: true,
                placeholder: this.$t("tip.pleaseEnterThePermissionName")
              },
              style: {
                "margin-top": "10px",
                "margin-padding": "10px"
              },
              on: {
                input: val => {
                  this.addPowerName = val;
                }
              }
            }),
            h("div", {
              domProps: {
                innerHTML: this.$t("tip.pleaseEnterThePermissionCode")
              },
              style: {
                "text-align": "left",
                "padding-top": "10px"
              }
            }),
            h("Input", {
              props: {
                value: this.addPowerUrl,
                autofocus: true,
                placeholder: this.$t("tip.pleaseEnterThePermissionCode")
              },
              style: {
                "margin-top": "10px",
                "margin-padding": "10px"
              },
              on: {
                input: val => {
                  this.addPowerUrl = val;
                }
              }
            }),
            h("div", {
              domProps: {
                innerHTML: this.$t("tip.pleaseEnterThePermissionType")
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
                  placeholder: this.$t("tip.pleaseEnterThePermissionType")
                },
                on: {
                  "on-change": value => {
                    this.addSelectType = value.toString();
                  }
                },
                style: {
                  "margin-top": "10px",
                  "margin-padding": "10px"
                }
              },
              [
                this.typeArray.map(function(type) {
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
                        this.addPowerA();
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
                        this.addPowerName = "";
                        this.addPowerUrl = "";
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
.power-list {
  .single-page-container;

  .table-header {
    .header;

    .table-header-right {
      float: right;
    }
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