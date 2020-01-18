<!-- 学习中心管理人员 -->

<template>
  <div class="learningCenterManageMentPersonnel-box">
    <div class="learningCenterManageMentPersonnel-header">
      <div class="header-left">
        <ButtonGroup>
          <Button type="primary" @click="() => isAddData = !isAddData">
            <Icon type="md-add" size="15" style="margin-top:-3px;" />
            {{$t('btn.newlyAdded')}}
          </Button>
          <Button type="error" @click="deleteUser">
            {{$t("btn.batchDeletion")}}
            <Icon type="ios-trash" size="15" style="margin-top:-3px;" />
          </Button>
        </ButtonGroup>
      </div>
      <div class="header-right"></div>
    </div>

    <div class="learningCenterManageMentPersonnel-body">
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

    <Modal v-model="isAddData" :title="$t('btn.newlyAdded')">
      <div class="addData-box">
        <div class="item">
          <p>{{$t("tip.pleaseSelectUsers")}}</p>
          <Select v-model="addData.user_id" :placeholder="$t('tip.pleaseSelectUsers')">
            <Option
              v-for="item in userData"
              :value="item.id"
              :key="item.id"
              :label="item.real_name"
            ></Option>
          </Select>
        </div>
        <div class="item-btn">
          <Button
            long
            type="primary"
            style="margin-bottom:10px;"
            @click="addDataSubmit"
          >{{$t('btn.determine')}}</Button>
          <Button @click="addDataCancel" long>{{ $t('tip.cancel') }}</Button>
        </div>
      </div>
    </Modal>

    <Modal v-model="isEditData" :title="$t('btn.newlyAdded')">
      <div class="addData-box">
        <div class="item">
          <p>{{$t("tip.pleaseSelectUsers")}}</p>
          <Select v-model="editData.user_id" :placeholder="$t('tip.pleaseSelectUsers')">
            <Option
              v-for="item in userData"
              :value="item.id"
              :key="item.id"
              :label="item.real_name"
            ></Option>
          </Select>
        </div>
        <div class="item-btn">
          <Button
            long
            type="primary"
            style="margin-bottom:10px;"
            @click="editDataSubmit"
          >{{$t('btn.determine')}}</Button>
          <Button @click="editDataCancel" long>{{ $t('tip.cancel') }}</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageSizes: this.$glb.tableDefaultPageSizes,
      columnsList: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "序号",
          type: "index",
          minWidth: 50,
          align: "center"
        },
        {
          title: "名称",
          align: "center",
          render: (h, params) => {
            let id = params.row.user_id,
              all = this.userData,
              t = null;
            for (let i = 0; i < all.length; i++) {
              if (id === all[i].id) {
                t = all[i].real_name;
              }
            }
            return h("span", t);
          }
        },
        {
          title: "操作",
          align: "center",
          key: "handle",
          minWidth: 200,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "info",
                    ghost: true
                  },
                  style: {
                    marginRight: "10px"
                  },
                  on: {
                    click: () => {
                      this.editData = {
                        id: params.row._id,
                        user_id: params.row.user_id
                      };
                      this.isEditData = true;
                    }
                  }
                },
                this.$t("tip.edit")
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error"
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: this.$t("tip.confirmationDelete"),
                        render: h => {
                          return h("div", [
                            h(
                              "div",
                              {
                                slot: "footer",
                                style: {
                                  width: "100%",
                                  height: "55px",
                                  lineHeight: "55px",
                                  paddingTop: "10px",
                                  paddingBottom: "10px"
                                }
                              },
                              [
                                h(
                                  "Button",
                                  {
                                    props: {
                                      type: "primary"
                                    },
                                    style: {
                                      float: "right",
                                      "margin-top": "10px",
                                      "margin-bottom": "10px"
                                    },
                                    on: {
                                      click: () => {
                                        this.deleteData(params.row._id);
                                      }
                                    }
                                  },

                                  this.$t("tip.determine")
                                ),
                                h(
                                  "Button",
                                  {
                                    props: {
                                      type: "text"
                                    },
                                    style: {
                                      float: "right",
                                      "margin-top": "10px",
                                      "margin-bottom": "10px"
                                    },
                                    on: {
                                      click: () => {
                                        this.$Modal.remove();
                                      }
                                    }
                                  },
                                  this.$t("tip.cancel")
                                )
                              ]
                            )
                          ]);
                        }
                      });
                    }
                  }
                },
                this.$t("btn.delete")
              )
            ]);
          }
        }
      ],
      loading: false,
      dataList: [],
      cloneDataList: [],
      queryUserData: {
        real_name: "",
        mobile: "",
        role_id: -2,
        department_id: -2,
        page_index: 1,
        page_size: 500
      },
      isAddData: false,
      isEditData: false,
      userData: [],
      managerUserData: [],
      addData: {
        user_id: null
      },
      editData: {
        id: null,
        user_id: null
      },
      selectData: [],
      queryData: {
        page_index: 1,
        page_size: 10,
        count: 0
      }
    };
  },
  created() {
    this.getUserOther();
    this.getManagerUser();
  },
  methods: {
    handleSizeChange(val) {
      this.queryData.page_index = 1;
      this.queryData.page_size = val;
      this.getManagerUser();
    },
    handleIndexChange(val) {
      this.queryData.page_index = val;
      this.getManagerUser();
    },
    deleteUser() {
      if (this.selectData.length === 0) {
        this.$Message.warning(
          `${this.$t("tip.pleaseSelect")}${this.$t("tip.data")}`
        );
        return;
      }

      let ids = [],
        all = this.selectData;
      for (let i = 0; i < all.length; i++) {
        ids.push(all[i]._id);
      }

      this.$Modal.confirm({
        title: this.$t("tip.confirmationDelete"),
        render: h => {
          return h("div", [
            h(
              "div",
              {
                slot: "footer",
                style: {
                  width: "100%",
                  height: "55px",
                  lineHeight: "55px",
                  paddingTop: "10px",
                  paddingBottom: "10px"
                }
              },
              [
                h(
                  "Button",
                  {
                    props: {
                      type: "primary"
                    },
                    style: {
                      float: "right",
                      "margin-top": "10px",
                      "margin-bottom": "10px"
                    },
                    on: {
                      click: () => {
                        this.deleteData(ids);
                      }
                    }
                  },

                  this.$t("tip.determine")
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "text"
                    },
                    style: {
                      float: "right",
                      "margin-top": "10px",
                      "margin-bottom": "10px"
                    },
                    on: {
                      click: () => {
                        this.$Modal.remove();
                      }
                    }
                  },
                  this.$t("tip.cancel")
                )
              ]
            )
          ]);
        }
      });
    },
    onSelectAll(selection) {
      this.selectData = [];
      this.selectData = selection;
    },
    deleteData(id) {
      this.loading = true;
      let ids = [];

      if (typeof id === "string") {
        ids.push(id);
      } else {
        ids = id;
      }

      this.$api.learning
        .deleteManagerUser({
          _ids: ids
        })
        .then(res => {
          if (res.data.code === 0) {
            this.$Modal.remove();
            this.loading = false;
            this.$Message.success(this.$t("tip.deleteSuccess"));

            this.getManagerUser();
          }
          this.loading = false;
        })
        .catch(error => {
          this.$Modal.remove();
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    editDataCancel() {
      this.isEditData = false;
      this.editData = {
        id: null,
        user_id: null
      };
    },
    editDataSubmit() {
      this.loading = true;
      this.$api.learning
        .editManagerUser({
          id: this.editData.id,
          user_id: this.editData.user_id
        })
        .then(res => {
          if (res.data.code === 0) {
            this.loading = false;
            this.isEditData = false;
            this.$Message.success(this.$t("tip.editSuccess"));
            this.getManagerUser();
          }
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    addDataCancel() {
      this.isAddData = false;
      this.addData = {
        user_id: null
      };
    },
    addDataSubmit() {
      if (!this.$RegExp.verifyIsNull(this.addData.user_id)) {
        this.$Message.warning(this.$t("tip.pleaseSelectUsers"));
        return;
      }

      this.$api.learning
        .addManagerUser({
          user_id: this.addData.user_id
        })
        .then(res => {
          if (res.data.code === 0) {
            this.addDataCancel();
            this.$Message.success(this.$t("tip.addSuccess"));

            this.getManagerUser();
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    getManagerUser() {
      this.loading = true;
      this.$api.learning
        .getManagerUser({
          page_index: this.queryData.page_index,
          page_size: this.queryData.page_size
        })
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data;
            this.dataList = list.data_info;
            this.queryData.count = list.page_count;
            this.loading = false;
          }
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    getUserOther() {
      let q = this.queryUserData;
      let d = {
        real_name: q.real_name,
        mobile: q.mobile,
        role_id: q.role_id,
        department_id: q.department_id,
        page_index: q.page_index,
        page_size: q.page_size
      };

      this.$api.auth_login
        .getUserOther(d)
        .then(res => {
          if (res.data.code === 0) {
            this.userData = res.data.data.data_info;
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
.learningCenterManageMentPersonnel-box {
  .single-page-container;

  .learningCenterManageMentPersonnel-header {
    .header;

    .header-left {
      float: left;
    }

    .header-right {
      float: right;
      display: flex;
    }
  }

  .learningCenterManageMentPersonnel-body {
    .body;

    .page {
      text-align: center;
    }
  }
}

.addData-box {
  .item {
    padding: 5px;

    p {
      font-size: 14px;
      padding-bottom: 10px;
    }
  }

  .item-btn {
    padding: 20px 5px;
  }
}
</style>