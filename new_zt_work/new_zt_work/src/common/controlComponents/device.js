import SelectDevice from '../commonComponents/selectDevice'

const Device = {
    install: function (Vue) {
        Vue.component('SelectDevice', SelectDevice);
    }
}

export default Device;