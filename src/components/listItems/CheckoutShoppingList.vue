<template>
  <div class="checkout-shopping-list-view-container">
    <v-list three-line>
      <ListItem
        v-for="(i, index) in items"
        :item="i"
        :key="index"
        @on-launch-dialog="launchCollectionDialog"
      />
    </v-list>
    <v-row justify="center">
      <v-dialog v-model="dialogVisible" :max-width="dialogMaxWidth">
        <v-card>
          <v-card-text>
            <v-container>
              <v-row>
                <v-spacer></v-spacer>
                <v-btn icon small @click="closeModal()">
                  <v-icon x-small>mdi-close</v-icon>
                </v-btn>
              </v-row>
              <v-row>
                <v-col cols="12"
                  ><span class="subtitle-2"> {{ attributeName }}:</span></v-col
                >
              </v-row>
              <v-row>
                <v-col
                  xl="2"
                  lg="4"
                  md="6"
                  sm="12"
                  v-for="item in collection"
                  :key="item.id"
                >
                  {{ item.name }}
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import ListItem from "@/components/listItems/CheckoutShoppingListItem.vue";
import enumValues from "@/assets/configuration/enums";
export default {
  name: "checkoutShoppingListView",
  components: { ListItem },
  props: ["items"],
  computed: {
    dialogMaxWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "340px";
        case "sm":
          return "450px";
        case "md":
          return "600px";
        case "lg":
          return "800px";
        default:
          return "1400px";
      }
    },
    enums: function () {
      return enumValues;
    },
  },
  data: function () {
    return {
      attributeName: "Groups",
      collection: [],
      dialogVisible: false,
    };
  },
  methods: {
    closeModal() {
      this.dialogVisible = false;
    },
    launchCollectionDialog(eventValue) {
      this.attributeName =
        eventValue.mode === this.enums.ATTRIBUTE_TYPE.GROUP ? "Groups" : "Tags";
      this.collection = eventValue.collection;
      this.dialogVisible = true;
    },
  },
};
</script>

<style lang="scss"></style>
