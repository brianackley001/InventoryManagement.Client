<template>
  <div id="inventory-app-container">
    <transition name="fader">
      <AppNavTopDrawer v-if="!appLoading" ref="appNavTopDrawer" />
    </transition>

    <v-main>
      <v-container class="px-4 py-0 fill-height" fluid>
        <v-row class="fill-height">
          <v-col>
            <transition name="fader">
              <div id="app-router-container" v-if="!appLoading">
                <!-- <InstallAppAlert /> -->
                <router-view></router-view>
                <ItemDetailModal />
              </div>

              <div id="app-init-container" v-if="appLoading" class="appLoading">
                <img src="../assets/shopping_list_stack-40.png" />
                <div class="spinnerLoading">
                  <v-progress-circular
                    :size="18"
                    :width="3"
                    indeterminate
                    color="light-blue accent-3"
                  ></v-progress-circular>
                </div>
              </div>
            </transition>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import AppNavTopDrawer from "@/components/navigation/AppNavTopDrawer.vue";
import ItemDetailModal from "@/components/modals/ItemDetail.vue";
// import InstallAppAlert from "@/components/InstallAppAlert.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "AppHome",
  props: {},
  components: { AppNavTopDrawer, ItemDetailModal },
  computed: {
    ...mapState("appState", ["appLoading"]),
  },
  data: () => ({
    refreshing: null,
    registration: null,
  }),
  methods: {
    ...mapActions("session", ["syncInitSession"]),
    initApp() {
      let auth = JSON.parse(window.localStorage.getItem("auth"));
      let userProfile = {
        authId: auth.user.id,
        source: auth.user.source,
        id: -1,
        isActive: true,
        subscriptions: [],
        name: "",
      };
      (async () => {
        await this.syncInitSession(userProfile);
      })();
    },
  },
  mounted() {
    this.initApp();
  },
  beforeRouteUpdate: function (to, from, next) {
    this.$refs.appNavTopDrawer.$refs.appSearchBar.onClearClicked();
    next();
  },
  beforeRouteLeave: function (to, from, next) {
    this.$refs.appNavTopDrawer.$refs.appSearchBar.onClearClicked();
    next();
  },
};
</script>
<style scoped>
.appLoading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.spinnerLoading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.fader-enter-active,
.fader-leave-active {
  transition: opacity 0.55s ease-out;
}
.fader-enter,
.fader-leave-to {
  opacity: 0;
}
</style>
