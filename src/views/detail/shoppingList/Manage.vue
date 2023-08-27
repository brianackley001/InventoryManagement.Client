<template>
  <div id="shopping-list-container">
    <v-row>
      <v-col cols="2">
        <v-btn fab small @click="navigateToOption" :disabled="checkoutDisabled">
          <v-icon small color="primary">mdi-cart</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="8">
        <div class="subtitle">{{ selectedShoppingListCollection }}</div>
      </v-col>
      <v-col cols="2">
        <Menu
          :attributeType="attributeType"
          :items="items"
          :searchRequest="searchRequest"
          :shoppingListId="parseInt($route.params.id)"
          @on-sort-value-change="changeSortValue"
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
    <List
      :items="items"
      :attributeType="attributeType"
      v-show="items.length > 0"
    />
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
    ...mapGetters("appState", ["loading"]),
    ...mapGetters("selections", ["selectionModeItems"]),
    ...mapGetters("session", ["groups"]),
    ...mapGetters("shoppingLists", ["items", "selectedShoppingListCollection"]),
    checkoutDisabled: function () {
      return this.items.length < 1;
    },
    enums: function () {
      return enumValues;
    },
  },
  data: () => ({
    attributeType: enumValues.ATTRIBUTE_TYPE.SHOPPING_LIST,
    searchRequest: {},
  }),
  methods: {
    ...mapActions("shoppingLists", [
      "fetchNameByShoppingListId",
      "fetchShoppingList",
      "setFilteredCheckoutCollection",
    ]),
    changeSortValue(eventValue) {
      // console.log(JSON.stringify(eventValue));
      this.searchRequest.sortAscending = eventValue.sortAscending;
      this.searchRequest.sortBy = eventValue.sortBy;
    },
    async navigateToOption() {
      if (this.selectionModeItems.length > 0) {
        let response = await this.$root.$confirm.open(
          "Clear Selected Items?",
          `You have ${this.selectionModeItems.length} items currently selected...do you wish to clear these selections and navigate away?`,
          { color: "primary" }
        );
        if (response) {
          this.setFilteredCheckoutCollection(this.items);
          this.$router.push({
            name: "checkout",
            params: { id: this.$route.params.id },
          });
        }
      } else {
        this.setFilteredCheckoutCollection(this.items);
        this.$router.push({
          name: "checkout",
          params: { id: this.$route.params.id },
        });
      }
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
    if (this.selectedShoppingListCollection == "") {
      this.fetchNameByShoppingListId(parseInt(this.$route.params.id));
      this.fetchShoppingList(this.searchRequest);
    }
  },
};
</script>
<style scoped></style>
