<template>
  <v-app id="inventory" :dark="darkTheme">
    <v-overlay absolute opacity=".1" :value="loading" z-index="5">
      <v-progress-circular
        :size="30"
        :width="3"
        indeterminate
        color="light-blue accent-3"
        class="spinnerLoading"
      ></v-progress-circular>
    </v-overlay>
    <v-snackbar
      v-model="snackBar"
      :color="notificationType"
      top
      right
      :timeout="notificationTimeout"
    >
      {{ notificationMessage }}
      <v-btn dark text @click="setNotificationVisibility(false)"> Close </v-btn>
    </v-snackbar>
    <confirmDialog ref="confirm" />

    <router-view></router-view>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import confirmDialog from "@/components/Confirm.vue";
import { hubConnection } from "@/plugins/ws-message-hub.js";
export default {
  name: "InventoryApp",
  components: { confirmDialog },
  props: {},
  computed: {
    isLander: function () {
      return this.$route.name == "lander";
    },
    ...mapGetters("appState", [
      "appLoading",
      "darkTheme",
      "loading",
      "notificationMessage",
      "notificationType",
      "notificationTimeout",
      "notificationVisible",
    ]),
    ...mapGetters("session", ["currentSubscription"]),
    snackBar: {
      get: function () {
        return this.notificationVisible;
      },
      set: function (newValue) {
        this.setNotificationVisibility(newValue);
      },
    },
  },
  data: () => ({
    hubConnection: hubConnection,
  }),
  methods: {
    ...mapActions("appState", [
      "setInstallPrompt",
      "setNotificationVisibility",
    ]),
    ...mapActions("session", ["syncCurrentSession"]),
    async showRefreshUI(e) {
      this.registration = e.detail;
      console.log("... ...It Be Refresh Time...  ...");
      let response = await this.$root.$confirm.open(
        "Update to latest version?",
        `There is a new version of Inventory Manager available. Please click "Yes" to update now, or "Cancel" to defer your update`,
        { color: "primary" }
      );
      if (response) {
        if (!this.registration || !this.registration.waiting) {
          return;
        }

        await this.registration.waiting.postMessage({ action: "skipWaiting" });
      }
    },
  },
  created() {
    // Listen for swUpdated event and display refresh dialog as required.
    document.addEventListener("swUpdated", this.showRefreshUI, { once: true });
    // Refresh all open app tabs when a new service worker is installed.
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      console.log(
        "navigator.serviceWorker.addEventListener - controllerchange | evaluate this.refreshing..."
      );
      if (this.refreshing) return;
      this.refreshing = true;
      window.location.reload();
    });
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.setInstallPrompt(e);
      console.log(
        "...beforeinstallprompt event listner has been stashed for later"
      );
    });
  },
  beforeMount() {
    this.hubConnection.start();
    // SignalR WS "on" listeners:
    this.hubConnection.on("SyncShoppingListCheckout", (shoppingListId) => {
      this.$eventHub.$emit("sync-shopping-list-checkout-item", shoppingListId);
    });
    this.hubConnection.on("SyncShoppingListCheckoutCompleted", (payload) => {
      this.$eventHub.$emit("complete-shopping-list-checkout", payload);
    });
    this.hubConnection.on("SyncUserSession", (subscriptionId) => {
      if (this.currentSubscription[0].id == subscriptionId) {
        this.syncCurrentSession();
      }
    });
  },
  mounted() {
    this.$vuetify.theme.dark = this.darkTheme;
    this.$root.$confirm = this.$refs.confirm;
  },
};
</script>

<style scoped>
.spinnerLoading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
