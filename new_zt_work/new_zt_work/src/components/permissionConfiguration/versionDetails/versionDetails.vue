<!-- 版本详情(管理) -->

<template>
  <div class="versionDetail-box">
    <div class="versionDetail-header">
      <div class="header-left">
        <Button type="info" icon="md-add" @click="clickAddData">{{$t('btn.newlyAdded')}}</Button>
      </div>
      <div class="header-right">
        <Select
          v-model="queryData.type"
          style="margin-right: 10px;width:200px;"
          :placeholder="$t('tip.versionType')"
          @on-change="changeType"
        >
          <Option v-for="item in type" :value="item.value" :key="item.value" :label="item.label"></Option>
        </Select>
      </div>
    </div>
    <div class="versionDetail-body">
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

    <Modal v-model="isShowAddData" :title="$t('tip.addVerison')">
      <div class="modal-box">
        <div class="modal-item">
          <p>{{ $t('tip.versionNumber') }}</p>
          <Input v-model="addData.version" :placeholder="$t('tip.versionNumber')" />
        </div>
        <div class="modal-item">
          <p>{{ $t('tip.versionType') }}</p>
          <Select v-model="addData.type" :placeholder="$t('tip.versionType')">
            <Option v-for="item in type" :value="item.value" :key="item.value" :label="item.label"></Option>
          </Select>
        </div>
        <div class="modal-item">
          <p>{{ $t('tip.versionSort') }}</p>
          <Input-number
            :max="1000"
            :min="1"
            v-model="addData.sort"
            :placeholder="$t('tip.versionSort')"
          ></Input-number>
        </div>
        <div class="modal-item">
          <p>{{ $t('tip.versionText') }}</p>
          <div class="wangeditor" ref="wangeditor"></div>
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

    <Modal v-model="isShowEditData" :title="$t('tip.editVerison')">
      <div class="modal-box">
        <div class="modal-item">
          <p>{{ $t('tip.versionNumber') }}</p>
          <Input v-model="editData.version" :placeholder="$t('tip.versionNumber')" />
        </div>
        <div class="modal-item">
          <p>{{ $t('tip.versionType') }}</p>
          <Select v-model="editData.type" :placeholder="$t('tip.versionType')">
            <Option v-for="item in type" :value="item.value" :key="item.value" :label="item.label"></Option>
          </Select>
        </div>
        <div class="modal-item">
          <p>{{ $t('tip.versionSort') }}</p>
          <Input-number
            :max="1000"
            :min="1"
            v-model="editData.sort"
            :placeholder="$t('tip.versionSort')"
          ></Input-number>
        </div>
        <div class="modal-item">
          <p>{{ $t('tip.versionText') }}</p>
          <div class="editWangeditor" ref="editWangeditor"></div>
        </div>
        <div class="modal-item-btn">
          <Button
            style="margin-right:10px;"
            @click="() => isShowEditData = !isShowEditData"
          >{{ $t('tip.cancel') }}</Button>
          <Button
            type="primary"
            :loading="editLoading"
            @click="subminEditData"
          >{{ $t('tip.determine') }}</Button>
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
          vm.editData.version = currentRow.version;
          vm.editData.text = currentRow.text;
          vm.editData.sort = currentRow.sort;
          vm.editData.type = currentRow.type;
          vm.setEditWangeditor();

          vm.isShowEditData = !vm.isShowEditData;
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
  name: "versionDetails",
  data() {
    return {
      isShowAddData: false,
      isShowEditData: false,
      editLoading: false,
      editor: null,
      editor2: null,
      queryData: {
        type: 1,
        page_index: 1,
        page_size: 10,
        count: 0
      },
      loading: false,
      dataList: [],
      cloneDataList: [],
      addData: {
        version: null,
        text: null,
        sort: null,
        type: 1
      },
      editData: {
        id: null,
        version: null,
        text: null,
        sort: null,
        type: null
      },
      type: [
        {
          value: 1,
          label: "平台"
        },
        {
          value: 2,
          label: "App"
        }
      ],
      columnsList: [
        {
          title: "序号",
          type: "index",
          minWidth: 60,
          flxed: "left",
          align: "center"
        },
        {
          align: "center",
          title: "创建时间",
          key: "create_time",
          minWidth: 200,
          flxed: "left"
        },
        {
          align: "center",
          title: "版本号",
          key: "version",
          flxed: "left",
          minWidth: 100,
          editable: true
        },
        {
          align: "center",
          title: "排序等级",
          key: "sort",
          minWidth: 100,
          editable: true
        },
        {
          align: "center",
          title: "类型",
          key: "type",
          option: true,
          minWidth: 100,
          editable: true
        },
        {
          align: "center",
          title: "内容",
          minWidth: 300,
          key: "text",
          wangEditor: true,
          editable: true
        },
        {
          title: "操作",
          align: "center",
          key: "handle",
          minWidth: 150,
          handle: ["edit", "delete"]
        }
      ]
    };
  },
  created() {
    this.isShowAddData = false;
    this.getVersionData();
    this.setTableStyleAndData();
  },
  mounted() {
    this.setAddWangeditor();
  },
  beforeDestroy() {
    this.isShowAddData = false;
    this.isShowEditData = false;
    this.editLoading = false;
    this.editor = null;
    this.editor2 = null;
    this.queryData = {
      type: 1,
      page_index: 1,
      page_size: 10,
      count: 0
    };
    this.loading = false;
    this.dataList = [];
    this.cloneDataList = [];
    this.addData = {
      version: null,
      text: null,
      sort: null,
      type: 1
    };
    this.editData = {
      id: null,
      version: null,
      text: null,
      sort: null,
      type: null
    };
  },
  methods: {
    changeType(value) {
      this.queryData.type = value;
      this.queryData.page_index = 1;

      this.getVersionData();
      this.setTableStyleAndData();
    },
    handleSizeChange(val) {
      this.queryData.page_index = 1;
      this.queryData.page_size = val;
      this.getVersionData();
      this.setTableStyleAndData();
    },
    handleIndexChange(val) {
      this.queryData.page_index = val;
      this.getVersionData();
      this.setTableStyleAndData();
    },
    setEditWangeditor() {
      this.editor2 = new wangEditor(this.$refs.editWangeditor);
      this.editor2.customConfig.onchange = h => {
        this.editData.text = h;
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
      this.editor2.txt.html(this.editData.text);
    },
    setAddWangeditor() {
      this.editor = new wangEditor(this.$refs.wangeditor);
      this.editor.customConfig.onchange = html => {
        this.addData.text = html;
      };
      this.editor.customConfig.menus = [
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
      this.editor.create();
    },
    subminAddData() {
      this.loading = true;
      let add = this.addData;
      let d = {
        version: add.version,
        text: add.text,
        sort: add.sort,
        type: add.type
      };

      this.$api.monitor1
        .addVersion(d)
        .then(res => {
          if (res.data.code === 0) {
            this.$Message.success(this.$t("tip.addSuccess"));
            this.loading = false;
            this.isShowAddData = false;

            this.getVersionData();
            this.setTableStyleAndData();
          }
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    clickAddData() {
      this.isShowAddData = !this.isShowAddData;
    },
    handleBackdata(object) {
      var clonedData = JSON.parse(JSON.stringify(object));
      delete clonedData.editting;
      delete clonedData.saving;
      return clonedData;
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
    subminEditData() {
      this.editLoading = true;
      let e = this.editData;
      let d = {
        id: e.id,
        version: e.version,
        text: e.text,
        sort: e.sort,
        type: e.type
      };

      this.$api.monitor1
        .editVersion(d)
        .then(res => {
          if (res.data.code === 0) {
            this.$Message.success(this.$t("tip.editSuccess"));
            this.editLoading = false;
            this.isShowEditData = false;
            this.getVersionData();
            this.setTableStyleAndData();
          }
          this.editLoading = false;
        })
        .catch(error => {
          this.editLoading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    deleteData(row, index) {
      this.loading = true;
      this.$api.monitor1
        .deleteVersion({
          id: row.id
        })
        .then(res => {
          if (res.data.code === 0) {
            this.$Message.success(this.$t("tip.deleteSuccess"));
            this.loading = false;
            this.getVersionData();
            this.setTableStyleAndData();
          }
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    setTableStyleAndData() {
      let that = this;
      this.columnsList.forEach(function(item, index) {
        if (item.editable) {
          item.render = function(h, params) {
            let currentRow = that.cloneDataList[params.index];

            if (!currentRow.editting) {
              if (item.key === "type") {
                let a = null;
                if (currentRow["type"] === 1) {
                  a = "平台";
                } else {
                  a = "App";
                }
                return h("span", a);
              }

              if (item.key === "text") {
                return h("article", {
                  domProps: {
                    innerHTML: currentRow["text"]
                  }
                });
              }

              return h("span", currentRow[item.key]);
            }
          };
        }

        if (item.handle) {
          item.render = function(h, param) {
            var currentRow = that.cloneDataList[param.index];
            var children = [];
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
    getVersionData() {
      this.loading = true;
      let q = this.queryData;
      let data = {
        type: q.type,
        page_index: q.page_index,
        page_size: q.page_size
      };

      this.$api.monitor1
        .getVersionData(data)
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data;
            this.dataList = list.data_info;
            this.queryData.count = list.page_count;

            this.cloneDataList = JSON.parse(
              JSON.stringify(res.data.data.data_info)
            ).map(function(item) {
              item.editting = false;
              item.saving = false;
              return item;
            });

            this.loading = false;
          }
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    }
  }
};
</script>

<style lang="less" scoped>
.versionDetail-box {
  .single-page-container;

  .versionDetail-header {
    .header;

    .header-left {
      float: left;
    }

    .header-right {
      float: right;
      display: flex;
    }
  }

  .versionDetail-body {
    .body;

    .page {
      text-align: center;
    }
  }
}
.modal-box {
  width: 100%;

  .modal-item {
    margin: 10px;
    font-size: 14px;

    p {
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