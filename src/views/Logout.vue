<template>
  <div id="landing-page-container">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-card-text class="text--primary">
                <div>Thank you for logging out.</div>
              </v-card-text>
              <v-card-actions>
                <router-link to="/app/items" tag="button">Back</router-link>
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
  name: "LogOut",
  props: {},
  computed: {},
  data: () => ({}),
  methods: {},
};
</script>
