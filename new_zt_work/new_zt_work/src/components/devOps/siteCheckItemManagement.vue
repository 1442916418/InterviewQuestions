<!-- 站点检查项管理 -->

<template>
  <div class="siteCheckItemManagement-box">
    <div class="siteCheckItemManagement-header">
      <div class="header-left">
        <Select
          @on-change="selectDeviceId"
          style="width:200px"
          :placeholder="$t('tip.pleaseSelectSite')"
          filterable
        >
          <Option v-for="item in deviceData" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="header-right">
        <Button
          type="success"
          @click="saveDeviceComponent"
          :loading="loading"
          style="margin-left: 50px;margin-right: 20px;"
        >{{$t('btn.preservation')}}</Button>
      </div>
    </div>
    <div class="siteCheckItemManagement-body">
      <Card style="width: 100%;padding: 10px;margin-bottom: 10px;">
        <div class="card-header">
          <b>{{$t('tip.component')}}</b>
          <Checkbox
            :indeterminate="indeterminate"
            :value="checkAll"
            @click.prevent.native="handleCheckAll"
          >{{$t('tip.selectionAll')}}</Checkbox>
        </div>
        <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
          <Checkbox
            style="width: 240px;"
            v-for="(item, i) in componentData"
            :key="i"
            :label="item.name"
          ></Checkbox>
        </CheckboxGroup>
      </Card>
    </div>
  </div>
</template>

<script>
export default {
  name: "siteCheckItemManagement",
  data() {
    return {
      deviceData: [],
      componentData: [],
      deviceComponentData: [],
      selectDevice: "",
      PAGEINDEX: 1,
      PAGESIZE: 100,
      PAGEINDEX2: 1,
      PAGESIZE2: 100,
      PAGEINDEX3: 1,
      PAGESIZE3: 100,
      indeterminate: false,
      checkAll: false,
      checkAllGroup: [],
      deviceId: null,
      componentIds: [],
      loading: false
    };
  },
  created() {
    this.getDeviceData();
    this.getComponentData();
  },
  beforeDestroy() {
    this.deviceData = [];
    this.componentData = [];
    this.deviceComponentData = [];
    this.selectDevice = "";
    this.PAGEINDEX = 1;
    this.PAGESIZE = 100;
    this.PAGEINDEX2 = 1;
    this.PAGESIZE2 = 100;
    this.PAGEINDEX3 = 1;
    this.PAGESIZE3 = 100;
    this.indeterminate = false;
    this.checkAll = false;
    this.checkAllGroup = [];
    this.deviceId = null;
    this.componentIds = [];
    this.loading = false;
  },
  methods: {
    addDeviceComponents() {
      let coms = this.componentIds,
        list = [],
        devId = this.deviceId,
        status = 0,
        standardValue = -1,
        rangeValue = -1;

      for (let i = 0; i < coms.length; i++) {
        list.push({
          device_id: devId,
          component_id: coms[i],
          status: status,
          standard_value: standardValue,
          range_value: rangeValue
        });
      }

      let data = {
        list: list
      };

      this.$api.monitor1
        .addDeviceComponents(data)
        .then(res => {
          if (res.data.code === 0) {
            this.$Message.success(this.$t("tip.saveSuccess"));

            this.getDeviceComponentRelation();
          }
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    deleteDeviceComponents() {
      this.loading = true;
      let coms = this.componentIds,
        list = [],
        devId = this.deviceId,
        dc = this.deviceComponentData;

      for (let i = 0; i < dc.length; i++) {
        list.push({
          device_id: devId,
          component_id: dc[i].component_id
        });
      }

      let data = {
        list: list
      };

      this.$api.monitor1
        .deleteDeviceComponents(data)
        .then(res => {
          if (res.data.code === 0) {
            this.addDeviceComponents();
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    saveDeviceComponent() {
      let checkAllGroup = this.checkAllGroup,
        com = this.componentData,
        ids = [];
      this.componentIds = [];

      for (let j = 0; j < checkAllGroup.length; j++) {
        for (let i = 0; i < com.length; i++) {
          if (checkAllGroup[j] === com[i].name) {
            ids.push(com[i].id);
          }
        }
      }

      this.componentIds = [...new Set(ids)];

      if (this.deviceId === null) {
        this.$Message.warning(this.$t("tip.pleaseSelectSite"));
        return;
      }

      this.deleteDeviceComponents();
    },
    getDeviceComponentRelation() {
      let data = {
        device_id: this.deviceId,
        page_index: this.PAGEINDEX3,
        page_size: this.PAGESIZE3
      };

      this.$api.monitor1
        .getDeviceComponentData(data)
        .then(res => {
          if (res.data.code === 0) {
            this.deviceComponentData = [];
            this.checkAllGroup = [];
            let list = res.data.data.data_info;
            this.deviceComponentData = list;

            if (list.length === 0) {
              this.$Message.warning(this.$t("tip.noConfiguration"));
              return;
            } else {
              let len = list.length;
              for (let i = 0; i < list.length; i++) {
                this.checkAllGroup.push(list[i].component_name);
              }

              if (this.checkAllGroup.length > 0) {
                this.indeterminate = true;
              }
              if (this.checkAllGroup.length === len) {
                this.indeterminate = true;
                this.checkAll = true;
              }
            }
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    selectDeviceId(value) {
      this.deviceId = value;
      this.getDeviceComponentRelation();
    },
    checkAllGroupChange(data) {
      let currentList = this.componentData;

      if (data.length === currentList.length) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (data.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
      }
    },
    handleCheckAll() {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }

      this.indeterminate = false;

      if (this.checkAll) {
        let currentList = this.componentData,
          list = [];

        for (let i = 0; i < currentList.length; i++) {
          list.push(currentList[i].name);
        }

        this.checkAllGroup = list;
      } else {
        this.checkAllGroup = [];
      }
    },
    getComponentData() {
      let data = {
        page_index: this.PAGEINDEX2,
        page_size: this.PAGESIZE2
      };
      this.componentData = [];

      this.$api.monitor1
        .getComponentData(data)
        .then(res => {
          if (res.data.code === 0) {
            this.componentData = res.data.data.data_info;
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    getDeviceData() {
      let data = {
        page_index: this.PAGEINDEX,
        page_size: this.PAGESIZE
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
              for (let i = 0; i < this.deviceData.length; i++) {
                this.deviceData[i].label = this.deviceData[i].name;
                this.deviceData[i].value = this.deviceData[i].id;
              }
            }
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    }
  }
};
</script>
 
<style lang="less" scoped>
.siteCheckItemManagement-box {
  .single-page-container;

  .siteCheckItemManagement-header {
    .header;

    .header-left {
      float: left;
    }
    .header-right {
      float: right;
    }
  }

  .siteCheckItemManagement-body {
    .body;

    .card-header {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #e9e9e9;
      padding-bottom: 6px;
      margin-bottom: 6px;
    }
  }
}
</style>