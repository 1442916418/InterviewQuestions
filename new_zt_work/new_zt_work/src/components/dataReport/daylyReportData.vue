<!-- 日报数据 -->

<template>
  <div class="daylyReportData-box">
    <div class="daylyReportData-header">
      <div class="header-left">
        <SelectDevice @changeMn="selectDeviceMn" @initMn="initMn"></SelectDevice>
        <Select
          @on-change="selectDataType"
          style="width:120px;margin-right:10px;"
          :placeholder="$t('tip.pleaseSelectDataType')"
          filterable
          :value="queryData.cn"
        >
          <Option
            v-for="(item,index) in productData"
            :value="item.cn"
            :label="item.data_name"
            :key="index"
          ></Option>
        </Select>
        <DatePicker
          :placeholder="$t('tip.pleaseSelectStartTime')"
          format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          style="width: 200px"
          :value="startTime"
          @on-change="startDate"
        ></DatePicker>
      </div>
      <div class="header-right">
        <Button style="margin-right: 10px;" @click="exportData">{{$t('btn.exprot')}}</Button>
        <Button type="primary" @click="clickQueryData">{{$t('btn.query')}}</Button>
      </div>
    </div>
    <div class="daylyReportData-body">
      <DefaultTable
        :isPage="false"
        :isSelection="false"
        :columnsList="columnsList"
        :dataList="dataList"
        :loading="loading"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "daylyReportData",
  data() {
    return {
      loading: false,
      columnsList: [],
      dataList: [],
      queryData: {
        mn: null,
        start_time: 0,
        end_time: 0,
        water_type: 1,
        cn: null,
        product_id: null,
        id: 0
      },
      componentData: [],
      monthData: [],
      comData: [],
      productData: [],
      startTime: null
    };
  },
  mounted() {
    this.initData();
    this.getComponentData();
  },
  beforeDestroy() {
    this.loading = false;
    this.columnsList = [];
    this.dataList = [];
    this.queryData = {
      mn: "",
      start_time: 0,
      end_time: 0,
      water_type: 1,
      cn: "",
      product_id: "",
      id: 0
    };
    this.componentData = [];
    this.monthData = [];
    this.comData = [];
    this.productData = [];
    this.startTime = null;
  },
  methods: {
    startDate(value) {
      this.startTime = value;
      this.queryData.start_time = this.$moment(value).unix();
      let e = this.$moment(value).unix() - 86400;
      this.queryData.end_time = e;
    },
    clickQueryData() {
      let d = this.queryData;
      if (!this.$RegExp.verifyIsNull(d.mn)) {
        this.$Message.warning(this.$t("tip.pleaseSelectSite"));
        this.queryData.mn = null;
        return;
      } else if (!this.$RegExp.verifyIs0(d.start_time)) {
        this.$Message.warning(this.$t("tip.pleaseSelectStartTime"));
        this.queryData.start_time = 0;
        return;
      } else if (!this.$RegExp.verifyIs0(d.end_time)) {
        this.$Message.warning(this.$t("tip.pleaseSelectEndTime"));
        this.queryData.end_time = 0;
        return;
      } else if (!this.$RegExp.verifyIsNull(d.cn)) {
        this.$Message.warning(this.$t("tip.pleaseSelectDataType"));
        this.queryData.cn = null;
        return;
      } else {
        this.getDeviceComponent();
      }
    },
    initData() {
      let start_time = this.$moment()
          .subtract(1, "d")
          .format("YYYY-MM-DD HH:MM:SS"),
        end_time = this.$moment().format("YYYY-MM-DD HH:MM:SS");

      this.startTime = start_time;

      this.queryData.start_time = this.$moment(start_time).unix();
      this.queryData.end_time = this.$moment(end_time).unix();
    },
    selectDeviceMn(v) {
      this.queryData.mn = v.mn;
      this.queryData.product_id = v.product_id;
      this.queryData.id = v.id;
      this.getProductAndDataType();
    },
    initMn(v) {
      this.queryData.mn = v.mn;
      this.queryData.product_id = v.product_id;
      this.queryData.id = v.id;

      this.getProductAndDataType();
    },
    getProductAndDataType() {
      let d = {
        product_id: this.queryData.product_id,
        type: 1
      };

      this.$api.monitor1
        .getDataType(d)
        .then(res => {
          if (res.data.code === 0) {
            this.productData = [];
            let list = res.data.data;

            if (list.length === 0) {
              this.queryData.cn = "";
              this.productData = [];

              this.$Message.warning(this.$t("tip.noDataType"));
            } else {
              this.productData = list;

              this.queryData.cn = list[0].cn;

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
          `日报数据${t}.xlsx`
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
    },
    setCompany(com) {
      let list = this.comData;
      for (let i = 0; i < list.length; i++) {
        if (com === list[i].key) {
          return list[i].unit;
        }
      }
    },
    getComponentData() {
      let data = {
        page_index: 1,
        page_size: 50
      };

      this.$api.monitor1
        .getComponentData(data)
        .then(res => {
          if (res.data.code === 0) {
            this.comData = [];
            this.comData = res.data.data.data_info;
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    setNumber(data) {
      let n = Number(data);
      switch (n) {
        case 0:
          return null;
        case 1:
          return "I";
          break;
        case 2:
          return "II";
          break;
        case 3:
          return "III";
          break;
        case 4:
          return "IV";
          break;
        case 5:
          return "V";
          break;
      }
    },
    setTableData() {
      let com = this.componentData,
        mon = this.monthData,
        type1 = [],
        type2 = [],
        type3 = [],
        type4 = [],
        type5 = [],
        type6 = [],
        len = com.length,
        time1 = [];
      this.columnsList = [];
      this.dataList = [];

      if (com.length > 0) {
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
            align: "center",
            title: "时间",
            key: "dataTime",
            sortable: true,
            fixed: "left",
            minWidth: 200
          }
        );

        for (let i = 0; i < com.length; i++) {
          let unit = this.setCompany(com[i].key);
          this.columnsList.push({
            align: "center",
            title: `${com[i].component_name}(${unit})`,
            key: com[i].key,
            minWidth: 120,
            sortable: true,
            render: (h, params) => {
              let text = params.row[com[i].key];
              if (
                params.row[com[i].key] === undefined ||
                params.row[com[i].key] === "0.00" ||
                params.row[com[i].key] === "0"
              ) {
                text = "--";
              }
              return h("span", text);
            }
          });
        }

        for (let j = 0; j < mon.length; j++) {
          switch (mon[j].data_type) {
            case 1:
              let t1 = mon[j].datas;
              time1.push(mon[j].DataTime);

              type1.push(t1);

              for (let k = 0; k < time1.length; k++) {
                type1[k].dataTime = time1[k];
              }

              break;
            case 2:
              let t2 = mon[j].datas;

              type2.push(t2);

              for (let k = 0; k < type2.length; k++) {
                type2[k].dataTime = "最小值";
              }
              break;
            case 3:
              let t3 = mon[j].datas;

              type3.push(t3);

              for (let k = 0; k < type3.length; k++) {
                type3[k].dataTime = "最大值";
              }
              break;
            case 4:
              let t4 = mon[j].datas;

              type4.push(t4);

              for (let k = 0; k < type4.length; k++) {
                type4[k].dataTime = "平均值";
              }
              break;
            case 5:
              let t5 = mon[j].datas;

              let c5 = JSON.parse(JSON.stringify(t5));

              for (let z in c5) {
                c5[z] = this.setNumber(c5[z]);
              }

              type5.push(c5);

              for (let k = 0; k < type5.length; k++) {
                type5[k].dataTime = "水质类别";
              }
              break;
            case 6:
              let t6 = this.setNumber(mon[j].datas);
              let z = {};

              for (let k in type5[0]) {
                z[k] = t6;
              }
              z.dataTime = "总体水质类别";

              type6.push(z);
              break;
          }
        }

        let tabelData = type1.concat(type2, type3, type4, type5, type6);

        let data = tabelData.map((item, index) => {
          item.currentIndex = ++index;
          return item;
        });

        this.dataList = data;
      }
    },
    getDeviceComponent() {
      this.loading = true;
      let data = {
        device_id: this.queryData.id,
        page_index: 1,
        page_size: 50
      };

      this.$api.monitor1
        .getDeviceComponentData(data)
        .then(res => {
          if (res.data.code === 0) {
            this.componentData = [];

            this.componentData = res.data.data.data_info;

            this.getDaylyData();
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    getDaylyData() {
      let d = this.queryData;

      if (d.cn === "2061") {
        let data = {
          mn: d.mn,
          start_time: d.start_time,
          end_time: d.end_time,
          water_type: d.water_type,
          cn: d.cn
        };

        this.$api.monitor1
          .getDayFormsData(data)
          .then(res => {
            if (res.data.code === 0) {
              this.monthData = [];
              this.monthData = res.data.data;

              this.setTableData();

              this.loading = false;
            } else {
              this.monthData = [];
              this.dataList = [];
              this.columnsList = [];
              this.loading = false;
            }
          })
          .catch(error => {
            this.loading = false;
            this.$Message.error(this.$t("tip.requestError"));
          });
      } else {
        this.$Message.warning(this.$t("tip.pleaseSelectHourData"));
        this.monthData = [];
        this.dataList = [];
        this.columnsList = [];
        this.loading = false;
      }
    },
    selectDataType(value) {
      this.queryData.cn = value;
    }
  }
};
</script>

<style lang="less" scoped>
.daylyReportData-box {
  .single-page-container;

  .daylyReportData-header {
    .header;

    .header-left {
      float: left;
    }

    .header-right {
      float: right;
    }
  }

  .daylyReportData-body {
    .body;
  }
}
</style>