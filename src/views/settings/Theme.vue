<template>
  <div id="settings-theme-layout-container">
    <div class="title py-3">Theme Settings</div>
    <v-switch
      :label="`Dark Theme`"
      v-model="$vuetify.theme.dark"
      @click="toggleThemeValue"
    ></v-switch>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "ThemeSettings",
  computed: {
    ...mapGetters("appState", ["darkTheme"]),
  },
  data: () => ({}),
  methods: {
    ...mapActions("appState", ["setDarkTheme"]),
    toggleThemeValue() {
      this.setDarkTheme(!this.darkTheme);
    },
  },
};
</script>
