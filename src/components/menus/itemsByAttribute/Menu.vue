<template>
  <div id="calltToActionMenu-Container">
    <v-menu top offset-y transition="scale-transition">
      <template v-slot:activator="{ on }">
        <v-btn
          fab
          color="secondary"
          fixed
          small
          bottom
          right
          class="menu-btn-cta-fixed-float"
          ><v-badge
            color="primary"
            right
            :content="selectionModeItems.length"
            :value="selectionModeItems.length"
          >
            <v-icon
              v-on="on"
              v-text="selectionMode ? 'mdi-check-circle-outline' : 'mdi-sort'"
            ></v-icon>
          </v-badge>
        </v-btn>
      </template>
      <v-list dense flat>
        <v-list-item @click="launchEditModal" v-show="showEditMenuItem">
          <v-list-item-icon>
            <v-icon>mdi-pencil</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Edit {{ attributeTitleText }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider v-show="showEditMenuItem"></v-divider>
        <v-list-item>
          <v-list-item-icon
            @click="
              changeSortValue({
                sortBy: enums.SORT_BY.DATE,
                sortAscending: dateSortAsc,
              })
            "
          >
            <v-icon :color="selectedItem(enums.SORT_BY.DATE)"
              >mdi-calendar</v-icon
            >
          </v-list-item-icon>
          <v-list-item-content
            @click="
              changeSortValue({
                sortBy: enums.SORT_BY.DATE,
                sortAscending: dateSortAsc,
              })
            "
          >
            <v-list-item-title>Sort By Date</v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon
              v-text="dateSortIcon"
              :color="selectedItem(enums.SORT_BY.DATE)"
              @click="toggleSort(enums.SORT_BY.DATE)"
            ></v-icon>
          </v-list-item-icon>
        </v-list-item>
        <v-list-item>
          <v-list-item-icon
            @click="
              changeSortValue({
                sortBy: enums.SORT_BY.NAME,
                sortAscending: nameSortAsc,
              })
            "
          >
            <v-icon :color="selectedItem(enums.SORT_BY.NAME)"
              >mdi-format-color-text</v-icon
            >
          </v-list-item-icon>
          <v-list-item-content
            @click="
              changeSortValue({
                sortBy: enums.SORT_BY.NAME,
                sortAscending: nameSortAsc,
              })
            "
          >
            <v-list-item-title>Sort By Name</v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon
              v-text="nameSortIcon"
              :color="selectedItem(enums.SORT_BY.NAME)"
              @click="toggleSort(enums.SORT_BY.NAME)"
            ></v-icon>
          </v-list-item-icon>
        </v-list-item>
        <v-list-item>
          <v-list-item-icon
            @click="
              changeSortValue({
                sortBy: enums.SORT_BY.QUANTITY,
                sortAscending: quantitySortAsc,
              })
            "
          >
            <v-icon :color="selectedItem(enums.SORT_BY.QUANTITY)"
              >mdi-gauge-low</v-icon
            >
          </v-list-item-icon>
          <v-list-item-content
            @click="
              changeSortValue({
                sortBy: enums.SORT_BY.QUANTITY,
                sortAscending: quantitySortAsc,
              })
            "
          >
            <v-list-item-title>Sort By Quantity</v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon
              v-text="quantitySortIcon"
              :color="selectedItem(enums.SORT_BY.QUANTITY)"
              @click="toggleSort(enums.SORT_BY.QUANTITY)"
            ></v-icon>
          </v-list-item-icon>
        </v-list-item>
        <v-divider v-show="selectionMode"></v-divider>
        <v-list-item
          @click="
            editSelectedItemsAttribute(
              enums.SELECTION_ACTION.ADD,
              enums.ATTRIBUTE_TYPE.SHOPPING_LIST
            )
          "
          v-show="showAddToShoppingList"
        >
          <v-list-item-icon>
            <v-icon>mdi-cart-plus</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Add to Shopping List</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-show="selectionMode"
          @click="
            editSelectedItemsAttribute(
              enums.SELECTION_ACTION.ADD,
              enums.ATTRIBUTE_TYPE.GROUP
            )
          "
        >
          <v-list-item-icon>
            <v-icon>mdi-group</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Add to Group</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-show="selectionMode"
          @click="
            editSelectedItemsAttribute(
              enums.SELECTION_ACTION.ADD,
              enums.ATTRIBUTE_TYPE.TAG
            )
          "
        >
          <v-list-item-icon>
            <v-icon>mdi-tag</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Add to Tag</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider v-show="selectionMode"></v-divider>
        <v-list-item v-show="selectionMode" @click="resetSelectionMode()">
          <v-list-item-icon>
            <v-icon>mdi-close-box-multiple-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Clear Selected</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
    <selectionCallToActionModal />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import utils from "@/utils/attributeListItem";
import enumValues from "@/assets/configuration/enums";
import selectionCallToActionModal from "@/components/modals/SelectionCallToAction.vue";
export default {
  name: "ItemCallToActionMenu",
  props: {
    attributeType: { type: String, required: true },
    items: { type: Array, required: true },
    searchRequest: { type: Object },
    shoppingListId: { type: Number },
  },
  components: { selectionCallToActionModal },
  data: () => ({
    dateSortAsc: true,
    nameSortAsc: true,
    quantitySortAsc: true,
    searchRequestValue: {},
  }),
  computed: {
    ...mapGetters("selections", ["selectionMode", "selectionModeItems"]),
    ...mapGetters("session", ["groups", "shoppingLists", "tags"]),
    attributeTitleText: function () {
      return utils.getAttributeTypeDisplayName(this.attributeType);
    },
    dateSortIcon: function () {
      return this.dateSortAsc
        ? "mdi-sort-numeric-ascending"
        : "mdi-sort-numeric-descending";
    },
    enums: function () {
      return enumValues;
    },
    nameSortIcon: function () {
      return this.nameSortAsc
        ? "mdi-sort-alphabetical-ascending"
        : "mdi-sort-alphabetical-descending";
    },
    quantitySortIcon: function () {
      return this.quantitySortAsc
        ? "mdi-sort-numeric-ascending"
        : "mdi-sort-numeric-descending";
    },
    showAddToShoppingList: function () {
      return (
        this.selectionMode &&
        this.attributeType != this.enums.ATTRIBUTE_TYPE.SHOPPING_LIST
      );
    },
    showEditMenuItem: function () {
      return (
        this.attributeType != this.enums.ATTRIBUTE_TYPE.ITEM &&
        this.attributeType != this.enums.ATTRIBUTE_TYPE.SEARCH
      );
    },
    showRemoveFromShoppingList: function () {
      return (
        this.selectionMode &&
        this.attributeType == this.enums.ATTRIBUTE_TYPE.SHOPPING_LIST
      );
    },
  },
  methods: {
    ...mapActions("attributeList", [
      "resetAttributeItem",
      "setAttributeType",
      "setDialogEditMode",
      "setItem",
      "setItemTypeTitle",
    ]),
    ...mapActions("selections", [
      "resetSelectionMode",
      "setCallToAction",
      "setMappingCollection",
    ]),
    ...mapActions("shoppingLists", ["fetchShoppingList"]),
    ...mapActions({
      groupFetchResults: "groups/fetchSearchResults",
      itemFetchResults: "items/fetchSearchResults",
      launchAttributeModal: "attributeList/setDialogVisible",
      launchSelectionsCTAModal: "selections/setDialogVisible",
      tagFetchResults: "tags/fetchSearchResults",
    }),
    ...mapActions("search", ["fetchLowQuantityItems", "fetchSearchResults"]),
    editSelectedItemsAttribute(actionType, attributeType) {
      this.setCallToAction({
        actionType: actionType,
        attributeType: attributeType,
      });
      let collection = null;
      switch (attributeType) {
        case this.enums.ATTRIBUTE_TYPE.SHOPPING_LIST:
          collection = this.highlightRemovalAttribute(
            actionType,
            this.shoppingLists
          );
          this.setMappingCollection(collection);
          break;
        case this.enums.ATTRIBUTE_TYPE.TAG:
          collection = this.highlightRemovalAttribute(actionType, this.tags);
          this.setMappingCollection(collection);
          break;
        default:
          collection = this.highlightRemovalAttribute(actionType, this.groups);
          this.setMappingCollection(collection);
          break;
      }
      this.launchSelectionsCTAModal(true);
    },
    changeSortValue(eventArgs) {
      this.searchRequestValueValue.sortBy = eventArgs.sortBy;
      this.searchRequestValueValue.sortAscending = eventArgs.sortAscending;
      // update paged collection in store
      this.dispatchSortRequest();
      // emit values to synchronize parent component
      this.$emit("on-sort-value-change", eventArgs);
    },
    dispatchSortRequest() {
      switch (this.attributeType) {
        case this.enums.ATTRIBUTE_TYPE.TAG:
          this.tagFetchResults(this.searchRequestValue);
          break;
        case this.enums.ATTRIBUTE_TYPE.GROUP:
          this.groupFetchResults(this.searchRequestValue);
          break;
        case this.enums.ATTRIBUTE_TYPE.SEARCH:
          this.fetchSearchResults(this.searchRequestValue);
          break;
        case this.enums.ATTRIBUTE_TYPE.SHOPPING_LIST:
          this.fetchShoppingList(this.searchRequestValue);
          break;
        default:
          if (this.$route.name == "home") {
            this.fetchLowQuantityItems(this.searchRequestValue);
          } else {
            this.itemFetchResults(this.searchRequestValue);
          }
          break;
      }
    },
    highlightRemovalAttribute(actionType, collection) {
      collection = JSON.parse(JSON.stringify(collection));
      if (actionType === this.enums.SELECTION_ACTION.REMOVE) {
        const elementsIndex = collection.findIndex(
          (element) => element.id == this.$route.params.id
        );
        let updatedArray = [...collection];
        updatedArray[elementsIndex] = {
          ...updatedArray[elementsIndex],
          isSelected: true,
        };
        const selectedItem = updatedArray[elementsIndex];
        updatedArray.splice(elementsIndex, 1);
        updatedArray.unshift(selectedItem);
        collection = updatedArray;
      }
      return collection;
    },
    launchEditModal() {
      let currentItem = [];
      switch (this.attributeType) {
        case this.enums.ATTRIBUTE_TYPE.SHOPPING_LIST:
          currentItem = this.shoppingLists.filter((sl) => {
            return sl.id == this.$route.params.id;
          });
          break;
        case this.enums.ATTRIBUTE_TYPE.TAG:
          currentItem = this.tags.filter((t) => {
            return t.id == this.$route.params.id;
          });
          break;
        default:
          currentItem = this.groups.filter((g) => {
            return g.id == this.$route.params.id;
          });
      }
      this.resetAttributeItem();
      this.setAttributeType(this.attributeType);
      this.setDialogEditMode(true);
      this.setItem(currentItem[0]);
      this.setItemTypeTitle(
        utils.getAttributeTypeDisplayName(this.attributeType)
      );
      this.launchAttributeModal(true);
    },
    selectedItem(itemSortType) {
      return this.searchRequestValue.sortBy === itemSortType ? "info" : "";
    },
    toggleSort(sortBy) {
      switch (sortBy) {
        case this.enums.SORT_BY.NAME:
          this.nameSortAsc = !this.nameSortAsc;
          this.searchRequestValue.sortBy = this.enums.SORT_BY.NAME;
          this.searchRequestValue.sortAscending = this.nameSortAsc;
          // emit values to synchronize parent component
          this.changeSortValue({
            sortBy: this.searchRequestValue.sortBy,
            sortAscending: this.searchRequestValue.sortAscending,
          });
          break;
        case this.enums.SORT_BY.DATE:
          this.dateSortAsc = !this.dateSortAsc;
          this.searchRequestValue.sortBy = this.enums.SORT_BY.DATE;
          this.searchRequestValue.sortAscending = this.dateSortAsc;
          // emit values to synchronize parent component
          this.changeSortValue({
            sortBy: this.searchRequestValue.sortBy,
            sortAscending: this.searchRequestValue.sortAscending,
          });
          break;
        default:
          this.quantitySortAsc = !this.quantitySortAsc;
          this.searchRequestValue.sortBy = this.enums.SORT_BY.QUANTITY;
          this.searchRequestValue.sortAscending = this.quantitySortAsc;
          // emit values to synchronize parent component
          this.changeSortValue({
            sortBy: this.searchRequestValue.sortBy,
            sortAscending: this.searchRequestValue.sortAscending,
          });
          break;
      }
    },
  },
  watch: {
    searchRequest: function () {
      this.searchRequestValue = this.searchRequest;
    },
  },
};
</script>

<style lang="scss" scoped>
.menu-btn-cta-fixed-float {
  bottom: 57px !important;
}
</style>
