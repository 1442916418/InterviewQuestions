<!-- 运维 -->

<template>
  <div class="devOpsList-box" style="position: relative;">
    <div class="devOpsList-header">
      <div class="header-left">
        <Button
          icon="md-checkmark"
          style="margin-right: 20px;"
          type="error"
          @click="delDevices"
          :loading="delLoading"
        >{{$t('btn.toExamine')}}</Button>
      </div>
      <div class="header-right">
        <Button
          type="primary"
          icon="ios-search"
          @click="() => isShowRightDrawer = !isShowRightDrawer"
        >{{$t('tip.screening')}}</Button>
      </div>
    </div>

    <div class="devOpsList-body">
      <DefaultTable
        :isPage="true"
        :isSelection="true"
        :columnsList="columnsList"
        :dataList="dataList"
        :loading="loading"
        :queryData="queryData"
        @handleSizeChange="handleSizeChange"
        @handleIndexChange="handleIndexChange"
        @onSelectionChange="onSelectionChange"
      />
    </div>

    <Modal title="查看大图" v-model="visible" class-name="fl-image-modal">
      <img :src="imgUrl" style="width: 100%" />
    </Modal>

    <Drawer width="300" :title="$t('tip.screening')" :closable="false" v-model="isShowRightDrawer">
      <div class="search-box">
        <div class="item">
          <p>{{$t("tip.pleaseSelectSite")}}</p>
          <SelectDevice @changeMn="selectDeviceMn" @initMn="initMn"></SelectDevice>
        </div>
        <div class="item">
          <p>{{$t('tip.pleaseSelectTime')}}</p>
          <SelectTime @changeStartDate="changeStartDate" @changeEndDate="changeEndDate"></SelectTime>
        </div>
        <div class="item">
          <p>{{`${$t("tip.pleaseSelect")}${$t("tip.operatioalRecordType")}`}}</p>
          <Select
            @on-change="selectType"
            style="width:220px"
            :placeholder="$t('tip.pleaseSelect') + $t('tip.operatioalRecordType')"
            filterable
            :value="queryData.operation_type"
          >
            <Option
              v-for="item in operationType"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
        </div>
        <div class="item">
          <p>{{$t('tip.pleaseSelect') + $t('tip.auditStatus')}}</p>
          <Select
            @on-change="checkStatu"
            style="width:220px"
            :placeholder="$t('tip.pleaseSelect') + $t('tip.auditStatus')"
            filterable
            :value="queryData.check_status"
          >
            <Option
              v-for="item in checkStatus"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
        </div>
        <div class="item">
          <p>{{$t('tip.pleaseSelectUsers')}}</p>
          <SelectUser @changeUser="selectUser"></SelectUser>
        </div>
        <div class="item">
          <p>{{ $t('tip.pleaseSelectReviewer') }}</p>
          <Select
            @on-change="selectSHUser"
            style="width:220px"
            :placeholder="$t('tip.pleaseSelectReviewer')"
            filterable
            :value="queryData.check_user_id"
          >
            <Option
              v-for="(item,index) in newproductData"
              :value="item.user_id"
              :label="item.name"
              :key="index"
            ></Option>
          </Select>
        </div>
        <div class="bottom-btn">
          <Button
            type="primary"
            style="margin-bottom:10px;"
            @click="query"
            long
          >{{$t('btn.search')}}</Button>
          <Button
            type="warning"
            style="margin-bottom:10px;"
            @click="clearSelect"
            long
          >{{$t('btn.reset')}}</Button>
          <Button long @click="() => isShowRightDrawer = !isShowRightDrawer">{{$t('btn.cancel')}}</Button>
        </div>
      </div>
    </Drawer>
  </div>
</template>

