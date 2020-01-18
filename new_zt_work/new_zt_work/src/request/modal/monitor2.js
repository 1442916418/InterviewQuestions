/**
 *  monitor2 模块接口列表
 */

import base from '../api/base';            // 导入接口域名列表
import instance from '../http';            // 导入 http 中创建 axios 实例

const monitor2 = {
    // 上传文件
    addFiles(params) {
        return instance.post(`${base.monitor}/monitor/files/upload`, params);
    },
    // 删除上传文件
    deleteFiles(params) {
        return instance.post(`${base.monitor}/monitor/files/delete`, params);
    },
    // 上传文件列表
    getFilesData(params) {
        return instance.post(`${base.monitor}/monitor/files/data`, params);
    },
    // 下发地址远程升级
    addressRemoteUpgrade(params) {
        return instance.post(`${base.monitor}/monitor/files/for/device/send`, params);
    },
    // 下发文件远程升级
    filesRemoteUpgrade(params) {
        return instance.post(`${base.monitor}/monitor/update_files/for/device/send`, params);
    },
    // 仪表校准
    instrumentCalibration(params) {
        return instance.post(`${base.monitor}/monitor/meter/correct`, params);
    },
    // 仪表核查
    instrumentVrification(params) {
        return instance.post(`${base.monitor}/monitor/meter/check`, params);
    },
    // 仪表加标回收
    instruemntRecovery(params) {
        return instance.post(`${base.monitor}/monitor/meter/recovery`, params);
    },
    // 仪表平行样测试
    instruemntParallel(params) {
        return instance.post(`${base.monitor}/monitor/meter/parallel`, params);
    },
    // 仪表核查数据列表
    getInstruemntCheckData(params) {
        return instance.post(`${base.monitor}/monitor/meter/check/data/list`, params);
    },
    // 仪表核查数据列表修改
    updateInstruemntCheckData(params) {
        return instance.post(`${base.monitor}/monitor/meter/check/data/update`, params);
    },
    // 仪表核查数据列表批量修改
    updateInstruemntCheckDatas(params) {
        return instance.post(`${base.monitor}/monitor/meter/check/datas/update`, params);
    },
    // 下位机日志列表
    getPLCLog(params) {
        return instance.post(`${base.monitor}/monitor/meter/log/list`, params);
    },
    // 下位机关键参数列表
    getKeyParameterData(params) {
        return instance.post(`${base.monitor}/monitor/meter/key_parameter/list`, params);
    },
    // 下位机关键参数最新一条
    getKeyParameterNewData(params) {
        return instance.post(`${base.monitor}/monitor/meter/key_parameter/last/one`, params);
    },
    // 下位机运行状态列表
    getPLCStatusData(params) {
        return instance.post(`${base.monitor}/monitor/meter/status/list`, params);
    },
    // 下位机运行状态最新一条
    getNewPLCStatuData(params) {
        return instance.post(`${base.monitor}/monitor/meter/status/last/one`, params);
    },
    // 下位机切换模式
    changePLCMode(params) {
        return instance.post(`${base.monitor}/monitor/meter/mode/change`, params);
    },
    // 下位机模式信息最新一条
    getNewModePLCData(params) {
        return instance.post(`${base.monitor}/monitor/meter/mode/last/one`, params);
    },
    // 获取下位机现场信息
    getPLCInfo(params) {
        return instance.post(`${base.monitor}/monitor/meter/info/get`, params);
    },
    // 下位机现场信息最新一条
    getNewPLCInfo(params) {
        return instance.post(`${base.monitor}/monitor/meter/info/last/one`, params);
    },
    // 下位机环境参数列表
    getPLCContextData(params) {
        return instance.post(`${base.monitor}/monitor/meter/context/list`, params);
    },
    // 下位机定点核查设置
    setPLCFixedPointVerification(params) {
        return instance.post(`${base.monitor}/monitor/meter/check/time/set`, params);
    },
    // 下位机定点核查设置信息最新一条
    getNewPLCFixedPointVerification(params) {
        return instance.post(`${base.monitor}/monitor/meter/check/time/last/one`, params);
    },
    // 发送查询下位机数据指令（超管权限）
    getPLCData(params) {
        return instance.post(`${base.monitor}/monitor/real_meter/data/select/send`, params);
    },
    // 查询下位机数据（超管权限）
    getPLCData2(params) {
        return instance.post(`${base.monitor}/monitor/real_meter/data/select`, params);
    },
    // 发送删除下位机数据指令（超管权限）
    deletePLC(params) {
        return instance.post(`${base.monitor}/monitor/real_meter/data/delete/send`, params);
    },
    // 发送添加下位机数据指令（超管权限）
    addPLC(params) {
        return instance.post(`${base.monitor}/monitor/real_meter/data/add/send`, params);
    },
    // 发送修改下位机数据指令（超管权限）
    editPLC(params) {
        return instance.post(`${base.monitor}/monitor/real_meter/data/update/send`, params);
    },
    // 设置现场机时间
    setSystemTime(params) {
        return instance.post(`${base.monitor}/monitor/meter/systemtime/set`, params);
    },
    // 添加运维审核员
    addOperationCheck(params) {
        return instance.post(`${base.monitor}/monitor/operation_check/add`, params);
    },
    // 删除运维审核员
    deleteOperationCheck(params) {
        return instance.post(`${base.monitor}/monitor/operation_check/delete`, params);
    },
    // 运维审核员列表
    getOperationCheckData(params) {
        return instance.post(`${base.monitor}/monitor/operation_check/data`, params);
    },
    // 获取上传文件最新一条
    getFileOne(params) {
        return instance.post(`${base.monitor}/monitor/files/data/last/one`, params);
    },
    // 获取延保解密秘钥
    getSecretKey(params) {
        return instance.post(`${base.monitor}/monitor/software/secret_key/get`, params);
    },
}

export default monitor2;