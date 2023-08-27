<template>
  <v-row class="mb-6" v-show="showAlertBanner">
    <v-col cols="10">
      <v-alert dense type="info" icon="mdi-download" dismissible
        ><span @click="installPwa"
          >Add shortcut to your home screen/desktop</span
        >
        <template slot="prepend">
          <v-btn @click="installPwa" icon>
            <v-icon>mdi-download</v-icon>
          </v-btn>
        </template>
        <template slot="close">
          <v-btn @click.native="dismissAlertBanner" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-alert>
    </v-col>
    <v-col cols="2"></v-col>
  </v-row>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "InstallAlertBanner",
  data: () => ({}),
  computed: {
    ...mapGetters("appState", [
      "installCompleted",
      "installPrompt",
      "showInstallAlert",
    ]),
    showAlertBanner: function () {
      return (
        this.showInstallAlert && this.installPrompt && !this.installCompleted
      );
    },
  },
  methods: {
    ...mapActions("appState", ["setInstallAlert"]),
    dismissAlertBanner() {
      this.setInstallAlert(false);
    },
    async installPwa() {
      console.log("... prompting for installation...");
      this.installPrompt.prompt();
    },
  },
};
</script>
<style scoped></style>
