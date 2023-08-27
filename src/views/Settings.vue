<template>
  <div id="settings-container">
    <h1>Settings Page</h1>
    <button @click="getProfileSubscriptions('TEST101')">Get Profile</button>
    <br />
    <button @click="checkApiToken()">TEST the thing</button>
  </div>
</template>

<script>
import { mapState } from "vuex";
import tokenUtils from "../utils/token";

export default {
  name: "sample1",
  methods: {
    async checkApiToken() {
      await tokenUtils.checkExpriation(this.$auth);
    },
    getProfileSubscriptions(param) {
      this.$store
        .dispatch("test/getProfileSubscriptions", param)
        .then((data) => {
          console.log(JSON.stringify(data.item));
        });
    },
  },
  computed: {
    ...mapState(["apiToken"]),
  },
};
</script>
