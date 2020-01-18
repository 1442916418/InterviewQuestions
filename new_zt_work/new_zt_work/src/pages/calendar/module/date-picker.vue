<!-- 日历组件 -->

<template>
  <div class="cc-calendar">
    <calendarHeader
      :headOptions="headOptions"
      @handlePrevMonth="handlePrevMonth"
      @handleNextMonth="handleNextMonth"
      @handleToday="handleToday"
      @appointmentMeetingRoom="appointmentMeetingRoom"
      @search="search"
      @onRefresh="onRefresh"
      @handleMyMeeting="handleMyMeeting"
    />
    <ul class="calendar-week clear">
      <li v-for="(item, index) in calendarTitleArr" :key="index" class="week-item">{{item}}</li>
    </ul>
    <ul class="calendar-view clear">
      <li
        v-for="(item, index) in visibleCalendar"
        :key="index"
        class="date-view"
        :class="[
          {'month-class': !isCurrentMonth(item.date)},
          {todayBg: isCurrentDay(item.date)},
          {handleDay: item.clickDay}
        ]"
        @click="handleClickDay(item)"
      >
        <span
          class="date-day"
          :style="dayStyle"
          :class="[{'opacity-class': !isCurrentMonth(item.date)}]"
        >{{item.day}}</span>
        <div
          class="calendar-num calendar-num-o"
          v-if="data.length !== 0 && isCurrentMonth(item.date)"
        >
          <div class="calendar-data-box" v-for="(d, index) in data" :key="index">
            <Poptip class="poptip" trigger="hover" :title="d.title" v-if="item.day === d.d">
              <Button type="info" ghost size="small" class="btn">{{ d.title }}</Button>
              <div class="poptip-content" slot="content">
                <div class="item-box">
                  <div class="item">
                    <p>会议主题</p>
                    <p>{{ d.info.name }}</p>
                  </div>
                  <div class="item-time">
                    <div class="item">
                      <p>开始时间</p>
                      <p>{{ setStartTime(d.info.start_time) }}</p>
                    </div>
                    <div class="item">
                      <p>结束时间</p>
                      <p>{{ setEndStart(d.info.end_time) }}</p>
                    </div>
                  </div>
                  <div class="item-status">
                    <div class="item">
                      <p>会议状态</p>
                      <p
                        :style="{color: d.info.status === 0 ? '#41b883' : '#ccc'}"
                      >{{ setStatusName(d.info.status) }}</p>
                    </div>
                    <div class="item">
                      <p>会议室</p>
                      <p>{{ d.info.meeting_room_name }}</p>
                    </div>
                  </div>
                  <div class="item-realName">
                    <div class="item">
                      <p>预约人</p>
                      <p>{{ d.info.real_name }}</p>
                    </div>
                    <div class="item">
                      <p>预约时间</p>
                      <p>{{ setCreateTime(d.info.create_time) }}</p>
                    </div>
                  </div>
                  <div class="item">
                    <p>参会人员</p>
                    <div class="item-user">
                      <Button
                        style="margin:3px;"
                        type="dashed"
                        v-for="(em, index) in d.info.meeting_user_ids"
                        :key="index"
                      >{{ em.real_name }}</Button>
                    </div>
                  </div>
                  <div class="item-btn" v-if="isSuperAdministrator">
                    <Button
                      @click.stop="cacel(d.info.id)"
                      long
                      type="info"
                    >{{$t("tip.cancelReservation")}}</Button>
                  </div>
                  <div class="item-btn" v-else>
                    <div v-if="currentUserId === d.info.user_id">
                      <Button
                        @click.stop="cacel(d.info.id)"
                        long
                        type="info"
                        v-if="d.info.status === 0"
                      >{{$t("tip.cancelReservation")}}</Button>
                    </div>
                  </div>
                </div>
              </div>
            </Poptip>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import calendarHeader from "./canlendar-head.vue";
import * as utils from "../js/utils.js";

