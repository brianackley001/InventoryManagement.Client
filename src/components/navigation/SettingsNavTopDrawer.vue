<template>
  <div id="settings-navigation-container">
    <v-navigation-drawer v-model="drawer" :permanent="menuIsPermanent">
      <v-list dense nav>
        <v-list-item link :to="{ name: 'account-settings' }">
          <v-list-item-content>
            <v-list-item-title>
              <v-btn icon>
                <v-icon>mdi-account</v-icon>
              </v-btn>
              Account
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{ name: 'general-settings' }">
          <v-list-item-content>
            <v-list-item-title>
              <v-btn icon>
                <v-icon>mdi-cog</v-icon>
              </v-btn>
              Settings
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{ name: 'theme-settings' }">
          <v-list-item-content>
            <v-list-item-title>
              <v-btn icon>
                <v-icon>mdi-palette</v-icon>
              </v-btn>
              Theme
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{ name: 'share-settings' }">
          <v-list-item-content>
            <v-list-item-title>
              <v-btn icon>
                <v-icon>mdi-share-circle</v-icon>
              </v-btn>
              Share
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <!-- <v-footer absolute tile
        ><v-col class="text-right" cols="12">
          <v-icon @click="drawer = !drawer">mdi-chevron-double-left</v-icon>
        </v-col>
      </v-footer> -->
    </v-navigation-drawer>
    <v-app-bar dense dark app clipped color="blue-grey darken-1">
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
        v-show="!menuIsPermanent"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>Settings</v-toolbar-title>
      <v-spacer></v-spacer>
      Close
      <v-btn icon @click="navigateHome"><v-icon>mdi-close</v-icon></v-btn>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: "SettingsNav",
  computed: {
    menuIsPermanent() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
        case "sm":
          return false;
        default:
          return true;
      }
    },
  },
  data: () => ({
    drawer: null,
    navLinkItem: -1,
  }),
  methods: {
    navigateHome() {
      // any dirty checks...?
      this.$router.push({
        name: "home",
      });
    },
  },
};
</script>
