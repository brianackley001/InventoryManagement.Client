<template>
  <v-list-item @click="this.installPrompt.prompt()" v-show="showInstallButton">
    <v-list-item-content>
      <v-list-item-title>
        <v-btn icon>
          <v-icon>mdi-download</v-icon>
        </v-btn>
        Install
      </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "InstallPwaAppButton",
  data: () => ({}),
  computed: {
    ...mapGetters("appState", ["installCompleted", "installPrompt"]),
    showInstallButton: function () {
      return this.installPrompt && !this.installCompleted;
    },
  },
  methods: {
    ...mapActions("appState", ["setInstallCompleted", "setInstallPrompt"]),
    async installPwa() {
      console.log("... prompting for installation...");
      this.installPrompt.prompt();
    },
  },
  created() {
    window.addEventListener("appinstalled", () => {
      this.setInstallPrompt(null);
      this.setInstallCompleted(true);
      console.log("... App Successfully Installed!");
    });
  },
};
</script>
<style scoped></style>
