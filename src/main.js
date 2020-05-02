import Vue from 'vue'
import App from "./App";
import {router} from './routes';
new Vue({
    router,
    linkActiveClass: 'is-showAddPlaylist',
    preserveWhitespace: true,
    render: h => h(App),
}).$mount('#app');

