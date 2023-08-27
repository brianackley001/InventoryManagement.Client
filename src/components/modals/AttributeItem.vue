<template>
  <v-row justify="center">
    <v-dialog
      v-model="showDialogPropValue"
      persistent
      max-width="300px"
      :retain-focus="retainFocus"
    >
      <v-card>
        <v-card-title>
          <span class="subtitle-2">Create a {{ attributeTypeTitle }}</span>
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
            <v-row v-show="isItemMapping">
              <v-col>
                Create a new {{ attributeTypeTitle }} for:
                <v-chip
                  v-for="(i, index) in attributeItemCollection"
                  :key="index"
                  class="ma-2"
                  color="primary"
                  outlined
                  label
                  v-text="i.name"
                />
              </v-col>
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
  name: "CreateAttributeItemModal",
  components: {},
  props: {
    attributeTypeTitle: { type: String, required: true },
    isItemMapping: { type: Boolean, required: true },
    parentModalExists: { type: Boolean, required: true },
    showDialog: { type: Boolean, required: true, default: false },
  },
  computed: {
    ...mapGetters("attributeList", ["dialogEditMode", "item"]),
    ...mapGetters("items", ["attributeItemCollection", "selectedItem"]),
    ...mapGetters("selections", ["callToAction", "mappingCollection"]),
    ...mapGetters("session", ["currentSubscription"]),
    actionLabelText: function () {
      return this.isEditMode ? "Edit" : "Add new";
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
    itemSubscriptionId: {
      get: function () {
        return this.currentSubscription[0].id;
      },
      set: function (subscriptionId) {
        this.setItem({ subscriptionId });
      },
    },
    isEditMode: {
      get: function () {
        return this.dialogEditMode;
      },
      set: function (newValue) {
        this.setDialogEditMode(newValue);
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
    ...mapActions("attributeList", ["setDialogEditMode", "setItem"]),
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

      switch (this.callToAction.attributeType) {
        case this.enums.ATTRIBUTE_TYPE.SHOPPING_LIST:
          saveResult = await this.upsertShoppingList({
            isSelected: true,
            shoppingList: newAttribute,
            parentModalExists: this.parentModalExists,
          });
          break;
        case this.enums.ATTRIBUTE_TYPE.TAG:
          saveResult = await this.upsertTag({
            isSelected: true,
            tag: newAttribute,
            parentModalExists: this.parentModalExists,
          });
          break;
        default:
          saveResult = await this.upsertGroup({
            group: newAttribute,
            isSelected: true,
            parentModalExists: this.parentModalExists,
          });
          break;
      }

      await this.refreshItemAttributeCollection({
        attibuteType: this.callToAction.attributeType,
        attributeItem: saveResult,
      });
      this.formName = "";
      // emit values to synchronize parent component
      this.$emit("on-create-attribute-completed", saveResult);
    },
    closeModal() {
      this.formName = "";
      // emit values to synchronize parent component
      this.$emit("on-create-attribute-cancelled", true);
    },
  },
  watch: {
    showDialog: function () {
      this.showDialogPropValue = this.showDialog;
    },
  },
};
</script>
