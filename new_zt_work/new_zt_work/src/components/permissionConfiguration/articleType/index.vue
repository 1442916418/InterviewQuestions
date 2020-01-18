<!-- 文章类型 -->

<template>
  <div class="articleType-box">
    <div class="articleType-header">
      <div class="header-left">
        <ButtonGroup>
          <Button type="primary" icon="md-add" @click="addArticleType">{{$t('btn.newlyAdded')}}</Button>
          <Button type="error" icon="md-trash" @click="deleteArticleType">{{$t('btn.delete')}}</Button>
        </ButtonGroup>
      </div>
      <div class="header-right"></div>
    </div>
    <div class="articleType-body">
      <DefaultTable
        :isPage="true"
        :isSelection="true"
        :columnsList="columnsList"
        :dataList="dataList"
        :loading="loading"
        :queryData="queryData"
        @handleSizeChange="handleSizeChange"
        @handleIndexChange="handleIndexChange"
        @onSelectionChange="onSelectionChange"
      />
    </div>

    <Modal v-model="isAddArticleType" :title="$t('btn.newlyAdded')+$t('leftSidebar.articleType')">
      <div class="add-articelType">
        <div class="item">
          <p>{{ `${$t('tip.pleaseInput')}${$t('tip.articel')}${$t('tip.type')}${$t('tip.name')}` }}</p>
          <Input
            v-model.trim="addData.type_name"
            :placeholder="$t('tip.pleaseInput')+$t('tip.articel')+$t('tip.type')+$t('tip.name')"
          />
        </div>
        <div class="item">
          <p>{{ `${$t('tip.pleaseInput')}${$t('tip.articel')}${$t('tip.type')}${$t('tip.id')}` }}</p>
          <Input-number
            :max="100"
            :min="1"
            v-model.trim="addData.type_id"
            :placeholder="$t('tip.pleaseInput')+$t('tip.articel')+$t('tip.type')+$t('tip.id')"
          ></Input-number>
        </div>
        <div class="item-btn">
          <Button
            style="margin-right:10px;"
            @click="() => isAddArticleType = !isAddArticleType"
          >{{ $t('tip.cancel') }}</Button>
          <Button
            type="primary"
            :loading="addLoading"
            @click="subminAddData"
          >{{ $t('tip.determine') }}</Button>
        </div>
      </div>
    </Modal>

    <Modal v-model="isEditArticleType" :title="$t('tip.edit')">
      <div class="edite-articelType">
        <div class="item">
          <p>{{ `${$t('tip.pleaseInput')}${$t('tip.articel')}${$t('tip.type')}${$t('tip.name')}` }}</p>
          <Input
            v-model.trim="editData.type_name"
            :placeholder="$t('tip.pleaseInput')+$t('tip.articel')+$t('tip.type')+$t('tip.name')"
          />
        </div>
        <div class="item">
          <p>{{ `${$t('tip.pleaseInput')}${$t('tip.articel')}${$t('tip.type')}${$t('tip.id')}` }}</p>
          <Input-number
            :max="100"
            :min="1"
            v-model.trim="editData.type_id"
            :placeholder="$t('tip.pleaseInput')+$t('tip.articel')+$t('tip.type')+$t('tip.id')"
          ></Input-number>
        </div>
        <div class="item-btn">
          <Button
            style="margin-right:10px;"
            @click="() => isEditArticleType = !isEditArticleType"
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
export default {
  name: "articleType",
  data() {
    return {
      isAddArticleType: false,
      isEditArticleType: false,
      addLoading: false,
      loading: false,
      editLoading: false,
      dataList: [],
      selectionData: [],
      addData: {
        type_name: "",
        type_id: 1
      },
      editData: {
        type_name: "",
        type_id: 1,
        _id: 0
      },
      queryData: {
        page_index: 1,
        page_size: 10,
        count: 0
      },
      columnsList: [
        {
          type: "selection",
          minWidth: 60,
          align: "center"
        },
        {
          type: "index",
          minWidth: 80,
          align: "center",
          sortable: true
        },
        {
          title: "类型ID",
          key: "type_id",
          minWidth: 100,
          align: "center",
          sortable: true
        },
        {
          title: "类型名称",
          key: "type_name",
          minWidth: 200,
          align: "center",
          sortable: true
        },
        {
          title: "操作",
          align: "center",
          key: "handle",
          minWidth: 100,
          editable: true,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "info",
                    size: "small"
                  },
                  style: {
                    marginRight: "10px"
                  },
                  on: {
                    click: () => {
                      this.editData = params.row;
                      this.isEditArticleType = !this.isEditArticleType;
                    }
                  }
                },
                this.$t("tip.edit")
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.deleteModal(params.row);
                    }
                  }
                },
                this.$t("btn.delete")
              )
            ]);
          }
        }
      ]
    };
  },
  created() {
    this.getCheckArticleType();
  },
  methods: {
    subminEditData() {
      this.editLoading = true;
      this.$api.learning
        .editArticleType({
          _id: this.editData._id,
          type_name: this.editData.type_name,
          type_id: this.editData.type_id
        })
        .then(res => {
          if (res.data.code === 0) {
            this.editLoading = false;
            this.isEditArticleType = false;
            this.$Message.success(this.$t("tip.editSuccess"));
            this.getCheckArticleType();
          }
          this.editLoading = false;
        })
        .catch(() => {
          this.editLoading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    deleteArticleType() {
      if (this.selectionData.length === 0) {
        this.$Message.warning(
          `${this.$t("tip.pleaseSelect")}${this.$t("tip.data")}`
        );
        return;
      }
      this.subminDeleteData(this.selectionData);
    },
    onSelectionChange(selection) {
      this.selectionData = [];
      this.selectionData = selection;
    },
    subminDeleteData(row) {
      this.loading = true;
      let ids = [];

      if (row instanceof Array) {
        row.map((item, index) => {
          ids.push(item._id);
        });
      } else {
        ids = [row._id];
      }

      this.$api.learning
        .deleteArticleType({
          ids: ids
        })
        .then(res => {
          if (res.data.code === 0) {
            this.loading = false;
            this.$Modal.remove();
            this.$Message.success(this.$t("tip.deleteSuccess"));
            this.getCheckArticleType();
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    deleteModal(row) {
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
                        this.subminDeleteData(row);
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
    handleSizeChange(size) {
      this.queryData.page_index = 1;
      this.queryData.page_size = size;
      this.getCheckArticleType();
    },
    handleIndexChange(index) {
      this.queryData.page_index = index;
      this.getCheckArticleType();
    },
    getCheckArticleType() {
      this.loading = true;
      this.$api.learning
        .checkArticleType({
          page_index: this.queryData.page_index,
          page_size: this.queryData.page_size
        })
        .then(res => {
          if (res.data.code === 0) {
            this.loading = false;
            let list = res.data.data;
            this.dataList = list.data_info;
            this.queryData.count = list.page_count;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    subminAddData() {
      this.addLoading = true;
      this.$api.learning
        .addArticleType({
          type_name: this.addData.type_name,
          type_id: this.addData.type_id
        })
        .then(res => {
          if (res.data.code === 0) {
            this.addLoading = false;
            this.isAddArticleType = false;
            this.$Message.success(this.$t("tip.addSuccess"));
            this.getCheckArticleType();
          }
          this.addLoading = false;
        })
        .catch(() => {
          this.isAddArticleType = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    addArticleType() {
      this.isAddArticleType = !this.isAddArticleType;
    }
  }
};
</script>

<style lang="less" scoped>
.articleType-box {
  .single-page-container;

  .articleType-header {
    .header;

    .header-left {
      float: left;
    }

    .header-right {
      float: right;
      display: flex;
    }
  }

  .articleType-body {
    .body;

    .page {
      text-align: center;
    }
  }
}

.add-articelType,
.edite-articelType {
  width: 100%;
  .item {
    padding: 10px 0;

    p:nth-of-type(1) {
      font-size: 14px;
      padding-bottom: 5px;
    }
  }
  .item-btn {
    padding: 10px 0;
    text-align: right;
  }
}
</style>