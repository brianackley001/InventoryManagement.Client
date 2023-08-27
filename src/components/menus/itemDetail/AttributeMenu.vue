<template>
  <div>
    <v-menu
      bottom
      transition="scale-transition"
      :close-on-click="menuClickCanDismiss"
      :close-on-content-click="closeOnContentClick"
      :min-width="menuMinWidthValue"
      nudge-bottom
      auto
      nudge-left
    >
      <template v-slot:activator="{ on }">
        <v-list-item-icon class="item-detail-toolbar-btn">
          <v-icon v-on="on" v-text="attributeMenuIcon"></v-icon>
        </v-list-item-icon>
      </template>
      <v-list dense flat>
        <v-list-item>
          <v-text-field
            v-model="searchTerm"
            placeholder="Find"
            label="Name"
            clearable
            color="blue-grey darken-1"
          ></v-text-field>
        </v-list-item>
        <v-list-item-group multiple>
          <v-list-item>
            <v-list-item-action>
              <v-icon v-on:click.stop="launchModal">mdi-plus</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-on:click.stop="launchModal"
                >Create New {{ attributeTitleText }}</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <template v-for="attr in itemAttributes">
            <v-list-item :key="attr.id">
              <v-list-item-action>
                <v-checkbox
                  :v-model="attr"
                  :input-value="attr.isSelected"
                  color="blue-grey darken-1"
                  @click.stop="toggleAttributeValue(attr)"
                ></v-checkbox>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title v-text="attr.name"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list-item-group>
      </v-list>
    </v-menu>
    <AttributeItemModal />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import AttributeItemModal from "@/components/modals/AttributeItem.vue";
import utils from "@/utils/attributeListItem";
export default {
  name: "ItemAttributeCollectionMenu",
  components: { AttributeItemModal },
  props: {
    attributeType: { type: String },
    items: { type: Array },
  },
  computed: {
    ...mapGetters("items", ["menuClickCanDismiss"]),
    attributeTitleText: function () {
      return utils.getAttributeTypeDisplayName(this.attributeType);
    },
    attributeMenuIcon: function () {
      let iconValue = "mdi-group";
      switch (this.attributeType) {
        case "shoppinglist":
          iconValue = "mdi-cart";
          break;
        case "tag":
          iconValue = "mdi-tag";
          break;
        default:
          iconValue = "mdi-group";
          break;
      }
      return iconValue;
    },
    itemAttributes: function () {
      if (this.searchTerm && this.searchTerm.length > 0) {
        return this.items.filter((item) => {
          return (
            item.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1
          );
        });
      } else {
        return this.items;
      }
    },
    menuMinWidthValue() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "200px";
        default:
          return "300px";
      }
    },
  },
  data: () => ({
    closeOnContentClick: false,
    searchTerm: "",
  }),
  methods: {
    ...mapActions("items", [
      "setMenuClickCanDismiss",
      "setGroupItem",
      "setShoppingListItem",
      "setTagItem",
    ]),
    ...mapActions("attributeList", [
      "resetAttributeItem",
      "setAttributeType",
      "setDialogEditMode",
      "setDialogVisible",
      "setItemTypeTitle",
      "setRefreshItemDetail",
    ]),
    launchModal() {
      this.setMenuClickCanDismiss(false);
      this.setAttributeType(this.attributeType);
      this.setDialogEditMode(false);
      this.resetAttributeItem();
      this.setItemTypeTitle(
        utils.getAttributeTypeDisplayName(this.attributeType)
      );
      this.setRefreshItemDetail(true);
      this.setDialogVisible(true);
    },
    toggleAttributeValue(attr) {
      const elementsIndex = this.items.findIndex(
        (element) => element.id == attr.id
      );
      let updatedItem = Object.assign({}, this.items[elementsIndex]);
      updatedItem.isSelected = !attr.isSelected;

      switch (this.attributeType) {
        case "shoppinglist":
          this.setShoppingListItem(updatedItem);
          break;
        case "tag":
          this.setTagItem(updatedItem);
          break;
        default:
          this.setGroupItem(updatedItem);
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.item-detail-toolbar-btn {
  margin-right: 18px;
}
#item-detail-tool-bar-menu-group {
  overflow: auto;
  max-height: 92%;
}
</style>
