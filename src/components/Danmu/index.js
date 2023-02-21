import danmu from './index.vue'
danmu.install = Vue => Vue.component(danmu.name, danmu);//注册组件
export default danmu;
