<template>
  <div id="home-container">
    <v-row>
      <v-col cols="10">
        <div class="subtitle"
          >{{ pagedCollection.collectionTotal }} Items Running Low...</div
        >
      </v-col>
      <v-col cols="2">
        <Menu
          :attributeType="attributeType"
          :items="items"
          :searchRequest="searchRequest"
          @onAddToShoppingList="addToShoppingList"
          @on-sort-value-change="changeSortValue"
        />
      </v-col>
    </v-row>
    <v-row v-show="!loading && items.length == 0">
      <v-col cols="10">
        <v-alert
          border="left"
          color="green"
          colored-border
          type="success"
          elevation="2"
        >
          There are currently no items less than fully stocked.
        </v-alert>
      </v-col>
    </v-row>
    <!-- <v-row v-show="items.length > 0">
    <v-col cols="10"> -->
    <List
      v-bind:items="items"
      :attributeType="attributeType"
      v-show="items.length > 0"
    />
    <!-- </v-col>
    </v-row> -->
    <v-footer
      fixed
      tile
      max-height="60px"
      color="white"
      v-show="items.length > 0"
      padless
    >
      <v-col cols="12">
        <v-pagination
          v-model="currentPage"
          color="blue-grey darken-1"
          :length="paginationLength"
          @input="pageInput"
        ></v-pagination>
      </v-col>
    </v-footer>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import List from "@/components/listItems/List.vue";
import Menu from "@/components/menus/itemsByAttribute/Menu.vue";
import enumValues from "@/assets/configuration/enums";

export default {
  name: "Home",
  components: {
    List,
    Menu,
  },
  computed: {
    ...mapGetters("search", ["items", "pageSize", "pagedCollection"]),
    ...mapGetters("appState", ["loading"]),
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
    attributeType: enumValues.ATTRIBUTE_TYPE.ITEM,
    currentPage: 1,
    searchRequest: {},
  }),
  methods: {
    ...mapActions("search", ["fetchLowQuantityItems"]),
    ...mapActions("appState", ["toggleLoadingState"]),
    addToShoppingList() {
      console.log(
        "...PARENT addSelectedItemsToShoppingList() event emitted..."
      );
    },
    assembleRequest() {
      return {
        pagedCollection: {
          pageNumber: this.currentPage,
          pageSize: this.pageSize,
          collectionTotal: this.pagedCollection.collectionTotal,
        },
        searchType: "",
        searchTerm: "",
        sortBy: this.enums.SORT_BY.QUANTITY,
        sortAscending: true,
      };
    },
    changeSortValue(eventValue) {
      this.searchRequest.sortAscending = eventValue.sortAscending;
      this.searchRequest.sortBy = eventValue.sortBy;
    },
    initPage() {
      (async () => {
        this.searchRequest = this.assembleRequest();
        await this.fetchLowQuantityItems(this.searchRequest);
        this.toggleLoadingState(false);
      })();
    },
    pageInput(value) {
      this.currentPage = value;
      this.searchRequest.pagedCollection.pageNumber = this.currentPage;
      this.searchRequest.pagedCollection.pageSize = this.pageSize;
      this.searchRequest.pagedCollection.collectionTotal = this.pagedCollection.collectionTotal;
      this.fetchLowQuantityItems(this.searchRequest);
    },
  },
  mounted() {
    this.toggleLoadingState(true);
    this.initPage();
  },
};
</script>
