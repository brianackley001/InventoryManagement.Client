<template>
  <v-chip
    class="ma-1"
    color="green"
    text-color="white"
    v-show="selectionMode"
    outlined
    small
    @click="confirmClearCollection"
  >
    <v-icon small>mdi-checkbox-marked-circle</v-icon>
    {{ selectionModeItems.length }}
  </v-chip>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "SelectionCounter",
  computed: {
    ...mapGetters("selections", ["selectionMode", "selectionModeItems"]),
  },
  methods: {
    ...mapActions("selections", ["resetSelectionMode"]),
    async confirmClearCollection() {
      let response = await this.$root.$confirm.open(
        "Clear Selected Items?",
        `You have ${this.selectionModeItems.length} items currently selected...do you wish to clear these selections?`,
        { color: "primary" }
      );
      if (response) {
        this.resetSelectionMode();
      }
    },
  },
};
</script>
