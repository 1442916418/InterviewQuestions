<!-- 历史数据查询 -->

<template>
  <div class="historcalDataQuery-box">
    <div class="historcalDataQuery-header">
      <div class="header-left">
        <SelectDevice @changeMn="selectDeviceMn" @initMn="initMn"></SelectDevice>

        <Select
          @on-change="selectDataType"
          style="width:120px;margin-right:10px;"
          :placeholder="$t('tip.pleaseSelectDataType')"
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
        <SelectTime @changeStartDate="changeStartDate" @changeEndDate="changeEndDate"></SelectTime>
      </div>
      <div class="header-right">
        <img
          class="change-echart"
          :src="changeImg"
          width="32"
          height="32"
          style="vertical-align: middle;"
          @click="changeBodyState"
        />
        <Button style="margin: 0 10px;" icon="md-download" @click="exportData">{{$t('btn.exprot')}}</Button>
        <Button type="primary" icon="md-search" @click="btnQueryData">{{$t('btn.query')}}</Button>
      </div>
    </div>
    <div class="historcalDataQuery-body">
      <div class="body-echarts" v-show="isShowECharts">
        <div
          id="line_echart"
          class="line-echart"
          ref="line_echart"
          :style="{width:'100%',height: bodyEChartsHeight }"
        ></div>
      </div>
      <div class="body-table" v-show="!isShowECharts">
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
  </div>
</template>

<script>
import tableImg from "../../../static/imgs/table.png";
import lineImg from "../../../static/imgs/line.png";
import echarts from "../../plugin/ECharts/echarts";
import defaultOptions from "../../plugin/ECharts/options/defaultOptions";

import Driver from "driver.js";
import "driver.js/dist/driver.min.css";
import steps from "../../plugin/guide/guide.js";

