import Vue from "vue";
// import "@/assets/app-base.css";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// import "@/assets/utility.css";
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
