<template>
  <div id="pagedCollectionSortingMenu-Container">
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
        >
          <v-icon v-on="on">mdi-sort</v-icon>
        </v-btn>
      </template>
      <v-list dense flat>
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
            <v-list-item-title>Sort By Items</v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon
              v-text="quantitySortIcon"
              :color="selectedItem(enums.SORT_BY.QUANTITY)"
              @click="toggleSort(enums.SORT_BY.QUANTITY)"
            ></v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import enumValues from "@/assets/configuration/enums";
export default {
  name: "ItemCallToActionMenu",
  props: {
    attributeType: { type: String, required: true },
    items: { type: Array, required: true },
    searchRequest: { type: Object },
  },
  data: () => ({
    dateSortAsc: true,
    nameSortAsc: true,
    quantitySortAsc: true,
    searchRequestValue: {},
  }),
  computed: {
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
  },
  methods: {
    ...mapActions("shoppingLists", ["fetchShoppingListsWithItemCounts"]),
    ...mapActions({
      groupFetchResults: "groups/fetchGroupsWithItemCounts",
      tagFetchResults: "tags/fetchTagsWithItemCounts",
    }),
    changeSortValue(eventArgs) {
      this.searchRequestValue.sortBy = eventArgs.sortBy;
      this.searchRequestValue.sortAscending = eventArgs.sortAscending;
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
        case this.enums.ATTRIBUTE_TYPE.SHOPPING_LIST:
          this.fetchShoppingListsWithItemCounts(this.searchRequestValue);
          break;
        default:
          this.groupFetchResults(this.searchRequestValue);
          break;
      }
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
