/**
 *  srs_live 模块接口列表
 */

import base from '../api/base';            // 导入接口域名列表
import instance from '../http';            // 导入 http 中创建 axios 实例

const srs_live = {
    // 添加硬盘机信息
    addDvrInof(params) {
        return instance.post(`${base.srs}/srs_live/dvr/add`, params);
    },
    // 编辑硬盘机信息
    editDvrInof(params) {
        return instance.post(`${base.srs}/srs_live/dvr/edit`, params);
    },
    // 删除硬盘机信息
    deleteDvrInof(params) {
        return instance.post(`${base.srs}/srs_live/dvr/delete`, params);
    },
    // 查询硬盘机信息
    getDvrInof(params) {
        return instance.post(`${base.srs}/srs_live/dvr/data`, params);
    },
    // 查询录制视频信息
    getVideoInfo(params) {
        return instance.post(`${base.srs}/srs_live/video/data`, params);
    },
    // 查询实时监控列表
    getLiveInfo(params) {
        return instance.post(`${base.srs}/srs_live/live/data`, params);
    },
    // 下发推流指令
    pushStream(params) {
        return instance.post(`${base.srs}/srs_live/stream/push`, params);
    },
    // 下发结束推流指令
    closeStream(params) {
        return instance.post(`${base.srs}/srs_live/stream/close`, params);
    },
    // 查询硬盘机通道开启情况
    queryChannelsData(params) {
        return instance.post(`${base.srs}/srs_live/dvr/channels/data`, params);
    },
}

export default srs_live;