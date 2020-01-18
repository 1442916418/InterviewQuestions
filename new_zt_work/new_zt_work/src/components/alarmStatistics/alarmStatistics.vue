<!-- 报警统计 -->

<template>
  <div class="alarmStatistics-box">
    <div class="alarmStatistics-header">
      <div class="header-left">
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
    <div class="alarmStatistics-body">
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
  name: "alarmStatistics",
  data() {
    return {
      loading: false,
      dataList: [],
      columnsList: [],
      formatStartDate: null,
      queryData: {
        page_index: 1,
        page_size: 50,
        start_time: null,
        end_time: null,
        count: 0
      },
      waringData: []
    };
  },
  mounted() {
    this.setTime();
    this.getWarningList();
  },
  beforeDestroy() {
    this.dataList = [];
    this.columnsList = [];
    this.formatStartDate = null;
    this.queryData = {
      page_index: 1,
      page_size: 50,
      start_time: null,
      end_time: null,
      count: 0
    };
    this.waringData = [];
    this.tableHeight = 520;
  },
  methods: {
    changeStartDate(v) {
      this.queryData.start_time = v;
    },
    changeEndDate(v) {
      this.queryData.end_time = v;
    },
    setTable() {
      let list = this.waringData;
      this.dataList = [];
      this.columnsList = [];

      if (list.length === 0) {
        this.dataList = [];
        this.columnsList = [];
      } else {
        let col = [
          {
            title: "序号",
            key: "currentIndex",
            minWidth: 80,
            sortable: true,
            align: "center",
            fixed: "left"
          },
          {
            align: "center",
            title: "站点名称",
            minWidth: 200,
            sortable: true,
            key: "name",
            fixed: "left"
          },
          {
            align: "center",
            title: "因子超标",
            minWidth: 100,
            sortable: true,
            key: "over_warning",
            render: (h, params) => {
              let text = params.row["over_warning"];
              if (
                params.row["over_warning"] === undefined ||
                params.row["over_warning"] === "0.00" ||
                params.row["over_warning"] === "0" ||
                params.row["over_warning"] === 0
              ) {
                text = "--";
              }
              return h("span", text);
            }
          },
          {
            align: "center",
            title: "电量不足",
            minWidth: 100,
            sortable: true,
            key: "power_low",
            render: (h, params) => {
              let text = params.row["power_low"];
              if (
                params.row["power_low"] === undefined ||
                params.row["power_low"] === "0.00" ||
                params.row["power_low"] === "0" ||
                params.row["power_low"] === 0
              ) {
                text = "--";
              }
              return h("span", text);
            }
          },
          {
            align: "center",
            title: "设备偏移",
            minWidth: 100,
            sortable: true,
            key: "device_lost",
            render: (h, params) => {
              let text = params.row["device_lost"];
              if (
                params.row["device_lost"] === undefined ||
                params.row["device_lost"] === "0.00" ||
                params.row["device_lost"] === "0" ||
                params.row["device_lost"] === 0
              ) {
                text = "--";
              }
              return h("span", text);
            }
          },
          {
            align: "center",
            title: "设备维护周期不足",
            minWidth: 120,
            sortable: true,
            key: "over_time",
            render: (h, params) => {
              let text = params.row["over_time"];
              if (
                params.row["over_time"] === undefined ||
                params.row["over_time"] === "0.00" ||
                params.row["over_time"] === "0" ||
                params.row["over_time"] === 0
              ) {
                text = "--";
              }
              return h("span", text);
            }
          },
          {
            align: "center",
            title: "仪表故障",
            minWidth: 100,
            sortable: true,
            key: "meter_break",
            render: (h, params) => {
              let text = params.row["meter_break"];
              if (
                params.row["meter_break"] === undefined ||
                params.row["meter_break"] === "0.00" ||
                params.row["meter_break"] === "0" ||
                params.row["meter_break"] === 0
              ) {
                text = "--";
              }
              return h("span", text);
            }
          },
          {
            align: "center",
            title: "设备离线",
            minWidth: 100,
            sortable: true,
            key: "device_offline",
            render: (h, params) => {
              let text = params.row["device_offline"];
              if (
                params.row["device_offline"] === undefined ||
                params.row["device_offline"] === "0.00" ||
                params.row["device_offline"] === "0" ||
                params.row["device_offline"] === 0
              ) {
                text = "--";
              }
              return h("span", text);
            }
          }
        ];

        this.columnsList = this.columnsList.concat(col);

        let data = list.map((item, index) => {
          item.currentIndex = ++index;
          return item;
        });
        this.dataList = data;
      }
    },
    handleSizeChange(val) {
      this.queryData.page_index = 1;
      this.queryData.page_size = val;
      this.getWarningList();
    },
    handleIndexChange(val) {
      this.queryData.page_index = val;
      this.getWarningList();
    },
    getWarningList() {
      this.loading = true;
      let d = this.queryData;
      let data = {
        start_time: d.start_time,
        end_time: d.end_time,
        page_index: d.page_index,
        page_size: d.page_size
      };

      this.$api.monitor1
        .getWarningLogDatas(data)
        .then(res => {
          if (res.data.code === 0) {
            this.waringData = [];
            let list = res.data.data;
            this.waringData = list.data_info;
            this.queryData.count = list.page_count;
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
      this.getWarningList();
    },
    exportData() {
      if (this.dataList.length === 0) {
        this.$Message.warning(this.$t("tip.noExport"));
        return;
      }

      let currentIndex = this.dataList[this.dataList.length - 1].currentIndex;
      let rows = 0;
      rows = Number(currentIndex + 1);

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
          `报警统计数据${t}.xlsx`
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
    },
    setTime() {
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

      this.queryData.start_time = s;
      this.queryData.end_time = e;
    },
    changeDatePicker(value) {
      this.formatStartDate = `${value[0]} - ${value[1]}`;
      let s = this.$moment(value[0]),
        e = this.$moment(value[1]);
      this.queryData.start_time = s;
      this.queryData.end_time = e;
    }
  }
};
</script>

<style lang="less" scoped>
.alarmStatistics-box {
  .single-page-container;

  .alarmStatistics-header {
    .header;

    .header-left {
      float: left;
    }

    .header-right {
      float: right;
    }
  }

  .alarmStatistics-body {
    .body;

    .page {
      padding: 20px 0;
      text-align: center;
    }
  }
}
</style>