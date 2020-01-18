<!-- 注册 -->

<template>
  <div class="register-box">
    <Form class="form2" :ref="resgisterUser" :model="resgisterUser" :rules="ruleInline2">
      <FormItem prop="name">
        <Input
          type="text"
          v-model="resgisterUser.name"
          :placeholder="$t('tip.pleaseEnterTheUserIsRealName')"
        >
          <Icon type="md-person" slot="prefix" size="18" />
        </Input>
      </FormItem>
      <FormItem prop="phone">
        <Input
          type="text"
          v-model="resgisterUser.phone"
          :placeholder="$t('tip.pleaseEnterYourMobileNumber')"
        >
          <Icon type="md-lock" slot="prefix" size="18" />
        </Input>
      </FormItem>
      <FormItem prop="department_id">
        <Select
          v-model="resgisterUser.department_id"
          :placeholder="$t('tip.pleaseSelect') + $t('tip.departmentName')"
        >
          <Icon type="md-bookmark" slot="prefix" size="18" />
          <Option v-for="item in departmentData" :value="item.id" :key="item.id" :label="item.name"></Option>
        </Select>
      </FormItem>
      <FormItem prop="code">
        <Input
          type="text"
          v-model="resgisterUser.code"
          :placeholder="$t('tip.pleaseEnterTheVerificationCode')"
          style="width: 190px;"
        >
          <Icon type="md-key" slot="prefix" size="18" />
        </Input>
        <Button
          type="primary"
          width="100"
          style="width: 140px;float: right;"
          :disabled="timeDisabled"
          @click="getTimeCode"
        >{{time}}</Button>
      </FormItem>
      <FormItem prop="newPwd">
        <Input
          type="password"
          password
          v-model="resgisterUser.newPwd"
          :placeholder="$t('tip.pleaseInputAPassword')"
          key="form2-newPwd"
        >
          <Icon type="md-lock" slot="prefix" size="18" />
        </Input>
      </FormItem>
      <FormItem :style="{'text-align':'center'}" style="padding: 20px 0 0 0;text-align: center;">
        <Button type="primary" long @click="resgister(resgisterUser)">{{$t('btn.register')}}</Button>
      </FormItem>
      <span @click="esc" style="font-size: 14px;cursor: pointer;color: #808695">
        <Icon type="md-arrow-back" size="16" color="#808695" />
        {{$t('btn.signIn')}}
      </span>
    </Form>
  </div>
</template>

<script>
export default {
  name: "register",
  data() {
    const validateName = (rule, value, callback) => {
      if (!this.$RegExp.verifyIsNull(value)) {
        callback(new Error(this.$t("tip.nameCnnotBeEmpty")));
      } else {
        callback();
      }
    };
    const validatePhone = (rule, value, callback) => {
      if (!this.$RegExp.verifyIsNull(value)) {
        callback(new Error(this.$t("tip.mobileNumberCannatBeEmpty")));
      } else if (!/^[1][0-9]{10}$/.test(value)) {
        callback(
          new Error(this.$t("tip.pleaseEnterAn11DigitMobilePhoneNumber"))
        );
      } else if (/^[^0-9]$/.test(value)) {
        callback(new Error(this.$t("tip.numberType")));
      } else {
        callback();
      }
    };
    const validateCode = (rule, value, callback) => {
      let phone = this.resgisterUser.code;
      if (!this.$RegExp.verifyIsNull(phone)) {
        callback(new Error(this.$t("tip.pleaseEnterTheVerificationCode")));
      } else if (!/^[0-9]{6}$/.test(value)) {
        callback(new Error(this.$t("tip.passwordMinimumSixDigits")));
      } else {
        callback();
      }
    };
    const validateNewPwd = (rule, value, callback) => {
      if (!this.$RegExp.verifyIsNull(value)) {
        callback(new Error(this.$t("tip.passwrodCannotBeEmpty")));
      } else if (value.length < 6) {
        callback(new Error(this.$t("tip.passwordMinimumSixDigits")));
      } else {
        callback();
      }
    };
    const validateDepartmentId = (rule, value, callback) => {
      if (!this.$RegExp.verifyIsNull(value)) {
        callback(
          new Error(
            `${this.$t("tip.pleaseSelect")}${this.$t("tip.departmentName")}`
          )
        );
      } else {
        callback();
      }
    };
    return {
      departmentData: [],
      resgisterUser: {
        name: "",
        phone: "",
        code: "",
        newPwd: "",
        department_id: ""
      },
      ruleInline2: {
        name: [{ required: true, validator: validateName, trigger: "blur" }],
        phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
        code: [{ required: true, validator: validateCode, trigger: "blur" }],
        newPwd: [
          { required: true, validator: validateNewPwd, trigger: "blur" }
        ],
        department_id: [
          { required: true, validator: validateDepartmentId, trigger: "blur" }
        ]
      },
      time: this.$t("tip.getVerificationCode"),
      timeDisabled: false
    };
  },
  created() {
    this.getDepartmentData();
  },
  beforeDestroy() {
    this.resgisterUser = {
      name: "",
      phone: "",
      code: "",
      newPwd: ""
    };
    this.timeDisabled = false;
  },
  methods: {
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
              this.departmentData = [];
            } else {
              this.departmentData = list.data_info;
            }
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    resgister(n) {
      this.$refs[n].validate(valid => {
        if (valid) {
          let data = {
            mobile: n.phone,
            real_name: n.name,
            passwords: n.newPwd,
            code: n.code,
            department_id: n.department_id
          };

          this.$api.auth_login
            .register(data)
            .then(res => {
              if (res.data.code === 0) {
                this.$Message.success(this.$t("tip.registrationSuccess"));

                this.$emit("changeShow", 1);

                this.resgisterUser = {
                  name: "",
                  phone: "",
                  code: "",
                  newPwd: "",
                  departmentData: ""
                };
              }
            })
            .catch(error => {
              this.resgisterUser = {
                name: "",
                phone: "",
                code: "",
                newPwd: "",
                departmentData: ""
              };
              this.$Message.error(this.$t("tip.requestError"));
            });
        }
      });
    },
    esc() {
      this.$emit("changeShow", 1);
    },
    getTimeCode() {
      let mobile = this.resgisterUser.phone;
      if (!this.$RegExp.verifyIsNull(mobile)) {
        this.$Message.warning(this.$t("tip.mobileNumberCannatBeEmpty"));
        return;
      } else if (!/^[1][0-9]{10}$/.test(mobile)) {
        this.$Message.warning(
          this.$t("tip.pleaseEnterAn11DigitMobilePhoneNumber")
        );
      } else {
        let data = {
          mobile: this.resgisterUser.phone
        };

        this.$api.auth_login
          .getMobileCode(data)
          .then(res => {
            let resData = res.data;

            if (resData.code === 0) {
              this.$Message.success(this.$t("tip.getSuccess"));

              let t = 60;
              let djs = setInterval(() => {
                let tm = --t + "S";
                this.time = tm;
                this.timeDisabled = true;

                if (t === 0) {
                  this.time = this.$t("tip.getVerificationCode");
                  this.timeDisabled = false;
                  clearInterval(djs);
                }
              }, 1000);
            }
          })
          .catch(error => {
            this.$Message.error(this.$t("tip.requestError"));
          });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.register-box {
  background-color: rgba(0, 0, 0, 0);

  .form2 {
    padding: 20px 80px;
    background-color: rgba(0, 0, 0, 0);
  }
}
</style>