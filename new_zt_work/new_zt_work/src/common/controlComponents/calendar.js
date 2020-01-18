import datePicker from '../commonComponents/calendar/module/date-picker'

const calendar = {
    install: function (Vue) {
        Vue.component('Calendar', datePicker);
    }
}

export default calendar;