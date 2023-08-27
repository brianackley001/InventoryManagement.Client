export const state = {
  callToAction: { actionType: "", attributeType: "" },
  dialogVisible: false,
  mappingCollection: [],
  primaryKeyId: -1,
  selectionMode: false,
  selectionModeItems: [],
};

export const getters = {
  callToAction: (state) => state.callToAction,
  dialogVisible: (state) => state.dialogVisible,
  mappingCollection: (state) => state.mappingCollection,
  primaryKeyId: (state) => state.primaryKeyId,
  selectionMode: (state) => state.selectionMode,
  selectionModeItems: (state) => state.selectionModeItems,
};

export const actions = {
  bulkUpdateSelectionModeItems({ commit }, newValue) {
    commit("BULK_UPDATE_SELECTION_MODE_ITEMS", newValue);
  },
  resetSelectionMode({ commit }) {
    commit("RESET_SELECTION_MODE");
  },
  setCallToAction({ commit }, newValue) {
    commit("SET_CALL_TO_ACTION", newValue);
  },
  setDialogVisible({ commit }, newValue) {
    commit("SET_DIALOG_VISIBLE", newValue);
  },
  setMappingCollection({ commit }, newValue) {
    // Sort Alphabetically
    let sortedNewValues = newValue.sort((a, b) =>
      a.name > b.name ? 1 : b.name > a.name ? -1 : 0
    );
    commit("SET_MAPPING_COLLECTION", sortedNewValues);
  },
  setMappingCollectionItemValue({ commit }, newValue) {
    commit("SET_MAPPING_COLLECTION_ITEM", newValue);
  },
  trackSelectionMode({ commit }, newValue) {
    commit("SET_PRIMARY_KEY", newValue.primaryKeyId);
    commit("UPDATE_SELECTION_MODE", newValue.valueId);
  },
};

export const mutations = {
  BULK_UPDATE_SELECTION_MODE_ITEMS(state, value) {
    state.selectionModeItems = value;
  },
  RESET_SELECTION_MODE(state) {
    state.callToAction = { actionType: "", attributeType: "" };
    state.mappingCollection = state.selectionModeItems = [];
    state.primaryKeyId = -1;
    state.selectionMode = false;
  },
  SET_CALL_TO_ACTION(state, value) {
    state.callToAction = value;
  },
  SET_DIALOG_VISIBLE(state, value) {
    state.dialogVisible = value;
  },
  SET_MAPPING_COLLECTION(state, newValue) {
    state.mappingCollection = newValue;
  },
  SET_MAPPING_COLLECTION_ITEM: (state, value) => {
    const elementsIndex = state.mappingCollection.findIndex(
      (element) => element.id == value.id
    );
    let updatedArray = [...state.mappingCollection];
    updatedArray[elementsIndex] = {
      ...updatedArray[elementsIndex],
      isSelected: !updatedArray[elementsIndex].isSelected,
    };
    state.mappingCollection = updatedArray;
  },
  SET_PRIMARY_KEY(state, newValue) {
    if (state.primaryKeyId !== newValue) {
      state.primaryKeyId = newValue;
    }
  },
  UPDATE_SELECTION_MODE(state, newValue) {
    if (state.selectionModeItems.includes(newValue)) {
      //remove from array
      let index = state.selectionModeItems.indexOf(newValue);
      if (index > -1) {
        state.selectionModeItems.splice(index, 1);
      }
    } else {
      // Add to array
      state.selectionModeItems.push(newValue);
    }

    // Update boolean
    state.selectionMode = state.selectionModeItems.length > 0;
  },
};
