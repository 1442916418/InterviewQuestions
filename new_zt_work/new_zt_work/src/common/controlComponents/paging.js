import paging from '../commonComponents/paging'

const Paging = {
    install: function (Vue) {
        Vue.component('Paging', paging);
    }
}

export default Paging;