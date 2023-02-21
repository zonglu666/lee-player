import Vue from 'vue'
import App from './App.vue'

import Sortt from './components/index'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Sortt)
Vue.use(Element)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
