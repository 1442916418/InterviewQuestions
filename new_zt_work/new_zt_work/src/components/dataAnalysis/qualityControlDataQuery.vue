<!-- 质控数据查询 -->

<template>
  <div class="qualityControlDataQuery-box">
    <div class="qualityControlDataQuery-header">
      <div class="header-left">
        <SelectDevice @changeMn="selectDeviceMn" @initMn="initMn"></SelectDevice>
        <Select
          @on-change="selectDataType"
          style="width:120px;margin-right:10px;"
          :placeholder="$t('tip.pleaseSelectADataType')"
          filterable
          :value="queryData.type"
        >
          <Option
            v-for="(item,index) in productData"
            :value="item.cn"
            :label="item.data_name"
            :key="index"
          ></Option>
        </Select>
        <Select
          @on-change="selectComponent"
          style="width:130px;margin-right:10px;"
          :placeholder="$t('tip.pleaseSelectComponents')"
          filterable
          :value="queryData.component"
        >
          <Option
            v-for="item in componentData"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</Option>
        </Select>
        <SelectTime @changeStartDate="changeStartDate" @changeEndDate="changeEndDate"></SelectTime>
      </div>
      <div class="header-right">
        <Button
          style="margin-right: 10px;"
          icon="md-download"
          @click="exportData"
        >{{$t('btn.exprot')}}</Button>
        <Button type="primary" icon="md-search" @click="btnQueryData">{{$t('btn.query')}}</Button>
      </div>
    </div>
    <div class="qualityControlDataQuery-body">
      <DefaultTable
        :isPage="false"
        :isSelection="false"
        :columnsList="columnsList"
        :dataList="dataList"
        :loading="loading"
        :queryData="queryData"
      />

      <Paging
        :queryData="queryData"
        @previousPage="previousPage"
        @nextPage="nextPage"
        @selectPage="selectPage"
      />
    </div>
  </div>
</template>
 
