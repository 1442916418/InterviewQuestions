<!-- 控制 -->

<template>
  <div class="control-box animated fade fadeIn">
    <Card class="card-box" v-for="item in type" :key="item.id">
      <div class="card-box-item" @click="clickButton(item)">
        <Icon type="ios-cog-outline" size="50" color="#16a75e" />
        <b style="margin-top: 10px;color: black;">{{ item.name }}</b>
      </div>
    </Card>

    <div
      :class="{'modal-box': true, 'animated': true, 'bounce': true, 'bounceInUp': isShowModal, 'bounceOutDown': !isShowModal, 'faster': true}"
    >
      <div class="modal" v-show="isShowModal">
        <a class="modal-close">
          <Icon type="md-close" color="#16a75e" size="25" @click="cancelClick" />
        </a>
        <div class="modal-header">
          <b class="modal-header-title">{{modal.title}}</b>
        </div>
        <div class="modal-body">
          <div class="modal-type1" v-if="modal.id === 1">
            <div class="type1-time">
              <span>间隔时间</span>
              <InputNumber
                style="width:100px"
                :min="0"
                :max="100"
                v-model="modalType1.time"
                :formatter="value => `${value}日`"
              ></InputNumber>
            </div>
            <div class="type1-com">
              <span>{{ componentName }}</span>
              <InputNumber
                style="width:100px"
                :min="1"
                :max="100"
                v-model="modalType1.com"
                :step="0.1"
                :formatter="value => `${value}mg/L`"
              ></InputNumber>
            </div>
            <div
              class="type1-select-time"
              v-for="(value, name, index) in modalType1.powerTypeList"
              :key="index"
            >
              <div class="card-header">
                <Checkbox
                  :indeterminate="modalType1.indeterminate[name]"
                  :value="modalType1.checkAll[name]"
                  @click.prevent.native="handleCheckAll(name)"
                >{{$t('tip.selectionAll')}}</Checkbox>
              </div>
              <CheckboxGroup
                v-model="modalType1.checkAllGroup[name]"
                @on-change="checkAllGroupChange(modalType1.checkAllGroup[name], name)"
              >
                <Checkbox style="width: 100px;" v-for="(item, i) in value" :key="i" :label="i+'点'"></Checkbox>
              </CheckboxGroup>
            </div>
          </div>
          <div class="modal-type2" v-if="modal.id === 2">
            <div class="type1-time">
              <span>间隔时间</span>
              <InputNumber
                style="width:100px"
                :min="0"
                :max="100"
                v-model="modalType2.time"
                :formatter="value => `${value}日`"
              ></InputNumber>
            </div>
            <div class="type1-com">
              <span>{{ componentName }}</span>
              <InputNumber
                style="width:100px"
                :min="1"
                :max="100"
                :step="0.1"
                v-model="modalType2.com"
                :formatter="value => `${value}mg/L`"
              ></InputNumber>
            </div>
            <div
              class="type1-select-time"
              v-for="(value, name, index) in modalType2.powerTypeList"
              :key="index"
            >
              <div class="card-header">
                <Checkbox
                  :indeterminate="modalType2.indeterminate[name]"
                  :value="modalType2.checkAll[name]"
                  @click.prevent.native="handleCheckAll(name)"
                >{{$t('tip.selectionAll')}}</Checkbox>
              </div>
              <CheckboxGroup
                v-model="modalType2.checkAllGroup[name]"
                @on-change="checkAllGroupChange(modalType2.checkAllGroup[name], name)"
              >
                <Checkbox style="width: 100px;" v-for="(item, i) in value" :key="i" :label="i+'点'"></Checkbox>
              </CheckboxGroup>
            </div>
          </div>
          <div class="modal-type3" v-if="modal.id === 3">
            <div class="type1-time">
              <span>间隔时间</span>
              <InputNumber
                style="width:100px"
                :min="0"
                :max="100"
                v-model="modalType3.time"
                :formatter="value => `${value}日`"
              ></InputNumber>
            </div>
            <div class="type1-com">
              <span>{{ componentName }}</span>
              <InputNumber
                style="width:100px"
                :min="1"
                :max="100"
                :step="0.1"
                v-model="modalType3.com"
                :formatter="value => `${value}mg/L`"
              ></InputNumber>
            </div>
            <div
              class="type1-select-time"
              v-for="(value, name, index) in modalType3.powerTypeList"
              :key="index"
            >
              <div class="card-header">
                <Checkbox
                  :indeterminate="modalType3.indeterminate[name]"
                  :value="modalType3.checkAll[name]"
                  @click.prevent.native="handleCheckAll(name)"
                >{{$t('tip.selectionAll')}}</Checkbox>
              </div>
              <CheckboxGroup
                v-model="modalType3.checkAllGroup[name]"
                @on-change="checkAllGroupChange(modalType3.checkAllGroup[name], name)"
              >
                <Checkbox style="width: 100px;" v-for="(item, i) in value" :key="i" :label="i+'点'"></Checkbox>
              </CheckboxGroup>
            </div>
          </div>
          <div class="modal-type4" v-if="modal.id === 4">
            <div class="type1-time">
              <span>间隔时间</span>
              <InputNumber
                style="width:100px"
                :min="0"
                :max="100"
                v-model="modalType4.time"
                :formatter="value => `${value}日`"
              ></InputNumber>
            </div>
            <div
              class="type1-select-time"
              v-for="(value, name, index) in modalType4.powerTypeList"
              :key="index"
            >
              <div class="card-header">
                <Checkbox
                  :indeterminate="modalType4.indeterminate[name]"
                  :value="modalType4.checkAll[name]"
                  @click.prevent.native="handleCheckAll(name)"
                >{{$t('tip.selectionAll')}}</Checkbox>
              </div>
              <CheckboxGroup
                v-model="modalType4.checkAllGroup[name]"
                @on-change="checkAllGroupChange(modalType4.checkAllGroup[name], name)"
              >
                <Checkbox style="width: 100px;" v-for="(item, i) in value" :key="i" :label="i+'点'"></Checkbox>
              </CheckboxGroup>
            </div>
          </div>
          <div class="modal-type5" v-if="modal.id === 5">
            <div class="type1-time">
              <span>组数</span>
              <InputNumber style="width:100px" :min="0" :max="100" v-model="modalType5.groupNumber"></InputNumber>
            </div>
            <div class="type1-com">
              <span>{{ componentName }}</span>
              <InputNumber
                style="width:100px"
                :min="1"
                :max="100"
                v-model="modalType5.com"
                :step="0.1"
                :formatter="value => `${value}mg/L`"
              ></InputNumber>
            </div>
            <div
              class="type1-select-time"
              v-for="(value, name, index) in modalType5.powerTypeList"
              :key="index"
            >
              <div class="card-header">
                <Checkbox
                  :indeterminate="modalType5.indeterminate[name]"
                  :value="modalType5.checkAll[name]"
                  @click.prevent.native="handleCheckAll(name)"
                >{{$t('tip.selectionAll')}}</Checkbox>
              </div>
              <CheckboxGroup
                v-model="modalType5.checkAllGroup[name]"
                @on-change="checkAllGroupChange(modalType5.checkAllGroup[name], name)"
              >
                <Checkbox style="width: 100px;" v-for="(item, i) in value" :key="i" :label="i+'点'"></Checkbox>
              </CheckboxGroup>
            </div>
          </div>
          <div class="modal-type6" v-if="modal.id === 6">
            <div class="type1-time">
              <span>间隔时间</span>
              <InputNumber
                style="width:100px"
                :min="0"
                :max="100"
                v-model="modalType6.time"
                :formatter="value => `${value}日`"
              ></InputNumber>
            </div>
            <div
              class="type1-select-time"
              v-for="(value, name, index) in modalType6.powerTypeList"
              :key="index"
            >
              <div class="card-header">
                <Checkbox
                  :indeterminate="modalType6.indeterminate[name]"
                  :value="modalType6.checkAll[name]"
                  @click.prevent.native="handleCheckAll(name)"
                >{{$t('tip.selectionAll')}}</Checkbox>
              </div>
              <CheckboxGroup
                v-model="modalType6.checkAllGroup[name]"
                @on-change="checkAllGroupChange(modalType6.checkAllGroup[name], name)"
              >
                <Checkbox style="width: 100px;" v-for="(item, i) in value" :key="i" :label="i+'点'"></Checkbox>
              </CheckboxGroup>
            </div>
          </div>
          <div class="modal-type7" v-if="modal.id === 7">
            <div class="type1-time">
              <span>间隔时间</span>
              <InputNumber
                style="width:100px"
                :min="0"
                :max="100"
                v-model="modalType7.time"
                :formatter="value => `${value}日`"
              ></InputNumber>
            </div>
            <div class="type1-com">
              <span>{{ componentName }}</span>
              <InputNumber
                style="width:100px"
                :min="1"
                :max="100"
                :step="0.1"
                v-model="modalType7.com"
                :formatter="value => `${value}mg/L`"
              ></InputNumber>
            </div>
            <div
              class="type1-select-time"
              v-for="(value, name, index) in modalType7.powerTypeList"
              :key="index"
            >
              <div class="card-header">
                <Checkbox
                  :indeterminate="modalType7.indeterminate[name]"
                  :value="modalType7.checkAll[name]"
                  @click.prevent.native="handleCheckAll(name)"
                >{{$t('tip.selectionAll')}}</Checkbox>
              </div>
              <CheckboxGroup
                v-model="modalType7.checkAllGroup[name]"
                @on-change="checkAllGroupChange(modalType7.checkAllGroup[name], name)"
              >
                <Checkbox style="width: 100px;" v-for="(item, i) in value" :key="i" :label="i+'点'"></Checkbox>
              </CheckboxGroup>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <Button type="text" @click="cancelClick">取消</Button>
          <Button type="primary" @click="submitClick">确定</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["mn", "component"],
  data() {
    return {
      componentName: "高锰酸盐",
      type: [
        {
          id: 1,
          name: "零点核查"
        },
        {
          id: 2,
          name: "跨度核查"
        },
        {
          id: 3,
          name: "标样核查"
        },
        {
          id: 4,
          name: "空白样测试"
        },
        {
          id: 5,
          name: "平行样测试"
        },
        {
          id: 6,
          name: "动态质控样核查"
        },
        {
          id: 7,
          name: "加标回收功能"
        }
      ],
      isShowModal: false,
      modal: {
        title: null,
        id: 1
      },
      modalType1: {
        time: 0,
        com: 0,
        // 全选按钮样式状态
        indeterminate: {
          point_time: false
        },
        // 全选按钮状态
        checkAll: {
          point_time: false
        },
        // 复选框状态
        checkAllGroup: {
          point_time: []
        },
        // 权限类型列表
        powerTypeList: {
          point_time: 24
        },
        lastData: [],
        cloneCheckAllGroup: []
      },
      modalType2: {
        time: 0,
        com: 0,
        indeterminate: {
          point_time: false
        },
        checkAll: {
          point_time: false
        },
        checkAllGroup: {
          point_time: []
        },
        powerTypeList: {
          point_time: 24
        },
        lastData: [],
        cloneCheckAllGroup: []
      },
      modalType3: {
        time: 0,
        com: 0,
        indeterminate: {
          point_time: false
        },
        checkAll: {
          point_time: false
        },
        checkAllGroup: {
          point_time: []
        },
        powerTypeList: {
          point_time: 24
        },
        lastData: [],
        cloneCheckAllGroup: []
      },
      modalType4: {
        time: 0,
        com: 0,
        indeterminate: {
          point_time: false
        },
        checkAll: {
          point_time: false
        },
        checkAllGroup: {
          point_time: []
        },
        powerTypeList: {
          point_time: 24
        },
        lastData: [],
        cloneCheckAllGroup: []
      },
      modalType5: {
        groupNumber: 0,
        com: 0,
        indeterminate: {
          point_time: false
        },
        checkAll: {
          point_time: false
        },
        checkAllGroup: {
          point_time: []
        },
        powerTypeList: {
          point_time: 24
        },
        lastData: [],
        cloneCheckAllGroup: []
      },
      modalType6: {
        time: 0,
        indeterminate: {
          point_time: false
        },
        checkAll: {
          point_time: false
        },
        checkAllGroup: {
          point_time: []
        },
        powerTypeList: {
          point_time: 24
        },
        lastData: [],
        cloneCheckAllGroup: []
      },
      modalType7: {
        time: 0,
        com: 0,
        indeterminate: {
          point_time: false
        },
        checkAll: {
          point_time: false
        },
        checkAllGroup: {
          point_time: []
        },
        powerTypeList: {
          point_time: 24
        },
        lastData: [],
        cloneCheckAllGroup: []
      }
    };
  },
  watch: {
    component: function(newVal, oldVal) {
      switch (newVal) {
        case "w01019":
          this.componentName = "高锰酸盐";
          break;
        case "w21003":
          this.componentName = "氨氮";
          break;
        case "w21011":
          this.componentName = "总磷";
          break;
        case "w21001":
          this.componentName = "总氮";
          break;
      }
    }
  },
  mounted() {
    this.isShowModal = false;
  },
  beforeDestroy() {
    this.isShowModal = false;
    this.modal = {
      title: null,
      id: 1
    };
  },
  methods: {
    cancelClick() {
      this.isShowModal = !this.isShowModal;
      let id = this.modal.id;
      switch (id) {
        case 1:
          this.modalType1 = {
            time: 0,
            com: 0,
            indeterminate: {
              point_time: false
            },
            checkAll: {
              point_time: false
            },
            checkAllGroup: {
              point_time: []
            },
            powerTypeList: {
              point_time: 24
            },
            lastData: [],
            cloneCheckAllGroup: []
          };
          break;
        case 2:
          this.modalType2 = {
            time: 0,
            com: 0,
            indeterminate: {
              point_time: false
            },
            checkAll: {
              point_time: false
            },
            checkAllGroup: {
              point_time: []
            },
            powerTypeList: {
              point_time: 24
            },
            lastData: [],
            cloneCheckAllGroup: []
          };
          break;
        case 3:
          this.modalType3 = {
            time: 0,
            com: 0,
            indeterminate: {
              point_time: false
            },
            checkAll: {
              point_time: false
            },
            checkAllGroup: {
              point_time: []
            },
            powerTypeList: {
              point_time: 24
            },
            lastData: [],
            cloneCheckAllGroup: []
          };
          break;
        case 4:
          this.modalType4 = {
            time: 0,
            com: 0,
            indeterminate: {
              point_time: false
            },
            checkAll: {
              point_time: false
            },
            checkAllGroup: {
              point_time: []
            },
            powerTypeList: {
              point_time: 24
            },
            lastData: [],
            cloneCheckAllGroup: []
          };
          break;
        case 5:
          this.modalType5 = {
            groupNumber: 0,
            com: 0,
            indeterminate: {
              point_time: false
            },
            checkAll: {
              point_time: false
            },
            checkAllGroup: {
              point_time: []
            },
            powerTypeList: {
              point_time: 24
            },
            lastData: [],
            cloneCheckAllGroup: []
          };
          break;
        case 6:
          this.modalType6 = {
            time: 0,
            indeterminate: {
              point_time: false
            },
            checkAll: {
              point_time: false
            },
            checkAllGroup: {
              point_time: []
            },
            powerTypeList: {
              point_time: 24
            },
            lastData: [],
            cloneCheckAllGroup: []
          };
          break;
        case 7:
          this.modalType7 = {
            time: 0,
            com: 0,
            indeterminate: {
              point_time: false
            },
            checkAll: {
              point_time: false
            },
            checkAllGroup: {
              point_time: []
            },
            powerTypeList: {
              point_time: 24
            },
            lastData: [],
            cloneCheckAllGroup: []
          };
          break;
      }
    },
    submitClick() {
      let id = this.modal.id;
      if (id === 1) {
        let checkAll = this.modalType1.checkAllGroup;
        let c = checkAll.point_time
          .join()
          .replace(/点/g, "")
          .split(",");
        c = c.map(data => {
          return +data;
        });
        let type1 = {
          timeSpot: c,
          timeInterval: this.modalType1.time,
          componentValue: this.modalType1.com
        };

        localStorage.setItem("type1", JSON.stringify(type1));
      } else if (id === 2) {
        let checkAll = this.modalType2.checkAllGroup;
        let c = checkAll.point_time
          .join()
          .replace(/点/g, "")
          .split(",");
        c = c.map(data => {
          return +data;
        });
        let type2 = {
          timeSpot: c,
          timeInterval: this.modalType2.time,
          componentValue: this.modalType2.com
        };

        localStorage.setItem("type2", JSON.stringify(type2));
      } else if (id === 3) {
        let checkAll = this.modalType3.checkAllGroup;
        let c = checkAll.point_time
          .join()
          .replace(/点/g, "")
          .split(",");
        c = c.map(data => {
          return +data;
        });
        let type3 = {
          timeSpot: c,
          timeInterval: this.modalType3.time,
          componentValue: this.modalType3.com
        };

        localStorage.setItem("type3", JSON.stringify(type3));
      } else if (id === 4) {
        let checkAll = this.modalType4.checkAllGroup;
        let c = checkAll.point_time
          .join()
          .replace(/点/g, "")
          .split(",");
        c = c.map(data => {
          return +data;
        });
        let type4 = {
          timeSpot: c,
          timeInterval: this.modalType4.time,
          componentValue: this.modalType4.com
        };

        localStorage.setItem("type4", JSON.stringify(type4));
      } else if (id === 5) {
        let checkAll = this.modalType5.checkAllGroup;
        let c = checkAll.point_time
          .join()
          .replace(/点/g, "")
          .split(",");
        c = c.map(data => {
          return +data;
        });
        let type5 = {
          timeSpot: c,
          groupNumber: this.modalType5.groupNumber,
          componentValue: this.modalType5.com
        };

        localStorage.setItem("type5", JSON.stringify(type5));
      } else if (id === 6) {
        let checkAll = this.modalType6.checkAllGroup;
        let c = checkAll.point_time
          .join()
          .replace(/点/g, "")
          .split(",");
        c = c.map(data => {
          return +data;
        });
        let type6 = {
          timeSpot: c,
          timeInterval: this.modalType6.time
        };

        localStorage.setItem("type6", JSON.stringify(type6));
      } else if (id === 7) {
        let checkAll = this.modalType7.checkAllGroup;
        let c = checkAll.point_time
          .join()
          .replace(/点/g, "")
          .split(",");
        c = c.map(data => {
          return +data;
        });
        let type7 = {
          timeSpot: c,
          timeInterval: this.modalType7.time,
          componentValue: this.modalType7.com
        };

        localStorage.setItem("type7", JSON.stringify(type7));
      }

      this.$Message.success("保存成功");
      this.cancelClick();
    },
    clickButton(item) {
      this.isShowModal = !this.isShowModal;
      this.modal.title = item.name;
      this.modal.id = item.id;
    },
    // 全选按钮
    handleCheckAll(name) {
      let id = this.modal.id;
      switch (name) {
        case "point_time":
          switch (id) {
            case 1:
              if (this.modalType1.indeterminate[name]) {
                this.modalType1.checkAll[name] = false;
              } else {
                this.modalType1.checkAll[name] = !this.modalType1.checkAll[
                  name
                ];
              }

              this.modalType1.indeterminate[name] = false;

              if (this.modalType1.checkAll[name]) {
                let list = [];

                for (let i = 0; i < 24; i++) {
                  let a = `${i}点`;
                  list.push(a);
                }

                this.modalType1.checkAllGroup[name] = list;
              } else {
                this.modalType1.checkAllGroup[name] = [];
              }
              break;
            case 2:
              if (this.modalType2.indeterminate[name]) {
                this.modalType2.checkAll[name] = false;
              } else {
                this.modalType2.checkAll[name] = !this.modalType2.checkAll[
                  name
                ];
              }

              this.modalType2.indeterminate[name] = false;

              if (this.modalType2.checkAll[name]) {
                let list = [];

                for (let i = 0; i < 24; i++) {
                  let a = `${i}点`;
                  list.push(a);
                }

                this.modalType2.checkAllGroup[name] = list;
              } else {
                this.modalType2.checkAllGroup[name] = [];
              }
              break;
            case 3:
              if (this.modalType3.indeterminate[name]) {
                this.modalType3.checkAll[name] = false;
              } else {
                this.modalType3.checkAll[name] = !this.modalType3.checkAll[
                  name
                ];
              }

              this.modalType3.indeterminate[name] = false;

              if (this.modalType3.checkAll[name]) {
                let list = [];

                for (let i = 0; i < 24; i++) {
                  let a = `${i}点`;
                  list.push(a);
                }

                this.modalType3.checkAllGroup[name] = list;
              } else {
                this.modalType3.checkAllGroup[name] = [];
              }
              break;
            case 4:
              if (this.modalType4.indeterminate[name]) {
                this.modalType4.checkAll[name] = false;
              } else {
                this.modalType4.checkAll[name] = !this.modalType4.checkAll[
                  name
                ];
              }

              this.modalType4.indeterminate[name] = false;

              if (this.modalType4.checkAll[name]) {
                let list = [];

                for (let i = 0; i < 24; i++) {
                  let a = `${i}点`;
                  list.push(a);
                }

                this.modalType4.checkAllGroup[name] = list;
              } else {
                this.modalType4.checkAllGroup[name] = [];
              }
              break;
            case 5:
              if (this.modalType5.indeterminate[name]) {
                this.modalType4.checkAll[name] = false;
              } else {
                this.modalType5.checkAll[name] = !this.modalType5.checkAll[
                  name
                ];
              }

              this.modalType5.indeterminate[name] = false;

              if (this.modalType5.checkAll[name]) {
                let list = [];

                for (let i = 0; i < 24; i++) {
                  let a = `${i}点`;
                  list.push(a);
                }

                this.modalType5.checkAllGroup[name] = list;
              } else {
                this.modalType5.checkAllGroup[name] = [];
              }
              break;
            case 6:
              if (this.modalType6.indeterminate[name]) {
                this.modalType4.checkAll[name] = false;
              } else {
                this.modalType6.checkAll[name] = !this.modalType6.checkAll[
                  name
                ];
              }

              this.modalType6.indeterminate[name] = false;

              if (this.modalType6.checkAll[name]) {
                let list = [];

                for (let i = 0; i < 24; i++) {
                  let a = `${i}点`;
                  list.push(a);
                }

                this.modalType6.checkAllGroup[name] = list;
              } else {
                this.modalType6.checkAllGroup[name] = [];
              }
              break;
            case 7:
              if (this.modalType7.indeterminate[name]) {
                this.modalType4.checkAll[name] = false;
              } else {
                this.modalType7.checkAll[name] = !this.modalType7.checkAll[
                  name
                ];
              }

              this.modalType7.indeterminate[name] = false;

              if (this.modalType7.checkAll[name]) {
                let list = [];

                for (let i = 0; i < 24; i++) {
                  let a = `${i}点`;
                  list.push(a);
                }

                this.modalType7.checkAllGroup[name] = list;
              } else {
                this.modalType7.checkAllGroup[name] = [];
              }
              break;
          }
          break;
      }
    },
    // 单项复选框
    checkAllGroupChange(data, name) {
      let currentList = this.modalType1.powerTypeList[name],
        id = this.modal.id;

      switch (name) {
        case "point_time":
          switch (id) {
            case 1:
              if (data.length === currentList.length) {
                this.modalType1.indeterminate[name] = false;
                this.modalType1.checkAll[name] = true;
              } else if (data.length > 0) {
                this.modalType1.indeterminate[name] = true;
                this.modalType1.checkAll[name] = false;
              } else {
                this.modalType1.indeterminate[name] = false;
                this.modalType1.checkAll[name] = false;
              }
              break;
            case 2:
              if (data.length === currentList.length) {
                this.modalType2.indeterminate[name] = false;
                this.modalType2.checkAll[name] = true;
              } else if (data.length > 0) {
                this.modalType2.indeterminate[name] = true;
                this.modalType2.checkAll[name] = false;
              } else {
                this.modalType2.indeterminate[name] = false;
                this.modalType2.checkAll[name] = false;
              }
              break;
            case 3:
              if (data.length === currentList.length) {
                this.modalType3.indeterminate[name] = false;
                this.modalType3.checkAll[name] = true;
              } else if (data.length > 0) {
                this.modalType3.indeterminate[name] = true;
                this.modalType3.checkAll[name] = false;
              } else {
                this.modalType3.indeterminate[name] = false;
                this.modalType3.checkAll[name] = false;
              }
              break;
            case 4:
              if (data.length === currentList.length) {
                this.modalType4.indeterminate[name] = false;
                this.modalType4.checkAll[name] = true;
              } else if (data.length > 0) {
                this.modalType4.indeterminate[name] = true;
                this.modalType4.checkAll[name] = false;
              } else {
                this.modalType4.indeterminate[name] = false;
                this.modalType4.checkAll[name] = false;
              }
              break;
            case 5:
              if (data.length === currentList.length) {
                this.modalType5.indeterminate[name] = false;
                this.modalType5.checkAll[name] = true;
              } else if (data.length > 0) {
                this.modalType5.indeterminate[name] = true;
                this.modalType5.checkAll[name] = false;
              } else {
                this.modalType5.indeterminate[name] = false;
                this.modalType5.checkAll[name] = false;
              }
              break;
            case 6:
              if (data.length === currentList.length) {
                this.modalType6.indeterminate[name] = false;
                this.modalType6.checkAll[name] = true;
              } else if (data.length > 0) {
                this.modalType6.indeterminate[name] = true;
                this.modalType6.checkAll[name] = false;
              } else {
                this.modalType6.indeterminate[name] = false;
                this.modalType6.checkAll[name] = false;
              }
              break;
            case 7:
              if (data.length === currentList.length) {
                this.modalType7.indeterminate[name] = false;
                this.modalType7.checkAll[name] = true;
              } else if (data.length > 0) {
                this.modalType7.indeterminate[name] = true;
                this.modalType7.checkAll[name] = false;
              } else {
                this.modalType7.indeterminate[name] = false;
                this.modalType7.checkAll[name] = false;
              }
              break;
          }
          break;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.control-box {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;

  .card-box {
    width: 200px;
    margin: 20px;

    .card-box-item {
      width: 100%;
      height: 180px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }

  .modal-box {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    outline: 0;

    .modal {
      width: 100% !important;
      position: absolute;
      top: 0;
      bottom: 50px;
      background-color: white;
      box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
      -webkit-box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
      -moz-box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
      -o-box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
      -ms-box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);

      .modal-close {
        z-index: 1;
        font-size: 12px;
        position: absolute;
        right: 8px;
        top: 8px;
        overflow: hidden;
        cursor: pointer;
      }

      .modal-header {
        border-bottom: 1px solid #e8eaec;
        padding: 14px 16px;
        line-height: 1;

        .modal-header-title {
          display: inline-block;
          width: 100%;
          height: 20px;
          line-height: 20px;
          font-size: 16px;
          color: #17233d;
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .modal-body {
        width: 100%;
        overflow: auto;
        position: absolute;
        top: 51px;
        bottom: 61px;
      }

      .modal-footer {
        position: absolute;
        width: 100%;
        bottom: 0;
        border-top: 1px solid #e8eaec;
        padding: 12px 18px;
        text-align: right;
      }
    }
  }
}

.modal-type1,
.modal-type2,
.modal-type3,
.modal-type4,
.modal-type5,
.modal-type6,
.modal-type7 {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .type1-time,
  .type1-com {
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      margin-right: 100px;
    }
  }

  .type1-select-time {
    width: 100%;
    padding: 20px 200px;

    .card-header {
      padding: 20px;
      text-align: right;
      border-bottom: 1px solid #e8eaec;
    }
  }
}
</style>