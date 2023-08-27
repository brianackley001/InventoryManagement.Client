<template>
  <v-row justify="center">
    <v-dialog v-model="dialogVisible" persistent fullscreen>
      <v-card v-show="!loading">
        <v-card-text>
          <v-container>
            <v-row>
              <v-spacer></v-spacer>
              <v-btn icon small @click="closeModal()">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-row>
            <v-row>
              <v-col>
                <v-btn
                  x-small
                  class="item-detail-toolbar-btn"
                  @click="toggleEditMode"
                  v-show="!isCreateMode"
                  fab
                  :color="editIconColor"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  x-small
                  v-show="isEditMode"
                  class="item-detail-toolbar-btn"
                  fab
                  :color="isDirtyItemColor"
                  :disabled="!itemIsDirty && !attributeCollectionIsDirty"
                  @click="saveItem"
                >
                  <v-icon>mdi-content-save</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row v-show="!isEditMode">
              <v-col
                ><span
                  class="subtitle-1 text-truncate"
                  v-text="selectedItem.name"
                  @click="toggleEditMode"
                  v-show="!isEditMode"
                ></span
              ></v-col>
            </v-row>
            <v-row v-show="isEditMode">
              <v-col>
                <v-text-field
                  label="Name"
                  dense
                  hide-details
                  clearable
                  color="blue-grey darken-1"
                  v-model.lazy="formName"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row v-show="!isEditMode" @click="toggleEditMode">
              <v-col>
                {{ selectedItem.description }}
              </v-col>
            </v-row>
            <v-row v-show="isEditMode">
              <v-col>
                <v-textarea
                  label="Description"
                  auto-grow
                  flat
                  outlined
                  clearable
                  color="blue-grey darken-1"
                  v-model.lazy="formDescription"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <AmountValueSlider
                  v-show="!loading"
                  :amountValueProperty="selectedItem.amountValue"
                  v-on:on-amount-value-updated="amountValueUpdated"
                />
              </v-col>
            </v-row>
            <AttributeItemSelect
              :attributeModifications.sync="attributeModifications.groups"
              :attributeType="enums.ATTRIBUTE_TYPE.GROUP"
              :attributeCollection="selectedItem.groups"
              :isEditMode="isEditMode"
            />
            <AttributeItemSelect
              :attributeModifications.sync="attributeModifications.tags"
              :attributeType="enums.ATTRIBUTE_TYPE.TAG"
              :attributeCollection="selectedItem.tags"
              :isEditMode="isEditMode"
            />
            <AttributeItemSelect
              :attributeModifications.sync="
                attributeModifications.shoppingLists
              "
              :attributeType="enums.ATTRIBUTE_TYPE.SHOPPING_LIST"
              :attributeCollection="selectedItem.shoppingLists"
              :isEditMode="isEditMode"
            />
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import AmountValueSlider from "@/components/AmountValueSlider.vue";
import AttributeItemSelect from "@/components/AttributeItemSelect.vue";
import enumValues from "@/assets/configuration/enums";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "ItemDetailModal",
  components: {
    AmountValueSlider,
    AttributeItemSelect,
  },
  computed: {
    ...mapGetters("appState", ["loading"]),
    ...mapGetters("items", [
      "dialogEditMode",
      "dialogVisible",
      "isCreateMode",
      "itemIsDirty",
      "selectedItem",
    ]),
    amountValue: function () {
      return this.selectedItem && this.selectedItem.amountValue
        ? this.selectedItem.amountValue
        : 2;
    },
    attributeCollectionIsDirty: function () {
      let isDirty = false;

      if (
        this.attributeModifications.groups.added &&
        this.attributeModifications.shoppingLists.added &&
        this.attributeModifications.tags.added &&
        this.selectedItem.groups &&
        this.selectedItem.shoppingLists &&
        this.selectedItem.tags
      ) {
        let pristineGroups = this.selectedItem.groups
          .filter((g) => {
            return g.isSelected;
          })
          .map((i) => {
            return i.id;
          });
        let pristineTags = this.selectedItem.tags
          .filter((t) => {
            return t.isSelected;
          })
          .map((i) => {
            return i.id;
          });
        let pristineShoppingLists = this.selectedItem.shoppingLists
          .filter((s) => {
            return s.isSelected;
          })
          .map((i) => {
            return i.id;
          });
        isDirty =
          !this.arrayEquals(
            pristineGroups,
            this.attributeModifications.groups.added
          ) ||
          !this.arrayEquals(
            pristineTags,
            this.attributeModifications.tags.added
          ) ||
          !this.arrayEquals(
            pristineShoppingLists,
            this.attributeModifications.shoppingLists.added
          );
      }
      return isDirty;
    },
    editIconColor: function () {
      return this.isEditMode ? "secondary" : "";
    },
    enums: function () {
      return enumValues;
    },
    formName: {
      get: function () {
        return this.selectedItem.name;
      },
      set: function (name) {
        this.setItem({ name });
      },
    },
    formDescription: {
      get: function () {
        return this.selectedItem.description;
      },
      set: function (description) {
        this.setItem({ description });
      },
    },
    isDirtyItemColor: function () {
      return this.itemIsDirty || this.attributeCollectionIsDirty
        ? "secondary"
        : "";
    },
    isEditMode: {
      get: function () {
        return this.dialogEditMode || this.isCreateMode;
      },
      set: function (newValue) {
        this.setDialogEditMode(newValue);
      },
    },
  },
  data: () => ({
    attributeModifications: {
      groups: {
        added: new Array(),
      },
      shoppingLists: {
        added: new Array(),
      },
      tags: {
        added: new Array(),
      },
    },
    displayUnsavedDataPrompt: false,
    overrideItemIsDirty: false,
  }),
  methods: {
    ...mapActions("attributeList", {
      toggleCreateNewAttributeModal: "setDialogVisible",
      setRefreshItemDetail: "setRefreshItemDetail",
    }),
    ...mapActions("items", [
      "resetSelectedItem",
      "resetNewItemAssociatedAttribute",
      "setCreateMode",
      "setDialogEditMode",
      "setDialogVisible",
      "saveItemDetail",
      "setItem",
    ]),
    ...mapActions("selections", ["setCallToAction"]),
    amountValueUpdated(amountValue) {
      this.setItem({ amountValue });
      if (!this.isEditMode) this.toggleEditMode();
    },
    arrayEquals(a, b) {
      return (
        Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index])
      );
    },
    cancelEdit() {
      this.overrideItemIsDirty = true;
      this.closeModal();
    },
    async confirmAbandonForm() {
      let response = await this.$root.$confirm.open(
        "Discard changes?",
        `You have made changes to this item. Please click "Yes" to discard these changes, or "Cancel" to save your changes`,
        { color: "primary" }
      );
      if (response) {
        this.dismissUnsavedDataPrompt();
      } else {
        this.displayUnsavedDataPrompt = false;
      }
    },
    clearAttributeModifications() {
      // Clear attributeModifications
      this.attributeModifications.groups.added.length = 0;
      this.attributeModifications.shoppingLists.added.length = 0;
      this.attributeModifications.tags.added.length = 0;
    },
    closeModal() {
      if (!this.overrideItemIsDirty)
        this.displayUnsavedDataPrompt = this.itemIsDirty;
      else this.displayUnsavedDataPrompt = false;

      if (this.displayUnsavedDataPrompt) this.confirmAbandonForm();

      if (!this.displayUnsavedDataPrompt) {
        this.isEditMode = false;
        this.setCreateMode(false);
        this.overrideItemIsDirty = false;
        this.resetSelectedItem();
        this.resetNewItemAssociatedAttribute();
        this.setDialogVisible(false);
      }
      this.clearAttributeModifications();
    },
    dismissUnsavedDataPrompt() {
      this.overrideItemIsDirty = true;
      this.closeModal();
    },
    async saveItem() {
      const itemPayload = {
        item: this.selectedItem,
        attributeCollection: this.attributeModifications,
      };
      const result = await this.saveItemDetail(itemPayload);
      if (result) {
        this.clearAttributeModifications();
        this.resetSelectedItem();
        this.closeModal();
      }
    },
    mapSelectedItemAttributes() {
      this.attributeModifications.groups.added = this.selectedItem.groups
        .filter((i) => {
          return i.isSelected;
        })
        .map((i) => {
          return i.id;
        });
      this.attributeModifications.shoppingLists.added = this.selectedItem.shoppingLists
        .filter((i) => {
          return i.isSelected;
        })
        .map((i) => {
          return i.id;
        });
      this.attributeModifications.tags.added = this.selectedItem.tags
        .filter((i) => {
          return i.isSelected;
        })
        .map((i) => {
          return i.id;
        });
    },
    refreshItemDetailAttributes(result) {
      // Item Detail is refreshed in Create New Attribute Menu event handler
      console.log(`result: ${JSON.stringify(result)}`);
      switch (result.attributeType) {
        case this.enums.ATTRIBUTE_TYPE.SHOPPING_LIST:
          this.addShoppingLists.push(result.id);
          break;
        case this.enums.ATTRIBUTE_TYPE.TAG:
          this.addTags.push(result.id);
          break;
        default:
          this.addGroups.push(result.id);
          break;
      }
    },
    toggleEditMode() {
      if (!this.isCreateMode) this.mapSelectedItemAttributes();
      this.setDialogEditMode(!this.isEditMode);
    },
  },
  created() {
    this.$eventHub.$on(
      "item-detail-create-mode-click",
      this.clearAttributeModifications
    );
  },
  beforeDestroy() {
    // Make sure to cleanup SignalR event handlers when removing the component
    this.$eventHub.$off("item-detail-create-mode-click");
  },
};
</script>

<style lang="scss" scoped>
.item-detail-toolbar-btn {
  margin-right: 18px;
}
</style>
