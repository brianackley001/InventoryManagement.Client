<template>
  <div id="groups-management-container">
    <v-row v-show="!loading && pagedCollection.collectionTotal == 0">
      <v-col>
        <v-alert border="left" colored-border type="warning" elevation="2">
          There are no existing shopping lists... please create a new group in
          order to attribute a shopping list to any of the items in your
          inventory.
        </v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="10">
        <div class="subtitle"
          >Shopping Lists ({{ pagedCollection.collectionTotal }})</div
        >
      </v-col>
      <v-col cols="2">
        <SortMenu
          :attributeType="enums.ATTRIBUTE_TYPE.SHOPPING_LIST"
          :items="items"
          :searchRequest="searchRequest"
          @on-sort-value-change="changeSortValue"
        />
      </v-col>
    </v-row>

    <v-list v-show="!loading && pagedCollection.collectionTotal > 0">
      <ListItem
        v-for="(i, index) in items"
        :item="i"
        :key="index"
        :attributeType="enums.ATTRIBUTE_TYPE.SHOPPING_LIST"
      />
    </v-list>
    <v-footer
      fixed
      tile
      max-height="60px"
      color="white"
      v-show="pagedCollection.collectionTotal > pagedCollection.pageSize"
      padless
    >
      <v-col cols="12">
        <v-pagination
          v-model="currentPage"
          color="primary"
          :length="paginationLength"
          @input="pageInput"
        ></v-pagination>
      </v-col>
    </v-footer>
    <UpsertAttributeModal
      :showDialog="dialogVisible"
      :attributeType="enums.ATTRIBUTE_TYPE.SHOPPING_LIST"
      attributeTypeTitle="Shopping List"
      :createMode="dialogCreateMode"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import enumValues from "@/assets/configuration/enums";
import ListItem from "@/components/listItems/AttributeManagement.vue";
import SortMenu from "@/components/menus/attributeManagement/Menu.vue";
import UpsertAttributeModal from "@/components/modals/UpsertAttributeItem.vue";

export default {
  name: "Groups",
  components: { ListItem, SortMenu, UpsertAttributeModal },
  computed: {
    ...mapGetters("appState", ["loading"]),
    ...mapGetters("attributeList", ["dialogVisible", "dialogCreateMode"]),
    ...mapGetters("shoppingLists", ["items", "pageSize", "pagedCollection"]),
    currentPage: {
      get: function () {
        return this.pagedCollection.pageNumber;
      },
      set: function (newValue) {
        this.setCurrentPage(newValue);
      },
    },
    enums: function () {
      return enumValues;
    },
    paginationLength: function () {
      return this.pagedCollection.collectionTotal <= this.pageSize
        ? 1
        : Math.ceil(this.pagedCollection.collectionTotal / this.pageSize);
    },
  },
  data: () => ({
    searchRequest: {},
  }),
  methods: {
    ...mapActions("attributeList", ["setDialogVisible"]),
    ...mapActions("shoppingLists", [
      "fetchShoppingListsWithItemCounts",
      "setCurrentPage",
    ]),
    changeSortValue(eventValue) {
      this.searchRequest.sortAscending = eventValue.sortAscending;
      this.searchRequest.sortBy = eventValue.sortBy;
    },
    pageInput(value) {
      this.currentPage = this.searchRequest.pagedCollection.pageNumber = value;
      this.fetchShoppingListsWithItemCounts(this.searchRequest);
    },
    refreshPagedCollection(result) {
      if (result && result.id > 0) {
        this.pageInput(this.currentPage);
      }
    },
  },
  mounted() {
    this.searchRequest = {
      pagedCollection: {
        pageNumber: 1,
        pageSize: this.pageSize,
        collectionTotal: this.pagedCollection.collectionTotal,
      },
      searchType: "",
      searchTerm: "",
      sortBy: this.enums.SORT_BY.NAME,
      sortAscending: true,
      idCollection: [],
    };
    this.fetchShoppingListsWithItemCounts(this.searchRequest);
  },
  created() {
    this.$eventHub.$on(
      "on-upsert-shopping-list-attribute-completed",
      this.refreshPagedCollection
    );
  },
  beforeDestroy() {
    this.$eventHub.$off("on-upsert-shopping-list-attribute-completed");
  },
};
</script>
