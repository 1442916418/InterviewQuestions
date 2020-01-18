<!-- 系统过程日志 -->

<template>
  <div class="systemProcessLog-box">
    <div class="systemProcessLog-header">
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
    <div class="systemProcessLog-body">
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
import mc from "@/plugin/staticData/meterCode.json";
import plc from "@/plugin/staticData/PLC.json";

export default {
  name: "systemProcessLog",
  data() {
    return {
      queryData: {
        mn: null,
        type: 4,
        page_index: 1,
        page_size: 10,
        start_time: null,
        end_time: null,
        count: 0
      },
      formatStartDate: null,
      deviceData: [],
      meterData: [],
      columnsList: [],
      dataList: [],
      loading: false,
      comData: []
    };
  },
  mounted() {
    this.initData();
    this.getComponent();
  },
  beforeDestroy() {
    this.queryData = {
      mn: null,
      type: 4,
      page_index: 1,
      page_size: 10,
      start_time: null,
      end_time: null,
      count: 0
    };
    this.formatStartDate = null;
    this.deviceData = [];
    this.meterData = [];
    this.columnsList = [];
    this.dataList = [];
    this.loading = false;
    this.comData = [];
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
      this.getPLCLog();
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
        type: 4,
        page_index: 1,
        page_size: 10,
        start_time: this.$moment(s).unix(),
        end_time: this.$moment(e).unix()
      };
    },
    selectDeviceMn(value) {
      this.queryData.mn = value.mn;
    },
    setTable() {
      let d = this.meterData;
      this.columnsList = [];
      this.dataList = [];

      if (d.length === 0) {
        this.columnsList = [];
        this.dataList = [];
      } else {
        for (let i = 0; i < d.length; i++) {
          let item = d[i];
          for (let k in item) {
            if (k === "Log-Key") {
              let lo = null;
              lo = this.setMeterName(item[k]);
              item.Log_Key_name = lo;
            }

            if (k.charAt(0) === "w") {
              let c = this.setComponent(k);
              item.component = c;

              for (let z in item[k]) {
                let r = this.setPLCState(item[k][z]);
                item.componentState = r;
              }
            }
          }
        }

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
            minWidth: 80,
            title: "CN",
            key: "CN"
          },
          {
            align: "center",
            minWidth: 200,
            title: "时间",
            sortable: true,
            fixed: "left",
            key: "DateTime"
          },
          {
            align: "center",
            title: "仪表编码",
            key: "Log-Key",
            minWidth: 100
          },
          {
            align: "center",
            title: "仪表名称",
            minWidth: 100,
            key: "Log_Key_name"
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
            title: "组分",
            minWidth: 100,
            key: "component"
          },
          {
            align: "center",
            title: "组分状态",
            sortable: true,
            minWidth: 150,
            key: "componentState"
          }
        ];

        let data = d.map((item, index) => {
          item.currentIndex = ++index;
          return item;
        });

        this.dataList = data;
      }
    },
    setPLCState(r) {
      for (let i = 0; i < plc.length; i++) {
        if (Number(r) === plc[i].code) {
          return plc[i].name;
        }
      }
    },
    setComponent(c) {
      let list = this.comData;
      for (let i = 0; i < list.length; i++) {
        if (c === list[i].key) {
          return list[i].name;
        }
      }
    },
    setMeterName(v) {
      for (let i = 0; i < mc.length; i++) {
        if (v === mc[i].code) {
          return mc[i].code_name;
        }
      }
    },
    handleSizeChange(val) {
      this.queryData.page_index = 1;
      this.queryData.page_size = val;
      this.getPLCLog();
    },
    handleIndexChange(val) {
      this.queryData.page_index = val;
      this.getPLCLog();
    },
    getPLCLog() {
      this.loading = true;
      let d = this.queryData;
      let data = {
        mn: d.mn,
        type: d.type,
        start_time: d.start_time,
        end_time: d.end_time,
        page_index: d.page_index,
        page_size: d.page_size
      };

      this.$api.monitor2
        .getPLCLog(data)
        .then(res => {
          if (res.data.code === 0) {
            this.meterData = [];
            this.meterData = res.data.data.data_info;
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
      this.getPLCLog();
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
          `系统过程日志${t}.xlsx`
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
    getComponent() {
      let data = {
        page_index: 1,
        page_size: 100
      };

      this.$api.monitor1
        .getComponentData(data)
        .then(res => {
          if (res.data.code === 0) {
            this.comData = [];
            this.comData = res.data.data.data_info;
          } else {
            this.loading = false;
          }
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
.systemProcessLog-box {
  .single-page-container;

  .systemProcessLog-header {
    .header;

    .header-left {
      float: left;
    }

    .header-right {
      float: right;
    }
  }

  .systemProcessLog-body {
    .body;

    .page {
      padding: 20px 0;
      text-align: center;
    }
  }
}
</style>