<!-- 公用手动分页 -->

<template>
  <div class="paging-box">
    <div class="page">
      <ButtonGroup>
        <Button @click="previousPage">
          <Icon type="ios-arrow-back"></Icon>
          {{$t('btn.previousPage')}}
        </Button>
        <Button>{{$t('btn.the')}}{{queryData.page_index}}{{$t('btn.page')}}</Button>
        <Button @click="nextPage">
          {{$t('btn.nextPage')}}
          <Icon type="ios-arrow-forward"></Icon>
        </Button>
      </ButtonGroup>

      <Select
        @on-change="selectPage"
        v-model="queryData.page_size"
        style="width:100px;margin-left:10px;"
      >
        <Option v-for="item in pageList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    queryData: Object
  },
  data() {
    return {
      pageList: this.$glb.elementSelectDefaultPageSizes
    };
  },
  methods: {
    previousPage() {
      this.$emit("previousPage");
    },
    nextPage() {
      this.$emit("nextPage");
    },
    selectPage(size) {
      this.$emit("selectPage", size);
    }
  }
};
</script>

<style lang="less" scoped>
.paging-box {
  width: 100%;

  .page {
    padding: 10px 0;
    text-align: center;
  }
}
</style>