import axiosInstance from "@/plugins/axiosInstance";
import { appInsights } from "@/plugins/app-insights";
import deepEqual from "deep-equal";
import enumValues from "@/assets/configuration/enums";
import newItemStub from "@/assets/data/newItem.json";
import storeUtils from "@/utils/store-helpers";
import { Object } from "core-js";

export const state = {
  attributeItemCollection: [],
  dialogEditMode: false,
  dialogVisible: false,
  isCreateMode: false,
  items: [],
  itemIsDirty: false,
  menuClickCanDismiss: true,
  newItemAssociatedAttribute: {
    type: "none",
    id: 0,
    isAssociated: false,
  },
  pagedCollection: {
    pageNumber: 1,
    pageSize: 1,
    collectionTotal: 10,
  },
  pageSize: 10,
  pristineItem: {},
  selectedItem: {},
  stockItems: [],
};

export const getters = {
  attributeItemCollection: (state) => state.attributeItemCollection,
  dialogEditMode: (state) => state.dialogEditMode,
  dialogVisible: (state) => state.dialogVisible,
  isCreateMode: (state) => state.isCreateMode,
  items: (state) => state.items,
  itemIsDirty: (state) => !deepEqual(state.selectedItem, state.pristineItem),
  menuClickCanDismiss: (state) => state.menuClickCanDismiss,
  newItemAssociatedAttribute: (state) => state.newItemAssociatedAttribute,
  pagedCollection: (state) => state.pagedCollection,
  pageSize: (state) => state.pageSize,
  pristineItem: (state) => state.pristineItem,
  selectedItem: (state) => state.selectedItem,
  stockItems: (state) => state.stockItems,
};

