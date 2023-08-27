<template>
  <v-btn right text dark small @click="launchModal" v-show="showButton">
    <v-icon dark>mdi-plus</v-icon>
  </v-btn>
</template>
<script>
import utils from "@/utils/associatedItemAttribute";
import { mapActions } from "vuex";
export default {
  name: "AddItemButton",
  computed: {
    showButton: function () {
      return (
        this.$route.name !== "groups" &&
        this.$route.name !== "shopping-lists" &&
        this.$route.name !== "tags" &&
        this.$route.name !== "shopping-list"
      );
    },
  },
  methods: {
    ...mapActions("items", ["launchAddNewItem", "setCreateMode"]),
    launchModal() {
      utils.trackItemAttribute(this.$route);
      this.setCreateMode(true);
      // emit event to synchronize ItemDetail Modal in Create Mode
      console.log(`this.$eventHub.$emit("item-detail-create-mode-click");`);
      this.$eventHub.$emit("item-detail-create-mode-click");
      this.launchAddNewItem();
    },
  },
};
</script>
<style scoped></style>
