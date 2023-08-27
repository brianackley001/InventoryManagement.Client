<template>
  <div class="list-item-container">
    <v-list-item>
      <v-list-item-avatar @click="toggleCheckedItem">
        <v-icon v-show="displaySelectionCheckBox" text
          >mdi-check-circle-outline</v-icon
        >
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title
          v-text="item.name"
          :class="titleCssClass"
          @click="toggleCheckedItem"
        ></v-list-item-title>
        <v-list-item-subtitle>
          <v-btn
            v-show="item.groups.length > 0"
            small
            color="purple lighten-3"
            icon
            class="attribute-button-margin"
            @click="launchDialog(enums.ATTRIBUTE_TYPE.GROUP)"
            ><v-icon right x-small>mdi-group</v-icon>
            {{ item.groups.length }}</v-btn
          >
          <v-btn
            small
            class="attribute-button-margin"
            v-show="item.tags.length > 0"
            color="blue lighten-3"
            icon
            @click="launchDialog(enums.ATTRIBUTE_TYPE.TAG)"
            ><v-icon x-small>mdi-tag</v-icon>{{ item.tags.length }}</v-btn
          >
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider inset></v-divider>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import enumValues from "@/assets/configuration/enums";
export default {
  name: "listItem",
  props: ["attributeType", "item"],
  computed: {
    ...mapGetters("selections", ["selectionMode", "selectionModeItems"]),
    enums: function () {
      return enumValues;
    },
    itemId: function () {
      return this.item.itemId;
    },
    thumbColor: function () {
      return this.$vuetify.theme.dark
        ? this.enums.ITEM_QUANTITY.THUMB_COLOR.DARK
        : this.enums.ITEM_QUANTITY.THUMB_COLOR.LIGHT;
    },
    displaySelectionCheckBox: function () {
      return this.selectionModeItems.indexOf(this.itemId) > -1;
    },
    titleCssClass: function () {
      return this.displaySelectionCheckBox ? "item-checked-off" : "";
    },
  },
  data: function () {
    return {
      mutableItem: Object.assign({}, this.item),
    };
  },
  methods: {
    ...mapActions("selections", ["resetSelectionMode", "trackSelectionMode"]),
    ...mapActions("shoppingLists", ["syncCheckoutItem"]),
    launchDialog(mode) {
      this.dialogMode = mode;
      let collection =
        mode === this.enums.ATTRIBUTE_TYPE.TAG
          ? this.item.tags
          : this.item.groups;
      let eventArgs = { mode: mode, collection: collection };
      // emit values to synchronize parent component
      this.$emit("on-launch-dialog", eventArgs);
    },
    toggleCheckedItem() {
      // Persist update for Hub consumption:
      this.mutableItem.isSelected = !this.displaySelectionCheckBox;
      this.$eventHub.$emit("toggle-checkout-list-item", this.mutableItem);
      this.syncCheckoutItem(this.mutableItem);
      // then update local selection status:
      this.trackSelectionMode({
        primaryKeyId: this.$route.params.id || 0,
        valueId: this.itemId,
      });
    },
  },
};
</script>

<style scoped>
.item-checked-off {
  text-decoration: line-through !important;
  text-transform: lowercase !important;
  font-style: italic !important;
  color: gray;
}
.attribute-button-margin {
  margin-left: 20px;
}
</style>
div.v-list-item__content > div
