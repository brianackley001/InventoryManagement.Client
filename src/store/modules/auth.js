//import _ from "@/utils/store-helpers";
import Vue from "vue";

export const state = {
  auth: JSON.parse(window.localStorage.getItem("auth")) || null,
};

export const getters = {
  session: (state) => {
    return state.auth;
  },
};

export const actions = {
  logOut({ commit }) {
    commit("SESSION_LOG_OUT");
  },
};

export const mutations = {
  SESSION_LOG_OUT(state) {
    state.authSession = null;
    window.localStorage.removeItem("auth");
    Vue.prototype.$auth.logout({
      returnTo: window.location.origin + "/logout",
    });
  },
};
