import player from './Player'
import danmu from './Danmu'

const components = [player, danmu];

const install = function (Vue) {
  if (install.installed) return;
  components.forEach(component => {
    Vue.component(component.name, component)
  });
};
// 判断是否是直接引入文件
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}
export default {
  install,
  player,
  danmu
};
