<!-- 文章 -->

<template>
  <div class="article-box">
    <div class="article-header">
      <div class="header-left">
        <ButtonGroup>
          <Button type="primary" icon="md-add" @click="addBtn">{{$t('btn.newlyAdded')}}</Button>
          <Button type="error" icon="md-trash" @click="deleteArticle">{{$t('btn.delete')}}</Button>
        </ButtonGroup>
      </div>
      <div class="header-right">
        <Button icon="md-search" @click="clickSearch">{{ $t('btn.search') }}</Button>
      </div>
    </div>
    <div class="article-body">
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

    <Modal
      width="600px"
      @on-visible-change="onVisibleChange"
      v-model="isAdd"
      :title="$t('btn.newlyAdded')"
    >
      <div class="add-box">
        <div class="item">
          <p>{{ `${$t('tip.pleaseSelect')}${$t('leftSidebar.article')}${$t('tip.type')}` }}</p>
          <Select
            v-model="addData.category"
            :placeholder="$t('tip.pleaseSelect')+$t('leftSidebar.article')+$t('tip.type')"
          >
            <Option
              v-for="item in articleTypeData"
              :value="item.type_name"
              :key="item.type_id"
              :label="item.type_name"
            ></Option>
          </Select>
        </div>
        <div class="item">
          <p>{{ `${$t('tip.pleaseSelect')}${$t('tip.isView')}` }}</p>
          <Select
            v-model="addData.encryption"
            :placeholder="$t('tip.pleaseSelect')+$t('tip.isView')"
          >
            <Option
              v-for="item in encryption"
              :value="item.value"
              :key="item.value"
              :label="item.label"
            ></Option>
          </Select>
        </div>
        <div class="item">
          <p>{{ `${$t('tip.pleaseInput')}${$t('leftSidebar.article')}${$t('tip.aTitle')}` }}</p>
          <Input
            clearable
            v-model="addData.headline"
            :placeholder="$t('tip.pleaseInput')+$t('leftSidebar.article')+$t('tip.aTitle')"
          />
        </div>
        <div class="item">
          <p>{{ `${$t('tip.pleaseInput')}${$t('leftSidebar.article')}${$t('tip.content')}` }}</p>
          <div class="add-content" ref="addContent"></div>
        </div>
        <div class="item-btn">
          <Button @click="cancelAddData" style="margin-right:10px;">{{ $t('tip.cancel') }}</Button>
          <Button
            type="primary"
            :loading="addLoading"
            @click="subminAddData"
          >{{ $t('tip.determine') }}</Button>
        </div>
      </div>
    </Modal>

    <Drawer width="300" :closable="false" v-model="isArticleSearch" :title="$t('btn.search')">
      <div class="article-search-box">
        <div class="item">
          <p>{{ $t('tip.isView') }}</p>
          <Select v-model="queryData.encryption" :placeholder="$t('tip.isView')">
            <Option
              v-for="item in encryption"
              :value="item.value"
              :key="item.value"
              :label="item.label"
            ></Option>
          </Select>
        </div>
        <div class="item">
          <p>{{ $t('tip.type') }}</p>
          <Select v-model="queryData.category" :placeholder="$t('tip.type')">
            <Option
              v-for="item in category"
              :value="item.value"
              :key="item.value"
              :label="item.label"
            ></Option>
          </Select>
        </div>
        <div class="drawer-item-btn">
          <Button
            style="margin-bottom:10px"
            long
            type="primary"
            @click="searchArticle"
            :loading="searchLoading"
          >{{$t('btn.search')}}</Button>
          <Button
            style="margin-bottom:10px"
            type="warning"
            @click="clearSelect"
            long
          >{{$t('btn.reset')}}</Button>
          <Button @click="() => isArticleSearch = !isArticleSearch" long>{{ $t('tip.cancel') }}</Button>
        </div>
      </div>
    </Drawer>

    <Modal
      @on-visible-change="onEditVisibleChange"
      width="600px"
      v-model="isEdit"
      :title="$t('tip.edit')"
    >
      <div class="edit-box">
        <div class="item">
          <p>{{ `${$t('tip.pleaseSelect')}${$t('tip.isView')}` }}</p>
          <Select
            v-model="editData.encryption"
            :placeholder="$t('tip.pleaseSelect')+$t('tip.isView')"
          >
            <Option
              v-for="item in encryption"
              :value="item.value"
              :key="item.value"
              :label="item.label"
            ></Option>
          </Select>
        </div>
        <div class="item">
          <p>{{ `${$t('tip.pleaseSelect')}${$t('leftSidebar.article')}${$t('tip.type')}` }}</p>
          <Select
            v-model="editData.category"
            :placeholder="$t('tip.pleaseSelect')+$t('leftSidebar.article')+$t('tip.type')"
          >
            <Option
              v-for="item in articleTypeData"
              :value="item.type_name"
              :key="item.type_id"
              :label="item.type_name"
            ></Option>
          </Select>
        </div>
        <div class="item">
          <p>{{ `${$t('tip.pleaseInput')}${$t('leftSidebar.article')}${$t('tip.aTitle')}` }}</p>
          <Input
            v-model="editData.headline"
            :placeholder="$t('tip.pleaseInput')+$t('leftSidebar.article')+$t('tip.aTitle')"
          />
        </div>
        <div class="item">
          <p>{{ `${$t('tip.pleaseInput')}${$t('leftSidebar.article')}${$t('tip.content')}` }}</p>
          <div class="edit-content" ref="editContent"></div>
        </div>
        <div class="item-btn">
          <Button @click="cancelEidtData" style="margin-right:10px;">{{ $t('tip.cancel') }}</Button>
          <Button
            type="primary"
            :loading="editLoading"
            @click="subminEditData"
          >{{ $t('tip.determine') }}</Button>
        </div>
      </div>
    </Modal>

    <Modal
      width="600px"
      v-model="isArticleCollection"
      :title="$t('tip.see')+$t('btn.collection')+$t('btn.nameList')"
    >
      <div class="article-collection-box">
        <articleCollection :row="articleCollectNameData" @clickMoreData="clickMoreData" />
      </div>
    </Modal>

    <Modal v-model="isArticleComment" :title="$t('tip.see')+$t('btn.comment')" width="600px">
      <div class="article-comment-box">
        <singleComment
          :row="articleCommentData"
          :currentArticleInfo="currentArticleInfo"
          @getNewArticleCommentData="getNewArticleCommentData"
          @getAddArticleCommentData="getAddArticleCommentData"
        />
      </div>
    </Modal>
  </div>
