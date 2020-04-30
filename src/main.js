import Vue from 'vue'
import VueYoutube from 'vue-youtube'
import VueRouter from 'vue-router'
import VeeValidate from 'vee-validate'
import lineClamp from 'vue-line-clamp'
import ReadMore from 'vue-read-more';

import { MdRipple, MdAvatar, MdButton, MdMenu, MdList } from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'
import './md_default.css'

import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'
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
import Autocomplete from 'v-autocomplete'
// You need a specific loader for CSS files like https://github.com/webpack/css-loader
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

Vue.use(Autocomplete);
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

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueRouter);
Vue.use(ReadMore);

Vue.use(VueYoutube);
Vue.use(MdRipple);
Vue.use(MdAvatar);
Vue.use(MdButton);
Vue.use(MdMenu);
Vue.use(MdList);

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

