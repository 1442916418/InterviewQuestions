<!-- 登录页 -->

<template>
  <div class="login-box">
    <div class="login">
      <div class="logo">
        <img
          src="../../../static/imgs/logo32.png"
          alt="杭州启绿科技"
          width="32"
          height="32"
          style="vertical-align: -7px;"
        />
        <span v-html="logo"></span>
      </div>

      <Form
        class="form animated fade fadeInLeftBig faster"
        :ref="userData"
        :model="userData"
        :rules="ruleInline"
        v-if="isShowForm === 1"
      >
        <FormItem prop="name">
          <Input
            type="text"
            v-model="userData.name"
            :placeholder="$t('tip.pleaseEnterYourMobileNumber')"
            key="form1-name"
          >
            <Icon type="md-phone-portrait" slot="prefix" size="18" />
          </Input>
        </FormItem>
        <FormItem prop="pwd">
          <Input
            type="password"
            password
            v-model="userData.pwd"
            :placeholder="$t('tip.pleaseInputAPassword')"
            key="form1-pwd"
            @keyup.enter.native="handleSubmit(userData)"
          >
            <Icon type="md-lock" slot="prefix" size="18" />
          </Input>
        </FormItem>
        <div class="form-operation">
          <div @click="registerUser">{{$t('btn.registeredUser')}}</div>
          <div @click="forgetPassword">{{$t('btn.resetPassword')}}</div>
        </div>
        <FormItem :style="{'text-align':'center'}">
          <Button type="primary" long @click="handleSubmit(userData)">{{$t('btn.signIn')}}</Button>
        </FormItem>
      </Form>

      <register
        class="animated fade fadeInLeftBig faster"
        @changeShow="esc"
        v-else-if="isShowForm === 2"
      />

      <retrievePassword class="animated fade fadeInRightBig faster" @changeShow="esc" v-else />
    </div>

    <footer>
      <a :href="qrcodeUri" target="_blank">
        <div class="login_qrcode" id="login_qrcode"></div>
      </a>
      <a :href="'http://www.beian.miit.gov.cn/'" target="_blank">
        <nav>
          <span>Copyright © 2019 水质在线监测系统平台 |</span>
          <span>浙ICP备19041879号-2</span>
        </nav>
      </a>
    </footer>

    <canvas id="canvas"></canvas>
  </div>
</template>

<script>
import register from "../register/register";
import retrievePassword from "../retrievePassword/retrievePassword";
import QRCode from "qrcodejs2";
import { Base64 } from "js-base64";

