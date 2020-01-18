<!-- 角色权限配置 -->

<template>
  <div class="powerGroupPower-box">
    <div class="powerGroupPower-header">
      <div class="header-left">
        <Select
          v-model="selectType"
          @on-change="selectPowerGroup"
          style="width:200px"
          :placeholder="$t('tip.pleaseSelectARole')"
          filterable
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
          :loading="successLoading"
          type="success"
          style="margin-left: 50px;margin-right: 20px;"
          @click="savePowerGroupPower"
        >{{$t('btn.preservation')}}</Button>
      </div>
    </div>

    <div class="powerGroupPower-body">
      <Card
        style="width: 100%;padding: 10px;margin-bottom: 10px;"
        v-for="(value, name, index) in powerTypeList"
        :key="index"
      >
        <div class="card-header">
          <div>
            <b style="margin-right:10px;">【{{ setPowerTypeName(name) }}】</b>
            <b style="margin-right:10px;">
              {{ $t("tip.inTotal") }}
              <span style="color:#19be6b;">{{ powerTypeList[name].length }}</span>
              {{ $t("tip.number") }}
            </b>
            <b>
              {{ $t("tip.selected") }}
              <span style="color:#19be6b;">{{ checkAllGroup[name].length }}</span>
              {{ $t("tip.number") }}
            </b>
          </div>
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
            style="padding: 5px 0;width: 240px;text-align:center;"
            v-for="(item, i) in value"
            :key="i"
            :label="item.power_url"
          >
            <p style="overflow: hidden;display:flex;flex-direction:column;">
              <span>{{item.power_name}}</span>
              <span>（{{item.power_url}}）</span>
            </p>
          </Checkbox>
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
import rp from "../../../plugin/rolePower/index";

