<template>
  <v-main>
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <AppBar />
        </v-col>
      </v-row>
      <v-row v-show="!loading && items.length == 0">
        <v-col cols="12">
          <v-alert border="left" colored-border type="warning" elevation="2">
            Zero items associated with Shopping List "{{
              selectedShoppingListCollection
            }}"
          </v-alert>
        </v-col>
      </v-row>
      <v-row v-show="items.length > 0">
        <v-col cols="10">
          <v-subheader>{{ selectedShoppingListCollection }}</v-subheader>
          <v-subheader v-show="listIsFiltered">{{
            currentFilteringLabel
          }}</v-subheader>
          <span v-show="listIsFiltered">
            <v-chip
              v-for="(i, index) in collectionItems"
              v-bind:item="i"
              :key="index"
              class="ma-1"
              small
              @click="launchModal"
              ><v-icon left x-small>{{ chipIcon }}</v-icon
              >{{ i.name }}</v-chip
            >
          </span>
          <List :items="filteredCheckoutItems" />
        </v-col>
        <v-col cols="2">
          <v-btn
            fab
            text
            medium
            fixed
            top
            right
            class="menu-btn-cta-fixed-float"
            @click="launchModal"
          >
            <v-icon>mdi-filter-variant</v-icon>
          </v-btn></v-col
        >
      </v-row>
      <FilterModal />
    </v-container>
  </v-main>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import enumValues from "@/assets/configuration/enums";
import AppBar from "@/components/navigation/CheckoutAppBar.vue";
import FilterModal from "@/components/modals/FilterCheckout.vue";
import List from "@/components/listItems/CheckoutShoppingList.vue";
import { hubConnection } from "@/plugins/ws-message-hub.js";
export default {
  name: "ShoppingListCheckout",
  components: { AppBar, FilterModal, List },
  computed: {
    ...mapGetters("appState", ["loading"]),
    ...mapGetters("auth", ["session"]),
    ...mapGetters("selections", ["selectionModeItems"]),
    ...mapGetters("session", ["groups", "shoppingLists", "tags"]),
    ...mapGetters("shoppingLists", [
      "checkoutInProgress",
      "filteredCheckoutItems",
      "itemAttributeCollection",
      "itemFilters",
      "items",
      "selectedShoppingListCollection",
      "syncedCheckoutSuccessMessage",
    ]),
    collectionItems: function () {
      if (this.listIsFiltered) return this.itemFilters.items;
      return [];
    },
    currentFilteringLabel: function () {
      let label = "Filtered by Tags:";

      if (this.listIsFiltered) {
        label =
          this.itemFilters.type == this.enums.ATTRIBUTE_TYPE.GROUP
            ? "Filtered by Groups:"
            : "Filtered by Tags:";
      }

      return label;
    },
    enums: function () {
      return enumValues;
    },
    chipIcon: function () {
      return this.listIsFiltered
        ? this.itemFilters.type == this.enums.ATTRIBUTE_TYPE.GROUP
          ? "mdi-group"
          : "mdi-tag"
        : "";
    },
    listIsFiltered: function () {
      return this.itemFilters && this.itemFilters.items.length > 0;
    },
    shoppingListId: function () {
      return parseInt(this.$route.params.id);
    },
  },
  data: function () {
    return {
      attributeType: enumValues.ATTRIBUTE_TYPE.SHOPPING_LIST,
      completed: 0,
      fallbackHydrationCheck: false,
      hubConnection: hubConnection,
      searchRequest: {},
      syncHub: {},
    };
  },
  methods: {
    ...mapActions("appState", ["toggleAppLoadingStatus"]),
    ...mapActions("shoppingLists", [
      "fetchItemAttributeCollection",
      "fetchShoppingList",
      "initCheckout",
      "setCheckoutInProgress",
      "setFilteredCheckoutCollection",
      "setSelectedShoppingListCollection",
      "syncCheckoutItem",
      "syncShoppingList",
      "toggleCheckoutFilterModal",
    ]),
    launchModal() {
      this.fetchItemAttributeCollection();
      this.toggleCheckoutFilterModal(true);
    },
    refreshCheckoutCollection(shoppingListId) {
      if (this.shoppingListId == shoppingListId) {
        this.syncShoppingList(shoppingListId);
      }
    },
    async syncCheckoutListItem(listItem) {
      await this.syncCheckoutItem(listItem);
      this.hubConnection.invoke("SyncShoppingListCheckout", {
        shoppingListId: this.shoppingListId,
        message: `Sync Shopping List Item - ${this.shoppingListId}`,
      });
    },
    syncCheckoutCompleteAction(shoppingListId) {
      if (this.shoppingListId == shoppingListId) {
        this.hubConnection.invoke("SyncShoppingListCheckoutCompleted", {
          shoppingListId: this.shoppingListId,
          message: this.syncedCheckoutSuccessMessage,
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
      idCollection: [this.shoppingListId],
    };

    if (this.selectedShoppingListCollection === "") {
      let selectedList = this.shoppingLists.filter((item) => {
        return item.id == this.shoppingListId;
      });
      this.setSelectedShoppingListCollection(selectedList.name);
      if (!this.fallbackHydrationCheck) {
        this.fetchShoppingList(this.searchRequest);
        this.fallbackHydrationCheck = true;
      }
    }
    // ensure checkout  has been initialized...
    if (!this.checkoutInProgress) {
      this.initCheckout();
      // sync items that may have been affected by another user on init:
      this.syncShoppingList(this.shoppingListId);
    }
  },
  created() {
    this.$eventHub.$on("checkout-completed", this.syncCheckoutCompleteAction);
    this.$eventHub.$on(
      "sync-shopping-list-checkout-item",
      this.refreshCheckoutCollection
    );
    this.$eventHub.$on("toggle-checkout-list-item", this.syncCheckoutListItem);
  },
  beforeDestroy() {
    // Make sure to cleanup SignalR event handlers when removing the component
    this.$eventHub.$off("checkout-completed");
    this.$eventHub.$off("sync-shopping-list-checkout-item");
    this.$eventHub.$off("toggle-checkout-list-item");
  },
};
</script>
<style scoped>
.menu-btn-cta-fixed-float {
  top: 72px !important;
}
</style>
