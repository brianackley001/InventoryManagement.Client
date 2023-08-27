import store from "../store/index";
import enumValues from "../assets/configuration/enums";

export function applyFilteringCriteria(filteringCriteria, itemCollection) {
  let filteredItemCollection = [];
  if (filteringCriteria.sortByAttribute === enumValues.ATTRIBUTE_TYPE.GROUP) {
    // GROUP: check for emptied array from previous filtered selections:
    if (filteringCriteria.groups.length == 0) {
      store.dispatch(
        "shoppingLists/setFilteredCheckoutCollection",
        store.getters["shoppingLists/items"]
      );
    } else {
      filteringCriteria.groups.forEach((searchId) => {
        itemCollection.filter((i) => {
          i.groups.filter((g) => {
            if (g.id == searchId) {
              if (filteredItemCollection.indexOf(i.id) < 0) {
                filteredItemCollection.push(i);
              }
            }
          });
        });
      });
    }
  } else {
    // TAG: check for emptied array from previous filtered selections:
    if (filteringCriteria.tags.length == 0) {
      store.dispatch(
        "shoppingLists/setFilteredCheckoutCollection",
        store.getters["shoppingLists/items"]
      );
    } else {
      filteringCriteria.tags.forEach((searchId) => {
        itemCollection.filter((i) => {
          i.tags.filter((t) => {
            if (t.id == searchId) {
              if (filteredItemCollection.indexOf(i.id) < 0) {
                filteredItemCollection.push(i);
              }
            }
          });
        });
      });
    }
  }

  // Sort Results:
  if (filteringCriteria.sortByAsc) {
    filteredItemCollection = sortCollectionByNameAsc(filteredItemCollection);
  } else {
    filteredItemCollection = sortCollectionByNameDesc(filteredItemCollection);
  }
  return filteredItemCollection;
}

export function mapCheckoutItems(items, selectedItems, shoppingListName) {
  let shoppingListCheckoutItems = [];

  items.forEach((i) => {
    let isSelected =
      selectedItems.filter((s) => {
        return i.itemId == s;
      }).length > 0;

    shoppingListCheckoutItems.push({
      shoppingListId: i.shoppingListId,
      itemId: i.itemId,
      subscriptionId: i.subscriptionId,
      isActive: i.itemIsActive,
      isSelected: isSelected,
    });
  });

  let shoppingListItems = {
    name: shoppingListName,
    items: shoppingListCheckoutItems,
  };
  return shoppingListItems;
}

export function mapFilterObjects(filteringCriteria, itemAttributeCollection) {
  let itemFilters = { type: filteringCriteria.sortByAttribute };
  let items = [];

  if (filteringCriteria.sortByAttribute == enumValues.ATTRIBUTE_TYPE.TAG) {
    filteringCriteria.tags.forEach((fc) => {
      return itemAttributeCollection.tags.filter((t) => {
        if (t.id == fc && items.indexOf(fc) < 0) items.push(t);
      });
    });
  } else {
    filteringCriteria.groups.forEach((fc) => {
      return itemAttributeCollection.groups.filter((g) => {
        if (g.id == fc && items.indexOf(fc) < 0) items.push(g);
      });
    });
  }
  itemFilters.items = items;
  return itemFilters;
}

export function sortCollectionByNameAsc(collection) {
  return collection.sort((a, b) =>
    a.name.toLowerCase().replace(/\s/g, "") >
    b.name.toLowerCase().replace(/\s/g, "")
      ? 1
      : -1
  );
}

export function sortCollectionByNameDesc(collection) {
  return collection.sort((a, b) =>
    a.name.toLowerCase().replace(/\s/g, "") <
    b.name.toLowerCase().replace(/\s/g, "")
      ? 1
      : -1
  );
}

export default {
  applyFilteringCriteria,
  mapCheckoutItems,
  mapFilterObjects,
  sortCollectionByNameAsc,
  sortCollectionByNameDesc,
};
