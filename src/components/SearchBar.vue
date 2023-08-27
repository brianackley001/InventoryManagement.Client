<template>
  <v-text-field
    v-model="searchTerm"
    placeholder="Find"
    autocomplete="off"
    single-line
    clearable
    hide-details
    outlined
    ref="searchBox"
    dense
    :class="formBoxCssClass"
    @blur="formBlur()"
    @focus="formFocus()"
    :clear-icon-cb="onClearClicked"
    id="app-bar-search-text-box"
  >
    <template slot="append">
      <v-btn
        dark
        fab
        x-small
        color="blue-grey lighten-2"
        v-show="showSearchBtn"
        @click="submitForm()"
        class="btn-fab-search"
      >
        <v-icon dark class="btn-search-icon">mdi-magnify</v-icon>
      </v-btn>
    </template>
  </v-text-field>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "SearchBox",
  computed: {
    formBoxCssClass: function () {
      return this.formInputClass;
    },
    showSearchBtn: function () {
      return this.showSearchButton;
    },
    ...mapGetters("search", ["pageSize"]),
  },
  data: () => ({
    formInputClass: "minimized-form-box",
    hiddenSearchTerm: null,
    searchTerm: null,
    showSearchButton: false,
  }),
  methods: {
    ...mapActions("appState", [
      "setSettingsIconVisibility",
      "toggleLoadingState",
    ]),
    ...mapActions("search", ["fetchSearchResults"]),
    formBlur() {
      if (this.searchTerm && this.searchTerm.length > 0) {
        this.hiddenSearchTerm = this.searchTerm;
        this.searchTerm = null;
      }
      this.formInputClass = "minimized-form-box";
      this.setSettingsIconVisibility(true);
      this.showSearchButton = false;
    },
    formFocus() {
      this.formInputClass = "expanded-form-box";
      let visibilityValue =
        this.$vuetify.breakpoint.name == "lg" ||
        this.$vuetify.breakpoint.name == "xl";
      this.setSettingsIconVisibility(visibilityValue);
      this.showSearchButton = true;
      if (
        this.hiddenSearchTerm &&
        this.hiddenSearchTerm.length > 0 &&
        this.searchTerm == null
      ) {
        this.searchTerm = this.hiddenSearchTerm;
        this.hiddenSearchTerm = null;
      }
    },
    onClearClicked() {
      this.searchTerm = null;
      this.hiddenSearchTerm = null;
    },
    submitForm() {
      this.$store.dispatch("search/setSearchTerm", this.searchTerm);
      this.toggleLoadingState(true);
      this.$refs["searchBox"].blur();

      let searchRequest = {
        pagedCollection: {
          pageNumber: 1,
          pageSize: this.pageSize,
          collectionTotal: 10,
        },
        searchType: "",
        searchTerm: this.searchTerm,
      };

      this.fetchSearchResults(searchRequest);
      this.onClearClicked();

      if (this.$route.name !== "search-results") {
        this.searchTerm = null;
        this.$router.push({
          name: "search-results",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.minimized-form-box {
  flex: 0 1 150px;
}
@media only screen and (max-width: 600px) {
  .expanded-form-box {
    width: 85%;
  }
}
@media only screen and (min-width: 768px) {
  .expanded-form-box v-text-field {
    width: 400px;
  }
}
.btn-search-icon {
  height: 14px !important;
  font-size: 14px !important;
  width: 14px !important;
}
.btn-fab-search {
  height: 24px !important;
  font-size: 24px !important;
  width: 24px !important;
}
</style>
