import axiosInstance from "@/plugins/axiosInstance";
import { appInsights } from "@/plugins/app-insights";
import enumValues from "@/assets/configuration/enums";
import storeUtils from "@/utils/store-helpers";
import sortAttributeUtils from "@/utils/searchByAttribute";

export const state = {
  items: [],
  pagedCollection: {
    pageNumber: 1,
    pageSize: 1,
    collectionTotal: 10,
  },
  pageSize: 10,
  selectedGroupCollection: "",
};

export const getters = {
  items: (state) => state.items,
  pagedCollection: (state) => state.pagedCollection,
  pageSize: (state) => state.pageSize,
  selectedGroupCollection: (state) => state.selectedGroupCollection,
};

export const actions = {
  async fetchGroupsWithItemCounts(
    { commit, dispatch, rootGetters },
    searchRequest
  ) {
    let subscriptionId = rootGetters["session/currentSubscription"][0].id;

    const response = await axiosInstance
      .post(`/groups/${subscriptionId}/manage`, searchRequest)
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
  async fetchNameByGroupId({ commit, dispatch, rootGetters }, id) {
    if (!rootGetters["appState/loading"]) {
      dispatch("appState/toggleLoadingState", true, { root: true });
    }

    let currentGroup = await rootGetters["session/groups"].filter(
      (g) => g.id == id
    );
    await commit("SET_SELECTED_GROUP_COLLECTION_VALUE", currentGroup[0].name);
    dispatch("appState/toggleLoadingState", false, { root: true });
    return;
  },
  async fetchSearchResults({ commit, dispatch, rootGetters }, searchRequest) {
    dispatch("appState/toggleLoadingState", true, { root: true });

    let subscriptionId = rootGetters["session/currentSubscription"][0].id;

    const response = await axiosInstance
      .post(`/search/${subscriptionId}/groups`, searchRequest)
      .catch((err) => err);

    if (response instanceof Error) {
      appInsights.trackException({ exception: response });
      console.error(response);
      dispatch("appState/toggleLoadingState", false, { root: true });
      return;
    }

    commit("SET_PAGED_COLLECTION", response.data.pagedCollection);
    // When navigating to a collection of Items with a specific attibute, place that Group/Tag attribute as array[0] position
    let sortedItems = sortAttributeUtils.sortItemCollections(
      response.data.item
    );
    commit("SET_ITEMS", sortedItems);
    if (rootGetters["appState/loading"]) {
      dispatch("appState/toggleLoadingState", false, { root: true });
    }
  },
  setCurrentPage({ commit }, value) {
    commit("SET_CURRENT_PAGE_VALUE", value);
  },
  setSelectedGroupCollection({ commit }, value) {
    commit("SET_SELECTED_GROUP_COLLECTION_VALUE", value);
  },
  sortCollectionByTargetedAttributeId({ commit }, value) {
    commit("SET_ITEMS", value);
  },
  updateListItemCollection({ commit }, value) {
    commit("UPDATE_LIST_ITEM_COLLECTION", value);
  },
  async upsertGroup({ dispatch, rootGetters }, payload) {
    if (!rootGetters["appState/loading"]) {
      dispatch("appState/toggleLoadingState", true, { root: true });
    }
    let subscriptionId = rootGetters["session/currentSubscription"][0].id;

    let response = await axiosInstance
      .post(`/groups/${subscriptionId}`, payload.group)
      .catch((err) => err);

    if (response instanceof Error) {
      appInsights.trackException({ exception: response });
      console.error(response);
      dispatch("appState/toggleLoadingState", false, { root: true });
      dispatch(
        "appState/showErrorNotification",
        `Unable to save group "${payload.group.name}"`,
        { root: true }
      );
    }

    response = await axiosInstance
      .get(`/groups/${subscriptionId}`)
      .catch((err) => err);

    if (response instanceof Error) {
      appInsights.trackException({ exception: response });
      console.error(response);
      dispatch("appState/toggleLoadingState", false, { root: true });
      dispatch("appState/showErrorNotification", `Unable to retrive groups"`, {
        root: true,
      });
      return;
    }
    dispatch("session/setGroups", response.data.item, { root: true });

    let returnGroupValue = null;
    if (payload.group.id < 0) {
      returnGroupValue = response.data.item.filter(
        (g) => g.name == payload.group.name
      );
    } else {
      returnGroupValue = response.data.item.filter(
        (g) => g.id == payload.group.id
      );
    }

    // refresh currently selcted item detail with updated, sorted attributes
    if (!payload.bulkUpload) {
      if (payload && payload.group) {
        let refreshPayload = {
          attributeType: enumValues.ATTRIBUTE_TYPE.GROUP,
          isSelected: false,
          attributeItem: returnGroupValue[0],
        };
        await dispatch("items/refreshItemAttributeCollection", refreshPayload, {
          root: true,
        });
      }
    }

    if (rootGetters["appState/loading"]) {
      dispatch("appState/toggleLoadingState", false, { root: true });
      dispatch(
        "appState/showSuccessNotification",
        `Group "${payload.group.name}" saved!`,
        {
          root: true,
        }
      );
    }

    dispatch("session/dispatchHubSyncMessage", "upsertGroup", { root: true });
    returnGroupValue[0].attributeType = enumValues.ATTRIBUTE_TYPE.GROUP;
    return returnGroupValue[0];
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
  SET_CURRENT_PAGE_VALUE: (state, value) => {
    state.pagedCollection.pageNumber = value;
  },
  SET_SELECTED_GROUP_COLLECTION_VALUE: (state, value) => {
    state.selectedGroupCollection = value;
  },
  UPDATE_LIST_ITEM_COLLECTION: (state, value) => {
    state.items = storeUtils.updateListItemCollection(state.items, value);
  },
};
