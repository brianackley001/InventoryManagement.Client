<template>
  <v-dialog
    v-model="showCheckoutFilterModal"
    fullscreen
    hide-overlay
    persistent
  >
    <v-card>
      <v-card-title>
        <span class="subtitle-2"
          >Filter "{{ selectedShoppingListCollection }}" Items</span
        >
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row
            align="center"
            v-show="
              itemAttributeCollection.groups &&
              itemAttributeCollection.groups.length > 1
            "
          >
            <v-col cols="12">
              <v-select
                v-model="filteringCriteria.groups"
                :items="itemAttributeCollection.groups"
                item-text="name"
                item-value="id"
                label="Filter by Groups"
                multiple
                chips
              ></v-select>
            </v-col>
          </v-row>
          <v-row
            align="center"
            v-show="
              itemAttributeCollection.tags &&
              itemAttributeCollection.tags.length > 1
            "
          >
            <v-col cols="12">
              <v-select
                v-model="filteringCriteria.tags"
                :items="itemAttributeCollection.tags"
                item-text="name"
                item-value="id"
                label="Filter by Tags"
                multiple
                chips
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6"
              ><v-switch
                v-model="sortFilterByTag"
                label="Sort By Tags"
              ></v-switch>
            </v-col>
            <v-col cols="6"
              ><v-switch
                v-model="filteringCriteria.sortByAsc"
                label="Sort Ascending"
              ></v-switch>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeModal">Close</v-btn>
        <v-btn color="blue darken-1" outlined rounded @click="applyFilter">
          <v-icon>mdi-filter-variant</v-icon> Apply
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import enumValues from "@/assets/configuration/enums";
import utils from "@/utils/filterCheckout";
export default {
  name: "FilterCheckoutModal",
  computed: {
    ...mapGetters("shoppingLists", [
      "filteredCheckoutItems",
      "items",
      "itemAttributeCollection",
      "selectedShoppingListCollection",
      "showCheckoutFilterModal",
    ]),
    enums: function () {
      return enumValues;
    },
    sortFilterByTag: {
      get: function () {
        return (
          this.filteringCriteria.sortByAttribute ==
          this.enums.ATTRIBUTE_TYPE.TAG
        );
      },
      set: function (value) {
        this.filteringCriteria.sortByAttribute = value
          ? this.enums.ATTRIBUTE_TYPE.TAG
          : this.enums.ATTRIBUTE_TYPE.GROUP;
      },
    },
  },
  data: () => ({
    filteringCriteria: {
      groups: [],
      tags: [],
      sortByAttribute: enumValues.ATTRIBUTE_TYPE.TAG,
      sortByAsc: true,
    },
  }),
  methods: {
    ...mapActions("shoppingLists", [
      "setFilteredCheckoutCollection",
      "setItemFilters",
      "toggleCheckoutFilterModal",
    ]),
    ...mapActions("tags", ["upsertTag"]),
    applyFilter() {
      let filteredResults = utils.applyFilteringCriteria(
        this.filteringCriteria,
        this.items
      );
      let itemFilters = utils.mapFilterObjects(
        this.filteringCriteria,
        this.itemAttributeCollection
      );

      if (filteredResults.length == 0) {
        this.setFilteredCheckoutCollection(this.items);
      } else {
        this.setFilteredCheckoutCollection(filteredResults);
      }
      this.setItemFilters(itemFilters);

      this.toggleCheckoutFilterModal(false);
    },
    closeModal() {
      this.toggleCheckoutFilterModal(false);
    },
  },
};
</script>
