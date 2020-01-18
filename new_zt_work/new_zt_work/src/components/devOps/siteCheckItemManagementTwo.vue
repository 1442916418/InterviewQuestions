<!-- 站点检查项管理2(配置标样浓度和量程) -->

<template>
  <div class="siteCheckItemManagementTwo-box">
    <div class="siteCheckItemManagementTwo-header">
      <div class="header-left">
        <Select
          @on-change="selectDeviceId"
          style="width:200px"
          :placeholder="$t('tip.pleaseSelectSite')"
          filterable
        >
          <Option v-for="item in deviceData" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
    </div>

    <div class="siteCheckItemManagementTwo-body">
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
        type: currentRow.editting ? "success" : "info"
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

export default {
  name: "siteCheckItemManagementTwo",
  data() {
    return {
      deviceData: [],
      loading: false,
      dataList: [],
      cloneDataList: [],
      queryData: {
        device_id: 0,
        page_index: 1,
        page_size: 10,
        count: 0
      },
      PAGECOUNT: 0,
      PAGEINDEX: 1,
      PAGESIZE: 10,
      modalLoading: true,
      addComponent: {
        name: null,
        unit: null,
        key: null,
        department: null
      },
      productData: [],
      deviceId: 0,
      columnsList: [
        {
          align: "center",
          title: "序号",
          type: "index"
        },
        {
          align: "center",
          title: "组分名称",
          key: "component_name"
        },
        {
          align: "center",
          title: "组分参数",
          key: "key"
        },
        {
          align: "center",
          title: "标样浓度",
          key: "standard_value",
          render: (h, param) => {
            return "span", null;
          },
          editable: true
        },
        {
          align: "center",
          title: "预设量程",
          key: "range_value",
          editable: true
        },
        {
          title: "操作",
          align: "center",
          key: "handle",
          handle: ["edit"]
        }
      ]
    };
  },
  created() {
    this.$Modal.remove();
    this.getDeviceData();
  },
  beforeDestroy() {
    this.deviceData = [];
    this.loading = false;
    this.dataList = [];
    this.cloneDataList = [];
    this.queryData = {
      device_id: 0,
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
    selectDeviceId(value) {
      this.queryData.device_id = value;
      this.getDeviceComponentRelation();
      this.init();
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
      let data = {
        device_id: row.device_id,
        component_id: row.component_id,
        standard_value: row.standard_value,
        range_value: row.range_value
      };

      this.$api.monitor1
        .updateDeviceComponentValue(data)
        .then(res => {
          if (res.data.code === 0) {
            this.$Modal.remove();
            row.saving = false;
            row.editting = false;
            this.$Message.success(this.$t("tip.editSuccess"));
            this.getDeviceComponentRelation();
            this.init();
          }
        })
        .catch(error => {
          row.saving = false;
          row.editting = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    getDeviceData() {
      let data = {
        page_index: 1,
        page_size: 300
      };

      this.$api.monitor1
        .getDeviceData(data)
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data.data_info;
            if (list.length === 0) {
              this.$Message.warning(this.$t("tip.noEquipment"));
              return;
            } else {
              this.deviceData = [];
              this.deviceData = list;
              for (let i = 0; i < this.deviceData.length; i++) {
                this.deviceData[i].label = this.deviceData[i].name;
                this.deviceData[i].value = this.deviceData[i].id;
              }
            }
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    getDeviceComponentRelation() {
      this.loading = true;
      let q = this.queryData;
      let data = {
        device_id: q.device_id,
        page_index: q.page_index,
        page_size: q.page_size
      };

      this.$api.monitor1
        .getDeviceComponentData(data)
        .then(res => {
          if (res.data.code === 0) {
            this.queryData.count = 0;
            this.cloneDataList = [];
            let list = res.data.data;

            if (list.data_info.length === 0) {
              this.loading = false;
              this.$Message.warning(this.$t("tip.noEquipment"));
              return;
            }
            this.queryData.count = list.page_count;
            this.dataList = list.data_info;

            this.cloneDataList = JSON.parse(JSON.stringify(list.data_info)).map(
              item => {
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
    init() {
      let that = this;
      this.columnsList.forEach((item, index) => {
        if (item.editable) {
          item.render = function(h, params) {
            let currentRow = that.cloneDataList[params.index];
            if (!currentRow.editting) {
              if (item.key === "standard_value") {
                if (currentRow["standard_value"] === -1) {
                  return h("span", "无");
                }
                return h("span", currentRow[item.key]);
              }

              if (item.key === "range_value") {
                if (currentRow["range_value"] === -1) {
                  return h("span", "无");
                }
                return h("span", currentRow[item.key]);
              }
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
    handleBackdata(object) {
      let clonedData = JSON.parse(JSON.stringify(object));
      delete clonedData.editting;
      delete clonedData.saving;
      return clonedData;
    },
    handleSizeChange(val) {
      this.queryData.page_index = 1;
      this.queryData.page_size = val;
      this.getDeviceComponentRelation();
      this.init();
    },
    handleIndexChange(val) {
      this.queryData.page_index = val;
      this.getDeviceComponentRelation();
      this.init();
    }
  }
};
</script>

<style lang="less" scoped>
.siteCheckItemManagementTwo-box {
  .single-page-container;

  .siteCheckItemManagementTwo-header {
    .header;

    .header-left {
      float: left;
    }
    .header-right {
      float: right;
    }
  }

  .siteCheckItemManagementTwo-body {
    .body;

    .page {
      padding: 20px 0;
      text-align: center;
    }
  }
}
</style>