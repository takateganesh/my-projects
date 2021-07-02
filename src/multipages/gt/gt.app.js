// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueCookies from 'vue-cookies';

import App from './oak.app.vue';
import vuetify from '../../plugins/vuetify';
import "vuetify/dist/vuetify.min.css";
import {router} from './oak.routes';
import store from '@/stores/oak';
import Clipboard from 'v-clipboard'
import DatetimePicker from 'vuetify-datetime-picker';
import Snotify from 'vue-snotify';
import lodash from 'lodash'
import VueLodash from 'vue-lodash'

Vue.use(Clipboard);
Vue.use(VueLodash, lodash);
Vue.use(DatetimePicker);

Vue.config.productionTip = false
Vue.use(VueCookies);

Vue.use(Snotify, {
  toast: {
    position: "rightTop",
    showProgressBar:false
  }
});

new Vue({
  vuetify,
  store,
  router,
  beforeCreate() {
      Vue.$snotify = this.$snotify;
  },
  render: h => h(App)
}).$mount('#app')
