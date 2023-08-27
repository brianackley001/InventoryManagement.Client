import Vue from "vue";
import Vuex from "vuex";
import modules from "./modules";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules,
  // plugins: [
  //   process.env.NODE_ENV !== 'production' ? VuePursue : () => {}
  // ],
  strict: process.env.NODE_ENV !== "production",
});

// Automatically run the `init` action for every module, if one exists.
for (const moduleName of Object.keys(modules)) {
  if (modules[moduleName].actions.init) {
    store.dispatch(`${moduleName}/init`);
  }
}

export default store;
