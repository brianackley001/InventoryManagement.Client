<template>
  <v-card>
    <v-card-text>
      <v-card-title>Edit Item</v-card-title>
    </v-card-text>
    <v-form ref="form" lazy-validation>
      <v-textarea
        v-model="item.name"
        label="Name"
        required
        auto-grow
      ></v-textarea>
      <v-textarea
        v-model="item.description"
        label="Description"
        required
        auto-grow
      ></v-textarea>

      <v-slider
        class="slider-form"
        :tick-labels="statusLabels"
        :v-model="this.item.amountRemaining"
        :value="this.item.amountRemaining"
        :max="2"
        ticks="always"
        tick-size="1"
        step="1"
        thumb-label="always"
        thumb-color="white"
      >
        <template v-slot:thumb-label="props">
          <span class="slider-form">
            <v-icon :color="iconStatusColors[props.value]">{{
              season(props.value)
            }}</v-icon>
          </span>
        </template>
      </v-slider>
    </v-form>
  </v-card>
</template>

<script>
import DataItems from "@/assets/data/items.json";
export default {
  name: "ItemDetail",
  data: () => ({
    dataItems: DataItems,
    statusLabels: ["Empty", "Low", "Good"],
    iconStatusColors: ["red darken-1", "amber darken-1", "green"],
    icons: ["mdi-gauge-empty", "mdi-gauge-low", "mdi-gauge-full"],
    item: {},
  }),
  methods: {
    season(val) {
      return this.icons[val];
    },
  },
  mounted() {
    this.item = this.dataItems.find((x) => x.id == this.$route.params.itemId);
  },
};
</script>

<style lang="scss">
.slider-form {
  width: 90%;
  margin-top: 30px;
  margin-left: auto;
  margin-right: auto;
}
</style>
