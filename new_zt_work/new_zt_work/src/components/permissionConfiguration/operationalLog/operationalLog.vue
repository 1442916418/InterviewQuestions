<!-- 操作日志 -->

<template>
  <div class="operationalLog-box">
    <div class="operationalLog-header">
      <div class="header-right">
        <Button
          type="primary"
          icon="ios-search"
          @click="() => isShowRightDrawer = !isShowRightDrawer"
        >{{$t('tip.screening')}}</Button>
      </div>
    </div>

    <div class="operationalLog-body">
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

    <Drawer width="300" :title="$t('tip.screening')" :closable="false" v-model="isShowRightDrawer">
      <SelectUser @changeUser="selectUser"></SelectUser>
      <Select
        v-model="queryData.role_id"
        @on-change="selectRole"
        style="width:220px;margin-top:20px;"
        :placeholder="$t('tip.pleaseSelectARole')"
        filterable
      >
        <Option v-for="item in roleDataList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Select
        v-model="queryData.power_id"
        @on-change="selectPower"
        style="width:220px;margin-top:20px;"
        :placeholder="$t('tip.pleaseSelectPermission')"
        filterable
      >
        <Option v-for="item in powerData" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Select
        v-model="queryData.type"
        @on-change="selectType"
        style="width:220px;margin-top:20px;"
        :placeholder="$t('tip.pleaseSelectType')"
        filterable
      >
        <Option v-for="item in type" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <SelectTime
        @changeStartDate="changeStartDate"
        @changeEndDate="changeEndDate"
        style="margin-top:20px;"
      ></SelectTime>

      <div class="drawer-btn">
        <Button type="primary" long @click="btnQueryData">{{$t('btn.search')}}</Button>
        <Button style="margin: 10px 0;" type="warning" @click="clearSelect" long>{{$t('btn.reset')}}</Button>
        <Button @click="() => isShowRightDrawer = !isShowRightDrawer" long>{{$t('tip.cancel')}}</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
