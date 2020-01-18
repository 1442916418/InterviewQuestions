<!-- 用户 -->

<template>
  <div class="user-list" style="position: relative;">
    <div class="table-header">
      <div class="header-left">
        <Button type="info" icon="md-add" @click="addUser">{{$t('btn.newlyAdded')}}</Button>
      </div>
      <div class="header-right">
        <Button
          type="primary"
          icon="ios-search"
          @click="() => isShowRightDrawer = !isShowRightDrawer"
        >{{$t('tip.screening')}}</Button>
      </div>
    </div>

    <div class="table-body">
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
      <div class="search-box">
        <div class="item">
          <p>{{$t("tip.pleaseEnterTheUserIsRealName")}}</p>
          <Input
            v-model="queryData.real_name"
            :placeholder="$t('tip.pleaseEnterTheUserIsRealName')"
            clearable
            @keyup.enter.native="handleSubmitRealName"
          />
        </div>
        <div class="item">
          <p>{{$t("tip.pleaseEnterYourMobileNumber")}}</p>
          <Input
            v-model="queryData.mobile"
            :placeholder="$t('tip.pleaseEnterYourMobileNumber')"
            clearable
            @keyup.enter.native="handleSubmitRealName"
          />
        </div>
        <div class="item">
          <p>{{$t("tip.pleaseSelectTheRole")}}</p>
          <Select v-model="queryData.role_id" :placeholder="$t('tip.pleaseSelectTheRole')">
            <Option
              v-for="item in addRoleId"
              :value="item.id"
              :key="item.id"
              :label="item.role_name"
            ></Option>
          </Select>
        </div>
        <div class="item">
          <p>{{ `${$t("tip.pleaseSelect")}${$t("tip.departmentName")}` }}</p>
          <Select
            v-model="queryData.department_id"
            :placeholder="$t('tip.pleaseSelect') + $t('tip.departmentName')"
          >
            <Option
              v-for="item in departmentData"
              :value="item.id"
              :key="item.id"
              :label="item.name"
            ></Option>
          </Select>
        </div>
        <div class="bottom-btn">
          <Button
            type="primary"
            icon="ios-search"
            style="margin-bottom:10px;"
            @click="searchData"
            long
          >{{$t('btn.search')}}</Button>
          <Button
            type="warning"
            style="margin-bottom:10px;"
            @click="resetData"
            long
          >{{$t('btn.reset')}}</Button>
          <Button long @click="() => isShowRightDrawer = !isShowRightDrawer">{{$t('btn.cancel')}}</Button>
        </div>
      </div>
    </Drawer>
  </div>
</template>

<script>

let editButton = function(vm, h, currentRow, index) {
  return h(
    "Button",
    {
      props: {
        size: "small",
        type: currentRow.editting ? "success" : "primary"
      },
      style: {
        margin: "0 5px"
      },
      on: {
        click: function() {
          let tempData = vm.handleBackdata(currentRow);

          if (!currentRow.editting) {
            currentRow.editting = true;
          } else {
            vm.$Modal.confirm({
              title: vm.$t("tip.confirmRevision"),
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
                              if (
                                JSON.stringify(tempData) ==
                                JSON.stringify(vm.dataList[index])
                              ) {
                                vm.$Modal.remove();
                                vm.$Message.warning(vm.$t("tip.notChanged"));
                                return (currentRow.editting = false);
                              }
                              vm.saveData(currentRow, index);
                              currentRow.saving = true;
                            }
                          }
                        },
                        vm.$t("tip.determine")
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
                              vm.$Modal.remove();
                              vm.editCancal(currentRow.id);
                              currentRow.editting = false;
                            }
                          }
                        },
                        vm.$t("tip.cancel")
                      )
                    ]
                  )
                ]);
              }
            });
          }
        }
      }
    },
    currentRow.editting ? vm.$t("tip.preservation") : vm.$t("tip.edit")
  );
};

let deleteButton = function(vm, h, currentRow, index) {
  return h(
    "Poptip",
    {
      props: {
        confirm: true,
        title:
          currentRow.WRAPDATASTATUS != vm.$t("btn.delete")
            ? vm.$t("tip.confirmDeletion")
            : vm.$t("tip.revocationAndDeletion"),
        transfer: true,
        placement: "left",
        cancelText: vm.$t("btn.cancel"),
        okText: vm.$t("btn.determine")
      },
      on: {
        "on-ok": function() {
          vm.deleteData(currentRow, index);
        }
      }
    },
    [
      h(
        "Button",
        {
          domProps: {
            title: vm.$t("btn.delete")
          },
          props: {
            size: "small",
            type: "error"
          }
        },
        vm.$t("btn.delete")
      )
    ]
  );
};