export default {
  name: "powerGroupPower",
  data() {
    return {
      searchData: {
        interface: null,
        menu: null
      },
      // 当前权限组权限关系
      currentRelationship: {
        interface: [],
        menu: [],
        product: []
      },
      // 全选按钮样式状态
      indeterminate: {
        interface: false,
        menu: false,
        product: false
      },
      // 全选按钮状态
      checkAll: {
        interface: false,
        menu: false,
        product: false
      },
      // 复选框状态
      checkAllGroup: {
        interface: [],
        menu: [],
        product: []
      },
      // 权限类型列表
      powerTypeList: {
        interface: [],
        menu: []
      },
      selectType: 0,
      type: 0,
      powerPageIndex: 1,
      powerPageSize: 1000,
      spinShow: false,
      roleDataList: [],
      roleId: null,
      pageIndex: 1,
      pageSize: 350,
      addroleIds: [],
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
  created() {
    this.$Modal.remove();
    this.getRoleList();
    this.getPowerList();
  },
  beforeDestroy() {
    this.searchData = {
      interface: null,
      menu: null
    };
    this.currentRelationship = {
      interface: [],
      menu: [],
      product: []
    };
    this.indeterminate = {
      interface: false,
      menu: false,
      product: false
    };
    this.checkAll = {
      interface: false,
      menu: false,
      product: false
    };
    this.checkAllGroup = {
      interface: [],
      menu: [],
      product: []
    };
    this.powerTypeList = {
      interface: [],
      menu: []
    };
    this.selectType = 0;
    this.type = 0;
    this.powerPageIndex = 1;
    this.powerPageSize = 350;
    this.spinShow = false;
    this.roleDataList = [];
    this.roleId = null;
    this.pageIndex = 1;
    this.pageSize = 350;
    this.addroleIds = [];
    this.successLoading = false;
  },
  methods: {
    addRolePowers() {
      this.successLoading = true;
      let data = {
        role_id: this.roleId,
        power_ids: this.addroleIds
      };

      this.$api.auth_login
        .addRolePowers(data)
        .then(res => {
          if (res.data.code === 0) {
            this.spinShow = false;
            this.$Message.success(this.$t("tip.saveSuccess"));

            this.getpowerGroupPowerList();
          }
          this.successLoading = false;
        })
        .catch(error => {
          this.spinShow = false;
          this.successLoading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    savePowerGroupPower() {
      if (this.roleId === null) {
        this.$Message.warning(this.$t("tip.pleaseSelectARole"));
        return;
      }
      let currentRelationship = this.currentRelationship,
        checkAllGroup = this.checkAllGroup,
        powerTypeList = this.powerTypeList,
        ids = [];

      // console.log(currentRelationship, "<------------ 当前关系");
      // console.log(checkAllGroup, "<------------ 当前选中");
      // console.log(powerTypeList, "<------------ 权限");

      for (let key in powerTypeList) {
        let list = powerTypeList[key],
          checkList = checkAllGroup[key];
        for (let j = 0; j < checkList.length; j++) {
          for (let i = 0; i < list.length; i++) {
            if (list[i].power_url === checkList[j]) {
              ids.push(list[i].id);
            }
          }
        }
      }

      this.addroleIds = [];
      this.addroleIds = [...new Set(ids)];

      this.addRolePowers();
    },
    getpowerGroupPowerList() {
      this.spinShow = true;
      let data = {
        role_id: this.roleId,
        page_index: this.pageIndex,
        page_size: this.pageSize
      };

      this.$api.auth_login
        .getRolePower(data)
        .then(res => {
          if (res.data.code === 0) {
            this.checkAllGroup = {
              interface: [],
              menu: [],
              product: []
            };
            this.currentRelationship = {
              interface: [],
              menu: [],
              product: []
            };
            this.indeterminate = {
              interface: false,
              menu: false,
              product: false
            };

            let list = res.data.data.data_info,
              interfaceType = [],
              menuType = [],
              existingInterfaceTypeData = this.powerTypeList.interface,
              existingMenuTypeData = this.powerTypeList.menu;

            if (list.length === 0) {
              this.$Message.warning(this.$t("tip.noConfiguration"));
              this.spinShow = false;
              return;
            } else {
              for (let i = 0; i < list.length; i++) {
                switch (list[i].type) {
                  case 1:
                    interfaceType.push(list[i]);
                    break;
                  case 2:
                    menuType.push(list[i]);
                    break;
                }
              }

              for (let j = 0; j < existingInterfaceTypeData.length; j++) {
                for (let k = 0; k < interfaceType.length; k++) {
                  if (
                    interfaceType[k].power_url ===
                    existingInterfaceTypeData[j].power_url
                  ) {
                    this.checkAllGroup.interface.push(
                      existingInterfaceTypeData[j].power_url
                    );
                  }
                }
              }

              for (let z = 0; z < existingMenuTypeData.length; z++) {
                for (let c = 0; c < menuType.length; c++) {
                  if (
                    menuType[c].power_url === existingMenuTypeData[z].power_url
                  ) {
                    this.checkAllGroup.menu.push(
                      existingMenuTypeData[z].power_url
                    );
                  }
                }
              }

              if (this.checkAllGroup.interface.length > 0) {
                this.indeterminate["interface"] = true;
              }
              if (this.checkAllGroup.menu.length > 0) {
                this.indeterminate["menu"] = true;
              }

              this.checkAllGroup.interface = [
                ...new Set(this.checkAllGroup.interface)
              ];
              this.checkAllGroup.menu = [...new Set(this.checkAllGroup.menu)];

              this.currentRelationship.interface = interfaceType;
              this.currentRelationship.menu = menuType;
            }

            this.spinShow = false;
          }
        })
        .catch(error => {
          this.spinShow = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    selectPowerGroup(value) {
      this.roleId = value;
      this.getpowerGroupPowerList();
    },
    setPowerTypeName(name) {
      switch (name) {
        case "interface":
          return "接口";
          break;
        case "menu":
          return "菜单";
          break;
        case "product":
          return "产品";
          break;
        case "equipment":
          return "设备";
          break;
      }
    },
    checkAllGroupChange(data, name) {
      // console.log(data, name, " <------------ 单选 ");
      let currentList = this.powerTypeList[name];

      switch (name) {
        case "interface":
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
        case "menu":
          let configure = JSON.parse(JSON.stringify(rp)),
            allInterface = [];

          if (data.length === 0) {
            this.checkAllGroup.interface = [];
          } else {
            for (let i = 0; i < data.length; i++) {
              for (let j = 0; j < configure.length; j++) {
                if (data[i] === configure[j].name) {
                  allInterface = [...allInterface, ...configure[j].interface];
                }
              }
            }

            this.checkAllGroup.interface = [...new Set(allInterface)];
          }

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
        case "interface":
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
              list.push(currentList[i].power_url);
            }

            this.checkAllGroup[name] = [...new Set(list)];
          } else {
            this.checkAllGroup[name] = [];
          }

          break;
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
              list.push(currentList[i].power_url);
            }

            this.checkAllGroup[name] = [...new Set(list)];
          } else {
            this.checkAllGroup[name] = [];
          }
          break;
      }
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
              interface: [],
              menu: []
            };

            for (let i = 0; i < list.length; i++) {
              switch (list[i].type) {
                case 1:
                  this.powerTypeList.interface.push(list[i]);
                  break;
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
  }
};
</script>

<style lang="less" scoped>
.powerGroupPower-box {
  .single-page-container;

  .powerGroupPower-header {
    .header;

    .header-left {
      float: left;
    }

    .header-right {
      float: right;
    }
  }

  .powerGroupPower-body {
    .body;
    display: flex;
    flex-direction: column-reverse;
    justify-content: flex-start;
    align-items: flex-start;

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
}

.spin-box {
  .global-spin;
}
</style>