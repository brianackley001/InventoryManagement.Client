<template>
  <v-row justify="center">
    <v-dialog
      v-model="showDialogPropValue"
      persistent
      max-width="100%"
      :retain-focus="retainFocus"
    >
      <v-card>
        <v-card-title>
          <span class="subtitle-2">{{ actionLabelText }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row :data-item="item">
              <v-col>
                <v-text-field
                  :label="`${attributeTypeTitle} name`"
                  dense
                  hide-details
                  v-model="formName"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <p class="font-italic">{{ itemAssociationLabel }}</p>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeModal">Close</v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="saveItem"
            :disabled="saveButtonDisabled"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import enumValues from "@/assets/configuration/enums";
export default {
  name: "UpsertAttributeItemModal",
  components: {},
  props: {
    attributeType: { type: String, required: true },
    attributeTypeTitle: { type: String, required: true },
    createMode: { type: Boolean, default: false },
    showDialog: { type: Boolean, required: true, default: false },
  },
  computed: {
    ...mapGetters("attributeList", ["dialogEditMode", "item"]),
    ...mapGetters("session", ["currentSubscription"]),
    actionLabelText: function () {
      return this.createMode
        ? `Create new ${this.attributeTypeTitle}`
        : `Edit ${this.attributeTypeTitle}`;
    },
    enums: function () {
      return enumValues;
    },
    formName: {
      get: function () {
        return this.item.name;
      },
      set: function (name) {
        this.setItem({ name });
      },
    },
    itemAssociationLabel: function () {
      const plural = this.item.itemCount === 1 ? "item" : "items";
      return `${this.attributeTypeTitle} has ${this.item.itemCount} ${plural} currently associated`;
    },
    itemSubscriptionId: {
      get: function () {
        return this.currentSubscription[0].id;
      },
      set: function (subscriptionId) {
        this.setItem({ subscriptionId });
      },
    },
    saveButtonDisabled: function () {
      return this.item.name.length < 1;
    },
  },
  data: () => ({
    retainFocus: false,
    showDialogPropValue: false,
  }),
  methods: {
    ...mapActions("attributeList", [
      "setDialogCreateMode",
      "setDialogVisible",
      "setItem",
    ]),
    ...mapActions("groups", ["upsertGroup"]),
    ...mapActions("items", ["refreshItemAttributeCollection"]),
    ...mapActions("shoppingLists", ["upsertShoppingList"]),
    ...mapActions("tags", ["upsertTag"]),
    async saveItem() {
      let saveResult = null;

      let newAttribute = {
        subscriptionId: this.itemSubscriptionId,
        name: this.formName,
        id: -1,
      };

      switch (this.attributeType) {
        case this.enums.ATTRIBUTE_TYPE.SHOPPING_LIST:
          saveResult = await this.upsertShoppingList({
            bulkUpload: true,
            isSelected: true,
            shoppingList: this.createMode ? newAttribute : this.item,
            parentModalExists: false,
          });
          break;
        case this.enums.ATTRIBUTE_TYPE.TAG:
          saveResult = await this.upsertTag({
            bulkUpload: true,
            isSelected: true,
            tag: this.createMode ? newAttribute : this.item,
            parentModalExists: false,
          });
          break;
        default:
          saveResult = await this.upsertGroup({
            bulkUpload: true,
            group: this.createMode ? newAttribute : this.item,
            isSelected: true,
            parentModalExists: false,
          });
          break;
      }
      let eventName = "";
      switch (this.attributeType) {
        case this.enums.ATTRIBUTE_TYPE.TAG:
          eventName = "on-upsert-tag-attribute-completed";
          break;
        case this.enums.ATTRIBUTE_TYPE.SHOPPING_LIST:
          eventName = "on-upsert-shopping-list-attribute-completed";
          break;
        default:
          eventName = "on-upsert-group-attribute-completed";
          break;
      }
      this.$eventHub.$emit(eventName, saveResult);

      if (this.createMode) {
        this.setDialogCreateMode(false);
      }
      this.closeModal();
    },
    closeModal() {
      this.formName = "";
      this.setDialogVisible(false);
    },
  },
  watch: {
    showDialog: function () {
      this.showDialogPropValue = this.showDialog;
    },
  },
};
</script>
