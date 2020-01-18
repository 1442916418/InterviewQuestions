<!-- 考试成绩 -->

<template>
  <div class="testScores-box">
    <div class="testScores-body">
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
  </div>
</template>

<script>
export default {
  name: "testScores",
  data() {
    return {
      dataList: [],
      userData: [],
      loading: false,
      queryData: {
        page_index: 1,
        page_size: 10,
        count: 0
      },
      queryUserData: {
        real_name: "",
        mobile: "",
        role_id: -2,
        department_id: -2,
        page_index: 1,
        page_size: 1000
      },
      columnsList: [
        {
          type: "index",
          title: "序号",
          align: "center",
          minWidth: 80,
          sortable: true
        },
        {
          title: "试卷名称",
          align: "center",
          key: "test_paper_name",
          minWidth: 200,
          sortable: true
        },
        {
          title: "用户",
          align: "center",
          key: "user_id",
          minWidth: 100,
          sortable: true,
          render: (h, params) => {
            let u = params.row.user_id,
              us = this.userData,
              v = null;
            for (let i = 0; i < us.length; i++) {
              if (u === us[i].id) {
                v = us[i].real_name;
              }
            }
            return h("span", v);
          }
        },
        {
          title: "考试分数",
          align: "center",
          key: "Score",
          minWidth: 100,
          sortable: true
        }
      ]
    };
  },
  created() {
    this.getUserData();
    this.getCheckTestScores();
  },
  beforeDestroy() {
    this.dataList = [];
    this.userData = [];
    this.loading = false;
    this.queryData = {
      page_index: 1,
      page_size: 10,
      count: 0
    };
    this.queryUserData = {
      real_name: "",
      mobile: "",
      role_id: -2,
      department_id: -2,
      page_index: 1,
      page_size: 1000
    };
  },
  methods: {
    getUserData() {
      let q = this.queryUserData;
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
            this.userData = [];
            let list = res.data.data.data_info;

            this.userData = list;
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    getCheckTestScores() {
      this.$api.learning
        .checkTestScores({
          page_index: this.queryData.page_index,
          page_size: this.queryData.page_size
        })
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data;

            this.dataList = list.data_info;
            this.queryData.count = list.page_count;
          }
        })
        .catch(() => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    handleSizeChange(size) {
      this.queryData.page_index = 1;
      this.queryData.page_size = size;
    },
    handleIndexChange(index) {
      this.queryData.page_index = index;
    }
  }
};
</script>

<style lang="less" scoped>
.testScores-box {
  .single-page-container;

  .testScores-body {
    .body;
  }
}
</style>