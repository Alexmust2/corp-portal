<template>
  <div
    class="c-input-wrapper"
    :class="$attrs.class"
    :style="{ '--input-height': computedHeight }"
  >
    <h2 v-if="label" class="h2 mb-3 text-primary">{{ label }}</h2>

    <v-text-field
      v-model="internalValue"
      hide-details="auto"
      :error="error"
      v-bind="filteredAttrs"
      :class="[
        'c-input',
        {
          'w-100': block,
          success: isFocused || success,
          'not-bordered': notBorder,
          number: type === 'number',
          error: error,
        },
      ]"
      :prefix="prefix"
      variant="outlined"
      @focus="onFocus"
      @blur="onBlur"
      :disabled="disabled"
      :type="type"
      v-maska="mask ? { mask } : {}"
    >
      <template v-slot:prepend-inner>
        <div
          v-if="type === 'number' && !disabled"
          class="number-controls d-flex"
        >
          <v-icon class="decrement" size="24" @click="decrement"
            >mdi-minus</v-icon
          >
          <slot name="prepend-inner"></slot>
        </div>
      </template>

      <template v-slot:append-inner>
        <div
          v-if="type === 'number' && !disabled"
          class="number-controls d-flex"
        >
          <v-icon class="increment" size="24" @click="increment"
            >mdi-plus</v-icon
          >
        </div>
        <slot name="append-inner"></slot>
      </template>
    </v-text-field>
  </div>
</template>

<script>
import { vMaska } from "maska/vue";
export default {
  name: "c-input",
  directives: {
    maska: vMaska,
  },
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    block: {
      type: Boolean,
      default: false,
    },
    success: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Boolean,
      default: false,
    },
    mask: {
      type: [String, Object],
      default: null,
    },
    label: {
      type: String,
      default: "",
    },
    prefix: {
      type: String,
      default: "",
    },
    notFocus: {
      type: Boolean,
      default: false,
    },
    notBorder: {
      type: Boolean,
      default: false,
    },
    height: {
      type: [Number, String],
      default: 50,
    },
    type: {
      type: String,
      default: "text",
    },
    min: {
      type: Number,
      default: null,
    },
    max: {
      type: Number,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isFocused: false,
    };
  },
  computed: {
    internalValue: {
      get() {
        if (this.type !== "number") return this.modelValue;
        let value = Number(this.modelValue) || 0;
        if (this.min !== null && value < this.min) return this.min;
        if (this.max !== null && value > this.max) return this.max;
        return value;
      },
      set(value) {
        if (this.type !== "number") {
          this.$emit("update:modelValue", value);
          return;
        }
        value = Number(value) || 0;
        if (this.min !== null && value < this.min) value = this.min;
        if (this.max !== null && value > this.max) value = this.max;
        this.$emit("update:modelValue", value);
      },
    },
    filteredAttrs() {
      // eslint-disable-next-line
      const { class: _, height, ...attrs } = this.$attrs;
      return attrs;
    },
    computedHeight() {
      // Проверяем, является ли height числом или строкой
      return typeof this.height === "number" ? `${this.height}px` : this.height;
    },
  },
  methods: {
    onFocus() {
      if (this.notFocus || this.error) return;
      this.isFocused = true;
    },
    onBlur() {
      if (this.notFocus) return;
      this.isFocused = false;
    },
    decrement() {
      if (this.disabled || this.type !== "number") return;
      let newValue = Number(this.internalValue) - 1;
      if (this.min !== null && newValue < this.min) newValue = this.min;
      this.internalValue = newValue;
    },
    increment() {
      if (this.disabled || this.type !== "number") return;
      let newValue = Number(this.internalValue) + 1;
      if (this.max !== null && newValue > this.max) newValue = this.max;
      this.internalValue = newValue;
    },
  },
};
</script>

<style lang="scss" scoped>
.c-input-wrapper {
  flex: 1;
  /* Используем CSS-переменную для высоты */
  --input-height: 50px; /* Значение по умолчанию */
  :has(input[type="number"]) {
    min-width: 40px;
  }
}

.c-input {
  &.error {
    :deep(.v-field__outline) {
      --v-field-border-opacity: 1;
      --v-field-border-width: 2px;
      border-color: rgba(235, 113, 113, 1)
   
    }

    :deep(.v-field__input) {
      
      color: rgba(235, 113, 113, 1)
    }

  :deep(.v-input__details) {
    padding-top: 8px;
    padding-inline: 0px;
    .v-messages {
      color: rgba(235, 113, 113, 1);
      &__message{
        font-size: 14px;
        font-weight: 400;
        line-height: 16.94px;
        font-family: 'Inter';
      }
    }
  }
    :deep(.v-field__prepend-inner),
    :deep(.v-field__append-inner) {
      .v-icon {
        color: rgba(120, 120, 120, 1);
      }
    }
  }

  ::v-deep .v-text-field__prefix {
    margin: auto 0;
    color: rgb(var(--v-theme-primary));
  }

  :deep(input)::-webkit-inner-spin-button,
  :deep(input)::-webkit-outer-spin-button {
    -webkit-appearance: none;
    user-select: none;
    pointer-events: none;
    margin: 0;
  }

  .number-controls .v-icon {
    color: rgb(var(--v-theme-secondary));
    transition: color 0.3s, background-color 0.3s, outline 0.15s;
    border-radius: 4px;
    padding: 16px;
    outline: 2px solid transparent;
    &:hover {
      color: rgb(var(--v-theme-accent));
      background-color: rgba(var(--v-theme-gray), 0.125);
    }
    &:active {
      outline: 1px solid rgb(var(--v-theme-accent));
    }
  }

  ::v-deep input {
    height: var(--input-height);
    /* Дополнительно можно настроить высоту контейнера, если требуется */
    box-sizing: border-box;
  }

  /* Если необходимо, можно настроить высоту самого v-text-field */
  ::v-deep .v-input__control {
    height: var(--input-height);
  }
}
:deep(.decrement) {
  margin-left: -4px;
}
:deep(.increment) {
  margin-right: -4px;
}
</style>
