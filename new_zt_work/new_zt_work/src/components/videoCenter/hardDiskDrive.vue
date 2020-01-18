<!-- 硬盘机 -->

<template>
  <div class="hardDiskDrive-box">
    <div class="hardDiskDrive-header">
      <div class="header-left">
        <Button type="info" @click="addDataBox">{{$t('btn.newlyAdded')}}</Button>
      </div>
      <div class="header-right">
        <Input
          v-model="queryData.name"
          :placeholder="$t('tip.hardDriveName')"
          style="width: 200px;margin-right: 10px;"
        />
        <SelectDevice style="margin-right: 10px;" @changeMn="selectDeviceMn" @initMn="initMn"></SelectDevice>
        <Select
          v-model="queryData.brand_type"
          style="width:150px;margin-right: 10px;"
          :placeholder="$t('tip.brandType')"
        >
          <Option v-for="item in brandType" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Button type="primary" @click="query">{{$t('btn.query')}}</Button>
      </div>
    </div>
    <div class="hardDiskDrive-body">
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

    <Modal v-model="openModal" :title="modalTitle">
      <div class="modal-box">
        <Select
          v-model="pushStream.channel_nums"
          multiple
          :placeholder="$t('tip.pleaseSelectAChannel')"
        >
          <Option
            v-for="item in statusData"
            :value="item.channel_num"
            :label="item.channel_num"
            :key="item.id"
          >
            <div
              class="select-option"
              style="display: flex;justify-content: space-between;align-items: center;"
            >
              <span>{{ item.channel_num }}</span>
              <span
                :style="{color: item.status === 0 ? '#41b883' : '#ccc',marginRight: '20px'}"
              >{{ item.status === 0 ? $t('tip.open') : $t('tip.close') }}</span>
            </div>
          </Option>
        </Select>
        <Select
          v-show="!closePush"
          style="margin-top:20px;"
          v-model="pushStream.stream_type"
          :placeholder="$t('tip.pleaseSelectClarity')"
        >
          <Option
            v-for="item in streamType"
            :value="item.value"
            :label="item.label"
            :key="item.label"
          ></Option>
        </Select>
        <div
          class="select-option-btn"
          style="display: flex;justify-content: flex-end;align-items: center;margin-top: 20px;"
        >
          <Button @click="modalCancel">{{ $t('tip.cancel') }}</Button>
          <Button
            style="margin-left: 10px;"
            type="primary"
            @click="modalOpenPush"
          >{{ closePush ? $t('tip.close') : $t('tip.open') }}</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
