/**
 *  files_base 模块接口列表
 */

import base from '../api/base';            // 导入接口域名列表
import instance from '../http';            // 导入 http 中创建 axios 实例

const files_base = {
    // 上传单个文件到对象存储服务器
    uploadFile(params) {
        return instance.post(`${base.file}/files_base/file/upload`, params);
    },
    // 删除单个文件
    deleteFile(params) {
        return instance.post(`${base.file}/files_base/file/delete`, params);
    },
    // 文件列表
    getFiles(params) {
        return instance.post(`${base.file}/files_base/files/data`, params);
    },
    // 获取上传文件最新一条
    getOneFile(params) {
        return instance.post(`${base.file}/files_base/server/files/data/last/one`, params);
    },
    // 新增bug日志
    addBugLog(params) {
        return instance.post(`${base.file}/files_base/bugs/add`, params);
    },
    // 编辑bug日志 
    editBugLog(params) {
        return instance.post(`${base.file}/files_base/bugs/edit`, params);
    },
    // 修复bug
    repairBug(params) {
        return instance.post(`${base.file}/files_base/bugs/repair`, params);
    },
    // 删除bug日志
    deleteBugLog(params) {
        return instance.post(`${base.file}/files_base/bugs/delete`, params);
    },
    // bug日志列表
    getBugLogData(params) {
        return instance.post(`${base.file}/files_base/bugs/data`, params);
    },
    // 未修复bug
    noRepairBug(params) {
        return instance.post(`${base.file}/files_base/bugs/no_repair`, params);
    },
}


export default files_base;