<!-- 菜单权限 -->

<template>
  <div class="menuPower-box">
    <div class="menuPower-header">
      <div class="header-left">
        <Select
          @on-change="selectPowerGroup"
          style="width:200px"
          :placeholder="$t('tip.pleaseSelectTheMenu')"
          filterable
        >
          <Option v-for="item in menuList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>

      <div class="header-right">
        <Button
          :loading="successLoading"
          type="success"
          @click="savePowerGroupPower"
          style="margin-left: 50px;margin-right: 20px;"
        >{{$t('btn.preservation')}}</Button>
      </div>
    </div>

    <div class="menuPower-body">
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
          <Checkbox
            style="width: 240px;"
            v-for="(item, i) in value"
            :key="i"
            :label="item.power_name"
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
  name: "menuPower",
  data() {
    return {
      // 当前权限组权限关系
      currentRelationship: {
        menu: []
      },
      // 全选按钮样式状态
      indeterminate: {
        menu: false
      },
      // 全选按钮状态
      checkAll: {
        menu: false
      },
      // 复选框状态
      checkAllGroup: {
        menu: []
      },
      // 权限类型列表
      powerTypeList: {
        menu: []
      },

      selectType: 2,
      type: 0,
      powerPageIndex: 1,
      powerPageSize: 200,
      spinShow: false,
      menuList: [],
      menuId: null,
      pageIndex: 1,
      pageSize: 200,
      addmenuIds: [],
      successLoading: false,
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
  beforeDestroy() {
    this.currentRelationship = {
      menu: []
    };
    this.indeterminate = {
      menu: false
    };
    this.checkAll = {
      menu: false
    };
    this.checkAllGroup = {
      menu: []
    };
    this.powerTypeList = {
      menu: []
    };
    this.selectType = 2;
    this.type = 0;
    this.powerPageIndex = 1;
    this.powerPageSize = 200;
    this.spinShow = false;
    this.menuList = [];
    this.menuId = null;
    this.pageIndex = 1;
    this.pageSize = 200;
    this.addmenuIds = [];
    this.successLoading = false;
  },
  methods: {
    addmenuPowers() {
      this.successLoading = true;
      let data = {
        menu_id: this.menuId,
        power_ids: this.addmenuIds
      };

      this.$api.auth_login
        .addMenuPowers(data)
        .then(res => {
          if (res.data.code === 0) {
            this.$Message.success(this.$t("tip.saveSuccess"));

            this.getmenuPowerList();
          }
          this.successLoading = false;
        })
        .catch(error => {
          this.successLoading = false;
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
            if (list[i].power_name === checkList[j]) {
              ids.push(list[i].id);
            }
          }
        }
      }

      this.addmenuIds = [...new Set(ids)];;

      if (this.menuId === null) {
        this.$Message.warning(this.$t("tip.pleaseSelectPermissionGroup"));
        return;
      } else {
        this.addmenuPowers();
      }
    },
    getmenuPowerList() {
      let data = {
        menu_id: this.menuId,
        page_index: this.pageIndex,
        page_size: this.pageSize
      };

      this.$api.auth_login
        .getMenuPower(data)
        .then(res => {
          if (res.data.code === 0) {
            this.checkAllGroup.menu = [];
            this.currentRelationship.menu = [];
            this.indeterminate.menu = false;
            let list = res.data.data.data_info,
              menuType = [],
              existingMenuTypeData = this.powerTypeList.menu;

            if (list.length === 0) {
              this.$Message.warning(this.$t("tip.noConfiguration"));
              this.spinShow = false;
              return;
            } else {
              // 分类
              for (let i = 0; i < list.length; i++) {
                switch (list[i].type) {
                  case 2:
                    menuType.push(list[i]);
                    break;
                }
              }

              // 菜单
              for (let j = 0; j < existingMenuTypeData.length; j++) {
                for (let k = 0; k < menuType.length; k++) {
                  if (
                    menuType[k].power_name ===
                    existingMenuTypeData[j].power_name
                  ) {
                    this.checkAllGroup.menu.push(
                      existingMenuTypeData[j].power_name
                    );
                  }
                }
              }

              if (this.checkAllGroup.menu.length > 0) {
                this.indeterminate["menu"] = true;
              }

              this.currentRelationship.menu = menuType;
            }
            this.spinShow = false;
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    selectPowerGroup(value) {
      this.menuId = value;
      this.getmenuPowerList();
    },
    setPowerTypeName(name) {
      switch (name) {
        case "menu":
          return "菜单";
          break;
      }
    },
    checkAllGroupChange(data, name) {
      let currentList = this.powerTypeList[name];

      switch (name) {
        case "menu":
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
      switch (name) {
        case "menu":
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
              list.push(currentList[i].power_name);
            }

            this.checkAllGroup[name] = list;
          } else {
            this.checkAllGroup[name] = [];
          }
          break;
      }
    },
    getMenuList() {
      let data = {
        page_index: 1,
        page_size: 100
      };

      this.$api.auth_login
        .getMenuList(data)
        .then(res => {
          if (res.data.code === 0) {
            this.menuList = [];
            this.menuList = res.data.data.data_info;
            for (let i = 0; i < this.menuList.length; i++) {
              this.menuList[i].label = this.menuList[i].name;
              this.menuList[i].value = this.menuList[i].id;
            }
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    getPowerList() {
      this.spinShow = true;
      let data = {
        type: this.selectType,
        page_index: this.powerPageIndex,
        page_size: this.powerPageSize
      };

      this.$api.auth_login
        .getPowerList(data)
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data.data_info;
            this.powerTypeList = {
              menu: []
            };

            for (let i = 0; i < list.length; i++) {
              switch (list[i].type) {
                case 2:
                  this.powerTypeList.menu.push(list[i]);
                  break;
              }
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
  },
  created() {
    this.$Modal.remove();
    this.getMenuList();
    this.getPowerList();
  }
};
</script>

<style lang="less" scoped>
.menuPower-box {
  .single-page-container;

  .menuPower-header {
    .header;

    .header-left {
      float: left;
    }

    .header-right {
      float: right;
    }
  }
}

.menuPower-body {
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