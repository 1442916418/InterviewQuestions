<!-- 文件上传 -->

<template>
  <div class="uploadFiles-box">
    <div class="uploadFiles-header">
      <div class="header-left">
        <Button
          :type="isUpload ? 'primary' : null"
          style="margin-right:10px;"
          icon="ios-cloud-upload"
          @click="uploadFile"
          :loading="leftLoading"
        >{{ isUpload ? $t('btn.confirmUpload') : $t('btn.upload') }}</Button>
        <div class="left-btn" ref="headerLeft">
          <Button type="dashed" @click="calcelUpload" style="margin-right:10px">{{$t('btn.cancel')}}</Button>
          <Input
            v-model.trim="uRemark"
            :placeholder="$t('tip.pleaseEnterComments')"
            style="width: 150px;margin-right:10px;"
          />
          <Select
            @on-change="selectFileType"
            style="width:150px;margin-right:10px;"
            :placeholder="$t('tip.pleaseSelectFileType')"
            filterable
            :value="fileType"
          >
            <Option v-for="item in type" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <div style="display: inline-block;">
            <Upload
              style="display:inline-block;margin-right:10px;"
              action
              :before-upload="handleUpload"
              ref="upload"
            >
              <Button icon="ios-cloud-upload-outline">{{$t('btn.selectFile')}}</Button>
            </Upload>
            <span v-if="file !== null">{{$t('tip.fileName')}}: {{ file.name }}</span>
          </div>
        </div>
      </div>
      <div class="header-right">
        <div class="right-btn" ref="headerRight">
          <Input
            v-model.trim="queryData.name"
            :placeholder="$t('tip.pleaseEnterAFileNmae')"
            style="width: 150px;margin-right:10px;"
          />
          <Input
            v-model.trim="queryData.remark"
            :placeholder="$t('tip.pleaseEnterComments')"
            style="width: 150px;margin-right:10px;"
          />
          <Select
            @on-change="searchFileType"
            style="width:150px;margin-right:10px;"
            :placeholder="$t('tip.pleaseSelectFileType')"
            filterable
            :value="searchFile.type"
          >
            <Option v-for="item in type" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Button type="dashed" @click="calcelSearch" style="margin-right:10px">{{$t('btn.cancel')}}</Button>
        </div>
        <Button
          :type="isSearch ? 'primary' : null"
          style="margin-right:10px;"
          icon="ios-search"
          @click="searchFile"
        >{{ isSearch ? $t('btn.confirmSearch') : $t('btn.search') }}</Button>
      </div>
    </div>
    <div class="uploadFiles-body">
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

    <Modal v-model="isDeviceUpgrade" title="确定远程升级吗？">
      <div class="item-box">
        <div class="item">
          <p>请选择站点</p>
          <SelectDevice @changeMn="selectDeviceMn" @initMn="initMn"></SelectDevice>
        </div>
        <div class="item-btn">
          <Button style="margin-right: 10px;" @click="() => isDeviceUpgrade = !isDeviceUpgrade">取消</Button>
          <Button type="primary" :loading="devLoading" @click="setDeviceRemoteUpgrade">确定</Button>
        </div>
      </div>
    </Modal>

    <Modal v-model="isFileUpgrade" title="确定文件远程升级吗？">
      <div class="item-box">
        <div class="item">
          <p>请选择站点</p>
          <SelectDevice @changeMn="selectDeviceMn" @initMn="initMn"></SelectDevice>
        </div>
        <div class="item">
          <p>请选择模式</p>
          <Select v-model="fileUpgrade.mode" style="width:230px">
            <Option v-for="item in mode" :value="item.value" :label="item.label" :key="item.value"></Option>
          </Select>
        </div>
        <div class="item-btn">
          <Button style="margin-right: 10px;" @click="() => isFileUpgrade = !isFileUpgrade">取消</Button>
          <Button type="primary" :loading="fileLoading" @click="setFilesRemoteUpgradsse">确定</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "uploadFiles",
  data() {
    return {
      leftLoading: false,
      isSearch: false,
      isUpload: false,
      uploadDate: {},
      type: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "单片机",
          value: 1
        },
        {
          label: "安卓屏",
          value: 2
        },
        {
          label: "工控机",
          value: 3
        },
        {
          label: "图片",
          value: 4
        },
        {
          label: "视频",
          value: 5
        },
        {
          label: "app",
          value: 6
        },
        {
          label: "文本资料",
          value: 7
        },
        {
          label: "srs录制视频",
          value: 8
        }
      ],
      fileType: 1,
      uRemark: null,
      loading: false,
      columnsList: [],
      dataList: [],
      queryData: {
        page_index: 1,
        page_size: 50,
        name: "",
        remark: "",
        type: "",
        count: 0
      },
      filesData: [],
      file: null,
      fileName: null,
      uploadPath: "http://hzztkj.com:2207/monitor/file/real/upload",
      mode: [
        {
          label: "内部 Flash 安全升级",
          value: 1
        },
        {
          label: "外部 Flash 安全升级",
          value: 2
        },
        {
          label: "内部 Flash 直接升级",
          value: 3
        }
      ],
      selectMode: 1,
      deviceUpgrade: {
        mn: null,
        download_url: null
      },
      fileUpgrade: {
        mn: null,
        mode: 1,
        download_url: null
      },
      isDeviceUpgrade: false,
      isFileUpgrade: false,
      devLoading: false,
      fileLoading: false
    };
  },
  mounted() {
    if (config.dev === "TEST") {
      this.uploadPath = "http://192.168.199.104:2212/files_base/file/upload";
    } else {
      this.uploadPath =
        "https://www.waterqm.com/ng_files_base/files_base/file/upload";
    }
    this.$Modal.remove();
    this.getFiles();
  },
  methods: {
    selectDeviceMn(v) {
      this.deviceUpgrade.mn = v.mn;
      this.fileUpgrade.mn = v.mn;
    },
    initMn(v) {
      this.deviceUpgrade.mn = v.mn;
      this.fileUpgrade.mn = v.mn;
    },
    dblclickRow(value, index) {
      window.open(value.download_url);
    },
    calcelSearch() {
      this.queryData.name = null;
      this.queryData.remark = null;
      this.queryData.type = "";
      this.$refs.headerRight.style.display = "none";
      this.isSearch = false;
    },
    calcelUpload() {
      this.$refs.upload.clearFiles();
      this.uRemark = null;
      this.$refs.headerLeft.style.display = "none";
      this.isUpload = false;
    },
    setFilesRemoteUpgradsse() {
      if (!this.$RegExp.verifyIsNull(this.fileUpgrade.mn)) {
        this.$Message.warning("请选择设备");
        return;
      }
      this.fileLoading = true;
      let d = {
        mn: this.fileUpgrade.mn,
        download_url: this.fileUpgrade.download_url,
        mode: this.fileUpgrade.mode
      };

      this.$api.monitor2
        .filesRemoteUpgrade(d)
        .then(res => {
          if (res.data.code === 0) {
            this.fileLoading = false;
            this.isFileUpgrade = false;
            this.$Message.success(this.$t("tip.upgradeSuccess"));
          }
          this.fileLoading = false;
        })
        .catch(error => {
          this.isFileUpgrade = false;
          this.fileLoading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    setDeviceRemoteUpgrade() {
      if (!this.$RegExp.verifyIsNull(this.deviceUpgrade.mn)) {
        this.$Message.warning("请选择设备");
        return;
      }
      this.devLoading = true;
      let d = {
        mn: this.deviceUpgrade.mn,
        download_url: this.deviceUpgrade.download_url
      };
      this.$api.monitor2
        .addressRemoteUpgrade(d)
        .then(res => {
          if (res.data.code === 0) {
            this.devLoading = false;
            this.isDeviceUpgrade = false;
            this.$Message.success(this.$t("tip.upgradeSuccess"));
          }
          this.devLoading = false;
        })
        .catch(error => {
          this.isDeviceUpgrade = false;
          this.devLoading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    deleteFile(id) {
      let d = {
        file_id: id
      };

      this.$api.files_base
        .deleteFile(d)
        .then(res => {
          if (res.data.code === 0) {
            this.$Message.success(this.$t("tip.deleteSuccess"));

            this.getFiles();
          }
          this.$Modal.remove();
        })
        .catch(error => {
          this.$Modal.remove();
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    searchFileData() {
      this.loading = true;
      let d = this.queryData;

      let data = {
        page_index: d.page_index,
        page_size: d.page_size,
        file_name: d.name,
        remark: d.remark,
        type: d.type
      };

      this.$api.files_base
        .getFiles(data)
        .then(res => {
          if (res.data.code === 0) {
            this.filesData = [];
            this.filesData = res.data.data.data_info;
            this.queryData.count = res.data.data.page_count;

            this.$refs.headerRight.style.display = "none";
            this.isSearch = false;

            this.setTable();
          }
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    uploadFileData() {
      if (this.file === null) {
        this.$Message.warning(this.$t("tip.pleaseSelectAFile"));
        return;
      } else if (this.uRemark === null) {
        this.$Message.warning(this.$t("tip.pleaseEnterComments"));
        return;
      } else {
        this.leftLoading = true;

        let userInfo = this.$store.state.userInfo;
        let access_token = null;

        if (
          userInfo === null ||
          userInfo.obj === null ||
          userInfo.obj === undefined
        ) {
        } else {
          access_token = userInfo.obj.access_token;
        }

        let f = null;
        let n = navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i);
        if (n == "ios") {
          f = "iOS";
        } else if (n == "Android") {
          f = "Android";
        } else {
          f = "Web";
        }

        let formData = new FormData();
        formData.append("file", this.file);
        formData.append("remark", this.uRemark);
        formData.append("type", this.fileType);

        let config = {
          headers: {
            "Content-Type": "multipart/form-data",
            access_token: access_token,
            OtherParameter: f
          }
        };

        axios
          .post(this.uploadPath, formData, config)
          .then(res => {
            if (res.data.code === 0) {
              this.$Message.success(this.$t("tip.uploadSuccess"));

              this.getFiles();

              this.$refs.upload.clearFiles();
              this.uRemark = null;
              this.$refs.headerLeft.style.display = "none";
              this.isUpload = false;
            } else {
              this.$Message.warning(res.data.message);
              this.leftLoading = false;
            }
            this.leftLoading = false;
          })
          .catch(error => {
            this.$refs.headerLeft.style.display = "none";
            this.isUpload = false;
            this.leftLoading = false;
            this.$Message.error(this.$t("tip.requestError"));
          });
      }
    },
    searchFileType(value) {
      this.queryData.type = value;
    },
    searchFile() {
      if (this.isSearch) {
        this.searchFileData();
      } else {
        this.$refs.headerLeft.style.display = "none";
        this.isUpload = false;
        this.$refs.headerRight.style.display = "inline-block";
        this.isSearch = true;
      }
    },
    uploadFile() {
      if (this.isUpload) {
        this.uploadFileData();
      } else {
        this.$refs.headerRight.style.display = "none";
        this.isSearch = false;
        this.$refs.headerLeft.style.display = "inline-block";
        this.isUpload = true;
      }
    },
    selectFileType(value) {
      this.fileType = value;
    },
    handleUpload(file) {
      this.file = file;
      this.fileName = file.name;
      return false;
    },
    setTable() {
      let list = this.filesData;
      this.dataList = [];
      this.columnsList = [];

      if (list.length === 0) {
        this.dataList = [];
        this.columnsList = [];
      } else {
        this.columnsList = [
          {
            title: "序号",
            type: "index",
            minWidth: 100,
            align: "center",
            fixed: "left"
          },
          {
            align: "center",
            title: "名称",
            minWidth: 300,
            key: "name",
            fixed: "left"
          },
          {
            align: "center",
            title: "创建时间",
            minWidth: 150,
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
            title: "大小",
            key: "size",
            minWidth: 100
          },
          {
            align: "center",
            title: "备注",
            key: "remark",
            minWidth: 300
          },
          {
            align: "center",
            title: "类型",
            key: "type",
            minWidth: 100,
            render: (h, params) => {
              let t = params.row.type;
              switch (Number(t)) {
                case 1:
                  return h("span", "单片机");
                  break;
                case 2:
                  return h("span", "安卓屏");
                  break;
                case 3:
                  return h("span", "工控机");
                  break;
                case 4:
                  return h("span", "图片");
                  break;
                case 5:
                  return h("span", "视频");
                  break;
                case 6:
                  return h("span", "app");
                  break;
                case 7:
                  return h("span", "文本资料");
                  break;
                case 8:
                  return h("span", "srs录制视频");
                  break;
              }
            }
          },
          {
            align: "center",
            title: "操作",
            minWidth: 330,
            fixed: "right",
            render: (h, params) => {
              return h(
                "div",
                {
                  style: {
                    display: "flex",
                    "justify-content": "center",
                    "align-items": "center"
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
                        "margin-right": "10px",
                        display:
                          params.row.type === 1 ||
                          params.row.type === 2 ||
                          params.row.type === 3
                            ? "block"
                            : "none"
                      },
                      on: {
                        click: () => {
                          this.deviceUpgrade.download_url =
                            params.row.download_url;
                          this.isDeviceUpgrade = true;
                        }
                      }
                    },
                    "地址远程升级"
                  ),
                  h(
                    "Button",
                    {
                      props: {
                        type: "primary"
                      },
                      style: {
                        "margin-right": "10px",
                        display:
                          params.row.type === 1 ||
                          params.row.type === 2 ||
                          params.row.type === 3
                            ? "block"
                            : "none"
                      },
                      on: {
                        click: () => {
                          this.fileUpgrade.download_url =
                            params.row.download_url;
                          this.isFileUpgrade = true;
                        }
                      }
                    },
                    "文件远程升级"
                  ),
                  h(
                    "Button",
                    {
                      props: {
                        type: "error"
                      },
                      style: {
                        "margin-right": "10px"
                      },
                      on: {
                        click: () => {
                          this.$Modal.confirm({
                            render: h => {
                              return h("div", [
                                h("div", {
                                  domProps: {
                                    innerHTML: "确认删除吗？"
                                  },
                                  style: {
                                    "text-align": "left",
                                    "padding-top": "10px"
                                  }
                                }),
                                h(
                                  "div",
                                  {
                                    slot: "footer",
                                    style: {
                                      width: "100%",
                                      paddingTop: "10px",
                                      paddingBottom: "10px",
                                      textAlign: "right"
                                    }
                                  },
                                  [
                                    h(
                                      "Button",
                                      {
                                        props: {
                                          type: "dashed"
                                        },
                                        style: {
                                          "margin-right": "10px"
                                        },
                                        on: {
                                          click: () => {
                                            this.$Modal.remove();
                                          }
                                        }
                                      },
                                      "取消"
                                    ),
                                    h(
                                      "Button",
                                      {
                                        props: {
                                          type: "primary"
                                        },
                                        style: {
                                          "margin-right": "10px"
                                        },
                                        on: {
                                          click: () => {
                                            this.deleteFile(params.row.id);
                                          }
                                        }
                                      },
                                      "确认"
                                    )
                                  ]
                                )
                              ]);
                            }
                          });
                        }
                      }
                    },
                    "删除"
                  )
                ]
              );
            }
          }
        ];

        this.dataList = list;
      }
    },
    getFiles() {
      this.loading = true;
      let d = this.queryData;
      let data = {
        page_index: d.page_index,
        page_size: d.page_size,
        file_name: "",
        remark: "",
        type: -2
      };

      this.$api.files_base
        .getFiles(data)
        .then(res => {
          if (res.data.code === 0) {
            this.filesData = [];
            this.filesData = res.data.data.data_info;
            this.queryData.count = res.data.data.page_count;

            this.setTable();
          }
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    handleSizeChange(val) {
      this.queryData.page_index = 1;
      this.queryData.page_size = val;
      this.getFiles();
    },
    handleIndexChange(val) {
      this.queryData.page_index = val;
      this.getFiles();
    }
  }
};
</script>

<style lang="less" scoped>
.uploadFiles-box {
  .single-page-container;

  .uploadFiles-header {
    .header;

    .header-left {
      float: left;

      .left-btn {
        display: none;
      }
    }

    .header-right {
      float: right;
      .right-btn {
        display: none;
      }
    }
  }

  .uploadFiles-body {
    .body;

    .page {
      padding: 20px 0;
      text-align: center;
    }
  }
}

.item-box {
  width: 100%;

  .item {
    margin: 10px 0;

    p {
      font-size: 14px;
      padding-bottom: 5px;
    }
  }

  .item-btn {
    text-align: right;
  }
}
</style>