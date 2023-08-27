/* eslint-disable vue/no-unused-vars */
<template>
  <div class="nav-list-item-container">
    <v-list-item @mouseover="hover = true" @mouseleave="hover = false">
      <v-list-item-content @click="navigateToCollection(item.id)">
        <v-list-item-title v-text="item.name"></v-list-item-title>
      </v-list-item-content>
      <v-menu bottom transition="scale-transition" offset-x>
        <template v-slot:activator="{ on }">
          <v-list-item-icon v-show="hover">
            <v-icon v-on="on">mdi-dots-horizontal</v-icon>
          </v-list-item-icon>
        </template>
        <v-list>
          <v-list-item @click="launchEditModal">
            <v-list-item-icon>
              <v-icon small>mdi-pencil</v-icon>
            </v-list-item-icon>
            <v-list-item-content
              >Edit {{ attributeTypeDisplayName }}</v-list-item-content
            >
          </v-list-item>
        </v-list>
      </v-menu>
    </v-list-item>
  </div>
</template>

<script>
import utils from "@/utils/attributeListItem";
import { mapActions } from "vuex";
export default {
  name: "NavAttrListItem",
  props: ["attributeType", "item"],
  computed: {
    attributeTypeDisplayName: function () {
      return utils.getAttributeTypeDisplayName(this.attributeType);
    },
    attributeTypeRouteName: function () {
      return utils.getAttributeTypeRouteName(this.attributeType);
    },
    isCurrentRoute: function () {
      return (
        this.$route.name ===
          utils.getAttributeTypeRouteName(this.attributeType) &&
        this.$route.params.id === this.item.id
      );
    },
  },
  data: function () {
    return {
      hover: false,
    };
  },
  methods: {
    ...mapActions("attributeList", [
      "resetAttributeItem",
      "setAttributeType",
      "setDialogEditMode",
      "setDialogVisible",
      "setItem",
      "setItemTypeTitle",
    ]),
    launchEditModal() {
      this.resetAttributeItem();
      this.setAttributeType(this.attributeType);
      this.setDialogEditMode(true);
      this.setItem(this.item);
      this.setItemTypeTitle(
        utils.getAttributeTypeDisplayName(this.attributeType)
      );
      this.setDialogVisible(true);
    },
    navigateToCollection(itemId) {
      if (!this.isCurrentRoute) {
        utils.setSelectedAttibuteCollectionName(
          this.attributeType,
          this.item.name
        );

        let searchRequest = utils.assembleSearchRequest(
          this.attributeType,
          this.item.id
        );
        utils.submitSearchRequest(this.attributeType, searchRequest);

        this.$router.push({
          name: this.attributeTypeRouteName,
          params: { id: itemId },
        });
      }
    },
  },
};
</script>
