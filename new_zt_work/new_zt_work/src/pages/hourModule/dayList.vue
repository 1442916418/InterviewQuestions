<!-- 小时模块 -->

<template>
  <div class="dayList-box">
    <header>
      <Button icon="md-return-left" size="large" style="width:100px;" @click="onClickEsc"></Button>
      <strong style="font-size:16px;">
        六楼会议室
        <span style="font-size:14px;color:#3eaf7c;">{{ time }}</span>
      </strong>
      <div>
        <div @click="onClickIcon" class="menu-icon" ref="menu">
          <Icon type="md-menu" size="30" color="#3eaf7c" />
        </div>
        <Button @click="onClickEsc" shape="circle" icon="md-close"></Button>
      </div>
    </header>
    <transition
      name="details-transition"
      enter-active-class="animated rotate rotateIn faster"
      leave-active-class="animated fade fadeOut fast"
    >
      <div class="vertical-item-box" v-show="type === 1">
        <div class="vertical-default-list">
          <div class="row-flex">
            <div
              class="list-box"
              ref="vList"
              v-for="i in 24"
              :key="i"
              @click="onClickListItem(i-1)"
            >
              <b class="index-left">{{i-1}}</b>
            </div>
          </div>

          <div v-if="row.length === 0"></div>
          <div class="row-content" v-else>
            <div
              class="for-time-details"
              style="margin:10px;"
              v-for="(item, index) in row"
              :key="index"
            >
              <div class="time-details" @click="onClickTimeDetails(item.info)">
                <Card class="details-card">
                  <p slot="title" class="title">
                    <span>{{ item.info.name }}</span>
                    <span>{{ item.info.real_name }}</span>
                  </p>
                  <p class="start-time">
                    <span>开始时间:</span>
                    <span>{{ setCreateTime(item.info.start_time) }}</span>
                  </p>
                  <p>
                    <span>结束时间:</span>
                    <span>{{ setCreateTime(item.info.end_time) }}</span>
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition
      name="details-transition"
      enter-active-class="animated rotate rotateIn faster"
      leave-active-class="animated fade fadeOut fast"
    >
      <div class="item-box" v-show="type === 2">
        <div class="default-list" v-if="row.length === 0">
          <div class="row-flex">
            <div class="list-box" ref="list" v-for="i in 24" :key="i" @click="onClickListItem(i-1)">
              <b class="index-left">{{i-1}}</b>
              <div class="list-content" ref="listContent">
                <span style="color:#eee;">暂无预约</span>
              </div>
            </div>
          </div>
        </div>
        <div class="default-list" v-else>
          <div class="row-flex">
            <div class="list-box" ref="list" v-for="i in 24" :key="i" @click="onClickListItem(i-1)">
              <b class="index-left">{{i-1}}</b>
              <div class="list-content" ref="listContent">
                <div class="for-time-details" v-for="(item, index) in allDetals" :key="index">
                  <div
                    class="time-details"
                    v-if="i-1 === item.index"
                    @click="onClickTimeDetails(item)"
                  >
                    <Card class="details-card">
                      <p slot="title" class="title">
                        <span>{{ item.info.name }}</span>
                        <span>{{ item.info.real_name }}</span>
                      </p>
                      <p class="start-time">
                        <span>开始时间:</span>
                        <span>{{ item.start_time }}</span>
                      </p>
                      <p>
                        <span>结束时间:</span>
                        <span>{{ item.end_time }}</span>
                      </p>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <Modal v-model="isDetails" :title="$t('tip.seeDetails')">
      <div class="details-box">
        <div v-if="detailInfo === null"></div>
        <div class="item-box" v-else>
          <div class="item">
            <p>会议主题</p>
            <p>{{ detailInfo.name }}</p>
          </div>
          <div class="item-time">
            <div class="item">
              <p>开始时间</p>
              <p>{{ setCreateTime(detailInfo.start_time) }}</p>
            </div>
            <div class="item">
              <p>结束时间</p>
              <p>{{ setCreateTime(detailInfo.end_time) }}</p>
            </div>
          </div>
          <div class="item-status">
            <div class="item">
              <p>会议状态</p>
              <p
                :style="{color: detailInfo.status === 0 ? '#41b883' : '#ccc'}"
              >{{ setStatusName(detailInfo.status) }}</p>
            </div>
            <div class="item">
              <p>会议室</p>
              <p>{{ detailInfo.meeting_room_name }}</p>
            </div>
          </div>
          <div class="item-realName">
            <div class="item">
              <p>预约人</p>
              <p>{{ detailInfo.real_name }}</p>
            </div>
            <div class="item">
              <p>预约时间</p>
              <p>{{ setCreateTime(detailInfo.create_time) }}</p>
            </div>
          </div>
          <div class="item">
            <p>参会人员</p>
            <div class="item-user">
              <Button
                style="margin:3px;"
                type="dashed"
                v-for="(em, index) in detailInfo.meeting_user_ids"
                :key="index"
              >{{ em.real_name }}</Button>
            </div>
          </div>
          <div class="item-btn" v-if="isSuperAdministrator">
            <Button
              @click.stop="cacel(detailInfo.id)"
              long
              type="info"
            >{{$t("tip.cancelReservation")}}</Button>
          </div>
          <div class="item-btn" v-else>
            <div v-if="currentUserId === detailInfo.user_id">
              <Button
                @click="cacel(detailInfo.id)"
                long
                type="info"
                v-if="detailInfo.status === 0"
              >{{$t("tip.cancelReservation")}}</Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  props: {
    row: Array,
    time: String,
    isSuperAdministrator: Boolean,
    currentUserId: Number,
    isTimeDetails: Boolean
  },
  data() {
    return {
      type: 1, // 1竖向排列，2横向排列
      timePeriodOccupied: [],
      allDetals: [],
      isDetails: false,
      detailInfo: null
    };
  },
  watch: {
    "this.isTimeDetails": function(newVal) {
      console.log(newVal, "取消预约");
      this.isDetails = newVal;
    },
    row: function(newVal) {
      let list = this.$refs.list,
        con = this.$refs.listContent;
      if (list.length !== 0) {
        list.map((item, index) => {
          this.$refs.list[index].className = "list-box";
          this.$refs.vList[index].className = "list-box";
        });
      }
      // if (con.length !== 0) {
      //   con.map((item, j) => {
      //     this.$refs.listContent[
      //       j
      //     ].innerHTML = `<span style="color: #eee;">暂无预约</span>`;
      //   });
      // }
      this.setListStyle();
    }
  },
  methods: {
    onClickIcon() {
      let o = this.$refs.menu.className;
      if (o === "menu-icon") {
        this.type = 2;
        this.$refs.menu.className = "vertical-menu-icon";
      } else {
        this.type = 1;
        this.$refs.menu.className = "menu-icon";
      }
    },
    cacel(id) {
      this.$Modal.confirm({
        title: this.$t("btn.confirmCancellation"),
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
                      type: "primary",
                      loading: this.cancelLoading
                    },
                    style: {
                      float: "right",
                      "margin-top": "10px",
                      "margin-bottom": "10px"
                    },
                    on: {
                      click: () => {
                        this.$api.auth_login
                          .cancelAppointment({
                            id: id
                          })
                          .then(res => {
                            if (res.data.code === 0) {
                              this.isDetails = false;
                              this.$Modal.remove();
                              this.$Message.success(
                                this.$t("tip.successfulCancel")
                              );
                              this.$emit("onRefresh", "refresh");
                            }
                            this.isDetails = false;
                          })
                          .catch(error => {
                            this.isDetails = false;
                            this.$Modal.remove();
                            this.$Message.error(this.$t("tip.requestError"));
                          });
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
    setCreateTime(c) {
      let v = this.$moment(c)
        .subtract(8, "h")
        .format("YYYY-MM-DD HH:mm:ss");
      return v;
    },
    setStatusName(v) {
      return v === 0 ? "未过期" : "已过期";
    },
    onClickTimeDetails(info) {
      if (info.name === undefined) {
        this.detailInfo = info.info;
      } else {
        this.detailInfo = info;
      }
      this.isDetails = !this.isDetails;
    },
    setListStyle() {
      let r = this.row,
        nums = [],
        list = this.$refs.list;

      if (r.length === 0) return;

      r.map(i => {
        i.num.map(j => {
          nums.push(j);
        });
      });

      this.timePeriodOccupied = nums;

      nums.map((k, c) => {
        list.map((z, index) => {
          if (k === index) {
            this.$refs.list[index].className = "list-box list-occupancy";
            this.$refs.vList[index].className = "list-box vList-occupancy";
          }
        });
      });

      let all = [];
      r.map((v, i) => {
        list.map((z, index) => {
          if (v.num[0] === index || v.num[1] === index) {
            let s = this.$moment(v.info.start_time)
              .subtract(8, "hour")
              .format("YYYY-MM-DD HH:mm:ss");
            let e = this.$moment(v.info.end_time)
              .subtract(8, "hour")
              .format("YYYY-MM-DD HH:mm:ss");
            all.push({
              start_time: s,
              end_time: e,
              info: v.info,
              index: index
            });
          }
        });
      });

      this.allDetals = [];
      this.allDetals = all;
      this.$forceUpdate();
    },
    onClickListItem(val) {
      // console.log(val, this.timePeriodOccupied);
      // let r = this.timePeriodOccupied;
      // if (r.length === 0) {
      //   this.$emit("dayAddData", val);
      //   return;
      // } else {
      //   for (let i = 0; i < r.length; i++) {
      //     if (r[i] === val) {
      //       this.$Message.warning(this.$t("tip.alreadyUsed"));
      //       return;
      //     }
      //   }
      // }
      // this.$emit("dayAddData", val);
    },
    onClickEsc() {
      this.type = 1;
      this.$refs.menu.className = "menu-icon";

      this.$emit("esc");
    }
  }
};
</script>

<style lang="less" scoped>
.for-time-details {
  display: inline-block;
}

.item-user {
  width: 100%;
  max-height: 100px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  overflow: auto;
  padding: 5px;
  background-color: #f7f7f7;
}

.details-box {
  .item {
    width: 100%;
    padding: 5px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    font-size: 14px;

    p:first-child {
      width: 100%;
      padding-bottom: 10px;
      background-color: white;
    }

    p:last-child {
      width: 100%;
      padding: 5px;
      background-color: #f7f7f7;
    }
  }

  .item-btn {
    padding: 10px 5px;
    text-align: right;
  }
}

.time-details {
  display: inline-block;

  .details-card {
    margin: 0 5px;

    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;

      span:nth-of-type(1) {
        color: #3eaf7c;
      }

      span:nth-of-type(2) {
        font-weight: 500;
      }
    }

    .start-time {
      padding: 5px 0;
    }
  }
}

.detailsItem {
  display: inline-block;
  margin: 2px;
  padding: 4px;
  border: 1px solid #dcdee2;
  background: #fff;
  border-radius: 4px;
}

.dayList-box {
  .body;
}

header {
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-box {
  width: 100%;
  padding: 20px 0;
}

.default-list {
  width: 100%;

  .row-flex {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;

    .list-box {
      width: 100%;
      padding: 5px;
      margin: 3px 0;
      background-color: #fff;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      border: 1px solid #dcdee2;
      transition: all 0.2s ease-in-out;

      &:hover {
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
        border-color: #eee;
      }

      .index-left {
        float: left;
        width: 50px;
        text-align: center;
      }

      .list-content {
        overflow: auto;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;

        .null {
          color: #eee;
        }
      }
    }
  }
}

.list-occupancy {
  border-radius: 4px;
  border: 1px solid #ff9900 !important;

  &:hover {
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    border-color: #eee;
  }
}

.vList-occupancy {
  border: 1px solid #dbffef !important;
  background-color: #dbffef !important;

  &:hover {
    border: 1px solid #3eaf7c !important;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
  }
}

.vertical-item-box {
  width: 100%;
  padding: 20px 0;
}

.vertical-default-list {
  width: 100%;

  .row-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    border-radius: 4px;
    font-size: 16px;
    border: 1px solid #dcdee2;
    cursor: pointer;

    .list-box {
      padding: 15px 10px;
      background-color: #fff;
      transition: all 0.2s ease-in-out;

      &:hover {
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
        background-color: #efefef;
      }
    }
  }

  .row-content {
    padding: 10px 10px 100px 10px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
  }
}

.menu-icon {
  display: inline-block;
  padding: 0 10px;
}

.vertical-menu-icon {
  display: inline-block;
  padding: 0 10px;
  transform: rotate(90deg);
}
</style>