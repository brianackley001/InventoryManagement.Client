<template>
  <div id="app-nav-settings-menu">
    <v-menu v-model="menu" :nudge-top="-10" offset-y closeOnContentClick>
      <template v-slot:activator="{ on }">
        <v-btn icon v-show="displaySettingsIcon">
          <v-icon title="Settings" v-on="on">mdi-cog</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-list dense>
          <v-list-item-group>
            <v-list-item @click="syncUserSession()">
              <v-list-item-content>
                <v-list-item-title>
                  <v-btn icon>
                    <v-icon>mdi-sync</v-icon>
                  </v-btn>
                  Sync
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item @click="navigateToPath('general-settings')">
              <v-list-item-content>
                <v-list-item-title>
                  <v-btn icon>
                    <v-icon>mdi-cog</v-icon>
                  </v-btn>
                  Settings
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="navigateToPath('theme-settings')">
              <v-list-item-content>
                <v-list-item-title>
                  <v-btn icon>
                    <v-icon>mdi-palette</v-icon>
                  </v-btn>
                  Theme
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="navigateToPath('share-settings')">
              <v-list-item-content>
                <v-list-item-title>
                  <v-btn icon>
                    <v-icon>mdi-share-circle</v-icon>
                  </v-btn>
                  Share
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!-- <InstallPwaAppButton /> -->
            <v-divider></v-divider>
            <v-list-item @click="logOut()">
              <v-list-item-content>
                <v-list-item-title>
                  <v-btn icon>
                    <v-icon>mdi-logout</v-icon>
                  </v-btn>
                  Logout
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { hubConnection } from "@/plugins/ws-message-hub.js";
// import InstallPwaAppButton from "@/components/InstallAppButton.vue";
export default {
  name: "SettingsMenu",
  // components: { InstallPwaAppButton },
  computed: {
    ...mapGetters("appState", ["displaySettingsIcon"]),
    ...mapGetters("session", ["currentSubscription"]),
  },
  data: () => ({
    hubConnection: hubConnection,
    menu: false,
  }),
  methods: {
    ...mapActions("appState", ["toggleLoadingState"]),
    ...mapActions("auth", ["logOut"]),
    ...mapActions("session", ["syncCurrentSession"]),
    navigateToPath(pathName) {
      this.$router.push({
        name: pathName,
      });
    },
    syncUserSession() {
      this.toggleLoadingState(true);
      this.hubConnection.invoke("SyncUserSession", {
        subscriptionId: this.currentSubscription[0].id,
        message: `Sync User Session - ${this.currentSubscription[0].id}`,
      });
      setTimeout(
        function () {
          this.toggleLoadingState(false);
        }.bind(this),
        750
      );
    },
  },
};
</script>
