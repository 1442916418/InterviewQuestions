/**
 *  virtual_data 虚拟数据接口列表
 */

import base from '../api/base';            // 导入接口域名列表
import instance from '../http';            // 导入 http 中创建 axios 实例

const virtual_data = {
    // 打开虚拟数据上传
    openVirtualData(params) {
        return instance.post(`${base.virtual}/data_upload/server/virtual_data/on`, params);
    },
    // 关闭上传虚拟数据
    closeVirtualData(params) {
        return instance.post(`${base.virtual}/data_upload/server/virtual_data/off`, params);
    },
}

export default virtual_data;