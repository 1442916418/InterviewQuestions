<!-- BUG日志 -->

<template>
  <div class="bugLog-box">
    <div class="bugLog-header">
      <div class="header-left">
        <Button
          type="primary"
          icon="md-add"
          @click="() => isShowAddData = !isShowAddData"
        >{{$t('btn.newlyAdded')}}</Button>
      </div>
      <div class="header-right">
        <Select
          v-model="queryData.type"
          style="margin-right: 10px;width:200px;"
          :placeholder="$t('tip.versionType')"
        >
          <Option v-for="item in type" :value="item.value" :key="item.value" :label="item.label"></Option>
        </Select>
        <Select v-model="queryData.level" style="margin-right: 10px;width:200px;">
          <Option v-for="item in level" :value="item.value" :key="item.value" :label="item.label"></Option>
        </Select>
        <Button type="primary" icon="md-search" @click="clickSearch">{{ $t('btn.search') }}</Button>
      </div>
    </div>

    <div class="bugLog-body">
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

    <Modal v-model="isShowAddData" :title="$t('tip.addBugLog')">
      <div class="addData-box">
        <div class="addData-item">
          <p>{{$t('tip.bugLevel')}}</p>
          <Select v-model="addData.level" :placeholder="$t('tip.bugLevel')">
            <Option v-for="item in level" :value="item.value" :key="item.value" :label="item.label"></Option>
          </Select>
        </div>
        <div class="addData-item">
          <p>{{$t('tip.bugType')}}</p>
          <Select v-model="addData.type" :placeholder="$t('tip.bugType')">
            <Option v-for="item in type" :value="item.value" :key="item.value" :label="item.label"></Option>
          </Select>
        </div>
        <div class="addData-item">
          <p>{{$t('tip.bugVersion')}}</p>
          <Input v-model="addData.version" :placeholder="$t('tip.bugVersion')" />
        </div>
        <div class="addData-item">
          <p>{{$t('tip.bugContent')}}</p>
          <div class="addEditor" ref="addEditor"></div>
        </div>
        <div class="modal-item-btn">
          <Button
            style="margin-right:10px;"
            @click="() => isShowAddData = !isShowAddData"
          >{{ $t('tip.cancel') }}</Button>
          <Button type="primary" @click="subminAddData">{{ $t('tip.determine') }}</Button>
        </div>
      </div>
    </Modal>

    <Modal v-model="isShowEditData" :title="$t('btn.edit')">
      <div class="addData-box">
        <div class="addData-item">
          <p>{{$t('tip.bugLevel')}}</p>
          <Select v-model="editData.level" :placeholder="$t('tip.bugLevel')">
            <Option v-for="item in level" :value="item.value" :key="item.value" :label="item.label"></Option>
          </Select>
        </div>
        <div class="addData-item">
          <p>{{$t('tip.bugType')}}</p>
          <Select v-model="editData.type" :placeholder="$t('tip.bugType')">
            <Option v-for="item in type" :value="item.value" :key="item.value" :label="item.label"></Option>
          </Select>
        </div>
        <div class="addData-item">
          <p>{{$t('tip.bugVersion')}}</p>
          <Input v-model="editData.version" :placeholder="$t('tip.bugVersion')" />
        </div>
        <div class="addData-item">
          <p>{{$t('tip.bugContent')}}</p>
          <div class="eidtEditor" ref="eidtEditor"></div>
        </div>
        <div class="modal-item-btn">
          <Button
            style="margin-right:10px;"
            @click="() => isShowEditData = !isShowEditData"
          >{{ $t('tip.cancel') }}</Button>
          <Button type="primary" @click="subminEditData">{{ $t('tip.determine') }}</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import wangEditor from "wangeditor";

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
        click: function(event) {
          event.preventDefault();

          vm.editData.id = currentRow.id;
          vm.editData.content = currentRow.content;
          vm.editData.type = currentRow.type;
          vm.editData.version = currentRow.version;
          vm.editData.level = currentRow.level;
          vm.setEditWangeditor();
          vm.isShowEditData = true;
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

let repairButton = function(vm, h, currentRow, index) {
  return h(
    "Poptip",
    {
      props: {
        confirm: true,
        title:
          currentRow.status === 0
            ? vm.$t("tip.markNotRepairStatus")
            : currentRow.status === 1
            ? vm.$t("tip.markRepairedStatus")
            : vm.$t("btn.deleted"),
        transfer: true,
        placement: "left",
        cancelText: vm.$t("btn.cancel"),
        okText: vm.$t("btn.determine")
      },
      style: {
        margin: "0 5px"
      },
      on: {
        "on-ok": function() {
          vm.repairData(currentRow, index);
        }
      }
    },
    [
      h(
        "Button",
        {
          props: {
            size: "small",
            type:
              currentRow.status === 0
                ? "warning"
                : currentRow.status === 1
                ? "info"
                : "text"
          }
        },
        currentRow.status === 0
          ? vm.$t("btn.noRepair")
          : currentRow.status === 1
          ? vm.$t("btn.repair")
          : vm.$t("btn.deleted")
      )
    ]
  );
};

export default {
  name: "bugLog",
  data() {
    return {
      isShowEditData: false,
      editData: {
        id: null,
        content: null,
        type: null,
        version: null,
        level: null
      },
      queryData: {
        type: 1,
        level: -2,
        page_index: 1,
        page_size: 10,
        count: 0
      },
      dataList: [],
      cloneDataList: [],
      loading: false,
      isShowAddData: false,
      addEditor: null,
      editor2: null,
      columnsList: [
        {
          title: "序号",
          type: "index",
          minWidth: 60,
          flxed: "left",
          align: "center"
        },
        {
          title: "版本",
          key: "version",
          minWidth: 100,
          align: "center"
        },
        {
          title: "类型",
          type: "type",
          minWidth: 100,
          align: "center",
          render: (h, params) => {
            let t = params.row.type,
              s = null,
              txt = ["平台", "app", "接口"];
            if (t === 1) {
              s = txt[0];
            } else if (t === 2) {
              s = txt[1];
            } else if (t === 3) {
              s = txt[2];
            }
            return h("span", s);
          }
        },
        {
          title: "等级",
          type: "level",
          minWidth: 100,
          align: "center",
          render: (h, params) => {
            let k = null,
              color = null,
              t = params.row.level;
            for (let i = 0; i < this.level.length; i++) {
              if (t === this.level[i].value) {
                k = this.level[i].label;
              }
            }

            if (t === 1 || t === 2) {
              color = "#ed4014";
            } else if (t === 3) {
              color = "#ff7654";
            } else {
              color = "#ff8e72";
            }

            return h(
              "span",
              {
                style: {
                  color: color
                }
              },
              k
            );
          }
        },
        {
          title: "状态",
          type: "status",
          minWidth: 100,
          align: "center",
          render: (h, params) => {
            let s = null,
              color = null,
              t = params.row.status,
              txt = ["已修复", "未修复", "删除"];
            if (t === 0) {
              s = txt[0];
              color = "#19be6b";
            } else if (t === 1) {
              s = txt[1];
              color = "#ed4014";
            } else if (t === 2) {
              s = txt[2];
              color = "#fbd54a";
            }
            return h(
              "span",
              {
                style: {
                  color: color
                }
              },
              s
            );
          }
        },
        {
          title: "创建时间",
          type: "create_time",
          minWidth: 200,
          align: "center",
          editable: true,
          render: (h, params) => {
            let ct =
              params.row.create_time === null
                ? ""
                : this.$moment(params.row.create_time)
                    .subtract(8, "hour")
                    .format("YYYY-MM-DD HH:mm:ss");
            return h(
              "span",
              {
                style: {
                  color: "#999"
                }
              },
              ct
            );
          }
        },
        {
          title: "修改时间",
          type: "update_time",
          minWidth: 200,
          align: "center",
          render: (h, params) => {
            let ct =
              params.row.update_time === null
                ? ""
                : this.$moment(params.row.update_time)
                    .subtract(8, "hour")
                    .format("YYYY-MM-DD HH:mm:ss");
            return h(
              "span",
              {
                style: {
                  color: "#666"
                }
              },
              ct
            );
          }
        },
        {
          title: "修复时间",
          type: "repair_time",
          minWidth: 200,
          align: "center",
          render: (h, params) => {
            let ct =
              params.row.repair_time === null
                ? ""
                : this.$moment(params.row.repair_time)
                    .subtract(8, "hour")
                    .format("YYYY-MM-DD HH:mm:ss");
            return h(
              "span",
              {
                style: {
                  color: "#333"
                }
              },
              ct
            );
          }
        },
        {
          title: "内容",
          type: "content",
          minWidth: 240,
          align: "center",
          render: (h, params) => {
            return h("article", {
              domProps: {
                innerHTML: params.row.content
              }
            });
          }
        },
        {
          title: "操作",
          align: "center",
          key: "handle",
          minWidth: 240,
          editable: true,
          handle: ["repair", "edit", "delete"]
        }
      ],
      addData: {
        content: null,
        type: 1,
        version: null,
        level: 1
      },
      level: [
        {
          value: -2,
          label: "全部"
        },
        {
          value: 1,
          label: "S级/紧急"
        },
        {
          value: 2,
          label: "A级/严重"
        },
        {
          value: 3,
          label: "B级/较严重"
        },
        {
          value: 4,
          label: "C级/一般"
        }
      ],
      type: [
        {
          value: 1,
          label: "平台"
        },
        {
          value: 2,
          label: "App"
        },
        {
          value: 3,
          label: "接口"
        }
      ]
    };
  },
  created() {
    this.getBugLog();
    this.setTableBugLog();
  },
  mounted() {
    this.setAddWangeditor();
  },
  beforeDestroy() {
    this.isShowEditData = false;
    this.editData = {
      id: null,
      content: null,
      type: null,
      version: null,
      level: null
    };
    this.queryData = {
      type: 1,
      level: -2,
      page_index: 1,
      page_size: 10,
      count: 0
    };
    this.dataList = [];
    this.cloneDataList = [];
    this.tableHeight = 520;
    this.loading = false;
    this.isShowAddData = false;
    this.addEditor = null;
    this.editor2 = null;
  },
  methods: {
    handleSizeChange(val) {
      this.queryData.page_index = 1;
      this.queryData.page_size = val;
      this.getBugLog();
      this.setTableBugLog();
    },
    handleIndexChange(val) {
      this.queryData.page_index = val;
      this.getBugLog();
      this.setTableBugLog();
    },
    clickSearch() {
      this.queryData.page_index = 1;
      this.getBugLog();
      this.setTableBugLog();
    },
    repairData(row, index) {
      this.loading = true;
      if (row.status === 0) {
        this.$api.files_base
          .noRepairBug({
            id: row.id
          })
          .then(res => {
            if (res.data.code === 0) {
              this.$Message.success(this.$t("tip.openRepairState"));
              this.Loading = false;
              this.getBugLog();
              this.setTableBugLog();
            }
            this.Loading = false;
          })
          .catch(error => {
            this.Loading = false;
            this.$Message.error(this.$t("tip.requestError"));
          });
      } else if (row.status === 1) {
        this.$api.files_base
          .repairBug({
            id: row.id
          })
          .then(res => {
            if (res.data.code === 0) {
              this.$Message.success(this.$t("tip.repairSuccess"));
              this.Loading = false;
              this.getBugLog();
              this.setTableBugLog();
            }
            this.Loading = false;
          })
          .catch(error => {
            this.Loading = false;
            this.$Message.error(this.$t("tip.requestError"));
          });
      }
    },
    subminEditData() {
      let e = this.editData;
      let d = {
        id: e.id,
        content: e.content,
        type: e.type,
        version: e.version,
        level: e.level
      };

      this.$api.files_base
        .editBugLog(d)
        .then(res => {
          if (res.data.code === 0) {
            this.$Message.success(this.$t("tip.editSuccess"));
            this.isShowEditData = false;
            this.loading = false;
            this.getBugLog();
            this.setTableBugLog();
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
    handleBackdata(object) {
      var clonedData = JSON.parse(JSON.stringify(object));
      delete clonedData.editting;
      delete clonedData.saving;
      return clonedData;
    },
    deleteData(row, index) {
      this.loading = true;
      this.$api.files_base
        .deleteBugLog({
          id: row.id
        })
        .then(res => {
          if (res.data.code === 0) {
            this.$Message.success(this.$t("tip.deleteSuccess"));
            this.loading = false;
            this.getBugLog();
            this.setTableBugLog();
          }
        })
        .catch(error => {
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    setTableBugLog() {
      let that = this;
      this.columnsList.forEach(function(item, index) {
        if (item.handle) {
          item.render = function(h, param) {
            var currentRow = that.cloneDataList[param.index];
            var children = [];
            item.handle.forEach(function(item) {
              if (item === "repair") {
                children.push(repairButton(that, h, currentRow, param.index));
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
    getBugLog() {
      let q = this.queryData;
      let d = {
        type: q.type,
        level: q.level,
        page_index: q.page_index,
        page_size: q.page_size
      };

      this.$api.files_base
        .getBugLogData(d)
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data;
            this.dataList = list.data_info;
            this.queryData.count = list.page_count;

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
    subminAddData() {
      this.loading = true;
      let add = this.addData;
      let d = {
        content: add.content,
        type: add.type,
        version: add.version,
        level: add.level
      };

      this.$api.files_base
        .addBugLog(d)
        .then(res => {
          if (res.data.code === 0) {
            this.$Message.success(this.$t("tip.addSuccess"));
            this.isShowAddData = false;
            this.loading = false;

            this.getBugLog();
            this.setTableBugLog();
          }
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    setEditWangeditor() {
      this.editor2 = new wangEditor(this.$refs.eidtEditor);
      this.editor2.customConfig.onchange = html => {
        this.editData.content = html;
      };
      this.editor2.customConfig.menus = [
        "head",
        "bold",
        "fontSize",
        "fontName",
        "italic",
        "underline",
        "strikeThrough",
        "foreColor",
        "backColor",
        "list",
        "justify",
        "code",
        "undo",
        "redo"
      ];
      this.editor2.create();
      this.editor2.txt.html(this.editData.content);
    },
    setAddWangeditor() {
      this.addEditor = new wangEditor(this.$refs.addEditor);
      this.addEditor.customConfig.onchange = html => {
        this.addData.content = html;
      };
      this.addEditor.customConfig.menus = [
        "head",
        "bold",
        "fontSize",
        "fontName",
        "italic",
        "underline",
        "strikeThrough",
        "foreColor",
        "backColor",
        "list",
        "justify",
        "code",
        "undo",
        "redo"
      ];
      this.addEditor.create();
    }
  }
};
</script>

<style lang="less" scoped>
.bugLog-box {
  .single-page-container;

  .bugLog-header {
    .header;

    .header-left {
      float: left;
    }

    .header-right {
      float: right;
      display: flex;
    }
  }

  .bugLog-body {
    .body;

    .page {
      text-align: center;
    }
  }
}

.addData-box {
  width: 100%;
  padding: 5px;

  .addData-item {
    width: 100%;
    padding: 10px 0;

    p {
      font-size: 14px;
      padding-bottom: 5px;
    }
  }
  .modal-item-btn {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>