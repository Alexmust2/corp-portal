<template>
  <v-chip :color="color" :class="cclass"><slot/></v-chip>
</template>

<script>
export default {
  name: 'c-status',
  props: {
    color: {
      type: String,
      default: "grey"
    },
    cclass: {
      type: String,
      default: "ma-2"
    }
  }
}
</script>
