<template>
  <div id="createAttributeContainer">
    <v-divider></v-divider>
    <v-list-item @click="toggleForm" v-show="!isEditMode">
      <v-list-item-icon>
        <v-icon>mdi-plus</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>Create new {{ attributeType }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-card elevation="15" outlined v-show="isEditMode">
      <v-card-text>
        <v-list-item-content>
          <v-list-item-title>Create new {{ attributeType }}</v-list-item-title>
          <v-text-field
            dense
            hide-details
            v-model="attributeNameValue"
          ></v-text-field>
        </v-list-item-content>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="toggleForm">Cancel</v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="saveItem"
          :disabled="saveButtonDisabled"
          >Save</v-btn
        >
      </v-card-actions>
    </v-card>
    <div
      id="create-attribute-form-template-bottom-edge"
      style="margin-top: 90px"
      >&nbsp;</div
    >
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import enumValues from "@/assets/configuration/enums";
export default {
  name: "CreateAttributeItem",
  props: {
    attributeType: { type: String, required: true },
    bulkUpload: { type: Boolean, default: false },
  },
  computed: {
    ...mapGetters("session", ["currentSubscription"]),
    attributeTypeValue: function () {
      let retVal = this.attributeType;
      if (this.attributeType == this.enums.SHOPPING_LIST) {
        retVal = "shopping list";
      }
      return retVal;
    },
    enums: function () {
      return enumValues;
    },
    saveButtonDisabled: function () {
      return this.attributeNameValue.length < 1;
    },
  },
  data: () => ({
    attributeNameValue: "",
    isEditMode: false,
  }),
  methods: {
    ...mapActions("groups", ["upsertGroup"]),
    ...mapActions("shoppingLists", ["upsertShoppingList"]),
    ...mapActions("tags", ["upsertTag"]),
    async saveItem() {
      let saveResult = null;

      let newAttribute = {
        subscriptionId: this.currentSubscription[0].id,
        name: this.attributeNameValue,
        id: -1,
      };

      switch (this.attributeType) {
        case this.enums.ATTRIBUTE_TYPE.SHOPPING_LIST:
          saveResult = await this.upsertShoppingList({
            bulkUpload: this.bulkUpload,
            shoppingList: newAttribute,
          });
          break;
        case this.enums.ATTRIBUTE_TYPE.TAG:
          saveResult = await this.upsertTag({
            bulkUpload: this.bulkUpload,
            tag: newAttribute,
          });
          break;
        default:
          saveResult = await this.upsertGroup({
            bulkUpload: this.bulkUpload,
            group: newAttribute,
          });
          break;
      }
      this.attributeNameValue = "";
      // emit values to synchronize parent component
      this.$emit("on-create-attribute-completed", saveResult);
      this.isEditMode = !this.isEditMode;
    },
    toggleForm() {
      this.isEditMode = !this.isEditMode;
      var elmnt = document.getElementById(
        "create-attribute-form-template-bottom-edge"
      );
      elmnt.scrollIntoView();
    },
  },
};
</script>
