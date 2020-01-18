/**
 *  接口域名管理
 */

let dev = config.dev, inside = config.inside;
let base = {
    login: "https://www.waterqm.com/ng_auth_login",
    verify: "https://www.waterqm.com/ng_auth_verify",
    monitor: "https://www.waterqm.com/ng_monitor",
    srs: "https://www.waterqm.com/ng_srs_live",
    file: "https://www.waterqm.com/ng_files_base",
    virtual: "https://www.waterqm.com/ng_upload_virtual_data",
    learning: "https://www.waterqm.com/learning_center"
}

if (dev === "TEST") {
    base = {
        verify: "http://192.168.199.104:2206",
        login: "http://192.168.199.104:2205",
        monitor: "http://192.168.199.104:2207",
        srs: "http://192.168.199.104:2210",
        file: "http://192.168.199.104:2212",
        virtual: "http://192.168.199.104:2211",
        learning: "http://192.168.199.104:2213"
    }
} else if (dev === "FORMAL") {
    base = {
        login: "https://www.waterqm.com/ng_auth_login",
        verify: "https://www.waterqm.com/ng_auth_verify",
        monitor: "https://www.waterqm.com/ng_monitor",
        srs: "https://www.waterqm.com/ng_srs_live",
        file: "https://www.waterqm.com/ng_files_base",
        virtual: "https://waterqm.com/ng_upload_virtual_data",
        learning: "https://www.waterqm.com/learning_center"
    }
} else if (dev === "FORMAL" && inside === "INSIDE") {
    base = {
        login: "http://192.168.1.202:9999/ng_auth_login",
        verify: "http://192.168.1.202:9999/ng_auth_verify",
        monitor: "http://192.168.1.202:9999/ng_monitor",
        srs: "http://192.168.1.202:9999/ng_srs_live",
        file: "http://192.168.1.202:9999/ng_files_base",
        virtual: "http://192.168.1.202:9999/ng_upload_virtual_data",
        learning: "http://192.168.1.202:9999/learning_center"
    }
}

export default base;