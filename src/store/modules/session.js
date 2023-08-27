/* eslint-disable no-unused-vars */
import axiosInstance from "@/plugins/axiosInstance";
import { appInsights } from "@/plugins/app-insights";
import { hubConnection } from "@/plugins/ws-message-hub.js";

export const state = {
  currentSubscriptionId: null,
  userProfile: JSON.parse(window.localStorage.getItem("userProfile")) || null,
  groups: JSON.parse(window.localStorage.getItem("groups")) || [],
  tags: JSON.parse(window.localStorage.getItem("tags")) || [],
  shoppingLists: JSON.parse(window.localStorage.getItem("shoppingLists")) || [],
  userPreferences:
    JSON.parse(window.localStorage.getItem("userPreferences")) || [],
};

export const getters = {
  currentSubscription: (state) => {
    return state.userProfile.subscriptions.filter(
      (x) => x.isSelectedSubscription === true
    );
  },
  groups: (state) => {
    return state.groups;
  },
  shoppingLists: (state) => {
    return state.shoppingLists;
  },
  tags: (state) => {
    return state.tags;
  },
};

export const actions = {
  dispatchHubSyncMessage({ getters, state }, origin) {
    hubConnection.invoke("SyncUserSession", {
      subscriptionId: getters.currentSubscription[0].id,
      message: `Sync User Session - ${getters.currentSubscription[0].id} initiated by ${state.userProfile.name} from ${origin}`,
    });
  },
  setGroups({ commit }, newValue) {
    commit("SET_GROUPS_VALUE", newValue);
  },
  setShoppingLists({ commit }, newValue) {
    commit("SET_SHOPPING_LISTS_VALUE", newValue);
  },
  setTags({ commit }, newValue) {
    commit("SET_TAGS_VALUE", newValue);
  },
  setUserProfile({ commit }, newValue) {
    commit("SET_USER_PROFILE_VALUE", newValue);
  },
  async syncCurrentSession({ commit, state }) {
    try {
      let response = await axiosInstance.post(`sync`, state.userProfile);
      await commit("SET_SESSION_INIT_VALUE", response.data.item);
    } catch (error) {
      appInsights.trackException({
        exception: error,
      });
    }
    return true;
  },
  async syncInitSession({ commit, dispatch }, userProfile) {
    try {
      let response = await axiosInstance.post(`sync`, userProfile);
      await commit("SET_SESSION_INIT_VALUE", response.data.item);
    } catch (error) {
      appInsights.trackException({
        exception: error,
      });
      // TO-DO: Push Error Message to global Event Bus Message System
    } finally {
      dispatch("appState/toggleAppLoadingStatus", false, { root: true });
    }
  },
};

export const mutations = {
  SET_GROUPS_VALUE(state, value) {
    state.groups = value;
    window.localStorage.setItem("groups", JSON.stringify(value));
  },
  SET_SHOPPING_LISTS_VALUE(state, value) {
    state.shoppingLists = value;
    window.localStorage.setItem("shoppingLists", JSON.stringify(value));
  },
  SET_TAGS_VALUE(state, value) {
    state.tags = value;
    window.localStorage.setItem("tags", JSON.stringify(value));
  },
  SET_USER_PROFILE_VALUE(state, value) {
    state.userProfile = value;
  },
  SET_SESSION_INIT_VALUE(state, value) {
    state.userProfile = value.userProfile;
    state.groups = value.groups;
    state.tags = value.tags;
    state.userPreferences = value.userPreferences;
    state.shoppingLists = value.shoppingLists;
    window.localStorage.setItem(
      "userProfile",
      JSON.stringify(value.userProfile)
    );
    window.localStorage.setItem("groups", JSON.stringify(value.groups));
    window.localStorage.setItem("tags", JSON.stringify(value.tags));
    window.localStorage.setItem(
      "shoppingLists",
      JSON.stringify(value.shoppingLists)
    );
    window.localStorage.setItem(
      "userPreferences",
      JSON.stringify(value.shoppingLists)
    );
  },
};
