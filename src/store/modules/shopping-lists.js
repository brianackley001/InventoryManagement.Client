import axiosInstance from "@/plugins/axiosInstance";
import { appInsights } from "@/plugins/app-insights";
import enumValues from "@/assets/configuration/enums";
import { filterUniqueCollectionItemCount } from "@/utils/associatedItemAttribute";
import router from "@/router";

export const state = {
  checkoutInProgress: false,
  filteredCheckoutItems: [],
  itemAttributeCollection: [],
  itemFilters: null,
  items: [],
  pagedCollection: {
    pageNumber: 1,
    pageSize: 1,
    collectionTotal: 10,
  },
  pageSize: 10,
  selectedShoppingListCollection: "",
  showCheckoutFilterModal: false,
  syncedCheckoutSuccessMessage: "",
};

export const getters = {
  checkoutInProgress: (state) => state.checkoutInProgress,
  filteredCheckoutItems: (state) => state.filteredCheckoutItems,
  itemAttributeCollection: (state) => state.itemAttributeCollection,
  itemFilters: (state) => state.itemFilters,
  items: (state) => state.items,
  pagedCollection: (state) => state.pagedCollection,
  pageSize: (state) => state.pageSize,
  selectedShoppingListCollection: (state) =>
    state.selectedShoppingListCollection,
  showCheckoutFilterModal: (state) => state.showCheckoutFilterModal,
  syncedCheckoutSuccessMessage: (state) => state.syncedCheckoutSuccessMessage,
};

