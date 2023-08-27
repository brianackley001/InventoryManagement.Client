export const ATTRIBUTE_TYPE = {
  GROUP: "group",
  ITEM: "item",
  SEARCH: "search",
  SHOPPING_LIST: "shoppinglist",
  TAG: "tag",
};
export const CHIP_COLOR = {
  GROUP: "purple lighten-3",
  TAG: "blue lighten-3",
  SHOPPING_LIST: "deep-orange accent-2",
};
export const CHIP_TEXT_COLOR = {
  GROUP: "purple darken-4",
  TAG: "indigo darken-4",
  SHOPPING_LIST: "deep-orange darken-3",
};
export const ITEM_QUANTITY = {
  ICON_COLOR: {
    EMPTY: "red darken-1",
    FULL: "green",
    LOW: "amber darken-1",
  },
  ICON_CLASS: {
    EMPTY: "mdi-gauge-empty",
    FULL: "mdi-gauge-full",
    LOW: "mdi-gauge-low",
  },
  THUMB_COLOR: {
    DARK: "dark-grey",
    LIGHT: "white",
  },
};
export const SELECTION_ACTION = {
  ADD: "add",
  REMOVE: "remove",
};
export const SELECTION_ACTION_ICON = {
  ADD: "mdi-plus",
  REMOVE: "mdi-minus",
};
export const SORT_BY = {
  DATE: "date",
  GROUPNAMES: "groupNames",
  NAME: "name",
  QUANTITY: "quantity",
  SHOPPINGLISTNAMES: "shoppingListNames",
  TAGNAMES: "tagNames",
};

export default {
  ATTRIBUTE_TYPE,
  CHIP_COLOR,
  CHIP_TEXT_COLOR,
  ITEM_QUANTITY,
  SELECTION_ACTION,
  SELECTION_ACTION_ICON,
  SORT_BY,
};
