/**
 * 历史数据页引导详情
 */

const steps = [
    {
        element: ".logo-text",
        popover: {
            title: "<b style='color:#41b883'>提示<b>",
            description: "点击【水质在线监测系统平台】导航到首页",
            position: "bottom"
        }
    },
    {
        element: ".logo-img",
        popover: {
            title: "<b style='color:#41b883'>提示<b>",
            description:
                "鼠标移入【二维码】放大图片，使用手机浏览器扫一扫，跳转到下载页，点击【二维码】，则跳转到下载页。",
            position: "bottom"
        }
    },
    {
        element: ".search-box",
        popover: {
            title: "<b style='color:#41b883'>提示<b>",
            description:
                "点击输入框，可以模糊搜索菜单名称，鼠标、键盘上下键选择菜单，回车或点击跳转页面。",
            position: "bottom"
        }
    },
    {
        element: ".ios-navigate-outline",
        popover: {
            title: "<b style='color:#41b883'>提示<b>",
            description: "点击【图标】开启引导页",
            position: "left",
        }
    },
    {
        element: ".expandIcon",
        popover: {
            title: "<b style='color:#41b883'>提示<b>",
            description: "点击【图标】开启全屏",
            position: "left"
        }
    },
    {
        element: ".zhAndEn",
        popover: {
            title: "<b style='color:#41b883'>提示<b>",
            description: "点击【图标】切换语言",
            position: "left"
        }
    },
    {
        element: ".meetingRoomAppointment",
        popover: {
            title: "<b style='color:#41b883'>提示<b>",
            description: "点击【图标】进入会议室预约页面",
            position: "left"
        }
    },
    {
        element: ".real-name-avatar",
        popover: {
            title: "<b style='color:#41b883'>提示<b>",
            description: "点击【头像】显示个人信息，可以修改用户密码和退出登录",
            position: "left"
        }
    },
    {
        element: ".other-left-sider",
        popover: {
            title: "<b style='color:#41b883'>提示<b>",
            description: "点击【图标】展开并选择菜单或鼠标移入显示子菜单，移除消失",
            position: "right",
            offset: 200
        }
    },
    {
        element: ".menu-left-btn",
        popover: {
            title: "<b style='color:#41b883'>提示<b>",
            description: "点击【图标】伸缩或展开左侧侧边栏",
            position: "top",
            offset: 10
        }
    },
    {
        element: ".right-content-tag",
        popover: {
            title: "<b style='color:#41b883'>提示<b>",
            description: "此处显示当前操作历史记录，当前页面显示【绿色】小圆圈，否则显示【灰色】",
            position: "bottom",
            offset: 90
        }
    },
    {
        element: `.historcalDataQuery-header`,
        popover: {
            title: "<b style='color:#41b883'>提示<b>",
            description: "此处可以筛选查询和切换图表",
            position: "bottom",
        }
    },
    {
        element: `.header-left`,
        popover: {
            title: "<b style='color:#41b883'>提示<b>",
            description: "此处可以筛选站点、数据类型和时间等操作",
            position: "bottom",
        }
    },
    {
        element: `.header-right`,
        popover: {
            title: "<b style='color:#41b883'>提示<b>",
            description: "此处可以查询和导出等操作",
            position: "left",
        }
    },
    {
        element: `.change-echart`,
        popover: {
            title: "<b style='color:#41b883'>提示<b>",
            description: "此处可以切换折线图和柱状图或表格",
            position: "left",
        }
    },
    {
        element: `.historcalDataQuery-body`,
        popover: {
            title: "<b style='color:#41b883'>提示<b>",
            description: "此处显示表格数据，提供升序、降序和分页功能",
            position: "top",
        }
    },
]

export default steps;