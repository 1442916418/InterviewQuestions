<!-- 虚拟数据 -->

<template>
  <div class="virtualData-box">
    <div class="virtualData-header">
      <div class="header-left">
        <SelectDevice @changeMn="selectDeviceMn" @initMn="initMn"></SelectDevice>
      </div>
      <div class="header-right">
        <Button @click="close">{{$t('btn.close')}}</Button>
        <Button type="primary" @click="open">{{$t('btn.saveAndOpen')}}</Button>
      </div>
    </div>
    <div class="virtualData-body">
      <div v-if="isShowBody">
        <div class="com-list-time">
          <div class="item-name">
            <b>{{$t('tip.timeInterval')}}</b>
          </div>
          <div class="item-silder">
            <Input-number
              style="width:200px"
              :max="5000"
              :min="0.01"
              v-model="componentTime"
              :formatter="value => `${value}S`"
            ></Input-number>
          </div>
        </div>
        <div class="com-list" v-for="(item) in componentData" :key="item.id">
          <div class="item-name">
            <Checkbox border @on-change="changeCheckBox(item.key)">
              <b>{{ item.component_name }}</b>
            </Checkbox>
          </div>
          <div class="item-silder">
            <div class="item-min">
              <span>{{$t('tip.min')}}</span>
              <Input-number
                style="width:200px"
                :max="3000000"
                :min="-3000000"
                :formatter="value => `${value}${componentValue[item.key][2]}`"
                :parser="value => value.replace(`${componentValue[item.key][2]}`, '')"
                v-model="componentValue[item.key][0]"
              ></Input-number>
            </div>
            <div class="item-max">
              <span>{{$t('tip.max')}}</span>
              <Input-number
                style="width:200px"
                :max="3000000"
                :min="-3000000"
                :formatter="value => `${value}${componentValue[item.key][2]}`"
                :parser="value => value.replace(`${componentValue[item.key][2]}`, '')"
                v-model="componentValue[item.key][1]"
              ></Input-number>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import comRange from "@/plugin/staticData/componentRange.json";

export default {
  name: "virtualData",
  data() {
    return {
      queryData: {
        device_id: null,
        page_index: 1,
        page_size: 30,
        fakedata_status: null,
        name: null
      },
      componentData: [],
      componentValue: {},
      componentTime: 60,
      deviceMn: null,
      isShowBody: false,
      checkBoxs: []
    };
  },
  mounted() {
    this.isShowBody = false;
  },
  beforeDestroy() {
    this.queryData = {
      device_id: null,
      page_index: 1,
      page_size: 30,
      fakedata_status: null,
      name: null
    };
    this.componentData = [];
    this.componentValue = {};
    this.componentTime = 60;
    this.deviceMn = null;
    this.isShowBody = false;
    this.checkBoxs = [];
  },
  methods: {
    changeCheckBox(val) {
      this.checkBoxs.push(val);
    },
    close() {
      if (this.queryData.device_id === null) {
        this.$Message.warning(this.$t("tip.pleaseSelectSite"));
        return;
      }
      this.$LoadingBar.start();
      let data = {
        mn: this.deviceMn
      };

      // virtual_data   closeVirtualData
      this.$api.monitor1
        .offFakedata(data)
        .then(res => {
          if (res.data.code === 0) {
            this.$Message.success(this.$t("tip.ahutdownSuccess"));
            this.$LoadingBar.finish();
          }
          this.$LoadingBar.finish();
        })
        .catch(error => {
          this.$LoadingBar.error();
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    open() {
      let val = this.componentValue,
        time = this.componentTime,
        q = this.queryData,
        c = this.checkBoxs;

      if (q.device_id === null) {
        this.$Message.warning(this.$t("tip.pleaseSelectSite"));
        return;
      }
      if (c.length === 0) {
        this.$Message.warning(this.$t("tip.pleaseCheckTheComponents"));
        return;
      }

      this.$LoadingBar.start();

      let data = {
        mn: this.deviceMn,
        interval: this.componentTime
      };

      for (let item in val) {
        for (let i = 0; i < c.length; i++) {
          if (c[i] === item) {
            let v = [val[item][0], val[item][1]];
            data[item] = v;
          }
        }
      }

      console.log(data, "<----------------------");

      // virtual_data   openVirtualData
      this.$api.monitor1
        .onFakedata(data)
        .then(res => {
          if (res.data.code === 0) {
            this.$Message.success(this.$t("tip.sevedAndTurnedOnSuccessfully"));
            this.$LoadingBar.finish();
          }
          this.$LoadingBar.finish();
        })
        .catch(error => {
          console.log(error);
          this.$LoadingBar.finish();
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    format(val) {
      return val + "S";
    },
    getDeviceComponentData() {
      this.isShowBody = false;
      this.$LoadingBar.start();
      let q = this.queryData;
      let d = {
        device_id: q.device_id,
        page_index: q.page_index,
        page_size: q.page_size
      };

      this.componentData = [];
      this.componentValue = {};

      this.$api.monitor1
        .getDeviceComponentData(d)
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data.data_info;
            if (list.length === 0) {
              this.isShowBody = false;
              this.$Message.warning(this.$t("tip.noComponentConfiguration"));
              this.$LoadingBar.finish();
            } else {
              this.componentData = list;
              const com = JSON.parse(JSON.stringify(comRange));

              try {
                for (let i = 0; i < list.length; i++) {
                  for (let j = 0; j < com.length; j++) {
                    if (com[j].key === list[i].key) {
                      this.componentValue[list[i].key] = com[j].rangeAndUnit;
                    }
                  }
                }
              } catch (error) {
                this.$Message.warning(this.$t("tip.configure"));
              }

              this.isShowBody = true;
              this.$LoadingBar.finish();
            }
          }
          this.$LoadingBar.finish();
        })
        .catch(error => {
          this.$LoadingBar.error();
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    initMn(value) {
      this.queryData.device_id = value.id;
      this.queryData.fakedata_status = value.fakedata_status;
      this.queryData.name = value.name;
      this.deviceMn = value.mn;
      this.getDeviceComponentData();
    },
    selectDeviceMn(value) {
      this.queryData.device_id = value.id;
      this.queryData.fakedata_status = value.fakedata_status;
      this.queryData.name = value.name;
      this.deviceMn = value.mn;
      this.getDeviceComponentData();
    }
  }
};
</script>

<style lang="less" scoped>
.virtualData-box {
  .single-page-container;

  .virtualData-header {
    .header;

    .header-left {
      float: left;
    }

    .header-right {
      float: right;
    }
  }

  .virtualData-body {
    .body;

    .com-list-time {
      width: 100%;
      padding: 20px 5px;
      display: flex;
      justify-content: space-around;
      align-items: center;

      .item-name {
        width: 20%;
        padding: 0 10px;
        text-align: center;
      }

      .item-silder {
        width: 80%;
        padding: 0 10px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
    }

    .com-list {
      width: 100%;
      padding: 20px 5px;
      display: flex;
      justify-content: space-around;
      align-items: center;

      .item-name {
        width: 20%;
        padding: 0 10px;
        text-align: center;
      }

      .item-silder {
        width: 80%;
        padding: 0 10px;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .item-min,
        .item-max {
          display: inline-block;
          padding-right: 20px;
          font-size: 14px;
          color: #ccc;
        }
      }
    }
  }
}
</style>