export default {
  name: "historcalDataQuery",
  data() {
    return {
      driver: null,
      isShowECharts: false,
      changeImg: lineImg,
      bodyEChartsHeight: 520,
      loading: false,
      columnsList: [],
      dataList: [],
      deviceData: [],
      deviceMn: "",
      formatStartDate: "",
      queryData: {
        mn: null,
        page_index: 1,
        page_size: 10,
        start_time: null,
        end_time: null,
        type: 0,
        count: 0
      },
      componentData: [],
      deviceId: 0,
      hisData: [],
      PRODUCT_ID: 0,
      productData: [],
      dataTypeData: [
        {
          label: "实时数据",
          value: 2
        },
        {
          label: "测量数据",
          value: 3
        },
        {
          label: "分钟数据",
          value: 4
        },
        {
          label: "日数据",
          value: 5
        }
      ]
    };
  },
  mounted() {
    this.changeImg = lineImg;
    this.initData();
    // this.driver = new Driver({
    //   animate: true,
    //   opacity: 0.75,
    //   doneBtnText: "完成",
    //   closeBtnText: "关闭",
    //   nextBtnText: "下一个",
    //   prevBtnText: "上一个"
    // });

    // this.driver.defineSteps(steps);
    // this.driver.start();
  },
  beforeDestroy() {
    this.changeImg = lineImg;
    this.loading = false;
    this.columnsList = [];
    this.dataList = [];
    this.deviceData = [];
    this.deviceMn = "";
    this.formatStartDate = "";
    this.queryData = {
      mn: null,
      page_index: 1,
      page_size: 10,
      start_time: null,
      end_time: null,
      type: 0,
      count: 0
    };
    this.componentData = [];
    this.deviceId = 0;
    this.hisData = [];
    this.PRODUCT_ID = 0;
    this.productData = [];
  },
  methods: {
    setEChartsStyleAndData() {
      let his = this.hisData,
        xDate = [],
        yData = [],
        legendData = [],
        h = his.header,
        b = his.body;

      // console.log(his, "<------------");

      if (b.length === 0 || his.length === 0) {
        this.$Message.warning(this.$t("statusCode.queryFailed"));
        return;
      }

      let bLen = his.body.length;

      for (let j = 0; j < h.length; j++) {
        for (let key in h[j]) {
          let v = h[j][key],
            val = v.charAt(0);
          if (val === "w") {
            legendData.push(this.setCompany(v)[1]);
            yData.push({
              name: this.setCompany(v)[1],
              data: [],
              type: "line",
              itemStyle: { normal: { label: { show: true } } },
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: "rgba(65,184,131,.3)"
                    },
                    {
                      offset: 1,
                      color: "rgba(65,184,131,.1)"
                    }
                  ])
                }
              }
            });
            for (let k = 0; k < b.length; k++) {
              for (let bk in b[k]) {
                if (v === bk) {
                  yData[j].data.push(b[k][bk]);
                  if (xDate.length !== bLen) {
                    xDate.push(b[k]["DateTime"]);
                  }
                }
              }
            }
          }
        }
      }

      // console.log(yData, "yData <---------------------");
      // console.log(xDate, "xDate <---------------------");
      // console.log(legendData, "legendData <---------------------");

      let lineChart = echarts.init(document.getElementById("line_echart"));

      lineChart.setOption(defaultOptions);

      lineChart.setOption({
        title: {
          text: "历史数据"
        },
        legend: {
          data: legendData
        },
        xAxis: {
          data: xDate
        },
        series: yData
      });
    },
    changeBodyState() {
      this.bodyEChartsHeight = window.innerHeight - 240 + "px";
      if (!this.isShowECharts) {
        this.isShowECharts = !this.isShowECharts;
        this.changeImg = tableImg;
        this.$nextTick(() => {
          this.setEChartsStyleAndData();
        });
      } else {
        this.isShowECharts = !this.isShowECharts;
        this.changeImg = lineImg;
      }
    },
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
        console.log(error, "<----------------->");
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
        page_index: 1,
        page_size: 10,
        type: 2,
        mn: null,
        start_time: this.$moment(s).unix(),
        end_time: this.$moment(e).unix()
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
        type: 1
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

              this.queryData.type = list[0].cn;

              this.getDeviceComponent();
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

      this.isShowECharts = false;
      this.changeImg = lineImg;

      let count = this.queryData.count;
      let pageSize = this.queryData.page_size;
      let currentIndex = this.dataList[this.dataList.length - 1].currentIndex;
      let rows = 0;
      if (count < pageSize) {
        rows = Number(count + 1);
      } else {
        if (currentIndex < pageSize) {
          rows = Number(currentIndex + 1);
        } else {
          rows = Number(pageSize + 1);
        }
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
          `历史数据${t}.xlsx`
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
    },
    handleSizeChange(val) {
      this.queryData.page_index = 1;
      this.queryData.page_size = val;
      this.getDeviceHistorcalData();
    },
    handleIndexChange(val) {
      this.queryData.page_index = val;
      this.getDeviceHistorcalData();
    },
    setCompany(com) {
      let list = this.componentData;
      for (let i = 0; i < list.length; i++) {
        if (com === list[i].key) {
          return [list[i].unit, list[i].name];
        }
      }
    },
    setTableData(item) {
      this.columnsList = [];
      this.dataList = [];
      let h = item.header,
        b = item.body;

      if (b.length === 0) {
        this.columnsList = [];
        this.dataList = [];
      } else {
        this.columnsList.push(
          {
            title: "序号",
            key: "currentIndex",
            minWidth: 80,
            align: "center",
            sortable: true,
            fixed: "left"
          },
          {
            align: "center",
            title: "时间",
            key: "DateTime",
            fixed: "left",
            sortable: true,
            minWidth: 200
          }
        );

        for (let i = 0; i < h.length; i++) {
          this.columnsList.push({
            align: "center",
            title: `${h[i].name}(${this.setCompany(h[i].key)[0]})`,
            key: `${h[i].key}`,
            minWidth: 130,
            sortable: true,
            render: (h, params) => {
              let text = params.row[params.column.key];
              if (
                params.row[params.column.key] === undefined ||
                params.row[params.column.key] === "0.00" ||
                params.row[params.column.key] === "0" ||
                params.row[params.column.key] === 0
              ) {
                text = "--";
              }
              return h("span", text);
            }
          });
        }

        let body = b.map((item, index) => {
          item.currentIndex = ++index;
          return item;
        });

        this.dataList = body;
      }
    },
    getDeviceHistorcalData() {
      this.loading = true;
      this.isShowECharts = false;
      this.changeImg = lineImg;
      let d = this.queryData,
        s = null,
        e = null;

      if (
        !this.$RegExp.verifyIsNull(d.start_time) ||
        !this.$RegExp.verifyIsNull(d.end_time) ||
        isNaN(d.start_time) ||
        isNaN(d.end_time)
      ) {
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

        s = this.$moment(s).unix();
        e = this.$moment(e).unix();
      } else {
        s = d.start_time;
        e = d.end_time;
      }

      let data = {
        mn: d.mn,
        page_index: d.page_index,
        page_size: d.page_size,
        start_time: s,
        end_time: e,
        cn: d.type
      };

      this.$api.monitor1
        .getHistoryData(data)
        .then(res => {
          if (res.data.code === 0) {
            this.hisData = [];
            this.hisData = res.data.data;

            this.queryData.count = res.data.data.page_count;

            this.setTableData(this.hisData);

            this.loading = false;
          }
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
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

            this.componentData = res.data.data.data_info;
            this.getDeviceHistorcalData();
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    btnQueryData() {
      this.getDeviceHistorcalData();
    },
    changeDatePicker(value) {
      this.formatStartDate = `${value[0]} - ${value[1]}`;
      let s = this.$moment(value[0]).unix(),
        e = this.$moment(value[1]).unix();
      this.queryData.start_time = s;
      this.queryData.end_time = e;
    },
    selectDataType(value) {
      this.queryData.type = value;
    }
  }
};
</script>

<style lang="less" scoped>
.historcalDataQuery-box {
  .single-page-container;

  .historcalDataQuery-header {
    .header;

    .header-left {
      float: left;
    }

    .header-right {
      float: right;
    }
  }

  .historcalDataQuery-body {
    .body;

    .body-echarts {
      width: 100%;
      position: relative;

      .line-echart {
        position: relative;
      }
    }

    .body-table {
      .page {
        padding: 20px 0;
        text-align: center;
      }
    }
  }
}
</style>