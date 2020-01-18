<!-- 视频列表 -->

<template>
  <div class="videoList-box">
    <div class="videoList-header">
      <div class="header-left"></div>
      <div class="header-right">
        <SelectDevice @changeMn="selectDeviceMn" @initMn="initMn"></SelectDevice>
        <Select filterable v-model="queryData.dvr_id" style="width:200px;margin-right:10px;">
          <Option v-for="item in dvrData" :value="item.id" :key="item.name">{{ item.name }}</Option>
        </Select>
        <SelectTime @changeStartDate="changeStartDate" @changeEndDate="changeEndDate"></SelectTime>
        <Button type="primary" icon="md-search" @click="query">{{$t('btn.search')}}</Button>
      </div>
    </div>
    <div class="videoList-body" ref="body">
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
        <div class="right-black-box" v-show="sourceUrl === null">
          <span>{{ $t('tip.manualRefresh') }}</span>
        </div>
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

export default {
  name: "videoList",
  data() {
    return {
      pageSizes: this.$glb.tableDefaultPageSizes,
      queryData: {
        device_id: -2,
        dvr_id: -2,
        start_time: 0,
        end_time: 0,
        page_index: 1,
        page_size: 50,
        count: 0
      },
      videoData: [],
      dvrData: [],
      singleInfo: null,
      deviceData: [],
      sourceUrl: null,
      videoPlayer: null
    };
  },
  created() {
    this.getDvrInof();
    this.getDeviceDataReal();
    this.initData();
  },
  destroyed() {
    if (this.videoPlayer !== null) {
      this.videoPlayer.dispose();
    }
  },
  methods: {
    handleSizeChange(size) {
      this.queryData.page_index = 1;
      this.queryData.page_size = size;
      this.getVideoInfo();
    },
    handleIndexChange(index) {
      this.queryData.page_index = index;
      this.getVideoInfo();
    },
    play() {
      console.log(this.sourceUrl, "<<<<<<<<<<<<<<<<");
      this.videoPlayer = videojs("my-player");
      this.videoPlayer.src({
        src: this.sourceUrl,
        type: "video/mp4"
      });
      this.videoPlayer.load();
      this.videoPlayer.play();
    },
    handleSizeChange(val) {
      this.queryData.page_size = val;
      this.getVideoInfo();
    },
    handleCurrentChange(val) {
      this.queryData.page_index = val;
      this.getVideoInfo();
    },
    setUnixTime(value) {
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
      this.sourceUrl = value.view_path;
      this.play();
    },
    setTime(value) {
      let v = this.$moment(value)
        .subtract(8, "hour")
        .format("YYYY-MM-DD HH:mm:ss");
      return v;
    },
    query() {
      this.getVideoInfo();
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
    // 父组件 初始数据
    initData() {
      let state = this.$store.state,
        s = null,
        e = null;
      let start_time = `${this.$moment()
          .subtract(30, "d")
          .format("YYYY-MM-DD HH:MM:SS")}`,
        end_time = `${this.$moment().format("YYYY-MM-DD HH:MM:SS")}`;

      if (state.selectStartDate === null || state.selectEndDate === null) {
        s = start_time;
        e = end_time;
        this.$store.dispatch({
          type: "saveSelectStartDate",
          obj: s
        });
        this.$store.dispatch({
          type: "saveSelectEndDate",
          obj: e
        });
      } else {
        if (
          state.selectStartDate.obj === null ||
          state.selectEndDate.obj === null
        ) {
          s = start_time;
          e = end_time;
          this.$store.dispatch({
            type: "saveSelectStartDate",
            obj: s
          });
          this.$store.dispatch({
            type: "saveSelectEndDate",
            obj: e
          });
        } else {
          s = state.selectStartDate.obj;
          e = state.selectEndDate.obj;
        }
      }

      this.queryData.start_time = this.$moment(`${s}`).unix();
      this.queryData.end_time = this.$moment(`${e}`).unix();

      this.getVideoInfo();
    },
    // 父组件 开始时间
    changeStartDate(v) {
      this.queryData.start_time = this.$moment(v).unix();
    },
    // 父组件 结束时间
    changeEndDate(v) {
      this.queryData.end_time = this.$moment(v).unix();
    },
    // 父组件 选择设备
    selectDeviceMn(v) {
      this.queryData.device_id = v.id;
    },
    // 父组件 初始改变 mn
    initMn(v) {
      console.log(v, "父组件 初始改变 mn");
    },
    getVideoInfo() {
      let q = this.queryData,
        s = null,
        e = null;

      if (
        !this.$RegExp.verifyIsNull(q.start_time) ||
        !this.$RegExp.verifyIsNull(q.end_time) ||
        isNaN(q.start_time) ||
        isNaN(q.end_time)
      ) {
        s = `${this.$moment()
          .subtract(30, "d")
          .format("YYYY-MM-DD HH:MM:SS")}`;
        e = `${this.$moment().format("YYYY-MM-DD HH:MM:SS")}`;
        this.$store.dispatch({
          type: "saveSelectStartDate",
          obj: s
        });
        this.$store.dispatch({
          type: "saveSelectEndDate",
          obj: e
        });

        s = this.$moment(s).unix();
        e = this.$moment(e).unix();
      } else {
        s = q.start_time;
        e = q.end_time;
      }

      let data = {
        device_id: q.device_id,
        dvr_id: q.dvr_id,
        start_time: s,
        end_time: e,
        page_index: q.page_index,
        page_size: q.page_size
      };

      this.videoData = [];

      this.$api.srs_live
        .getVideoInfo(data)
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data;

            if (list.data_info.length === 0) {
              this.$Message.warning(this.$t("tip.noInfo"));
            } else {
              this.queryData.count = list.page_count;
              this.videoData = list.data_info;
              this.singleInfo = list.data_info[0];
            }
          }
        })
        .catch(error => {
          console.log(error);
          this.$Message.error(this.$t("tip.requestError"));
        });
    }
  }
};
</script>
 
<style lang="less" scoped>
.videoList-box {
  .single-page-container;

  .videoList-header {
    .header;
    .header-left {
      float: left;
    }
    .header-right {
      float: right;
    }
  }

  .videoList-body {
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
      justify-content: flex-start;
      align-items: flex-start;
      background-color: white;
      box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
      -webkit-box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
      -moz-box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
      -o-box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
      -ms-box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
      overflow-y: scroll;
      overflow-x: hidden;
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE 10+ */

      // 滚动条整体部分，可以设置宽度等
      &::-webkit-scrollbar {
        display: none;
      }

      .right-black-box {
        width: 100%;
        background-color: rgb(10, 10, 10);
        text-align: center;

        span {
          font-size: 14px;
          color: #eee;
        }
      }

      .video-info {
        width: 100%;

        .info-box {
          padding: 20px 0;
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
          justify-content: flex-start;
          align-items: flex-start;

          p {
            padding: 5px 15px;

            span:first-child {
              font-size: 14px;
            }

            span:last-child {
              font-size: 16px;
              color: #41b883;
            }
          }
        }
      }
    }
  }
}
</style>