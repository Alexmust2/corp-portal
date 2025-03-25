<template>
  <v-dialog v-model="showDialog">
    <div class="confirm-dialog">
      <div class="d-flex justify-space-between align-center mb-3">
        <h3 class="h2">{{ mergedOptions.title }}</h3>
        <v-icon icon="mdi-close" @click="closeDialog()" />
      </div>
      <p class="content">{{ mergedOptions.text }}</p>
      <div :class="{ actions: !singleButton, 'actions-one': singleButton }">
        <button @click="confirm" :class="mergedOptions.type">
          {{ mergedOptions.confirmText }}
        </button>

        <button v-if="!singleButton" class="cancel" @click="closeDialog()">
          {{ mergedOptions.cancelText }}
        </button>
      </div>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: "confirm-modal",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    singleButton: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["update:modelValue", "confirm"],
  data() {
    return {
      showDialog: this.modelValue,
    };
  },
  computed: {
    mergedOptions() {
      return {
        title: "Подтвердите действие",
        text: "Вы уверены что хотите продолжить",
        confirmText: "Подтверждаю",
        cancelText: "Отмена",
        type: "delete",
        ...this.options,
      };
    },
  },
  watch: {
    modelValue(newValue) {
      this.showDialog = newValue;
    },
    showDialog(newValue) {
      this.$emit("update:modelValue", newValue);
    },
  },
  methods: {
    confirm() {
      this.$emit("confirm");
      this.closeDialog();
    },
    closeDialog() {
      this.$emit("close");
      this.showDialog = false;
    },
  },
};
</script>

<style lang="scss" scoped src="./styles.scss" />
