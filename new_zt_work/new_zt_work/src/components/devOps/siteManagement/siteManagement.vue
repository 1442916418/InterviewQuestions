<!-- 站点管理 -->

<template>
  <div class="siteManagement-box">
    <div class="siteManagement-header">
      <div class="header-left">
        <ButtonGroup>
          <Button @click="addDevice" icon="md-add">{{$t('btn.newlyAdded')}}</Button>
          <Button
            type="error"
            icon="ios-trash"
            @click="delDevices"
            :loading="delLoading"
          >{{$t('btn.delete')}}</Button>
          <Button
            type="info"
            icon="md-qr-scanner"
            :loading="scaningLoading"
            @click="scaning"
          >{{$t('btn.qrcode')}}</Button>
        </ButtonGroup>
      </div>
      <div class="header-right">
        <Button
          type="primary"
          icon="ios-search"
          @click="() => isShowRightDrawer = !isShowRightDrawer"
        >{{$t('tip.screening')}}</Button>
      </div>
    </div>

    <div class="siteManagement-body">
      <DefaultTable
        :isPage="true"
        :isSelection="true"
        :columnsList="columnsList"
        :dataList="dataList"
        :loading="loading"
        :queryData="queryData"
        @handleSizeChange="handleSizeChange"
        @handleIndexChange="handleIndexChange"
        @onSelectionChange="tableSelectChange"
      />
    </div>

    <Modal v-model="qrCodeModal" :title="$t('btn.qrcode')">
      <div id="qrcode" class="qrcode" ref="qrcode"></div>
    </Modal>

    <Modal v-model="isShowMap" :title="$t('tip.pleaseSelectLatitudeAndLongitude')" width="1040">
      <siteManagementMap
        :location="currentLocationInfo"
        :center="center"
        :currentLocationLoading="currentLocationLoading"
        @baiduMapClick="baiduMapClick"
        @initMap="handler"
        @addressEnter="addressEnter"
        @currentLocation="currentLocation"
        @changeInfo="changeInfo"
      ></siteManagementMap>
    </Modal>

    <Drawer width="450" :title="$t('tip.screening')" :closable="false" v-model="isShowRightDrawer">
      <Input
        clearable
        v-model="queryData.device_name"
        :placeholder="$t('tip.pleaseEneterTheDeviceName')"
        style="width: 100%;margin-top:20px;"
      />

      <Input
        clearable
        v-model="queryData.mn"
        :placeholder="$t('tip.pleaseFillInTheMNNumber')"
        style="width: 100%;margin-top:20px;"
      />

      <Select
        @on-change="onChangeProvinceSearch"
        style="width:100%;margin-top:20px;"
        v-model="queryData.province_id"
        :placeholder="$t('tip.pleaseChooseProvince')"
      >
        <Option
          v-for="(item, index) in provinceData"
          :value="item.area_id"
          :key="index"
          :label="item.area_name"
        ></Option>
      </Select>
      <Select
        @on-change="onChangeCitySearch"
        style="width:100%;margin-top:20px;"
        v-model="queryData.city_id"
        :placeholder="$t('tip.pleaseSelectTheCity')"
      >
        <Option
          v-for="(item, index) in cityData"
          :value="item.value"
          :key="index"
          :label="item.label"
        ></Option>
      </Select>
      <Select
        style="width:100%;margin-top:20px;"
        v-model="queryData.district_id"
        :placeholder="$t('tip.pleaseSelectTheArea')"
      >
        <Option
          v-for="(item, index) in districtData"
          :value="item.value"
          :key="index"
          :label="item.label"
        ></Option>
      </Select>

      <Select
        v-model="queryData.agreement_id"
        :placeholder="$t('tip.pleaseEneterTheAgreementName')"
        style="width: 100%;margin-top: 20px;"
      >
        <Option
          v-for="item in deviceAgreementData"
          :value="item.value"
          :key="item.value"
        >{{ item.label }}</Option>
      </Select>

      <Select
        v-model="queryData.product_id"
        :placeholder="$t('tip.pleaseEneterTheProductLineName')"
        style="width: 100%;margin-top:20px;"
      >
        <Option v-for="item in productData" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>

      <div class="drawer-item-btn">
        <Button
          style="margin-bottom:10px"
          long
          type="primary"
          @click="searchDevice"
          :loading="searchLoading"
        >{{$t('btn.search')}}</Button>
        <Button
          style="margin-bottom:10px"
          type="warning"
          @click="clearSelect"
          long
        >{{$t('btn.reset')}}</Button>
        <Button @click="() => isShowRightDrawer = !isShowRightDrawer" long>{{ $t('tip.cancel') }}</Button>
      </div>
    </Drawer>

    <Modal width="520" v-model="idShowEditData" :title="$t('tip.edit')">
      <div class="editData-box">
        <div class="item-box">
          <p>{{$t("tip.pleaseFillInTheDeviceName")}}</p>
          <Input
            v-model="editData.name"
            clearable
            :placeholder="$t('tip.pleaseFillInTheDeviceName')"
          />
        </div>
        <div class="item-box">
          <p>{{$t("tip.pleaseSelectLatitudeAndLongitude")}}</p>
          <span
            style="color: #41b883;cursor: pointer;"
            v-html="addDeviceLocationInfo"
            @click="onClickLocation"
          ></span>
        </div>
        <div class="item-location-point">
          <div class="title">{{$t('tip.pleaseSelectProvinceOrCity')}}</div>
          <div class="loc">
            <Select
              @on-change="onChangeProvince"
              style="width:150px;"
              v-model="editData.province_id"
              :placeholder="$t('tip.pleaseChooseProvince')"
            >
              <Option
                v-for="(item, index) in provinceData"
                :value="item.area_id"
                :key="index"
                :label="item.area_name"
              ></Option>
            </Select>
            <Select
              @on-change="onChangeCity"
              style="width:150px;"
              v-model="editData.city_id"
              :placeholder="$t('tip.pleaseSelectTheCity')"
            >
              <Option
                v-for="(item, index) in cityData"
                :value="item.value"
                :key="index"
                :label="item.label"
              ></Option>
            </Select>
            <Select
              style="width:150px;"
              v-model="editData.district_id"
              :placeholder="$t('tip.pleaseSelectTheArea')"
            >
              <Option
                v-for="(item, index) in districtData"
                :value="item.value"
                :key="index"
                :label="item.label"
              ></Option>
            </Select>
          </div>
        </div>
        <div class="item-box">
          <p>{{$t('tip.pleaseFillInTheDetailedAddress')}}</p>
          <Input
            v-model="editData.address"
            type="textarea"
            :rows="4"
            :placeholder="$t('tip.pleaseFillInTheDetailedAddress')"
          />
        </div>
        <div class="item-box">
          <p>{{$t('tip.pleaseFillInTheMNNumber')}}</p>
          <Input v-model="editData.mn" :placeholder="$t('tip.pleaseFillInTheMNNumber')" clearable />
        </div>
        <div class="item-box-2">
          <div class="box-2">
            <p>{{$t('tip.pleaseSelectAnAgereement')}}</p>
            <Select
              style="width:150px;"
              v-model="editData.agreement_id"
              :placeholder="$t('tip.pleaseSelectAnAgereement')"
            >
              <Option
                v-for="(item, index) in agreementData"
                :value="item.id"
                :label="item.name"
                :key="index"
              ></Option>
            </Select>
          </div>
          <div class="box-2">
            <p>{{$t('tip.pleaseSelectAProductLine')}}</p>
            <Select
              style="width:150px;"
              v-model="editData.product_id"
              :placeholder="$t('tip.pleaseSelectAProductLine')"
            >
              <Option
                v-for="(item, index) in productData"
                :value="item.id"
                :label="item.name"
                :key="index"
              ></Option>
            </Select>
          </div>
        </div>
        <div class="item-box-2">
          <div class="box-2">
            <p>{{$t('tip.pleaseSelectWaterPollutionLevel')}}</p>
            <Select
              style="width:150px;"
              v-model="editData.water_level"
              :placeholder="$t('tip.pleaseSelectWaterPollutionLevel')"
            >
              <Option
                v-for="(item, index) in waterLevel"
                :value="item.id"
                :label="item.name"
                :key="index"
              ></Option>
            </Select>
          </div>
          <div class="box-2">
            <p>{{$t('tip.pleaseSelectWaterQualityType')}}</p>
            <Select
              style="width:150px;"
              v-model="editData.water_type"
              :placeholder="$t('tip.pleaseSelectWaterQualityType')"
            >
              <Option
                v-for="(item, index) in waterType"
                :value="item.id"
                :label="item.name"
                :key="index"
              ></Option>
            </Select>
          </div>
        </div>
        <div class="item-box-2">
          <div class="box-2">
            <p>{{$t('tip.pleaseFillInTheMeasurementInterval')}}</p>
            <Input-number
              style="width:150px;"
              :max="10"
              :min="1"
              v-model="editData.meter_time"
              :placeholder="$t('tip.pleaseFillInTheMeasurementInterval')"
            ></Input-number>
          </div>
          <div class="box-2">
            <p>{{$t('tip.pleaseSelectPowerSupplyType')}}</p>
            <Select
              style="width:150px;"
              v-model="editData.power_type"
              :placeholder="$t('tip.pleaseSelectPowerSupplyType')"
            >
              <Option
                v-for="(item, index) in powerType"
                :value="item.id"
                :label="item.name"
                :key="index"
              ></Option>
            </Select>
          </div>
        </div>
        <div class="item-box-2">
          <div class="box-2">
            <p>{{$t('tip.pleaseSelectVirtualDataStatus')}}</p>
            <Select
              style="width:150px;"
              v-model="editData.fakedata_status"
              :placeholder="$t('tip.pleaseSelectVirtualDataStatus')"
            >
              <Option
                v-for="(item, index) in fakeDataStatus"
                :value="item.id"
                :label="item.name"
                :key="index"
              ></Option>
            </Select>
          </div>
        </div>
        <div class="item-btn">
          <Button
            @click="() => idShowEditData = !idShowEditData"
            style="margin-right:10px;"
          >{{$t("btn.cancel")}}</Button>
          <Button
            :loading="editLoading"
            type="primary"
            @click="onClickEditSubmit"
          >{{$t("btn.confirm")}}</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
