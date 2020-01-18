<!-- 会议室和部门关系 -->

<template>
  <div class="meetingRoomAndDepartment-box">
    <div class="meetingRoomAndDepartment-header">
      <div class="header-left">
        <Select
          v-model="addData.meeting_room_id"
          style="width:200px;"
          :placeholder="$t('tip.meetingRoomName')"
          @on-change="selectMeetingRoom"
        >
          <Option
            v-for="item in meetingRoomData"
            :value="item.id"
            :key="item.id"
            :label="item.name"
          ></Option>
        </Select>
      </div>
      <div class="header-right">
        <Button
          :loading="loading"
          type="success"
          @click="savePowerGroupPower"
          style="margin-left: 50px;margin-right: 20px;"
        >{{$t('btn.preservation')}}</Button>
      </div>
    </div>
    <div class="meetingRoomAndDepartment-body">
      <Card
        style="width: 100%;padding: 10px;margin-bottom: 10px;"
        v-for="(value, name, index) in powerTypeList"
        :key="index"
      >
        <div class="card-header">
          <b>{{ $t("leftSidebar.department") }}</b>
          <Checkbox
            :indeterminate="indeterminate[name]"
            :value="checkAll[name]"
            @click.prevent.native="handleCheckAll(name)"
          >{{$t('tip.selectionAll')}}</Checkbox>
        </div>
        <CheckboxGroup
          v-model="checkAllGroup[name]"
          @on-change="checkAllGroupChange(checkAllGroup[name], name)"
        >
          <Checkbox style="width: 240px;" v-for="(item, i) in value" :key="i" :label="item.name"></Checkbox>
        </CheckboxGroup>
      </Card>
    </div>

    <div class="spin-box" v-if="spinShow">
      <div class="spin">
        <span class="spin-dot"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "meetingRoomAndDepartment",
  data() {
    return {
      loading: false,
      spinShow: false,
      departmentData: [],
      meetingRoomData: [],
      // 当前权限组权限关系
      currentRelationship: {
        department: []
      },
      // 全选按钮样式状态
      indeterminate: {
        department: false
      },
      // 全选按钮状态
      checkAll: {
        department: false
      },
      // 复选框状态
      checkAllGroup: {
        department: []
      },
      // 权限类型列表
      powerTypeList: {
        department: []
      },
      departmentData: [],
      relationshipData: [],
      addData: {
        meeting_room_id: null,
        department_ids: []
      }
    };
  },
  created() {
    this.getDepartmentData();
  },
  mounted() {
    this.getMeetingRoom();
  },
  beforeDestroy() {
    this.loading = false;
    this.spinShow = false;
    this.departmentData = [];
    this.meetingRoomData = [];
    this.currentRelationship = {
      department: []
    };
    this.indeterminate = {
      department: false
    };
    this.checkAll = {
      department: false
    };
    this.checkAllGroup = {
      department: []
    };
    this.powerTypeList = {
      department: []
    };
    this.departmentData = [];
    this.relationshipData = [];
    this.addData = {
      meeting_room_id: null,
      department_ids: []
    };
  },
  methods: {
    addMeetingRoomAndDepartmentRelationship(ids) {
      this.loading = true;
      let d = this.addData;

      let data = {
        meeting_room_id: d.meeting_room_id,
        department_ids: [...new Set(ids)]
      };

      this.$api.auth_login
        .addMeetingRoomAndDepartmentRelationship(data)
        .then(res => {
          if (res.data.code === 0) {
            this.loading = false;
            this.$Message.success(this.$t("tip.saveSuccess"));

            this.getMeetingRoomAndDepartmentRelationship(d.meeting_room_id);
          }
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    savePowerGroupPower() {
      let cacheData = this.powerTypeList.department,
        checkAllGroup = this.checkAllGroup.department,
        ids = [];

      // console.log(cacheData, "<----------   部门数据   ");
      // console.log(checkAllGroup, "<----------   选中状态   ");

      for (let i = 0; i < checkAllGroup.length; i++) {
        for (let j = 0; j < cacheData.length; j++) {
          if (checkAllGroup[i] === cacheData[j].name) {
            ids.push(cacheData[j].id);
          }
        }
      }

      if (this.addData.meeting_room_id === null) {
        let v = `${this.$t("tip.meetingRoomName")}${this.$t(
          "tip.canNotBeEmpty"
        )}`;
        this.$Message.warning(v);
        return;
      } else {
        this.addMeetingRoomAndDepartmentRelationship(ids);
      }
    },
    checkAllGroupChange(data, name) {
      let currentList = this.powerTypeList[name];

      if (data.length === currentList.length) {
        this.indeterminate[name] = false;
        this.checkAll[name] = true;
      } else if (data.length > 0) {
        this.indeterminate[name] = true;
        this.checkAll[name] = false;
      } else {
        this.indeterminate[name] = false;
        this.checkAll[name] = false;
      }
    },
    handleCheckAll(name) {
      if (this.indeterminate[name]) {
        this.checkAll[name] = false;
      } else {
        this.checkAll[name] = !this.checkAll[name];
      }

      this.indeterminate[name] = false;

      if (this.checkAll[name]) {
        let currentList = this.powerTypeList[name],
          list = [];

        for (let i = 0; i < currentList.length; i++) {
          list.push(currentList[i].name);
        }

        this.checkAllGroup[name] = list;
      } else {
        this.checkAllGroup[name] = [];
      }
    },
    selectMeetingRoom(val) {
      this.addData.meeting_room_id = val;
      this.getMeetingRoomAndDepartmentRelationship(val);
    },
    setMeetingRoomAndDepartmentRelationship() {
      this.checkAllGroup.department = [];
      this.currentRelationship.department = [];
      this.indeterminate.department = false;

      let userType = this.departmentData,
        existingMenuTypeData = this.relationshipData;

      for (let j = 0; j < existingMenuTypeData.length; j++) {
        for (let k = 0; k < userType.length; k++) {
          if (userType[k].id === Number(existingMenuTypeData[j])) {
            this.checkAllGroup.department.push(userType[k].name);
          }
        }
      }

      if (this.checkAllGroup.department.length > 0) {
        this.indeterminate.department = true;
      } else {
        this.checkAllGroup.department = [];
        this.checkAll.department = false;
        this.indeterminate.department = false;
      }

      this.currentRelationship.department = userType;
    },
    // 获取会议室数据
    getMeetingRoom() {
      this.spinShow = true;
      let d = {
        name: "",
        page_index: 1,
        page_size: 500
      };

      this.$api.auth_login
        .getMeetingRoom(d)
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data;

            if (list.length === 0) {
              this.$Message.warning(this.$t("tip.queryFailed"));
              this.spinShow = false;
              return;
            } else {
              this.meetingRoomData = list.data_info;
              this.addData.meeting_room_id = list.data_info[0].id;
              this.getMeetingRoomAndDepartmentRelationship(
                list.data_info[0].id
              );
            }

            this.spinShow = false;
          }
          this.spinShow = false;
        })
        .catch(error => {
          console.log(error);
          this.spinShow = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    // 获取部门数据
    getDepartmentData() {
      let d = {
        name: "",
        page_index: 1,
        page_size: 500
      };

      this.$api.auth_login
        .getDepartmentData(d)
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data;

            if (list.length === 0) {
              this.$Message.warning(this.$t("tip.queryFailed"));
              return;
            } else {
              this.departmentData = list.data_info;
              this.powerTypeList.department = list.data_info;
            }
          }
        })
        .catch(error => {
          console.log(error);
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    // 获取会议室和部门关系数据
    getMeetingRoomAndDepartmentRelationship(id) {
      this.$api.auth_login
        .getMeetingRoomAndDepartmentRelationship({
          meeting_room_id: id
        })
        .then(res => {
          if (res.data.code === 0) {
            let list = res.data.data;
            if (list.department_ids.length === 0) {
              this.checkAllGroup.department = [];
              this.checkAll.department = false;
              this.indeterminate.department = false;
              this.$Message.warning(this.$t("tip.noConfiguration"));
              return;
            } else {
              this.relationshipData = list.department_ids;
              this.setMeetingRoomAndDepartmentRelationship();
            }
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
.meetingRoomAndDepartment-box {
  .single-page-container;

  .meetingRoomAndDepartment-header {
    .header;

    .header-left {
      float: left;
    }

    .header-right {
      float: right;
      display: flex;
    }
  }

  .meetingRoomAndDepartment-body {
    .body;

    &::-webkit-scrollbar {
      width: 0 !important;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #e9e9e9;
      padding-bottom: 6px;
      margin-bottom: 6px;
    }
  }
}

.spin-box {
  .global-spin;
}
</style>