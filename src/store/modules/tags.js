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
  selectedTagCollection: null,
};

export const getters = {
  items: (state) => state.items,
  pagedCollection: (state) => state.pagedCollection,
  pageSize: (state) => state.pageSize,
  selectedTagCollection: (state) => state.selectedTagCollection,
};

export const actions = {
  async fetchNameByTagId({ commit, dispatch, rootGetters }, id) {
    dispatch("appState/toggleLoadingState", true, { root: true });
    let currentTag = await rootGetters["session/tags"].filter(
      (g) => g.id == id
    );
    await commit("SET_SELECTED_TAG_COLLECTION_VALUE", currentTag[0].name);
    dispatch("appState/toggleLoadingState", false, { root: true });
    return;
  },
  async fetchSearchResults({ commit, dispatch, rootGetters }, searchRequest) {
    if (!rootGetters["appState/loading"]) {
      dispatch("appState/toggleLoadingState", true, { root: true });
    }

    let subscriptionId = rootGetters["session/currentSubscription"][0].id;

    const response = await axiosInstance
      .post(`/search/${subscriptionId}/tags`, searchRequest)
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
  async fetchTagsWithItemCounts(
    { commit, dispatch, rootGetters },
    searchRequest
  ) {
    let subscriptionId = rootGetters["session/currentSubscription"][0].id;

    const response = await axiosInstance
      .post(`/tags/${subscriptionId}/manage`, searchRequest)
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
  setCurrentPage({ commit }, value) {
    commit("SET_CURRENT_PAGE_VALUE", value);
  },
  setSelectedTagCollection({ commit }, value) {
    commit("SET_SELECTED_TAG_COLLECTION_VALUE", value);
  },
  sortCollectionByTargetedAttributeId({ commit }, value) {
    commit("SET_ITEMS", value);
  },
  updateListItemCollection({ commit }, value) {
    commit("UPDATE_LIST_ITEM_COLLECTION", value);
  },
  async upsertTag({ dispatch, rootGetters }, payload) {
    if (!rootGetters["appState/loading"]) {
      dispatch("appState/toggleLoadingState", true, { root: true });
    }
    let subscriptionId = rootGetters["session/currentSubscription"][0].id;
    payload.tag.subscriptionId = subscriptionId;

    let response = await axiosInstance
      .post(`/tags/${subscriptionId}`, payload.tag)
      .catch((err) => err);

    if (response instanceof Error) {
      appInsights.trackException({ exception: response });
      console.error(response);
      dispatch("appState/toggleLoadingState", false, { root: true });
      dispatch(
        "appState/showErrorNotification",
        `Unable to save tag "${payload.tag.name}"`,
        { root: true }
      );
      return;
    }

    response = await axiosInstance
      .get(`/tags/${subscriptionId}`)
      .catch((err) => err);

    if (response instanceof Error) {
      appInsights.trackException({ exception: response });
      console.error(response);
      dispatch("appState/toggleLoadingState", false, { root: true });
      dispatch("appState/showErrorNotification", `Unable to retrive tags"`, {
        root: true,
      });
      return;
    }
    dispatch("session/setTags", response.data.item, { root: true });

    let returnTagValue = null;
    if (payload.tag.id < 0) {
      returnTagValue = response.data.item.filter(
        (t) => t.name == payload.tag.name
      );
    } else {
      returnTagValue = response.data.item.filter((t) => t.id == payload.tag.id);
    }

    // refresh currently selcted item detail with updated, sorted attributes
    if (!payload.bulkUpload) {
      if (payload && payload.tag) {
        let refreshPayload = {
          attributeType: enumValues.ATTRIBUTE_TYPE.TAG,
          isSelected: false,
          attributeItem: returnTagValue[0],
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
        `Tag "${payload.tag.name}" saved!`,
        {
          root: true,
        }
      );
    }

    dispatch("session/dispatchHubSyncMessage", "upsertTag", {
      root: true,
    });
    returnTagValue[0].attributeType = enumValues.ATTRIBUTE_TYPE.TAG;

    return returnTagValue[0];
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
  SET_SELECTED_TAG_COLLECTION_VALUE: (state, value) => {
    state.selectedTagCollection = value;
  },
  UPDATE_LIST_ITEM_COLLECTION: (state, value) => {
    state.items = storeUtils.updateListItemCollection(state.items, value);
  },
};
