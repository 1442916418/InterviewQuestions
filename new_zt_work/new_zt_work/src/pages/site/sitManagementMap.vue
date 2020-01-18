<!-- 选择经纬度模块 -->

<template>
  <div class="baidu-map-box">
    <div class="map-button">
      <Input
        v-model="currentLocationInfo"
        style="margin-right: 10px"
        :placeholder="$t('tip.pleaseFillInTheDetailedAddress')"
        @on-enter="addressEnter"
      />
      <Button
        @click="currentLocation"
        :loading="currentLocationLoading"
      >{{$t('btn.currentLocation')}}</Button>
    </div>
    <baidu-map
      @ready="handler"
      @click="baiduMapClick"
      class="baidu-map"
      :center="center"
      :zoom="15"
      keyboard
      dragging
      double-click-zoom
      scroll-wheel-zoom
    >
      <bm-marker :position="center" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
        <bm-label :content="$t('tip.clickSelectLocation')" :offset="{white: 100,height: -40}" />
      </bm-marker>
    </baidu-map>
  </div>
</template>
 
<script>
export default {
  props: ["center", "location", "currentLocationLoading"],
  data() {
    return {
      currentLocationInfo: ""
    };
  },
  watch: {
    location(newVal, oldVal) {
      this.currentLocationInfo = newVal;
    }
  },
  methods: {
    baiduMapClick({ type, target, point, pixel, overlay }) {
      this.$emit("baiduMapClick", type, target, point, pixel, overlay);
    },
    handler({ BMap, map }) {
      this.$emit("initMap", BMap, map);
    },
    addressEnter() {
      this.$emit("addressEnter", this.currentLocationInfo);
    },
    currentLocation() {
      this.$emit("currentLocation");
    }
  }
};
</script>

<style lang="less" scoped>
.baidu-map-box {
  width: 1000px;
  height: 600px;
  background-color: white;

  .map-button {
    padding: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .baidu-map {
    width: 100%;
    height: calc(100% - 80px);
  }
}
</style>