export default {
  name: "cc-calendar",
  componentName: "cc-calendar",
  props: {
    options: Object,
    data: Array,
    meetingRoomData: Array,
    isSuperAdministrator: Boolean,
    currentUserId: Number
  },
  components: {
    calendarHeader
  },
  data() {
    let { year, month, day } = utils.getNewDate(new Date());
    return {
      headOptions: {
        type: this.options.type,
        style: this.options.headStyle,
        date: ""
      },
      calendarTitleArr: [
        "周日",
        "周一",
        "周二",
        "周三",
        "周四",
        "周五",
        "周六"
      ],
      time: { year, month, day },
      calendarList: []
    };
  },
  computed: {
    dayStyle: function() {
      return {
        textAlign: this.options.viewStyle.day
      };
    },
    visibleCalendar() {
      let calendatArr = [];
      let { year, month, day } = utils.getNewDate(
        utils.getDate(this.time.year, this.time.month, 1)
      );

      let currentFirstDay = utils.getDate(year, month, 1);

      // 获取当前月第一天星期几
      let weekDay = Number(this.$moment(currentFirstDay).format("d"));
      let currentFirstDayUnix = this.$moment(currentFirstDay).unix();
      let startTime = 0;
      if (weekDay === 0) {
        startTime = currentFirstDayUnix - weekDay * 24 * 60 * 60;
      } else {
        startTime = currentFirstDayUnix - (weekDay + 1 - 1) * 24 * 60 * 60;
      }

      let monthDayNum = 0;
      if (weekDay == 0 || weekDay === 5 || weekDay === 6) {
        monthDayNum = 42;
      } else {
        monthDayNum = 35;
      }

      for (let i = 0; i < monthDayNum; i++) {
        let m = startTime + i * 24 * 60 * 60;
        let d = this.$moment.unix(m).format("YYYY-MM-DD HH:mm:ss");
        calendatArr.push({
          date: d,
          year: year,
          month: month + 1,
          day: Number(this.$moment.unix(m).get("date")),
          clickDay: false
        });
      }

      this.calendarList = calendatArr;
      this.headOptions.date = `${utils.englishMonth(month)} ${year}`;
      return calendatArr;
    }
  },
  created() {
    this.calendarList = this.visibleCalendar;
    this.calendarType = this.options.calendarType;
  },
  methods: {
    handleMyMeeting(val) {
      // one:我的会议,all:全部会议
      this.$emit("handleMyMeeting", val);
    },
    onRefresh(val) {
      // refresh:当前刷新，toDay:回到今天刷新
      this.$emit("onRefresh", val);
    },
    cacel(id) {
      this.$emit("cancelReservation", id);
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
    setEndStart(e) {
      let v = this.$moment(e)
        .subtract(8, "h")
        .format("YYYY-MM-DD HH:mm:ss");
      return v;
    },
    setStartTime(s) {
      let v = this.$moment(s)
        .subtract(8, "h")
        .format("YYYY-MM-DD HH:mm:ss");
      return v;
    },
    // 是否是当前月
    isCurrentMonth(date) {
      let { year: currentYear, month: currentMonth } = utils.getNewDate(
        utils.getDate(this.time.year, this.time.month, 1)
      );
      let { year, month } = utils.getNewDate(date);
      return currentYear === year && currentMonth === month;
    },
    // 是否是今天
    isCurrentDay(date) {
      let {
        year: currentYear,
        month: currentMonth,
        day: currentDay
      } = utils.getNewDate(new Date());
      let { year, month, day } = utils.getNewDate(date);
      return (
        currentYear === year && currentMonth === month && currentDay === day
      );
    },
    // 上一个月
    handlePrevMonth() {
      let prevMonth = utils.getDate(this.time.year, this.time.month, 1);
      let g = this.$moment(prevMonth)
        .subtract(1, "months")
        .format("YYYY-MM-DD HH:mm:ss");
      this.time = utils.getNewDate(g);
      this.headOptions.date = `${utils.englishMonth(this.time.month)} ${
        this.time.year
      }`;
      this.$emit("handlePrevMonth", this.time);
    },
    // 下一个月
    handleNextMonth() {
      let nextMonth = utils.getDate(this.time.year, this.time.month, 1);
      let g = this.$moment(nextMonth)
        .add(1, "months")
        .format("YYYY-MM-DD HH:mm:ss");
      this.time = utils.getNewDate(g);
      this.headOptions.date = `${utils.englishMonth(this.time.month)} ${
        this.time.year
      }`;

      this.$emit("handleNextMonth", this.time);
    },
    // 点击回到今天
    handleToday() {
      this.time = utils.getNewDate(new Date());
      this.$emit("handleToday");
    },
    // 点击某一天
    handleClickDay(item) {
      this.calendarList.map(x => {
        x.clickDay = false;
      });
      this.$set(item, "clickDay", true);
      this.$emit("handleClickDay", item);
      this.$forceUpdate();
    },
    // 预约会议室
    appointmentMeetingRoom(val) {
      this.$emit("appointmentMeetingRoom", val);
    },
    // 搜索
    search(val) {
      this.$emit("search", val);
    }
  }
};
</script>

<style lang="less">
.cc-calendar {
  display: inline-block;
  padding: 5px;
  width: 100%;
  height: 100%;
  background-color: white;
  box-sizing: border-box;
  list-style-type: none;
  .calendar-week {
    width: 100%;
    height: 46px;
    line-height: 46px;
    border: 1px solid #e4e7ea;
    border-right: none;
    list-style-type: none;
    .week-item {
      float: left;
      width: 14.285%;
      text-align: center;
      font-size: 14px;
      color: #424953;
      border-right: 1px solid #e4e7ea;
      font-weight: 600;
    }
  }
  .calendar-view {
    width: 100%;
    border-left: 1px solid #e4e7ea;
    list-style-type: none;
    .date-view {
      float: left;
      width: 14.285%;
      height: 150px;
      border-right: 1px solid #e4e7ea;
      border-bottom: 1px solid #e4e7ea;
      cursor: pointer;
      .date-day {
        padding: 8px 8px 0;
        display: block;
        width: 100%;
        font-size: 14px;
        color: #7f8794;
      }
      .calendar-num {
        margin-top: 6px;
        width: 100%;
        text-align: center;
        font-size: 30px;
        color: #424953;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-wrap: wrap;
      }
    }
    .opacity-class {
      opacity: 0.5;
    }
    .month-class {
      background-image: linear-gradient(
        45deg,
        rgba(000, 000, 000, 0.03) 25%,
        transparent 25%,
        transparent 50%,
        rgba(000, 000, 000, 0.03) 50%,
        rgba(000, 000, 000, 0.03) 75%,
        transparent 75%,
        transparent
      );
      background-size: 20px 20px;
    }
    .todayBg {
      background: #fffdef;
    }
    .handleDay {
      background: rgb(221, 255, 239) !important;
      .date-day {
        color: #bccfff !important;
      }
      .calendar-num {
        color: #fff !important;
      }
    }
  }
}

.calendar-data-box {
  display: inline-block;
  font-size: 13px;

  // .poptip {
  //   width: 100%;
  // }

  .btn {
    margin: 2px;
    padding: 2px 10px;
  }
}

.calendar-num-o {
  max-height: 100px;
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }
}

.poptip-content {
  width: 300px;
  color: #424953 !important;
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

.item-time,
.item-status,
.item-realName {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>