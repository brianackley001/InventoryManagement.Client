<template>
  <div id="drawer-app-nav-container">
    <v-navigation-drawer v-model="drawer" clipped app>
      <v-list dense nav>
        <v-list-item-group v-model="navLinkItem">
          <v-list-item link :to="{ name: 'home' }">
            <v-list-item-action>
              <v-icon color="blue-grey darken-1">mdi-gauge-low</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Running Low</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link :to="{ name: 'items' }">
            <v-list-item-action>
              <v-icon color="blue-grey darken-1">mdi-card-text</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>All Items</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link :to="{ name: 'groups' }">
            <v-list-item-action>
              <v-icon color="blue-grey darken-1">mdi-group</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Groups</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link :to="{ name: 'tags' }">
            <v-list-item-action>
              <v-icon color="blue-grey darken-1">mdi-tag</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Tags</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link :to="{ name: 'shopping-lists' }">
            <v-list-item-action>
              <v-icon color="blue-grey darken-1">mdi-cart</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Shopping Lists</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link :to="{ name: 'general-settings' }">
            <v-list-item-action>
              <v-icon color="blue-grey darken-1">mdi-cog</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Settings</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="syncCurrentSession()">
            <v-list-item-action>
              <v-icon color="blue-grey darken-1">mdi-sync</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Sync</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link :to="{ name: 'stock-items' }">
            <v-list-item-action>
              <v-icon color="blue-grey darken-1">mdi-application-import</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Import Stock Items</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="logOut()">
            <v-list-item-action>
              <v-icon color="blue-grey darken-1">mdi-logout</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <v-footer absolute tile
        ><v-col class="text-right" cols="12">
          <v-icon @click="drawer = !drawer">mdi-chevron-double-left</v-icon>
        </v-col>
      </v-footer>
    </v-navigation-drawer>

    <v-app-bar color="blue-grey darken-1" clipped-left dark app>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <span id="app-bar-title" class="title ml-3 mr-5">
        <v-icon
          id="icon-home-nav"
          title="Home"
          :disabled="isHomePage"
          @click="navigateHome()"
          >mdi-home</v-icon
        >
      </span>

      <SearchBar ref="appSearchBar" />

      <v-spacer></v-spacer>
      <AddItemButton />
      <AddAttributeButton />
    </v-app-bar>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import AddItemButton from "@/components/AddItemButton.vue";
import AddAttributeButton from "@/components/AddAttributeButton.vue";
import SearchBar from "@/components/SearchBar.vue";
export default {
  name: "AppNavTopDrawer",
  components: {
    AddItemButton,
    AddAttributeButton,
    SearchBar,
  },
  computed: {
    isHomePage: function () {
      return this.$route.name === "home";
    },
  },
  data: () => ({
    drawer: null,
    navLinkItem: -1,
  }),
  methods: {
    ...mapActions("auth", ["logOut"]),
    ...mapActions("session", ["syncCurrentSession"]),
    navigateHome() {
      this.$router.push({
        name: "home",
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
