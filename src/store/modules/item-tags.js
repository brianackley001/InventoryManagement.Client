import axiosInstance from "@/plugins/axiosInstance";
import { appInsights } from "@/plugins/app-insights";
import enumValues from "@/assets/configuration/enums";
import { filterUniqueCollectionItemCount } from "@/utils/associatedItemAttribute";
import storeUtils from "@/utils/store-helpers";

export const state = {};

export const getters = {};

export const actions = {
  async upsertItemTagItems({ dispatch, rootGetters }, itemTagRequest) {
    if (!rootGetters["appState/loading"]) {
      dispatch("appState/toggleLoadingState", true, { root: true });
    }
    let subscriptionId = rootGetters["session/currentSubscription"][0].id;

    let tvp = [];
    for (var i = 0; i < itemTagRequest.lists.length; i++) {
      itemTagRequest.lists[i].items.map(function (m) {
        tvp.push({
          attributeId: itemTagRequest.lists[i].attributeId,
          itemId: m,
          isActive: true,
          isSelected:
            itemTagRequest.bulkActionType == enumValues.SELECTION_ACTION.ADD
              ? true
              : false,
        });
      });
    }

    let response = await axiosInstance
      .post(`/itemTags/${subscriptionId}`, tvp)
      .catch((err) => err);

    if (response instanceof Error) {
      appInsights.trackException({ exception: response });
      console.error(response);
      dispatch("appState/toggleLoadingState", false, { root: true });
      dispatch("appState/showErrorNotification", `Unable to save tag items`, {
        root: true,
      });
      return;
    }
    let targetUniques = filterUniqueCollectionItemCount(itemTagRequest.lists);
    let tvpUniques = filterUniqueCollectionItemCount(
      itemTagRequest.lists[0].items
    );
    let targetDesc = targetUniques > 1 ? "tags" : "tag";
    let itemDesc = tvpUniques > 1 ? "items" : "item";
    let actionVerb =
      itemTagRequest.bulkActionType == enumValues.SELECTION_ACTION.ADD
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
    dispatch("session/dispatchHubSyncMessage", "upsertItemTagItems", {
      root: true,
    });
  },
};
