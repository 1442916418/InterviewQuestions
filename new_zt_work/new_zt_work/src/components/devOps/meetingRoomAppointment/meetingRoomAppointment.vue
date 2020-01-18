<!-- 会议室预约 -->

<template>
  <div class="meetingRoomAppointment-box">
    <div class="no-user" v-show="nonInternal">
      <span>无法访问</span>
    </div>

    <transition
      name="details-transition"
      enter-active-class="animated fade fadeInDownBig faster"
      leave-active-class="animated fade fadeOutUpBig faster"
    >
      <DayList
        v-show="isShowDayBox"
        :time="currentDayTime"
        :row="currentTimeSlot"
        :isSuperAdministrator="isSuperAdministrator"
        :currentUserId="currentUserId"
        :isTimeDetails="isTimeDetails"
        @dayAddData="dayAddData"
        @esc="esc"
        @cancelReservation="cancelReservation"
        @onRefresh="onRefresh"
      />
    </transition>

    <transition
      name="details-transition"
      enter-active-class="animated fade fadeInUpBig fast"
      leave-active-class="animated fade fadeOutDownBig faster"
    >
      <div class="meetingRoomAppointment-body" v-show="!isShowDayBox">
        <Calendar
          :options="calendarArr"
          :data="fcEvents"
          :isSuperAdministrator="isSuperAdministrator"
          :currentUserId="currentUserId"
          @handleClickDay="handleClickDay"
          @handlePrevMonth="handlePrevMonth"
          @handleNextMonth="handleNextMonth"
          @cancelReservation="cancelReservation"
          @appointmentMeetingRoom="appointmentMeetingRoom"
          @search="search"
          @onRefresh="onRefresh"
          @handleMyMeeting="handleMyMeeting"
        />
      </div>
    </transition>

    <Modal width="800px" v-model="isShowAddData" :title="$t('leftSidebar.meetingRoomAppointment')">
      <div class="addData-box">
        <div class="box">
          <div class="box-left">
            <div class="list-item">
              <p>{{ $t('tip.pleaseInput') }}{{ $t('tip.conferenceTheme') }}</p>
              <Input
                v-model.trim="addData.name"
                style="width:100%"
                maxlength="16"
                :placeholder="$t('tip.pleaseInput') + $t('tip.conferenceTheme')"
              />
            </div>
            <div class="list-item-time">
              <div class="time-item">
                <p>{{$t('tip.pleaseSelectStartTime')}}</p>
                <Date-picker
                  :options="startOptions"
                  @on-change="changeStartTime"
                  style="width:100%"
                  v-model="addData.start_time"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  :placeholder="$t('tip.pleaseSelectStartTime')"
                ></Date-picker>
              </div>
              <div class="select-duration" v-show="addData.start_time !== null">
                <Button type="dashed" size="small" @click="onClickSetEndTime('30')">30:00</Button>
                <Button type="dashed" size="small" @click="onClickSetEndTime('60')">60:00</Button>
                <Button type="dashed" size="small" @click="onClickSetEndTime('90')">90:00</Button>
                <Button type="dashed" size="small" @click="onClickSetEndTime('120')">120:00</Button>
              </div>
              <div class="time-item">
                <p>{{$t('tip.pleaseSelectEndTime')}}</p>
                <Date-picker
                  :options="endOptions"
                  @on-change="changeEndTime"
                  style="width:100%"
                  v-model="addData.end_time"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  :placeholder="$t('tip.pleaseSelectEndTime')"
                ></Date-picker>
              </div>
            </div>
            <div class="list-item">
              <p>{{ $t('tip.pleaseSelect') }}{{ $t('leftSidebar.meetingRoom') }}</p>
              <Select
                style="width:100%"
                v-model.trim="addData.meeting_room_id"
                :placeholder="$t('tip.pleaseSelect') + $t('leftSidebar.meetingRoom')"
              >
                <Option
                  v-for="item in meetingRoomData"
                  :value="item.id"
                  :key="item.id"
                  :label="item.name"
                ></Option>
              </Select>
            </div>
          </div>
          <div class="box-right">
            <div class="right-header">
              <span>{{ $t("tip.attendees") }}</span>
              <span>
                {{ $t("tip.selected") }}
                <span
                  style="color:#41b883;"
                >{{ selectedParticipants.length }}</span>
              </span>
              <span @click="() => selectedParticipants = []">{{ $t('tip.clear') }}</span>
            </div>
            <div class="attendees-box">
              <span class="txt" v-show="selectedParticipants.length === 0">请选择参会人员</span>
              <Tag
                type="border"
                closable
                color="success"
                v-for="(item, index) in selectedParticipants"
                :key="index"
                @on-close="closeTag(item)"
              >{{item}}</Tag>
            </div>
          </div>
        </div>

        <div class="list-item-user">
          <div class="select-user-title-box">
            <span>{{ `${$t('tip.pleaseSelect')}${$t('tip.conferencePersonnel')}` }}</span>
            <span>{{ $t('tip.searchUser') }}</span>
          </div>
          <div class="select-user-item">
            <div class="select-user-box">
              <Select
                :placeholder="$t('leftSidebar.department')"
                v-model="queryUserData.department_id"
                style="width:240px;margin-right:5px;"
                @on-change="changeDepartment"
              >
                <Option
                  v-for="item in departmentData"
                  :value="item.id"
                  :key="item.id"
                  :label="item.name"
                ></Option>
              </Select>
              <Select
                :placeholder="$t('tip.searchUser')"
                style="width:240px;"
                v-model="selectUser"
                @on-change="searchSelectUser"
                multiple
                filterable
                remote
                :remote-method="remoteMethod"
                :loading="queryLoading"
              >
                <Option
                  v-for="(option, index) in searchUserData"
                  :value="option.value"
                  :key="index"
                >{{option.label}}</Option>
              </Select>
            </div>

            <div class="user-check-box">
              <div class="allCheckBox">
                <Checkbox
                  :indeterminate="indeterminate"
                  :value="checkAll"
                  @click.prevent.native="handleCheckAll"
                >{{$t('tip.selectionAll')}}</Checkbox>
              </div>
              <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                <Checkbox
                  style="width:120px"
                  v-for="(item, i) in userData"
                  :key="i"
                  :label="item.real_name"
                ></Checkbox>
              </CheckboxGroup>
            </div>
          </div>
        </div>
        <div class="modal-item-btn">
          <Button style="margin-right:10px;" @click="cancelBtn">{{ $t('tip.cancel') }}</Button>
          <Button
            type="primary"
            :loading="addLoading"
            @click="subminAddData"
          >{{ $t('tip.determine') }}</Button>
        </div>
      </div>
    </Modal>

    <Drawer width="340" :title="$t('tip.screening')" :closable="false" v-model="isShowRightDrawer">
      <div class="drawer-box">
        <div class="item">
          <p>{{ `${$t('tip.pleaseInput') }${$t('tip.conferenceTheme')}` }}</p>
          <Input
            v-model.trim="queryData.name"
            style="width:300px"
            maxlength="16"
            :placeholder="$t('tip.pleaseInput') + $t('tip.conferenceTheme')"
          />
        </div>
        <div class="item">
          <p>{{ $t('tip.pleaseSelectAStartTime') }}</p>
          <Date-picker
            style="width:300px"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            v-model="queryData.start_time"
            :placeholder="$t('tip.pleaseSelectAStartTime')"
          ></Date-picker>
        </div>
        <div class="item">
          <p>{{ $t('tip.pleaseSelectAEndTime') }}</p>
          <Date-picker
            style="width:300px"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            v-model="queryData.end_time"
            :placeholder="$t('tip.pleaseSelectAEndTime')"
          ></Date-picker>
        </div>
        <div class="item">
          <p>{{ `${$t('tip.pleaseInput')}${$t("tip.conferenceRoom")}${$t('tip.status')}` }}</p>
          <Select
            v-model="queryData.status"
            :placeholder="$t('tip.pleaseInput') + $t('tip.conferenceRoom') + $t('tip.status')"
            style="width:300px"
          >
            <Option
              v-for="item in status"
              :value="item.value"
              :key="item.value"
              :label="item.label"
            ></Option>
          </Select>
        </div>
        <div class="item">
          <p>{{ `${$t("tip.pleaseInput")}${$t("tip.appointmentPerson")}` }}</p>
          <Select
            style="width:300px"
            v-model="queryData.user_id"
            filterable
            :placeholder="$t('tip.pleaseInput')+$t('tip.appointmentPerson')"
          >
            <Option
              v-for="item in userData"
              :value="item.id"
              :key="item.id"
              :label="item.real_name"
            ></Option>
          </Select>
        </div>
        <div class="item">
          <p>{{ $t('tip.pleaseSelect') }}{{ $t('leftSidebar.meetingRoom') }}</p>
          <Select
            style="width:300px"
            v-model.trim="queryData.meeting_room_id"
            :placeholder="$t('tip.pleaseSelect') + $t('leftSidebar.meetingRoom')"
          >
            <Option
              v-for="item in meetingRoomData"
              :value="item.id"
              :key="item.id"
              :label="item.name"
            ></Option>
          </Select>
        </div>
        <div class="drawer-item-btn">
          <Button
            style="margin-bottom:10px;"
            type="primary"
            @click="subminQueryData"
            long
          >{{ $t('tip.determine') }}</Button>
          <Button
            style="margin-bottom:10px;"
            type="warning"
            long
            @click="resetQueryBtn"
          >{{ $t('btn.reset') }}</Button>
          <Button @click="cancelQueryBtn" long>{{ $t('tip.cancel') }}</Button>
        </div>
      </div>
    </Drawer>
  </div>
