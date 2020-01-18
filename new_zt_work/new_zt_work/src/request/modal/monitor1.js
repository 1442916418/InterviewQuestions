/**
 *  monitor1 模块接口列表
 */

import base from '../api/base';            // 导入接口域名列表
import instance from '../http';            // 导入 http 中创建 axios 实例

const monitor1 = {
    // 获取设备列表
    getAllDevicesList(params) {
        return instance.post(`${base.monitor}/monitor/point/device/data`, params);
    },
    // 开启上传虚拟数据
    onFakedata(params) {
        return instance.post(`${base.monitor}/monitor/fakedata/on`, params);
    },
    // 关闭上传虚拟数据
    offFakedata(params) {
        return instance.post(`${base.monitor}/monitor/fakedata/off`, params);
    },
    // 获取日报
    getDayFormsData(params) {
        return instance.post(`${base.monitor}/monitor/point/forms/data/get`, params);
    },
    // 获取周报月报
    getWeeklyAndMonthFormsData(params) {
        return instance.post(`${base.monitor}/monitor/point/forms/data/other/get`, params);
    },
    // 生成设备二维码
    getDevicesCode(params) {
        return instance.post(`${base.monitor}/monitor/mobile/device/code/add`, params);
    },
    // 添加手机用户可查看设备(扫码功能)
    addDevicesCode(params) {
        return instance.post(`${base.monitor}/monitor/mobile/device/add`, params);
    },
    // 获取设备历史元数据
    getHistoryData(params) {
        return instance.post(`${base.monitor}/monitor/point/data/get`, params);
    },
    // 获取最新一条的实时数据
    getNewOneRealTimeData(params) {
        return instance.post(`${base.monitor}/monitor/point/realtime/last/data/get`, params);
    },
    // 获取最新的实时数据
    getNewRealTimeDatas(params) {
        return instance.post(`${base.monitor}/monitor/point/realtime/data/get`, params);
    },
    // 获取设备省份信息
    getDevicesProvinceData() {
        return instance.post(`${base.monitor}/monitor/point/province/get`);
    },
    // 获取设备城市信息
    getDevicesCityData(params) {
        return instance.post(`${base.monitor}/monitor/point/city/only/get`, params);
    },
    // 根据省份获取设备城市信息
    getCityData(params) {
        return instance.post(`${base.monitor}/monitor/point/city/get`, params);
    },
    // 获取行政省份信息
    getProvinceData() {
        return instance.post(`${base.monitor}/monitor/point/normal/province/get`);
    },
    // 根据省份获取行政城市信息
    getByProvinceData(params) {
        return instance.post(`${base.monitor}/monitor/point/normal/city/by/province/get`, params);
    },
    // 根据城市获取行政区信息
    getByCityData(params) {
        return instance.post(`${base.monitor}/monitor/point/normal/block/by/city/get`, params);
    },
    // 根据id获取行政地区信息
    getByIdData(params) {
        return instance.post(`${base.monitor}/monitor/point/area/by/id/get`, params);
    },
    // 根据名称获取行政地区信息
    getByName(params) {
        return instance.post(`${base.monitor}/monitor/point/area/by/name/get`, params);
    },
    // 添加设备组
    addDevicesGroup(params) {
        return instance.post(`${base.monitor}/monitor/point/add`, params);
    },
    // 编辑设备组
    editDevicesGroup(params) {
        return instance.post(`${base.monitor}/monitor/point/edit`, params);
    },
    // 删除设备组
    deleteDevicesGroup(params) {
        return instance.post(`${base.monitor}/monitor/point/delete`, params);
    },
    // 获取所有设备组信息
    getAllDevicesGroupData(params) {
        return instance.post(`${base.monitor}/monitor/point/data/all`, params);
    },
    // 添加设备组设备组分关系
    addDevicesGroupCompoent(params) {
        return instance.post(`${base.monitor}/monitor/point/ml/device/components/add`, params);
    },
    // 删除设备组设备组分关系
    deleteDevicesGroupCompoent(params) {
        return instance.post(`${base.monitor}/monitor/point/ml/device/delete`, params);
    },
    // 根据设备组id获取设备信息
    getByIdDevicesData(params) {
        return instance.post(`${base.monitor}/monitor/point/device/by/ml/get`, params);
    },
    // 获取设备组设备组分关系列表
    getDevicesGroupComponentData(params) {
        return instance.post(`${base.monitor}/monitor/point/ml/device/component/data`, params);
    },
    // 添加设备
    addDevice(params) {
        return instance.post(`${base.monitor}/monitor/point/device/add`, params);
    },
    // 编辑设备
    editDevice(params) {
        return instance.post(`${base.monitor}/monitor/point/device/edit`, params);
    },
    // 删除设备
    deleteDevice(params) {
        return instance.post(`${base.monitor}/monitor/point/device/delete`, params);
    },
    // 获取设备列表
    getDeviceData(params) {
        return instance.post(`${base.monitor}/monitor/point/device/data`, params);
    },
    // 获取设备状态
    getDeviceStatus(params) {
        return instance.post(`${base.monitor}/monitor/point/devices/status`, params);
    },
    // 根据产品线id获取设备列表
    getByIdDeviceData(params) {
        return instance.post(`${base.monitor}/monitor/point/device/data/by/product`, params);
    },
    // 添加组分
    addComponent(params) {
        return instance.post(`${base.monitor}/monitor/point/component/add`, params);
    },
    // 编辑组分
    editComponent(params) {
        return instance.post(`${base.monitor}/monitor/point/component/edit`, params);
    },
    // 删除组分
    deleteComponent(params) {
        return instance.post(`${base.monitor}/monitor/point/component/delete`, params);
    },
    // 获取组分列表
    getComponentData(params) {
        return instance.post(`${base.monitor}/monitor/point/component/data`, params);
    },
    // 批量重置维护周期
    updateDeviceComponentTime(params) {
        return instance.post(`${base.monitor}/monitor/point/device/component/time/update`, params);
    },
    // 修改预设标样浓度和预设量程
    updateDeviceComponentValue(params) {
        return instance.post(`${base.monitor}/monitor/point/device/component/value/update`, params);
    },
    // 批量添加设备组分关系
    addDeviceComponents(params) {
        return instance.post(`${base.monitor}/monitor/point/device/component/add`, params);
    },
    // 添加设备组分关系
    addDeviceComponent(params) {
        return instance.post(`${base.monitor}/monitor/point/device/component/single/add`, params);
    },
    // 删除设备组分关系
    deleteDeviceComponent(params) {
        return instance.post(`${base.monitor}/monitor/point/device/component/delete`, params);
    },
    // 批量删除设备组分关系
    deleteDeviceComponents(params) {
        return instance.post(`${base.monitor}/monitor/point/device/component/deletes`, params);
    },
    // 获取设备组分关系列表
    getDeviceComponentData(params) {
        return instance.post(`${base.monitor}/monitor/point/device/component/data`, params);
    },
    // 添加产品线
    addProduct(params) {
        return instance.post(`${base.monitor}/monitor/point/product/add`, params);
    },
    // 编辑产品线
    editProduct(params) {
        return instance.post(`${base.monitor}/monitor/point/product/edit`, params);
    },
    // 删除产品线
    deleteProduct(params) {
        return instance.post(`${base.monitor}/monitor/point/product/delete`, params);
    },
    // 获取产品线列表
    getProductData(params) {
        return instance.post(`${base.monitor}/monitor/point/product/data`, params);
    },
    // 添加协议
    addAgreement(params) {
        return instance.post(`${base.monitor}/monitor/point/agreement/add`, params);
    },
    // 编辑协议
    editAgreement(params) {
        return instance.post(`${base.monitor}/monitor/point/agreement/edit`, params);
    },
    // 删除协议
    deleteAgreement(params) {
        return instance.post(`${base.monitor}/monitor/point/agreement/delete`, params);
    },
    // 获取协议列表
    getAgreementData(params) {
        return instance.post(`${base.monitor}/monitor/point/agreement/data`, params);
    },
    // 获取报警日志统计列表
    getWarningLogDatas(params) {
        return instance.post(`${base.monitor}/monitor/warning/count`, params);
    },
    // 获取报警日志列表
    getWarningLogData(params) {
        return instance.post(`${base.monitor}/monitor/warning/data`, params);
    },
    // 批量处理报警日志
    doWarningLogData(params) {
        return instance.post(`${base.monitor}/monitor/warning/do`, params);
    },
    // 添加版本
    addVersion(params) {
        return instance.post(`${base.monitor}/monitor/version/add`, params);
    },
    // 编辑版本
    editVersion(params) {
        return instance.post(`${base.monitor}/monitor/version/edit`, params);
    },
    // 删除版本
    deleteVersion(params) {
        return instance.post(`${base.monitor}/monitor/version/delete`, params);
    },
    // 获取版本列表
    getVersionData(params) {
        return instance.post(`${base.monitor}/monitor/version/data`, params);
    },
    // 获取最新版本内容
    getNewVersionData(params) {
        return instance.post(`${base.monitor}/monitor/version/data/first`, params);
    },
    // 根据条件筛选设备列表
    getConditionDevice(params) {
        return instance.post(`${base.monitor}/monitor/point/device/data/other`, params);
    },
    // 获取用户设备列表
    getUserDevice(params) {
        return instance.post(`${base.monitor}/monitor/user/devices/data`, params);
    },
    // 添加用户设备
    addUserDevice(params) {
        return instance.post(`${base.monitor}/monitor/user/devices/add`, params);
    },
    // 批量删除设备
    delDevices(params) {
        return instance.post(`${base.monitor}/monitor/point/devices/delete`, params);
    },
    // 根据类型获取产品线和数据类型关系列表
    getDataType(params) {
        return instance.post(`${base.monitor}/monitor/point/product/data_type/data/by/type`, params);
    },
    // 获取产品线和数据类型关系列表
    getProductAndDataType(params) {
        return instance.post(`${base.monitor}/monitor/point/product/data_type/data`, params);
    },
    // 添加产品线和数据类型关系
    addProductAndDataType(params) {
        return instance.post(`${base.monitor}/monitor/point/product/data_type/add`, params);
    },
    // 获取数据类型列表
    getDataTypeList(params) {
        return instance.post(`${base.monitor}/monitor/point/data_type/data`, params);
    },
    // 删除数据类型
    deleteDataTypeList(params) {
        return instance.post(`${base.monitor}/monitor/point/data_type/delete`, params);
    },
    // 编辑数据类型
    editDataTypeList(params) {
        return instance.post(`${base.monitor}/monitor/point/data_type/edit`, params);
    },
    // 添加数据类型
    addDataTypeList(params) {
        return instance.post(`${base.monitor}/monitor/point/data_type/add`, params);
    },
    // 获取真实设备列表(不设限制)
    getDeviceDataReal(params) {
        return instance.post(`${base.monitor}/monitor/point/device/data/real`, params);
    },
    // 根据条件筛选真实设备列表（不设限制）
    getConditionDeviceDataReal(params) {
        return instance.post(`${base.monitor}/monitor/point/device/data/other/real`, params);
    },
    // 根据条件筛选运维记录列表
    getdevOpsList(params) {
        return instance.post(`${base.monitor}/monitor/operation/data`, params);
    },
    // 批量审核运维记录
    batchAuditRecrd(params) {
        return instance.post(`${base.monitor}/monitor/operation/check_status/change`, params);
    },
    // 运维审核员列表
    getOperationCheckUserData(params) {
        return instance.post(`${base.monitor}/monitor/operation_check/data`, params);
    }
}

export default monitor1;

