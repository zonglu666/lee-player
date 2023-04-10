import player from './index.vue';
player.install = (Vue) => Vue.component(player.name, player); //注册组件
export default player;