export default {
  name: "",
  components: {
    register,
    retrievePassword
  },
  data() {
    return {
      qrcodeUri: this.$glb.appUri,
      logo: "水质在线监测系统平台",
      userData: {
        name: "",
        pwd: ""
      },
      ruleInline: {
        name: [
          {
            required: true,
            message: this.$t("tip.mobileNumberCannatBeEmpty"),
            trigger: "blur"
          }
        ],
        pwd: [
          {
            required: true,
            message: this.$t("tip.passwrodCannotBeEmpty"),
            trigger: "blur"
          }
        ]
      },
      isShowForm: 1 // 1 登录，2 注册，3 找回密码
    };
  },
  methods: {
    qrcode() {
      new QRCode("login_qrcode", {
        width: 50,
        height: 50,
        text: this.$glb.appUri,
        correctLevel: 3,
        render: "table"
      });
    },
    // 注册
    registerUser() {
      this.isShowForm = 2;
    },
    // 登录
    handleSubmit(n) {
      this.$refs[n].validate(valid => {
        if (valid) {
          let data = {
            username: n.name,
            passwords: n.pwd
          };

          this.$api.auth_login
            .login(data)
            .then(res => {
              if (res.data.code === 0) {
                this.$Message.info(this.$t("tip.loginSuccess"));
                let token = res.data.data.access_token,
                  info = token.split("."),
                  baseInfo = JSON.parse(Base64.decode(info[1]));

                this.$store.dispatch({
                  type: "saveUserInfo",
                  obj: res.data.data
                });

                this.$store.dispatch({
                  type: "saveUserInformationAfterParsing",
                  obj: baseInfo
                });

                this.$router.push({ name: "baiduMap" });
              }
            })
            .catch(error => {
              this.$Message.error(this.$t("tip.requestError"));
            });
        }
      });
    },
    // 忘记密码
    forgetPassword() {
      this.isShowForm = 3;
    },
    // 返回登录页
    esc() {
      this.isShowForm = 1;
    }
  },
  mounted() {
    sessionStorage.clear();

    this.qrcode();

    this.register = 1;

    document.addEventListener("touchmove", function(e) {
      e.preventDefault();
    });

    let c = document.getElementById("canvas"),
      x = c.getContext("2d"),
      pr = window.devicePixelRatio || 1,
      w = window.innerWidth - 10,
      h = window.innerHeight - 10,
      f = 90,
      q,
      r = 0,
      u = Math.PI * 2,
      v = Math.cos,
      z = Math.random;
    c.width = w * pr;
    c.height = h * pr;
    x.scale(pr, pr);
    x.globalAlpha = 0.6;
    function i() {
      x.clearRect(0, 0, w, h);
      q = [{ x: 0, y: h * 0.7 + f }, { x: 0, y: h * 0.7 - f }];
      while (q[1].x < w + f) d(q[0], q[1]);
    }
    function d(i, j) {
      x.beginPath();
      x.moveTo(i.x, i.y);
      x.lineTo(j.x, j.y);
      let k = j.x + (z() * 2 - 0.25) * f,
        n = y(j.y);
      x.lineTo(k, n);
      x.closePath();
      r -= u / -50;
      x.fillStyle =
        "#" +
        (
          ((v(r) * 127 + 128) << 16) |
          ((v(r + u / 3) * 127 + 128) << 8) |
          (v(r + (u / 3) * 2) * 127 + 128)
        ).toString(16);
      x.fill();
      q[0] = q[1];
      q[1] = { x: k, y: n };
    }
    function y(p) {
      let t = p + (z() * 2 - 1.1) * f;
      return t > h || t < 0 ? y(p) : t;
    }
    document.onclick = i;
    document.ontouchstart = i;
    i();
  }
};
</script>

<style lang="less" scoped>
.login-box {
  width: 100%;
  height: 100%;
  background-color: white;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */

  &::-webkit-scrollbar {
    width: 0 !important;
  }

  .login {
    opacity: 0.9;
    padding-top: 20px;
    width: 500px;
    min-width: 300px;
    height: 500px;
    background-color: rgba(0, 0, 0, 0);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%); /* IE9及以上支持 */
    -webkit-transform: translate(-50%, -50%); /* Safari and Chrome */
    -o-transform: translate(-50%, -50%); /* Opera */
    -moz-transform: translate(-50%, -50%); /* Firefox */

    .logo {
      padding: 4px 10px;
      text-align: center;

      span {
        font-size: 24px;
        color: "#2b85e4";
      }
    }

    .form {
      padding: 20px 80px;
      background-color: rgba(0, 0, 0, 0);

      .form-operation {
        padding: 0 0 40px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;

        div {
          display: inline-block;
          cursor: pointer;

          &:link {
            color: black;
          }

          &:visited {
            color: black;
          }

          &:hover {
            color: "#41b883";
          }

          &:active {
            color: "#41b883";
          }
        }
      }
    }

    .form2 {
      padding: 20px 80px;
      background-color: rgba(0, 0, 0, 0);
    }
  }
}

#canvas {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */

  &::-webkit-scrollbar {
    width: 0 !important;
  }
}

footer {
  padding: 10px 0;
  text-align: center;
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .login_qrcode {
    width: 50px;
    height: 50px;
    margin-right: 10px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      margin-bottom: 50px;
      margin-right: 10px;
      transform: scale(3);
      box-shadow: 0 0 10px rgba(21, 21, 21, 0.2);
    }
  }

  nav {
    text-align: center;
    font-size: 14px !important;
    color: #999 !important;
  }
}
</style>