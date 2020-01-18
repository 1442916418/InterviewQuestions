/**
 *  api 接口的统一出口
 */

// auth_login 接口模块
import auth_login from '../modal/auth_login';

// monitor1 接口模块
import monitor1 from '../modal/monitor1';

// monitor2 接口模块
import monitor2 from '../modal/monitor2';

// srs_live 接口模块
import srs_live from '../modal/srs_live';

// files_base 接口模块
import files_base from '../modal/files_base';

// virtual_data 接口模块
import virtual_data from '../modal/virtual_data';

// learning 接口模块
import learning from '../modal/learning';


// 导出接口
export default {
    auth_login,
    monitor1,
    monitor2,
    srs_live,
    files_base,
    virtual_data,
    learning
}