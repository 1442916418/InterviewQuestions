<!-- 软件秘钥 -->

<template>
  <div class="softwareSecretKey-box">
    <div class="softwareSecretKey-body">
      <Card style="width:300px" class="card">
        <Form class="form" :ref="queryData" :model="queryData" :rules="ruleInline">
          <FormItem prop="dc">
            <p>{{`${this.$t("tip.pleaseInput")}${this.$t("tip.DC")}`}}</p>
            <Input
              style="width:100%;"
              v-model="queryData.dc"
              clearable
              :placeholder="$t('tip.pleaseInput')+$t('tip.DC')"
            />
          </FormItem>

          <FormItem prop="ckb">
            <p>{{`${this.$t("tip.pleaseInput")}${this.$t("tip.CKB")}`}}</p>
            <Input-number
              style="width:100%;"
              :max="10000000000"
              :min="1"
              v-model="queryData.ckb"
              :placeholder="$t('tip.pleaseInput')+$t('tip.CKB')"
            ></Input-number>
          </FormItem>

          <FormItem prop="pw1">
            <p>{{`${this.$t("tip.pleaseInput")}${this.$t("tip.pw1")}`}}</p>
            <Input
              style="width:100%;"
              v-model="queryData.pw1"
              clearable
              :placeholder="$t('tip.pleaseInput')+$t('tip.pw1')"
              maxlength="9"
            />
          </FormItem>

          <FormItem prop="pw2">
            <p>{{`${this.$t("tip.pleaseInput")}${this.$t("tip.pw2")}`}}</p>
            <Input
              style="width:100%;"
              v-model="queryData.pw2"
              clearable
              :placeholder="$t('tip.pleaseInput')+$t('tip.pw2')"
            />
          </FormItem>

          <FormItem prop="time">
            <p>{{`${this.$t("tip.pleaseInput")}${this.$t("tip.pTime")}`}}</p>
            <Input-number
              :max="60"
              :min="1"
              style="width:100%;"
              v-model="queryData.time"
              :placeholder="$t('tip.pleaseInput')+$t('tip.pTime')"
            ></Input-number>
          </FormItem>

          <FormItem>
            <p class="k" v-show="key !== null">{{key === null ? null : key}}</p>
            <Button
              long
              style="margin: 10px 0;"
              type="primary"
              @click="handleSubmit(queryData)"
            >{{$t('btn.confirm')}}</Button>
            <Button long @click="reset">{{$t('btn.reset')}}</Button>
          </FormItem>
        </Form>
      </Card>
    </div>
  </div>
</template>

<script>
export default {
  name: "softwareSecretKey",
  data() {
    return {
      queryData: {
        dc: "",
        ckb: 0,
        pw1: "",
        pw2: "",
        time: 1
      },
      ruleInline: {
        dc: [
          {
            required: true,
            message: `${this.$t("tip.pleaseInput")}${this.$t("tip.DC")}`,
            trigger: "blur"
          }
        ],
        ckb: [
          {
            required: true,
            type: "number",
            message: `${this.$t("tip.pleaseInput")}${this.$t("tip.CKB")}`,
            trigger: "blur"
          }
        ],
        pw1: [
          {
            required: true,
            message: `${this.$t("tip.pleaseInput")}${this.$t("tip.pw1")}`,
            trigger: "blur"
          }
        ],
        pw2: [
          {
            required: true,
            message: `${this.$t("tip.pleaseInput")}${this.$t("tip.pw2")}`,
            trigger: "blur"
          }
        ],
        time: [
          {
            required: true,
            type: "number",
            message: `${this.$t("tip.pleaseInput")}${this.$t("tip.pTime")}`,
            trigger: "blur"
          }
        ]
      },
      key: null
    };
  },
  beforeDestroy() {
    this.reset();
  },
  methods: {
    reset() {
      this.key = null;
      this.queryData = {
        dc: "",
        ckb: 0,
        pw1: "",
        pw2: "",
        time: 1
      };
    },
    handleSubmit(n) {
      this.$refs[n].validate(valid => {
        if (valid) {
          let data = {
            dc: n.dc.toString(),
            ckb: n.ckb,
            pw1: n.pw1.toString(),
            pw2: n.pw2.toString(),
            time: n.time
          };

          this.$api.monitor2
            .getSecretKey(data)
            .then(res => {
              if (res.data.code === 0) {
                this.$Message.success(this.$t("tip.keySuccess"));
                this.key = res.data.data.secret_key;
              }
            })
            .catch(error => {
              this.$Message.error(this.$t("tip.requestError"));
            });
        } else {
          this.$Message.error(this.$t("tip.canNotBeEmpty"));
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.softwareSecretKey-box {
  .single-page-container;

  .softwareSecretKey-body {
    .body;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.form {
  width: 100%;
}

.k {
  text-align: center;
  padding: 10px;
  font-size: 16px;
  font-weight: 600;
}
</style>