export const actions = {
  async fetchItemDetail({ commit, dispatch, rootGetters }, itemId) {
    if (!rootGetters["appState/loading"]) {
      dispatch("appState/toggleLoadingState", true, { root: true });
    }

    const response = await axiosInstance
      .get(`/items/${itemId}`)
      .catch((err) => err);

    if (response instanceof Error) {
      appInsights.trackException({ exception: response });
      console.error(response);
      dispatch("appState/toggleLoadingState", false, { root: true });
      dispatch(
        "appState/showErrorNotification",
        `Unable to retrive item details"`,
        {
          root: true,
        }
      );
      return;
    }

    response.data.item.groups.sort((a, b) =>
      a.name > b.name ? 1 : b.name > a.name ? -1 : 0
    );
    response.data.item.tags.sort((a, b) =>
      a.name > b.name ? 1 : b.name > a.name ? -1 : 0
    );
    response.data.item.shoppingLists.sort((a, b) =>
      a.name > b.name ? 1 : b.name > a.name ? -1 : 0
    );

    commit("SET_SELECTED_ITEM", response.data.item);
    if (rootGetters["appState/loading"]) {
      dispatch("appState/toggleLoadingState", false, { root: true });
    }
  },
  async fetchItemsByIdCollection(
    { commit, dispatch, rootGetters },
    searchRequest
  ) {
    if (!rootGetters["appState/loading"]) {
      dispatch("appState/toggleLoadingState", true, { root: true });
    }

    let subscriptionId = rootGetters["session/currentSubscription"][0].id;

    const response = await axiosInstance
      .post(`/items/${subscriptionId}/itemIdCollection`, searchRequest)
      .catch((err) => err);

    if (response instanceof Error) {
      appInsights.trackException({ exception: response });
      console.error(response);
      dispatch("appState/toggleLoadingState", false, { root: true });
      dispatch("appState/showErrorNotification", `Unable to retrive items"`, {
        root: true,
      });
      return;
    }

    commit("SET_ATTRIBUTE_ITEM_COLLECTION", response.data.item);

    if (rootGetters["appState/loading"]) {
      dispatch("appState/toggleLoadingState", false, { root: true });
    }
  },
  async fetchSearchResults({ commit, dispatch, rootGetters }, searchRequest) {
    if (!rootGetters["appState/loading"]) {
      dispatch("appState/toggleLoadingState", true, { root: true });
    }

    let subscriptionId = rootGetters["session/currentSubscription"][0].id;

    const response = await axiosInstance
      .post(`/items/${subscriptionId}/items`, searchRequest)
      .catch((err) => err);

    if (response instanceof Error) {
      appInsights.trackException({ exception: response });
      console.error(response);
      dispatch("appState/toggleLoadingState", false, { root: true });
      dispatch("appState/showErrorNotification", `Unable to retrive items"`, {
        root: true,
      });
      return;
    }

    commit("SET_PAGED_COLLECTION", response.data.pagedCollection);
    commit("SET_ITEMS", response.data.item);

    if (rootGetters["appState/loading"]) {
      dispatch("appState/toggleLoadingState", false, { root: true });
    }
  },
  async fetchStockItems({ commit, dispatch, rootGetters }) {
    if (!rootGetters["appState/loading"]) {
      dispatch("appState/toggleLoadingState", true, { root: true });
    }

    const response = await axiosInstance
      .get(`/items/stockItems`)
      .catch((err) => err);

    if (response instanceof Error) {
      appInsights.trackException({ exception: response });
      console.error(response);
      dispatch("appState/toggleLoadingState", false, { root: true });
      dispatch(
        "appState/showErrorNotification",
        `Unable to retrive stock items"`,
        {
          root: true,
        }
      );
      return;
    }

    commit("SET_STOCK_ITEMS", response.data.item);

    if (rootGetters["appState/loading"]) {
      dispatch("appState/toggleLoadingState", false, { root: true });
    }
  },
  async importStockItems({ dispatch, rootGetters }, payload) {
    if (!rootGetters["appState/loading"]) {
      dispatch("appState/toggleLoadingState", true, { root: true });
    }

    let subscriptionId = rootGetters["session/currentSubscription"][0].id;
    payload.subscriptionId = subscriptionId;

    const response = await axiosInstance
      .post(`/items/stockItems`, payload)
      .catch((err) => err);

    if (response instanceof Error) {
      appInsights.trackException({ exception: response });
      console.error(response);
      dispatch("appState/toggleLoadingState", false, { root: true });
      dispatch(
        "appState/showErrorNotification",
        `Unable to import stock items"`,
        {
          root: true,
        }
      );
      return;
    }

    if (rootGetters["appState/loading"]) {
      dispatch("appState/toggleLoadingState", false, { root: true });
    }
    if (response.data.success) {
      dispatch(
        "appState/showSuccessNotification",
        `Stock Item(s) ["${payload.items.length}"] successfully imported!`,
        {
          root: true,
        }
      );
    }
  },
  launchAddNewItem({ commit, dispatch, rootGetters, state }) {
    let subscriptionId = rootGetters["session/currentSubscription"][0].id;
    newItemStub.groups = rootGetters["session/groups"].map((g) => {
      return {
        id: g.id,
        name: g.name,
        isActive: g.isActive,
        isSelected:
          state.newItemAssociatedAttribute.id === g.id &&
          state.newItemAssociatedAttribute.type === "group" &&
          state.newItemAssociatedAttribute.isAssociated,
        subscriptionId: subscriptionId,
      };
    });
    newItemStub.tags = rootGetters["session/tags"].map((t) => {
      return {
        id: t.id,
        name: t.name,
        isActive: t.isActive,
        isSelected:
          state.newItemAssociatedAttribute.id === t.id &&
          state.newItemAssociatedAttribute.type === "tag" &&
          state.newItemAssociatedAttribute.isAssociated,
        subscriptionId: subscriptionId,
      };
    });
    newItemStub.shoppingLists = rootGetters["session/shoppingLists"].map(
      (sl) => {
        return {
          id: sl.id,
          name: sl.name,
          isActive: sl.isActive,
          isSelected:
            state.newItemAssociatedAttribute.id === sl.id &&
            state.newItemAssociatedAttribute.type === "shopping-list" &&
            state.newItemAssociatedAttribute.isAssociated,
          subscriptionId: subscriptionId,
        };
      }
    );
    newItemStub.subscriptionId = subscriptionId;
    commit("SET_SELECTED_ITEM", newItemStub);
    dispatch("setDialogVisible", true);
  },
  async refreshItemAttributeCollection(
    { commit, dispatch, rootGetters, state },
    payload
  ) {
    let commitPayload = {
      attributeItem: payload.attributeItem,
      attributeType: payload.attributeType,
      refreshCollection: [],
    };
    switch (payload.attributeType) {
      case enumValues.ATTRIBUTE_TYPE.SHOPPING_LIST:
        commitPayload.refreshCollection = JSON.parse(
          JSON.stringify(state.selectedItem.shoppingLists)
        );
        break;
      case enumValues.ATTRIBUTE_TYPE.TAG:
        commitPayload.refreshCollection = JSON.parse(
          JSON.stringify(state.selectedItem.tags)
        );
        break;
      default:
        commitPayload.refreshCollection = JSON.parse(
          JSON.stringify(state.selectedItem.groups)
        );
        break;
    }

    await commit("REFRESH_ITEM_ATTRIBUTE_COLLECTION", commitPayload);

    if (rootGetters["appState/loading"]) {
      dispatch("appState/toggleLoadingState", false, { root: true });
    }
  },
  resetNewItemAssociatedAttribute({ commit }) {
    commit("SET_NEW_ITEM_ASSOCIATED_ATTRIBUTE", {
      type: "none",
      id: 0,
      isAssociated: false,
    });
  },
  resetSelectedItem({ commit }) {
    commit("SET_SELECTED_ITEM", {});
  },
  async saveItemDetail({ commit, dispatch, state }, payload) {
    dispatch("appState/toggleLoadingState", true, { root: true });

    // Update Item Attribute Collections (groups/shoppingLists, tags)
    await commit("UPDATE_ITEM_ATTRIBUTE_COLLECTIONS", payload);

    const response = await axiosInstance
      .post(`/items/${payload.item.subscriptionId}`, state.selectedItem)
      .catch((err) => err);

    if (response instanceof Error) {
      appInsights.trackException({ exception: response });
      console.error(response);
      dispatch("appState/toggleLoadingState", false, { root: true });
      dispatch(
        "appState/showErrorNotification",
        `Unable to save item details"`,
        {
          root: true,
        }
      );
    }

    if (response.data.success) {
      dispatch(
        "appState/showSuccessNotification",
        `Item "${payload.item.name}" saved!`,
        {
          root: true,
        }
      );
      // update appropriate List Item in collection(s)
      await storeUtils.refreshSearchRequest();
    }
    dispatch("appState/toggleLoadingState", false, { root: true });
    dispatch("session/dispatchHubSyncMessage", "saveItemDetail", {
      root: true,
    });
    return response.data.success;
  },
  setCreateMode({ commit }, value) {
    commit("SET_DIALOG_CREATE_MODE", value);
  },
  setCurrentPage({ commit }, value) {
    commit("SET_CURRENT_PAGE_VALUE", value);
  },
  setDialogEditMode({ commit }, newValue) {
    commit("SET_DIALOG_EDIT_MODE", newValue);
  },
  setDialogVisible({ commit }, newValue) {
    commit("SET_DIALOG_VISIBLE", newValue);
  },
  setGroupItem({ commit }, newValue) {
    commit("SET_GROUP_ITEM", newValue);
  },
  setItem({ commit }, newValue) {
    commit("SET_ITEM", newValue);
  },
  setMenuClickCanDismiss({ commit }, value) {
    commit("SET_MENU_CLICK_CAN_DIMISS", value);
  },
  setNewItemAssociatedAttribute({ commit }, value) {
    commit("SET_NEW_ITEM_ASSOCIATED_ATTRIBUTE", value);
  },
  setPageSize({ commit }, value) {
    commit("SET_PAGE_SIZE", value);
  },
  setShoppingListItem({ commit }, newValue) {
    commit("SET_SHOPPING_LIST_ITEM", newValue);
  },
  setTagItem({ commit }, newValue) {
    commit("SET_TAG_ITEM", newValue);
  },
};

