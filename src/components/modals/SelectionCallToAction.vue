<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialogVisible"
      persistent
      :max-width="dialogMaxWidth"
      :retain-focus="retainFocus"
    >
      <v-card v-show="!loading">
        <v-card-text>
          <v-row>
            <v-spacer></v-spacer>
            <v-btn fab x-small @click="closeModal()">
              <v-icon small>mdi-close</v-icon>
            </v-btn>
          </v-row>
          <v-subheader>
            Add &nbsp;{{ selectionModeItems.length }}&nbsp; item(s)
            {{ attributeActionPreposition }}
            {{ attributeTypeTitle }}</v-subheader
          >
          <v-divider></v-divider>
          <v-list>
            <template v-for="(item, index) in attributeCollection">
              <v-list-item :key="index">
                <v-list-item-action>
                  <v-checkbox
                    :v-model="item"
                    :input-value="item.isSelected"
                    color="blue-grey darken-1"
                    @click.stop="toggleAttributeValue(item)"
                  ></v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title v-html="item.name"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <v-divider></v-divider>

            <CreateNewAttribute
              :attributeType="callToAction.attributeType"
              :bulkUpload="true"
              v-on:on-create-attribute-completed="saveSelection"
            />
          </v-list>
        </v-card-text>
        <v-card-actions v-show="itemIsDirty">
          <v-spacer></v-spacer>
          <v-btn outlined @click="closeModal">Cancel</v-btn>
          <v-btn color="primary" @click="saveSelection(null)"
            ><v-icon left>mdi-content-save</v-icon>Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import enumValues from "@/assets/configuration/enums";

import CreateNewAttribute from "@/components/CreateAttribute.vue";
export default {
  name: "SelectionCallToActionModal",
  components: { CreateNewAttribute },
  computed: {
    ...mapGetters("appState", ["loading"]),
    ...mapGetters("selections", [
      "callToAction",
      "dialogVisible",
      "mappingCollection",
      "selectionModeItems",
    ]),
    attributeActionPreposition: function () {
      return this.callToAction.actionType == this.enums.SELECTION_ACTION.ADD
        ? "to"
        : "from";
    },
    attributeCollection: function () {
      if (this.searchTerm && this.searchTerm.length > 0) {
        return this.mappingCollection.filter((item) => {
          return (
            item.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1
          );
        });
      } else {
        return this.mappingCollection;
      }
    },
    attributeTypeTitle: function () {
      switch (this.callToAction.attributeType) {
        case this.enums.ATTRIBUTE_TYPE.SHOPPING_LIST:
          return "Shopping List(s)";
        case this.enums.ATTRIBUTE_TYPE.TAG:
          return "Tag(s)";
        default:
          return "Group(s)";
      }
    },
    attributeTypeTitleSingular: function () {
      switch (this.callToAction.attributeType) {
        case this.enums.ATTRIBUTE_TYPE.SHOPPING_LIST:
          return "Shopping List";
        case this.enums.ATTRIBUTE_TYPE.TAG:
          return "Tag";
        default:
          return "Group";
      }
    },
    callToActionHeaderIcon: function () {
      return this.callToAction.actionType == this.enums.SELECTION_ACTION.ADD
        ? this.enums.SELECTION_ACTION_ICON.ADD
        : this.enums.SELECTION_ACTION_ICON.REMOVE;
    },
    currentListItemIsDirty: function () {
      return this.callToAction.actionType == this.enums.SELECTION_ACTION.ADD
        ? this.enums.SELECTION_ACTION_ICON.ADD
        : this.enums.SELECTION_ACTION_ICON.REMOVE;
    },
    dialogMaxWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "340px";
        case "sm":
          return "450px";
        case "md":
          return "600px";
        case "lg":
          return "800px";
        default:
          return "1400px";
      }
    },
    enums: function () {
      return enumValues;
    },
    itemIsDirty() {
      return (
        this.mappingCollection.filter((item) => {
          return item.isSelected;
        }).length > 0
      );
    },
  },
  data: function () {
    return {
      displayUnsavedDataPrompt: false,
      isItemAttributeMapping: true,
      overrideItemIsDirty: false,
      retainFocus: false,
      searchTerm: "",
      searchRequest: {},
      showCreateItemModal: false,
      selectedCollectionIds: [],
    };
  },
  methods: {
    ...mapActions("attributeList", {
      toggleCreateNewAttributeModal: "setDialogVisible",
    }),
    ...mapActions("itemGroups", ["upsertItemGroupItems"]),
    ...mapActions("itemTags", ["upsertItemTagItems"]),
    ...mapActions("selections", [
      "resetSelectionMode",
      "setDialogVisible",
      "setMappingCollectionItemValue",
    ]),
    ...mapActions("shoppingLists", ["upsertShoppingListItems"]),
    cancelEdit() {
      this.overrideItemIsDirty = true;
      this.closeModal();
    },
    async confirmAbandonForm() {
      let response = await this.$root.$confirm.open(
        "Discard changes?",
        `You have made changes to this item. Please click "Yes" to discard these changes, or "Cancel" to save your changes`,
        { color: "primary" }
      );
      if (response) {
        this.dismissUnsavedDataPrompt();
      } else {
        this.displayUnsavedDataPrompt = false;
      }
    },
    closeModal() {
      if (!this.overrideItemIsDirty)
        this.displayUnsavedDataPrompt = this.itemIsDirty;
      else this.displayUnsavedDataPrompt = false;

      if (this.displayUnsavedDataPrompt) this.confirmAbandonForm();

      if (!this.displayUnsavedDataPrompt) {
        this.overrideItemIsDirty = false;
        this.searchTerm = "";
        this.setDialogVisible(false);
      }
    },
    dismissUnsavedDataPrompt() {
      this.overrideItemIsDirty = true;
      this.closeModal();
    },
    saveSelection(createdAttribute) {
      let result = false;
      let saveRequest = [];
      let attrSelections = this.mappingCollection.filter((item) => {
        return item.isSelected;
      });

      // For "Create New Attribute" list item:
      if (createdAttribute !== null && createdAttribute.id > 0) {
        attrSelections.push(createdAttribute);
      }
      attrSelections.forEach((element) => {
        saveRequest.push({
          attributeId: element.id,
          items: this.selectionModeItems,
        });
      });
      var selectionRequest = {
        lists: saveRequest,
        bulkActionType: this.callToAction.actionType,
      };
      switch (this.callToAction.attributeType) {
        case this.enums.ATTRIBUTE_TYPE.SHOPPING_LIST:
          result = this.upsertShoppingListItems(selectionRequest);
          break;
        case this.enums.ATTRIBUTE_TYPE.TAG:
          result = this.upsertItemTagItems(selectionRequest);
          break;
        default:
          result = this.upsertItemGroupItems(selectionRequest);
          break;
      }
      if (result) {
        this.resetSelectionMode();
        this.closeModal();
      }
    },
    toggleAttributeValue(value) {
      this.setMappingCollectionItemValue(value);
    },
  },
  mounted() {
    this.searchRequest = {
      pagedCollection: {
        pageNumber: 1,
        pageSize: 25,
        collectionTotal: 500,
      },
      searchType: "",
      searchTerm: "",
      sortBy: this.enums.SORT_BY.NAME,
      sortAscending: true,
      idCollection: [],
    };
  },
};
</script>

<style lang="scss" scoped></style>
