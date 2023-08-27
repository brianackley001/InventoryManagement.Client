import axiosInstance from "@/plugins/axiosInstance";
import { appInsights } from "@/plugins/app-insights";
import enumValues from "@/assets/configuration/enums";
import { filterUniqueCollectionItemCount } from "@/utils/associatedItemAttribute";
import storeUtils from "@/utils/store-helpers";

export const state = {};

export const getters = {};

export const actions = {
  async upsertItemGroupItems({ dispatch, rootGetters }, itemGroupRequest) {
    if (!rootGetters["appState/loading"]) {
      dispatch("appState/toggleLoadingState", true, { root: true });
    }
    let subscriptionId = rootGetters["session/currentSubscription"][0].id;

    let tvp = [];
    for (var i = 0; i < itemGroupRequest.lists.length; i++) {
      itemGroupRequest.lists[i].items.map(function (m) {
        tvp.push({
          attributeId: itemGroupRequest.lists[i].attributeId,
          itemId: m,
          isActive: true,
          isSelected:
            itemGroupRequest.bulkActionType == enumValues.SELECTION_ACTION.ADD
              ? true
              : false,
        });
      });
    }

    let response = await axiosInstance
      .post(`/itemGroups/${subscriptionId}`, tvp)
      .catch((err) => err);

    if (response instanceof Error) {
      appInsights.trackException({ exception: response });
      console.error(response);
      dispatch("appState/toggleLoadingState", false, { root: true });
      dispatch("appState/showErrorNotification", `Unable to save group items`, {
        root: true,
      });
      return;
    }
    let targetUniques = filterUniqueCollectionItemCount(itemGroupRequest.lists);
    let tvpUniques = filterUniqueCollectionItemCount(
      itemGroupRequest.lists[0].items
    );
    let targetDesc = targetUniques > 1 ? "groups" : "group";
    let itemDesc = tvpUniques > 1 ? "items" : "item";
    let actionVerb =
      itemGroupRequest.bulkActionType == enumValues.SELECTION_ACTION.ADD
        ? "added to"
        : "removed from";
    let messageContent = `${tvpUniques} ${itemDesc} ${actionVerb} ${targetUniques} ${targetDesc}!`;

    // update appropriate List Item in collection(s)
    await storeUtils.refreshSearchRequest();

    if (rootGetters["appState/loading"]) {
      dispatch("appState/toggleLoadingState", false, { root: true });
    }
    dispatch("appState/showSuccessNotification", messageContent, {
      root: true,
    });
    dispatch("session/dispatchHubSyncMessage", "upsertItemGroupItems", {
      root: true,
    });
  },
};