export const mutations = {
  REFRESH_ITEM_ATTRIBUTE_COLLECTION: (state, commitPayload) => {
    // Insert attribute Item just created:
    const itemInArray = commitPayload.refreshCollection.includes(
      (x) => (x.id = commitPayload.attributeItem.id)
    );

    if (!itemInArray) {
      commitPayload.refreshCollection.push(commitPayload.attributeItem);
    }

    commitPayload.refreshCollection.sort((a, b) =>
      a.name > b.name ? 1 : b.name > a.name ? -1 : 0
    );
    switch (commitPayload.attributeType) {
      case enumValues.ATTRIBUTE_TYPE.SHOPPING_LIST:
        state.selectedItem.shoppingLists = commitPayload.refreshCollection;
        break;
      case enumValues.ATTRIBUTE_TYPE.TAG:
        state.selectedItem.tags = commitPayload.refreshCollection;
        break;
      default:
        state.selectedItem.groups = commitPayload.refreshCollection;
        break;
    }
  },
  SET_ATTRIBUTE_ITEM_COLLECTION: (state, value) => {
    state.attributeItemCollection = value;
  },
  SET_CURRENT_PAGE_VALUE: (state, value) => {
    state.pagedCollection.pageNumber = value;
  },
  SET_DIALOG_CREATE_MODE(state, value) {
    state.isCreateMode = value;
  },
  SET_DIALOG_EDIT_MODE(state, value) {
    state.dialogEditMode = value;
  },
  SET_DIALOG_VISIBLE(state, value) {
    state.dialogVisible = value;
  },
  SET_GROUP_ITEM: (state, value) => {
    const elementsIndex = state.selectedItem.groups.findIndex(
      (element) => element.id == value.id
    );
    let updatedArray = [...state.selectedItem.groups];
    updatedArray[elementsIndex] = {
      ...updatedArray[elementsIndex],
      isSelected: !updatedArray[elementsIndex].isSelected,
    };
    state.selectedItem.groups = updatedArray;
  },
  SET_ITEM(state, value) {
    // merge data with previous state
    state.selectedItem = Object.assign({}, state.selectedItem, value);
  },
  SET_ITEMS: (state, value) => {
    state.items = value;
  },
  SET_MENU_CLICK_CAN_DIMISS: (state, value) => {
    state.menuClickCanDismiss = value;
  },
  SET_NEW_ITEM_ASSOCIATED_ATTRIBUTE: (state, value) => {
    state.newItemAssociatedAttribute = value;
  },
  SET_PAGED_COLLECTION: (state, value) => {
    state.pagedCollection = value;
  },
  SET_PAGE_SIZE: (state, value) => {
    state.pageSize = value;
  },
  SET_SELECTED_ITEM: (state, value) => {
    state.pristineItem = JSON.parse(JSON.stringify(value));
    state.selectedItem = value;
  },
  SET_SHOPPING_LIST_ITEM: (state, value) => {
    const elementsIndex = state.selectedItem.shoppingLists.findIndex(
      (element) => element.id == value.id
    );
    let updatedArray = [...state.selectedItem.shoppingLists];
    updatedArray[elementsIndex] = {
      ...updatedArray[elementsIndex],
      isSelected: !updatedArray[elementsIndex].isSelected,
    };
    state.selectedItem.shoppingLists = updatedArray;
  },
  SET_STOCK_ITEMS: (state, value) => {
    state.stockItems = value;
  },
  SET_TAG_ITEM: (state, value) => {
    const elementsIndex = state.selectedItem.tags.findIndex(
      (element) => element.id == value.id
    );
    let updatedArray = [...state.selectedItem.tags];
    updatedArray[elementsIndex] = {
      ...updatedArray[elementsIndex],
      isSelected: !updatedArray[elementsIndex].isSelected,
    };
    state.selectedItem.tags = updatedArray;
  },
  UPDATE_ITEM_ATTRIBUTE_COLLECTIONS(state, payload) {
    //groups --  Default all values isSelected = false:
    state.selectedItem.groups.forEach((_x, idx) => {
      state.selectedItem.groups[idx].isSelected = false;
    }); //Update items where isSelected was explicitly declared = true
    for (let i = 0; i < payload.attributeCollection.groups.added.length; i++) {
      let match = state.selectedItem.groups.findIndex((x) => {
        return x.id == payload.attributeCollection.groups.added[i];
      });
      if (match > -1) {
        Object.assign(state.selectedItem.groups[match], {
          isSelected: true,
        });
      }
    }
    //shopping lists -- Default all values isSelected = false:
    state.selectedItem.shoppingLists.forEach((_x, idx) => {
      state.selectedItem.shoppingLists[idx].isSelected = false;
    }); //Update items where isSelected was explicitly declared = true
    for (
      let i = 0;
      i < payload.attributeCollection.shoppingLists.added.length;
      i++
    ) {
      let match = state.selectedItem.shoppingLists.findIndex((x) => {
        return x.id == payload.attributeCollection.shoppingLists.added[i];
      });
      if (match > -1) {
        Object.assign(state.selectedItem.shoppingLists[match], {
          isSelected: true,
        });
      }
    }
    //tags -- Default all values isSelected = false:
    state.selectedItem.tags.forEach((_x, idx) => {
      state.selectedItem.tags[idx].isSelected = false;
    }); //Update items where isSelected was explicitly declared = true
    for (let i = 0; i < payload.attributeCollection.tags.added.length; i++) {
      let match = state.selectedItem.tags.findIndex((x) => {
        return x.id == payload.attributeCollection.tags.added[i];
      });
      if (match > -1) {
        Object.assign(state.selectedItem.tags[match], {
          isSelected: true,
        });
      }
    }
  },
  UPDATE_LIST_ITEM_COLLECTION: (state, value) => {
    state.items = storeUtils.updateListItemCollection(state.items, value);
  },
};
