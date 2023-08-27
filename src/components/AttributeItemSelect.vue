<template>
  <div class="attributeItemSelect">
    <v-divider></v-divider>
    <v-row>
      <v-col
        ><v-badge
          v-show="!isEditMode"
          :color="chipColorValue"
          left
          :content="collectionSelectionCount"
          :value="collectionSelectionCount"
        >
          <v-icon :color="chipColorValue">{{ badgeIconValue }}</v-icon
          >&nbsp;&nbsp;<span>{{ selectLabelValue }}</span>
        </v-badge>
        <v-select
          v-show="isEditMode"
          v-model="attributeModificationsValue.added"
          :items="attributeCollection"
          :label="selectLabelValue"
          :menu-props="{ closeOnContentClick: false }"
          item-text="name"
          item-value="id"
          chips
          deletable-chips
          multiple
          solo
        >
          <template v-slot:append-item>
            <CreateNewAttribute
              :attributeType="attributeType"
              v-on:on-create-attribute-completed="refreshItemDetailAttributes"
            />
          </template>
          <template v-slot:selection="{ item, index }">
            <v-chip close @click:close="handleChipRemoval(item, index)">
              <span>{{ item.name }}</span>
            </v-chip>
          </template>
        </v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <AttributeChip
          v-for="(i, index) in attributeCollection"
          v-show="i.isSelected && !isEditMode"
          :key="index"
          :attributeType="attributeType"
          :isListItem="attributeChipIsListItem"
          :item="i"
          readOnly
        />
      </v-col>
    </v-row>
  </div>
</template>
<script>
import AttributeChip from "@/components/AttributeChip";
import CreateNewAttribute from "@/components/CreateAttribute.vue";
import enumValues from "@/assets/configuration/enums";
export default {
  name: "AttributeItemSelect",
  props: {
    attributeType: { type: String, required: true },
    attributeCollection: { type: Array, required: true, default: () => [] },
    attributeModifications: { type: Object, required: true },
    isEditMode: { type: Boolean, required: true },
  },
  components: {
    AttributeChip,
    CreateNewAttribute,
  },
  computed: {
    attributeModificationsValue: function () {
      return this.attributeModifications == null
        ? {}
        : this.attributeModifications;
    },
    badgeIconValue: function () {
      switch (this.attributeType) {
        case this.enums.ATTRIBUTE_TYPE.SHOPPING_LIST:
          return "mdi-cart";
        case this.enums.ATTRIBUTE_TYPE.TAG:
          return "mdi-tag";
        default:
          return "mdi-group";
      }
    },
    chipColorValue: function () {
      switch (this.attributeType) {
        case this.enums.ATTRIBUTE_TYPE.SHOPPING_LIST:
          return this.enums.CHIP_TEXT_COLOR.SHOPPING_LIST;
        case this.enums.ATTRIBUTE_TYPE.TAG:
          return this.enums.CHIP_TEXT_COLOR.TAG;
        default:
          return this.enums.CHIP_TEXT_COLOR.GROUP;
      }
    },
    collectionSelectionCount: function () {
      return (
        this.attributeCollection &&
        this.attributeCollection.filter((x) => x.isSelected).length
      );
    },
    enums: function () {
      return enumValues;
    },
    selectLabelValue: function () {
      switch (this.attributeType) {
        case this.enums.ATTRIBUTE_TYPE.SHOPPING_LIST:
          return "Shopping Lists";
        case this.enums.ATTRIBUTE_TYPE.TAG:
          return "Tags";
        default:
          return "Groups";
      }
    },
  },
  data: () => ({
    attributeChipIsListItem: false,
    //attributeModificationsValue: this.attributeModifications,
  }),
  methods: {
    findItemIndex: function (item, collection) {
      return collection.findIndex((i) => i === item);
    },
    handleChipRemoval: function (item, index) {
      this.attributeModificationsValue.added.splice(index, 1);
      // console.log(`handleChipRemoval item: ${item.name}`);
    },
    refreshItemDetailAttributes(result) {
      //  Selection model is refreshed via Create New Attribute Menu event handler
      const index = this.findItemIndex(
        result,
        this.attributeModificationsValue.added
      );
      if (index < 0) {
        this.attributeModificationsValue.added.push(result.id);
      }
    },
  },
};
</script>
