<template>
  <div id="shopping-list-container">
    <v-row>
      <v-col cols="1">
        <v-icon small>mdi-cart</v-icon>
      </v-col>
      <v-col cols="9">
        <div class="subtitle">{{ selectedShoppingListCollection }}</div>
      </v-col>
      <v-col cols="2">
        <Menu
          :attributeType="attributeType"
          :items="items"
          :searchRequest="searchRequest"
          :shoppingListId="$route.params.id"
          @on-sort-value-change="changeSortValue"
          @onRemoveShoppingList="removeFromShoppingList"
        />
      </v-col>
    </v-row>
    <v-row v-show="!loading && items.length == 0">
      <v-col cols="10">
        <v-alert border="left" colored-border type="warning" elevation="2">
          Zero items associated with Shopping List "{{
            selectedShoppingListCollection
          }}"
        </v-alert>
      </v-col>
    </v-row>
    <v-row v-show="items.length > 0">
      <v-col cols="10">
        <List :items="items" :attributeType="attributeType" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import List from "@/components/listItems/List.vue";
import Menu from "@/components/menus/itemsByAttribute/Menu.vue";
import enumValues from "@/assets/configuration/enums";
export default {
  name: "ShoppingListItems",
  components: { List, Menu },
  computed: {
    ...mapGetters("shoppingLists", ["items", "selectedShoppingListCollection"]),
    ...mapGetters("session", ["groups"]),
    ...mapGetters("appState", ["loading"]),
    enums: function () {
      return enumValues;
    },
  },
  data: () => ({
    attributeType: enumValues.ATTRIBUTE_TYPE.SHOPPING_LIST,
    searchRequest: {},
  }),
  methods: {
    ...mapActions("shoppingLists", ["fetchShoppingList"]),
    changeSortValue(eventValue) {
      // console.log(JSON.stringify(eventValue));
      this.searchRequest.sortAscending = eventValue.sortAscending;
      this.searchRequest.sortBy = eventValue.sortBy;
    },
    removeFromShoppingList() {
      console.log("...PARENT removeFromShoppingList() event emitted...");
    },
  },
  mounted() {
    this.searchRequest = {
      pagedCollection: {
        pageNumber: this.currentPage,
        pageSize: this.pageSize,
        collectionTotal: 500,
      },
      searchType: "",
      searchTerm: "",
      sortBy: this.enums.SORT_BY.NAME,
      sortAscending: true,
      idCollection: [parseInt(this.$route.params.id)],
    };
  },
};
</script>
