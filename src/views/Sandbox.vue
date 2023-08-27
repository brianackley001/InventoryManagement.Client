<template>
  <div id="ux-sandbox-container">
    <v-treeview
      :items="items"
      v-model="selections"
      value="selections"
      color="primary"
      selected-color="secondary"
      shaped
      hoverable
      selectable
      selection-type="leaf"
      item-key="treeNodeId"
    ></v-treeview>
    <v-btn
      fab
      color="secondary"
      fixed
      small
      bottom
      right
      class="menu-btn-cta-fixed-float"
      v-show="displaySaveButton"
      @click="toggleSaveModal"
    >
      <v-icon>mdi-application-import</v-icon>
    </v-btn>
    <v-dialog v-model="modalVisible" persistent retain-focus>
      <v-card>
        <v-card-text>
          <v-container>
            <v-row>
              <v-spacer></v-spacer>
              <v-btn icon small @click="toggleSaveModal()">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-row>
            <v-row>
              <v-col>
                <v-btn
                  x-small
                  class="item-detail-toolbar-btn"
                  fab
                  @click="saveItem"
                  color="secondary"
                >
                  <v-icon>mdi-content-save</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                >Import Stock Items ({{ this.selections.length }} items)
              </v-col>
            </v-row>
            <v-row>
              <v-col
                >Import current tree categorization tags? <br />
                <v-radio-group v-model="row" row>
                  <v-radio label="Yes" value="true"></v-radio>
                  <v-radio label="No" value="false"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import enumValues from "@/assets/configuration/enums";
// import stockItems from "@/assets/data/stockItems";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "UxSandbox",
  // components: {
  //   Menu,
  // },
  computed: {
    ...mapGetters({ items: "items/stockItems" }),
    enums: function () {
      return enumValues;
    },
    displaySaveButton: function () {
      return this.selections.length >= 1;
    },
  },
  data: () => ({
    attributeType: enumValues.ATTRIBUTE_TYPE.ITEM,
    modalVisible: false,
    row: "true",
    selections: [],
  }),
  methods: {
    ...mapActions("items", ["fetchStockItems"]),
    saveItem() {
      console.log("SAVED!");
      // this.showSuccessNotification(
      //   `${this.selections.length} items imported into inventory`
      // );
      this.selections = [];
      this.toggleSaveModal();
    },
    toggleSaveModal() {
      this.modalVisible = !this.modalVisible;
    },
  },
  mounted() {
    this.fetchStockItems();
    this.bulkSelected = [];
  },
};
</script>

<style lang="scss">
.v-tab {
  font-size: 10px;
}
.v-list-item__subtitle {
  font-size: 10px;
}
.menu-btn-cta-fixed-float {
  bottom: 57px !important;
}
.item-detail-toolbar-btn {
  margin-right: 18px;
}
</style>
