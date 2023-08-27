<template>
  <div id="ux-sandbox-container">
    <v-treeview
      :items="items"
      v-model="selections"
      value="selections"
      color="primary"
      selected-color="secondary"
      hoverable
      selectable
      selection-type="leaf"
      item-key="treeNodeId"
      return-object
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
                  @click="importItems"
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
                <v-radio-group v-model="associateDefaultTags" row>
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
import { mapActions, mapGetters } from "vuex";

export default {
  name: "StockItems",
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
    associateDefaultTags: "true",
    attributeType: enumValues.ATTRIBUTE_TYPE.ITEM,
    modalVisible: false,
    selections: [],
  }),
  methods: {
    ...mapActions("items", ["fetchStockItems", "importStockItems"]),
    importItems() {
      const importAttributeValues = this.associateDefaultTags === "true";
      const payload = {
        importAttributeValues: importAttributeValues,
        items: this.selections,
      };
      this.importStockItems(payload);
      this.selections = [];
      this.toggleSaveModal();
    },
    toggleSaveModal() {
      this.modalVisible = !this.modalVisible;
    },
  },
  mounted() {
    this.bulkSelected = [];
  },
  async created() {
    await this.fetchStockItems();
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
