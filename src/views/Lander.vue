<template>
  <div id="landing-page-container">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12" v-show="!isCallback">
              <v-img
                class="white--text align-end"
                height="450px"
                src="../assets/shopping_list_stack-250.png"
              ></v-img>
              <v-card-text class="text--primary">
                <div>Welcome to Inventory Management.</div>
              </v-card-text>
              <v-card-actions>
                <v-btn color="green" text @click="navigateToApp()">Start</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </div>
</template>

<script>
export default {
  name: "LandingPage",
  props: {},
  computed: {
    isCallback: function () {
      return (
        window.location.search.includes("code") &&
        window.location.search.includes("state")
      );
    },
  },
  data: () => ({}),
  methods: {
    navigateToApp() {
      this.$router.push({
        name: "home",
      });
    },
  },
};
</script>
