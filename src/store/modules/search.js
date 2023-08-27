import axiosInstance from "@/plugins/axiosInstance";
import { appInsights } from "@/plugins/app-insights";
import storeUtils from "@/utils/store-helpers";

export const state = {
  idCollection: [],
  items: [],
  pagedCollection: {
    pageNumber: 1,
    pageSize: 1,
    collectionTotal: 10,
  },
  pageSize: 10,
  searchTerm: null,
  searchType: null,
};

export const getters = {
  idCollection: (state) => state.idCollection,
  items: (state) => state.items,
  pagedCollection: (state) => state.pagedCollection,
  pageSize: (state) => state.pageSize,
  searchTerm: (state) => state.searchTerm,
  searchType: (state) => state.searchType,
};

export const actions = {
  async fetchSearchResults({ commit, dispatch, rootGetters }, searchRequest) {
    if (!rootGetters["appState/loading"]) {
      dispatch("appState/toggleLoadingState", true, { root: true });
    }

    let subscriptionId = rootGetters["session/currentSubscription"][0].id;

    const response = await axiosInstance
      .post(`/search/${subscriptionId}`, searchRequest)
      .catch((err) => err);

    if (response instanceof Error) {
      appInsights.trackException({ exception: response });
      console.error(response);
      dispatch("appState/toggleLoadingState", false, { root: true });
      return;
    }

    commit("SET_PAGED_COLLECTION", response.data.pagedCollection);
    commit("SET_ITEMS", response.data.item);
    if (rootGetters["appState/loading"]) {
      dispatch("appState/toggleLoadingState", false, { root: true });
    }
  },
  async fetchLowQuantityItems(
    { commit, dispatch, rootGetters },
    searchRequest
  ) {
    if (!rootGetters["appState/loading"]) {
      dispatch("appState/toggleLoadingState", true, { root: true });
    }

    let subscriptionId = rootGetters["session/currentSubscription"][0].id;

    const response = await axiosInstance
      .post(`/search/${subscriptionId}/lowquantity`, searchRequest)
      .catch((err) => err);

    if (response instanceof Error) {
      appInsights.trackException({ exception: response });
      console.error(response);
      dispatch("appState/toggleLoadingState", false, { root: true });
      return;
    }

    commit("SET_PAGED_COLLECTION", response.data.pagedCollection);
    commit("SET_ITEMS", response.data.item);
    if (rootGetters["appState/loading"]) {
      dispatch("appState/toggleLoadingState", false, { root: true });
    }
  },
  setPageSize({ commit }, pageSize) {
    commit("SET_PAGE_SIZE", pageSize);
  },
  setSearchTerm({ commit }, searchTerm) {
    commit("SET_SEARCH_TERM", searchTerm);
  },
  updateListItemCollection({ commit }, value) {
    commit("UPDATE_LIST_ITEM_COLLECTION", value);
  },
};

export const mutations = {
  SET_ITEMS: (state, value) => {
    state.items = value;
  },
  SET_PAGED_COLLECTION: (state, value) => {
    state.pagedCollection = value;
  },
  SET_PAGE_SIZE: (state, value) => {
    state.pageSize = value;
  },
  SET_SEARCH_TERM: (state, value) => {
    state.searchTerm = value;
  },
  SET_SEARCH_TYPE: (state, value) => {
    state.searchType = value;
  },
  UPDATE_LIST_ITEM_COLLECTION: (state, value) => {
    state.items = storeUtils.updateListItemCollection(state.items, value);
  },
};
