import SelectUser from '../commonComponents/selectUser'

const User = {
    install: function (Vue) {
        Vue.component('SelectUser', SelectUser);
    }
}

export default User;