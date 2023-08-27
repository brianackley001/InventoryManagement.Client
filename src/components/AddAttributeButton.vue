<template>
  <v-btn right text dark small @click="launchModal" v-show="showButton">
    <v-icon dark>mdi-plus</v-icon>
  </v-btn>
</template>
<script>
// import utils from "@/utils/associatedItemAttribute";
import { mapActions } from "vuex";
export default {
  name: "AddAttributeButton",
  computed: {
    showButton: function () {
      return (
        this.$route.name == "groups" ||
        this.$route.name == "shopping-lists" ||
        this.$route.name == "tags"
      );
    },
  },
  methods: {
    ...mapActions("attributeList", ["setDialogVisible", "setDialogCreateMode"]),
    launchModal() {
      this.setDialogCreateMode(true);
      this.setDialogVisible(true);
    },
  },
};
</script>
<style scoped></style>
