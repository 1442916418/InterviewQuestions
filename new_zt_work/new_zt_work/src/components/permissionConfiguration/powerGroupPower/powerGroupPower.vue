<!-- 权限组权限 -->

<template>
  <div class="powerGroupPower-box">
    <div class="powerGroupPower-header">
      <div class="header-left">
        <Select
          v-model="selectType"
          @on-change="selectPowerGroup"
          style="width:200px"
         :placeholder="$t('tip.pleaseSelectPermissionGroup')"
        >
          <Option
            v-for="item in powerGroupList"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</Option>
        </Select>
      </div>

      <div class="header-right">
        <Button
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
  name: "powerGroupPower",
  data() {
    return {
      // 当前权限组权限关系
      currentRelationship: {
        interface: [],
        menu: [],
        product: [],
        equipment: []
      },
      // 全选按钮样式状态
      indeterminate: {
        interface: false,
        menu: false,
        product: false,
        equipment: false
      },
      // 全选按钮状态
      checkAll: {
        interface: false,
        menu: false,
        product: false,
        equipment: false
      },
      // 复选框状态
      checkAllGroup: {
        interface: [],
        menu: [],
        product: [],
        equipment: []
      },
      // 权限类型列表
      powerTypeList: {
        interface: [],
        menu: [],
        product: [],
        equipment: []
      },
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
      ],
      selectType: 0,
      type: 0,
      powerPageIndex: 1,
      powerPageSize: 350,
      spinShow: false,
      powerGroupList: [],
      powerGroupId: null,
      pageIndex: 1,
      pageSize: 350,
      addPowerGroupIds: [],
    };
  },
  methods: {
    // 新增角色权限组关系
    addPowerGroupPowers() {
      let data = {
        power_group_id: this.powerGroupId,
        power_ids: this.addPowerGroupIds
      };

      this.$api.auth_login
        .addPowerGroupPower(data)
        .then(res => {
          if (res.data.code === 0) {
            this.spinShow = false;
            this.$Message.success(this.$t('tip.saveSuccess'));

            this.getpowerGroupPowerList();
          }
        })
        .catch(error => {
          this.spinShow = false;
          this.$Message.error(this.$t('tip.requestError'));
        });
    },
    // 保存
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

      this.addPowerGroupIds = ids;

      if (this.powerGroupId === null) {
        this.$Message.warning(this.$t('tip.pleaseSelectPermissionGroup'));
        return;
      } else {
        this.addPowerGroupPowers();
      }
    },
    // 获取权限组权限关系列表
    getpowerGroupPowerList() {
      this.spinShow = true;
      let data = {
        power_group_id: this.powerGroupId,
        page_index: this.pageIndex,
        page_size: this.pageSize
      };

      this.$api.auth_login
        .getPowerGroupPowerList(data)
        .then(res => {
          if (res.data.code === 0) {
            this.checkAllGroup = {
              interface: [],
              menu: [],
              product: [],
              equipment: []
            };
            this.currentRelationship = {
              interface: [],
              menu: [],
              product: [],
              equipment: []
            };
            this.indeterminate = {
              interface: false,
              menu: false,
              product: false,
              equipment: false
            };

            let list = res.data.data.data_info,
              interfaceType = [],
              menuType = [],
              productType = [],
              equipmentType = [],
              existingInterfaceTypeData = this.powerTypeList.interface,
              existingMenuTypeData = this.powerTypeList.menu,
              existingProductTypeData = this.powerTypeList.product,
              existingEquipmentTypeData = this.powerTypeList.equipment;

            if (list.length === 0) {
              this.$Message.warning(this.$t('tip.noConfiguration'));
              this.spinShow = false;
              return;
            } else {
              // 分类
              for (let i = 0; i < list.length; i++) {
                switch (list[i].type) {
                  case 1:
                    interfaceType.push(list[i]);
                    break;
                  case 2:
                    menuType.push(list[i]);
                    break;
                  case 3:
                    productType.push(list[i]);
                    break;
                  case 4:
                    equipmentType.push(list[i]);
                    break;
                }
              }

              // 接口
              for (let j = 0; j < existingInterfaceTypeData.length; j++) {
                for (let k = 0; k < interfaceType.length; k++) {
                  if (
                    interfaceType[k].power_name ===
                    existingInterfaceTypeData[j].power_name
                  ) {
                    this.checkAllGroup.interface.push(
                      existingInterfaceTypeData[j].power_name
                    );
                  }
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

              // 产品
              for (let j = 0; j < existingProductTypeData.length; j++) {
                for (let k = 0; k < productType.length; k++) {
                  if (
                    productType[k].power_name ===
                    existingProductTypeData[j].power_name
                  ) {
                    this.checkAllGroup.product.push(
                      existingProductTypeData[j].power_name
                    );
                  }
                }
              }

              // 设备
              for (let j = 0; j < existingEquipmentTypeData.length; j++) {
                for (let k = 0; k < equipmentType.length; k++) {
                  if (
                    equipmentType[k].power_name ===
                    existingEquipmentTypeData[j].power_name
                  ) {
                    this.checkAllGroup.equipment.push(
                      existingEquipmentTypeData[j].power_name
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
              if (this.checkAllGroup.product.length > 0) {
                this.indeterminate["product"] = true;
              }
              if (this.checkAllGroup.equipment.length > 0) {
                this.indeterminate["equipment"] = true;
              }

              this.currentRelationship.interface = interfaceType;
              this.currentRelationship.menu = menuType;
              this.currentRelationship.product = productType;
              this.currentRelationship.equipment = equipmentType;
            }

            this.spinShow = false;
          }
        })
        .catch(error => {
          this.spinShow = false;
          this.$Message.error(this.$t('tip.requestError'));
        });
    },
    // 选择权限组
    selectPowerGroup(value) {
      this.powerGroupId = value;
      this.getpowerGroupPowerList();
    },
    // 设置权限分类名称
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
    // 单项复选框
    checkAllGroupChange(data, name) {
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
        case "product":
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
        case "equipment":
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
    // 全选按钮
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
              list.push(currentList[i].power_name);
            }

            this.checkAllGroup[name] = list;
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
              list.push(currentList[i].power_name);
            }

            this.checkAllGroup[name] = list;
          } else {
            this.checkAllGroup[name] = [];
          }
          break;
        case "product":
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
        case "equipment":
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
    // 获取权限组列表
    getPowerGroupList() {
      let data = {
        page_index: 1,
        page_size: 100
      };

      this.$api.auth_login
        .getPowerGroupList(data)
        .then(res => {
          if (res.data.code === 0) {
            this.powerGroupList = [];
            this.powerGroupList = res.data.data.data_info;
            for (let i = 0; i < this.powerGroupList.length; i++) {
              this.powerGroupList[i].label = this.powerGroupList[i].name;
              this.powerGroupList[i].value = this.powerGroupList[i].id;
            }
          }
        })
        .catch(error => {
          this.$Message.error(this.$t('tip.requestError'));
        });
    },
    // 获取权限列表
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
              menu: [],
              product: [],
              equipment: []
            };

            for (let i = 0; i < list.length; i++) {
              switch (list[i].type) {
                case 1:
                  this.powerTypeList.interface.push(list[i]);
                  break;
                case 2:
                  this.powerTypeList.menu.push(list[i]);
                  break;
                case 3:
                  this.powerTypeList.product.push(list[i]);
                  break;
                case 4:
                  this.powerTypeList.equipment.push(list[i]);
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
          this.$Message.error(this.$t('tip.requestError'));
        });
    }
  },
  created() {
    this.$Modal.remove();
    this.getPowerGroupList();
    this.getPowerList();
  }
};
</script>

<style lang="less" scoped>
.powerGroupPower-box {
  .single-page-container;
  padding: 20px;

  .powerGroupPower-header {
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

  .powerGroupPower-body {
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
}

.spin-box {
  .global-spin;
}
</style>