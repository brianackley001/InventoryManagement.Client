import store from "../store/index";
import router from "@/router";
import enumValues from "@/assets/configuration/enums";

export async function refreshSearchRequest() {
  let pagedCollection = {
    pageNumber: 1,
    pageSize: 10,
    collectionTotal: 10,
  };
  let searchRequest = {
    pagedCollection: pagedCollection,
    searchType: "",
    searchTerm: "",
    sortBy: enumValues.SORT_BY.NAME,
    sortAscending: true,
  };
  switch (router.currentRoute.name) {
    case "shopping-list":
      searchRequest.pagedCollection.pageNumber = 1;
      searchRequest.pagedCollection.pageSize = 30;
      searchRequest.pagedCollection.collectionTotal = 500;
      searchRequest.idCollection = [parseInt(router.currentRoute.params.id)];

      store.dispatch("shoppingLists/fetchShoppingList", searchRequest); //, searchRequest, {
      //   root: true,
      // });
      break;
    case "tag":
      searchRequest.pagedCollection = store.getters["tags/pagedCollection"];
      searchRequest.idCollection = [parseInt(router.currentRoute.params.id)];
      store.dispatch("tags/fetchSearchResults", searchRequest, { root: true });
      break;
    case "group":
      searchRequest.pagedCollection = store.getters["groups/pagedCollection"];
      searchRequest.idCollection = [parseInt(router.currentRoute.params.id)];
      await store.dispatch("groups/fetchSearchResults", searchRequest, {
        root: true,
      });
      break;
    case "search":
      searchRequest.pagedCollection = store.getters["search/pagedCollection"];
      searchRequest.searchType = store.getters["search/searchType"];
      searchRequest.searchTerm = store.getters["search/searchTerm"];
      searchRequest.sortBy = enumValues.SORT_BY.NAME;
      store.dispatch("search/fetchSearchResults", searchRequest, {
        root: true,
      });
      break;
    case "items":
      searchRequest.pagedCollection = store.getters["items/pagedCollection"];
      searchRequest.sortBy = enumValues.SORT_BY.NAME;
      store.dispatch("items/fetchSearchResults", searchRequest, {
        root: true,
      });
      break;
    default:
      searchRequest.pagedCollection = store.getters["search/pagedCollection"];
      searchRequest.sortBy = enumValues.SORT_BY.QUANTITY;
      store.dispatch("search/fetchLowQuantityItems", searchRequest, {
        root: true,
      });
      break;
  }
}
export function updateListItemCollection(items, value) {
  const elementsIndex = items.findIndex((element) => element.id == value.id);
  let updatedArray = [...items];

  if (elementsIndex < 0) {
    value.groups = value.groups.filter((g) => {
      return g.isSelected;
    });
    value.tags = value.tags.filter((t) => {
      return t.isSelected;
    });
    updatedArray.unshift(value);
  } else {
    updatedArray[elementsIndex] = {
      ...updatedArray[elementsIndex],
      name: value.name,
      description: value.description,
      amountValue: value.amountValue,
      isActive: value.isActive,
      shoppingLists: value.shoppingLists,
      groups: value.groups.filter((g) => {
        return g.isSelected;
      }),
      tags: value.tags.filter((t) => {
        return t.isSelected;
      }),
    };
  }
  return updatedArray;
}

export default {
  refreshSearchRequest,
  updateListItemCollection,
};