</template>

<script>
import wangEditor from "wangeditor";
import expandRow from "@/pages/article/articleBody";
import articleCollection from "@/pages/collection/articleCollection";
import singleComment from "@/pages/singleComment/index";

export default {
  components: {
    articleCollection,
    singleComment
  },
  data() {
    return {
      isArticleCollection: false,
      isArticleComment: false,
      columnsList: [],
      dataList: [],
      departmentData: [],
      editLoading: false,
      loading: false,
      isAdd: false,
      addLoading: false,
      isArticleSearch: false,
      searchLoading: false,
      isEdit: false,
      articleTypeData: [],
      selectionData: [],
      articleCollectNameData: [],
      articleCommentData: [],
      currentArticleInfo: {},
      addData: {
        encryption: 0,
        category: 1,
        headline: null,
        content: null
      },
      queryData: {
        page_index: 1,
        page_size: 10,
        encryption: -2,
        category: "",
        count: 0
      },
      queryDepartmentData: {
        name: "",
        page_index: 1,
        page_size: 1000
      },
      queryArticleTypeData: {
        page_index: 1,
        page_size: 100
      },
      editData: {
        encryption: 0,
        category: null,
        headline: null,
        content: null,
        _id: null
      },
      queryCollectNameData: {
        _id: null,
        page_index: 1,
        page_size: 100
      },
      queryArticleCommentData: {
        _id: null,
        page_index: 1,
        page_size: 100
      },
      encryption: [
        {
          value: -2,
          label: "全部"
        },
        {
          value: 0,
          label: "可见"
        },
        {
          value: 1,
          label: "不可见"
        }
      ],
      category: [
        {
          value: -2,
          label: "全部"
        },
        {
          value: 1,
          label: "图文"
        },
        {
          value: 2,
          label: "视频"
        }
      ]
    };
  },
  created() {
    this.getCheckArticleType();
    this.getDepartmentData();
    this.getCheckArticleData();
  },
  beforeDestroy() {
    this.isArticleCollection = false;
    this.isArticleComment = false;
    this.dataList = [];
    this.departmentData = [];
    this.loading = false;
    this.isAdd = false;
    this.addLoading = false;
    this.isArticleSearch = false;
    this.searchLoading = false;
    this.isEdit = false;
    this.articleTypeData = [];
    this.selectionData = [];
    this.articleCollectNameData = [];
    this.articleCommentData = [];
    this.currentArticleInfo = {};
    this.addData = {
      encryption: 0,
      category: 1,
      headline: null,
      content: null
    };
    this.queryData = {
      page_index: 1,
      page_size: 10,
      encryption: -2,
      category: -2,
      count: 0
    };
    this.queryDepartmentData = { name: "", page_index: 1, page_size: 1000 };
    this.queryCollectNameData = {
      _id: null,
      page_index: 1,
      page_size: 100
    };
    this.queryArticleCommentData = {
      _id: null,
      page_index: 1,
      page_size: 100
    };
  },
  methods: {
    subminEditData() {
      let d = this.editData;
      if (!this.$RegExp.verifyIsNull(d.headline)) {
        this.$Message.warning(
          `${this.$t("tip.pleaseInput")}${this.$t("tip.title")}`
        );
        return;
      }
      if (!this.$RegExp.verifyIsNull(d.content)) {
        this.$Message.warning(
          `${this.$t("tip.pleaseInput")}${this.$t("tip.content")}`
        );
        return;
      }

      this.editLoading = true;
      let data = {
        encryption: d.encryption,
        category: d.category,
        headline: d.headline,
        content: d.content,
        _id: d._id
      };

      this.$api.learning
        .editArticle(data)
        .then(res => {
          if (res.data.code === 0) {
            this.editLoading = false;
            this.isEdit = false;
            this.$Message.success(this.$t("tip.editSuccess"));
            this.getCheckArticleData();
          }
          this.editLoading = false;
        })
        .catch(() => {
          this.editLoading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    cancelEidtData() {
      this.isEdit = false;
      this.editData = {
        encryption: 0,
        category: null,
        headline: null,
        content: null,
        _id: null
      };
    },
    deleteArticle() {
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
        .deleteArticle({
          ids: ids
        })
        .then(res => {
          if (res.data.code === 0) {
            this.loading = false;
            this.$Modal.remove();
            this.$Message.success(this.$t("tip.deleteSuccess"));
            this.getCheckArticleData();
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
    getCheckArticleType() {
      this.$api.learning
        .checkArticleType({
          page_index: this.queryArticleTypeData.page_index,
          page_size: this.queryArticleTypeData.page_size
        })
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data;
            this.articleTypeData = list.data_info;
          }
        })
        .catch(() => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    clearSelect() {
      let c = this.queryData.count;
      this.queryData = {
        page_index: 1,
        page_size: 10,
        encryption: -2,
        category: -2,
        count: c
      };
    },
    searchArticle() {
      this.getCheckArticleData();
    },
    clickSearch() {
      this.isArticleSearch = !this.isArticleSearch;
    },
    onEditVisibleChange(val) {
      if (!val) {
        this.$refs.editContent.innerHTML = "";
      }
    },
    onVisibleChange(val) {
      if (!val) {
        this.$refs.addContent.innerHTML = "";
      }
    },
    getDepartmentData() {
      let q = this.queryDepartmentData;
      let d = {
        name: q.name,
        page_index: q.page_index,
        page_size: q.page_size
      };

      this.$api.auth_login
        .getDepartmentData(d)
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data;
            this.departmentData = list.data_info;
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    handleSizeChange(val) {
      this.queryData.page_index = 1;
      this.queryData.page_size = val;
      this.getCheckArticleData();
    },
    handleIndexChange(val) {
      this.queryData.page_index = val;
      this.getCheckArticleData();
    },
    defaultTableColumnsList() {
      this.columnsList = [
        {
          type: "selection",
          minWidth: 60,
          fixed: "left",
          align: "center"
        },
        {
          type: "index",
          title: "序号",
          minWidth: 80,
          fixed: "left",
          align: "center",
          sortable: true
        },
        {
          type: "expand",
          minWidth: 50,
          fixed: "left",
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row,
                isHeader: false
              }
            });
          }
        },
        {
          title: "文章标题",
          minWidth: 200,
          align: "center",
          key: "headline",
          sortable: true
        },
        {
          title: "创建时间",
          minWidth: 200,
          align: "center",
          key: "add_time",
          sortable: true,
          render: (h, params) => {
            let t = params.row.add_time,
              v = null;
            v = this.$moment(t)
              .subtract(8, "hour")
              .format("YYYY-MM-DD HH:mm:ss");
            return h("span", v);
          }
        },
        {
          title: "作者",
          minWidth: 120,
          align: "center",
          key: "author",
          sortable: true
        },
        {
          title: "文章类型",
          minWidth: 120,
          align: "center",
          key: "category",
          sortable: true
        },
        {
          title: "部门",
          minWidth: 120,
          align: "center",
          key: "department_id",
          sortable: true,
          render: (h, params) => {
            let d = params.row.department_id,
              dep = this.departmentData,
              v = null;
            for (let i = 0; i < dep.length; i++) {
              if (d === dep[i].id) {
                v = dep[i].name;
              }
            }
            return h("span", v);
          }
        },
        {
          title: "是否可见",
          minWidth: 120,
          align: "center",
          key: "encryption",
          sortable: true,
          render: (h, params) => {
            let e = params.row.encryption,
              enc = this.encryption,
              v = null;
            for (let i = 0; i < enc.length; i++) {
              if (e === enc[i].value) {
                v = enc[i].label;
              }
            }
            return h("span", v);
          }
        },
        {
          fixed: "right",
          title: "操作",
          minWidth: 150,
          align: "center",
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
                      let r = params.row;
                      this.editData = {
                        encryption: r.encryption,
                        category: r.category,
                        headline: r.headline,
                        content: r.content,
                        _id: r._id
                      };
                      this.isEdit = !this.isEdit;
                      this.setEditWangeditor();
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
      ];
    },
    superAnminstratorTabelColumsList() {
      this.columnsList = [
        {
          type: "selection",
          minWidth: 60,
          align: "center",
          fixed: "left"
        },
        {
          type: "index",
          title: "序号",
          minWidth: 80,
          align: "center",
          fixed: "left",
          sortable: true
        },
        {
          type: "expand",
          minWidth: 50,
          fixed: "left",
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row,
                isHeader: false
              }
            });
          }
        },
        {
          title: "文章标题",
          minWidth: 200,
          align: "center",
          key: "headline",
          sortable: true
        },
        {
          title: "创建时间",
          minWidth: 200,
          align: "center",
          key: "add_time",
          sortable: true,
          render: (h, params) => {
            let t = params.row.add_time,
              v = null;
            v = this.$moment(t)
              .subtract(8, "hour")
              .format("YYYY-MM-DD HH:mm:ss");
            return h("span", v);
          }
        },
        {
          title: "作者",
          minWidth: 120,
          align: "center",
          key: "author",
          sortable: true
        },
        {
          title: "文章类型",
          minWidth: 120,
          align: "center",
          key: "category",
          sortable: true
        },
        {
          title: "部门",
          minWidth: 120,
          align: "center",
          key: "department_id",
          sortable: true,
          render: (h, params) => {
            let d = params.row.department_id,
              dep = this.departmentData,
              v = null;
            for (let i = 0; i < dep.length; i++) {
              if (d === dep[i].id) {
                v = dep[i].name;
              }
            }
            return h("span", v);
          }
        },
        {
          title: "是否可见",
          minWidth: 120,
          align: "center",
          key: "encryption",
          sortable: true,
          render: (h, params) => {
            let e = params.row.encryption,
              enc = this.encryption,
              v = null;
            for (let i = 0; i < enc.length; i++) {
              if (e === enc[i].value) {
                v = enc[i].label;
              }
            }
            return h("span", v);
          }
        },
        {
          title: "文章收藏",
          minWidth: 100,
          key: "collect_name",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "info",
                    ghost: true,
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.getCollectNameData(params.row._id);
                    }
                  }
                },
                `${this.$t("tip.see")}${this.$t("btn.collection")}`
              )
            ]);
          }
        },
        {
          title: "文章评论",
          minWidth: 100,
          key: "collect_name",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    ghost: true,
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.currentArticleInfo = params.row;
                      this.getArticleCommentData(params.row._id);
                    }
                  }
                },
                `${this.$t("tip.see")}${this.$t("btn.comment")}`
              )
            ]);
          }
        },
        {
          fixed: "right",
          title: "操作",
          minWidth: 150,
          align: "center",
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
                      let r = params.row;
                      this.editData = {
                        encryption: r.encryption,
                        category: r.category,
                        headline: r.headline,
                        content: r.content,
                        _id: r._id
                      };
                      this.isEdit = !this.isEdit;
                      this.setEditWangeditor();
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
      ];
    },
    clickMoreData() {
      this.queryCollectNameData.page_size =
        this.queryCollectNameData.page_size + 100;
      this.getCollectNameData(this.queryCollectNameData._id);
    },
    getCollectNameData(id) {
      this.queryCollectNameData._id = id;
      let q = this.queryCollectNameData;
      this.$api.learning
        .checkCollectNameData({
          _id: id,
          page_index: q.page_index,
          page_size: q.page_size
        })
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data;
            if (list.collect_details.length === 0) {
              this.$Message.warning(
                `${this.$t("btn.no")}${this.$t("btn.collection")}`
              );
            } else {
              this.articleCollectNameData = list.collect_details;
              this.isArticleCollection = true;
            }
          }
        })
        .catch(() => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    getNewArticleCommentData() {
      this.queryArticleCommentData.page_index = 1;
      this.queryArticleCommentData.page_size = 100;
      this.getArticleCommentData(this.queryArticleCommentData._id);
    },
    getAddArticleCommentData() {
      this.queryArticleCommentData.page_size =
        this.queryArticleCommentData.page_size + 100;
      this.getArticleCommentData(this.queryArticleCommentData._id);
    },
    getArticleCommentData(id) {
      this.queryArticleCommentData._id = id;
      let q = this.queryArticleCommentData;
      this.$api.learning
        .checkArticleCommentData({
          _id: id,
          page_index: q.page_index,
          page_size: q.page_size
        })
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data;
            if (list.comment__details.length === 0) {
              this.$Message.warning(
                `${this.$t("btn.no")}${this.$t("btn.comment")}`
              );
            } else {
              this.articleCommentData = list.comment__details;
              this.isArticleComment = true;
            }
          }
        })
        .catch(() => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    getCheckArticleData() {
      let q = this.queryData;
      let d = {
        page_index: q.page_index,
        page_size: q.page_size,
        encryption: q.encryption,
        category: q.category
      };

      this.$api.learning
        .checkArticle(d)
        .then(res => {
          if (res.data.code === 0) {
            this.isArticleSearch = false;
            let list = res.data.data;

            if (
              list.data_info[0].collect_name === undefined &&
              list.data_info[0].article_comment === undefined
            ) {
              this.defaultTableColumnsList();
            } else {
              this.superAnminstratorTabelColumsList();
            }
            this.dataList = list.data_info;
            this.queryData.count = list.page_count;
          }
          this.isArticleSearch = false;
        })
        .catch(() => {
          this.isArticleSearch = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    addBtn() {
      this.isAdd = !this.isAdd;
      this.setAddWangeditor();
    },
    cancelAddData() {
      this.isAdd = !this.isAdd;
      this.addData = {
        encryption: 0,
        category: 1,
        headline: null,
        content: null
      };
    },
    subminAddData() {
      let d = this.addData;
      if (!this.$RegExp.verifyIsNull(d.headline)) {
        this.$Message.warning(
          `${this.$t("tip.pleaseInput")}${this.$t("tip.title")}`
        );
        return;
      }
      if (!this.$RegExp.verifyIsNull(d.content)) {
        this.$Message.warning(
          `${this.$t("tip.pleaseInput")}${this.$t("tip.content")}`
        );
        return;
      }

      this.addLoading = true;
      let data = {
        encryption: d.encryption,
        category: d.category,
        headline: d.headline,
        content: d.content
      };

      this.$api.learning
        .addArticle(data)
        .then(res => {
          if (res.data.code === 0) {
            this.addLoading = false;
            this.isAdd = !this.isAdd;
            this.$Message.success(this.$t("tip.addSuccess"));
            this.getCheckArticleData();
          }
          this.addLoading = false;
        })
        .catch(() => {
          this.addLoading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    setEditWangeditor() {
      this.editEditor = new wangEditor(this.$refs.editContent);
      this.editEditor.customConfig.uploadImgShowBase64 = true;
      this.editEditor.customConfig.onchange = html => {
        this.editData.content = html;
      };
      this.editEditor.customConfig.menus = [
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
        "redo",
        "image",
        "video"
      ];
      this.editEditor.create();
      this.editEditor.txt.html(this.editData.content);
    },
    setAddWangeditor() {
      this.addEditor = new wangEditor(this.$refs.addContent);
      this.addEditor.customConfig.uploadImgShowBase64 = true;
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
        "redo",
        "image",
        "video"
      ];
      this.addEditor.create();
    }
  }
};
</script>

<style lang="less" scoped>
.article-box {
  .single-page-container;

  .article-header {
    .header;

    .header-left {
      float: left;
    }

    .header-right {
      float: right;
    }
  }

  .article-body {
    .body;
  }
}

.add-box,
.edit-box {
  width: 100%;

  .item {
    padding: 10px 0;

    p {
      padding-bottom: 5px;
    }
  }
}

.item-btn {
  text-align: right;
}

.add-content {
  width: 100%;
}

.article-search-box {
  width: 100%;

  .item {
    padding: 10px 5px;

    p:nth-of-type(1) {
      font-size: 14px;
      padding-bottom: 5px;
    }
  }

  .drawer-item-btn {
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
}

.article-collection-box,
.article-comment-box {
  width: 100%;
  display: inline-block;
}
</style>