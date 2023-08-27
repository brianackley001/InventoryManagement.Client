<template>
  <div id="search-results-container">
    <v-row>
      <v-col cols="10">
        <div class="title py-3"
          >{{ pagedCollection.collectionTotal }} Items with Group: "{{
            selectedGroupCollection
          }}"</div
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
        <v-alert border="left" colored-border type="warning" elevation="2">
          Zero items associated with Group "{{ selectedGroupCollection }}"
        </v-alert>
      </v-col>
    </v-row>
    <List
      :items="items"
      :attributeType="attributeType"
      v-show="items.length > 0"
    />
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
  name: "GroupItems",
  components: { List, Menu },
  computed: {
    ...mapGetters("groups", [
      "items",
      "pageSize",
      "pagedCollection",
      "selectedGroupCollection",
    ]),
    ...mapGetters("session", ["groups"]),
    ...mapGetters("appState", ["loading"]),
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
    attributeType: enumValues.ATTRIBUTE_TYPE.GROUP,
    searchRequest: {},
  }),
  methods: {
    ...mapActions("groups", [
      "fetchNameByGroupId",
      "fetchSearchResults",
      "setCurrentPage",
    ]),
    addToShoppingList() {
      console.log(
        "...PARENT addSelectedItemsToShoppingList() event emitted..."
      );
    },
    changeSortValue(eventValue) {
      // console.log(JSON.stringify(eventValue));
      this.searchRequest.sortAscending = eventValue.sortAscending;
      this.searchRequest.sortBy = eventValue.sortBy;
    },
    pageInput(value) {
      this.currentPage = this.searchRequest.pagedCollection.pageNumber = value;
      this.fetchSearchResults(this.searchRequest);
    },
  },
  mounted() {
    this.searchRequest = {
      pagedCollection: {
        pageNumber: this.currentPage,
        pageSize: this.pageSize,
        collectionTotal: this.pagedCollection.collectionTotal,
      },
      searchType: "",
      searchTerm: "",
      sortBy: this.enums.SORT_BY.NAME,
      sortAscending: true,
      idCollection: [parseInt(this.$route.params.id)],
    };
    if (this.selectedGroupCollection == "") {
      this.fetchNameByGroupId(parseInt(this.$route.params.id));
      this.fetchSearchResults(this.searchRequest);
    }
  },
};
</script>
