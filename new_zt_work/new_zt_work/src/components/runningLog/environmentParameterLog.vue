<!-- 环境参数日志 -->
 
<template>
  <div class="environmentParameterLog-box">
    <div class="environmentParameterLog-header">
      <div class="header-left">
        <SelectDevice @changeMn="selectDeviceMn" @initMn="initMn"></SelectDevice>
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
    <div class="environmentParameterLog-body">
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
export default {
  name: "environmentParameterLog",
  data() {
    return {
      queryData: {
        mn: null,
        page_index: 1,
        page_size: 10,
        start_time: null,
        end_time: null,
        count: 0
      },
      deviceData: [],
      formatStartDate: null,
      loading: false,
      columnsList: [],
      dataList: [],
      plcData: []
    };
  },
  mounted() {
    this.initData();
  },
  beforeDestroy() {
    this.queryData = {
      mn: null,
      page_index: 1,
      page_size: 10,
      start_time: null,
      end_time: null,
      count: 0
    };
    this.deviceData = [];
    this.formatStartDate = null;
    this.loading = false;
    this.columnsList = [];
    this.dataList = [];
    this.plcData = [];
  },
  methods: {
    changeStartDate(v) {
      this.queryData.start_time = this.$moment(v).unix();
    },
    changeEndDate(v) {
      this.queryData.end_time = this.$moment(v).unix();
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
        page_index: 1,
        page_size: 10,
        start_time: this.$moment(s).unix(),
        end_time: this.$moment(e).unix()
      };
    },
    initMn(value) {
      this.queryData.mn = value.mn;
      this.getPLCMeterInfo();
    },
    selectDeviceMn(value) {
      this.queryData.mn = value.mn;
    },
    setTable() {
      let list = this.plcData;
      this.dataList = [];
      this.columnsList = [];

      if (list.length === 0) {
        this.columnsList = [];
        this.dataList = [];
      } else {
        this.columnsList = [
          {
            title: "序号",
            key: "currentIndex",
            minWidth: 80,
            sortable: true,
            fixed: "left",
            align: "center"
          },
          {
            align: "center",
            minWidth: 200,
            sortable: true,
            fixed: "left",
            title: "时间",
            key: "DateTime"
          },
          {
            align: "center",
            minWidth: 80,
            title: "CN",
            key: "CN"
          },
          {
            align: "center",
            minWidth: 200,
            title: "MN",
            key: "MN"
          },
          {
            align: "center",
            minWidth: 200,
            title: "QN",
            key: "QN"
          },
          {
            align: "center",
            title: "经度",
            sortable: true,
            minWidth: 100,
            key: "Lng",
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
          },
          {
            align: "center",
            title: "东西经(E、W)",
            minWidth: 120,
            sortable: true,
            key: "lng_hem",
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
          },
          {
            align: "center",
            title: "维度",
            minWidth: 100,
            sortable: true,
            key: "Lat",
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
          },
          {
            align: "center",
            title: "南北纬(S、N)",
            minWidth: 120,
            sortable: true,
            key: "Lat_hem",
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
          },
          {
            align: "center",
            title: "电压",
            minWidth: 100,
            sortable: true,
            key: "Volt",
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
          },
          {
            align: "center",
            title: "温度",
            minWidth: 100,
            sortable: true,
            key: "Temp",
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
          },
          {
            align: "center",
            title: "湿度",
            sortable: true,
            minWidth: 100,
            key: "Hum",
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
          }
        ];

        let data = list.map((item, index) => {
          item.currentIndex = ++index;
          return item;
        });

        this.dataList = data;
      }
    },
    getPLCMeterInfo() {
      this.loading = true;
      let d = this.queryData;
      let data = {
        mn: d.mn,
        start_time: d.start_time,
        end_time: d.end_time,
        page_index: d.page_index,
        page_size: d.page_size
      };

      this.$api.monitor2
        .getPLCContextData(data)
        .then(res => {
          if (res.data.code === 0) {
            this.plcData = [];
            this.plcData = res.data.data.data_info;
            this.queryData.count = res.data.data.page_count;

            this.setTable();
          }

          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    btnQueryData() {
      this.getPLCMeterInfo();
    },
    handleSizeChange(val) {
      this.queryData.page_index = 1;
      this.queryData.page_size = val;
      this.getPLCMeterInfo();
    },
    handleIndexChange(val) {
      this.queryData.page_index = val;
      this.getPLCMeterInfo();
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
          `环境参数日志${t}.xlsx`
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
    },
    changeDatePicker(value) {
      this.formatStartDate = `${value[0]} - ${value[1]}`;
      let s = this.$moment(value[0]).unix(),
        e = this.$moment(value[1]).unix();
      this.queryData.start_time = s;
      this.queryData.end_time = e;
    },
    getDeviceData() {
      this.loading = true;
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

              let f = `${this.$moment().format("YYYY-MM-DD hh:mm:ss")} - ${this.$moment()
                .subtract(30, "d")
                .format("YYYY-MM-DD hh:mm:ss")}`;

              this.formatStartDate = f;
              this.queryData = {
                mn: list[0].mn,
                page_index: 1,
                page_size: 10,
                start_time: this.$moment()
                  .subtract(30, "d")
                  .unix(),
                end_time: this.$moment().unix()
              };

              for (let i = 0; i < this.deviceData.length; i++) {
                this.deviceData[i].label = this.deviceData[i].name;
                this.deviceData[i].value = this.deviceData[i].mn;
              }

              this.getPLCMeterInfo();
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
.environmentParameterLog-box {
  .single-page-container;

  .environmentParameterLog-header {
    .header;

    .header-left {
      float: left;
    }

    .header-right {
      float: right;
    }
  }

  .environmentParameterLog-body {
    .body;

    .page {
      padding: 20px 0;
      text-align: center;
    }
  }
}
</style>