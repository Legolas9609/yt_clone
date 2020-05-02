import Vue from 'vue'
import VueRouter from 'vue-router'
import VeeValidate from 'vee-validate'
import lineClamp from 'vue-line-clamp'
import ReadMore from 'vue-read-more';

import { MdRipple, MdAvatar, MdButton, MdMenu, MdList } from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'
import './md_default.css'

import { BCol, BRow, BContainer, BModal, BButton, BFormGroup, BForm, BFormInput, BFormTextarea,
BCollapse, BDropdown, BAlert, BSpinner, BFormInvalidFeedback, BDropdownItem} from 'bootstrap-vue'

Vue.use(BCol)
Vue.use(BRow)
Vue.use(BContainer)
Vue.use(BModal)
Vue.use(BButton)
Vue.use(BFormGroup)
Vue.use(BForm)
Vue.use(BFormInput)
Vue.use(BFormTextarea)
Vue.use(BCollapse)
Vue.use(BDropdown)
Vue.use(BAlert)
Vue.use(BSpinner)
Vue.use(BFormInvalidFeedback)
Vue.use(BDropdownItem)

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

