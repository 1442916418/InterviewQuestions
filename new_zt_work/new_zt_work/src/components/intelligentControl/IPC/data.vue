<!-- 数据 -->

<template>
  <div class="data-box animated fade fadeIn">
    <Card class="card-box" v-for="item in type" :key="item.id">
      <div class="card-box-item" @click="clickButton(item)">
        <Icon type="ios-paper-outline" size="50" color="#16a75e" />
        <b style="margin-top: 10px;color: black;">{{ item.name }}</b>
      </div>
    </Card>

    <div
      :class="{'modal-box': true, 'animated': true, 'bounce': true, 'bounceInUp': isShowModal, 'bounceOutDown': !isShowModal, 'faster': true}"
    >
      <div class="modal" v-show="isShowModal">
        <div class="modal-header">
          <div class="modal-header-title">{{modal.title}}</div>
          <a class="modal-close">
            <Icon type="md-close" size="25" color="#16a75e" @click="cancelClick" />
          </a>
        </div>
        <div class="modal-body">
          <div class="modal-type1" ref="modalType">
            <Table
              ref="table"
              :columns="tableColumns"
              :data="tableData"
              :loading="loading"
              :height="tableHeight"
              border
            ></Table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  props: ["mn", "component", "parentData"],
  data() {
    return {
      componentName: null,
      type: [
        {
          id: 1,
          name: "零点核查报告"
        },
        {
          id: 2,
          name: "跨度核查报告"
        },
        {
          id: 3,
          name: "标样核查报告"
        },
        {
          id: 4,
          name: "空白样测试报告"
        },
        {
          id: 5,
          name: "平行样测试报告"
        },
        {
          id: 6,
          name: "动态质控样核查报告"
        },
        {
          id: 7,
          name: "加标回收功能报告"
        }
      ],
      isShowModal: false,
      modal: {
        title: null,
        id: 1
      },
      loading: false,
      tableHeight: 400,
      tableColumns: [],
      tableData: []
    };
  },
  watch: {
    component: function(newVal) {
      switch (newVal) {
        case "w01019":
          this.componentName = "高锰酸盐";
          break;
        case "w21003":
          this.componentName = "氨氮";
          break;
        case "w21011":
          this.componentName = "总磷";
          break;
        case "w21001":
          this.componentName = "总氮";
          break;
      }
    },
    parentData: function(newVal) {
      console.log(newVal, "<----- watch  parentData -----");
      this.isShowModal = true;
      this.setTabelData();
    }
  },
  mounted() {
    this.isShowModal = false;
    this.tableHeight =
      window.innerHeight - this.$refs.table.$el.offsetTop - 300;
  },
  beforeDestroy() {
    this.isShowModal = false;
    this.loading = false;
    this.modal = {
      title: null,
      id: 1
    };
  },
  methods: {
    setTabelData() {
      this.loading = true;
      let modalId = this.modal.id,
        com = this.component;
      this.tableData = [];
      this.tableColumns = [];

      switch (modalId) {
        case 1:
          this.tableType1();
          break;
        case 2:
          this.tableType2();
          break;
        case 3:
          this.tableType3();
          break;
        case 4:
          this.tableType4();
          break;
        case 5:
          this.tableType5();
          break;
        case 6:
          this.tableType6();
          break;
        case 7:
          this.tableType7();
          break;
      }

      this.loading = false;
    },
    tableType1() {
      let local1 = JSON.parse(localStorage.getItem("type1"));
      let parentData = this.parentData;
      let componentValue = null,
        timeInterval = null,
        timeSpot = null,
        d = [],
        t = null,
        len = 5,
        com = this.component,
        dateTime = new Date();

      if (local1 === null) {
        componentValue = 1;
        timeInterval = 2;
        timeSpot = [2, 3, 5, 6, 9];
      } else {
        componentValue = local1.componentValue;
        timeInterval = local1.timeInterval;
        timeSpot = local1.timeSpot;
      }

      if (this.parentData) {
        let pS = parentData.startDate,
          pE = parentData.endDate,
          pD = parentData.days,
          len = parseInt(pD / timeInterval),
          pTime = null,
          dateTime = new Date(pE);

        for (let i = 0; i < len; i++) {
          dateTime.setDate(dateTime.getDate() - Number(timeInterval));
          dateTime = new Date(dateTime);

          t = moment(dateTime).format("YYYY-MM-DD");

          for (let j = 0; j < timeSpot.length; j++) {
            let s =
              timeSpot[j].toString().length === 1
                ? `0${timeSpot[j]}`
                : `${timeSpot[j]}`;
            let result = this.setMeasurementResult(0, componentValue);
            let er = (result - componentValue).toFixed(2);
            d.push({
              dateTime: `${t}  ${s}:00:00`,
              result: result,
              standard: componentValue,
              absoluteError: er
            });
          }
        }
      } else {
        len = timeSpot.length < 10 ? 10 : 8;

        for (let i = 0; i < len; i++) {
          dateTime.setDate(dateTime.getDate() - Number(timeInterval));
          dateTime = new Date(dateTime);

          t = moment(dateTime).format("YYYY-MM-DD");
          for (let j = 0; j < timeSpot.length; j++) {
            let s =
              timeSpot[j].toString().length === 1
                ? `0${timeSpot[j]}`
                : `${timeSpot[j]}`;
            let result = this.setMeasurementResult(0, componentValue);
            let er = (result - componentValue).toFixed(2);
            d.push({
              dateTime: `${t}  ${s}:00:00`,
              result: result,
              standard: componentValue,
              absoluteError: er
            });
          }
        }
        let startDate = d[0].dateTime,
          endDate = d[d.length - 1].dateTime;

        this.$emit("changeStartDate", endDate);
        this.$emit("changeEndDate", startDate);
      }

      this.tableData = d;
      this.tableColumns = [
        {
          title: "序号",
          type: "index",
          minWidth: 60,
          align: "center"
        },
        {
          title: "日期",
          key: "dateTime",
          minWidth: 150,
          align: "center"
        },
        {
          title: "测量结果(mg/L)",
          align: "center",
          key: "result"
        },
        {
          title: "量程核查",
          align: "center",
          children: [
            {
              title: "标样浓度(mg/L)",
              align: "center",
              key: "standard"
            },
            {
              title: "绝对误差(%)",
              align: "center",
              key: "absoluteError"
            },
            {
              title: "合格情况",
              align: "center",
              render: (h, params) => {
                let txt = ["不合格", "合格"],
                  text = txt[0],
                  ae = params.row.absoluteError;
                if (com === "w01019") {
                  if (ae < 1.0 && ae > -1.0) {
                    text = txt[1];
                  }
                } else if (com === "w21003") {
                  if (ae < 0.2 && ae > -0.2) {
                    text = txt[1];
                  }
                } else if (com === "w21011") {
                  if (ae < 0.02 && ae > -0.02) {
                    text = txt[1];
                  }
                } else if (com === "w21001") {
                  if (ae < 0.3 && ae > -0.3) {
                    text = txt[1];
                  }
                }
                return h("span", text);
              }
            }
          ]
        }
      ];
    },
    tableType2() {
      let local2 = JSON.parse(localStorage.getItem("type2"));
      let parentData = this.parentData;
      let componentValue2 = null,
        timeInterval2 = null,
        timeSpot2 = null,
        d2 = [],
        t2 = null,
        len2 = 5,
        com2 = this.component,
        dateTime2 = new Date();

      console.log(local2, parentData, "22222");

      if (local2 === null) {
        componentValue2 = 1;
        timeInterval2 = 2;
        timeSpot2 = [2, 3, 5, 6, 9];
      } else {
        componentValue2 = local2.componentValue;
        timeInterval2 = local2.timeInterval;
        timeSpot2 = local2.timeSpot;
      }

      if (this.parentData) {
        let pS = parentData.startDate,
          pE = parentData.endDate,
          pD = parentData.days,
          len = parseInt(pD / timeInterval2),
          pTime = null,
          dateTime2 = new Date(pE);

        for (let i = 0; i < len; i++) {
          dateTime2.setDate(dateTime2.getDate() - Number(timeInterval2));
          dateTime2 = new Date(dateTime2);

          t2 = moment(dateTime2).format("YYYY-MM-DD");

          for (let j = 0; j < timeSpot2.length; j++) {
            let s =
              timeSpot2[j].toString().length === 1
                ? `0${timeSpot2[j]}`
                : `${timeSpot2[j]}`;
            let result2 = this.setMeasurementResult(0, componentValue2);
            let er2 = (
              ((result2 - componentValue2) / componentValue2) *
              100
            ).toFixed(2);
            d2.push({
              dateTime: `${t2}  ${s}:00:00`,
              result: result2,
              standard: componentValue2,
              absoluteError: er2
            });
          }
        }
      } else {
        len2 = timeSpot2.length < 10 ? 10 : 8;

        for (let i = 0; i < len2; i++) {
          dateTime2.setDate(dateTime2.getDate() - Number(timeInterval2));
          dateTime2 = new Date(dateTime2);

          t2 = moment(dateTime2).format("YYYY-MM-DD");

          for (let j = 0; j < timeSpot2.length; j++) {
            let s =
              timeSpot2[j].toString().length === 1
                ? `0${timeSpot2[j]}`
                : `${timeSpot2[j]}`;
            let result2 = this.setMeasurementResult(0, componentValue2);
            let er2 = (
              ((result2 - componentValue2) / componentValue2) *
              100
            ).toFixed(2);
            d2.push({
              dateTime: `${t2}  ${s}:00:00`,
              result: result2,
              standard: componentValue2,
              absoluteError: er2
            });
          }
        }

        let startDate = d2[0].dateTime,
          endDate = d2[d2.length - 1].dateTime;

        this.$emit("changeStartDate", endDate);
        this.$emit("changeEndDate", startDate);
      }

      this.tableData = d2;
      this.tableColumns = [
        {
          title: "序号",
          type: "index",
          minWidth: 60,
          align: "center"
        },
        {
          title: "日期",
          key: "dateTime",
          minWidth: 150,
          align: "center"
        },
        {
          title: "测量结果(mg/L)",
          align: "center",
          key: "result"
        },
        {
          title: "量程核查",
          align: "center",
          children: [
            {
              title: "标样浓度(mg/L)",
              align: "center",
              key: "standard"
            },
            {
              title: "相对误差(%)",
              align: "center",
              key: "absoluteError"
            },
            {
              title: "合格情况",
              align: "center",
              render: (h, params) => {
                let text = "不合格";
                let val = params.row.absoluteError;
                if (val < 10 && val > -10) {
                  text = "合格";
                }
                return h("span", text);
              }
            }
          ]
        }
      ];
    },
    tableType3() {
      let local3 = JSON.parse(localStorage.getItem("type3"));
      let parentData = this.parentData;
      let componentValue3 = null,
        timeInterval3 = null,
        timeSpot3 = null,
        d3 = [],
        t3 = null,
        len3 = 5,
        com3 = this.component,
        dateTime3 = new Date();

      console.log(local3, parentData, "33333");

      if (local3 === null) {
        componentValue3 = 1;
        timeInterval3 = 2;
        timeSpot3 = [2, 3, 5, 6, 9];
      } else {
        componentValue3 = local3.componentValue;
        timeInterval3 = local3.timeInterval;
        timeSpot3 = local3.timeSpot;
      }

      if (this.parentData) {
        let pS = parentData.startDate,
          pE = parentData.endDate,
          pD = parentData.days,
          len = parseInt(pD / timeInterval3),
          pTime = null,
          dateTime3 = new Date(pE);

        for (let i = 0; i < len; i++) {
          dateTime3.setDate(dateTime3.getDate() - Number(timeInterval3));
          dateTime3 = new Date(dateTime3);

          t3 = moment(dateTime3).format("YYYY-MM-DD");

          for (let j = 0; j < timeSpot3.length; j++) {
            let s =
              timeSpot3[j].toString().length === 1
                ? `0${timeSpot3[j]}`
                : `${timeSpot3[j]}`;
            let result3 = this.setMeasurementResult(0, componentValue3);
            let er3 = (
              ((result3 - componentValue3) / componentValue3) *
              100
            ).toFixed(3);
            d3.push({
              dateTime: `${t3}  ${s}:00:00`,
              result: result3,
              standard: componentValue3,
              absoluteError: er3
            });
          }
        }
      } else {
        len3 = timeSpot3.length < 10 ? 10 : 8;

        for (let i = 0; i < len3; i++) {
          dateTime3.setDate(dateTime3.getDate() - Number(timeInterval3));
          dateTime3 = new Date(dateTime3);

          t3 = moment(dateTime3).format("YYYY-MM-DD");

          for (let j = 0; j < timeSpot3.length; j++) {
            let s =
              timeSpot3[j].toString().length === 1
                ? `0${timeSpot3[j]}`
                : `${timeSpot3[j]}`;
            let result3 = this.setMeasurementResult(0, componentValue3);
            let er3 = (
              ((result3 - componentValue3) / componentValue3) *
              100
            ).toFixed(3);
            d3.push({
              dateTime: `${t3}  ${s}:00:00`,
              result: result3,
              standard: componentValue3,
              absoluteError: er3
            });
          }
        }

        let startDate = d3[0].dateTime,
          endDate = d3[d3.length - 1].dateTime;

        this.$emit("changeStartDate", endDate);
        this.$emit("changeEndDate", startDate);
      }

      this.tableData = d3;
      this.tableColumns = [
        {
          title: "序号",
          type: "index",
          minWidth: 60,
          align: "center"
        },
        {
          title: "日期",
          key: "dateTime",
          minWidth: 150,
          align: "center"
        },
        {
          title: "测量结果(mg/L)",
          align: "center",
          key: "result"
        },
        {
          title: "量程核查",
          align: "center",
          children: [
            {
              title: "标样浓度(mg/L)",
              align: "center",
              key: "standard"
            },
            {
              title: "相对误差(%)",
              align: "center",
              key: "absoluteError"
            },
            {
              title: "合格情况",
              align: "center",
              render: (h, params) => {
                let text = "不合格";
                let val = params.row.absoluteError;
                if (val < 10 && val > -10) {
                  text = "合格";
                }
                return h("span", text);
              }
            }
          ]
        }
      ];
    },
    tableType4() {
      let local4 = JSON.parse(localStorage.getItem("type4"));
      let parentData = this.parentData;
      let componentValue4 = null,
        timeInterval4 = null,
        timeSpot4 = null,
        d4 = [],
        t4 = null,
        len4 = 5,
        com4 = this.component,
        dateTime4 = new Date();

      if (local4 === null) {
        componentValue4 = 0;
        timeInterval4 = 2;
        timeSpot4 = [2, 3, 5, 6, 9];
      } else {
        componentValue4 = 0;
        timeInterval4 = local4.timeInterval;
        timeSpot4 = local4.timeSpot;
      }

      console.log(local4, this.parentData, "4444");

      if (this.parentData) {
        let pS = parentData.startDate,
          pE = parentData.endDate,
          pD = parentData.days,
          len = parseInt(pD / timeInterval4),
          pTime = null,
          dateTime4 = new Date(pE);

        for (let i = 0; i < len; i++) {
          dateTime4.setDate(dateTime4.getDate() - Number(timeInterval4));
          dateTime4 = new Date(dateTime4);

          t4 = moment(dateTime4).format("YYYY-MM-DD");

          for (let j = 0; j < timeSpot4.length; j++) {
            let s4 =
              timeSpot4[j].toString().length === 1
                ? `0${timeSpot4[j]}`
                : `${timeSpot4[j]}`;
            let result4 = this.setMeasurementResult(0, 1);
            let er4 = (result4 - componentValue4).toFixed(2);
            d4.push({
              dateTime: `${t4}  ${s4}:00:00`,
              result: result4,
              standard: componentValue4,
              absoluteError: er4
            });
          }
        }
      } else {
        len4 = timeSpot4.length < 10 ? 10 : 8;
        for (let i = 0; i < len4; i++) {
          dateTime4.setDate(dateTime4.getDate() - Number(timeInterval4));
          dateTime4 = new Date(dateTime4);

          t4 = moment(dateTime4).format("YYYY-MM-DD");

          for (let j = 0; j < timeSpot4.length; j++) {
            let s4 =
              timeSpot4[j].toString().length === 1
                ? `0${timeSpot4[j]}`
                : `${timeSpot4[j]}`;
            let result4 = this.setMeasurementResult(0, 1);
            let er4 = (result4 - componentValue4).toFixed(2);
            d4.push({
              dateTime: `${t4}  ${s4}:00:00`,
              result: result4,
              standard: componentValue4,
              absoluteError: er4
            });
          }
        }
      }

      this.tableData = d4;
      this.tableColumns = [
        {
          title: "序号",
          type: "index",
          minWidth: 60,
          align: "center"
        },
        {
          title: "日期",
          key: "dateTime",
          minWidth: 150,
          align: "center"
        },
        {
          title: "测量结果(mg/L)",
          align: "center",
          key: "result"
        },
        {
          title: "量程核查",
          align: "center",
          children: [
            {
              title: "标样浓度(mg/L)",
              align: "center",
              key: "standard"
            },
            {
              title: "绝对误差(%)",
              align: "center",
              key: "absoluteError"
            }
          ]
        }
      ];
    },
    tableType5() {
      let local5 = JSON.parse(localStorage.getItem("type5"));
      let parentData = this.parentData;
      let componentValue5 = null,
        groupNumber5 = null,
        timeSpot5 = null,
        d5 = [],
        t5 = null,
        len5 = 5,
        com = this.component,
        dateTime = new Date();

      if (local5 === null) {
        componentValue5 = 1;
        groupNumber5 = 2;
        timeSpot5 = [2, 3, 5, 6, 9];
      } else {
        componentValue5 = local5.componentValue;
        groupNumber5 = local5.groupNumber;
        timeSpot5 = local5.timeSpot;
      }

      console.log(local5, this.parentData, "55555");

      if (this.parentData) {
        let pS = parentData.startDate,
          pE = parentData.endDate,
          pD = parentData.days,
          len5 = pD,
          pTime = null,
          dateTime = new Date(pE);

        for (let i = 0; i < len5; i++) {
          dateTime.setDate(dateTime.getDate() - 1);
          dateTime = new Date(dateTime);

          t5 = moment(dateTime).format("YYYY-MM-DD");

          for (let j = 0; j < timeSpot5.length; j++) {
            let s5 =
              timeSpot5[j].toString().length === 1
                ? `0${timeSpot5[j]}`
                : `${timeSpot5[j]}`;
            let result5 = this.setMeasurementResult(0, 1);
            d5.push({
              dateTime: `${t5}  ${s5}:00:00`,
              result: result5,
              groupNumber: groupNumber5,
              standard: componentValue5
            });
          }
        }
      } else {
        len5 = timeSpot5.length < 10 ? 10 : 8;
        for (let i = 0; i < len5; i++) {
          dateTime = new Date(dateTime);

          t5 = moment(dateTime).format("YYYY-MM-DD");

          for (let j = 0; j < timeSpot5.length; j++) {
            let s5 =
              timeSpot5[j].toString().length === 1
                ? `0${timeSpot5[j]}`
                : `${timeSpot5[j]}`;
            let result5 = this.setMeasurementResult(0, 1);
            d5.push({
              dateTime: `${t5}  ${s5}:00:00`,
              result: result5,
              groupNumber: groupNumber5,
              standard: componentValue5
            });
          }
        }

        let startDate = d5[0].dateTime,
          endDate = d5[d5.length - 1].dateTime;

        this.$emit("changeStartDate", endDate);
        this.$emit("changeEndDate", startDate);
      }

      this.tableData = d5;
      this.tableColumns = [
        {
          title: "序号",
          type: "index",
          minWidth: 60,
          align: "center"
        },
        {
          title: "日期",
          key: "dateTime",
          minWidth: 150,
          align: "center"
        },
        {
          title: "测量结果",
          align: "center",
          key: "result"
        },
        {
          title: "组数",
          align: "center",
          key: "groupNumber"
        },
        {
          title: "标样浓度",
          align: "center",
          key: "standard"
        }
      ];
    },
    tableType6() {
      let local6 = JSON.parse(localStorage.getItem("type6"));
      let parentData = this.parentData;
      let componentValue6 = null,
        timeInterval = null,
        timeSpot6 = null,
        d6 = [],
        t6 = null,
        len6 = 5,
        com = this.component,
        dateTime = new Date();

      if (local6 === null) {
        componentValue6 = this.setMeasurementResult(0, 1);
        timeInterval = 2;
        timeSpot6 = [2, 3, 5, 6, 9];
      } else {
        componentValue6 = this.setMeasurementResult(0, 1);
        timeInterval = local6.timeInterval;
        timeSpot6 = local6.timeSpot;
      }

      if (this.parentData) {
        let pS = parentData.startDate,
          pE = parentData.endDate,
          pD = parentData.days,
          len6 = parseInt(pD / timeInterval),
          pTime = null,
          dateTime = new Date(pE);

        for (let i = 0; i < len6; i++) {
          dateTime.setDate(dateTime.getDate() - Number(timeInterval));
          dateTime = new Date(dateTime);

          t6 = moment(dateTime).format("YYYY-MM-DD");

          for (let j = 0; j < timeSpot6.length; j++) {
            let s =
              timeSpot6[j].toString().length === 1
                ? `0${timeSpot6[j]}`
                : `${timeSpot6[j]}`;
            let result6 = this.setMeasurementResult(0, 1);
            let er6 = (
              ((result6 - componentValue6) / componentValue6) *
              100
            ).toFixed(2);
            d6.push({
              dateTime: `${t6}  ${s}:00:00`,
              result: result6,
              standard: componentValue6,
              absoluteError: er6
            });
          }
        }
      } else {
        len6 = timeSpot6.length < 10 ? 10 : 8;
        for (let i = 0; i < len6; i++) {
          dateTime.setDate(dateTime.getDate() - Number(timeInterval));
          dateTime = new Date(dateTime);

          t6 = moment(dateTime).format("YYYY-MM-DD");

          for (let j = 0; j < timeSpot6.length; j++) {
            let s =
              timeSpot6[j].toString().length === 1
                ? `0${timeSpot6[j]}`
                : `${timeSpot6[j]}`;
            let result6 = this.setMeasurementResult(0, 1);
            let er6 = (
              ((result6 - componentValue6) / componentValue6) *
              100
            ).toFixed(2);
            d6.push({
              dateTime: `${t6}  ${s}:00:00`,
              result: result6,
              standard: componentValue6,
              absoluteError: er6
            });
          }
        }
        let startDate = d6[0].dateTime,
          endDate = d6[d6.length - 1].dateTime;

        this.$emit("changeStartDate", endDate);
        this.$emit("changeEndDate", startDate);
      }

      this.tableData = d6;
      this.tableColumns = [
        {
          title: "序号",
          type: "index",
          minWidth: 60,
          align: "center"
        },
        {
          title: "日期",
          key: "dateTime",
          minWidth: 150,
          align: "center"
        },
        {
          title: "测量结果",
          align: "center",
          key: "result"
        },
        {
          title: "量程核查",
          align: "center",
          children: [
            {
              title: "水样浓度",
              align: "center",
              key: "standard"
            },
            {
              title: "相对误差",
              align: "center",
              key: "absoluteError"
            },
            {
              title: "合格情况",
              align: "center",
              render: (h, params) => {
                let text = "不合格";
                let val = params.row.absoluteError;
                if (val < 10 && val > -10) {
                  text = "合格";
                }
                return h("span", text);
              }
            }
          ]
        }
      ];
    },
    tableType7() {
      let local7 = JSON.parse(localStorage.getItem("type7"));
      let parentData = this.parentData;
      let componentValue = null,
        timeInterval = null,
        timeSpot = null,
        d = [],
        t = null,
        len = 5,
        com = this.component,
        dateTime = new Date();

      if (local7 === null) {
        componentValue = 1;
        timeInterval = 2;
        timeSpot = [2, 3, 5, 6, 9];
      } else {
        componentValue = local7.componentValue;
        timeInterval = local7.timeInterval;
        timeSpot = local7.timeSpot;
      }

      if (this.parentData) {
        let pS = parentData.startDate,
          pE = parentData.endDate,
          pD = parentData.days,
          len = parseInt(pD / timeInterval),
          pTime = null,
          dateTime = new Date(pE);

        for (let i = 0; i < len; i++) {
          dateTime.setDate(dateTime.getDate() - Number(timeInterval));
          dateTime = new Date(dateTime);

          t = moment(dateTime).format("YYYY-MM-DD");

          for (let j = 0; j < timeSpot.length; j++) {
            let s =
              timeSpot[j].toString().length === 1
                ? `0${timeSpot[j]}`
                : `${timeSpot[j]}`;
            let addResult = this.setMeasurementResult(0, componentValue);
            let er = (
              ((addResult - componentValue) / componentValue) *
              100
            ).toFixed(2);
            d.push({
              dateTime: `${t}  ${s}:00:00`,
              addResult: addResult,
              result: componentValue,
              RateResult: er
            });
          }
        }
      } else {
        len = timeSpot.length < 10 ? 10 : 8;

        for (let i = 0; i < len; i++) {
          dateTime.setDate(dateTime.getDate() - Number(timeInterval));
          dateTime = new Date(dateTime);

          t = moment(dateTime).format("YYYY-MM-DD");
          for (let j = 0; j < timeSpot.length; j++) {
            let s =
              timeSpot[j].toString().length === 1
                ? `0${timeSpot[j]}`
                : `${timeSpot[j]}`;
            let addResult = this.setMeasurementResult(0, componentValue);
            let er = (
              ((addResult - componentValue) / componentValue) *
              100
            ).toFixed(2);
            d.push({
              dateTime: `${t}  ${s}:00:00`,
              addResult: addResult,
              result: componentValue,
              RateResult: er
            });
          }
        }
        let startDate = d[0].dateTime,
          endDate = d[d.length - 1].dateTime;

        this.$emit("changeStartDate", endDate);
        this.$emit("changeEndDate", startDate);
      }

      this.tableData = d;
      this.tableColumns = [
        {
          title: "序号",
          type: "index",
          minWidth: 60,
          align: "center"
        },
        {
          title: "日期",
          key: "dateTime",
          minWidth: 150,
          align: "center"
        },
        {
          title: "水样浓度(mg/L)",
          align: "center",
          minWidth: 100,
          key: "result"
        },
        {
          title: "加标后水样浓度(mg/L)",
          align: "center",
          minWidth: 150,
          key: "addResult"
        },
        {
          title: "加标回收率(%)",
          align: "center",
          minWidth: 80,
          key: "RateResult"
        },
        {
          title: "合格情况",
          align: "center",
          minWidth: 100,
          render: (h, params) => {
            let txt = ["不合格", "合格"],
              text = txt[0],
              r = params.row.RateResult;

            if (r < 120 && r > 80) {
              text = txt[1];
            }

            return h("span", text);
          }
        }
      ];
    },
    setMeasurementResult(n, m) {
      return (Math.random() * (n - m) + m).toFixed(2);
    },
    cancelClick() {
      this.isShowModal = !this.isShowModal;
      this.loading = !this.loading;
      this.tableData = [];
      this.tableColumns = [];
    },
    clickButton(item) {
      this.isShowModal = !this.isShowModal;
      this.modal.title = item.name;
      this.modal.id = item.id;
      this.setTabelData();
    }
  }
};
</script>

<style lang="less" scoped>
.data-box {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;

  .card-box {
    width: 200px;
    margin: 20px;

    .card-box-item {
      width: 100%;
      height: 180px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }

  .modal-box {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    outline: 0;

    .modal {
      width: 100% !important;
      position: absolute;
      top: 0;
      bottom: 50px;
      background-color: white;
      box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
      -webkit-box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
      -moz-box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
      -o-box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
      -ms-box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);

      .modal-header {
        border-bottom: 1px solid #e8eaec;
        padding: 14px 16px;
        line-height: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .modal-header-title {
          display: inline-block;
          width: 100%;
          height: 20px;
          line-height: 20px;
          font-size: 16px;
          color: #17233d;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .modal-close {
          z-index: 1;
          font-size: 12px;
          overflow: hidden;
          cursor: pointer;
        }
      }

      .modal-body {
        width: 100%;
        overflow: auto;
        position: absolute;
        top: 51px;
        bottom: 0;
      }
    }
  }
}

.modal-type1 {
  width: 100%;
  height: 100%;
}
</style>