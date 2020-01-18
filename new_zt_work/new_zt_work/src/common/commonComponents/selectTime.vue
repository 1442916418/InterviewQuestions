<!-- 公用时间选择下拉框 -->

<template>
  <div class="selectStartDate-box">
    <div class="start">
      <DatePicker
        @on-change="startDate"
        v-model="sT"
        type="datetime"
        :placeholder="$t('tip.pleaseSelectStartTime')"
        class="startDatePicker"
        format="yyyy-MM-dd HH:mm:ss"
        :options="startOptions"
      ></DatePicker>
    </div>
    <div class="end">
      <DatePicker
        @on-change="endDate"
        v-model="eT"
        type="datetime"
        :placeholder="$t('tip.pleaseSelectEndTime')"
        :class="{endDatePicker:true, marginTop: $route.name === 'devOpsList' || $route.name === 'operationalLog'}"
        format="yyyy-MM-dd HH:mm:ss"
        :options="endOptions"
      ></DatePicker>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  data() {
    return {
      sT: null,
      eT: null,
      startOptions: {
        shortcuts: [
          {
            text: `当前时间`
          },
          {
            text: `前1天`,
            value() {
              let v = moment()
                .subtract(1, "d")
                .format("YYYY-MM-DD HH:mm:ss");
              return v;
            }
          },
          {
            text: `前10天`,
            value() {
              let v = moment()
                .subtract(10, "d")
                .format("YYYY-MM-DD HH:mm:ss");
              return v;
            }
          },
          {
            text: `前30天`,
            value() {
              let v = moment()
                .subtract(30, "d")
                .format("YYYY-MM-DD HH:mm:ss");
              return v;
            }
          },
          {
            text: `前60天`,
            value() {
              let v = moment()
                .subtract(60, "d")
                .format("YYYY-MM-DD HH:mm:ss");
              return v;
            }
          },
          {
            text: `前90天`,
            value() {
              let v = moment()
                .subtract(90, "d")
                .format("YYYY-MM-DD HH:mm:ss");
              return v;
            }
          }
        ]
      },
      endOptions: {
        shortcuts: [
          {
            text: `当前时间`
          },
          {
            text: `后1天`,
            value() {
              let v = moment()
                .add(1, "d")
                .format("YYYY-MM-DD HH:mm:ss");
              return v;
            }
          },
          {
            text: `后10天`,
            value() {
              let v = moment()
                .add(10, "d")
                .format("YYYY-MM-DD HH:mm:ss");
              return v;
            }
          },
          {
            text: `后30天`,
            value() {
              let v = moment()
                .add(30, "d")
                .format("YYYY-MM-DD HH:mm:ss");
              return v;
            }
          }
        ]
      }
    };
  },
  mounted() {
    let s = `${this.$moment()
        .subtract(30, "d")
        .format("YYYY-MM-DD HH:mm:ss")}`,
      e = `${this.$moment().format("YYYY-MM-DD HH:mm:ss")}`;

    this.sT = s;
    this.eT = e;

    let state = this.$store.state;

    if (state.selectStartDate === null || state.selectStartDate === undefined) {
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
        state.selectStartDate.obj === undefined
      ) {
        this.$store.dispatch({
          type: "saveSelectStartDate",
          obj: s
        });
        this.$store.dispatch({
          type: "saveSelectEndDate",
          obj: e
        });
      } else {
        this.sT = state.selectStartDate.obj;
        this.eT = state.selectEndDate.obj;
      }
    }
  },
  computed: {
    startTime() {
      return this.$store.state.selectStartDate;
    },
    endTime() {
      return this.$store.state.selectEndDate;
    }
  },
  watch: {
    startTime: function(newVal, oldVal) {
      if (newVal === null) {
      } else {
        this.sT = newVal.obj;
      }
    },
    endTime: function(newVal, oldVal) {
      if (newVal === null) {
      } else {
        this.eT = newVal.obj;
      }
    }
  },
  methods: {
    startDate(d, t) {
      this.sT = d;
      this.$store.dispatch({
        type: "saveSelectStartDate",
        obj: d
      });
      this.$emit("changeStartDate", d);
    },
    endDate(d, t) {
      this.eT = d;
      this.$store.dispatch({
        type: "saveSelectEndDate",
        obj: d
      });
      this.$emit("changeEndDate", d);
    }
  }
};
</script>

<style lang="less" scoped>
.selectStartDate-box {
  display: inline-block;
  margin-right: 10px;

  .start {
    display: inline-block;
    margin-right: 10px;

    .startDatePicker {
      width: 216px;
    }
  }

  .end {
    display: inline-block;

    .endDatePicker {
      margin-right: 10px;
      width: 216px;
    }
  }
}

.marginTop {
  margin-top: 20px;
}
</style>