<!-- 报警查询 -->

<template>
  <div class="alarmInquiry-box">
    <div class="alarmInquiry-header">
      <div class="header-left">
        <SelectDevice @changeMn="selectDeviceMn" @initMn="initMn"></SelectDevice>

        <Select
          @on-change="selectDeviceType"
          style="width:200px;margin-right:10px;"
          :placeholder="$t('tip.pleaseSelectType')"
          filterable
          :value="queryData.type"
        >
          <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
    <div class="alarmInquiry-body">
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
  name: "alarmInquiry",
  data() {
    return {
      queryData: {
        id: null,
        type: 1,
        page_index: 1,
        page_size: 50,
        start_time: null,
        end_time: null,
        count: 0
      },
      deviceData: [],
      formatStartDate: null,
      loading: false,
      columnsList: [],
      dataList: [],
      warningData: [],
      typeList: [
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
      ]
    };
  },
  mounted() {
    this.initData();
  },
  beforeDestroy() {
    this.queryData = {
      id: null,
      type: 1,
      page_index: 1,
      page_size: 50,
      start_time: null,
      end_time: null,
      count: 0
    };
    this.deviceData = [];
    this.formatStartDate = null;
    this.loading = false;
    this.columnsList = [];
    this.dataList = [];
    this.warningData = [];
  },
  methods: {
    changeStartDate(v) {
      this.queryData.start_time = v;
    },
    changeEndDate(v) {
      this.queryData.end_time = v;
    },
    initMn(v) {
      this.queryData.id = v.id;
      this.getWarningData();
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
        id: null,
        type: 1,
        page_index: 1,
        page_size: 50,
        start_time: s,
        end_time: e
      };
    },
    selectDeviceMn(v) {
      this.queryData.mn = v.mn;
      this.queryData.id = v.id;
    },
    setTable() {
      let list = this.warningData;
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
            fixed: "left",
            align: "center"
          },
          {
            align: "center",
            title: "时间",
            fixed: "left",
            minWidth: 200,
            sortable: true,
            key: "create_time"
          },
          {
            align: "center",
            title: "报警ID",
            key: "id",
            minWidth: 100
          },
          {
            align: "center",
            title: "设备ID",
            key: "device_id",
            minWidth: 100
          },
          {
            align: "center",
            title: "报警内容",
            key: "comment",
            minWidth: 120
          },
          {
            align: "center",
            title: "报警类型",
            key: "type",
            minWidth: 120,
            render: (h, params) => {
              let t = params.row.type;
              t = Number(t);
              switch (t) {
                case 1:
                  return h("span", "因子超标");
                  break;
                case 2:
                  return h("span", "电量不足");
                  break;
                case 3:
                  return h("span", "设备偏移");
                  break;
                case 4:
                  return h("span", "设备维护周期不足");
                  break;
                case 5:
                  return h("span", "仪表故障");
                  break;
                case 6:
                  return h("span", "设备离线");
                  break;
              }
            }
          },
          {
            align: "center",
            title: "报警备注",
            key: "remarks",
            minWidth: 120
          },
          {
            align: "center",
            title: "状态",
            key: "status",
            sortable: true,
            minWidth: 120,
            render: (h, params) => {
              let d = params.row.status;
              d = Number(d);
              if (d === 0) {
                return h("span", "已处理");
              } else if (d === 1) {
                return h("span", "未处理");
              }
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
    getWarningData() {
      this.loading = true;
      let d = this.queryData;
      let data = {
        device_id: d.id,
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
            this.warningData = [];
            this.warningData = res.data.data.data_info;
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
    changeDatePicker(value) {
      this.formatStartDate = `${value[0]} - ${value[1]}`;
      let s = this.$moment(value[0]),
        e = this.$moment(value[1]);
      this.queryData.start_time = s;
      this.queryData.end_time = e;
    },
    handleSizeChange(size) {
      this.queryData.page_index = 1;
      this.queryData.page_size = size;
      this.getWarningData();
    },
    handleIndexChange(index) {
      this.queryData.page_index = index;
      this.getWarningData();
    },
    btnQueryData() {
      this.getWarningData();
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
          `报警查询数据${t}.xlsx`
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
    },
    selectDeviceType(value) {
      this.queryData.type = value;
    },
    selectDeviceId(value) {
      this.queryData.id = value;
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
                id: list[0].id,
                type: 1,
                page_index: 1,
                page_size: 50,
                start_time: this.$moment().subtract(30, "d"),
                end_time: this.$moment()
              };

              for (let i = 0; i < this.deviceData.length; i++) {
                this.deviceData[i].label = this.deviceData[i].name;
                this.deviceData[i].value = this.deviceData[i].id;
              }

              this.getWarningData();
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
.alarmInquiry-box {
  .single-page-container;

  .alarmInquiry-header {
    .header;

    .header-left {
      float: left;
    }

    .header-right {
      float: right;
    }
  }

  .alarmInquiry-body {
    .body;

    .page {
      padding: 20px 0;
      text-align: center;
    }
  }
}
</style>