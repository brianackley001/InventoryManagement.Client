<template>
  <v-slider
    class="slider-form"
    :tick-labels="statusLabels"
    v-model="amountValue"
    :value="amountValue"
    :max="2"
    ticks="always"
    tick-size="1"
    step="1"
    thumb-label="always"
    :thumb-color="thumbColor"
    dense
    @change="updateAmountValueEvent"
  >
    <template v-slot:thumb-label="props">
      <span class="slider-form">
        <v-icon :color="iconStatusColors[props.value]">{{
          setGaugeValue(props.value)
        }}</v-icon>
      </span>
    </template>
  </v-slider>
</template>
<script>
import enumValues from "@/assets/configuration/enums";
export default {
  name: "AmountValueSlider",
  props: {
    amountValueProperty: { type: Number, required: true, default: 2 },
  },
  computed: {
    enums: function () {
      return enumValues;
    },
    thumbColor: function () {
      return this.$vuetify.theme.dark
        ? this.enums.ITEM_QUANTITY.THUMB_COLOR.DARK
        : this.enums.ITEM_QUANTITY.THUMB_COLOR.LIGHT;
    },
  },
  data: () => ({
    amountValue: 2,
    statusLabels: ["Empty", "Low", "Good"],
    iconStatusColors: [
      enumValues.ITEM_QUANTITY.ICON_COLOR.EMPTY,
      enumValues.ITEM_QUANTITY.ICON_COLOR.LOW,
      enumValues.ITEM_QUANTITY.ICON_COLOR.FULL,
    ],
    icons: [
      enumValues.ITEM_QUANTITY.ICON_CLASS.EMPTY,
      enumValues.ITEM_QUANTITY.ICON_CLASS.LOW,
      enumValues.ITEM_QUANTITY.ICON_CLASS.FULL,
    ],
  }),
  methods: {
    setGaugeValue(val) {
      return this.icons[val];
    },
    updateAmountValueEvent(value) {
      if (this.amountValue !== this.amountValueProperty) {
        this.$emit("on-amount-value-updated", value);
      }
    },
  },
  watch: {
    amountValueProperty: function () {
      this.amountValue = this.amountValueProperty;
    },
  },
};
</script>

<style scoped>
.slider-form {
  width: 90%;
  margin-top: 30px;
  margin-left: auto;
  margin-right: auto;
}
</style>