<script>
export default {
  name: "qualityControlDataQuery",
  data() {
    return {
      queryData: {
        mn: null,
        type: 1,
        start_time: null,
        end_time: null,
        component: "w01019",
        page_index: 1,
        page_size: 50
      },
      deviceData: [],
      getComponentData: [],
      formatStartDate: null,
      columnsList: [],
      dataList: [],
      tableHeight: 520,
      loading: false,
      meterData: [],
      PRODUCT_ID: 0,
      productData: [],

      componentData: [
        {
          label: "化学需氧量(COD)",
          value: "w01018"
        },
        {
          label: "高锰酸盐",
          value: "w01019"
        },
        {
          label: "氨氮",
          value: "w21003"
        },
        {
          label: "总磷",
          value: "w21011"
        },
        {
          label: "总氮",
          value: "w21001"
        }
      ],
      dataTypeData: [
        {
          label: "标样核查",
          value: 1
        },
        {
          label: "零点核查",
          value: 2
        },
        {
          label: "跨度核查",
          value: 3
        }
      ]
    };
  },
  mounted() {
    this.initData();
  },
  beforeDestroy() {
    this.queryData = {
      mn: null,
      type: 1,
      start_time: null,
      end_time: null,
      component: "w01019",
      page_index: 1,
      page_size: 50
    };
    this.deviceData = [];
    this.getComponentData = [];
    this.formatStartDate = null;
    this.columnsList = [];
    this.dataList = [];
    this.tableHeight = 520;
    this.loading = false;
    this.meterData = [];
    this.PRODUCT_ID = 0;
    this.productData = [];
  },
  methods: {
    changeStartDate(v) {
      this.queryData.start_time = this.$moment(v).unix();
    },
    changeEndDate(v) {
      this.queryData.end_time = this.$moment(v).unix();
    },
    initMn(value) {
      this.queryData.mn = value.mn;
      this.PRODUCT_ID = value.product_id;
      this.getProductAndDataType();
    },
    initData() {
      let state = this.$store.state,
        s = null,
        e = null;
      let start_time = `${this.$moment()
          .subtract(30, "d")
          .format("YYYY-MM-DD HH:MM:SS")}`,
        end_time = `${this.$moment().format("YYYY-MM-DD HH:MM:SS")}`;

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

      this.queryData = {
        mn: null,
        type: 1,
        start_time: this.$moment(s).unix(),
        end_time: this.$moment(e).unix(),
        component: "w01019",
        page_index: 1,
        page_size: 50
      };
    },
    selectDeviceMn(value) {
      this.queryData.mn = value.mn;

      this.PRODUCT_ID = value.product_id;
      this.getProductAndDataType();
    },
    getProductAndDataType() {
      let d = {
        product_id: this.PRODUCT_ID,
        type: 2
      };

      this.$api.monitor1
        .getDataType(d)
        .then(res => {
          if (res.data.code === 0) {
            this.productData = [];
            let list = res.data.data;

            if (list.length === 0) {
              this.queryData.type = "";
              this.productData = [];

              this.$Message.warning(this.$t("tip.noDataType"));
            } else {
              this.productData = list;

              this.TYPE = list[0].cn;
              this.queryData.type = list[0].cn;

              this.getMeterCheckList();
            }
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    exportData() {
      if (this.dataList.length === 0) {
        this.$Message.warning(this.$t("tip.noExport"));
        return;
      }

      let count = this.queryData.count;
      let pageSize = this.queryData.page_size;
      let currentIndex = this.dataList[this.dataList.length - 1].currentIndex;
      let rows = 0;
      if (currentIndex < pageSize) {
        rows = Number(currentIndex + 1);
      } else {
        rows = Number(pageSize + 1);
      }

      let xlsxParam = {
        raw: true,
        sheetRows: Number(rows)
      };

      let tb = document.querySelector("#table").querySelector(".ivu-table");
      let wb = this.$XLSX.utils.table_to_book(tb, xlsxParam);
      let t = this.$moment().format("YYYY-MM-DD HH:mm:ss");

      let wbout = this.$XLSX.write(wb, {
        bookType: "xlsx",
        type: "binary",
        type: "array"
      });
      try {
        this.$FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream;charset=utf-8" }),
          `质控数据${t}.xlsx`
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
    },
    selectPage(value) {
      this.queryData.page_size = value;
      this.getMeterCheckList();
    },
    nextPage() {
      this.queryData.page_index += 1;
      this.getMeterCheckList();
    },
    previousPage() {
      if (this.queryData.page_index === 1) {
        this.$Message.warning(this.$t("tip.firstPage"));
        return;
      } else {
        this.queryData.page_index -= 1;
        this.getMeterCheckList();
      }
    },
    setTable() {
      let list = this.meterData;
      this.dataList = [];
      this.columnsList = [];

      if (list.length === 0) {
        this.dataList = [];
        this.columnsList = [];
      } else {
        this.columnsList.push(
          {
            title: "序号",
            key: "currentIndex",
            minWidth: 80,
            fixed: "left",
            sortable: true,
            align: "center"
          },
          {
            title: "日期",
            key: "DateTime",
            minWidth: 200,
            fixed: "left",
            sortable: true,
            align: "center"
          }
        );

        let com = this.queryData.component;
        let c = [];

        list.forEach((item, index) => {
          c = [
            {
              title: "测量结果",
              align: "center",
              sortable: true,
              key: `${com}-Check`,
              render: (h, params) => {
                let text = params.row[`${com}-Check`];
                if (
                  params.row[`${com}-Check`] === undefined ||
                  params.row[`${com}-Check`] === "0.00" ||
                  params.row[`${com}-Check`] === "0" ||
                  params.row[`${com}-Check`] === 0
                ) {
                  text = "--";
                }
                return h("span", text);
              }
            },
            {
              title: "量程核查",
              align: "center",
              children: [
                {
                  title: "标样浓度",
                  align: "center",
                  key: `${com}-st_val`,
                  render: (h, params) => {
                    let text = params.row[`${com}-st_val`];
                    if (
                      params.row[`${com}-st_val`] === undefined ||
                      params.row[`${com}-st_val`] === "0.00" ||
                      params.row[`${com}-st_val`] === "0" ||
                      params.row[`${com}-st_val`] === 0
                    ) {
                      text = "--";
                    }
                    return h("span", text);
                  }
                },
                {
                  title: "相对误差",
                  align: "center",
                  sortable: true,
                  key: `${com}-st_error_val`,
                  render: (h, params) => {
                    let text = params.row[`${com}-st_error_val`];
                    if (
                      params.row[`${com}-st_error_val`] === undefined ||
                      params.row[`${com}-st_error_val`] === "0.00" ||
                      params.row[`${com}-st_error_val`] === "0" ||
                      params.row[`${com}-st_error_val`] === 0
                    ) {
                      text = "--";
                    }
                    return h("span", text);
                  }
                },
                {
                  title: "合格情况",
                  align: "center",
                  sortable: true,
                  render: (h, params) => {
                    let text = "不合格";
                    if (com == "w01019") {
                      if (
                        params.row[com + "-st_error_val"] < 1 &&
                        params.row[com + "-st_error_val"] > -1
                      ) {
                        text = "合格";
                      }
                    }
                    if (com == "w21003") {
                      if (
                        params.row[com + "-st_error_val"] < 0.2 &&
                        params.row[com + "-st_error_val"] > -0.2
                      ) {
                        text = "合格";
                      }
                    }
                    if (com == "w21001") {
                      if (
                        params.row[com + "-st_error_val"] < 0.02 &&
                        params.row[com + "-st_error_val"] > -0.02
                      ) {
                        text = "合格";
                      }
                    }
                    if (com == "w21011") {
                      if (
                        params.row[com + "-st_error_val"] < 0.3 &&
                        params.row[com + "-st_error_val"] > -0.3
                      ) {
                        text = "合格";
                      }
                    }

                    return h("span", text);
                  }
                }
              ]
            },
            {
              title: "24小时量程漂移",
              align: "center",
              children: [
                {
                  title: "前一日结果",
                  align: "center",
                  sortable: true,
                  key: `${com}-before_val`,
                  render: (h, params) => {
                    let text = params.row[`${com}-before_val`];
                    if (
                      params.row[`${com}-before_val`] === undefined ||
                      params.row[`${com}-before_val`] === "0.00" ||
                      params.row[`${com}-before_val`] === "0" ||
                      params.row[`${com}-before_val`] === 0
                    ) {
                      text = "--";
                    }
                    return h("span", text);
                  }
                },
                {
                  title: "量程值",
                  align: "center",
                  sortable: true,
                  key: `${com}-range_val`,
                  render: (h, params) => {
                    let text = params.row[`${com}-range_val`];
                    if (
                      params.row[`${com}-range_val`] === undefined ||
                      params.row[`${com}-range_val`] === "0.00" ||
                      params.row[`${com}-range_val`] === "0" ||
                      params.row[`${com}-range_val`] === 0
                    ) {
                      text = "--";
                    }
                    return h("span", text);
                  }
                },
                {
                  title: "相对误差",
                  align: "center",
                  sortable: true,
                  key: `${com}-range_error_val`,
                  render: (h, params) => {
                    let text = params.row[`${com}-range_error_val`];
                    if (
                      params.row[`${com}-range_error_val`] === undefined ||
                      params.row[`${com}-range_error_val`] === "0.00" ||
                      params.row[`${com}-range_error_val`] === "0" ||
                      params.row[`${com}-range_error_val`] === 0
                    ) {
                      text = "--";
                    }
                    return h("span", text);
                  }
                },
                {
                  title: "合格情况",
                  align: "center",
                  sortable: true,
                  render: (h, params) => {
                    let text = "不合格";
                    if (
                      params.row[com + "-range_error_val"] < 10 &&
                      params.row[com + "-range_error_val"] > -10
                    ) {
                      text = "合格";
                    }
                    return h("span", text);
                  }
                }
              ]
            }
          ];
        });

        this.columnsList = this.columnsList.concat(c);

        let body = list.map((item, index) => {
          item.currentIndex = ++index;
          return item;
        });

        this.dataList = list;
      }
    },
    btnQueryData() {
      this.getMeterCheckList();
    },
    getMeterCheckList() {
      this.loading = true;
      let d = this.queryData;
      let data = {
        mn: d.mn,
        cn: d.type,
        start_time: d.start_time,
        end_time: d.end_time,
        component: d.component,
        page_index: d.page_index,
        page_size: d.page_size
      };

      this.$api.monitor2
        .getInstruemntCheckData(data)
        .then(res => {
          if (res.data.code === 0) {
            this.meterData = [];
            this.meterData = res.data.data.data_info;

            this.setTable();
          }

          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    changeDatePicker(value) {
      this.formatStartDate = `${value[0]} - ${value[1]}`;
      let s = this.$moment(value[0]).unix(),
        e = this.$moment(value[1]).unix();
      this.queryData.start_time = s;
      this.queryData.end_time = e;
    },
    selectComponent(value) {
      this.queryData.component = value;
    },
    selectDataType(value) {
      this.queryData.type = value;
    },
    getDeviceComponent() {
      this.loading = true;
      let data = {
        device_id: this.deviceId,
        page_index: 1,
        page_size: 50
      };

      this.$api.monitor1
        .getComponentData(data)
        .then(res => {
          if (res.data.code === 0) {
            this.componentData = [];
            let list = res.data.data.data_info;
            this.componentData = list;

            this.queryData.component = list[0].key;

            for (let i = 0; i < this.componentData.length; i++) {
              this.componentData[i].label = this.componentData[i].name;
              this.componentData[i].value = this.componentData[i].key;
            }
          }
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    }
  }
};
</script>

<style lang="less" scoped>
.qualityControlDataQuery-box {
  .single-page-container;

  .qualityControlDataQuery-header {
    .header;

    .header-left {
      float: left;
    }
    .header-right {
      float: right;
    }
  }

  .qualityControlDataQuery-body {
    .body;

    .page {
      padding: 20px;
      text-align: center;
    }
  }
}
</style>