<template>
  <v-main>
    <v-container class="px-4 py-0 fill-height" fluid>
      <v-row>
        <v-col cols="12">
          <v-app-bar dense dark app clipped color="blue-grey darken-1">
            <v-app-bar-nav-icon
              @click="drawer = !drawer"
              v-show="!menuIsPermanent"
            ></v-app-bar-nav-icon>
            <v-toolbar-title>Settings</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn text @click="navigateHome"
              >Close<v-icon right>mdi-close</v-icon>
            </v-btn>
          </v-app-bar>
        </v-col>
      </v-row>
      <v-row class="fill-height">
        <v-col cols="4">
          <v-navigation-drawer
            v-model="drawer"
            :permanent="menuIsPermanent"
            clipped
          >
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
          </v-navigation-drawer>
        </v-col>
        <v-col cols="8">
          <router-view> </router-view>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: "SettingsLayout",
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
    ...mapActions("appState", ["toggleAppLoadingStatus"]),
    navigateHome() {
      // any dirty checks...?
      this.toggleAppLoadingStatus(true); // default value for pre-login appState
      this.$router.push({
        name: "home",
      });
    },
  },
};
</script>
