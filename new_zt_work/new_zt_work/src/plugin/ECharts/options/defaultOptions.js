// import echarts from 'echarts'

let defaultOptions = {
    toolbox: {
        feature: {
            dataZoom: {
                yAxisIndex: "none"
            },
            restore: {},
            saveAsImage: {},
            magicType: {
                type: ['line', 'bar']
            }
        }
    },
    tooltip: {
        trigger: "axis"
    },
    grid: {
        left: "5%",
        right: "5%",
        bottom: "10%",
        containLabel: true
    },
    yAxis: {
        type: "value"
    },
    dataZoom: [
        {
            type: "inside",
            start: 0,
            end: 10
        },
        {
            start: 0,
            end: 10,
            handleIcon:
                "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
            handleSize: "80%",
            handleStyle: {
                color: "#fff",
                shadowBlur: 3,
                shadowColor: "rgba(0, 0, 0, 0.6)",
                shadowOffsetX: 2,
                shadowOffsetY: 2
            }
        }
    ],
    legend: {
        data: [],
        orient: "horizontal",
        x: "center",
        icon: "circle",
        textStyle: {
            rich: {
                a: {
                    fontSize: 16,
                    color: "#EA5504",
                    padding: 10
                },
                b: {
                    fontSize: 14,
                    color: "#333"
                }
            }
        }
    },
    xAxis: {
        type: "category",
        boundaryGap: false,
        data: []
    },
}

export default defaultOptions;

//折线图
// title: {
//     text: ""
// },
// legend: {
//     data: []
// }
// xAxis: {
//     data: []
// }
// series: {}