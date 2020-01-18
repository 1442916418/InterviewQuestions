/**
 *  折线图模块
 */

// 引入 ECharts 主模块
const echarts = require("echarts/lib/echarts");

// 引入折线图...
require('echarts/lib/chart/bar');
require("echarts/lib/chart/line");
require("echarts/lib/chart/pie");

require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/grid");
require("echarts/lib/component/dataZoom");
require("echarts/lib/component/legend");
require("echarts/lib/component/toolbox");

export default echarts;