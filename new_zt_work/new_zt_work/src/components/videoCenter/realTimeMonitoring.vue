<!-- 实时监控 -->

<template>
  <div class="realTimeMonitoring-box">
    <div class="realTimeMonitoring-header">
      <div class="header-left"></div>
      <div class="header-right">
        <SelectDevice @changeMn="selectDeviceMn" @initMn="initMn"></SelectDevice>
        <Select filterable v-model="queryData.dvr_id" style="width:200px;margin-right:10px;">
          <Option v-for="item in dvrData" :value="item.id" :key="item.name">{{ item.name }}</Option>
        </Select>
        <Button type="primary" @click="query">{{$t('btn.query')}}</Button>
      </div>
    </div>
    <div class="realTimeMonitoring-body">
      <div class="body-left">
        <div class="body-left-card">
          <Card
            style="width:170px"
            class="card-box"
            v-for="(item, index) in videoData"
            :key="index"
          >
            <div class="card-body-box" @click="clickCard(item)">
              <img :src="item.img_url" width="120" height="80" style="margin: 5px;" />
              <div class="card-div-box">
                <p>
                  <span>{{ item.dvr_name }}</span>
                  <span>{{ item.channel_num }}</span>
                </p>
                <p>
                  <span
                    :style="{color: item.status === 0 ? '#41b883' : '#515a6e'}"
                  >已{{ item.status === 0 ? $t('tip.open') : $t('tip.close') }}</span>
                </p>
                <p>{{ setTime(item.save_time) }}</p>
              </div>
            </div>
          </Card>
        </div>

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
            @on-change="handleIndexChange"
            @on-page-size-change="handleSizeChange"
          />
        </div>
      </div>
      <div class="body-right">
        <video
          id="my-player"
          class="video-js vjs-default-skin vjs-big-play-centered vjs-fluid"
          preload="auto"
          autoplay
          controls
          data-setup="{}"
        ></video>
        <div class="video-info">
          <div class="info-box" v-if="singleInfo != null">
            <p>
              <span>硬盘机名称</span>
              <br />
              <span>{{ singleInfo.dvr_name }}</span>
            </p>
            <p>
              <span>通道号</span>
              <br />
              <span>{{ singleInfo.channel_num }}</span>
            </p>
            <p>
              <span>状态</span>
              <br />
              <span>已{{ singleInfo.status === 0 ? $t('tip.open') : $t('tip.close') }}</span>
            </p>
            <p>
              <span>设备名称</span>
              <br />
              <span>{{ setDeviceName(singleInfo.channel_num) }}</span>
            </p>
            <p>
              <span>录制开始时间</span>
              <br />
              <span>{{ setUnixTime(singleInfo.start_time) }}</span>
            </p>
            <p>
              <span>录制结束时间</span>
              <br />
              <span>{{ setUnixTime(singleInfo.end_time) }}</span>
            </p>
            <p>
              <span>保存时间</span>
              <br />
              <span>{{ setTime(singleInfo.save_time) }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import videojs from "video.js";
import "video.js/dist/video-js.css";
import SWF_PATH from "video.js/dist/video-js.swf";
videojs.options.flash.swf = SWF_PATH;

export default {
  data() {
    return {
      pageSizes: this.$glb.tableDefaultPageSizes,
      queryData: {
        device_id: -2,
        dvr_id: -2,
        page_index: 1,
        page_size: 10,
        count: 0
      },
      videoData: [],
      dvrData: [],
      singleInfo: null,
      deviceData: [],
      pushDvrData: [],
      videoPlayer: null,
      isOpenFlash: false,
      setTimeData: 0
    };
  },
  watch: {
    setTimeData: {
      handler: function(newVal, oldVal) {
        if (newVal !== 0) {
          let t = 1000 * Number.parseInt(newVal);
          this.flowRefresh = setTimeout(() => {
            this.getLiveInfo();
            clearTimeout(this.flowRefresh);
          }, t);
        }
      },
      deep: true
    }
  },
  created() {
    this.getDvrInof();
    this.getLiveInfo();
  },
  mounted() {
    this.$Modal.remove();
    this.flashCheck();
  },
  beforeDestroy() {
    if (this.flowRefresh) {
      clearTimeout(this.flowRefresh);
    }
    if (this.videoPlayer !== null) {
      this.videoPlayer.dispose();
    }
    this.videoData = [];
    this.dvrData = [];
    this.singleInfo = null;
    this.deviceData = [];
  },
  methods: {
    handleSizeChange(size) {
      this.queryData.page_index = 1;
      this.queryData.page_size = size;
      this.getLiveInfo();
    },
    handleIndexChange(index) {
      this.queryData.page_index = index;
      this.getLiveInfo();
    },
    flashModal() {
      this.$Modal.confirm({
        title: this.$t("tip.manualOpening"),
        render: h => {
          return h("div", [
            h("p", {
              style: {
                width: "100%",
                minHeight: "50px",
                fontSize: "16px"
              },
              domProps: {
                innerHTML: this.$t("tip.tipsFlash")
              }
            }),
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
                  "a",
                  {
                    domProps: {
                      href: "http://www.adobe.com/go/getflashplayer",
                      rel: "nofollow",
                      target: "_blank"
                    },
                    on: {
                      click: () => {
                        this.$Modal.remove();
                      }
                    }
                  },
                  this.$t("btn.clickOpen")
                ),
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
                        this.$Modal.remove();
                      }
                    }
                  },
                  this.$t("tip.gotIt")
                )
              ]
            )
          ]);
        }
      });
    },
    flashCheck() {
      let isOpenFlash = false;
      if (window.ActiveXObject) {
        try {
          let swf = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
          if (swf) {
            isOpenFlash = true;
          }
        } catch (e) {}
      } else {
        try {
          let swf = navigator.plugins["Shockwave Flash"];
          if (swf) {
            isOpenFlash = true;
          }
        } catch (e) {}
      }

      if (!isOpenFlash) {
        this.flashModal();
        return;
      }
    },
    play() {
      this.flashCheck();

      console.log(this.singleInfo.live_url, "<<<<<<<<<<<<<<<<<");
      this.videoPlayer = videojs("my-player"); // 关联video标签的id
      this.videoPlayer.src({
        src: this.singleInfo.live_url,
        type: "rtmp/flv"
      });
      this.videoPlayer.load();
      this.videoPlayer.play();
    },
    pushStream() {
      let data = {
        dvr_id: 2,
        channel_nums: [2, 4],
        stream_type: 0
      };

      this.$api.srs_live
        .pushStream(data)
        .then(res => {
          if (res.data.code === 0) {
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    handleSizeChange(val) {
      this.queryData.page_size = val;
      this.getLiveInfo();
    },
    handleCurrentChange(val) {
      this.queryData.page_index = val;
      this.getLiveInfo();
    },
    setUnixTime(value) {
      if (value === null) {
        return "空";
      }
      let v = this.$moment.unix(value).format("YYYY-MM-DD HH:mm:ss");
      return v;
    },
    setDeviceName(value) {
      let d = this.deviceData,
        v = "空";

      for (let i = 0; i < d.length; i++) {
        if (d[i].id === value) {
          v = d[i].name;
        }
      }
      return v;
    },
    getDeviceDataReal() {
      this.deviceData = [];
      this.$api.monitor1
        .getDeviceDataReal({
          page_index: 1,
          page_size: 500
        })
        .then(res => {
          if (res.data.code === 0) {
            this.deviceData = res.data.data.data_info;
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    clickCard(value) {
      this.singleInfo = value;
      this.play();
    },
    setTime(value) {
      let v = this.$moment(value)
        .subtract(8, "hour")
        .format("YYYY-MM-DD HH:mm:ss");
      return v;
    },
    query() {
      this.getLiveInfo();
    },
    getDvrInof() {
      let data = {
        name: "",
        device_id: -2,
        brand_type: -2,
        page_index: 1,
        page_size: 500
      };

      this.$api.srs_live
        .getDvrInof(data)
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data;

            this.dvrData = list.data_info;
            this.dvrData.unshift({
              id: -2,
              name: "全部"
            });
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    selectDeviceMn(v) {
      this.queryData.device_id = v.id;
    },
    initMn(v) {
      console.log(v, "父组件 初始改变 mn");
    },
    getLiveInfo() {
      let q = this.queryData;
      let data = {
        device_id: q.device_id,
        dvr_id: q.dvr_id,
        page_index: q.page_index,
        page_size: q.page_size
      };

      this.setTimeData = 0;

      this.$api.srs_live
        .getLiveInfo(data)
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data;
            this.setTimeData = list.set_time;
            this.videoData = list.data_info;
            this.queryData.count = list.page_count;
            this.singleInfo = list.data_info[0];
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
.realTimeMonitoring-box {
  .single-page-container;

  .realTimeMonitoring-header {
    .header;
    .header-left {
      float: left;
    }
    .header-right {
      float: right;
    }
  }

  .realTimeMonitoring-body {
    .body;
    height: 80%;
    padding: 0;
    box-shadow: none;
    background: rgba(0, 0, 0, 0);

    &:after {
      content: ".";
      display: block;
      height: 0;
      clear: both;
      visibility: hidden;
    }

    .body-left {
      position: relative;
      float: left;
      width: 75%;
      height: 100%;

      .body-left-card {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-wrap: wrap;
        overflow-y: scroll;
        overflow-x: hidden;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE 10+ */
        background-color: white;
        box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
        -webkit-box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
        -moz-box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
        -o-box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
        -ms-box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);

        // 滚动条整体部分，可以设置宽度等
        &::-webkit-scrollbar {
          //   display: none;
          width: 5px;
          height: 100%;
          background-color: #fff;
          border-radius: 5px;
        }

        // 滚动条两端的按钮
        &::-webkit-scrollbar-button {
          width: 5px;
          background-color: #fff;
        }

        // 滚动的滑块
        &::-webkit-scrollbar-thumb {
          width: 5px;
          background-color: #fff;
        }
      }

      .page {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 5px;
        text-align: center;
        background-color: white;
      }

      .card-box {
        margin: 10px;
        width: 100%;

        .card-body-box {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;

          .card-div-box {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;

            p:first-child {
              width: 100%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              flex-wrap: wrap;

              span:last-child {
                color: #41b883;
              }
            }

            p:last-child {
              text-align: left;
            }
          }
        }
      }
    }

    .body-right {
      float: right;
      width: 20%;
      min-width: 200px;
      height: 100%;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: flex-start;
      background-color: white;
      box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
      -webkit-box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
      -moz-box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
      -o-box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
      -ms-box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);

      .videojs-flvjs-player {
        padding: 0;
        margin: 0;
      }

      .video-info {
        width: 100%;

        .info-box {
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
          justify-content: flex-start;
          align-items: flex-start;

          p {
            padding: 5px 15px;

            span:first-child {
              font-size: 14px;
              color: #41b883;
            }

            span:last-child {
              font-size: 16px;
            }
          }
        }
      }
    }
  }
}
</style>