<template>
  <v-chip
    :v-bind="item"
    class="ma-1"
    x-small
    @click="navigateToCollection()"
    :color="chipColor"
    :close="!readOnly"
    @click:close="removeAttributeItem(item)"
    :text-color="chipTextColor"
    :outlined="!isSearchByAttributeId()"
    :class="textCssClass"
    >{{ item.name }}</v-chip
  >
</template>
<script>
import utils from "@/utils/attributeListItem";
import enumValues from "@/assets/configuration/enums";
export default {
  name: "AttributeChip",
  props: {
    attributeType: { type: String },
    item: { type: Object },
    isListItem: { type: Boolean },
    readOnly: { type: Boolean },
    textCssClass: { type: String },
  },
  computed: {
    chipColor: function () {
      switch (this.attributeType) {
        case this.enums.ATTRIBUTE_TYPE.TAG:
          return this.enums.CHIP_COLOR.TAG;
        case this.enums.ATTRIBUTE_TYPE.SHOPPING_LIST:
          return this.enums.CHIP_COLOR.SHOPPING_LIST;
        default:
          return this.enums.CHIP_COLOR.GROUP;
      }
    },
    chipTextColor: function () {
      switch (this.attributeType) {
        case this.enums.ATTRIBUTE_TYPE.TAG:
          return this.enums.CHIP_TEXT_COLOR.TAG;
        case this.enums.ATTRIBUTE_TYPE.SHOPPING_LIST:
          return this.enums.CHIP_TEXT_COLOR.SHOPPING_LIST;
        default:
          return this.enums.CHIP_TEXT_COLOR.GROUP;
      }
    },
    enums: function () {
      return enumValues;
    },
    isCurrentRoute: function () {
      return (
        this.$route.name ===
          utils.getAttributeTypeRouteName(this.attributeType) &&
        this.$route.params.id === this.item.id
      );
    },
  },
  methods: {
    isSearchByAttributeId() {
      return (
        this.$route.name === this.attributeType &&
        this.item.id === this.$route.params.id
      );
    },
    navigateToCollection() {
      if (!this.isCurrentRoute && this.isListItem) {
        utils.navigateToAttributeCollection(
          this.attributeType,
          this.item.id,
          this.item.name
        );
      }
    },
    removeAttributeItem(item) {
      // emit values to synchronize parent component
      this.$emit("on-toggle-clear-attribute-completed", item);
    },
  },
};
</script>
<style scoped>
.chip-deleted {
  text-decoration: line-through !important;
  text-transform: lowercase !important;
  font-style: italic !important;
}
</style>
