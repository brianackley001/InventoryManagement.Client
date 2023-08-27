<template>
  <div class="list-view-container-block">
    <v-row justify="center">
      <v-expansion-panels accordion flat>
        <v-expansion-panel>
          <v-expansion-panel-header
            @mouseover="hover = true"
            @mouseleave="hover = false"
          >
            {{ headerTitle }}
          </v-expansion-panel-header>
          <div :class="hoverPlusStyle"
            ><v-icon
              small
              v-on:click.stop="launchModal"
              @mouseover="hover = true"
              @mouseleave="hover = false"
              >mdi-plus</v-icon
            ></div
          >
          <v-expansion-panel-content>
            <v-list dense>
              <ListItem
                v-for="(i, index) in items"
                :item="i"
                :attributeType="attributeType"
                :key="index" /></v-list
          ></v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
    <AttributeItemModal />
  </div>
</template>

<script>
import ListItem from "@/components/listItems/AttributeListItem.vue";
import AttributeItemModal from "@/components/modals/AttributeItem.vue";
import utils from "@/utils/attributeListItem";
import { mapActions } from "vuex";
export default {
  name: "NavAttrList",
  components: { AttributeItemModal, ListItem },
  computed: {
    headerTitle: function () {
      switch (this.attributeType.toString().toLowerCase()) {
        case "shoppinglist":
          return "Shopping Lists";
        case "tag":
          return "Tags";
        default:
          return "Groups";
      }
    },
    hoverPlusStyle: function () {
      return this.hover ? "add-plus-hover" : "add-plus";
    },
  },
  props: ["attributeType", "items"],
  data: () => ({
    dialog: false,
    formFieldName: "",
    hover: false,
  }),
  methods: {
    ...mapActions("attributeList", [
      "resetAttributeItem",
      "setAttributeType",
      "setDialogEditMode",
      "setDialogVisible",
      "setItemTypeTitle",
    ]),
    launchModal() {
      this.setAttributeType(this.attributeType);
      this.setDialogEditMode(false);
      this.resetAttributeItem();
      this.setItemTypeTitle(
        utils.getAttributeTypeDisplayName(this.attributeType)
      );
      this.setDialogVisible(true);
    },
  },
};
</script>

<style lang="scss">
.add-plus {
  float: right;
  margin-right: 10px;
  margin-top: -40px;
  opacity: 0;
}
.add-plus-hover {
  float: right;
  margin-right: 10px;
  margin-top: -40px;
  opacity: 1;
}
.list-view-container-block {
  width: 98%;
}
</style>
