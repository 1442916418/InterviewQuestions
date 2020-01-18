/**
 *  全局变量
 */

const tableDefaultHeight = 170;
const tableDefaultPageSizes = [10, 50, 100, 500, 1000];
const elementSelectDefaultPageSizes = [
    {
        value: 10,
        label: 10
    },
    {
        value: 50,
        label: 50
    },
    {
        value: 100,
        label: 100
    }
]; 
const dev = 'http://192.168.199.104/appDownloadPage';
const pro = "https://www.waterqm.com/appDownloadPage";
const appUri = config.dev === 'TEST' ? dev : pro;

export default {
    tableDefaultHeight, tableDefaultPageSizes, elementSelectDefaultPageSizes, appUri
}