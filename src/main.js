// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import fastclick from 'fastclick';
import axios from 'axios';

import './common/scss/index.css';

fastclick.attach(document.body);

Vue.config.productionTip = false;
Vue.prototype.HOST = '/api';
Vue.prototype.$http = axios;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