</template>

<script>
import dayList from "@/pages/hourModule/dayList";
import calendar from "@/pages/calendar/module/date-picker";

export default {
  components: {
    DayList: dayList,
    Calendar: calendar
  },
  name: "meetingRoomAppointment",
  data() {
    return {
      isTimeDetails: false,
      calendarArr: {
        type: "combination",
        headStyle: {
          todayBtn: "right",
          combination: "center",
          checkBtn: "right"
        },
        viewStyle: {
          day: "right"
        },
        calendarData: []
      },
      addLoading: false,
      currentDayTime: "",
      currentTimeSlot: [],
      timeSlot: [],
      isShowDayBox: false,
      cancelLoading: false,
      isShowDetails: false,
      rowDetails: {},
      fcEvents: [],
      allUserNameData: [],
      selectUser: [],
      searchUserData: [],
      queryLoading: false,
      usersData: [],
      nonInternal: false,
      selectedParticipants: [],
      currentUserId: 0,
      isSuperAdministrator: false,
      indeterminate: false,
      checkAll: false,
      checkAllGroup: [],
      isShowRightDrawer: false,
      isShowAddData: false,
      addData: {
        name: null,
        start_time: null,
        end_time: null,
        meeting_user_ids: [],
        meeting_room_id: null
      },
      meetingRoomData: [],
      userData: [],
      queryUserData: {
        real_name: "",
        mobile: "",
        role_id: -2,
        department_id: -2,
        page_index: 1,
        page_size: 500
      },
      queryDepartmentData: {
        name: "",
        page_index: 1,
        page_size: 500
      },
      departmentData: [],
      queryData: {
        name: "",
        status: -2,
        user_id: -2,
        meeting_room_id: -2,
        start_time: `${this.$moment().format("YYYY-MM")}-01 00:00:00`,
        end_time: `${this.$moment()
          .add(1, "months")
          .format("YYYY-MM")}-01 00:00:00`,
        page_index: 1,
        page_size: 1000,
        count: 0
      },
      dataList: [],
      cloneDataList: [],
      loading: false,
      startOptions: {
        shortcuts: [
          {
            text: `当前时间`
          },
          {
            text: `前30分钟`,
            value() {
              let v = this.$moment()
                .subtract(30, "m")
                .format("YYYY-MM-DD HH:mm:ss");
              return v;
            }
          },
          {
            text: `前60分钟`,
            value() {
              let v = this.$moment()
                .subtract(60, "m")
                .format("YYYY-MM-DD HH:mm:ss");
              return v;
            }
          },
          {
            text: `前90分钟`,
            value() {
              let v = this.$moment()
                .subtract(90, "m")
                .format("YYYY-MM-DD HH:mm:ss");
              return v;
            }
          },
          {
            text: `前120分钟`,
            value() {
              let v = this.$moment()
                .subtract(120, "m")
                .format("YYYY-MM-DD HH:mm:ss");
              return v;
            }
          }
        ]
      },
      endOptions: {
        shortcuts: [
          {
            text: `当前时间`
          },
          {
            text: `后30分钟`,
            value() {
              let v = this.$moment()
                .add(30, "m")
                .format("YYYY-MM-DD HH:mm:ss");
              return v;
            }
          },
          {
            text: `后60分钟`,
            value() {
              let v = this.$moment()
                .add(60, "m")
                .format("YYYY-MM-DD HH:mm:ss");
              return v;
            }
          },
          {
            text: `后90分钟`,
            value() {
              let v = this.$moment()
                .add(90, "m")
                .format("YYYY-MM-DD HH:mm:ss");
              return v;
            }
          },
          {
            text: `后120分钟`,
            value() {
              let v = this.$moment()
                .add(120, "m")
                .format("YYYY-MM-DD HH:mm:ss");
              return v;
            }
          }
        ]
      },
      status: [
        {
          value: -2,
          label: "全部"
        },
        {
          value: 0,
          label: "未过期"
        },
        {
          value: 1,
          label: "已过期"
        }
      ]
    };
  },
  watch: {
    checkAllGroup: function(newVal, oldVal) {
      if (JSON.stringify(this.selectedParticipants) === "[]") {
        this.selectedParticipants = [...new Set(newVal)];
      } else {
        let s = this.selectedParticipants.concat(newVal);
        this.selectedParticipants = [...new Set(s)];
      }
    }
  },
  created() {
    this.setRealName();
  },
  mounted() {
    this.isShowDayBox = false;
    this.$Modal.remove();
  },
  beforeDestroy() {
    this.currentDayTime = "";
    this.currentTimeSlot = [];
    this.timeSlot = [];
    this.isShowDayBox = false;
    this.cancelLoading = false;
    this.isShowDetails = false;
    this.rowDetails = {};
    this.fcEvents = [];
    this.allUserNameData = [];
    this.selectUser = [];
    this.searchUserData = [];
    this.queryLoading = false;
    this.usersData = [];
    this.nonInternal = false;
    this.selectedParticipants = [];
    this.currentUserId = 0;
    this.isSuperAdministrator = false;
    this.indeterminate = false;
    this.checkAll = false;
    this.checkAllGroup = [];
    this.isShowRightDrawer = false;
    this.isShowAddData = false;
    this.addData = {
      name: null,
      start_time: null,
      end_time: null,
      meeting_user_ids: [],
      meeting_room_id: null
    };
    this.meetingRoomData = [];
    this.userData = [];
    this.queryUserData = {
      real_name: "",
      mobile: "",
      role_id: -2,
      department_id: -2,
      page_index: 1,
      page_size: 500
    };
    this.queryDepartmentData = {
      name: "",
      page_index: 1,
      page_size: 500
    };
    this.departmentData = [];
    this.queryData = {
      name: "",
      status: -2,
      user_id: -2,
      meeting_room_id: -2,
      page_index: 1,
      page_size: 10,
      count: 0
    };
    this.dataList = [];
    this.cloneDataList = [];
    this.loading = false;
  },
  methods: {
    handleMyMeeting(val) {
      // one:我的会议,all:全部会议
      if (val === "one") {
        this.queryData.user_id = this.currentUserId;
      } else if (val === "all") {
        this.queryData.user_id = -2;
      }
      this.getAppointmentData();
    },
    onClickSetEndTime(val) {
      if (val === "30") {
        this.addData.end_time = this.$moment(this.addData.start_time)
          .add(parseInt(val), "minutes")
          .format("YYYY-MM-DD HH:mm:ss");
      } else if (val === "60") {
        this.addData.end_time = this.$moment(this.addData.start_time)
          .add(parseInt(val), "minutes")
          .format("YYYY-MM-DD HH:mm:ss");
      } else if (val === "90") {
        this.addData.end_time = this.$moment(this.addData.start_time)
          .add(parseInt(val), "minutes")
          .format("YYYY-MM-DD HH:mm:ss");
      } else if (val === "120") {
        this.addData.end_time = this.$moment(this.addData.start_time)
          .add(parseInt(val), "minutes")
          .format("YYYY-MM-DD HH:mm:ss");
      }
    },
    onRefresh(val) {
      // refresh:当前刷新，toDay:回到今天刷新
      if (val === "toDay") {
        let v = this.$moment().get("month");
        let s = this.$moment({ M: v, d: 1, h: 0, m: 0, s: 0 }).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          e = this.$moment({ M: v + 1, d: 1, h: 0, m: 0, s: 0 }).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        this.queryData.start_time = s;
        this.queryData.end_time = e;
      }
      this.isShowDayBox = false;
      this.getAppointmentData();
    },
    search(val) {
      this.isShowRightDrawer = val;
    },
    appointmentMeetingRoom(val) {
      this.cancelBtn();
      this.isShowAddData = val;
    },
    handleClickDay(val) {
      let d = this.$moment(val.date).format("YYYY-MM-DD HH:mm:ss"),
        u = this.$moment(d).unix();
      this.currentDayTime = this.$moment(val.date).format("YYYY-MM-DD");
      this.setDayClick(u);
    },
    handlePrevMonth(val) {
      this.queryData.start_time = `${this.$moment(
        new Date(val.year, val.month, val.day)
      ).format("YYYY-MM-DD HH:mm:ss")}`;
      this.queryData.end_time = `${this.$moment(
        new Date(val.year, val.month, val.day)
      )
        .add(1, "months")
        .format("YYYY-MM")}-01 00:00:00`;
      this.getAppointmentData();
    },
    handleNextMonth(val) {
      this.queryData.start_time = `${this.$moment(
        new Date(val.year, val.month, val.day)
      ).format("YYYY-MM-DD HH:mm:ss")}`;
      this.queryData.end_time = `${this.$moment(
        new Date(val.year, val.month, val.day)
      )
        .add(1, "months")
        .format("YYYY-MM")}-01 00:00:00`;
      this.getAppointmentData();
    },
    dayAddData(value) {
      let s = `${this.currentDayTime} ${value}:00:00`,
        e = `${this.currentDayTime} ${value + 1}:30:00`;

      this.addData.start_time = s;
      this.addData.end_time = e;

      this.isShowAddData = true;
    },
    esc() {
      this.isShowDayBox = false;
    },
    changeModalVal(val) {
      this.isShowDetails = val;
    },
    addModal() {
      this.cancelBtn();
      this.isShowAddData = !this.isShowAddData;
    },
    setDayClick(ct) {
      let t = this.timeSlot,
        c = [];
      for (let i = 0; i < t.length; i++) {
        if (ct === t[i].sU) {
          for (let k in t[i]) {
            c.push({
              num: t[i].h,
              info: t[i].info
            });
          }
        }
      }

      let newArr = [];
      let n = {};
      for (let i = 0; i < c.length; i++) {
        if (!n[c[i].info.id]) {
          newArr.push(c[i]);
          n[c[i].info.id] = 1;
        } else {
          n[c[i].info.id]++;
        }
      }

      if (newArr.length === 0) {
        this.currentTimeSlot = [];
      } else {
        this.currentTimeSlot = newArr;
      }

      this.isShowDayBox = !this.isShowDayBox;
    },
    searchSelectUser(val) {
      if (JSON.stringify(this.selectedParticipants) === "[]") {
        this.selectedParticipants = [...new Set(val)];
      } else {
        let s = this.selectedParticipants.concat(val);
        this.selectedParticipants = [...new Set(s)];
      }
    },
    remoteMethod(query) {
      if (query !== "") {
        this.queryLoading = true;
        let u = this.allUserNameData;

        this.searchUserData = u.filter(item => item.value.indexOf(query) > -1);
        this.queryLoading = false;
      } else {
        this.searchUserData = [];
        this.queryLoading = false;
      }
    },
    closeTag(name) {
      let s = JSON.parse(JSON.stringify(this.selectedParticipants)),
        k = null;
      for (let i = 0; i < s.length; i++) {
        if (name === s[i]) {
          k = i;
        }
      }

      s.splice(k, 1);
      this.selectedParticipants = s;
    },
    setRealName() {
      let store = this.$store.state;
      if (
        store.resolveUserInformation !== null ||
        store.resolveUserInformation === undefined
      ) {
        if (store.resolveUserInformation.obj !== null) {
          let baseInfo = store.resolveUserInformation.obj;
          this.getOneUserData(baseInfo.user_id);
          this.isSuperAdministrator = baseInfo.role_id === 0 ? true : false;
          this.currentUserId = baseInfo.user_id;
        }
      }
    },
    getOneUserData(id) {
      this.$api.auth_login
        .getOneUserData({
          user_id: id
        })
        .then(res => {
          if (res.data.code === 0) {
            let one = res.data.data[0];

            // 部门值:为空表示非本公司/非内部人员
            if (one.department_id === 13) {
              this.nonInternal = true;
            }
            if (one.department_id !== 13 && one.role_id === 0) {
              // 部门值:不为空，但角色为0(超管)，表示是内部人员
              this.nonInternal = false;
              this.getAppointmentData();
              this.getDepartmentData();
              this.getUserDataList();
              this.getMeetingRoom();
            }
            if (one.department_id !== 13 && one.role_id !== 0) {
              // 部门值:不为空，但角色为非0(非超管)，表示是内部人员
              this.nonInternal = false;
              this.getAppointmentData();
              this.getDepartmentData();
              this.getUserDataList();
              this.getMeetingRoom();
            }
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    checkAllGroupChange(data) {
      let user = this.userData;

      if (data.length === user.length) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (data.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
      }
    },
    handleCheckAll() {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }

      this.indeterminate = false;

      if (this.checkAll) {
        let user = this.userData,
          list = [];

        for (let i = 0; i < user.length; i++) {
          list.push(user[i].real_name);
        }

        this.checkAllGroup = list;
      } else {
        this.checkAllGroup = [];
      }
    },
    resetQueryBtn() {
      this.queryData.name = "";
      this.queryData.status = -2;
      this.queryData.user_id = -2;
      this.queryData.meeting_room_id = -2;
      this.queryData.start_time = `${this.$moment().format(
        "YYYY-MM"
      )}-01 00:00:00`;
      this.queryData.end_time = `${this.$moment()
        .add(1, "months")
        .format("YYYY-MM")}-01 00:00:00`;
    },
    cancelQueryBtn() {
      this.isShowRightDrawer = false;
    },
    subminQueryData() {
      this.isShowRightDrawer = false;
      this.getAppointmentData();
    },
    handleSizeChange(val) {
      this.queryData.page_index = 1;
      this.queryData.page_size = val;
      this.getAppointmentData();
    },
    handleIndexChange(val) {
      this.queryData.page_index = val;
      this.getAppointmentData();
    },
    cancelReservation(id) {
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
                        this.loading = true;
                        this.cancelLoading = true;
                        this.$api.auth_login
                          .cancelAppointment({
                            id: id
                          })
                          .then(res => {
                            if (res.data.code === 0) {
                              this.isTimeDetails = false;
                              this.cancelLoading = false;
                              this.loading = false;
                              this.$Modal.remove();
                              this.isShowDetails = false;
                              this.$Message.success(
                                this.$t("tip.successfulCancel")
                              );
                              this.getAppointmentData();
                            }
                            this.isTimeDetails = false;
                            this.cancelLoading = false;
                            this.loading = false;
                            this.isShowDetails = false;
                          })
                          .catch(error => {
                            this.isTimeDetails = false;
                            this.$Modal.remove();
                            this.cancelLoading = false;
                            this.loading = false;
                            this.$Message.error(this.$t("tip.requestError"));
                          });
                        this.loading = false;
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
    setFullCalendarData() {
      let d = this.dataList,
        data = [],
        c = [];
      this.timeSlot = [];
      this.fcEvents = [];

      for (let i = 0; i < d.length; i++) {
        let s = this.$moment(d[i].start_time)
            .subtract(8, "h")
            .format("YYYY-MM-DD HH:mm:ss"),
          startDate = this.$moment(s).get("date"),
          e = this.$moment(d[i].end_time)
            .subtract(8, "h")
            .format("YYYY-MM-DD HH:mm:ss");
        data.push({
          d: startDate,
          info: d[i],
          title: d[i].name,
          start: s,
          end: e
        });

        let sau = this.$moment(s).unix(),
          eau = this.$moment(e).unix();

        // 当前日 秒数
        let st = this.$moment(d[i].start_time)
            .subtract(8, "h")
            .format("YYYY-MM-DD"),
          us = `${st} 00:00:00`,
          es = `${st} 23:59:59`,
          uxs = this.$moment(us).unix(),
          uxe = this.$moment(es).unix();

        // console.log(`当前数据开始、结束时间戳:${sau}  ${eau}`);
        // console.log(`当前数据开始、结束时间:${s}  ${e}`);
        // console.log(`当前天数开始、结束时间戳:${uxs}  ${uxe}`);
        // console.log(`当前天数开始、结束时间:${us}  ${es}`);
        // console.log(
        //   `对比:${sau <= uxe && sau >= uxs && (eau >= uxs && eau <= uxe)}`,
        //   d[i].name
        // );

        if (sau <= uxe && sau >= uxs && (eau >= uxs && eau <= uxe)) {
          let ts = this.$moment(s).hours(),
            te = this.$moment(e).hours();
          let p = [];
          p.push(ts, te);
          c.push({
            id: d[i].id,
            sU: uxs,
            eU: uxe,
            h: p,
            info: d[i]
          });
        }
      }

      this.timeSlot = c;
      this.fcEvents = data;
    },
    getAppointmentData() {
      this.$LoadingBar.start();
      let q = this.queryData;
      let d = {
        name: q.name,
        status: q.status,
        user_id: q.user_id,
        meeting_room_id: q.meeting_room_id,
        start_time: this.$moment(q.start_time).format("YYYY-MM-DD HH:mm:ss"),
        end_time: this.$moment(q.end_time).format("YYYY-MM-DD HH:mm:ss"),
        page_index: q.page_index,
        page_size: q.page_size
      };

      this.$api.auth_login
        .getAppointmentData(d)
        .then(res => {
          if (res.data.code === 0) {
            this.isTimeDetails = false;
            let list = res.data.data;
            this.dataList = list.data_info;
            this.queryData.count = list.page_count;

            this.setFullCalendarData();

            this.$LoadingBar.finish();
          }
          this.isTimeDetails = false;
          this.$LoadingBar.finish();
        })
        .catch(error => {
          this.isTimeDetails = false;
          this.$LoadingBar.error();
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    changeEndTime(val) {
      this.addData.end_time = this.$moment(val).format("YYYY-MM-DD HH:mm:ss");
    },
    changeStartTime(val) {
      this.addData.start_time = this.$moment(val).format("YYYY-MM-DD HH:mm:ss");
    },
    changeDepartment(val) {
      this.queryUserData.page_index = 1;
      this.queryUserData.department_id = val;
      this.getUserDataList();
    },
    getDepartmentData() {
      let q = this.queryDepartmentData;
      let data = {
        name: q.name,
        page_index: q.page_index,
        page_size: q.page_size
      };

      this.$api.auth_login
        .getDepartmentData(data)
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data;
            this.departmentData = list.data_info;

            this.departmentData.unshift({
              id: -2,
              name: "全部部门"
            });
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    cancelBtn() {
      this.isShowAddData = false;
      this.addData = {
        name: null,
        start_time: null,
        end_time: null,
        meeting_user_ids: [],
        meeting_room_id: null
      };
      this.checkAllGroup = [];
      this.indeterminate = false;
      this.checkAll = false;
      this.selectedParticipants = [];
      this.selectUser = [];
    },
    subminAddData() {
      let add = this.addData;
      if (!this.$RegExp.verifyIsNull(add.name)) {
        this.$Message.warning(
          `${this.$t("tip.pleaseInput")}${this.$t("tip.conferenceTheme")}`
        );
        return;
      }
      if (!this.$RegExp.isFullwidthChar(add.name)) {
        let msg = `${this.$t("tip.pleaseInput")}${this.$t(
          "tip.chinese"
        )}、${this.$t("tip.letter")}、${this.$t("tip.n")}`;
        this.$Message.warning(msg);
        return;
      }
      if (!this.$RegExp.verifyIsNull(add.start_time)) {
        this.$Message.warning(this.$t("tip.pleaseSelectAStartTime"));
        return;
      }
      if (!this.$RegExp.verifyIsNull(add.end_time)) {
        this.$Message.warning(this.$t("tip.pleaseSelectAEndTime"));
        return;
      }

      let st = parseInt(this.$moment(add.start_time).unix()),
        et = parseInt(this.$moment(add.end_time).unix()),
        re = et - st;

      if (re < 0 || re > 14400) {
        this.$Message.warning(this.$t("tip.fourHours"));
        this.addData.start_time = null;
        this.addData.end_time = null;
        return;
      }

      if (this.selectedParticipants.length === 0) {
        this.$Message.warning(
          `${this.$t("tip.pleaseSelect")}${this.$t("tip.conferencePersonnel")}`
        );
        return;
      }
      if (!this.$RegExp.verifyIsNull(add.meeting_room_id)) {
        this.$Message.warning(
          `${this.$t("tip.pleaseSelect")}${this.$t("tip.meetingRoom")}`
        );
        return;
      }

      this.addLoading = true;

      let user = this.usersData,
        check = this.selectedParticipants,
        ids = [];

      for (let i = 0; i < check.length; i++) {
        for (let j = 0; j < user.length; j++) {
          if (check[i] === user[j].real_name) {
            ids.push(user[j].id);
          }
        }
      }

      let d = {
        name: add.name,
        start_time: this.$moment(add.start_time).format("YYYY-MM-DD HH:mm:ss"),
        end_time: this.$moment(add.end_time).format("YYYY-MM-DD HH:mm:ss"),
        meeting_user_ids: [...new Set(ids)],
        meeting_room_id: add.meeting_room_id
      };

      this.$api.auth_login
        .appointmentMeeting(d)
        .then(res => {
          if (res.data.code === 0) {
            this.addLoading = false;
            this.cancelBtn();
            this.isShowDayBox = false;
            this.$Message.success(this.$t("tip.successfulAppointment"));
            this.getAppointmentData();
          }
          this.addLoading = false;
        })
        .catch(error => {
          this.addLoading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    getUserDataList() {
      let q = this.queryUserData;
      let d = {
        real_name: q.real_name,
        mobile: q.mobile,
        role_id: q.role_id,
        department_id: q.department_id,
        page_index: q.page_index,
        page_size: q.page_size
      };

      this.$api.auth_login
        .getUserOther(d)
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data;
            this.userData = list.data_info;

            this.userData.unshift({
              id: -2,
              real_name: "全部"
            });

            if (JSON.stringify(this.usersData) === "[]") {
              this.usersData = list.data_info;
              this.usersData.map(item => {
                this.allUserNameData.push({
                  value: item.real_name,
                  label: item.real_name
                });
              });
            } else {
              this.usersData = this.usersData.concat(list.data_info);

              let arr = this.usersData;
              let newArr = [];
              let n = {};
              for (let i = 0; i < arr.length; i++) {
                if (!n[arr[i].id]) {
                  newArr.push(arr[i]);
                  n[arr[i].id] = 1;
                } else {
                  n[arr[i].id]++;
                }
              }

              this.allUserNameData = [];

              newArr.map((item, index) => {
                this.allUserNameData.push({
                  value: item.real_name,
                  label: item.real_name
                });
              });
            }

            this.indeterminate = false;
            this.checkAll = false;
            this.checkAllGroup = [];
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    getMeetingRoom() {
      this.loading = true;
      let d = {
        name: "",
        page_index: 1,
        page_size: 100
      };

      this.$api.auth_login
        .getMeetingRoom(d)
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data;
            this.meetingRoomData = list.data_info;

            this.meetingRoomData.unshift({
              id: -2,
              name: "全部"
            });

            this.loading = false;
          }
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    }
  }
};
</script>
 
<style lang="less" scoped>
.hide-details {
  width: 0;
  height: 0;
  opacity: 0;
}

.show-details {
  width: 100%;
  opacity: 1;
}

.meetingRoomAppointment-box {
  .single-page-container;

  .meetingRoomAppointment-body {
    .body;
  }
}

.addData-box {
  width: 100%;

  .box {
    width: 100%;
    min-height: 260px;
    max-height: 320px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .box-left {
      width: 40%;
      .list-item {
        width: 100%;
        padding: 5px;

        p {
          font-size: 14px;
          padding-bottom: 5px;
        }
      }
    }

    .box-right {
      width: 59%;
      padding: 5px;

      .right-header {
        padding: 3px 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        span:first-child {
          font-weight: 500;
          font-size: 14px;
        }

        span:last-child {
          cursor: pointer;
        }
      }
    }
  }
}

.attendees-box {
  width: 100%;
  padding: 5px;
  height: 240px;
  border: 1px solid #eee;
  border-radius: 4px;
  overflow-x: hidden;
  overflow-y: scroll;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */

  // 滚动条整体部分，可以设置宽度等
  &::-webkit-scrollbar {
    display: none;
  }

  .txt {
    padding: 10px 5px;
    font-size: 12px;
    color: #cccccc;
  }
}

.list-item-time {
  width: 100%;

  .time-item {
    padding: 5px;

    p {
      font-size: 14px;
      padding-bottom: 5px;
    }
  }
}

.modal-item-btn {
  padding: 20px 10px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.list-item-user {
  width: 100%;
  padding: 5px;

  p {
    font-size: 14px;
    padding-bottom: 5px;
  }

  .select-user-item {
    display: flex;
    flex-direction: column;

    .user-check-box {
      width: 100%;
      max-height: 300px;
      overflow-y: scroll;
      padding: 5px;

      &::-webkit-scrollbar {
        display: none;
      }

      .allCheckBox {
        text-align: right;
        border-bottom: 1px solid #e9e9e9;
        padding-bottom: 6px;
        margin-bottom: 6px;
      }
    }
  }
}

.drawer-box {
  width: 100%;

  .item {
    width: 100%;
    padding: 5px;

    p {
      font-size: 14px;
      padding-bottom: 5px;
    }
  }

  .drawer-item-btn {
    padding: 20px 10px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
  }
}

.table-user-box {
  height: 200px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
}

.no-user {
  z-index: 1000;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    color: #515a6e;
    font-size: 18px;
    font-weight: 600;
  }
}

.ok {
  color: #41b883;
  background-color: #c6ffe5;
}

.error {
  color: #ccc;
  background-color: #f7f7f7;
}

.select-user-box {
  padding: 5px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.select-user-title-box {
  padding: 5px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.select-duration {
  padding: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>