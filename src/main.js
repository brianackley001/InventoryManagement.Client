import Vue from "vue";
import VueApp from "./VueApp.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueAppInsights from "./plugins/app-insights";
// import SyncHub from "./plugins/sync-hub";
//import EventHub from "./plugins/event-hub";

// App Insights

Vue.use(VueAppInsights, {
  id: "",
  router,
  baseName: "InventoryManager",
});

// Import the Auth0 configuration
import { domain, clientId, audience } from "../auth_config.json";
import { Auth0Plugin } from "./auth";
import "./registerServiceWorker";

// Install the authentication plugin
Vue.use(Auth0Plugin, {
  domain,
  clientId,
  audience,
  onRedirectCallback: (appState) => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
  },
});
// SignalR Hub
// Vue.use(SyncHub);
//  Global Event Bus
Vue.prototype.$eventHub = new Vue();

Vue.config.productionTip = false;

Vue.config.errorHandler = (err, vm, info) => {
  console.error(err, vm, info);
  if (Vue.appInsights) {
    try {
      Vue.appInsights.trackException({
        exception: new Error(err),
        options: {
          info: info,
        },
      });
    } catch (err) {
      console.error(err);
    }
  }
};

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(VueApp),
}).$mount("#app");
