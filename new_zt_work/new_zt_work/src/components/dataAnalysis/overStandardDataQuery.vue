<!-- 超标数据查询 -->

<template>
  <div class="overStandardDataQuery-box">
    <div class="overStandardDataQuery-header">
      <div class="header-left">
        <SelectDevice @changeMn="selectDeviceId" @initMn="initMn"></SelectDevice>
        <Select
          @on-change="selectDataType"
          style="width:200px;margin-right:10px;"
          :placeholder="$t('tip.pleaseSelectADataType')"
          filterable
          :value="queryData.type"
        >
          <Option
            v-for="item in dataTypeData"
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
    <div class="overStandardDataQuery-body">
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
  name: "overStandardDataQuery",
  data() {
    return {
      formatStartDate: "",
      deviceData: [],
      queryData: {
        device_id: 0,
        type: 1,
        start_time: null,
        end_time: null,
        page_index: 1,
        page_size: 10,
        count: 0
      },
      warData: [],
      loading: false,
      dataList: [],
      dataTypeData: [
        {
          label: "因子超标",
          value: 1
        },
        {
          label: "电量不足",
          value: 2
        },
        {
          label: "设备偏移",
          value: 3
        },
        {
          label: "设备维护周期不足",
          value: 4
        },
        {
          label: "仪表故障",
          value: 5
        },
        {
          label: "设备离线",
          value: 6
        }
      ],
      columnsList: [
        {
          title: "序号",
          type: "index",
          minWidth: 80,
          fixed: "left",
          sortable: true,
          align: "center"
        },
        {
          align: "center",
          title: "创建时间",
          minWidth: 200,
          fixed: "left",
          sortable: true,
          key: "create_time"
        },
        {
          align: "center",
          title: "报警ID",
          minWidth: 100,
          key: "id"
        },
        {
          align: "center",
          title: "设备ID",
          minWidth: 100,
          key: "device_id"
        },
        {
          align: "center",
          title: "报警内容",
          minWidth: 100,
          key: "comment"
        },
        {
          align: "center",
          title: "报警类型",
          minWidth: 100,
          key: "type"
        },
        {
          align: "center",
          title: "状态",
          minWidth: 100,
          sortable: true,
          key: "status"
        },
        {
          align: "center",
          title: "报警备注",
          minWidth: 150,
          key: "remarks"
        }
      ]
    };
  },
  mounted() {
    this.initData();
  },
  beforeDestroy() {
    this.formatStartDate = "";
    this.deviceData = [];
    this.queryData = {
      device_id: 0,
      type: 1,
      start_time: null,
      end_time: null,
      page_index: 1,
      page_size: 10,
      count: 0
    };
    this.warData = [];
    this.loading = false;
    this.dataList = [];
  },
  methods: {
    changeStartDate(v) {
      this.queryData.start_time = v;
    },
    changeEndDate(v) {
      this.queryData.end_time = v;
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
        device_id: null,
        type: 1,
        start_time: this.$moment(s),
        end_time: this.$moment(e),
        page_index: 1,
        page_size: 10
      };
    },
    initMn(value) {
      this.queryData.device_id = value.id;
      this.getWarningData();
    },
    selectDeviceId(value) {
      this.queryData.device_id = value.id;
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

      // 从表生成工作簿对象
      let xlsxParam = {
        raw: true,
        sheetRows: Number(rows)
      };

      let tb = document.querySelector("#table").querySelector(".ivu-table");
      let wb = this.$XLSX.utils.table_to_book(tb, xlsxParam);
      let t = this.$moment().format("YYYY-MM-DD HH:mm:ss");

      // 得到二进制字符串作为输出
      let wbout = this.$XLSX.write(wb, {
        bookType: "xlsx",
        type: "binary",
        type: "array"
      });
      try {
        this.$FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream;charset=utf-8" }),
          `超标数据${t}.xlsx`
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
    },
    setTable() {
      let war = this.warData;
      this.dataList = [];

      if (war.length === 0) {
        this.dataList = [];
        this.columnsList = [];
        return;
      }

      this.columnsList = [
        {
          title: "序号",
          key: "currentIndex",
          minWidth: 80,
          fixed: "left",
          sortable: true,
          align: "center"
        },
        {
          align: "center",
          title: "创建时间",
          minWidth: 200,
          fixed: "left",
          sortable: true,
          key: "create_time"
        },
        {
          align: "center",
          title: "报警ID",
          minWidth: 100,
          key: "id"
        },
        {
          align: "center",
          title: "设备ID",
          minWidth: 100,
          key: "device_id"
        },
        {
          align: "center",
          title: "报警内容",
          minWidth: 100,
          key: "comment"
        },
        {
          align: "center",
          title: "报警类型",
          minWidth: 100,
          key: "type"
        },
        {
          align: "center",
          title: "状态",
          sortable: true,
          minWidth: 100,
          key: "status"
        },
        {
          align: "center",
          title: "报警备注",
          minWidth: 150,
          key: "remarks"
        }
      ];

      for (let item of war) {
        for (let d in item) {
          if (d === "type") {
            let t = this.setType(item[d]);

            this.$set(item, d, t);
          }

          if (d === "status") {
            let s = null;
            if (item[d] === 0) {
              s = "已处理";
            } else {
              s = "未处理";
            }

            this.$set(item, d, s);
          }
        }
      }

      let data = war.map((item, index) => {
        item.currentIndex = ++index;
        return item;
      });

      this.dataList = data;
    },
    setType(k) {
      switch (k) {
        case "1":
          return "因子超标";
          break;
        case "2":
          return "电量不足";
          break;
        case "3":
          return "设备偏移";
          break;
        case "4":
          return "设备维护周期不足";
          break;
        case "5":
          return "仪表故障";
          break;
        case "6":
          return "设备离线";
          break;
      }
    },
    handleSizeChange(val) {
      this.queryData.page_index = 1;
      this.queryData.page_size = val;
      this.getWarningData();
    },
    handleIndexChange(val) {
      this.queryData.page_index = val;
      this.getWarningData();
    },
    btnQueryData() {
      this.getWarningData();
    },
    getWarningData() {
      this.loading = true;
      let d = this.queryData;
      let data = {
        device_id: d.device_id,
        type: d.type,
        start_time: d.start_time,
        end_time: d.end_time,
        page_index: d.page_index,
        page_size: d.page_size
      };

      this.$api.monitor1
        .getWarningLogData(data)
        .then(res => {
          if (res.data.code === 0) {
            this.warData = [];
            this.warData = res.data.data.data_info;
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
    // 选择时间
    changeDatePicker(value) {
      this.queryData.start_time = value[0];
      this.queryData.end_time = value[1];
    },
    // 选择类型
    selectDataType(value) {
      this.queryData.type = value;
    }
  }
};
</script>

<style lang="less" scoped>
.overStandardDataQuery-box {
  .single-page-container;

  .overStandardDataQuery-header {
    .header;

    .header-left {
      float: left;
    }

    .header-right {
      float: right;
    }
  }

  .overStandardDataQuery-body {
    .body;

    .page {
      padding: 20px;
      text-align: center;
    }
  }
}
</style>