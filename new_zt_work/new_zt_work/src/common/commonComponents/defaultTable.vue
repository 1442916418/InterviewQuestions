<!-- 公用表格 -->

<template>
  <div class="table-box">
    <div v-if="isSelection">
      <Table
        id="table"
        ref="table"
        :columns="columnsList"
        :data="dataList"
        :height="tableHeight"
        :loading="loading"
        @on-selection-change="onSelectionChange"
      ></Table>
    </div>
    <div v-else>
      <Table
        id="table"
        ref="table"
        :columns="columnsList"
        :data="dataList"
        :height="tableHeight"
        :loading="loading"
      ></Table>
    </div>

    <div v-if="isPage">
      <div class="page" v-if="queryData.count >= 10">
        <Page
          :total="queryData.count"
          :current="queryData.page_index"
          :page-size="queryData.page_size"
          :page-size-opts="pageSizes"
          placement="top"
          show-total
          show-elevator
          show-sizer
          @on-change="onChangePage"
          @on-page-size-change="onPageSizeChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isSelection: Boolean,
    isPage: Boolean,
    columnsList: Array,
    dataList: Array,
    loading: Boolean,
    queryData: Object
  },
  data() {
    return {
      pageSizes: this.$glb.tableDefaultPageSizes,
      tableHeight: 520,
      isChangeIndex: false
    };
  },
  mounted() {
    this.tableHeight =
      window.innerHeight -
      this.$refs.table.$el.offsetTop -
      this.$glb.tableDefaultHeight;
  },
  methods: {
    onSelectionChange(selection) {
      this.$emit("onSelectionChange", selection);
    },
    onChangePage(index) {
      if (this.isChangeIndex) {
        this.isChangeIndex = false;
        return;
      }
      this.$emit("handleIndexChange", index);
    },
    onPageSizeChange(size) {
      if (this.queryData.page_index !== 1) {
        this.isChangeIndex = true;
      }
      this.$emit("handleSizeChange", size);
    }
  }
};
</script>

<style lang="less" scoped>
.table-box {
  width: 100%;
  height: 100%;

  .page {
    padding: 10px;
    text-align: center;
  }
}
</style>