<script>
export default {
  name: "devOpsList",
  data() {
    return {
      isShowRightDrawer: false,
      newproductData: [],
      src: "",
      visible: false,
      imgUrl: "",
      loading: false,
      productData: [],
      queryData: {
        mn: "",
        start_time: null,
        end_time: null,
        operation_type: "",
        check_status: -2,
        user_id: -2,
        check_user_id: -2,
        page_index: 1,
        page_size: 10,
        count: 0
      },
      dataList: [],
      tableHeight: 520,
      devicesId: [],
      delLoading: false,
      operationType: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "废液回收",
          value: "liquid_recovery"
        },
        {
          label: "易损易耗件更换",
          value: "replace_parts"
        },
        {
          label: "集成干预检查",
          value: "integrated_intervention"
        },
        {
          label: "试剂更换",
          value: "change_reagent"
        },
        {
          label: "巡检维护记录",
          value: "normal_operation"
        },
        {
          label: "标样核查",
          value: "standard_check"
        },
        {
          label: "多点线性核查",
          value: "multipoint_check"
        },
        {
          label: "实际水样对比",
          value: "water_sample_comparison"
        },
        {
          label: "加标回收率测试",
          value: "recovery_test"
        }
      ],
      checkStatus: [
        {
          label: "全部",
          value: -2
        },
        {
          label: "已审核",
          value: 0
        },
        {
          label: "未审核",
          value: 1
        }
      ],
      columnsList: [
        {
          fixed: "left",
          type: "selection",
          width: 50,
          align: "center"
        },
        {
          type: "index",
          title: "序号",
          minWidth: 50,
          fixed: "left",
          align: "center"
        },
        {
          align: "center",
          title: "时间",
          fixed: "left",
          minWidth: 150,
          key: "timestamp",
          render: (h, params) => {
            let d = params.row.timestamp;
            let time = this.$moment.unix(d).format("YYYY-MM-DD HH:mm:ss");
            return h("span", time);
          }
        },
        {
          title: "图片",
          key: "img_url",
          width: 100,
          render: (h, params) => {
            return h("div", [
              h("img", {
                style: {
                  float: "left",
                  cursor: "pointer",
                  width: "40px",
                  height: "40px"
                },
                attrs: {
                  src: params.row.img_url
                    ? params.row.img_url
                    : "./static/images/commodity_default.png"
                },
                on: {
                  click: e => {
                    this.handleView(e.srcElement.currentSrc); //点击查看大图
                  }
                }
              })
            ]);
          }
        },
        {
          align: "center",
          title: "运维记录类型",
          key: "operation_name",
          minWidth: 120
        },
        {
          align: "center",
          title: "添加记录人员",
          key: "user_id",
          minWidth: 120,
          render: (h, params) => {
            let d = params.row.user_id == null ? "" : params.row.user_id;
            if (d != "") {
              let listlist = this.productData;
              for (let i = 0; i < listlist.length; i++) {
                let aaaaa = listlist[i].id;
                if (d === aaaaa) {
                  let aaa = listlist[i].real_name;
                  return h("span", aaa);
                }
              }
            }
          }
        },
        {
          align: "center",
          title: "审核记录人员",
          key: "check_user_id",
          minWidth: 120,
          render: (h, params) => {
            let d =
              params.row.check_user_id == null ? "" : params.row.check_user_id;
            if (d != "") {
              let listlist = this.productData;
              for (let i = 0; i < listlist.length; i++) {
                let aaaaa = listlist[i].id;
                if (d === aaaaa) {
                  let aaa = listlist[i].real_name;
                  return h("span", aaa);
                }
              }
            }
          }
        },
        {
          align: "center",
          title: "审核状态",
          key: "check_status",
          minWidth: 120,
          render: (h, params) => {
            let d = params.row.check_status;
            d = Number(d);
            if (d === 0) {
              return h("span", "已审核");
            } else if (d === 1) {
              return h("span", "未审核");
            }
          }
        }
      ]
    };
  },
  created() {
    this.isShowRightDrawer = false;
    this.initData();
    this.getUserData();
  },
  beforeDestroy() {
    this.isShowRightDrawer = false;
    this.newproductData = [];
    this.src = "";
    this.visible = false;
    this.imgUrl = "";
    this.loading = false;
    this.productData = [];
    this.queryData = {
      mn: "",
      start_time: null,
      end_time: null,
      operation_type: "",
      check_status: -2,
      user_id: -2,
      check_user_id: -2,
      page_index: 1,
      page_size: 10,
      count: 0
    };
    this.dataList = [];
    this.tableHeight = 520;
    this.devicesId = [];
    this.delLoading = false;
  },
  methods: {
    clearSelect() {
      let state = this.$store.state,
        s = null,
        e = null;
      let start_time = `${this.$moment()
          .subtract(30, "d")
          .format("YYYY-MM-DD HH:MM:SS")}`,
        end_time = `${this.$moment().format("YYYY-MM-DD HH:MM:SS")}`;

      try {
        if (state.selectStartDate === null || state.selectEndDate === null) {
          s = start_time;
          e = end_time;
          this.$store.dispatch({
            type: "saveSelectStartDate",
            obj: s
          });
          this.$store.dispatch({
            type: "saveSelectEndDate",
            obj: e
          });
        } else {
          if (
            state.selectStartDate.obj === null ||
            state.selectEndDate.obj === null
          ) {
            s = start_time;
            e = end_time;
            this.$store.dispatch({
              type: "saveSelectStartDate",
              obj: s
            });
            this.$store.dispatch({
              type: "saveSelectEndDate",
              obj: e
            });
          } else {
            s = state.selectStartDate.obj;
            e = state.selectEndDate.obj;
          }
        }
      } catch (error) {
        s = `${this.$moment()
          .subtract(30, "d")
          .format("YYYY-MM-DD HH:MM:SS")}`;
        e = `${this.$moment().format("YYYY-MM-DD HH:MM:SS")}`;
        this.$store.dispatch({
          type: "saveSelectStartDate",
          obj: s
        });
        this.$store.dispatch({
          type: "saveSelectEndDate",
          obj: e
        });
      }

      this.queryData = {
        mn: "",
        start_time: s,
        end_time: e,
        operation_type: "",
        check_status: -2,
        user_id: -2,
        check_user_id: -2,
        page_index: 1,
        page_size: 10,
        count: 0
      };
    },
    handleView(url) {
      let _this = this;
      _this.imgUrl = url;
      _this.visible = true;
    },
    getUserDataList() {
      let data = {
        page_index: 1,
        page_size: 1000
      };
      this.$api.auth_login
        .getUserDataList(data)
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
    selectUser(value) {
      this.queryData.user_id = value.id;
    },
    selectSHUser(value) {
      this.queryData.check_user_id = value;
    },
    changeStartDate(v) {
      this.queryData.start_time = v;
    },
    changeEndDate(v) {
      this.queryData.end_time = v;
    },
    initMn(v) {
      this.queryData.mn = v.mn;

      this.getPowerList();
    },
    selectDeviceMn(v) {
      this.queryData.mn = v.mn;
    },
    selectType(value) {
      let data2 = value == null ? "" : value;
      this.queryData.operation_type = data2;
    },
    handleSizeChange(val) {
      this.queryData.page_index = 1;
      this.queryData.page_size = val;
      this.getPowerList();
    },
    handleIndexChange(val) {
      this.queryData.page_index = val;
      this.getPowerList();
    },
    query() {
      this.isShowRightDrawer = false;
      this.getPowerList();
    },
    getPowerList() {
      this.loading = true;
      let d = this.queryData;
      let data = {
        mn: d.mn,
        start_time: new Date(d.start_time).getTime(),
        end_time: new Date(d.end_time).getTime(),
        operation_type: d.operation_type,
        check_status: d.check_status,
        user_id: d.user_id,
        check_user_id: d.check_user_id,
        page_index: d.page_index,
        page_size: d.page_size
      };
      this.$api.monitor1
        .getdevOpsList(data)
        .then(res => {
          if (res.data.code === 0) {
            this.dataList = res.data.data.list;
            this.queryData.count = res.data.data.page_count;

            this.cloneDataList = JSON.parse(JSON.stringify(this.dataList)).map(
              function(item) {
                item.editting = false;
                item.saving = false;
                return item;
              }
            );
          }
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    initData() {
      let state = this.$store.state,
        s = null,
        e = null;
      let start_time = `${this.$moment()
          .subtract(30, "d")
          .format("YYYY-MM-DD HH:MM:SS")}`,
        end_time = `${this.$moment().format("YYYY-MM-DD HH:MM:SS")}`;

      try {
        if (state.selectStartDate === null || state.selectEndDate === null) {
          s = start_time;
          e = end_time;
          this.$store.dispatch({
            type: "saveSelectStartDate",
            obj: s
          });
          this.$store.dispatch({
            type: "saveSelectEndDate",
            obj: e
          });
        } else {
          if (
            state.selectStartDate.obj === null ||
            state.selectEndDate.obj === null
          ) {
            s = start_time;
            e = end_time;
            this.$store.dispatch({
              type: "saveSelectStartDate",
              obj: s
            });
            this.$store.dispatch({
              type: "saveSelectEndDate",
              obj: e
            });
          } else {
            s = state.selectStartDate.obj;
            e = state.selectEndDate.obj;
          }
        }
      } catch (error) {
        s = `${this.$moment()
          .subtract(30, "d")
          .format("YYYY-MM-DD HH:MM:SS")}`;
        e = `${this.$moment().format("YYYY-MM-DD HH:MM:SS")}`;
        this.$store.dispatch({
          type: "saveSelectStartDate",
          obj: s
        });
        this.$store.dispatch({
          type: "saveSelectEndDate",
          obj: e
        });
      }

      this.queryData = {
        mn: "",
        start_time: s,
        end_time: e,
        operation_type: "",
        check_status: -2,
        user_id: -2,
        check_user_id: -2,
        page_index: 1,
        page_size: 10
      };
    },
    deleteData(currentRow, index) {
      let data = currentRow.img_url;
      window.open(data, "_blank");
    },
    checkStatu(value) {
      this.queryData.check_status = value;
    },
    delDevices() {
      let ids = this.devicesId;
      if (ids.length === 0) {
        this.$Message.warning(this.$t("tip.pleaseCheckThenRecordToBeAudited"));
        return;
      } else {
        this.$Modal.confirm({
          title: this.$t("tip.bigPicture"),
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
                          this.delectDevices(ids);
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
                          this.$refs.table.selectAll(false);
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
    delectDevices(ids) {
      this.delLoading = true;
      let data = {
        _ids: ids
      };
      this.$api.monitor1
        .batchAuditRecrd(data)
        .then(res => {
          if (res.data.code === 0) {
            this.$Message.success(this.$t("tip.auditSuccess"));
            debugger;
            this.delLoading = false;
            this.$Modal.remove();
            this.getPowerList();
          }
        })
        .catch(error => {
          this.delLoading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    onSelectionChange(selection) {
      this.devicesId = [];

      for (let i = 0; i < selection.length; i++) {
        this.devicesId.push(selection[i]._id);
      }
    },
    getUserData() {
      this.getUserDataList();
      let data = {
        page_index: 1,
        page_size: 1000
      };

      this.$api.monitor1
        .getOperationCheckUserData(data)
        .then(res => {
          if (res.data.code === 0) {
            this.newproductData = [];
            let list = res.data.data;

            if (list.length === 0) {
              this.queryData.check_user_id = -2;
              this.newproductData = [];

              this.$Message.warning(this.$t("tip.noDataType"));
            } else {
              this.newproductData = [];

              for (let i = 0; i < list.length; i++) {
                this.newproductData.unshift({
                  user_id: list[i].user_id,
                  id: list[i].id,
                  name: this.setUserName(list[i].user_id)
                });
              }
              this.newproductData.unshift({
                user_id: -2,
                id: -2,
                name: "全部审核员"
              });
            }
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    setUserName(id) {
      let list = this.productData;
      for (let i = 0; i < list.length; i++) {
        let userId = list[i].id;
        if (id == userId) {
          let name = list[i].real_name;
          return name;
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.devOpsList-box {
  .single-page-container;

  .devOpsList-header {
    .header;
    .header-left {
      float: left;
    }

    .header-right {
      float: right;
    }
  }

  .devOpsList-body {
    .body;

    .page {
      padding: 20px 0;
      text-align: center;
    }
  }
}

.bottom-btn {
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}

.search-box {
  width: 100%;

  .item {
    width: 100%;
    padding: 5px;

    p {
      padding: 5px 0;
      font-size: 14px;
    }
  }
}
</style>