let editButton = function(vm, h, currentRow, index) {
  return h(
    "Button",
    {
      props: {
        size: "small",
        type: currentRow.editting ? "success" : "dashed"
      },
      style: {
        margin: "0 5px"
      },
      on: {
        click: function(event) {
          event.preventDefault();

          let af = currentRow;

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

let openButton = function(vm, h, currentRow, index) {
  return h(
    "Button",
    {
      props: {
        size: "small",
        type: "info"
      },
      style: {
        margin: "0 5px"
      },
      on: {
        click: function(event) {
          event.preventDefault();
          vm.closePush = false;
          vm.modalTitle = vm.$t("tip.openPushFlow");
          vm.pushStream.dvr_id = currentRow.id;
          vm.queryChannelsData(currentRow.id);
        }
      }
    },
    vm.$t("tip.open")
  );
};

let closeButton = function(vm, h, currentRow, index) {
  return h(
    "Button",
    {
      props: {
        size: "small",
        type: "warning"
      },
      style: {
        margin: "0 5px"
      },
      on: {
        click: function(event) {
          event.preventDefault();
          vm.modalTitle = vm.$t("tip.closureOfPlugFlow");
          vm.closePush = true;
          vm.pushStream.dvr_id = currentRow.id;
          vm.queryChannelsData(currentRow.id);
        }
      }
    },
    vm.$t("tip.close")
  );
};

export default {
  name: "",
  data() {
    return {
      closePush: false,
      modalTitle: this.$t("tip.openPushFlow"),
      openModal: false,
      loading: false,
      columnsList: [
        {
          title: "序号",
          type: "index",
          minWidth: 60,
          align: "center",
          fixed: "left"
        },
        {
          align: "center",
          title: "硬盘机名称",
          minWidth: 200,
          key: "name",
          fixed: "left",
          editable: true
        },
        {
          align: "center",
          title: "时间",
          minWidth: 200,
          key: "create_time",
          render: (h, params) => {
            let c = params.row.create_time;
            let time = this.$moment(c)
              .subtract(8, "hour")
              .format("YYYY-MM-DD HH:mm:ss");
            return h("span", time);
          }
        },
        {
          align: "center",
          title: "站点名称",
          minWidth: 200,
          key: "device_id",
          option: true,
          editable: true
        },
        {
          align: "center",
          title: "账号",
          minWidth: 150,
          key: "username",
          editable: true
        },
        {
          align: "center",
          title: "密码",
          minWidth: 150,
          key: "password",
          editable: true
        },
        {
          align: "center",
          title: "品牌",
          minWidth: 150,
          key: "brand_type",
          option: true,
          editable: true
        },
        {
          align: "center",
          title: "路径",
          minWidth: 200,
          key: "dvr_url",
          editable: true
        },
        {
          align: "center",
          title: "通道数",
          minWidth: 80,
          key: "channel_total_count"
        },
        {
          title: "操作",
          align: "center",
          key: "handle",
          minWidth: 300,
          fixed: "right",
          handle: ["open", "close", "edit", "delete"]
        }
      ],
      dataList: [],
      cloneDataList: [],
      queryData: {
        name: "",
        device_id: -2,
        brand_type: -2,
        page_index: 1,
        page_size: 10,
        count: 0
      },
      dvrData: [],
      deviceData: [],
      brandType: [
        {
          label: "大华",
          value: 0
        },
        {
          label: "海康新",
          value: 1
        },
        {
          label: "海康旧",
          value: 2
        }
      ],
      addData: {
        name: "",
        username: "",
        password: "",
        dvr_url: "",
        device_id: 0,
        channel_total_count: 4,
        brand_type: 0
      },
      pushStream: {
        dvr_id: 0,
        channel_nums: [],
        stream_type: 0
      },
      streamType: [
        {
          value: 0,
          label: "240p"
        },
        {
          value: 1,
          label: "360p"
        },
        {
          value: 2,
          label: "480p"
        },
        {
          value: 3,
          label: "720p"
        },
        {
          value: 4,
          label: "1080p"
        }
      ],
      statusData: []
    };
  },
  created() {
    this.getDeviceDataReal();
    this.getDvrInof();
    this.init();
  },
  mounted() {
    this.closePush = false;
    this.openModal = false;
    this.$Modal.remove();
  },
  destroyed() {
    this.deviceData = [];
    this.dvrData = [];
    this.dataList = [];
    this.cloneDataList = [];
  },
  methods: {
    handleSizeChange(val) {
      this.queryData.page_index = 1;
      this.queryData.page_size = val;
      this.getDvrInof();
      this.init();
    },
    handleIndexChange(val) {
      this.queryData.page_index = val;
      this.getDvrInof();
      this.init();
    },
    modalOpenPush() {
      let p = this.pushStream;
      if (p.channel_nums.length === 0) {
        this.$Message.warning(this.$t("tip.pleaseSelectAChannel"));
        return;
      }

      if (this.closePush) {
        let data = {
          dvr_id: p.dvr_id,
          channel_nums: p.channel_nums
        };

        this.$api.srs_live
          .closeStream(data)
          .then(res => {
            if (res.data.code === 0) {
              this.$Message.success(this.$t("tip.ahutdownSuccess"));
              this.openModal = false;
              this.closePush = false;
            }
          })
          .catch(error => {
            this.$Message.error(this.$t("tip.requestError"));
            this.openModal = false;
            this.closePush = false;
          });
      } else {
        let data = {
          dvr_id: p.dvr_id,
          channel_nums: p.channel_nums,
          stream_type: p.stream_type
        };

        this.$api.srs_live
          .pushStream(data)
          .then(res => {
            if (res.data.code === 0) {
              this.openModal = false;
              this.$Message.success(this.$t("tip.openSuccessfully"));
            }
          })
          .catch(error => {
            this.$Message.error(this.$t("tip.requestError"));
          });
      }
    },
    modalCancel() {
      this.openModal = false;
      this.pushStream = {
        dvr_id: 0,
        channel_nums: [],
        stream_type: 0
      };
      this.closePush = false;
    },
    queryChannelsData(id) {
      this.loading = true;
      this.statusData = [];
      this.$api.srs_live
        .queryChannelsData({
          dvr_id: id
        })
        .then(res => {
          if (res.data.code === 0) {
            this.statusData = res.data.data;
            this.openModal = true;
            this.loading = false;
          }
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    query() {
      this.queryData.page_index = 1;
      this.getDvrInof();
      this.init();
    },
    initMn(v) {
      console.log(v);
    },
    selectDeviceMn(v) {
      this.queryData.device_id = v.id;
    },
    defaultAddData() {
      this.addData = {
        name: "",
        username: "",
        password: "",
        dvr_url: "",
        device_id: 0,
        channel_total_count: 4,
        brand_type: 0
      };
    },
    verifyAddData(d) {
      if (!this.$RegExp.verifyEmptyString(d.name)) {
        this.$Message.warning(this.$t("tip.hardDriveName"));
        if (d.id === undefined) {
          this.addData.name = "";
        } else {
          this.$Modal.remove();
        }
        return false;
      } else if (!this.$RegExp.verifyEmptyString(d.username)) {
        this.$Message.warning(this.$t("tip.hardDriveAccount"));
        if (d.id === undefined) {
          this.addData.username = "";
        } else {
          this.$Modal.remove();
        }
        return false;
      } else if (!this.$RegExp.verifyEmptyString(d.password)) {
        this.$Message.warning(this.$t("tip.hardDrivePasswrod"));
        if (d.id === undefined) {
          this.addData.password = "";
        } else {
          this.$Modal.remove();
        }
        return false;
      } else if (!this.$RegExp.verifyStringlength(d.password)) {
        this.$Message.warning(this.$t("tip.passwordMinimumSixDigits"));
        if (d.id === undefined) {
          this.addData.password = "";
        } else {
          this.$Modal.remove();
        }
        return false;
      } else if (!this.$RegExp.verifyIPAndPort(d.dvr_url)) {
        this.$Message.warning(this.$t("tip.hardDiskIP"));
        if (d.id === undefined) {
          this.addData.dvr_url = "";
        } else {
          this.$Modal.remove();
        }
        return false;
      } else if (!this.$RegExp.verifyIs0(d.channel_total_count)) {
        this.$Message.warning(this.$t("tip.changnelTotalCount"));
        if (d.id === undefined) {
          this.addData.channel_total_count = 4;
        } else {
          this.$Modal.remove();
        }
        return false;
      } else if (!this.$RegExp.verifyIs0(d.device_id)) {
        this.$Message.warning(this.$t("tip.devName"));
        if (d.id === undefined) {
          this.addData.device_id = 0;
        } else {
          this.$Modal.remove();
        }
        return false;
      } else {
        return true;
      }
    },
    subminData() {
      let d = this.addData;

      if (this.verifyAddData(d)) {
        this.loading = true;
        let data = {
          name: d.name,
          username: d.username,
          password: d.password,
          dvr_url: d.dvr_url,
          device_id: d.device_id,
          channel_total_count: d.channel_total_count,
          brand_type: d.brand_type
        };

        this.$api.srs_live
          .addDvrInof(data)
          .then(res => {
            if (res.data.code === 0) {
              this.$Message.success(this.$t("tip.addSuccess"));

              this.getDvrInof();
              this.init();

              this.loading = false;
              this.$Modal.remove();
            }
            this.loading = false;
          })
          .catch(error => {
            this.loading = false;
            this.$Modal.remove();
            this.$Message.error(this.$t("tip.requestError"));
          });
      }
    },
    addDataBox() {
      this.$Modal.confirm({
        width: "520",
        render: h => {
          return h("div", [
            h("div", {
              domProps: {
                innerHTML: this.$t("tip.hardDriveName")
              },
              style: {
                "text-align": "left",
                "padding-top": "10px"
              }
            }),
            h("Input", {
              props: {
                value: this.addData.name,
                autofocus: true,
                placeholder: this.$t("tip.hardDriveName")
              },
              style: {
                "margin-top": "10px",
                "margin-padding": "10px"
              },
              on: {
                input: val => {
                  this.addData.name = val.trim();
                }
              }
            }),
            h("div", {
              domProps: {
                innerHTML: this.$t("tip.hardDriveAccount")
              },
              style: {
                "text-align": "left",
                "padding-top": "10px"
              }
            }),
            h("Input", {
              props: {
                value: this.addData.username,
                autofocus: true,
                placeholder: this.$t("tip.hardDriveAccount")
              },
              style: {
                "margin-top": "10px",
                "margin-padding": "10px"
              },
              on: {
                input: val => {
                  this.addData.username = val.trim();
                }
              }
            }),
            h("div", {
              domProps: {
                innerHTML: this.$t("tip.hardDrivePasswrod")
              },
              style: {
                "text-align": "left",
                "padding-top": "10px"
              }
            }),
            h("Input", {
              props: {
                type: "password",
                value: this.addData.password,
                autofocus: true,
                placeholder: this.$t("tip.hardDrivePasswrod")
              },
              style: {
                "margin-top": "10px",
                "margin-padding": "10px"
              },
              on: {
                input: val => {
                  this.addData.password = val.trim();
                }
              }
            }),
            h("div", {
              domProps: {
                innerHTML: this.$t("tip.hardDiskIP")
              },
              style: {
                "text-align": "left",
                "padding-top": "10px"
              }
            }),
            h("Input", {
              props: {
                value: this.addData.dvr_url,
                autofocus: true,
                placeholder: this.$t("tip.hardDiskIP")
              },
              style: {
                "margin-top": "10px",
                "margin-padding": "10px"
              },
              on: {
                input: val => {
                  this.addData.dvr_url = val.trim();
                }
              }
            }),
            h("div", {
              domProps: {
                innerHTML: this.$t("tip.changnelTotalCount")
              },
              style: {
                "text-align": "left",
                "padding-top": "10px"
              }
            }),
            h("InputNumber", {
              props: {
                min: 1,
                max: 30,
                value: this.addData.channel_total_count,
                autofocus: true,
                placeholder: this.$t("tip.changnelTotalCount")
              },
              style: {
                width: "150px",
                "margin-top": "10px",
                "margin-padding": "10px"
              },
              on: {
                "on-change": value => {
                  if (value !== undefined) {
                    this.addData.channel_total_count = value;
                  }
                }
              }
            }),
            h("div", {
              domProps: {
                innerHTML: this.$t("tip.devName")
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
                  value: this.addData.device_id,
                  placeholder: this.$t("tip.devName")
                },
                on: {
                  "on-change": value => {
                    if (value !== undefined) {
                      this.addData.device_id = value;
                    }
                  }
                },
                style: {
                  width: "150px",
                  "margin-top": "10px",
                  "margin-padding": "10px",
                  "margin-right": "25px"
                }
              },
              [
                this.deviceData.map(function(type) {
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
            h("div", {
              domProps: {
                innerHTML: this.$t("tip.brandType")
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
                  value: this.addData.brand_type,
                  placeholder: this.$t("tip.brandType")
                },
                on: {
                  "on-change": value => {
                    if (value !== undefined) {
                      this.addData.brand_type = value;
                    }
                  }
                },
                style: {
                  width: "150px",
                  "margin-top": "10px",
                  "margin-padding": "10px",
                  "margin-right": "25px"
                }
              },
              [
                this.brandType.map(function(type) {
                  // 把map看作循环,type看作循环的每一项
                  return h(
                    "Option",
                    {
                      props: {
                        value: type.value
                      }
                    },
                    type.label
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
                        this.subminData();
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
                        this.defaultAddData();
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
    saveData(row, index) {
      if (this.verifyAddData(row)) {
        this.loading = true;
        let data = {
          dvr_id: row.id,
          name: row.name,
          username: row.username,
          password: row.password,
          dvr_url: row.dvr_url,
          device_id: row.device_id,
          brand_type: row.brand_type
        };

        this.$api.srs_live
          .editDvrInof(data)
          .then(res => {
            if (res.data.code === 0) {
              this.$Message.success(this.$t("tip.editSuccess"));

              this.getDvrInof();
              this.init();

              this.loading = false;
            }
            this.loading = false;
          })
          .catch(error => {
            this.loading = false;
            this.$Message.error(this.$t("tip.requestError"));
          });
      }
    },
    deleteData(row, index) {
      this.loading = true;
      this.$api.srs_live
        .deleteDvrInof({
          dvr_id: row.id
        })
        .then(res => {
          if (res.data.code === 0) {
            this.$Message.success(this.$t("tip.deleteSuccess"));

            this.getDvrInof();
            this.init();
            this.loading = false;
          }
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    init() {
      let that = this;
      this.columnsList.forEach(function(item, index) {
        if (item.editable) {
          item.render = function(h, params) {
            let currentRow = that.cloneDataList[params.index];

            if (!currentRow.editting) {
              if (item.key === "brand_type") {
                let b = currentRow["brand_type"];
                let d = that.brandType;
                let v = null;
                for (let i = 0; i < d.length; i++) {
                  if (Number(b) === d[i].value) {
                    v = d[i].label;
                  }
                }
                return h("span", v);
              }
              if (item.key === "device_id") {
                let b = currentRow["device_id"];
                let d = that.deviceData;
                let v = null;
                for (let i = 0; i < d.length; i++) {
                  if (b === d[i].id) {
                    v = d[i].name;
                  }
                }
                return h("span", v);
              }
              if (item.key === "password") {
                let p = currentRow["password"];
                return h("span", p.replace(/[a-zA-Z0-9\d]/g, "*"));
              }
              return h("span", currentRow[item.key]);
            } else {
              if (item.option && item.key === "device_id") {
                return h(
                  "Select",
                  {
                    props: {
                      value: currentRow["device_id"]
                    },
                    on: {
                      "on-change": function(value) {
                        that.$set(currentRow, "device_id", value);
                      }
                    }
                  },
                  that.deviceData.map(function(item) {
                    return h(
                      "Option",
                      {
                        props: {
                          value: item.id,
                          label: item.name
                        }
                      },
                      item.name
                    );
                  })
                );
              }

              if (item.option && item.key === "brand_type") {
                return h(
                  "Select",
                  {
                    props: {
                      value: currentRow["brand_type"]
                    },
                    on: {
                      "on-change": function(value) {
                        that.$set(currentRow, "brand_type", value);
                      }
                    }
                  },
                  that.brandType.map(function(item) {
                    return h(
                      "Option",
                      {
                        props: {
                          value: item.value,
                          label: item.label
                        }
                      },
                      item.label
                    );
                  })
                );
              }

              if (item.key === "password") {
                return h("Input", {
                  props: {
                    type: "password",
                    value: currentRow["password"]
                  },
                  on: {
                    "on-change"(event) {
                      that.$set(currentRow, "password", event.target.value);
                    }
                  }
                });
              }

              return h("Input", {
                props: {
                  type: "text",
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
          };
        }

        if (item.handle) {
          item.render = function(h, param) {
            var currentRow = that.cloneDataList[param.index];
            var children = [];
            item.handle.forEach(function(item) {
              if (item === "open") {
                children.push(openButton(that, h, currentRow, param.index));
              } else if (item === "close") {
                children.push(closeButton(that, h, currentRow, param.index));
              } else if (item === "edit") {
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
    getDvrInof() {
      this.loading = true;
      let q = this.queryData;
      let data = {
        name: q.name,
        device_id: q.device_id,
        brand_type: q.brand_type,
        page_index: q.page_index,
        page_size: q.page_size
      };

      this.$api.srs_live
        .getDvrInof(data)
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data;
            this.queryData.count = list.page_count;

            this.dataList = list.data_info;
            this.cloneDataList = JSON.parse(JSON.stringify(list.data_info)).map(
              function(item) {
                item.editting = false;
                item.saving = false;
                return item;
              }
            );

            this.loading = false;
          }
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    getDeviceDataReal() {
      this.deviceData = [];
      this.$api.monitor1
        .getDeviceDataReal({
          page_index: 1,
          page_size: 500
        })
        .then(res => {
          if (res.data.code === 0) {
            this.deviceData = res.data.data.data_info;
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    handleBackdata(object) {
      var clonedData = JSON.parse(JSON.stringify(object));
      delete clonedData.editting;
      delete clonedData.saving;
      return clonedData;
    }
  }
};
</script>

<style lang="less" scoped>
.hardDiskDrive-box {
  .single-page-container;

  .hardDiskDrive-header {
    .header;

    .header-left {
      float: left;
    }
    .header-right {
      float: right;
    }
  }

  .hardDiskDrive-body {
    .body;

    .page {
      padding: 20px 0;
      text-align: center;
    }
  }
}
</style>