import siteManagementMap from "@/pages/site/sitManagementMap";
import RowDetails from "@/pages/site/rowDetails";

export default {
  components: {
    siteManagementMap
  },
  name: "siteManagement",
  data() {
    return {
      editLoading: false,
      isShowRightDrawer: false,
      A: null,
      addLoading: false,
      scaningLoading: false,
      delLoading: false,
      searchLoading: false,
      initCascader: [],
      queryData: {
        device_name: "",
        mn: "",
        province_id: -2,
        city_id: -2,
        district_id: -2,
        agreement_id: -2,
        product_id: -2,
        page_index: 1,
        page_size: 10,
        count: 0
      },
      idShowEditData: false,
      editData: {
        id: 0,
        name: "",
        location_point: "",
        province_id: 0,
        city_id: 0,
        district_id: 0,
        address: "",
        mn: "",
        agreement_id: 0,
        product_id: 0,
        water_level: 0,
        water_type: 0,
        meter_time: 0,
        power_type: 0,
        fakedata_status: 0
      },
      loading: true,
      dataList: [],
      agreementData: [],
      productData: [],
      isShowMap: false,
      BMAP: null,
      MAP: null,
      center: { lng: 120.1709072625, lat: 30.1670866938 },
      location: this.$t("tip.pleaseSelectALocation"),
      provincealAndUrbanAreas: {
        province: null,
        city: null,
        district: null
      },
      provinceData: [],
      cityData: [],
      districtData: [],
      selectData: {
        provinceId: null,
        cityId: null,
        districtId: null,
        agreementId: null,
        productId: null,
        waterLevel: null,
        powerType: null,
        fakedataStatu: null
      },
      one: 0,
      addDeviceData: {
        name: null,
        locationPoint: null,
        provinceId: null,
        cityId: null,
        districtId: null,
        address: null,
        mn: null,
        agreementId: null,
        productId: null,
        waterLevel: 1,
        waterType: 1,
        meterTime: 1,
        powerType: 1,
        fakedataStatus: 0
      },
      modalLoading: true,
      currentLocationInfo: "",
      addDeviceLocationInfo: this.$t("tip.clickSelectLocation"),
      currentLocationLoading: false,
      isAdd: false,
      mnArray: [],
      qrCode: null,
      qrCodeModal: false,
      deviceNameData: [],
      deviceMnData: [],
      deviceAgreementData: [],
      deviceProductData: [],
      isSearch: false,
      devicesId: [],
      waterLevel: [
        {
          id: 1,
          name: "Ⅰ"
        },
        {
          id: 2,
          name: "Ⅱ"
        },
        {
          id: 3,
          name: "Ⅲ"
        },
        {
          id: 4,
          name: "Ⅳ"
        },
        {
          id: 5,
          name: "Ⅴ"
        }
      ],
      waterType: [
        {
          id: 1,
          name: "地表水"
        },
        {
          id: 2,
          name: "湖库"
        }
      ],
      powerType: [
        {
          id: 1,
          name: "常规市电"
        },
        {
          id: 2,
          name: "太阳能供电"
        }
      ],
      fakeDataStatus: [
        {
          id: 0,
          name: "关闭"
        },
        {
          id: 1,
          name: "开启"
        }
      ],
      columnsList: [
        {
          type: "selection",
          minWidth: 60,
          align: "center"
        },
        {
          type: "expand",
          minWidth: 50,
          render: (h, params) => {
            return h(RowDetails, {
              props: {
                row: params.row,
                productData: this.productData,
                provinceData: this.provinceData,
                agreementData: this.agreementData,
                waterLevel: this.waterLevel,
                waterType: this.waterType,
                powerType: this.powerType,
                fakeDataStatus: this.fakeDataStatus
              }
            });
          }
        },
        {
          minWidth: 200,
          title: "设备名称",
          key: "name",
          align: "center"
        },
        {
          minWidth: 100,
          title: "ID",
          key: "id",
          sortable: true
        },
        {
          minWidth: 240,
          title: "MN号",
          key: "mn",
          align: "center"
        },
        {
          minWidth: 100,
          title: "省",
          key: "province_name",
          align: "center"
        },
        {
          minWidth: 100,
          title: "市",
          key: "city_name",
          align: "center"
        },
        {
          minWidth: 100,
          title: "区",
          key: "district_name",
          align: "center"
        },
        {
          title: "操作",
          minWidth: 200,
          align: "center",
          key: "handle",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    size: "small",
                    type: "info",
                    ghost: true
                  },
                  style: {
                    marginRight: "10px"
                  },
                  on: {
                    click: () => {
                      let p = params.row,
                        e = this.editData;
                      this.addDeviceLocationInfo = this.lonAndLat(
                        p.location_point
                      );
                      this.getProvinceByCityData(p.province_id);
                      this.getCityByArea(p.city_id);

                      for (let item in p) {
                        for (let k in e) {
                          if (item === k) {
                            this.editData[k] = p[item];
                          }
                        }
                      }
                      this.idShowEditData = !this.idShowEditData;
                    }
                  }
                },
                this.$t("tip.edit")
              ),
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: this.$t("tip.confirmDeletion"),
                    transfer: true,
                    placement: "left",
                    cancelText: this.$t("btn.cancel"),
                    okText: this.$t("btn.determine")
                  },
                  on: {
                    "on-ok": function() {
                      this.deleteData(params.row);
                    }
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        size: "small",
                        type: "error"
                      }
                    },
                    this.$t("btn.delete")
                  )
                ]
              )
            ]);
          }
        }
      ]
    };
  },
  created() {
    this.isShowMap = false;
    this.isShowRightDrawer = false;
    this.isSearch = false;
    this.$Modal.remove();
    this.getProvinceData();
    this.getAgreementData();
    this.getProductData();
    this.getDeviceListData();
  },
  beforeDestroy() {
    this.editLoading = false;
    this.isShowRightDrawer = false;
    this.isShowRightDrawer = false;
    this.A = null;
    this.addLoading = false;
    this.scaningLoading = false;
    this.delLoading = false;
    this.searchLoading = false;
    this.initCascader = [];
    this.loading = true;
    this.dataList = [];
    this.agreementData = [];
    this.productData = [];
    this.isShowMap = false;
    this.BMAP = null;
    this.MAP = null;
    this.center = { lng: 120.1709072625, lat: 30.1670866938 };
    this.location = this.$t("tip.pleaseSelectALocation");
    this.provincealAndUrbanAreas = {
      province: null,
      city: null,
      district: null
    };
    this.provinceData = [];
    this.cityData = [];
    this.districtData = [];
    this.selectData = {
      provinceId: null,
      cityId: null,
      districtId: null,
      agreementId: null,
      productId: null,
      waterLevel: null,
      powerType: null,
      fakedataStatu: null
    };
    this.one = 0;
    this.addDeviceData = {
      name: null,
      locationPoint: null,
      provinceId: null,
      cityId: null,
      districtId: null,
      address: null,
      mn: null,
      agreementId: null,
      productId: null,
      waterLevel: 1,
      waterType: 1,
      meterTime: 1,
      powerType: 1,
      fakedataStatus: 0
    };
    this.modalLoading = true;
    this.currentLocationInfo = "";
    this.addDeviceLocationInfo = this.$t("tip.clickSelectLocation");
    this.currentLocationLoading = false;
    this.isAdd = false;
    this.mnArray = [];
    this.qrCode = null;
    this.qrCodeModal = false;
    this.deviceNameData = [];
    this.deviceMnData = [];
    this.deviceAgreementData = [];
    this.deviceProductData = [];
    this.isSearch = false;
    this.devicesId = [];
  },
  methods: {
    lonAndLat(data) {
      let lng = null,
        lat = null,
        point = data,
        si = point.indexOf(",");
      lng = parseFloat(point.substr(0, si));
      lat = parseFloat(point.substr(si + 1));
      return `经度:${lng}<br>维度:${lat}`;
    },
    onClickEditSubmit() {
      let e = this.editData;
      if (!this.$RegExp.verifyIs0(e.id)) {
        this.$Message.warning(this.$t("tip.devName"));
        return;
      }

      if (!this.$RegExp.verifyIsNull(e.name)) {
        this.$Message.warning(this.$t("tip.pleaseFillInTheDeviceName"));
        this.editData.name = null;
        return;
      }
      if (!this.$RegExp.verifyIsNull(this.addDeviceLocationInfo)) {
        this.$Message.warning(this.$t("tip.pleaseSelectLatitudeAndLongitude"));
        return;
      }
      if (!this.$RegExp.verifyIsNull(e.province_id)) {
        this.$Message.warning(this.$t("tip.pleaseChooseProvince"));
        this.editData.province_id = null;
        return;
      }
      if (!this.$RegExp.verifyIsNull(e.city_id)) {
        this.$Message.warning(this.$t("tip.pleaseSelectTheCity"));
        this.editData.city_id = null;
        return;
      }
      if (!this.$RegExp.verifyIsNull(e.district_id)) {
        this.$Message.warning(this.$t("tip.pleaseSelectTheArea"));
        this.editData.district_id = null;
        return;
      }
      if (!this.$RegExp.verifyIsNull(e.address)) {
        this.$Message.warning(this.$t("tip.pleaseFillInTheDetailedAddress"));
        this.editData.address = null;
        return;
      }
      if (!this.$RegExp.verifyIsNull(e.mn)) {
        this.$Message.warning(this.$t("tip.pleaseFillInTheMNNumber"));
        this.editData.mn = null;
        return;
      }
      if (!this.$RegExp.verifyIsNull(e.agreement_id)) {
        this.$Message.warning(this.$t("tip.pleaseSelectAnAgereement"));
        this.editData.agreement_id = 1;
        return;
      }
      if (!this.$RegExp.verifyIsNull(e.product_id)) {
        this.$Message.warning(this.$t("tip.pleaseSelectAProductLine"));
        this.editData.product_id = 1;
        return;
      }
      if (!this.$RegExp.verifyIsNull(e.water_level)) {
        this.$Message.warning(this.$t("tip.pleaseSelectWaterPollutionLevel"));
        this.editData.water_level = 1;
        return;
      }
      if (!this.$RegExp.verifyIsNull(e.water_type)) {
        this.$Message.warning(this.$t("tip.pleaseSelectWaterQualityType"));
        this.editData.water_type = 1;
        return;
      }
      if (!this.$RegExp.verifyIsNull(e.meter_time)) {
        this.$Message.warning(
          this.$t("tip.pleaseFillInTheMeasurementInterval")
        );
        this.editData.meter_time = 1;
        return;
      }
      if (!this.$RegExp.verifyIsNull(e.power_type)) {
        this.$Message.warning(this.$t("tip.pleaseSelectPowerSupplyType"));
        this.editData.power_type = 1;
        return;
      }
      if (!this.$RegExp.verifyIsNull(e.fakedata_status)) {
        this.$Message.warning(this.$t("tip.pleaseSelectVirtualDataStatus"));
        this.editData.fakedata_status = 0;
        return;
      }
      this.editLoading = true;
      let s = this.addDeviceLocationInfo.split("<br>");
      let lng = s[0].slice(3);
      let lat = s[1].slice(3);
      let location = `${lng},${lat}`;

      let data = {
        device_id: e.id,
        name: e.name,
        location_point: location,
        province_id: e.province_id,
        city_id: e.city_id,
        district_id: e.district_id,
        address: e.address,
        mn: e.mn,
        agreement_id: e.agreement_id,
        product_id: e.product_id,
        water_level: e.water_level,
        water_type: e.water_type,
        meter_time: e.meter_time,
        power_type: e.power_type,
        fakedata_status: e.fakedata_status
      };

      this.$api.monitor1
        .editDevice(data)
        .then(res => {
          if (res.data.code === 0) {
            this.editLoading = false;
            this.idShowEditData = false;
            this.$Message.success(this.$t("tip.saveSuccess"));
            this.getDeviceListData();
          }
          this.editLoading = false;
        })
        .catch(error => {
          this.editLoading = false;
          this.idShowEditData = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    onClickLocation() {
      this.isShowMap = !this.isShowMap;
    },
    onChangeCity(id) {
      this.getCityByArea(id);
    },
    onChangeCitySearch(id) {
      this.getCityByArea(id);
    },
    onChangeProvince(id) {
      this.getProvinceByCityData(id);
    },
    onChangeProvinceSearch(id) {
      this.getProvinceByCityData(id);
    },
    changeInfo(value) {
      this.currentLocationInfo = value;
    },
    delDevices() {
      let ids = this.devicesId;
      if (ids.length === 0) {
        this.$Message.warning(this.$t("tip.pleaseCheckTheEquipment"));
        return;
      } else {
        this.$Modal.confirm({
          title: this.$t("tip.confirmationDelete"),
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
                        type: "primary"
                      },
                      style: {
                        float: "right",
                        "margin-top": "10px",
                        "margin-bottom": "10px"
                      },
                      on: {
                        click: () => {
                          this.subDelDevices(ids);
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
      }
    },
    subDelDevices(ids) {
      this.delLoading = true;
      let data = {
        device_ids: ids
      };

      this.$api.monitor1
        .delDevices(data)
        .then(res => {
          if (res.data.code === 0) {
            this.$Message.success(this.$t("tip.deleteSuccess"));

            this.delLoading = false;
            this.$Modal.remove();
            this.getDeviceListData();
          }
        })
        .catch(error => {
          this.delLoading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    clearSelect() {
      let c = this.queryData.count;
      this.queryData = {
        agreement_id: -2,
        device_name: "",
        mn: "",
        province_id: -2,
        city_id: -2,
        district_id: -2,
        product_id: -2,
        page_index: 1,
        page_size: 10,
        count: c
      };
    },
    searchDevice() {
      this.getDeviceListData();
    },
    scaning() {
      let mns = this.mnArray;

      if (mns.length === 0) {
        this.$Message.warning(this.$t("tip.pleaseCheckTheEquipment"));
        return;
      } else {
        this.scaningLoading = true;
        let mnStr = mns.toString().replace(/[,]+/g, "/");
        this.qrCode = null;
        this.$refs.qrcode.innerHTML = "";

        let data = {
          mn: mnStr
        };

        this.$api.monitor1
          .getDevicesCode(data)
          .then(res => {
            if (res.data.code === 0) {
              this.qrCode = res.data.data.device_code;

              this.qrcode();
              this.qrCodeModal = true;
            }
            this.scaningLoading = false;
          })
          .catch(error => {
            this.scaningLoading = false;
            this.$Message.error(this.$t("tip.requestError"));
          });
      }
    },
    qrcode() {
      new QRCode("qrcode", {
        text: this.qrCode,
        width: 300,
        height: 300,
        correctLevel: 3,
        render: "canvas",
        background: "#f0f",
        foreground: "#ff0"
      });
    },
    tableSelectChange(selection) {
      this.mnArray = [];
      this.devicesId = [];

      for (let i = 0; i < selection.length; i++) {
        this.mnArray.push(selection[i].mn);
        this.devicesId.push(selection[i].id);
      }
    },
    submitAddDevice() {
      let d = this.addDeviceData;

      if (!this.$RegExp.verifyIsNull(d.name)) {
        this.$Message.warning(this.$t("tip.pleaseFillInTheDeviceName"));
        this.addDeviceData.name = null;
        return;
      }
      if (!this.$RegExp.verifyIsNull(d.locationPoint)) {
        this.$Message.warning(this.$t("tip.pleaseSelectLatitudeAndLongitude"));
        this.addDeviceData.locationPoint = null;
        return;
      }
      if (!this.$RegExp.verifyIsNull(d.provinceId)) {
        this.$Message.warning(this.$t("tip.pleaseChooseProvince"));
        this.addDeviceData.provinceId = null;
        return;
      }
      if (!this.$RegExp.verifyIsNull(d.cityId)) {
        this.$Message.warning(this.$t("tip.pleaseSelectTheCity"));
        this.addDeviceData.cityId = null;
        return;
      }
      if (!this.$RegExp.verifyIsNull(d.districtId)) {
        this.$Message.warning(this.$t("tip.pleaseSelectTheArea"));
        this.addDeviceData.districtId = null;
        return;
      }
      if (!this.$RegExp.verifyIsNull(d.address)) {
        this.$Message.warning(this.$t("tip.pleaseFillInTheDetailedAddress"));
        this.addDeviceData.address = null;
        return;
      }
      if (!this.$RegExp.verifyIsNull(d.mn)) {
        this.$Message.warning(this.$t("tip.pleaseFillInTheMNNumber"));
        this.addDeviceData.mn = null;
        return;
      }
      if (!this.$RegExp.verifyIsNull(d.meterTime)) {
        this.$Message.warning(
          this.$t("tip.pleaseFillInTheMeasurementInterval")
        );
        this.addDeviceData.meterTime = 1;
        return;
      }
      if (!this.$RegExp.verifyIsNull(d.agreementId)) {
        this.$Message.warning(this.$t("tip.pleaseSelectAnAgereement"));
        this.addDeviceData.agreementId = null;
        return;
      }
      if (!this.$RegExp.verifyIsNull(d.productId)) {
        this.$Message.warning(this.$t("tip.pleaseSelectAProductLine"));
        this.addDeviceData.productId = null;
        return;
      }
      if (!this.$RegExp.verifyIsNull(d.waterLevel)) {
        this.$Message.warning(this.$t("tip.pleaseSelectWaterPollutionLevel"));
        this.addDeviceData.waterLevel = 1;
        return;
      }
      if (!this.$RegExp.verifyIsNull(d.waterType)) {
        this.$Message.warning(this.$t("tip.pleaseSelectWaterQualityType"));
        this.addDeviceData.waterType = 1;
        return;
      }
      if (!this.$RegExp.verifyIsNull(d.powerType)) {
        this.$Message.warning(this.$t("tip.pleaseSelectPowerSupplyType"));
        this.addDeviceData.powerType = 1;
        return;
      }
      if (!this.$RegExp.verifyIsNull(d.fakedataStatus)) {
        this.$Message.warning(this.$t("tip.pleaseSelectVirtualDataStatus"));
        this.addDeviceData.fakedataStatus = 0;
        return;
      }
      this.addLoading = true;
      let s = d.locationPoint.split("<br>");
      let lng = s[0].slice(3);
      let lat = s[1].slice(3);
      let location = `${lng},${lat}`;

      let data = {
        name: d.name,
        location_point: location,
        province_id: Number(d.provinceId),
        city_id: Number(d.cityId),
        district_id: Number(d.districtId),
        address: d.address,
        mn: d.mn,
        agreement_id: Number(d.agreementId),
        product_id: Number(d.productId),
        water_level: Number(d.waterLevel),
        water_type: Number(d.waterType),
        meter_time: Number(d.meterTime),
        power_type: Number(d.powerType),
        fakedata_status: Number(d.fakedataStatus)
      };

      this.$api.monitor1
        .addDevice(data)
        .then(res => {
          if (res.data.code === 0) {
            this.reduction();
            this.$Modal.remove();
            this.$Message.success(this.$t("tip.addSuccess"));

            this.getDeviceListData();
          }
          this.addLoading = false;
        })
        .catch(error => {
          this.addLoading = false;
          this.reduction();
          this.$Message.error(this.$t("tip.requestError"));
        });
      this.isAdd = true;
    },
    addDevice() {
      this.getProvinceData();
      this.isAdd = true;
      this.reduction();
      this.$Modal.confirm({
        width: "520",
        scrollable: true,
        loading: this.modalLoading,
        render: h => {
          return h("div", [
            h("div", {
              domProps: {
                innerHTML: this.$t("tip.pleaseFillInTheDeviceName")
              },
              style: {
                "text-align": "left",
                "padding-top": "10px"
              }
            }),
            h("Input", {
              props: {
                value: this.addDeviceData.name,
                autofocus: true,
                placeholder: this.$t("tip.pleaseFillInTheDeviceName")
              },
              style: {
                "margin-top": "10px",
                "margin-padding": "10px"
              },
              on: {
                input: val => {
                  this.addDeviceData.name = val.trim();
                }
              }
            }),
            h("div", {
              domProps: {
                innerHTML: this.$t("tip.pleaseSelectLatitudeAndLongitude")
              },
              style: {
                "text-align": "left",
                "padding-top": "10px"
              }
            }),
            h("span", {
              domProps: {
                innerHTML: this.addDeviceLocationInfo
              },
              style: {
                color: "#2d8cf0",
                cursor: "pointer",
                "padding-top": "10px"
              },
              on: {
                click: () => {
                  this.isShowMap = true;
                }
              }
            }),
            h("div", {
              domProps: {
                innerHTML: this.$t("tip.pleaseSelectProvinceOrCity")
              },
              style: {
                "text-align": "left",
                "padding-top": "10px",
                display: "flex"
              }
            }),
            h("div", [
              h(
                "Select",
                {
                  props: {
                    value: this.addDeviceData.provinceId,
                    placeholder: this.$t("tip.pleaseChooseProvince")
                  },
                  on: {
                    "on-change": value => {
                      if (value != undefined) {
                        this.addDeviceData.provinceId = value;
                        this.getProvinceByCityData(value);
                      }
                    }
                  },
                  style: {
                    width: "150px",
                    "margin-top": "10px",
                    "margin-padding": "10px",
                    "margin-right": "10px"
                  }
                },
                [
                  this.provinceData.map(function(type) {
                    return h(
                      "Option",
                      {
                        props: {
                          value: type.value
                        }
                      },
                      type.label
                    );
                  })
                ]
              ),
              h(
                "Select",
                {
                  props: {
                    value: this.addDeviceData.cityId,
                    placeholder: this.$t("tip.pleaseSelectTheCity")
                  },
                  on: {
                    "on-change": value => {
                      if (value != undefined) {
                        this.addDeviceData.cityId = value;
                        this.getCityByArea(value);
                      }
                    }
                  },
                  style: {
                    width: "150px",
                    "margin-top": "10px",
                    "margin-padding": "10px",
                    "margin-right": "10px"
                  }
                },
                [
                  this.cityData.length === 0
                    ? null
                    : this.cityData.map(function(type) {
                        // 把map看作循环,type看作循环的每一项
                        return h(
                          "Option",
                          {
                            props: {
                              value: type.value
                            }
                          },
                          type.label
                        );
                      })
                ]
              ),
              h(
                "Select",
                {
                  props: {
                    value: this.addDeviceData.districtId,
                    placeholder: this.$t("tip.pleaseSelectTheArea")
                  },
                  on: {
                    "on-change": value => {
                      if (value != undefined) {
                        this.addDeviceData.districtId = value;
                      }
                    }
                  },
                  style: {
                    width: "150px",
                    "margin-top": "10px",
                    "margin-padding": "10px",
                    "margin-right": "10px"
                  }
                },
                [
                  this.districtData.length === 0
                    ? null
                    : this.districtData.map(function(type) {
                        return h(
                          "Option",
                          {
                            props: {
                              value: type.value
                            }
                          },
                          type.label
                        );
                      })
                ]
              )
            ]),
            h("div", {
              domProps: {
                innerHTML: this.$t("tip.pleaseFillInTheDetailedAddress")
              },
              style: {
                "text-align": "left",
                "padding-top": "10px"
              }
            }),
            h("Input", {
              props: {
                type: "textarea",
                rows: 3,
                value: this.addDeviceData.address,
                placeholder: this.$t("tip.pleaseFillInTheDetailedAddress")
              },
              style: {
                "margin-top": "10px",
                "margin-padding": "10px"
              },
              on: {
                input: val => {
                  this.addDeviceData.address = val.trim();
                }
              }
            }),
            h("div", {
              domProps: {
                innerHTML: this.$t("tip.pleaseFillInTheMNNumber")
              },
              style: {
                "text-align": "left",
                "padding-top": "10px"
              }
            }),
            h("Input", {
              props: {
                type: "text",
                value: this.addDeviceData.mn,
                placeholder: this.$t("tip.pleaseFillInTheMNNumber")
              },
              style: {
                "margin-top": "10px",
                "margin-padding": "10px"
              },
              on: {
                input: val => {
                  this.addDeviceData.mn = val.trim();
                }
              }
            }),
            h("div", {
              domProps: {
                innerHTML: this.$t("tip.pleaseFillInTheMeasurementInterval")
              },
              style: {
                "text-align": "left",
                "padding-top": "10px"
              }
            }),
            h("InputNumber", {
              props: {
                value: this.addDeviceData.meterTime,
                placeholder: this.$t("tip.pleaseFillInTheMeasurementInterval")
              },
              style: {
                width: "150px",
                "margin-top": "10px",
                "margin-padding": "10px"
              },
              on: {
                input: val => {
                  this.addDeviceData.meterTime = val;
                }
              }
            }),
            h(
              "div",
              {
                style: {
                  display: "flex",
                  "justify-content": "space-between"
                }
              },
              [
                h("span", {
                  domProps: {
                    innerHTML: this.$t("tip.pleaseSelectAnAgereement")
                  },
                  style: {
                    "padding-top": "10px"
                  }
                }),
                h("span", {
                  domProps: {
                    innerHTML: this.$t("tip.pleaseSelectAProductLine")
                  },
                  style: {
                    "padding-top": "10px",
                    "margin-right": "130px"
                  }
                })
              ]
            ),
            h(
              "div",
              {
                style: {
                  display: "flex",
                  "justify-content": "space-between"
                }
              },
              [
                h(
                  "Select",
                  {
                    props: {
                      value: this.addDeviceData.agreementId,
                      placeholder: this.$t("tip.pleaseSelectAnAgereement")
                    },
                    on: {
                      "on-change": value => {
                        this.addDeviceData.agreementId = value;
                      }
                    },
                    style: {
                      width: "150px",
                      "margin-top": "10px",
                      "margin-padding": "10px",
                      "margin-right": "10px"
                    }
                  },
                  [
                    this.agreementData.map(function(type) {
                      return h(
                        "Option",
                        {
                          props: {
                            value: type.id
                          }
                        },
                        type.name
                      );
                    })
                  ]
                ),
                h(
                  "Select",
                  {
                    props: {
                      value: this.addDeviceData.productId,
                      placeholder: this.$t("tip.pleaseSelectAProductLine")
                    },
                    on: {
                      "on-change": value => {
                        this.addDeviceData.productId = value;
                      }
                    },
                    style: {
                      width: "150px",
                      "margin-top": "10px",
                      "margin-padding": "10px",
                      "margin-right": "25px"
                    }
                  },
                  [
                    this.productData.map(function(type) {
                      // 把map看作循环,type看作循环的每一项
                      return h(
                        "Option",
                        {
                          props: {
                            value: type.id
                          }
                        },
                        type.name
                      );
                    })
                  ]
                )
              ]
            ),
            h(
              "div",
              {
                style: {
                  display: "flex",
                  "justify-content": "space-between"
                }
              },
              [
                h("span", {
                  domProps: {
                    innerHTML: this.$t("tip.pleaseSelectWaterPollutionLevel")
                  },
                  style: {
                    "padding-top": "10px"
                  }
                }),
                h("span", {
                  domProps: {
                    innerHTML: this.$t("tip.pleaseSelectWaterQualityType")
                  },
                  style: {
                    "padding-top": "10px",
                    "margin-right": "115px"
                  }
                })
              ]
            ),
            h(
              "div",
              {
                style: {
                  display: "flex",
                  "justify-content": "space-between"
                }
              },
              [
                h(
                  "Select",
                  {
                    props: {
                      value: this.addDeviceData.waterLevel,
                      placeholder: this.$t(
                        "tip.pleaseSelectWaterPollutionLevel"
                      )
                    },
                    on: {
                      "on-change": value => {
                        this.addDeviceData.waterLevel = value;
                      }
                    },
                    style: {
                      width: "150px",
                      "margin-top": "10px",
                      "margin-padding": "10px",
                      "margin-right": "10px"
                    }
                  },
                  [
                    this.waterLevel.map(function(type) {
                      return h(
                        "Option",
                        {
                          props: {
                            value: type.id
                          }
                        },
                        type.name
                      );
                    })
                  ]
                ),
                h(
                  "Select",
                  {
                    props: {
                      value: this.addDeviceData.waterType,
                      placeholder: this.$t("tip.pleaseSelectWaterQualityType")
                    },
                    on: {
                      "on-change": value => {
                        this.addDeviceData.waterType = value;
                      }
                    },
                    style: {
                      width: "150px",
                      "margin-top": "10px",
                      "margin-padding": "10px",
                      "margin-right": "25px"
                    }
                  },
                  [
                    this.waterType.map(function(type) {
                      // 把map看作循环,type看作循环的每一项
                      return h(
                        "Option",
                        {
                          props: {
                            value: type.id
                          }
                        },
                        type.name
                      );
                    })
                  ]
                )
              ]
            ),
            h(
              "div",
              {
                style: {
                  display: "flex",
                  "justify-content": "space-between"
                }
              },
              [
                h("span", {
                  domProps: {
                    innerHTML: this.$t("tip.pleaseSelectPowerSupplyType")
                  },
                  style: {
                    "padding-top": "10px"
                  }
                }),
                h("span", {
                  domProps: {
                    innerHTML: this.$t("tip.pleaseSelectVirtualDataStatus")
                  },
                  style: {
                    "padding-top": "10px",
                    "margin-right": "87px"
                  }
                })
              ]
            ),
            h(
              "div",
              {
                style: {
                  display: "flex",
                  "justify-content": "space-between"
                }
              },
              [
                h(
                  "Select",
                  {
                    props: {
                      value: this.addDeviceData.powerType,
                      placeholder: this.$t("tip.pleaseSelectPowerSupplyType")
                    },
                    on: {
                      "on-change": value => {
                        this.addDeviceData.powerType = value;
                      }
                    },
                    style: {
                      width: "150px",
                      "margin-top": "10px",
                      "margin-padding": "10px",
                      "margin-right": "10px"
                    }
                  },
                  [
                    this.powerType.map(function(type) {
                      return h(
                        "Option",
                        {
                          props: {
                            value: type.id
                          }
                        },
                        type.name
                      );
                    })
                  ]
                ),
                h(
                  "Select",
                  {
                    props: {
                      value: this.addDeviceData.fakedataStatus,
                      placeholder: this.$t("tip.pleaseSelectVirtualDataStatus")
                    },
                    on: {
                      "on-change": value => {
                        this.addDeviceData.fakedataStatus = value;
                      }
                    },
                    style: {
                      width: "150px",
                      "margin-top": "10px",
                      "margin-padding": "10px",
                      "margin-right": "25px"
                    }
                  },
                  [
                    this.fakeDataStatus.map(function(type) {
                      // 把map看作循环,type看作循环的每一项
                      return h(
                        "Option",
                        {
                          props: {
                            value: type.id
                          }
                        },
                        type.name
                      );
                    })
                  ]
                )
              ]
            ),
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
                      loading: this.addLoading
                    },
                    style: {
                      float: "right",
                      "margin-top": "10px",
                      "margin-bottom": "10px"
                    },
                    on: {
                      click: () => {
                        this.submitAddDevice();
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
                      click: e => {
                        e.stopPropagation();
                        this.$Modal.remove();
                        this.isAdd = false;
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
    reduction() {
      this.addDeviceData = {
        name: null,
        locationPoint: null,
        provinceId: null,
        cityId: null,
        districtId: null,
        address: null,
        mn: null,
        agreementId: null,
        productId: null,
        waterLevel: 1,
        waterType: 1,
        meterTime: 1,
        powerType: 1,
        fakedataStatus: 0
      };
      this.addDeviceLocationInfo = this.$t("tip.clickSelectLocation");
    },
    addressEnter(currentLocationInfo) {
      this.center = currentLocationInfo;
    },
    currentLocation() {
      this.currentLocationLoading = true;
      let bmap = this.BMAP;
      let that = this;
      let geolocation = new bmap.Geolocation();
      geolocation.getCurrentPosition(
        function(r) {
          that.center = r.point;
          that.location = `${that.$t("tip.longitude")}:${
            r.point.lng
          }<br>${that.$t("tip.dimension")}:${r.point.lat}`;
          that.addDeviceLocationInfo = that.location;
          that.addDeviceData.locationPoint = that.location;
          that.editData.location_point = `${r.longitude},${r.latitude}`;
          that.getAddress(r.point);
          that.isShowMap = false;
          that.currentLocationLoading = false;
        },
        { enableHighAccuracy: true }
      );
    },
    baiduMapClick(type, target, point, pixel, overlay) {
      this.center = point;
      this.location = `${this.$t("tip.longitude")}:${point.lng}<br>${this.$t(
        "tip.dimension"
      )}:${point.lat}`;
      this.addDeviceLocationInfo = this.location;
      this.addDeviceData.locationPoint = this.location;
      this.getAddress(point);
    },
    getAddress(pt) {
      let bmap = this.BMAP;
      let myGeo = new bmap.Geocoder();
      let that = this;

      myGeo.getLocation(pt, function(res) {
        let address = res.addressComponents;

        that.provincealAndUrbanAreas = {
          province: null,
          city: null,
          district: null
        };

        that.provincealAndUrbanAreas = {
          province: address.province,
          city: address.city,
          district: address.district
        };

        if (that.isAdd || that.idShowEditData) {
          let all = that.dataList;
          for (let i = 0; i < all.length; i++) {
            if (all[i].province_name === address.province) {
              that.getProvinceByCityData(all[i].province_id);

              that.addDeviceData.provinceId = all[i].province_id;
              that.editData.province_id = all[i].province_id;
              break;
            }
          }
        }
        let d = `${address.province}${address.city}${address.district}${address.street}${address.streetNumber}`;
        that.addDeviceData.address = d;
        that.currentLocationInfo = d;
        that.editData.address = d;
      });
    },
    hideMap() {
      this.isShowMap = false;
    },
    deleteData(row) {
      let data = {
        device_id: row.id
      };

      this.$api.monitor1
        .deleteDevice(data)
        .then(res => {
          if (res.data.code === 0) {
            this.$Message.success(this.$t("tip.deleteSuccess"));

            this.getDeviceListData();
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    handleSizeChange(val) {
      this.queryData.page_index = 1;
      this.queryData.page_size = val;
      this.getDeviceListData();
    },
    handleIndexChange(val) {
      this.queryData.page_index = val;
      this.getDeviceListData();
    },
    getDeviceListData() {
      this.loading = true;
      let q = this.queryData;
      let data = {
        device_name: q.device_name,
        mn: q.mn,
        province_id: q.province_id,
        city_id: q.city_id,
        district_id: q.district_id,
        agreement_id: q.agreement_id,
        product_id: q.product_id,
        page_index: q.page_index,
        page_size: q.page_size
      };

      this.$api.monitor1
        .getConditionDeviceDataReal(data)
        .then(res => {
          if (res.data.code === 0) {
            this.dataList = [];
            let list = res.data.data.data_info;

            if (!this.isSearch) {
              this.initConditionData(JSON.parse(JSON.stringify(list)));
            }

            this.dataList = list;
            this.queryData.count = res.data.data.page_count;
            this.isShowRightDrawer = false;
          }
          this.loading = false;
          this.searchLoading = false;
          this.isShowRightDrawer = false;
        })
        .catch(error => {
          this.isShowRightDrawer = false;
          this.searchLoading = false;
          this.loading = false;
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    initConditionData(list) {
      this.deviceNameData = [];
      this.deviceMnData = [];

      this.deviceNameData = JSON.parse(JSON.stringify(list));
      this.deviceMnData = JSON.parse(JSON.stringify(list));

      for (let j = 0; j < this.deviceNameData.length; j++) {
        this.deviceNameData[j].label = this.deviceNameData[j].name;
        this.deviceNameData[j].value = this.deviceNameData[j].name;
      }

      for (let i = 0; i < this.deviceMnData.length; i++) {
        this.deviceMnData[i].label = this.deviceMnData[i].mn;
        this.deviceMnData[i].value = this.deviceMnData[i].mn;
      }

      this.deviceNameData.unshift({
        label: "空设备",
        value: "空设备"
      });

      this.deviceMnData.unshift({
        label: "空MN",
        value: "空MN"
      });
    },
    async getCityByArea(id) {
      let data = {
        city_id: id
      };

      await this.$api.monitor1
        .getByCityData(data)
        .then(res => {
          if (res.data.code === 0) {
            this.districtData = [];
            this.districtData = res.data.data;
            for (let i = 0; i < this.districtData.length; i++) {
              this.districtData[i].label = this.districtData[i].area_name;
              this.districtData[i].value = this.districtData[i].area_id;
            }

            for (let j = 0; j < this.districtData.length; j++) {
              if (
                this.provincealAndUrbanAreas.district ===
                this.districtData[j].area_name
              ) {
                this.addDeviceData.districtId = this.districtData[j].area_id;
                this.editData.district_id = this.districtData[j].area_id;
                break;
              }
            }
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    async getProvinceByCityData(id) {
      let data = {
        province_id: id
      };
      await this.$api.monitor1
        .getByProvinceData(data)
        .then(res => {
          if (res.data.code === 0) {
            this.cityData = [];
            this.cityData = res.data.data;

            for (let i = 0; i < this.cityData.length; i++) {
              this.cityData[i].label = this.cityData[i].area_name;
              this.cityData[i].value = this.cityData[i].area_id;
            }

            for (let j = 0; j < this.cityData.length; j++) {
              if (
                this.provincealAndUrbanAreas.city === this.cityData[j].area_name
              ) {
                this.getCityByArea(this.cityData[j].area_id);

                this.addDeviceData.cityId = this.cityData[j].area_id;
                this.editData.city_id = this.cityData[j].area_id;
                break;
              }
            }
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    getProvinceData() {
      this.$api.monitor1
        .getProvinceData()
        .then(res => {
          if (res.data.code === 0) {
            this.provinceData = [];
            this.initCascader = [];

            this.provinceData = res.data.data;
            this.initCascader = res.data.data;

            for (let i = 0; i < this.provinceData.length; i++) {
              this.provinceData[i].label = this.provinceData[i].area_name;
              this.provinceData[i].value = this.provinceData[i].area_id;

              this.initCascader[i].label = this.provinceData[i].area_name;
              this.initCascader[i].value = this.provinceData[i].area_id;
              this.initCascader[i].children = [];
              this.initCascader[i].type = "PROVINCE";
              this.initCascader[i].loading = false;
            }
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    getLocation() {
      let bmap = this.BMAP;
      let that = this;
      let geolocation = new bmap.Geolocation();
      geolocation.getCurrentPosition(
        function(r) {
          that.center = r.point;
        },
        { enableHighAccuracy: true }
      );
    },
    handler(BMap, map) {
      this.BMAP = BMap;
      this.MAP = map;
    },
    getProductData() {
      let data = {
        page_index: 1,
        page_size: 100
      };
      this.$api.monitor1
        .getProductData(data)
        .then(res => {
          if (res.data.code === 0) {
            this.productData = [];
            this.deviceProductData = [];
            this.productData = res.data.data.data_info;

            this.deviceProductData = JSON.parse(
              JSON.stringify(res.data.data.data_info)
            );

            this.productData.unshift({
              name: "空产品线",
              id: -2
            });

            for (let i = 0; i < this.deviceProductData.length; i++) {
              this.deviceProductData[i].label = this.deviceProductData[i].name;
              this.deviceProductData[i].value = this.deviceProductData[i].id;
            }

            console.log(this.deviceProductData, "<------------- 产品线");
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
    getAgreementData() {
      let data = {
        page_index: 1,
        page_size: 100
      };
      this.$api.monitor1
        .getAgreementData(data)
        .then(res => {
          if (res.data.code === 0) {
            this.deviceAgreementData = [];
            this.agreementData = [];
            this.agreementData = res.data.data.data_info;

            this.deviceAgreementData = JSON.parse(
              JSON.stringify(res.data.data.data_info)
            );

            this.deviceAgreementData.unshift({
              name: "空协议",
              id: -2
            });

            for (let i = 0; i < this.deviceAgreementData.length; i++) {
              this.deviceAgreementData[i].label = this.deviceAgreementData[
                i
              ].name;
              this.deviceAgreementData[i].value = this.deviceAgreementData[
                i
              ].id;
            }
          }
        })
        .catch(error => {
          this.$Message.error(this.$t("tip.requestError"));
        });
    },
  }
};
</script>

<style lang="less" scoped>
.siteManagement-box {
  .single-page-container;

  .siteManagement-header {
    .header;

    .header-left {
      float: left;
    }

    .header-right {
      float: right;
    }
  }

  .siteManagement-body {
    .body;
    .page {
      padding: 20px 0;
      text-align: center;
    }
  }

  .map {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    // background-color: rgba(55, 55, 55, 0.8);

    .baidu-map-box {
      z-index: 10100;
      padding: 10px;
      width: 1000px;
      height: 600px;
      background-color: white;

      .map-button {
        padding: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .baidu-map {
        width: 100%;
        height: calc(100% - 80px);
      }
    }
  }
}

.qrcode {
  display: flex;
  justify-content: center;
  align-items: center;
}

.drawer-item-btn {
  padding: 40px 0;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}

.editData-box {
  width: 100%;

  .item-box {
    padding: 5px;

    p {
      font-size: 14px;
      padding-bottom: 5px;
    }
  }

  .item-location-point {
    padding: 5px;

    .title {
      font-size: 14px;
      padding-bottom: 5px;
    }

    .loc {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .item-box-2 {
    padding: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .box-2 {
      padding: 5px;

      p {
        font-size: 14px;
        padding-bottom: 5px;
      }
    }
  }

  .item-btn {
    padding: 5px;
    text-align: right;
  }
}
</style>
