import Vue from 'vue'
import VueRouter from 'vue-router'
import VeeValidate from 'vee-validate'
import lineClamp from 'vue-line-clamp'
import ReadMore from 'vue-read-more';


import {library} from '@fortawesome/fontawesome-svg-core'
import {
    faEllipsisV,
    faEye,
    faFilter,
    faPlay,
    faSearch,
    faSortDown,
    faSortUp,
    faThumbsDown,
    faThumbsUp,
    faTimes,
    faLock,
    faLockOpen,
    faGlobe,
    faTrashAlt,
    faWindowClose
} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

import App from "./App";
import {router} from './routes';
import 'v-autocomplete/dist/v-autocomplete.css'

library.add(faTimes);
library.add(faPlay);
library.add(faSearch);
library.add(faThumbsUp);
library.add(faThumbsDown);
library.add(faEye);
library.add(faSortUp);
library.add(faSortDown);
library.add(faFilter);
library.add(faEllipsisV);
library.add(faLock);
library.add(faLockOpen);
library.add(faGlobe);
library.add(faTrashAlt);
library.add(faWindowClose);

Vue.config.productionTip = false;

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(VeeValidate, {
    // This is the default
    inject: true,
    // Important to name this something other than 'fields'
    fieldsBagName: 'veeFields',
    // This is not required but avoids possible naming conflicts
    errorBagName: 'veeErrors'
});

Vue.use(VueRouter);
Vue.use(ReadMore);


Vue.use(lineClamp, {
    // plugin options
});


Vue.filter('addSpace', function (value) {
    return " " + value
});

new Vue({
    router,
    linkActiveClass: 'is-showAddPlaylist',
    preserveWhitespace: true,
    render: h => h(App),
}).$mount('#app');

