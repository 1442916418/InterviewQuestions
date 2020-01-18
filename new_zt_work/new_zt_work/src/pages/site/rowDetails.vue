<!-- 站点详情模块 -->

<template>
  <div class="rowDetails-box">
    <Row class="row-box">
      <Col span="8" class="item">
        <span>站点名称</span>
        <span>{{ row.name }}</span>
      </Col>
      <Col span="8" class="item">
        <span>经纬度</span>
        <span>{{lonAndLat }}</span>
      </Col>
      <Col span="8" class="item">
        <span>MN</span>
        <span>{{ row.mn }}</span>
      </Col>
    </Row>
    <Row class="row-box">
      <Col span="8" class="item">
        <span>省</span>
        <span>{{ row.province_name }}</span>
      </Col>
      <Col span="8" class="item">
        <span>市</span>
        <span>{{ row.city_name }}</span>
      </Col>
      <Col span="8" class="item">
        <span>区</span>
        <span>{{ row.district_name }}</span>
      </Col>
    </Row>
    <Row class="row-box">
      <Col span="24" class="item">
        <span>详细地址</span>
        <span>{{ row.address }}</span>
      </Col>
    </Row>
    <Row class="row-box">
      <Col span="8" class="item">
        <span>产品线</span>
        <span>{{ productName }}</span>
      </Col>
      <Col span="8" class="item">
        <span>协议</span>
        <span>{{ agreementName }}</span>
      </Col>
      <Col span="8" class="item">
        <span>水质污染等级</span>
        <span>{{ waterLevelName }}</span>
      </Col>
    </Row>
    <Row class="row-box">
      <Col span="8" class="item">
        <span>水质类型</span>
        <span>{{ waterTypeName }}</span>
      </Col>
      <Col span="8" class="item">
        <span>测量间隔</span>
        <span>{{ `${row.meter_time}（小时）` }}</span>
      </Col>
      <Col span="8" class="item">
        <span>供电类型</span>
        <span>{{ powerTypeName }}</span>
      </Col>
    </Row>
    <Row class="row-box">
      <Col span="8" class="item">
        <span>是否开启虚拟数据上传</span>
        <span>{{ fakeDataStatusName }}</span>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  props: {
    row: Object,
    provinceData: Array,
    productData: Array,
    agreementData: Array,
    waterLevel: Array,
    waterType: Array,
    powerType: Array,
    fakeDataStatus: Array
  },
  computed: {
    fakeDataStatusName: function() {
      let list = this.fakeDataStatus,
        id = this.row.fakedata_status;
      for (let i = 0; i < list.length; i++) {
        if (id === list[i].id) {
          return list[i].name;
        }
      }
    },
    powerTypeName: function() {
      let list = this.powerType,
        id = this.row.power_type;
      for (let i = 0; i < list.length; i++) {
        if (id === list[i].id) {
          return list[i].name;
        }
      }
    },
    waterTypeName: function() {
      let list = this.waterType,
        id = this.row.water_type;
      for (let i = 0; i < list.length; i++) {
        if (id === list[i].id) {
          return list[i].name;
        }
      }
    },
    waterLevelName: function() {
      let list = this.waterLevel,
        id = this.row.water_level;
      for (let i = 0; i < list.length; i++) {
        if (id === list[i].id) {
          return list[i].name;
        }
      }
    },
    agreementName: function() {
      let list = this.agreementData;
      let id = this.row.agreement_id;
      for (let i = 0; i < list.length; i++) {
        if (id === list[i].id) {
          return list[i].name;
        }
      }
    },
    provinceName: function() {
      let list = this.provinceData;
      let id = this.row.province_id;
      if (list.length === 0) {
        return "";
      } else {
        for (let i = 0; i < list.length; i++) {
          if (id === list[i].area_id) {
            return list[i].area_name;
          }
        }
      }
    },
    productName: function() {
      let list = this.productData;
      let id = this.row.product_id;
      for (let i = 0; i < list.length; i++) {
        if (id === list[i].id) {
          return list[i].name;
        }
      }
    },
    lonAndLat: function() {
      let lng = null,
        lat = null,
        point = this.row.location_point,
        si = point.indexOf(",");
      lng = parseFloat(point.substr(0, si));
      lat = parseFloat(point.substr(si + 1));
      return `经度:${lng},维度:${lat}`;
    }
  }
};
</script>

<style lang="less" scoped>
.rowDetails-box {
  padding: 5px;
  background-color: white;
  font-size: 14px;
  font-weight: 600;

  .row-box {
    padding: 5px 0;
  }

  .item {
    padding: 5px;
    transition: background-color 0.1s ease-in-out;

    span:first-child {
      &::after {
        content: ":";
      }
    }
    span:last-child {
      color: #41b883;
    }

    &:hover {
      background-color: #daffee;
    }
  }
}
</style>