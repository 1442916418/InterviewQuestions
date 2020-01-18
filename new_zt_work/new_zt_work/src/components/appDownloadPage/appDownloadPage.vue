<!-- app 下载页 -->

<template>
  <div class="appDownloadPage-box">
    <div id="bg" style="background-image: url(static/imgs/bg.jpg);">
      <h1>{{ title }}</h1>
      <h4 style="margin: 10px 0;">{{$t('tip.updateTime')}}:{{ time }}</h4>
      <div class="content">
        <div class="qrcode" id="qrcode" ref="qrcode"></div>
      </div>
      <Button
        shape="circle"
        type="primary"
        style="width: 200px"
        icon="md-download"
        @click="download"
      >{{$t('btn.download')}}</Button>
      <footer>
        <a :href="'http://www.beian.miit.gov.cn/'" target="_blank">
          <nav>
            <span>Copyright © 2019 水质在线监测系统平台 |</span>
            <span>浙ICP备19041879号-2</span>
          </nav>
        </a>
      </footer>

      <div class="guide" v-if="isShow" @click="()=> isShow = !isShow">
        <Icon type="ios-share-alt-outline" class="share" size="80" color="white" />
        <h2 class="txt">
          {{$t('tip.pleaseClick')}}
          <Icon type="ios-more" size="30" />
          &nbsp; {{$t('tip.chooseToOpenInBrowser')}}
        </h2>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";

const browser = {
  versions: (function() {
    let u = navigator.userAgent,
      app = navigator.appVersion;
    return {
      //移动终端浏览器版本信息
      trident: u.indexOf("Trident") > -1, //IE内核
      presto: u.indexOf("Presto") > -1, //opera内核
      webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
      gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, //火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, //android终端或uc浏览器
      iPhone: u.indexOf("iPhone") > -1, //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf("iPad") > -1, //是否iPad
      webApp: u.indexOf("Safari") == -1 //是否web应该程序，没有头部与底部
    };
  })(),
  language: (navigator.browserLanguage || navigator.language).toLowerCase()
};

export default {
  name: "",
  data() {
    return {
      title: null,
      downloadUri: null,
      time: null,
      isShow: false
    };
  },
  mounted() {
    this.isShow = false;
    this.getFileOne();
  },
  methods: {
    download() {
      // 判断在哪个平台打开
      if (browser.versions.mobile) {
        //判断是否是移动设备打开。
        let ua = navigator.userAgent.toLowerCase(); //获取判断用的对象
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
          //或if(ua.indexOf('micromessenger') != -1){}
          //在微信中打开
          this.isShow = true;
          return;
        }
        if (ua.match(/WeiBo/i) == "weibo") {
          //在新浪微博客户端打开
          this.isShow = true;
          return;
        }
        if (ua.match(/QQ/i) == "qq") {
          //在QQ空间打开
          this.isShow = true;
          return;
        }
        window.open(this.downloadUri, "_parent");
      } else {
        //否则就是PC浏览器打开
        window.open(this.downloadUri, "_parent");
      }
    },
    getFileOne() {
      let data = {
        type: 6
      };

      this.$api.files_base
        .getOneFile(data)
        .then(res => {
          if (res.data.code === 0) {
            this.$refs.qrcode.innerHTML = "";
            let d = res.data.data;
            let t = this.$moment(d.create_time)
              .subtract(8, "hour")
              .format("YYYY-MM-DD HH:mm:ss");

            this.time = t;
            this.title = `水质监测 ${d.name}`;
            this.downloadUri = d.download_url;
            this.qrcode(d.download_url);
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    qrcode(txt) {
      new QRCode("qrcode", {
        width: 150,
        height: 150,
        text: txt,
        correctLevel: 3,
        render: "table"
      });
    }
  }
};
</script>

<style lang="less" scoped>
.appDownloadPage-box {
  width: 100%;
  height: 100%;
  background-color: white;
  z-index: 100000;

  #bg {
    width: 100%;
    height: 100%;
    z-index: -10;
    zoom: 1;
    background-color: #fff;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .content {
      margin: 40px 0;
      min-width: 300px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .login_qrcode {
        width: 150px;
        height: 150px;
      }
    }

    footer {
      padding: 10px 0;
      text-align: center;
      margin-top: 100px;

      a {
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

  .guide {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);

    .share {
      transform: rotate(-50deg);
      position: absolute;
      top: 0;
      right: 20px;
      color: white;
    }

    .txt {
      width: 100%;
      text-align: center;
      position: absolute;
      top: 100px;
      color: white;
    }
  }
}
</style>