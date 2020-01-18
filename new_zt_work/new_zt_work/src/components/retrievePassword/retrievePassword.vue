<!-- 重置密码 -->

<template>
  <div class="retrievePassword-box">
    <Form class="form2" :ref="modifyUserInfo" :model="modifyUserInfo" :rules="ruleInline2">
      <FormItem prop="phone">
        <Input
          type="text"
          v-model="modifyUserInfo.phone"
          :placeholder="$t('tip.pleaseEnterYourMobileNumber')"
          key="form2-phone"
        >
          <Icon type="md-phone-portrait" slot="prefix" size="18" />
        </Input>
      </FormItem>
      <FormItem prop="code">
        <Input
          type="text"
          v-model="modifyUserInfo.code"
          :placeholder="$t('tip.pleaseEnterTheVerificationCode')"
          style="width: 190px;"
          key="form2-code"
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
          v-model="modifyUserInfo.newPwd"
          :placeholder="$t('tip.pleaseEnterTheNewPassword')"
          key="form2-newPwd"
        >
          <Icon type="md-lock" slot="prefix" size="18" />
        </Input>
      </FormItem>
      <FormItem :style="{'text-align':'center'}" style="padding: 40px 0 0 0;text-align: center;">
        <Button
          type="primary"
          long
          @click="retrievePwd(modifyUserInfo)"
        >{{$t('btn.retrievePassword')}}</Button>
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
  name: "retrievePassword",
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!this.$RegExp.verifyIsNull(value)) {
        callback(new Error(this.$t("tip.mobileNumberCannatBeEmpty")));
      } else if (!/^[1][0-9]{10}$/.test(value)) {
        callback(new Errorthis.$t("tip.pleaseEnterAn11DigitMobilePhoneNumber"));
      } else if (/^[^0-9]$/.test(value)) {
        callback(new Error(this.$t("tip.numberType")));
      } else {
        callback();
      }
    };
    const validateCode = (rule, value, callback) => {
      let phone = this.modifyUserInfo.code;
      if (!this.$RegExp.verifyIsNull(value)) {
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
    return {
      modifyUserInfo: {
        phone: "",
        code: "",
        newPwd: ""
      },
      ruleInline2: {
        phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
        code: [{ required: true, validator: validateCode, trigger: "blur" }],
        newPwd: [{ required: true, validator: validateNewPwd, trigger: "blur" }]
      },
      time: this.$t("tip.getVerificationCode"),
      timeDisabled: false
    };
  },
  methods: {
    esc() {
      this.$emit("changeShow", 1);
    },
    getTimeCode() {
      let mobile = this.modifyUserInfo.phone;
      if (!this.$RegExp.verifyIsNull(mobile)) {
        this.$Message.warning(this.$t("tip.mobileNumberCannatBeEmpty"));
        return;
      } else if (!/^[1][0-9]{10}$/.test(mobile)) {
        this.$Message.warning(
          this.$t("tip.pleaseEnterAn11DigitMobilePhoneNumber")
        );
        return;
      } else {
        let data = {
          mobile: this.modifyUserInfo.phone
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
    },
    retrievePwd(n) {
      this.$refs[n].validate(valid => {
        if (valid) {
          let data = {
            mobile: n.phone,
            passwords: n.newPwd,
            code: n.code
          };

          this.$api.auth_login
            .findMobilePassword(data)
            .then(res => {
              let resData = res.data;

              if (resData.code === 0) {
                this.$Message.success(this.$t("tip.resetSuccess"));

                this.$emit("changeShow", 1);
                this.modifyUserInfo.phone = "";
                this.modifyUserInfo.code = "";
                this.modifyUserInfo.newPwd = "";
              }
            })
            .catch(error => {
              this.$Message.error(this.$t("tip.requestError"));
            });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.retrievePassword-box {
  background-color: rgba(0, 0, 0, 0);

  .form2 {
    padding: 20px 80px;
    background-color: rgba(0, 0, 0, 0);
  }
}
</style>