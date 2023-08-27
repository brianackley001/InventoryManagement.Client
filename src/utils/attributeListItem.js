import enumValues from "@/assets/configuration/enums";
import router from "../router";
import store from "../store/";
import utils from "@/utils/attributeListItem";

export function assembleSearchRequest(attributeType, attributeId) {
  let pageSize = 10;
  let collectionTotal = 10;
  switch (attributeType) {
    case "tag":
      pageSize = store.getters["tags/pageSize"];
      collectionTotal = store.getters["tags/pagedCollection"].collectionTotal;
      break;
    case "shopping-list":
      pageSize = store.getters["shoppingLists/pageSize"];
      collectionTotal =
        store.getters["shoppingLists/pagedCollection"].collectionTotal;
      break;
    default:
      pageSize = store.getters["groups/pageSize"];
      collectionTotal = store.getters["groups/pagedCollection"].collectionTotal;
      break;
  }

  let searchRequest = {
    pagedCollection: {
      pageNumber: 1,
      pageSize: pageSize,
      collectionTotal: collectionTotal,
    },
    searchType: "",
    searchTerm: "",
    idCollection: [parseInt(attributeId)],
  };

  return searchRequest;
}

export function getAttributeTypeRouteName(attributeType) {
  let value = "group";

  switch (attributeType) {
    case "shoppinglist":
      value = "shopping-list";
      break;
    case "tag":
      value = "tag";
      break;
    default:
      value = "group";
      break;
  }
  return value;
}

export function getAttributeTypeDisplayName(attributeType) {
  let value = "Group";

  switch (attributeType) {
    case "shoppinglist":
      value = "Shopping List";
      break;
    case "tag":
      value = "Tag";
      break;
    default:
      value = "Group";
      break;
  }
  return value;
}

export function navigateToAttributeCollection(attributeType, itemId, itemName) {
  const attributeTypeRouteName = utils.getAttributeTypeRouteName(attributeType);
  const searchRequest = utils.assembleSearchRequest(attributeType, itemId);

  switch (attributeType) {
    case enumValues.ATTRIBUTE_TYPE.TAG:
      store.dispatch("tags/fetchNameByTagId", itemId);
      break;
    case enumValues.ATTRIBUTE_TYPE.SHOPPING_LIST:
      store.dispatch("shoppingLists/fetchNameByShoppingListId", itemId);
      break;
    default:
      store.dispatch("groups/fetchNameByGroupId", itemId);
      break;
  }

  utils.setSelectedAttibuteCollectionName(attributeType, itemName);
  utils.submitSearchRequest(attributeType, searchRequest);

  router.push({
    name: attributeTypeRouteName,
    params: { id: itemId },
  });
}
export function setSelectedAttibuteCollectionName(
  attributeType,
  attributeName
) {
  switch (attributeType) {
    case "shoppinglist":
      store.dispatch(
        "shoppingLists/setSelectedShoppingListCollection",
        attributeName
      );
      break;
    case "tag":
      store.dispatch("tags/setSelectedTagCollection", attributeName);
      break;
    default:
      store.dispatch("groups/setSelectedGroupCollection", attributeName);
      break;
  }
}
export function submitSearchRequest(attributeType, searchRequest) {
  switch (attributeType) {
    case "shoppinglist":
      store.dispatch("shoppingLists/fetchShoppingList", searchRequest);
      break;
    case "tag":
      store.dispatch("tags/setCurrentPage", 1);
      store.dispatch("tags/fetchSearchResults", searchRequest);
      break;
    default:
      store.dispatch("groups/setCurrentPage", 1);
      store.dispatch("groups/fetchSearchResults", searchRequest);
      break;
  }
}

export default {
  assembleSearchRequest,
  getAttributeTypeDisplayName,
  getAttributeTypeRouteName,
  navigateToAttributeCollection,
  setSelectedAttibuteCollectionName,
  submitSearchRequest,
};
