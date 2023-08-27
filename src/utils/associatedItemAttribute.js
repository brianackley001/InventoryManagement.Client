import store from "../store/";
export function trackItemAttribute(currentRoute) {
  const newItemAttribute = {
    type: currentRoute.name,
    id: 0,
    isAssociated: false,
  };

  switch (currentRoute.name) {
    case "tag":
    case "group":
    case "shopping-list":
      newItemAttribute.isAssociated = true;
      newItemAttribute.id = currentRoute.params.id;
      break;
    default:
      break;
  }

  if (newItemAttribute.isAssociated) {
    store.dispatch("items/setNewItemAssociatedAttribute", newItemAttribute);
  }
}
export function filterUniqueCollectionItemCount(itemCollection) {
  let uniques = itemCollection.filter((value, index, self) => {
    return self.indexOf(value) === index;
  });
  return uniques.length;
}

export default {
  filterUniqueCollectionItemCount,
  trackItemAttribute,
};
