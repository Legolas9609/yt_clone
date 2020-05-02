import Vue from 'vue'
import VueRouter from 'vue-router'
import VeeValidate from 'vee-validate'
import lineClamp from 'vue-line-clamp'
import ReadMore from 'vue-read-more';


import App from "./App";
import {router} from './routes';
import 'v-autocomplete/dist/v-autocomplete.css'

Vue.config.productionTip = false;


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

