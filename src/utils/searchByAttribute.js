import router from "@/router";
import enumValues from "@/assets/configuration/enums";

export function sortItemCollections(items) {
  let targetItem = null;
  let attrIndex = -1;

  items.forEach((item) => {
    targetItem =
      router.currentRoute.name === enumValues.ATTRIBUTE_TYPE.TAG
        ? item.tags.filter((i, idx) => {
            if (i.id == router.currentRoute.params.id) attrIndex = idx;
            return i.id == router.currentRoute.params.id;
          })
        : item.groups.filter((i, idx) => {
            if (i.id == router.currentRoute.params.id) attrIndex = idx;
            return i.id == router.currentRoute.params.id;
          });

    if (targetItem[0]) {
      if (router.currentRoute.name === enumValues.ATTRIBUTE_TYPE.TAG) {
        item.tags.splice(attrIndex, 1);
        item.tags.unshift(targetItem[0]);
      } else {
        item.groups.splice(attrIndex, 1);
        item.groups.unshift(targetItem[0]);
      }
    }
  });
  return items;
}

export default {
  sortItemCollections,
};
