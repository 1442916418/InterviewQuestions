<!-- 产品线数据类型 -->

<template>
  <div class="productLineDataType-box">
    <div class="productLineDataType-header">
      <div class="header-left">
        <Select
          v-model="modelProduct"
          style="width:200px"
          @on-change="selectProduct"
          :placeholder="$t('tip.pleaseSelectAProductLine')"
        >
          <Option
            v-for="item in getProductList"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</Option>
        </Select>
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

    <div class="productLineDataType-body">
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
            :label="item.data_name"
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
  name: "productLineDataType",
  data() {
    return {
      modelProduct: "",
      // 当前权限组权限关系
      currentRelationship: {
        type: []
      },
      // 全选按钮样式状态
      indeterminate: {
        type: false
      },
      // 全选按钮状态
      checkAll: {
        type: false
      },
      // 复选框状态
      checkAllGroup: {
        type: []
      },
      // 权限类型列表
      powerTypeList: {
        type: []
      },
      selectType: 4,
      type: 0,
      powerPageIndex: 1,
      powerPageSize: 300,
      spinShow: false,
      getProductList: [],
      userId: null,
      pageIndex: 1,
      pageSize: 200,
      adduserIds: [],
      loading: false
    };
  },
  created() {
    this.$Modal.remove();
    this.getProductData();
    this.getDataTypeList();
  },
  beforeDestroy() {
    this.modelProduct = "";
    this.currentRelationship = {
      type: []
    };
    this.indeterminate = {
      type: false
    };
    this.checkAll = {
      type: false
    };
    this.checkAllGroup = {
      type: []
    };
    this.powerTypeList = {
      type: []
    };
    this.selectType = 4;
    this.type = 0;
    this.powerPageIndex = 1;
    this.powerPageSize = 300;
    this.spinShow = false;
    this.getProductList = [];
    this.userId = null;
    this.pageIndex = 1;
    this.pageSize = 200;
    this.adduserIds = [];
    this.loading = false;
  },
  methods: {
    addProductAndDataType() {
      this.loading = true;
      let data = {
        product_id: this.modelProduct,
        data_type_ids: this.adduserIds
      };

      this.$api.monitor1
        .addProductAndDataType(data)
        .then(res => {
          if (res.data.code === 0) {
            this.spinShow = false;
            this.$Message.success(this.$t("tip.saveSuccess"));

            this.getProductAndDataType();
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
            if (list[i].data_name === checkList[j]) {
              ids.push(list[i].id);
            }
          }
        }
      }

      this.adduserIds = [...new Set(ids)];

      if (this.modelProduct === null || this.modelProduct === "") {
        this.$Message.warning(this.$t("tip.pleaseSelectAProductLine"));
        return;
      } else {
        this.addProductAndDataType();
      }
    },
    getProductAndDataType() {
      let data = {
        product_id: this.modelProduct
      };

      this.$api.monitor1
        .getProductAndDataType(data)
        .then(res => {
          if (res.data.code === 0) {
            this.checkAllGroup.type = [];
            this.currentRelationship.type = [];
            this.indeterminate.type = false;
            let list = res.data.data,
              userType = [],
              existingMenuTypeData = this.powerTypeList.type;

            if (list.length === 0) {
              this.$Message.warning(this.$t("tip.noConfiguration"));
              this.spinShow = false;
              return;
            } else {
              userType = list;

              for (let k = 0; k < userType.length; k++) {
                for (let j = 0; j < existingMenuTypeData.length; j++) {
                  if (userType[k].cn === existingMenuTypeData[j].cn) {
                    this.checkAllGroup.type.push(
                      existingMenuTypeData[j].data_name
                    );
                  }
                }
              }

              if (this.checkAllGroup.type.length > 0) {
                this.indeterminate["type"] = true;
              }

              this.currentRelationship.type = userType;
            }
            this.spinShow = false;
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    selectProduct(val) {
      this.modelProduct = val;
      this.getProductAndDataType();
    },
    setPowerTypeName(name) {
      switch (name) {
        case "type":
          return "数据类型";
          break;
      }
    },
    checkAllGroupChange(data, name) {
      let currentList = this.powerTypeList[name];

      switch (name) {
        case "type":
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
        this.checkAllGroup[name] = [];

        for (let i = 0; i < currentList.length; i++) {
          list.push(currentList[i].data_name);
        }

        this.checkAllGroup[name] = list;
      } else {
        this.checkAllGroup[name] = [];
      }
    },
    getProductData() {
      let data = {
        page_index: 1,
        page_size: 100
      };

      this.$api.monitor1
        .getProductData(data)
        .then(res => {
          if (res.data.code === 0) {
            this.getProductList = [];
            this.getProductList = res.data.data.data_info;
            for (let i = 0; i < this.getProductList.length; i++) {
              this.getProductList[i].label = this.getProductList[i].name;
              this.getProductList[i].value = this.getProductList[i].id;
            }
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    getDataTypeList() {
      this.spinShow = true;
      let data = {
        page_index: this.powerPageIndex,
        page_size: this.powerPageSize
      };

      this.$api.monitor1
        .getDataTypeList(data)
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data.data_info;
            this.powerTypeList = {
              type: []
            };

            for (let i = 0; i < list.length; i++) {
              this.powerTypeList.type.push(list[i]);
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
.productLineDataType-box {
  .single-page-container;

  .productLineDataType-header {
    .header;

    .header-left {
      float: left;
    }

    .header-right {
      float: right;
    }
  }
}

.productLineDataType-body {
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