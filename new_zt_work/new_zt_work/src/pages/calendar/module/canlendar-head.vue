<!-- 日历头部组件 -->

<template>
  <div class="calendar-header clear">
    <div class="calendar-box">
      <div class="box-left">
        <Poptip trigger="hover" content="预约会议室" placement="right">
          <Icon
            type="md-add-circle"
            size="25"
            class="icon"
            color="#3eaf7c"
            @click="appointmentMeetingRoom"
          />
        </Poptip>
      </div>
      <div class="calendar-content">
        <Icon size="20" class="icon" type="ios-arrow-back" @click="handlePrevMonth" />
        <span class="calendar-headDate">{{this.headOptions.date}}</span>
        <Icon size="20" class="icon" type="ios-arrow-forward" @click="handleNextMonth" />
      </div>
      <div class="box-right">
        <Button type="primary" v-show="allMeeting" size="small" @click="handleAllMeeting">全部会议</Button>
        <Button type="info" style="margin: 0 10px;" ghost size="small" @click="handleMyMeeting">我的会议</Button>
        <Button type="success" ghost size="small" @click="handleToday">回到今天</Button>
        <Icon type="md-refresh" size="25" class="icon" color="#2d8cf0" @click="onRefresh" />
        <Poptip trigger="hover" content="筛选数据" placement="left">
          <Icon type="ios-funnel" size="25" class="icon" color="#808695" @click="search" />
        </Poptip>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    headOptions: Object
  },
  data() {
    return {
      headStyle: "",
      allMeeting: false
    };
  },
  mounted() {
    this.headStyle = this.headOptions.style;
  },
  methods: {
    // 全部会议
    handleAllMeeting() {
      // one:我的会议,all:全部会议
      this.$emit("handleMyMeeting", "all");
      this.allMeeting = false;
    },
    // 我的会议
    handleMyMeeting() {
      // one:我的会议,all:全部会议
      this.$emit("handleMyMeeting", "one");
      this.allMeeting = true;
    },
    // 刷新
    onRefresh() {
      // refresh:当前刷新，toDay:回到今天刷新
      this.$emit("onRefresh", "refresh");
    },
    // 搜索
    search() {
      this.$emit("search", true);
    },
    // 预约会议室
    appointmentMeetingRoom() {
      this.$emit("appointmentMeetingRoom", true);
    },
    // 上一个月
    handlePrevMonth() {
      this.$emit("handlePrevMonth");
    },
    // 下一个月
    handleNextMonth() {
      this.$emit("handleNextMonth");
    },
    // 回到今天
    handleToday() {
      // refresh:当前刷新，toDay:回到今天刷新
      this.$emit("onRefresh", "toDay");
      this.$emit("handleToday");
    }
  }
};
</script>

<style lang="less">
.calendar-header {
  margin-bottom: 23px;
  width: 100%;
  .calendar-box {
    position: relative;
    height: 32px;
    line-height: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .calendar-content {
      padding: 2px 5px;
      .calendar-prev,
      .calendar-next {
        padding: 15px 30px;
        display: inline-block;
        vertical-align: middle;
        // background: url("../assets/img/left.png") no-repeat;
        background-size: 15px 20px;
        background-position: center;
        background-size: 15px 20px;
        background-position: center;
        cursor: pointer;
      }
      .calendar-next {
        // background: url("../assets/img/right.png") no-repeat;
        background-size: 15px 20px;
        background-position: center;
      }
    }
    .dispersion {
      display: inline;
    }
    .calendar-headDate {
      vertical-align: middle;
      margin: 0 12px;
      font-size: 18px;
      color: #424953;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    .calendar-today {
      position: absolute;
      top: 0;
      right: 0;
      width: 80px;
      height: 30px;
      text-align: center;
      border: 1px solid #2061ff;
      border-radius: 4px;
      font-size: 14px;
      color: #2061ff;
      cursor: pointer;
    }
    .dispersion-today {
      position: inherit;
    }
    .calendar-center {
      margin: 0 auto;
    }
    .calendar-left {
      float: left;
    }
    .calendar-right {
      float: right;
    }
  }
}

.icon {
  padding: 5px 10px;
  cursor: pointer;
}
</style>