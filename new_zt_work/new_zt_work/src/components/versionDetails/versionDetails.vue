<!-- 版本详情(组件) -->

<template>
  <Drawer
    :title="$t('leftSidebar.versionDetails')"
    width="350"
    @on-visible-change="onVisibleChange"
    v-model="modelDrawer"
  >
    <div class="version-details-box">
      <div class="device-count">
        <span>
          {{ $t('tip.currentDisplay') }}
          <b>{{ currentCount }}</b>
          {{ $t('tip.number') }}
        </span>
        <span>
          {{ $t('tip.inTotal') }}
          <b>{{ queryData.count }}</b>
          {{ $t('tip.number') }}
        </span>
      </div>
      <Scroll
        height="800"
        :distance-to-edge="[10, 10]"
        :on-reach-bottom="onReachBottom"
        :on-reach-top="onReachTop"
        class="scroll-box"
      >
        <Card class="scroll-card" v-for="item in versionData" :key="item.id">
          <p>
            <strong>V {{item.version}}</strong>
            <b>{{item.create_time}}</b>
          </p>
          <article v-html="item.text"></article>
        </Card>
      </Scroll>
    </div>
  </Drawer>
</template>

<script>
export default {
  name: "versionDetails",
  props: ["drawer1"],
  data() {
    return {
      versionData: [],
      queryData: {
        type: 1,
        page_index: 1,
        page_size: 10,
        count: 0
      },
      modelDrawer: false
    };
  },
  watch: {
    drawer1: function(val) {
      this.modelDrawer = val;
      if (val) {
        this.getVersionData();
      }
    }
  },
  computed: {
    currentCount: function() {
      let q = this.queryData;
      let c = q.page_size * q.page_index;
      let count = q.count;

      if (c >= count) {
        return count;
      } else {
        return c;
      }
    }
  },
  methods: {
    onVisibleChange(val) {
      this.$emit("closeVersionDetails", val);
    },
    onReachTop() {
      return new Promise(resolve => {
        this.queryData.page_index = 1;
        this.getVersionData();

        resolve();
      });
    },
    onReachBottom() {
      return new Promise(resolve => {
        this.queryData.page_index = this.queryData.page_index + 1;
        this.getVersionData();

        resolve();
      });
    },
    getVersionData() {
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
            if (q.page_index === 1) {
              this.versionData = list.data_info;
            } else {
              this.versionData = this.versionData.concat(list.data_info);
            }
            this.queryData.count = list.page_count;
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    }
  }
};
</script>

<style lang="less" scoped>
.version-details-box {
  background: white;
  position: relative;
  overflow: hidden;

  .scroll-box {
    padding-top: 10px;
    width: 100%;

    .scroll-card {
      margin: 10px 5px;
      p {
        padding: 5px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #dcdee2;
      }

      article {
        padding: 5px 15px;
      }
    }
  }
  .device-count {
    position: absolute;
    top: 0;
    left: 0;
    right: 18px;
    padding: 5px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;

    span {
      font-size: 12px;
      color: #bbbbbb;

      b {
        font-size: 10px;
        color: #67c69c;
      }
    }
  }
}
</style>