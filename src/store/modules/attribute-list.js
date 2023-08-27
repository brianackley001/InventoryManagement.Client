export const state = {
  attributeType: "",
  dialogCreateMode: false,
  dialogEditMode: false,
  dialogVisible: false,
  item: {
    id: -1,
    name: "",
    isActive: true,
    subscriptionId: null,
  },
  itemTypeTitle: "",
  refreshItemDetail: false,
};

export const getters = {
  attributeType: (state) => {
    return state.attributeType;
  },
  dialogCreateMode: (state) => {
    return state.dialogCreateMode;
  },
  dialogEditMode: (state) => {
    return state.dialogEditMode;
  },
  dialogVisible: (state) => {
    return state.dialogVisible;
  },
  item: (state) => {
    return state.item;
  },
  itemTypeTitle: (state) => {
    return state.itemTypeTitle;
  },
  refreshItemDetail: (state) => {
    return state.refreshItemDetail;
  },
};

export const actions = {
  resetAttributeItem({ commit }) {
    let attrItem = {
      id: -1,
      name: "",
      isActive: true,
      subscriptionId: null,
    };
    commit("RESET_ATTRIBUTE_ITEM", attrItem);
  },
  setAttributeType({ commit }, newValue) {
    commit("SET_ATTRIBUTE_TYPE", newValue);
  },
  setDialogCreateMode({ commit }, newValue) {
    commit("SET_DIALOG_CREATE_MODE", newValue);
  },
  setDialogEditMode({ commit }, newValue) {
    commit("SET_DIALOG_EDIT_MODE", newValue);
  },
  setDialogVisible({ commit }, newValue) {
    commit("SET_DIALOG_VISIBLE", newValue);
  },
  setItem({ commit }, newValue) {
    commit("SET_ITEM", newValue);
  },
  setItemTypeTitle({ commit }, newValue) {
    commit("SET_ITEM_TYPE_TITLE", newValue);
  },
  setRefreshItemDetail({ commit }, newValue) {
    commit("SET_REFRESH_ITEM_DETAIL", newValue);
  },
};

export const mutations = {
  RESET_ATTRIBUTE_ITEM(state, value) {
    state.item = value;
  },
  SET_ATTRIBUTE_TYPE(state, value) {
    state.attributeType = value;
  },
  SET_DIALOG_CREATE_MODE(state, value) {
    state.dialogCreateMode = value;
  },
  SET_DIALOG_EDIT_MODE(state, value) {
    state.dialogEditMode = value;
  },
  SET_DIALOG_VISIBLE(state, value) {
    state.dialogVisible = value;
  },
  SET_ITEM(state, value) {
    // merge data with previous state
    state.item = Object.assign({}, state.item, value);
    //state.item = value;
  },
  SET_ITEM_TYPE_TITLE(state, value) {
    state.itemTypeTitle = value;
  },
  SET_REFRESH_ITEM_DETAIL(state, value) {
    state.refreshItemDetail = value;
  },
};
