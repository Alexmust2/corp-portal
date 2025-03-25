<template>
  <cInput
    :prefix="prefix"
    v-model="inputValue"
    ref="phoneInput"
    maxlength="18"
    :error="error"
    :hide-details="false"
    v-maska="'+7 (###) ###-##-##'"
    autocomplete="tel-artis"
  />
</template>

<script>
import { vMaska } from "maska/vue";

export default {
  name: "phone-input",
  props: {
    modelValue: String,
    error: Boolean,
  },
  emits: [
    "update:modelValue",
    "clear-error",
    "phone-valid",
    "phone-empty",
    "phone-invalid",
  ],
  directives: { maska: vMaska },
  data() {
    return {
      digits: "",
      prefix: "",
    };
  },
  computed: {
    inputValue: {
      get() {
        return this.formatDigits(this.digits);
      },
      set(newVal) {
        this.$emit("clear-error");

        const digits = this.extractDigits(newVal);
        this.digits = digits;

        const newModelValue = digits.length > 0 ? "8" + digits : "";

        this.$emit("update:modelValue", newModelValue);

        this.checkPhoneStatus(newModelValue);
      },
    },
  },
  watch: {
    modelValue(newVal) {
      const extractedDigits = this.extractDigits(newVal);
      this.digits = extractedDigits;
      this.checkPhoneStatus(newVal);
    },
  },
  mounted() {
    if (
      typeof this.modelValue === "string" &&
      (this.hasValidPrefix(this.modelValue))
    ) {
      this.checkPhoneStatus(this.modelValue);
      this.digits = this.extractDigits(this.modelValue);
    }
  },
  methods: {
    formatDigits(digits) {
      let formatted = "";
      if (digits.length > 0) {
        formatted += "(" + digits.substring(0, 3);
      }
      if (digits.length > 3) {
        formatted += ") " + digits.substring(3, 6);
      }
      if (digits.length > 6) {
        formatted += "-" + digits.substring(6, 8);
      }
      if (digits.length > 8) {
        formatted += "-" + digits.substring(8, 10);
      }
      return formatted;
    },

    checkPhoneStatus(phoneValue) {
      if (typeof phoneValue !== "string") {
        this.$emit("phone-valid", false);
        return;
      }
      const length = phoneValue.length;
      if (length === 11) {
        this.$emit("phone-valid", true);
      } else if (length === 0) {
        this.$emit("phone-empty");
      } else {
        this.$emit("phone-valid", false);
      }
    },

    extractDigits(value) {
      if (typeof value !== "string") return "";

      if (value.startsWith("+7")) {
        return value.slice(2).replace(/\D/g, "").slice(0, 10);
      } else if (value.startsWith("8")) {
        return value.slice(1).replace(/\D/g, "").slice(0, 10);
      } else if (value.startsWith("7")) {
        return value.slice(1).replace(/\D/g, "").slice(0, 10);
      } else {
        return value.replace(/\D/g, "").slice(0, 10);
      }
    },

    hasValidPrefix(value) {
      return (
        value.startsWith("+7") || value.startsWith("8") || value.startsWith("7")
      );
    },
  },
};
</script>
