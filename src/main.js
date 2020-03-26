import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "element-ui/lib/theme-chalk/index.css";
import "./plugins/element";
Vue.config.productionTip = false;
import axios from "axios";
import iView from "iview"; // 导入组件库
import "iview/dist/styles/iview.css"; // 导入样式
Vue.prototype.$http = axios;
// 配置请求额根路径
axios.defaults.baseURL = "http://tagapi.whip1ash.cn/";
Vue.use(iView);
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");