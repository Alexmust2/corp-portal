<template>
  <v-checkbox
    true-icon="mdi-checkbox-outline"
    base-color="secondary"
    color="accent"
    :ripple="false"
    :hide-details="true"
    :model-value="isChecked"
    @update:model-value="$emit('update:modelValue', $event)"
    :disabled="disabled"
    density="compact"
  >
    <template v-slot:label>
      <span class="checkbox-label">
        <slot>{{ label }}</slot>
      </span>
    </template>
  </v-checkbox>
</template>

<script>
import { useTheme } from "vuetify/lib/framework.mjs";

export default {
name: "c-checkbox",
props: {
  modelValue: Boolean,
  disabled: Boolean,
  label: String,
},
data() {
  return {  
    isChecked: this.modelValue,
  };
},
watch: {
  modelValue(val) {
    this.isChecked = val;
  },
},
setup() {
  const theme = useTheme();
  return { theme };
},
};
</script>

<style lang="scss" scoped>

.checkbox-label {
color: rgb(var(--v-theme-primary));
font-size: 18px;
padding-left: 8px;
}

</style>
