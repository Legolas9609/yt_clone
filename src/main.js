import Vue from 'vue'
import VueRouter from 'vue-router'
import VeeValidate from 'vee-validate'
import lineClamp from 'vue-line-clamp'
import ReadMore from 'vue-read-more';

import {MdAvatar, MdButton, MdList, MdMenu, MdRipple} from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'
import './md_default.css'

import {
    BAlert,
    BButton,
    BCol,
    BCollapse,
    BDropdown,
    BDropdownItem,
    BForm,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BFormTextarea,
    BModal,
    BNav,
    BNavbar,
    BNavbarBrand,
    BNavbarToggle,
    BNavItem,
    BRow,
    BSpinner,
    BFormCheckbox,
    BFormSelect,
    VBToggle
} from 'bootstrap-vue'
import {library} from '@fortawesome/fontawesome-svg-core'
import {
    faEllipsisV,
    faEye,
    faFilter,
    faGlobe,
    faLock,
    faLockOpen,
    faPlay,
    faSearch,
    faSortDown,
    faSortUp,
    faThumbsDown,
    faThumbsUp,
    faTimes,
    faTrashAlt,
    faWindowClose
} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

import App from "./App";
import {router} from './routes';
import 'v-autocomplete/dist/v-autocomplete.css'
Vue.directive('b-toggle', VBToggle)
Vue.component('b-nav', BNav);
Vue.component('b-nav-item', BNavItem);
Vue.component('b-navbar', BNavbar);
Vue.component('b-navbar-toggle', BNavbarToggle);
Vue.component('b-navbar-brand', BNavbarBrand);
Vue.component('b-modal', BModal);
Vue.component('b-col', BCol);
Vue.component('b-row', BRow);
Vue.component('b-button', BButton);
Vue.component('b-form-group', BFormGroup);
Vue.component('b-form', BForm);
Vue.component('b-form-input', BFormInput);
Vue.component('b-form-textarea', BFormTextarea);
Vue.component('b-collapse', BCollapse);
Vue.component('b-dropdown', BDropdown);
Vue.component('b-alert', BAlert);
Vue.component('b-spinner', BSpinner);
Vue.component('b-form-invalid-feedback', BFormInvalidFeedback);
Vue.component('b-dropdown-item', BDropdownItem);
Vue.component('b-form-select', BFormSelect);
Vue.component('b-form-checkbox', BFormCheckbox);

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