export const actions = {
  fetchItemAttributeCollection({ commit, state }) {
    let groups = [];
    let tags = [];
    const itemGroups = state.items
      .filter((i) => {
        return i.groups.length > 0;
      })
      .map((i) => i.groups.map((g) => groups.push(g)));
    const itemTags = state.items
      .filter((i) => {
        return i.tags.length > 0;
      })
      .map((i) => i.tags.map((t) => tags.push(t)));

    if (itemGroups.length > 0 || itemTags.length > 0) {
      let attrCollection = { groups: [], tags: [] };
      attrCollection.groups = groups
        .filter((item, pos, arr) => {
          return arr.map((mapObj) => mapObj["id"]).indexOf(item["id"]) === pos;
        })
        .sort((a, b) =>
          a.name.toLowerCase().replace(/\s/g, "") >
          b.name.toLowerCase().replace(/\s/g, "")
            ? 1
            : -1
        );
      attrCollection.tags = tags
        .filter((item, pos, arr) => {
          return arr.map((mapObj) => mapObj["id"]).indexOf(item["id"]) === pos;
        })
        .sort((a, b) =>
          a.name.toLowerCase().replace(/\s/g, "") >
          b.name.toLowerCase().replace(/\s/g, "")
            ? 1
            : -1
        );

      commit("SET_ITEM_ATTRIBUTE_COLLECTION_VALUE", attrCollection);
    }
  },
  async fetchNameByShoppingListId({ commit, dispatch, rootGetters }, id) {
    dispatch("appState/toggleLoadingState", true, { root: true });
    let currentShoppingList = await rootGetters["session/shoppingLists"].filter(
      (g) => g.id == id
    );
    await commit(
      "SET_SELECTED_SHOPPING_LIST_COLLECTION_VALUE",
      currentShoppingList[0].name
    );
    dispatch("appState/toggleLoadingState", false, { root: true });
    return;
  },
  async fetchShoppingList({ commit, dispatch, rootGetters }, searchRequest) {
    if (!rootGetters["appState/loading"]) {
      dispatch("appState/toggleLoadingState", true, { root: true });
    }

    let subscriptionId = rootGetters["session/currentSubscription"][0].id;

    const response = await axiosInstance
      .post(
        `/shoppingList/${subscriptionId}/listItems/${searchRequest.idCollection[0]}`,
        searchRequest
      )
      .catch((err) => err);

    if (response instanceof Error) {
      appInsights.trackException({ exception: response });
      console.error(response);
      dispatch("appState/toggleLoadingState", false, { root: true });
      return;
    }

    commit("SET_ITEMS", response.data.item);
    commit("SET_FILTERED_CHECKOUT_COLLECTION_VALUE", response.data.item);
    if (rootGetters["appState/loading"]) {
      dispatch("appState/toggleLoadingState", false, { root: true });
    }
  },
  async fetchShoppingListsWithItemCounts(
    { commit, dispatch, rootGetters },
    searchRequest
  ) {
    let subscriptionId = rootGetters["session/currentSubscription"][0].id;

    const response = await axiosInstance
      .post(`/shoppingList/${subscriptionId}/lists`, searchRequest)
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
  async initCheckout({ commit, dispatch, state }) {
    dispatch("appState/toggleLoadingState", true, { root: true });
    let tvp = state.items.map((i) => {
      return {
        shoppingListId: i.shoppingListId,
        itemId: i.itemId,
        subscriptionId: i.subscriptionId,
        isActive: i.isActive,
        isSelected: i.isSelected,
      };
    });
    let response = await axiosInstance
      .post(`/shoppingList/init-checkout-sync`, tvp)
      .catch((err) => err);

    if (response instanceof Error) {
      appInsights.trackException({ exception: response });
      console.error(response);
      dispatch("appState/toggleLoadingState", false, { root: true });
      dispatch(
        "appState/showErrorNotification",
        `Unable to initialize shopping list checkout`,
        { root: true }
      );
      return false;
    }
    commit("SET_CHECKOUT_IN_PROGRESS_VALUE", true);
    dispatch("appState/toggleLoadingState", false, { root: true });
    return true;
  },
  setCurrentPage({ commit }, value) {
    commit("SET_CURRENT_PAGE_VALUE", value);
  },
  async shoppingListCheckout({ commit, dispatch }, shoppingListItems) {
    dispatch("appState/toggleLoadingState", true, { root: true });

    let response = await axiosInstance
      .post(`/shoppingList/checkout`, shoppingListItems.items)
      .catch((err) => err);

    if (response instanceof Error) {
      appInsights.trackException({ exception: response });
      console.error(response);
      dispatch("appState/toggleLoadingState", false, { root: true });
      dispatch(
        "appState/showErrorNotification",
        `Unable to complete shopping list checkout for "${shoppingListItems.name}"`,
        { root: true }
      );
      return false;
    }

    dispatch("appState/toggleLoadingState", false, { root: true });
    let completedItems = shoppingListItems.items.filter((i) => {
      return i.isSelected;
    }).length;
    let successMsg = `Shopping List "${shoppingListItems.name}" checkout is complete! (${completedItems} of ${shoppingListItems.items.length} items crossed off the list)`;
    await commit("SET_SYNCED_CHECKOUT_SUCCESS_MESSAGE_VALUE", successMsg);
    dispatch("appState/showSuccessNotification", successMsg, {
      root: true,
    });
    return true;
  },
  async syncShoppingList({ dispatch }, shoppingListId) {
    dispatch("appState/toggleLoadingState", true, { root: true });
    let response = await axiosInstance
      .post(`/shoppingList/checkout-sync-list/${shoppingListId}`)
      .catch((err) => err);

    if (response instanceof Error) {
      appInsights.trackException({ exception: response });
      console.error(response);
      dispatch("appState/toggleLoadingState", false, { root: true });
      dispatch(
        "appState/showErrorNotification",
        `Unable to sync shopping list ("${shoppingListId}")`,
        { root: true }
      );
      return false;
    }
    // Update Selections:
    let updatedSelections = response.data.item
      .filter((item) => {
        return item.isSelected;
      })
      .map((m) => {
        return m.itemId;
      });

    dispatch("selections/bulkUpdateSelectionModeItems", updatedSelections, {
      root: true,
    });

    dispatch("appState/toggleLoadingState", false, { root: true });
    return true;
  },
  async syncCheckoutItem({ dispatch }, item) {
    dispatch("appState/toggleLoadingState", true, { root: true });
    let response = await axiosInstance
      .post(`/shoppingList/checkout-sync-item`, item)
      .catch((err) => err);

    if (response instanceof Error) {
      appInsights.trackException({ exception: response });
      console.error(response);
      dispatch("appState/toggleLoadingState", false, { root: true });
      dispatch(
        "appState/showErrorNotification",
        `Unable to sync shopping list checkout item ("${item.name}")`,
        { root: true }
      );
      return false;
    }
    dispatch("appState/toggleLoadingState", false, { root: true });
    return true;
  },
  async upsertShoppingList({ dispatch, rootGetters }, payload) {
    if (!rootGetters["appState/loading"]) {
      dispatch("appState/toggleLoadingState", true, { root: true });
    }
    let subscriptionId = rootGetters["session/currentSubscription"][0].id;

    let response = await axiosInstance
      .post(`/shoppingList`, payload.shoppingList)
      .catch((err) => err);

    if (response instanceof Error) {
      appInsights.trackException({ exception: response });
      console.error(response);
      dispatch("appState/toggleLoadingState", false, { root: true });
      dispatch(
        "appState/showErrorNotification",
        `Unable to save shopping list "${payload.shoppingList.name}"`,
        { root: true }
      );
      return;
    }

    response = await axiosInstance
      .get(`/shoppingList/${subscriptionId}/lists/1/100`)
      .catch((err) => err);

    if (response instanceof Error) {
      appInsights.trackException({ exception: response });
      console.error(response);
      dispatch("appState/toggleLoadingState", false, { root: true });
      dispatch(
        "appState/showErrorNotification",
        `Unable to retrive shopping lists`,
        {
          root: true,
        }
      );
      return;
    }

    dispatch("session/setShoppingLists", response.data.item, { root: true });

    let returnShoppingListValue = null;
    if (payload.shoppingList.id < 0) {
      returnShoppingListValue = response.data.item.filter(
        (s) => s.name == payload.shoppingList.name
      );
    } else {
      returnShoppingListValue = response.data.item.filter(
        (s) => s.id == payload.shoppingList.id
      );
    }

    // refresh currently selcted item detail with updated, sorted attributes
    if (!payload.bulkUpload) {
      if (payload && payload.shoppingList) {
        let refreshPayload = {
          attributeType: enumValues.ATTRIBUTE_TYPE.SHOPPING_LIST,
          isSelected: false,
          attributeItem: returnShoppingListValue[0],
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
        `Tag "${payload.shoppingList.name}" saved!`,
        {
          root: true,
        }
      );
    }
    dispatch("session/dispatchHubSyncMessage", "upsertShoppingList", {
      root: true,
    });
    returnShoppingListValue[0].attributeType =
      enumValues.ATTRIBUTE_TYPE.SHOPPING_LIST;
    return returnShoppingListValue[0];
  },
  async upsertShoppingListItems(
    { dispatch, rootGetters },
    shoppingListRequest
  ) {
    dispatch("appState/toggleLoadingState", true, { root: true });
    let subscriptionId = rootGetters["session/currentSubscription"][0].id;
    let tvp = [];
    for (var i = 0; i < shoppingListRequest.lists.length; i++) {
      shoppingListRequest.lists[i].items.map(function (m) {
        tvp.push({
          subscriptionId: subscriptionId,
          shoppingListId: shoppingListRequest.lists[i].attributeId,
          itemId: m,
          isActive: true,
          isSelected:
            shoppingListRequest.bulkActionType ==
            enumValues.SELECTION_ACTION.ADD
              ? true
              : false,
        });
      });
    }

    let response = await axiosInstance
      .post(
        `/shoppingList/listItems/${shoppingListRequest.lists[0].attributeId}`,
        tvp
      )
      .catch((err) => err);

    if (response instanceof Error) {
      appInsights.trackException({ exception: response });
      console.error(response);
      dispatch("appState/toggleLoadingState", false, { root: true });
      dispatch(
        "appState/showErrorNotification",
        `Unable to save shopping list items`,
        { root: true }
      );
      return;
    }
    let targetUniques = filterUniqueCollectionItemCount(
      shoppingListRequest.lists
    );
    let tvpUniques = filterUniqueCollectionItemCount(
      shoppingListRequest.lists[0].items
    );
    let targetDesc = targetUniques > 1 ? "lists" : "list";
    let itemDesc = tvpUniques > 1 ? "items" : "item";
    let actionVerb =
      shoppingListRequest.bulkActionType == enumValues.SELECTION_ACTION.ADD
        ? "added to"
        : "removed from";
    let messageContent = `${tvpUniques} ${itemDesc} ${actionVerb} ${targetUniques} ${targetDesc}!`;

    if (router.currentRoute.name == "shopping-list") {
      let searchRequest = {
        pagedCollection: {
          pageNumber: 1,
          pageSize: 100,
          collectionTotal: 500,
        },
        searchType: "",
        searchTerm: "",
        sortBy: enumValues.SORT_BY.NAME,
        sortAscending: true,
        idCollection: [router.currentRoute.params.id],
      };
      dispatch("fetchShoppingList", searchRequest);
    }

    dispatch("appState/toggleLoadingState", false, { root: true });
    dispatch("appState/showSuccessNotification", messageContent, {
      root: true,
    });
    dispatch("session/dispatchHubSyncMessage", "upsertShoppingListItems", {
      root: true,
    });
  },
  setCheckoutInProgress({ commit }, value) {
    commit("SET_CHECKOUT_IN_PROGRESS_VALUE", value);
  },
  setFilteredCheckoutCollection({ commit }, value) {
    commit("SET_FILTERED_CHECKOUT_COLLECTION_VALUE", value);
  },
  setItemFilters({ commit }, value) {
    commit("SET_ITEM_FILTER_VALUE", value);
  },
  setSelectedShoppingListCollection({ commit }, value) {
    commit("SET_SELECTED_SHOPPING_LIST_COLLECTION_VALUE", value);
  },
  toggleCheckoutFilterModal({ commit }, value) {
    commit("SET_FILTERED_CHECKOUT_DIALOG_VISIBLE", value);
  },
};

export const mutations = {
  SET_CHECKOUT_IN_PROGRESS_VALUE: (state, value) => {
    state.checkoutInProgress = value;
  },
  SET_ITEMS: (state, value) => {
    state.items = value;
  },
  SET_FILTERED_CHECKOUT_COLLECTION_VALUE: (state, value) => {
    state.filteredCheckoutItems = value;
  },
  SET_FILTERED_CHECKOUT_DIALOG_VISIBLE: (state, value) => {
    state.showCheckoutFilterModal = value;
  },
  SET_ITEM_ATTRIBUTE_COLLECTION_VALUE: (state, value) => {
    state.itemAttributeCollection = value;
  },
  SET_ITEM_FILTER_VALUE: (state, value) => {
    state.itemFilters = value;
  },
  SET_PAGED_COLLECTION: (state, value) => {
    state.pagedCollection = value;
  },
  SET_CURRENT_PAGE_VALUE: (state, value) => {
    state.pagedCollection.pageNumber = value;
  },
  SET_SELECTED_SHOPPING_LIST_COLLECTION_VALUE: (state, value) => {
    state.selectedShoppingListCollection = value;
  },
  SET_SYNCED_CHECKOUT_SUCCESS_MESSAGE_VALUE: (state, value) => {
    state.syncedCheckoutSuccessMessage = value;
  },
};
