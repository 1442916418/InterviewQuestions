<!-- 实时数据查询 -->

<template>
  <div class="realTimeDataQuery-box">
    <div class="realTimeDataQuery-header" v-show="false"></div>
    <div class="realTimeDataQuery-body">
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
  name: "realTimeDataQuery",
  data() {
    return {
      columnsList: [],
      dataList: [],
      loading: false,
      queryData: {
        ml_id: 0,
        page_index: 1,
        page_size: 10,
        count: 0
      },
      newData: [],
      comData: [],
      deviceGroupData: [],
      productData: [],
    };
  },
  mounted() {
    this.getRealTimeData();
    this.getProduct();
  },
  beforeDestroy() {
    this.columnsList = [];
    this.dataList = [];
    this.tableHeight = 520;
    this.loading = false;
    this.queryData = {
      ml_id: 0,
      page_index: 1,
      page_size: 10,
      count: 0
    };
    this.newData = [];
    this.comData = [];
    this.deviceGroupData = [];
    this.productData = [];
  },
  methods: {
    getProduct() {
      let d = {
        page_index: 1,
        page_size: 50
      };

      this.$api.monitor1
        .getProductData(d)
        .then(res => {
          if (res.data.code === 0) {
            this.productData = [];
            this.productData = res.data.data.data_info;
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    getDeviceGroup() {
      let data = {
        page_index: 1,
        page_size: 100
      };

      this.$api.monitor1
        .getAllDevicesGroupData(data)
        .then(res => {
          if (res.data.code === 0) {
            this.deviceGroupData = [];
            this.deviceGroupData = res.data.data.data_info;
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    selectPage(value) {
      this.queryData.page_size = value;
      this.getRealTimeData();
    },
    nextPage() {
      this.queryData.page_index += 1;
      this.getRealTimeData();
    },
    previousPage() {
      if (this.queryData.page_index === 1) {
        this.$Message.warning(this.$t("tip.firstPage"));
        return;
      } else {
        this.queryData.page_index -= 1;
        this.getRealTimeData();
      }
    },
    setTableData() {
      let list = this.newData;
      this.columnsList = [];
      this.dataList = [];

      if (list.length === 0) {
        this.columnsList = [];
        this.dataList = [];

        this.loading = false;
      } else {
        let one = list[0];

        this.columnsList.push({
          title: "序号",
          key: "currentIndex",
          minWidth: 80,
          sortable: true,
          fixed: "left",
          align: "center"
        });

        for (let item in one) {
          let coms = this.setDeviceComponent(item);
          let title = null,
            unit = [];

          if (coms === undefined) {
            title = item;
            unit = "";
          } else {
            title = coms[0];
            unit = coms[1];
          }

          if (item === "_id" || item === "ml_id") {
          } else {
            this.columnsList.push({
              align: "center",
              title: `${title} ${unit}`,
              key: `${item}`,
              sortable: true,
              render: (h, params) => {
                let text = params.row[`${item}`];
                if (
                  params.row[`${item}`] === undefined ||
                  params.row[`${item}`] === "0.00" ||
                  params.row[`${item}`] === "0" ||
                  params.row[`${item}`] === 0 ||
                  params.row[`${item}`] === "//" ||
                  params.row[`${item}`] === "--"
                ) {
                  text = "--";
                }
                return h("span", text);
              }
            });
          }
        }

        for (let k = 0; k < this.columnsList.length; k++) {
          if (this.columnsList[k].key === "DateTime") {
            this.columnsList[k].minWidth = 150;
          }

          if (this.columnsList[k].key === "point_name") {
            this.columnsList[k].minWidth = 200;
            this.columnsList[k].fixed = "left";
          }
          this.columnsList[k].minWidth = 150;
        }

        for (let j = 0; j < list.length; j++) {
          let z = list[j];
          for (let k in z) {
            if (k === "product_id") {
              let p = this.setProduct(z[k]);
              this.$set(z, k, p);
            }
          }
        }

        let body = list.map((item, index) => {
          item.currentIndex = ++index;
          return item;
        });

        this.dataList = body;
        this.loading = false;
      }
    },
    setProduct(d) {
      let list = this.productData;
      for (let i = 0; i < list.length; i++) {
        if (d === list[i].id) {
          return list[i].name;
        }
      }
    },
    setDeviceComponent(d) {
      let com = this.comData;
      if (d === "DateTime") {
        let k = ["时间", ""];
        return k;
      }

      if (d === "_id") {
        let k = ["ID", ""];
        return k;
      }

      if (d === "ml_id") {
        let k = ["设备组ID", ""];
        return k;
      }

      if (d === "point_name") {
        let k = ["设备名称", ""];
        return k;
      }

      if (d === "product_id") {
        let k = ["产品线", ""];
        return k;
      }
      for (let i = 0; i < com.length; i++) {
        if (d === com[i].key) {
          let k = [com[i].name, com[i].unit];
          return k;
        }
      }
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

            this.setTableData();
          } else {
            this.loading = false;
          }
        })
        .catch(error => {
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    getRealTimeData() {
      this.loading = true;
      let d = this.queryData;
      let data = {
        ml_id: d.ml_id,
        page_index: d.page_index,
        page_size: d.page_size
      };

      this.$api.monitor1
        .getNewRealTimeDatas(data)
        .then(res => {
          if (res.data.code === 0) {
            this.newData = [];
            this.newData = res.data.data;

            this.getComponent();
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
.realTimeDataQuery-box {
  .single-page-container;

  .realTimeDataQuery-header {
    .header;
  }

  .realTimeDataQuery-body {
    .body;

    .page {
      padding: 20px;
      text-align: center;
    }
  }
}
</style>