export default {
  name: "userList",
  data() {
    return {
      columnsList: [
        {
          title: "序号",
          type: "index",
          align: "center",
          minWidth: 60,
          fixed: "left"
        },
        {
          title: "创建时间",
          key: "create_time",
          align: "center",
          editable: true,
          minWidth: 200,
          fixed: "left",
          sortable: true
        },
        {
          title: "用户ID",
          key: "id",
          align: "center",
          minWidth: 100,
          sortable: true
        },
        {
          title: "用户账号",
          key: "name",
          align: "center",
          minWidth: 200,
          sortable: true
        },
        {
          title: "用户真实姓名",
          key: "real_name",
          align: "center",
          editable: true,
          minWidth: 200,
          sortable: true
        },
        {
          title: "手机号",
          key: "mobile",
          align: "center",
          editable: true,
          minWidth: 200,
          sortable: true
        },
        {
          title: "角色ID",
          key: "role_id",
          align: "center",
          minWidth: 100,
          sortable: true
        },
        {
          title: "角色名称",
          key: "role_name",
          align: "center",
          option: true,
          editable: true,
          minWidth: 200,
          sortable: true
        },
        {
          title: "部门名称",
          key: "department_name",
          align: "center",
          option: true,
          editable: true,
          minWidth: 200,
          sortable: true
        },
        {
          title: "操作",
          align: "center",
          key: "handle",
          minWidth: 200,
          fixed: "right",
          handle: ["edit", "delete"]
        }
      ],
      isShowRightDrawer: false,
      loading: false,
      dataList: [],
      cloneDataList: [],
      addUserName: "",
      addRealName: "",
      addPassWord: "",
      addMobile: "",
      addRoleId: "",
      addSeleteRoleId: "",
      addDepartmentName: "",
      modalLoading: true,
      editSeleteRoleId: "",
      editSeleteDepartmentId: "",
      departmentData: [],
      queryData: {
        real_name: "",
        mobile: "",
        role_id: -2,
        department_id: -2,
        page_index: 1,
        page_size: 10,
        count: 0
      }
    };
  },
  created() {
    this.$Modal.remove();
    this.getDepartmentData();
    this.getRoleList();
    this.getUserOther();
    this.init();
  },
  beforeDestroy() {
    this.loading = false;
    this.dataList = [];
    this.cloneDataList = [];
    this.addUserName = "";
    this.addRealName = "";
    this.addPassWord = "";
    this.addMobile = "";
    this.addRoleId = "";
    this.addSeleteRoleId = "";
    this.modalLoading = true;
    this.editSeleteRoleId = "";
    this.queryData = {
      real_name: "",
      mobile: "",
      role_id: -2,
      department_id: -2,
      page_index: 1,
      page_size: 10,
      count: 0
    };
  },
  methods: {
    handleSubmitRealName() {
      this.getUserOther();
      this.init();
    },
    resetData() {
      this.queryData.real_name = "";
      this.queryData.mobile = "";
      this.queryData.role_id = -2;
      this.queryData.department_id = -2;
    },
    searchData() {
      this.queryData.page_index = 1;
      this.getUserOther();
      this.init();
    },
    getUserOther() {
      this.loading = true;
      let q = this.queryData;
      let data = {
        real_name: q.real_name,
        mobile: q.mobile,
        role_id: q.role_id,
        department_id: q.department_id,
        page_index: q.page_index,
        page_size: q.page_size
      };

      this.$api.auth_login
        .getUserOther(data)
        .then(res => {
          if (res.data.code === 0) {
            this.dataList = res.data.data.data_info;
            this.queryData.count = res.data.data.page_count;

            this.cloneDataList = JSON.parse(JSON.stringify(this.dataList)).map(
              function(item) {
                item.editting = false;
                item.saving = false;
                return item;
              }
            );
            this.isShowRightDrawer = false;
            this.loading = false;
          }
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    editCancal(id) {
      let d = this.dataList;
      let c = this.cloneDataList;

      for (let i = 0; i < d.length; i++) {
        if (d[i].id === id) {
          for (let k in d[i]) {
            this.$set(c[i], k, d[i][k]);
          }
        }
      }
    },
    getDepartmentData() {
      let d = {
        name: "",
        page_index: 1,
        page_size: 500
      };

      this.$api.auth_login
        .getDepartmentData(d)
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data;

            if (list.length === 0) {
              this.departmentData = [];
            } else {
              this.departmentData = list.data_info;

              this.departmentData.unshift({
                id: -2,
                name: "全部"
              });
            }
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    handleSizeChange(val) {
      this.queryData.page_index = 1;
      this.queryData.page_size = val;
      this.getUserOther();
      this.init();
    },
    handleIndexChange(val) {
      this.queryData.page_index = val;
      this.getUserOther();
      this.init();
    },
    init() {
      let that = this;
      this.columnsList.forEach(function(item) {
        if (item.editable) {
          item.render = function(h, params) {
            let currentRow = that.cloneDataList[params.index];

            if (!currentRow.editting) {
              if (item.key === "create_time") {
                let t = that.$moment(currentRow["create_time"])
                  .subtract(8, "hour")
                  .format("YYYY-MM-DD HH:mm:ss");
                return h("span", t);
              }
              return h("span", currentRow[item.key]);
            } else {
              if (item.key === "create_time") {
                let c = new Date(currentRow["create_time"]);
                let t = that.$moment(c).format("YYYY-MM-DD HH:mm:ss");
                return h("span", t);
              }

              if (item.option && item.key === "role_name") {
                return h(
                  "Select",
                  {
                    props: {
                      placement: params.index < 5 ? "bottom" : "top",
                      value: currentRow["role_id"],
                      placeholder: that.$t("tip.pleaseSelect")
                    },
                    on: {
                      "on-change": value => {
                        that.editSeleteRoleId = value;
                        that.$set(currentRow, "role_id", value);
                      }
                    }
                  },
                  [
                    that.addRoleId.map(function(t) {
                      return h(
                        "Option",
                        {
                          props: {
                            value: t.id
                          }
                        },
                        t.role_name
                      );
                    })
                  ]
                );
              } else if (item.option && item.key === "department_name") {
                return h(
                  "Select",
                  {
                    props: {
                      placement: params.index < 5 ? "bottom" : "top",
                      value: currentRow["department_id"],
                      placeholder: that.$t("tip.pleaseSelect")
                    },
                    on: {
                      "on-change": value => {
                        that.editSeleteDepartmentId = value;
                        that.$set(currentRow, "department_id", value);
                      }
                    }
                  },
                  [
                    that.departmentData.map(function(t) {
                      return h(
                        "Option",
                        {
                          props: {
                            value: t.id
                          }
                        },
                        t.name
                      );
                    })
                  ]
                );
              } else {
                return h("Input", {
                  props: {
                    type: item.input,
                    rows: 3,
                    value: currentRow[params.column.key]
                  },
                  on: {
                    "on-change"(event) {
                      that.$set(
                        currentRow,
                        params.column.key,
                        event.target.value
                      );
                    }
                  }
                });
              }
            }
          };
        }

        if (item.handle) {
          item.render = function(h, param) {
            let currentRow = that.cloneDataList[param.index];
            let children = [];
            item.handle.forEach(function(item) {
              if (item === "edit") {
                children.push(editButton(that, h, currentRow, param.index));
              } else if (item === "delete") {
                children.push(deleteButton(that, h, currentRow, param.index));
              }
            });
            return h("div", children);
          };
        }
      });
    },
    getRoleList() {
      let data = {
        page_index: 1,
        page_size: 100
      };

      this.$api.auth_login
        .getRoleList(data)
        .then(res => {
          this.addRoleId = "";
          if (res.data.code === 0) {
            this.addRoleId = res.data.data.data_info;

            this.addRoleId.unshift({
              id: -2,
              role_name: "全部"
            });
          }
        })
        .catch(error => {
          this.$Message.error("请求失败");
        });
    },
    handleBackdata(object) {
      let clonedData = JSON.parse(JSON.stringify(object));
      delete clonedData.editting;
      delete clonedData.saving;
      return clonedData;
    },
    saveData(currentRow, index) {
      if (!this.$RegExp.verifyIsNull(currentRow.real_name.trim())) {
        this.$Message.warning(this.$t("tip.pleaseEnterTheUserIsRealName"));
        this.$Modal.remove();
        return;
      } else if (!this.$RegExp.verifyIsNull(currentRow.mobile.trim())) {
        this.$Message.warning(this.$t("tip.pleaseEnterYourMobileNumber"));
        this.$Modal.remove();
        return;
      } else if (!/^[1][0-9]{10}$/.test(currentRow.mobile.trim())) {
        this.$Message.warning(
          this.$t("tip.pleaseEnterAn11DigitMobilePhoneNumber")
        );
        this.$Modal.remove();
        return;
      } else if (!this.$RegExp.verifyIsNull(currentRow.role_id)) {
        this.$Message.warning(this.$t("tip.pleaseSelectTheRole"));
        this.$Modal.remove();
        return;
      } else if (!this.$RegExp.verifyIsNull(currentRow.department_id)) {
        this.$Message.warning(
          `${this.$t("tip.pleaseSelect")}${this.$t("tip.departmentName")}`
        );
        this.$Modal.remove();
        return;
      } else {
        let data = {
          user_id: Number(currentRow.id),
          username: currentRow.mobile,
          real_name: currentRow.real_name,
          mobile: currentRow.mobile,
          role_id: currentRow.role_id,
          department_id: currentRow.department_id
        };

        this.$api.auth_login
          .editUser(data)
          .then(res => {
            if (res.data.code === 0) {
              this.$Modal.remove();
              currentRow.saving = false;
              currentRow.editting = false;
              this.$Message.success(this.$t("tip.editSuccess"));
              this.getUserOther();
              this.init();
            }
          })
          .catch(error => {
            this.$Message.error(this.$t("tip.requestError"));
          });
      }
    },
    deleteData(currentRow, index) {
      let data = {
        user_id: currentRow.id
      };

      this.$api.auth_login
        .deleteUser(data)
        .then(res => {
          if (res.data.code === 0) {
            this.$delete(this.dataList, index);
            this.$delete(this.cloneDataList, index);
            this.$Message.success(this.$t("tip.deleteSuccess"));
            this.getUserOther();
            this.init();
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    addUserA() {
      // !this.$RegExp.verifyIsNull()
      if (!this.$RegExp.verifyIsNull(this.addRealName.trim())) {
        this.$Message.warning(this.$t("tip.pleaseEnterTheUserIsRealName"));
        return;
      } else if (!this.$RegExp.verifyIsNull(this.addPassWord.trim())) {
        this.$Message.warning(this.$t("tip.pleaseInputAPassword"));
        return;
      } else if (this.addPassWord.trim().length < 6) {
        this.$Message.warning(this.$t("tip.passwordMinimumSixDigits"));
        return;
      } else if (!this.$RegExp.verifyIsNull(this.addMobile.trim())) {
        this.$Message.warning(this.$t("tip.pleaseEnterYourMobileNumber"));
        return;
      } else if (!/^[1][0-9]{10}$/.test(this.addMobile.trim())) {
        this.$Message.warning(
          this.$t("tip.pleaseEnterAn11DigitMobilePhoneNumber")
        );
        return;
      } else if (!this.$RegExp.verifyIsNull(this.addSeleteRoleId)) {
        this.$Message.warning(this.$t("tip.pleaseSelectTheRole"));
        return;
      } else if (!this.$RegExp.verifyIsNull(this.addDepartmentName)) {
        this.$Message.warning(
          `${this.$t("tip.pleaseSelect")}${this.$t("tip.departmentName")}`
        );
        return;
      } else {
        let data = {
          username: this.addMobile,
          real_name: this.addRealName,
          passwords: this.addPassWord,
          mobile: this.addMobile,
          role_id: this.addSeleteRoleId,
          department_id: this.addDepartmentName
        };

        this.$api.auth_login
          .addUser(data)
          .then(res => {
            if (res.data.code === 0) {
              this.$Message.success(this.$t("tip.addSuccess"));
              this.$Modal.remove();
              this.getUserOther();
              this.init();
            }
          })
          .catch(error => {
            this.$Message.error(this.$t("tip.requestError"));
          });
      }
    },
    addUser() {
      this.addUserName = "";
      this.addRealName = "";
      this.addPassWord = "";
      this.addMobile = "";
      this.addDepartmentName = "";

      this.$Modal.confirm({
        scrollable: true,
        loading: this.modalLoading,
        render: h => {
          return h("div", [
            // h("div", {
            //   domProps: {
            //     innerHTML: "用户账号"
            //   },
            //   style: {
            //     "text-align": "left",
            //     "padding-top": "10px"
            //   }
            // }),
            // h("Input", {
            //   props: {
            //     value: this.addUserName,
            //     autofocus: true,
            //     placeholder: "请输入用户账号"
            //   },
            //   style: {
            //     "margin-top": "10px",
            //     "margin-padding": "10px"
            //   },
            //   on: {
            //     input: val => {
            //       this.addUserName = val;
            //     }
            //   }
            // }),
            h("div", {
              domProps: {
                innerHTML: this.$t("tip.pleaseEnterTheUserIsRealName")
              },
              style: {
                "text-align": "left",
                "padding-top": "10px"
              }
            }),
            h("Input", {
              props: {
                value: this.addRealName,
                autofocus: true,
                placeholder: this.$t("tip.pleaseEnterTheUserIsRealName")
              },
              style: {
                "margin-top": "10px",
                "margin-padding": "10px"
              },
              on: {
                input: val => {
                  this.addRealName = val;
                }
              }
            }),
            h("div", {
              domProps: {
                innerHTML: this.$t("tip.pleaseInputAPassword")
              },
              style: {
                "text-align": "left",
                "padding-top": "10px"
              }
            }),
            h("Input", {
              props: {
                type: "password",
                value: this.addPassWord,
                autofocus: true,
                placeholder: this.$t("tip.pleaseInputAPassword")
              },
              style: {
                "margin-top": "10px",
                "margin-padding": "10px"
              },
              on: {
                input: val => {
                  this.addPassWord = val;
                }
              }
            }),
            h("div", {
              domProps: {
                innerHTML: this.$t("tip.pleaseEnterYourMobileNumber")
              },
              style: {
                "text-align": "left",
                "padding-top": "10px"
              }
            }),
            h("Input", {
              props: {
                type: "text",
                value: this.addMobile,
                autofocus: true,
                placeholder: this.$t("tip.pleaseEnterYourMobileNumber")
              },
              style: {
                "margin-top": "10px",
                "margin-padding": "10px"
              },
              on: {
                input: val => {
                  this.addMobile = val;
                }
              }
            }),
            h("div", {
              domProps: {
                innerHTML: this.$t("tip.pleaseSelectTheRole")
              },
              style: {
                "text-align": "left",
                "padding-top": "10px"
              }
            }),
            h(
              "Select",
              {
                props: {
                  placeholder: this.$t("tip.pleaseSelectTheRole")
                },
                on: {
                  "on-change": value => {
                    this.addSeleteRoleId = value.toString();
                  }
                },
                style: {
                  "margin-top": "10px",
                  "margin-padding": "10px"
                }
              },
              [
                this.addRoleId.map(function(type) {
                  return h(
                    "Option",
                    {
                      props: {
                        value: type.id
                      }
                    },
                    type.role_name
                  );
                })
              ]
            ),
            h("div", {
              domProps: {
                innerHTML: `${this.$t("tip.pleaseSelect")}${this.$t(
                  "tip.departmentName"
                )}`
              },
              style: {
                "text-align": "left",
                "padding-top": "10px"
              }
            }),
            h(
              "Select",
              {
                props: {
                  placeholder: `${this.$t("tip.pleaseSelect")}${this.$t(
                    "tip.departmentName"
                  )}`
                },
                on: {
                  "on-change": value => {
                    this.addDepartmentName = value;
                  }
                },
                style: {
                  "margin-top": "10px",
                  "margin-padding": "10px"
                }
              },
              [
                this.departmentData.map(function(type) {
                  return h(
                    "Option",
                    {
                      props: {
                        value: type.id
                      }
                    },
                    type.name
                  );
                })
              ]
            ),
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
                        this.addUserA();
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
                        this.addUserName = "";
                        this.addRealName = "";
                        this.addPassWord = "";
                        this.addMobile = "";
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
};
</script>

<style lang="less" scoped>
.user-list {
  .single-page-container;

  .table-header {
    .header;

    .header-left {
      float: left;
    }

    .header-right {
      float: right;
    }
  }

  .table-body {
    .body;

    .page {
      padding: 20px 0;
      text-align: center;
    }
  }
}

.search-box {
  width: 100%;

  .item {
    width: 100%;
    padding: 5px;
    margin: 10px 0;

    p {
      padding: 5px 0;
      font-size: 16px;
    }
  }

  .bottom-btn {
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
  }
}
</style>