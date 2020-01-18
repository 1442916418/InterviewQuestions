<!-- 月报数据 -->

<template>
  <div class="monthlyReport-box">
    <div class="monthlyReport-header">
      <div class="header-left">
        <SelectDevice :mn="deviceMn" @changeMn="selectDeviceMn" @initMn="initMn"></SelectDevice>
        <Select
          @on-change="selectDataType"
          style="width:120px;margin-right:10px;"
          :placeholder="$t('tip.pleaseSelectDataType')"
          filterable
          :value="dataTypeId"
        >
          <Option
            v-for="(item,index) in productData"
            :value="item.cn"
            :label="item.data_name"
            :key="index"
          ></Option>
        </Select>
        <DatePicker
          split-panels
          :value="formatStartDate"
          @on-change="changeDatePicker"
          type="month"
          :placeholder="$t('tip.pleaseSelectStartMonth')"
          format="yyyy-MM"
          style="width: 200px"
        ></DatePicker>
      </div>
      <div class="header-right">
        <Button style="margin-right: 10px;" @click="exportData">{{$t('btn.exprot')}}</Button>
        <Button type="primary" @click="queryData">{{$t('btn.query')}}</Button>
      </div>
    </div>
    <div class="monthlyReport-body">
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
  name: "monthlyReport",
  data() {
    return {
      loading: false,
      columnsList: [],
      dataList: [],
      deviceData: [],
      deviceMn: null,
      waterId: 1,
      dataTypeData: [],
      dataTypeId: "",
      datePickerValue: "",
      startDate: null,
      formatStartDate: null,
      endDate: null,
      MN: null,
      STARTDATE: 0,
      ENDDATE: 0,
      WATERTYPE: 0,
      TYPE: 0,
      DEVICEID: null,
      componentData: [],
      monthData: [],
      comData: [],
      PRODUCT_ID: 0,
      productData: [],
      waterTypeData: [
        {
          label: "地表水",
          value: 1
        },
        {
          label: "湖库",
          value: 2
        }
      ]
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
    this.deviceData = [];
    this.deviceMn = null;
    this.waterId = 1;
    this.dataTypeData = [];
    this.dataTypeId = "";
    this.datePickerValue = "";
    this.startDate = null;
    this.formatStartDate = null;
    this.endDate = null;
    this.MN = null;
    this.STARTDATE = 0;
    this.ENDDATE = 0;
    this.WATERTYPE = 0;
    this.TYPE = 0;
    this.DEVICEID = null;
    this.componentData = [];
    this.monthData = [];
    this.comData = [];
    this.PRODUCT_ID = 0;
    this.productData = [];
  },
  methods: {
    initData() {
      let m = new Date().getMonth() + 1;
      let s = this.setUnix(m)[0],
        e = this.$moment(new Date()).unix(),
        w = 1;

      this.STARTDATE = Number(s);
      this.ENDDATE = Number(e + 86400);
      this.WATERTYPE = w;

      this.formatStartDate = this.$moment(new Date()).format("YYYY MM");
      this.waterId = w;
    },
    selectDeviceMn(v) {
      this.deviceMn = v.mn;
      this.DEVICEID = v.id;
      this.PRODUCT_ID = v.product_id;
      this.getProductAndDataType();
    },
    initMn(v) {
      this.deviceMn = v.mn;
      this.DEVICEID = v.id;
      this.PRODUCT_ID = v.product_id;
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
              this.dataTypeId = "";
              this.productData = [];

              this.$Message.warning(this.$t("tip.noDataType"));
            } else {
              this.productData = list;

              this.TYPE = list[0].cn;
              this.dataTypeId = list[0].cn;

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
          `月报数据${t}.xlsx`
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
        dev = this.deviceData,
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
            sortable: true,
            fixed: "left",
            align: "center"
          },
          {
            align: "center",
            title: "时间",
            sortable: true,
            key: "dataTime",
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
    async getDeviceComponent() {
      this.loading = true;
      let data = {
        device_id: this.DEVICEID,
        page_index: 1,
        page_size: 50
      };

      await this.$api.monitor1
        .getDeviceComponentData(data)
        .then(res => {
          if (res.data.code === 0) {
            this.componentData = [];

            this.componentData = res.data.data.data_info;

            this.getWeeklyData();
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    async queryData() {
      let s = null,
        e = null,
        m = new Date().getMonth() + 1;
      if (
        typeof this.startDate === "string" ||
        this.startDate === null ||
        this.endDate === null
      ) {
        let t = this.setUnix(m);
        s = t[0];
        e = Number(t[1] + 86400);
      } else {
        s = this.startDate;
        e = this.endDate;
      }

      this.MN = this.deviceMn;
      this.WATERTYPE = this.waterId;
      this.TYPE = this.dataTypeId;
      this.STARTDATE = s;
      this.ENDDATE = e;

      await this.getDeviceComponent();
    },
    async getWeeklyData() {
      this.MN = this.deviceMn;
      let data = {
        mn: this.MN,
        start_time: this.STARTDATE,
        end_time: this.ENDDATE,
        water_type: this.WATERTYPE,
        cn: this.TYPE
      };

      await this.$api.monitor1
        .getWeeklyAndMonthFormsData(data)
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
    },
    changeDatePicker(value) {
      this.formatStartDate = value;
      let m = value.slice(-2);
      let t = this.setUnix(m);
      this.startDate = t[0];
      this.endDate = Number(t[1] + 86400);
    },
    selectDataType(value) {
      this.dataTypeId = value;
    },
    selectWaterId(value) {
      this.waterId = value;
    },
    setUnix(m) {
      let y = new Date().getFullYear();
      let month = Number(m),
        sar = "",
        end = "";

      switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
          sar = this.$moment(`${y}-${m}-01`).unix();
          end = this.$moment(`${y}-${m}-31`).unix();
          return [Number(sar), Number(end)];
          break;
        case 4:
        case 6:
        case 9:
        case 11:
          sar = this.$moment(`${y}-${m}-01`).unix();
          end = this.$moment(`${y}-${m}-30`).unix();
          return [Number(sar), Number(end)];
          break;
        case 2:
          if (this.$moment([`${y}`]).isLeapYear()) {
            sar = this.$moment(`${y}-${m}-01`).unix();
            end = this.$moment(`${y}-${m}-29`).unix();
            return [Number(sar), Number(end)];
          } else {
            sar = this.$moment(`${y}-${m}-01`).unix();
            end = this.$moment(`${y}-${m}-28`).unix();
            return [Number(sar), Number(end)];
          }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.monthlyReport-box {
  .single-page-container;

  .monthlyReport-header {
    .header;

    .header-left {
      float: left;
    }

    .header-right {
      float: right;
    }
  }

  .monthlyReport-body {
    .body;
  }
}
</style>