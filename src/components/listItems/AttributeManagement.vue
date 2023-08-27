<template>
  <div class="list-item-container">
    <v-list-item>
      <template>
        <v-list-item-action @click="launchModal">
          <v-icon left small>mdi-pencil</v-icon>
        </v-list-item-action>
        <v-list-item-content @click="launchModal">
          <v-list-item-title v-text="item.name"></v-list-item-title>
        </v-list-item-content>
        <v-list-item-action
          v-show="item.itemCount > 0"
          @click="navigateToCollection"
        >
          <v-badge
            right
            :content="item.itemCount"
            :value="item.itemCount"
            color="secondary"
            overlap
          >
            <v-icon>mdi-card-text-outline</v-icon>
          </v-badge>
        </v-list-item-action>
      </template>
    </v-list-item>
    <v-divider></v-divider>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import enumValues from "@/assets/configuration/enums";
import utils from "@/utils/attributeListItem";
export default {
  name: "attributeManagementListItem",
  props: {
    attributeType: { type: String },
    item: { type: Object },
  },
  computed: {
    enums: function () {
      return enumValues;
    },
  },
  data: function () {
    return {};
  },
  methods: {
    ...mapActions("attributeList", ["setDialogVisible", "setItem"]),
    launchModal() {
      this.setItem(this.item);
      this.setDialogVisible(true);
      return;
    },
    navigateToCollection() {
      utils.navigateToAttributeCollection(
        this.attributeType,
        this.item.id,
        this.item.name
      );
    },
  },
};
</script>

<style lang="scss"></style>
