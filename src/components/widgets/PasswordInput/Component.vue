<template>
  <cInput
    v-model="localValue"
    :type="getType"
    hint="Минимально 8 символов"
    :hide-details="false"
    :error="error"
    :autocomplete="getAutocomplete"
  >
    <template #append-inner v-if="localValue">
      <v-icon
        @click.stop.prevent="togglePasswordVisibility"
      >
        {{ showPassword ? "mdi-eye" : "mdi-eye-off" }}
      </v-icon>
    </template>
  </cInput>
</template>

<script>
export default {
  name: "c-password-input",
  data() {
    return {
      showPassword: false,
      localValue: this.modelValue,
    };
  },
  computed: {
    getType() {
      return this.showPassword ? "text" : "password";
    },
    getAutocomplete() {
      return this.isAutocompleteHidden ? "new-password" : "current-password";
    },
  },
  props: {
    modelValue: String,
    isAutocompleteHidden: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Boolean,
      default: false,
    }
  },
  watch: {
    modelValue(newValue) {
      this.localValue = newValue;
    },
    localValue(newValue) {
      this.$emit("update:modelValue", newValue);
    },
  },
  methods: {
    togglePasswordVisibility(event) {
      event.preventDefault();
      event.stopPropagation();
      this.showPassword = !this.showPassword;
    },
  },
};
</script>

<style scoped>
</style>
