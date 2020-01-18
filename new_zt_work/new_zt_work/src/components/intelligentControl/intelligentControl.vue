<!-- 智能控制 -->

<template>
  <div class="intelligentControl-box">
    <div class="intelligentControl-header">
      <div class="header-left">
        <Select v-model="queryData.mn" style="width:150px;margin-right:10px;" placeholder="请选择设备">
          <Option v-for="item in deviceData" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>

        <Select
          @on-change="selectDeviceComponent"
          style="width:100px;margin-right:10px;"
          :placeholder="$t('tip.pleaseSelectComponents')"
          filterable
          :value="queryData.component"
        >
          <Option
            v-for="item in componentData"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</Option>
        </Select>

        <DatePicker
          v-show="queryData.model === 2"
          v-model="queryData.startDate"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          placeholder="请输入开始时间"
          style="width: 170px;margin-right:10px;"
          @on-change="changeQueryDataStartDae"
        ></DatePicker>
        <DatePicker
          v-show="queryData.model === 2"
          v-model="queryData.endDate"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          placeholder="请输入结束时间"
          style="width: 170px;margin-right:10px;"
          @on-change="changeQueryDataEndDae"
        ></DatePicker>
        <Button
          type="primary"
          @click="parentComponentClick"
          style="margin-right:10px;"
          v-show="queryData.model === 2"
        >查询</Button>
      </div>
      <div class="header-right">
        <Select
          @on-change="selectModel"
          style="width:100px;margin-right:10px;"
          :placeholder="$t('tip.pleaseSelectMode')"
          filterable
          :value="queryData.model"
        >
          <Option v-for="item in model" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
    </div>
    <div class="intelligentControl-body">
      <Control
        class="animated fade fadeInDown"
        :mn="queryData.mn"
        :component="queryData.component"
        v-if="queryData.model === 1"
      ></Control>
      <DataType
        :mn="queryData.mn"
        :component="queryData.component"
        :queryData="queryData"
        :parentData="parentData"
        @changeStartDate="changeStartDate"
        @changeEndDate="changeEndDate"
        class="animated fade fadeInDown"
        v-else
      ></DataType>
    </div>
  </div>
</template>

<script>
import Control from "./IPC/control";
import DataType from "./IPC/data";
import moment from "moment";

export default {
  name: "intelligentControl",
  components: {
    Control,
    DataType
  },
  data() {
    return {
      deviceData: [
        {
          value: "1",
          label: "测试区设备1"
        },
        {
          value: "2",
          label: "测试区设备2"
        },
        {
          value: "3",
          label: "测试区设备3"
        },
        {
          value: "4",
          label: "测试区设备4"
        },
        {
          value: "5",
          label: "测试区设备5"
        },
        {
          value: "6",
          label: "测试区设备6"
        },
        {
          value: "7",
          label: "测试区设备7"
        },
        {
          value: "8",
          label: "测试区设备8"
        },
        {
          value: "9",
          label: "测试区设备9"
        },
        {
          value: "10",
          label: "测试区设备10"
        },
        {
          value: "11",
          label: "测试区设备11"
        }
      ],
      queryData: {
        mn: "1",
        component: "w01019",
        model: 1,
        startDate: "",
        endDate: ""
      },
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
      ],
      model: [
        {
          label: "反控操作",
          value: 1
        },
        {
          label: "反控报告",
          value: 2
        }
      ],
      parentData: null
    };
  },
  mounted() {
    this.queryData.startDate = `${moment()
      .subtract(30, "d")
      .format("YYYY-MM-DD HH:MM:SS")}`;
    this.queryData.endDate = `${moment().format("YYYY-MM-DD HH:MM:SS")}`;
  },
  methods: {
    parentComponentClick() {
      let n = moment(this.queryData.startDate);
      let m = moment(this.queryData.endDate);
      let d = m.diff(n, "day");

      this.parentData = {
        mn: this.queryData.mn,
        component: this.queryData.component,
        model: this.queryData.model,
        startDate: this.queryData.startDate,
        endDate: this.queryData.endDate,
        days: d
      };
    },
    changeQueryDataEndDae(value, type) {
      this.queryData.endDate = value;
    },
    changeQueryDataStartDae(value, type) {
      this.queryData.startDate = value;
    },
    changeStartDate(value) {
      this.queryData.startDate = value;
    },
    changeEndDate(value) {
      this.queryData.endDate = value;
    },
    selectModel(value) {
      this.queryData.model = value;
    },
    selectDeviceComponent(value) {
      this.queryData.component = value;
    }
  }
};
</script>

<style lang="less" scoped>
.intelligentControl-box {
  .single-page-container;
  overflow-y: scroll;
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    width: 0 !important;
  }

  .intelligentControl-header {
    .header;

    .header-left {
      float: left;
    }

    .header-right {
      float: right;
    }
  }

  .intelligentControl-body {
    height: 85%;
    margin: 15px 20px;
    position: relative;
  }
}
</style>