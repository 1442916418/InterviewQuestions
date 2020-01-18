<!-- 学习资料 -->

<template>
  <div class="learningMaterials-box">
    <div class="learningMaterials-header">
      <div class="header-left">
        <Button
          type="primary"
          icon="ios-cloud-download-outline"
          :loading="btnLoading"
          @click="downloadFiles"
        >{{ $t('tip.batchDownload') }}</Button>
      </div>
      <div class="header-right"></div>
    </div>
    <div class="learningMaterials-body">
      <DefaultTable
        :isPage="true"
        :isSelection="true"
        :columnsList="columnsList"
        :dataList="dataList"
        :loading="loading"
        :queryData="queryData"
        @handleSizeChange="handleSizeChange"
        @handleIndexChange="handleIndexChange"
        @onSelectionChange="clickSelectChange"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import JSZip from "jszip";

export default {
  name: "",
  data() {
    return {
      btnLoading: false,
      queryData: {
        page_index: 1,
        page_size: 50,
        name: "",
        remark: "",
        type: 7,
        count: 0
      },
      fileDataList: [],
      loading: false,
      columnsList: [],
      dataList: [],
      selectionData: [],
      oneError: false
    };
  },
  created() {
    this.getFilesData();
  },
  beforeDestroy() {
    this.queryData = {
      page_index: 1,
      page_size: 50,
      name: "",
      remark: "",
      type: 7,
      count: 0
    };
    this.fileDataList = [];
    this.loading = false;
    this.columnsList = [];
    this.dataList = [];
  },
  methods: {
    downloadFiles() {
      let files = this.selectionData,
        urls = [],
        errorCount = 0;

      if (files.length === 0) {
        this.$Message.warning(this.$t("tip.pleaseSelectAFile"));
        return;
      }

      this.btnLoading = true;

      const getFile = url => {
        return new Promise((resolve, reject) => {
          axios({
            method: "get",
            url,
            responseType: "arraybuffer"
          })
            .then(data => {
              resolve(data.data);
            })
            .catch(error => {
              reject(error.toString());
              ++errorCount;
              this.$Message.error(this.$t("tip.requestError"));
              this.btnLoading = false;
              this.$refs.table.selectAll(false);
            });
        });
      };

      for (let i = 0; i < files.length; i++) {
        urls.push(files[i].download_url);
      }

      const zip = new JSZip();
      const cache = {};
      const promises = [];
      urls.forEach(item => {
        const promise = getFile(item)
          .then(data => {
            // 下载文件, 并存成ArrayBuffer对象
            const arr_name = item.split("/");
            const file_name = arr_name[arr_name.length - 1]; // 获取文件名
            zip.file(file_name, data, { binary: true }); // 逐个添加文件
            cache[file_name] = data;
          })
          .catch(error => {
            console.log(error, "<-------------------------------------");
          });

        promises.push(promise);
      });

      Promise.all(promises).then(() => {
        zip.generateAsync({ type: "blob" }).then(content => {
          // 生成二进制流
          this.$FileSaver.saveAs(content, "学习资料.zip"); // 利用file-saver保存文件
        });
        this.btnLoading = false;
        this.$refs.table.selectAll(false);

        if (errorCount === 0) {
          this.$Message.success(this.$t("tip.allDownloadedSuccessfully"));
        } else {
          let c = urls.length - errorCount;
          let msg = `${this.$t("tip.inTotal")} ${urls.length} ${this.$t(
            "tip.number"
          )},${this.$t("tip.downloadSuccessful")} ${c} ${this.$t(
            "tip.number"
          )},${this.$t("tip.downloadFailed")} ${errorCount} ${this.$t(
            "tip.number"
          )}`;
          this.$Message.warning({
            content: msg,
            duration: 5,
            closable: true
          });
        }
      });
    },
    downloadFile(row) {
      let url = row.download_url,
        fileName = row.name;

      axios
        .get(url, {
          responseType: "blob"
        })
        .then(res => {
          let f = new File([res.data], fileName, {
            type: "text/plain;charset=utf-8"
          });
          this.$FileSaver.saveAs(f);
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    clickSelectChange(selection) {
      this.selectionData = [];
      this.selectionData = selection;
    },
    clickSelectAll(selection) {
      this.selectionData = selection;
    },
    handleSizeChange(val) {
      this.queryData.page_index = 1;
      this.queryData.page_size = val;
      this.getFilesData();
    },
    handleIndexChange(val) {
      this.queryData.page_index = val;
      this.getFilesData();
    },
    setTable() {
      let list = this.fileDataList;
      this.dataList = [];
      this.columnsList = [];

      if (list.length === 0) {
        this.columnsList = [];
        this.dataList = [];
      } else {
        this.columnsList = [
          {
            type: "selection",
            minWidth: 60,
            align: "center"
          },
          {
            title: "序号",
            key: "currentIndex",
            minWidth: 100,
            align: "center"
          },
          {
            align: "center",
            title: "名称",
            key: "name",
            minWidth: 400
          },
          {
            align: "center",
            minWidth: 150,
            title: "时间",
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
            minWidth: 200,
            title: "操作",
            render: (h, params) => {
              return h(
                "div",
                {
                  style: {
                    width: "100%",
                    textAlign: "center"
                  }
                },
                [
                  h(
                    "Button",
                    {
                      style: {
                        "margin-right": "10px"
                      },
                      on: {
                        click: () => {
                          this.downloadFile(params.row);
                        }
                      }
                    },
                    this.$t("btn.download")
                  ),
                  h(
                    "Button",
                    {
                      props: {
                        type: "info"
                      },

                      on: {
                        click: () => {
                          window.open(params.row.download_url, "_blank");
                        }
                      }
                    },
                    this.$t("tip.see")
                  )
                ]
              );
            }
          }
        ];

        let data = list.map((item, index) => {
          item.currentIndex = ++index;
          return item;
        });

        this.dataList = data;
      }
    },
    getFilesData() {
      this.$LoadingBar.start();
      this.loading = true;
      let q = this.queryData;
      let data = {
        page_index: q.page_index,
        page_size: q.page_size,
        file_name: q.name,
        remark: q.remark,
        type: q.type
      };

      this.$api.files_base
        .getFiles(data)
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data;
            this.fileDataList = list.data_info;
            this.queryData.count = list.page_count;

            this.setTable();
            this.loading = false;
            this.$LoadingBar.finish();
          }
          this.loading = false;
          this.$LoadingBar.finish();
        })
        .catch(error => {
          this.loading = false;
          this.$LoadingBar.error();
          this.$Message.error(this.$t("tip.requestError"));
        });
    }
  }
};
</script>

<style lang="less" scoped>
.learningMaterials-box {
  .single-page-container;

  .learningMaterials-header {
    .header;
    .header-left {
      float: left;
    }

    .header-right {
      float: right;
    }
  }

  .learningMaterials-body {
    .body;

    .page {
      padding: 20px 0;
      text-align: center;
    }
  }
}
</style>