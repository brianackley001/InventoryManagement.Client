<template>
  <div class="list-item-container">
    <v-list-item>
      <template>
        <v-list-item-action>
          <v-checkbox
            :input-value="displaySelectionCheckBox"
            v-show="itemIsSelectionEligible"
            dense
            @click="
              if (itemIsSelectionEligible) {
                trackSelectionMode({
                  primaryKeyId: $route.params.id || 0,
                  valueId: itemId,
                });
              }
            "
          ></v-checkbox>
          <v-icon
            left
            small
            v-text="searchResultNonItemClass"
            v-show="!itemIsSelectionEligible"
          ></v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title
            v-text="item.name"
            @click="launchModal"
          ></v-list-item-title>
          <v-list-item-subtitle v-if="item.groups && item.groups.length > 0">
            <!-- <v-icon left small>mdi-group</v-icon> -->
            <AttributeChip
              v-for="(g, index) in item.groups"
              :key="index"
              :attributeType="enums.ATTRIBUTE_TYPE.GROUP"
              :item="g"
              isListItem
              readOnly
            />
          </v-list-item-subtitle>
          <v-list-item-subtitle v-if="item.tags && item.tags.length > 0">
            <!-- <v-icon left small>mdi-tag</v-icon> -->
            <AttributeChip
              v-for="(t, index) in item.tags"
              :key="index"
              :attributeType="enums.ATTRIBUTE_TYPE.TAG"
              :item="t"
              isListItem
              readOnly
            />
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-avatar @click="launchModal">
          <v-icon
            v-show="itemIsSelectionEligible"
            :color="iconColor"
            :class="thumbColor"
            v-text="iconClass"
          ></v-icon>
        </v-list-item-avatar>
      </template>
    </v-list-item>
    <v-divider></v-divider>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import enumValues from "@/assets/configuration/enums";
import AttributeChip from "@/components/AttributeChip";
import utils from "@/utils/attributeListItem";
export default {
  name: "listItem",
  props: ["attributeType", "item"],
  components: { AttributeChip },
  computed: {
    ...mapGetters("selections", ["selectionMode", "selectionModeItems"]),
    displaySelectionCheckBox: function () {
      return this.selectionModeItems.indexOf(this.itemId) > -1;
    },
    enums: function () {
      return enumValues;
    },
    iconColor: function () {
      return this.item.amountValue < 1
        ? this.enums.ITEM_QUANTITY.ICON_COLOR.EMPTY
        : this.item.amountValue == 1
        ? this.enums.ITEM_QUANTITY.ICON_COLOR.LOW
        : this.enums.ITEM_QUANTITY.ICON_COLOR.FULL;
    },
    iconClass: function () {
      return this.item.amountValue < 1
        ? this.enums.ITEM_QUANTITY.ICON_CLASS.EMPTY
        : this.item.amountValue == 1
        ? this.enums.ITEM_QUANTITY.ICON_CLASS.LOW
        : this.enums.ITEM_QUANTITY.ICON_CLASS.FULL;
    },
    isCurrentRoute: function () {
      return (
        this.$route.name ===
          utils.getAttributeTypeRouteName(this.attributeType) &&
        this.$route.params.id === this.item.id
      );
    },
    itemId: function () {
      return this.attributeType == this.enums.ATTRIBUTE_TYPE.SHOPPING_LIST
        ? this.item.itemId
        : this.item.id;
    },
    itemIsSelectionEligible: function () {
      return (
        (this.attributeType == this.enums.ATTRIBUTE_TYPE.SEARCH &&
          this.item.resultType == this.enums.ATTRIBUTE_TYPE.ITEM) ||
        this.attributeType !== this.enums.ATTRIBUTE_TYPE.SEARCH
      );
    },
    searchResultNonItemClass: function () {
      switch (this.item.resultType) {
        case this.enums.ATTRIBUTE_TYPE.TAG:
          return "mdi-tag";
        case this.enums.ATTRIBUTE_TYPE.SHOPPING_LIST:
          return "mdi-cart";
        default:
          return "mdi-group";
      }
    },
    thumbColor: function () {
      return this.$vuetify.theme.dark
        ? this.enums.ITEM_QUANTITY.THUMB_COLOR.DARK
        : this.enums.ITEM_QUANTITY.THUMB_COLOR.LIGHT;
    },
  },
  data: function () {
    return {};
  },
  methods: {
    ...mapActions("items", ["fetchItemDetail", "setDialogVisible"]),
    ...mapActions("selections", ["resetSelectionMode", "trackSelectionMode"]),
    isSearchByAttributeId(attributeItem, attributeType) {
      return (
        this.$route.name === attributeType &&
        attributeItem.id === this.$route.params.id
      );
    },
    launchModal() {
      // modal for ITEM type:
      if (this.itemIsSelectionEligible) {
        const fetchItemId =
          this.attributeType &&
          this.attributeType == this.enums.ATTRIBUTE_TYPE.SHOPPING_LIST
            ? this.item.itemId
            : this.item.id;
        this.fetchItemDetail(fetchItemId);
        this.setDialogVisible(true);
        return;
      }

      // for non ITEM types in search results, direct to Attribute Type page (e.g. Group, Tag, Shopping List...)
      if (!this.isCurrentRoute) {
        utils.navigateToAttributeCollection(
          this.item.resultType,
          this.item.id,
          this.item.name
        );
      }
    },
  },
};
</script>

<style lang="scss"></style>
