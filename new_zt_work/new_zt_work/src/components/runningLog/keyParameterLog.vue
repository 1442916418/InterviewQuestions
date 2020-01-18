<!-- 关键参数日志 -->

<template>
  <div class="keyParameterLog-box">
    <div class="keyParameterLog-header">
      <div class="header-left">
        <SelectDevice @changeMn="selectDeviceMn" @initMn="initMn"></SelectDevice>
        <SelectTime @changeStartDate="changeStartDate" @changeEndDate="changeEndDate"></SelectTime>

        <Select
          v-show="keyData.length > 0"
          @on-change="selectComponent"
          style="width:200px;margin-right:10px;"
          :placeholder="$t('tip.pleaseSelectComponents')"
          filterable
          :value="conmponent"
        >
          <Option
            v-for="item in componentData"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</Option>
        </Select>
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
    <div class="keyParameterLog-body">
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

export default {
  name: "keyParameterLog",
  data() {
    return {
      queryData: {
        mn: null,
        start_time: null,
        end_time: null,
        page_index: 1,
        page_size: 10
      },
      formatStartDate: null,
      columnsList: [],
      dataList: [],
      loading: false,
      keyData: [],
      conmponent: "w21001",
      componentData: [
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
      ]
    };
  },
  mounted() {
    this.initData();
  },
  beforeDestroy() {
    this.queryData = {
      mn: null,
      start_time: null,
      end_time: null,
      page_index: 1,
      page_size: 10
    };
    this.formatStartDate = null;
    this.columnsList = [];
    this.dataList = [];
    this.loading = false;
    this.keyData = [];
    this.conmponent = "w21001";
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
      this.getPLCKeyParameter();
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
        start_time: this.$moment(s).unix(),
        end_time: this.$moment(e).unix(),
        page_index: 1,
        page_size: 10
      };
    },
    selectDeviceMn(value) {
      this.queryData.mn = value.mn;
    },
    selectComponent(value) {
      this.conmponent = value;

      this.setTable();
    },
    setTable() {
      let list = this.keyData;
      this.columnsList = [];
      this.dataList = [];

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
            fixed: "left",
            title: "时间",
            sortable: true,
            key: "DateTime"
          }
        ];

        let c = [];
        let item = list[0];

        for (let k in item) {
          if (k === this.conmponent) {
            let L = item[k];

            for (let z in L) {
              let n = z.slice(0, 6);
              let t = null;
              t = this.setMeterName(n);
              c.push({
                align: "center",
                title: t,
                key: z,
                minWidth: 200,
                sortable: true,
                render: (h, params) => {
                  let text = params.row[z];
                  if (
                    params.row[z] === undefined ||
                    params.row[z] === "0.00" ||
                    params.row[z] === "0" ||
                    params.row[z] === 0
                  ) {
                    text = "--";
                  }
                  return h("span", text);
                }
              });
            }
          }
        }

        this.columnsList = this.columnsList.concat(c);

        let cloList = JSON.parse(JSON.stringify(list));
        let da = [],
          aa = null;

        for (let e = 0; e < cloList.length; e++) {
          let item = list[e];

          for (let k in item) {
            if (k === this.conmponent) {
              aa = item[k];
              aa.DateTime = item["DateTime"];
            }
          }
        }

        da.push(aa);

        let data = da.map((item, index) => {
          item.currentIndex = ++index;
          return item;
        });

        this.dataList = da;
      }
    },
    setMeterName(v) {
      for (let i = 0; i < mc.length; i++) {
        if (v === mc[i].code) {
          return mc[i].code_name;
        }
      }
    },
    getPLCKeyParameter() {
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
        .getKeyParameterData(data)
        .then(res => {
          if (res.data.code === 0) {
            this.keyData = [];
            this.keyData = res.data.data.data_info;
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
      this.getPLCKeyParameter();
    },
    handleSizeChange(val) {
      this.queryData.page_index = 1;
      this.queryData.page_size = val;
      this.getPLCKeyParameter();
    },
    handleIndexChange(val) {
      this.queryData.page_index = val;
      this.getPLCKeyParameter();
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
          `关键参数日志${t}.xlsx`
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.keyParameterLog-box {
  .single-page-container;

  .keyParameterLog-header {
    .header;
    .header-left {
      float: left;
    }
    .header-right {
      float: right;
    }
  }
  .keyParameterLog-body {
    .body;

    .page {
      padding: 20px 0;
      text-align: center;
    }
  }
}
</style>