export default {
  name: "operationalLog",
  data() {
    return {
      type: [
        {
          label: "接口调用记录",
          value: 0
        },
        {
          label: "登录日志",
          value: 1
        }
      ],
      isShowRightDrawer: false,
      powerData: [],
      roleDataList: [],
      loading: false,
      columnsList: [],
      dataList: [],
      queryData: {
        user_id: -2,
        role_id: -2,
        start_time: null,
        end_time: null,
        type: 0,
        page_index: 1,
        page_size: 10,
        power_id: -2,
        count: 0
      },
      logData: []
    };
  },
  mounted() {
    this.isShowRightDrawer = false;
    this.initData();
    this.getRoleList();
    this.getPowerList();
  },
  beforeDestroy() {
    this.isShowRightDrawer = false;
    this.powerData = [];
    this.roleDataList = [];
    this.loading = false;
    this.columnsList = [];
    this.dataList = [];
    this.queryData = {
      user_id: -2,
      role_id: -2,
      start_time: null,
      end_time: null,
      type: 0,
      page_index: 1,
      page_size: 10,
      power_id: -2,
      count: 0
    };
    this.logData = [];
  },
  methods: {
    clearSelect() {
      this.queryData = {
        user_id: -2,
        role_id: -2,
        start_time: this.$moment()
          .subtract(30, "d")
          .format("YYYY/MM/DD hh:mm:ss"),
        end_time: this.$moment().format("YYYY/MM/DD hh:mm:ss"),
        type: 0,
        page_index: 1,
        page_size: 10,
        power_id: -2,
        count: 0
      };
    },
    btnQueryData() {
      this.getOperationalLog();
    },
    selectType(value) {
      this.queryData.type = value;
    },
    changeStartDate(v) {
      this.queryData.start_time = this.$moment(v).format("YYYY/MM/DD hh:mm:ss");
    },
    changeEndDate(v) {
      this.queryData.end_time = this.$moment(v).format("YYYY/MM/DD hh:mm:ss");
    },
    selectPower(value) {
      this.queryData.power_id = value;
    },
    getPowerList() {
      this.spinShow = true;
      let data = {
        type: 0,
        page_index: 1,
        page_size: 500
      };

      this.$api.auth_login
        .getPowerList(data)
        .then(res => {
          if (res.data.code === 0) {
            this.powerData = [];
            let list = res.data.data.data_info;
            this.powerData = list;
            if (this.powerData.length > 0) {
              for (let i = 0; i < this.powerData.length; i++) {
                this.powerData[i].label = this.powerData[i].power_name;
                this.powerData[i].value = this.powerData[i].id;
              }

              this.powerData.unshift({
                label: "全部权限",
                value: -2
              });
            } else {
              this.$Message.warning(this.$t("tip.noPermissionList"));
            }
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    selectRole(value) {
      this.queryData.role_id = value;
    },
    getRoleList() {
      let data = {
        page_index: 1,
        page_size: 100
      };

      this.$api.auth_login
        .getRoleList(data)
        .then(res => {
          if (res.data.code === 0) {
            this.roleDataList = [];
            this.roleDataList = res.data.data.data_info;

            if (this.roleDataList.length > 0) {
              for (let i = 0; i < this.roleDataList.length; i++) {
                this.roleDataList[i].label = this.roleDataList[i].role_name;
                this.roleDataList[i].value = this.roleDataList[i].id;
              }

              this.roleDataList.unshift({
                label: "全部角色",
                value: -2
              });
            } else {
              this.$Message.warning(this.$t("tip.noRoleList"));
            }
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    selectUser(value) {
      this.queryData.user_id = value.id;
    },
    setTable() {
      let log = this.logData;
      this.columnsList = [];
      this.dataList = [];

      if (log.length === 0) {
        this.columnsList = [];
        this.dataList = [];
      } else {
        if (this.queryData.type === 0) {
          this.columnsList = [
            {
              title: "序号",
              type: "index",
              minWidth: 80,
              fixed: "left",
              align: "center"
            },
            {
              align: "center",
              minWidth: 200,
              fixed: "left",
              title: "时间",
              key: "create_time"
            },
            {
              align: "center",
              minWidth: 150,
              title: "角色名称",
              key: "role_name"
            },
            {
              align: "center",
              minWidth: 150,
              title: "用户名称",
              key: "username"
            },
            {
              align: "center",
              minWidth: 200,
              title: "权限名称",
              key: "power_name"
            },
            {
              align: "center",
              minWidth: 200,
              title: "权限路径",
              key: "url"
            }
          ];
        } else {
          this.columnsList = [
            {
              type: "index",
              minWidth: 80,
              fixed: "left",
              align: "center"
            },
            {
              align: "center",
              minWidth: 200,
              fixed: "left",
              title: "时间",
              key: "create_time"
            },
            {
              align: "center",
              minWidth: 150,
              title: "角色名称",
              key: "role_name"
            },
            {
              align: "center",
              minWidth: 150,
              title: "用户名称",
              key: "username"
            },
            {
              align: "center",
              minWidth: 200,
              title: "权限路径",
              key: "url"
            }
          ];
        }

        this.dataList = log;
      }
    },
    initData() {
      this.queryData = {
        user_id: -2,
        role_id: -2,
        start_time: this.$moment()
          .subtract(30, "d")
          .format("YYYY/MM/DD hh:mm:ss"),
        end_time: this.$moment().format("YYYY/MM/DD hh:mm:ss"),
        type: 0,
        page_index: 1,
        page_size: 10,
        power_id: -2,
        count: 0
      };
      this.getOperationalLog();
    },
    handleSizeChange(val) {
      this.queryData.page_index = 1;
      this.queryData.page_size = val;
      this.getOperationalLog();
    },
    handleIndexChange(val) {
      this.queryData.page_index = val;
      this.getOperationalLog();
    },
    getOperationalLog() {
      this.isShowRightDrawer = false;
      this.loading = true;
      let q = this.queryData;
      let data = {
        user_id: q.user_id,
        role_id: q.role_id,
        start_time: q.start_time,
        end_time: q.end_time,
        type: q.type,
        page_index: q.page_index,
        page_size: q.page_size,
        power_id: q.power_id
      };

      this.$api.auth_login
        .getOperationalLog(data)
        .then(res => {
          if (res.data.code === 0) {
            this.logData = [];
            let list = res.data.data;
            this.logData = list.data_info;
            this.queryData.count = list.page_count;

            this.setTable();
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
.operationalLog-box {
  .single-page-container;

  .operationalLog-header {
    .header;

    .header-left {
      float: left;
    }

    .header-right {
      float: right;
    }
  }

  .operationalLog-body {
    .body;

    .page {
      padding: 20px 0;
      text-align: center;
    }
  }
}

.drawer-btn {
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>