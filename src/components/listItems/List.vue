<template>
  <div class="list-view-container-block">
    <v-list three-line>
      <ListItem
        v-for="(i, index) in items"
        :item="i"
        :attributeType="attributeType"
        :key="index"
      />
    </v-list>
  </div>
</template>

<script>
import ListItem from "@/components/listItems/ListItem.vue";
export default {
  name: "listView",
  components: { ListItem },
  props: ["attributeType", "items"],
  data: function () {
    return {};
  },
};
</script>

<style lang="scss"></style>
