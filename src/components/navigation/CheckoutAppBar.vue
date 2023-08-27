<template>
  <v-app-bar dense dark app clipped color="primary">
    <v-icon small class="header-icon-item">mdi-cart</v-icon>
    <v-spacer></v-spacer>
    <v-toolbar-title v-show="!checkoutInProgress">Checkout</v-toolbar-title>
    <v-progress-linear
      v-show="checkoutInProgress"
      color="success"
      v-model="completed"
      height="20"
    >
      <strong>{{ selectionModeItems.length }} of {{ items.length }}</strong>
    </v-progress-linear>
    <v-btn
      fab
      x-small
      :color="iconButtonColor"
      class="checkout-icon-item"
      v-show="checkoutInProgress"
      @click="startCheckout"
    >
      <v-icon medium :color="iconColor">mdi-check-outline</v-icon>
    </v-btn>
    <v-spacer></v-spacer>
    <v-btn text @click="navigateBack" class="cancel-text-font"
      >Cancel<v-icon right>mdi-close</v-icon>
    </v-btn>
  </v-app-bar>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import utils from "@/utils/filterCheckout";
export default {
  name: "CheckoutAppBar",
  computed: {
    ...mapGetters("selections", ["selectionModeItems"]),
    ...mapGetters("shoppingLists", ["items", "selectedShoppingListCollection"]),
    checkoutInProgress: function () {
      return this.selectionModeItems.length > 0;
    },
    completed: function () {
      return Math.floor(
        (this.selectionModeItems.length / this.items.length) * 100
      );
    },
    iconButtonColor: function () {
      return this.incompleteItems > 0 ? "white" : "success";
    },
    iconColor: function () {
      return this.incompleteItems > 0 ? "success" : "white";
    },
    incompleteItems: function () {
      return this.items.length - this.selectionModeItems.length;
    },
    shoppingListId: function () {
      return parseInt(this.$route.params.id);
    },
  },
  data: function () {
    return {
      checkoutSuccess: false,
      checkoutSuccessNavInit: false,
      completeCheckout: false,
      overrideItemIsDirty: false,
    };
  },
  methods: {
    ...mapActions("appState", [
      "showSuccessNotification",
      "toggleAppLoadingStatus",
    ]),
    ...mapActions("selections", ["resetSelectionMode"]),
    ...mapActions("shoppingLists", [
      "setCheckoutInProgress",
      "setFilteredCheckoutCollection",
      "setItemFilters",
      "shoppingListCheckout",
    ]),
    async confirmAbandonCart() {
      let response = await this.$root.$confirm.open(
        "Abandon Checkout?",
        `You have not completed checking out for this shopping list. Please click "Yes" to abandon this checkout, or "Cancel" to continue`,
        { color: "primary" }
      );
      this.overrideItemIsDirty = response;
      this.setCheckoutInProgress(false);
      // continue with override...
      if (response) this.navigateBack();
    },
    async confirmCheckout() {
      let response = await this.$root.$confirm.open(
        "Complete Checkout?",
        `Please confirm you have completed this shopping list. Please click "Yes" to complete this checkout, or "Cancel" to continue`,
        { color: "success" }
      );
      this.completeCheckout = response;
      return response;
    },
    completeSyncedCheckoutMessage(payload) {
      if (payload.shoppingListId == this.shoppingListId) {
        this.overrideItemIsDirty = true;
        this.showSuccessNotification(payload.message);
        this.navigateBack();
      }
    },
    async confirmIncompleteCheckout(itemCount) {
      let response = await this.$root.$confirm.open(
        "Complete Checkout?",
        `You have ${itemCount} items that have not been marked as "completed" for this shopping list. Please click "Yes" to complete checkout, or "Cancel" to continue`,
        { color: "primary" }
      );
      this.overrideItemIsDirty = response;
      // continue with override...
      return response;
    },
    navigateBack() {
      // verify incomplete checkout if applicable
      if (this.completed > 0 && this.completed < 100) {
        if (!this.overrideItemIsDirty) this.confirmAbandonCart();
      }

      if (
        this.completed < 1 ||
        this.overrideItemIsDirty ||
        this.completed == 100
      ) {
        this.toggleAppLoadingStatus(true); // default value for pre-login appState
        this.overrideItemIsDirty = false;
        this.setFilteredCheckoutCollection([]);
        this.setItemFilters(null);
        this.setCheckoutInProgress(false);
        this.resetSelectionMode();
        this.$router.push({
          name: "shopping-list",
          params: { id: this.$route.params.id },
        });
      }
    },
    async startCheckout() {
      // verify incomplete checkout if applicable
      if (this.completed < 100 && !this.overrideItemIsDirty) {
        let cancelCheckout = await this.confirmIncompleteCheckout(
          this.incompleteItems
        );
        if (!cancelCheckout) return;
      }
      // confirm checkout
      if (
        !this.completeCheckout &&
        (this.overrideItemIsDirty || this.completed == 100)
      ) {
        let cancelCheckout = await this.confirmCheckout();
        if (!cancelCheckout) return;
      }
      //execute checkout action
      this.checkoutSuccess = await this.shoppingListCheckout(
        utils.mapCheckoutItems(
          this.items,
          this.selectionModeItems,
          this.selectedShoppingListCollection
        )
      );
      if (this.checkoutSuccess) {
        await this.setFilteredCheckoutCollection([]);
        await this.setItemFilters(null);
        await this.setCheckoutInProgress(false);
        this.$eventHub.$emit("checkout-completed", this.shoppingListId);
        if (!this.checkoutSuccessNavInit) {
          // Apparently this fires twice - will wait for just cause to deep dive & figure out how/if to prevent
          this.toggleAppLoadingStatus(true); // default value for pre-login appState
          this.$router.push({
            name: "shopping-list",
            params: { id: this.shoppingListId },
          });
          this.checkoutSuccessNavInit = true;
        }
      }
    },
  },
  created() {
    this.$eventHub.$on(
      "complete-shopping-list-checkout",
      this.completeSyncedCheckoutMessage
    );
  },
  beforeDestroy() {
    this.$eventHub.$off("complete-shopping-list-checkout");
  },
};
</script>
<style scoped>
.cancel-text-font {
  font-size: 12px;
}
.checkout-icon-item {
  margin-left: 15px;
  margin-right: 5px;
}
.header-icon-item {
  margin-right: 16px;
}
</style>
