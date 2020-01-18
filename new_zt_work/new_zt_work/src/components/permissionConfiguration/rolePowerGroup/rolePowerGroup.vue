<!-- 角色权限组 -->

<template>
  <div class="rolePowerGroup-box">
    <div class="rolePowerGroup-header">
      <div class="header-left">
        <Select
          @on-change="selectPowerGroup"
          style="width:200px"
          :placeholder="$t('tip.pleaseSelectARole')"
        >
          <Option
            v-for="item in roleDataList"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</Option>
        </Select>
      </div>
      <div class="header-right">
        <Button
          type="success"
          @click="saveRolePowerGroup"
          style="margin-right: 20px;"
        >{{$t('btn.preservation')}}</Button>
      </div>
    </div>

    <div class="rolePowerGroup-body">
      <Card style="width: 100%;padding: 10px;margin-bottom: 10px;">
        <div class="card-header">
          <b>{{$t('leftSidebar.powerGroup')}}</b>
          <Checkbox
            :indeterminate="indeterminate"
            :value="checkAll"
            @click.prevent.native="handleCheckAll"
          >{{$t('tip.selectionAll')}}</Checkbox>
        </div>
        <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
          <Checkbox
            style="width: 240px;"
            v-for="(item, i) in powerGroupList"
            :key="i"
            :label="item.name"
          ></Checkbox>
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
  name: "rolePowerGroup",
  data() {
    return {
      // 当前权限组权限关系
      currentRelationship: [],
      // 全选按钮样式状态
      indeterminate: false,
      // 全选按钮状态
      checkAll: false,
      // 复选框状态
      checkAllGroup: [],
      // 权限组类型列表
      powerGroupList: [],
      spinShow: false,
      roleDataList: [],
      roleId: null,
      pageIndex: 1,
      pageSize: 100,
      addPowerGroupIds: []
    };
  },
  created() {
    this.$Modal.remove();
    this.getRoleList();
    this.getPowerGroupList();
  },
  beforeDestroy() {
    this.currentRelationship = [];
    this.indeterminate = false;
    this.checkAll = false;
    this.checkAllGroup = [];
    this.powerGroupList = [];
    this.spinShow = false;
    this.roleDataList = [];
    this.roleId = null;
    this.pageIndex = 1;
    this.pageSize = 100;
    this.addPowerGroupIds = [];
  },
  methods: {
    addPowerGroupRoles() {
      let data = {
        role_id: this.roleId,
        power_group_ids: this.addPowerGroupIds
      };

      this.$api.auth_login
        .addPowerGroupRoles(data)
        .then(res => {
          if (res.data.code === 0) {
            this.$Message.success(this.$t("tip.saveSuccess"));
            this.spinShow = false;

            this.getRolePowerGroupList();
          }
        })
        .catch(error => {
          this.spinShow = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    saveRolePowerGroup() {
      let currentRelationship = this.currentRelationship,
        checkAllGroup = this.checkAllGroup,
        powerGroupList = this.powerGroupList,
        ids = [];

      for (let i = 0; i < powerGroupList.length; i++) {
        for (let j = 0; j < checkAllGroup.length; j++) {
          if (powerGroupList[i].name === checkAllGroup[j]) {
            ids.push(powerGroupList[i].id);
          }
        }
      }

      this.addPowerGroupIds = ids;

      if (this.roleId === null) {
        this.$Message.warning(this.$t("tip.pleaseSelectARole"));
        return;
      } else {
        this.addPowerGroupRoles();
      }
    },
    getRolePowerGroupList() {
      let data = {
        role_id: this.roleId,
        page_index: this.pageIndex,
        page_size: this.pageSize
      };

      this.$api.auth_login
        .getPowerGroupRolesList(data)
        .then(res => {
          if (res.data.code === 0) {
            this.indeterminate = false;
            this.checkAllGroup = [];
            this.currentRelationship = [];
            let list = res.data.data.data_info;
            this.currentRelationship = list;

            if (list.length > 0) {
              for (let i = 0; i < list.length; i++) {
                for (let j = 0; j < this.powerGroupList.length; j++) {
                  if (
                    list[i].power_group_name === this.powerGroupList[j].name
                  ) {
                    this.checkAllGroup.push(list[i].power_group_name);
                  }
                }
              }

              if (this.checkAllGroup.length > 0) {
                this.indeterminate = true;
              }
            } else {
              this.$Message.warning(this.$t("tip.noConfiguration"));
            }
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    selectPowerGroup(value) {
      this.roleId = value;
      this.getRolePowerGroupList();
    },
    checkAllGroupChange(data) {
      let currentList = this.powerGroupList;
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
        let currentList = this.powerGroupList,
          list = [];

        for (let i = 0; i < currentList.length; i++) {
          list.push(currentList[i].name);
        }

        this.checkAllGroup = list;
      } else {
        this.checkAllGroup = [];
      }
    },
    getPowerGroupList() {
      let data = {
        page_index: 1,
        page_size: 100
      };

      this.$api.auth_login
        .getPowerGroupList(data)
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data.data_info;
            this.powerGroupList = list;

            this.spinShow = false;
          } else {
            this.spinShow = false;
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    getRoleList() {
      this.spinShow = true;
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
            } else {
              this.$Message.warning(this.$t("tip.noPermissionConfiguration"));
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
.rolePowerGroup-box {
  .single-page-container;
  padding: 20px;

  .rolePowerGroup-header {
    width: 100%;
    padding: 20px 0;
    margin-bottom: 20px;

    .header-left {
      float: left;
    }

    .header-right {
      float: right;
    }
  }
}

.rolePowerGroup-body {
  width: 100%;
  height: 90%;
  overflow-y: scroll;
  padding: 20px 0;

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