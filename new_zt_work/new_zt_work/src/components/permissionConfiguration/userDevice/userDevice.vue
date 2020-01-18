<!-- 用户设备 -->

<template>
  <div class="userDevice-box">
    <div class="userDevice-header">
      <div class="header-left">
        <SelectUser @changeUser="selectUser"></SelectUser>
      </div>

      <div class="header-right">
        <Button
          :loading="loading"
          type="success"
          @click="savePowerGroupPower"
          style="margin-left: 50px;margin-right: 20px;"
        >{{$t('btn.preservation')}}</Button>
      </div>
    </div>

    <div class="userDevice-body">
      <Card
        style="width: 100%;padding: 10px;margin-bottom: 10px;"
        v-for="(value, name, index) in powerTypeList"
        :key="index"
      >
        <div class="card-header">
          <b>{{ setPowerTypeName(name) }}</b>
          <Checkbox
            :indeterminate="indeterminate[name]"
            :value="checkAll[name]"
            @click.prevent.native="handleCheckAll(name)"
          >{{$t('tip.selectionAll')}}</Checkbox>
        </div>
        <CheckboxGroup
          v-model="checkAllGroup[name]"
          @on-change="checkAllGroupChange(checkAllGroup[name], name)"
        >
          <Checkbox style="width: 240px;" v-for="(item, i) in value" :key="i" :label="item.name"></Checkbox>
        </CheckboxGroup>
      </Card>
    </div>

    <div class="spin-box" v-if="spinShow">
      <div class="spin">
        <span class="spin-dot"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "userDevice",
  data() {
    return {
      // 当前权限组权限关系
      currentRelationship: {
        user: []
      },
      // 全选按钮样式状态
      indeterminate: {
        user: false
      },
      // 全选按钮状态
      checkAll: {
        user: false
      },
      // 复选框状态
      checkAllGroup: {
        user: []
      },
      // 权限类型列表
      powerTypeList: {
        user: []
      },
      selectType: 4,
      type: 0,
      powerPageIndex: 1,
      powerPageSize: 300,
      spinShow: false,
      userList: [],
      userId: null,
      pageIndex: 1,
      pageSize: 200,
      adduserIds: [],
      loading: false,
      cityList: [
        {
          value: 0,
          label: "全部"
        },
        {
          value: 1,
          label: "接口"
        },
        {
          value: 2,
          label: "菜单"
        },
        {
          value: 3,
          label: "产品"
        },
        {
          value: 4,
          label: "设备"
        }
      ]
    };
  },
  created() {
    this.$Modal.remove();
    this.getPowerList();
  },
  beforeDestroy() {
    this.currentRelationship = {
      user: []
    };
    this.indeterminate = {
      user: false
    };
    this.checkAll = {
      user: false
    };
    this.checkAllGroup = {
      user: []
    };
    this.powerTypeList = {
      user: []
    };
    this.selectType = 4;
    this.type = 0;
    this.powerPageIndex = 1;
    this.powerPageSize = 300;
    this.spinShow = false;
    this.userList = [];
    this.userId = null;
    this.pageIndex = 1;
    this.pageSize = 200;
    this.adduserIds = [];
    this.loading = false;
  },
  methods: {
    selectUser(value) {
      this.userId = value.id;
      this.getUserDeviceList();
    },
    adduserDevices() {
      this.loading = true;
      let data = {
        user_id: this.userId,
        device_ids: this.adduserIds
      };

      this.$api.monitor1
        .addUserDevice(data)
        .then(res => {
          if (res.data.code === 0) {
            this.spinShow = false;
            this.$Message.success(this.$t("tip.saveSuccess"));

            this.getUserDeviceList();
          }
          this.loading = false;
          this.spinShow = false;
        })
        .catch(error => {
          this.spinShow = false;
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    savePowerGroupPower() {
      let currentRelationship = this.currentRelationship,
        checkAllGroup = this.checkAllGroup,
        powerTypeList = this.powerTypeList,
        ids = [];

      for (let key in powerTypeList) {
        let list = powerTypeList[key],
          checkList = checkAllGroup[key];
        for (let i = 0; i < list.length; i++) {
          for (let j = 0; j < checkList.length; j++) {
            if (list[i].name === checkList[j]) {
              ids.push(list[i].id);
            }
          }
        }
      }

      this.adduserIds = [...new Set(ids)];

      if (this.userId === null) {
        this.$Message.warning(this.$t("tip.pleaseSelectUsers"));
        return;
      } else {
        this.adduserDevices();
      }
    },
    getUserDeviceList() {
      let data = {
        user_id: this.userId
      };

      this.$api.monitor1
        .getUserDevice(data)
        .then(res => {
          if (res.data.code === 0) {
            this.checkAllGroup.user = [];
            this.currentRelationship.user = [];
            this.indeterminate.user = false;
            let list = res.data.data,
              userType = [],
              existingMenuTypeData = this.powerTypeList.user;

            if (list.length === 0) {
              this.$Message.warning(this.$t("tip.noConfiguration"));
              this.spinShow = false;
              return;
            } else {
              userType = list;

              for (let j = 0; j < existingMenuTypeData.length; j++) {
                for (let k = 0; k < userType.length; k++) {
                  if (
                    userType[k].device_id === Number(existingMenuTypeData[j].id)
                  ) {
                    this.checkAllGroup.user.push(existingMenuTypeData[j].name);
                  }
                }
              }

              if (this.checkAllGroup.user.length > 0) {
                this.indeterminate["user"] = true;
              }

              this.currentRelationship.user = userType;
            }
            this.spinShow = false;
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    setPowerTypeName(name) {
      switch (name) {
        case "user":
          return "设备";
          break;
      }
    },
    checkAllGroupChange(data, name) {
      let currentList = this.powerTypeList[name];

      switch (name) {
        case "user":
          if (data.length === currentList.length) {
            this.indeterminate[name] = false;
            this.checkAll[name] = true;
          } else if (data.length > 0) {
            this.indeterminate[name] = true;
            this.checkAll[name] = false;
          } else {
            this.indeterminate[name] = false;
            this.checkAll[name] = false;
          }
          break;
      }
    },
    handleCheckAll(name) {
      if (this.indeterminate[name]) {
        this.checkAll[name] = false;
      } else {
        this.checkAll[name] = !this.checkAll[name];
      }

      this.indeterminate[name] = false;

      if (this.checkAll[name]) {
        let currentList = this.powerTypeList[name],
          list = [];

        for (let i = 0; i < currentList.length; i++) {
          list.push(currentList[i].name);
        }

        this.checkAllGroup[name] = list;
      } else {
        this.checkAllGroup[name] = [];
      }
    },
    getPowerList() {
      this.spinShow = true;
      let data = {
        page_index: this.powerPageIndex,
        page_size: this.powerPageSize
      };

      this.$api.monitor1
        .getDeviceDataReal(data)
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data.data_info;
            this.powerTypeList = {
              user: []
            };

            for (let i = 0; i < list.length; i++) {
              this.powerTypeList.user.push(list[i]);
            }

            this.spinShow = false;
          } else {
            this.spinShow = false;
          }
        })
        .catch(error => {
          this.spinShow = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    }
  }
};
</script>

<style lang="less" scoped>
.userDevice-box {
  .single-page-container;
  padding: 20px;

  .userDevice-header {
    .header;

    .header-left {
      float: left;
    }

    .header-right {
      float: right;
    }
  }
}

.userDevice-body {
  .body;

  &::-webkit-scrollbar {
    width: 0 !important;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e9e9e9;
    padding-bottom: 6px;
    margin-bottom: 6px;
  }
}

.spin-box {
  .global-spin;
}
</style>