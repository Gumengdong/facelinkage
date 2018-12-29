// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

import App from './App'
import router from './router'
import globalVariable from '@/api/global_variable.js'
import echarts from 'echarts'
 
Vue.use(VueAxios, axios)

Vue.config.productionTip = false
Vue.prototype.GLOBAL = globalVariable
Vue.prototype.$echarts = echarts 

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
