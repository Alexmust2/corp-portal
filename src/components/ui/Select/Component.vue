<template>
  <div class="c-select-wrapper">
    <h2 v-if="label && !isLabelActive" class="h2 mb-3">{{ label }}</h2>
    <component
      :is="isCombobox ? 'v-combobox' : 'v-select'"
      :model-value="modelValue"
      v-bind="$attrs"
      :ref="isCombobox ? 'combobox' : 'select'"
      class="c-select"
      :class="{
        block,
        success: isFocused || success,
        'label-active': isLabelActive,
        'has-value': hasValue && isLabelActive,
      }"
      hide-details="auto"
      :multiple="multiple"
      @focus="onFocus"
      @blur="onBlur"
      :search="search"
      :filter="customFilter"
      :hide-selected="!$slots.selection && !multiple"
      :hide-no-data="!$slots['no-data']"
      @update:model-value="handleModelValueUpdate"
      @update:search="onUpdateSearch"
    >
      <template v-if="isLabelActive" #prepend-inner>
        <div
          v-if="isLabelActive"
          class="select-label"
          :class="{ 'label-active': internalValue && hasValue }"
        >
          {{ label }}
        </div>
      </template>
      <template #append-inner>
        <v-icon :class="icon ? 'not-animated' : ''">{{
          icon ? icon : "mdi-chevron-down"
        }}</v-icon>
      </template>

      <template v-if="$slots.item" #item="slotProps">
        <slot name="item" v-bind="slotProps"></slot>
      </template>

      <template v-else-if="multiple" #item="slotProps">
        <div
          class="d-flex align-center cursor-pointer pt-2 pb-3 px-3"
          @click="toggleSelection(slotProps.item.value)"
        >
          <c-checkbox
            :value="slotProps.item.value"
            v-model="internalValue"
            @click.stop
            density="compact"
          >
          </c-checkbox>
          <span>
            {{ slotProps.item.value }}
          </span>
        </div>
      </template>

      <template v-if="$slots.selection" #selection="slotProps">
        <slot name="selection" v-bind="slotProps"></slot>
      </template>

      <template v-if="$slots.prepend" #append-item>
        <slot name="prepend"></slot>
      </template>

      <template v-if="$slots['no-data']" #no-data>
        <slot name="no-data">
          <span class="px-4 py-2">Данные отсутствуют</span>
        </slot>
      </template>
    </component>
  </div>
</template>

<script>
import { nextTick } from "vue";

export default {
  name: "c-select",
  inheritAttrs: false,
  props: {
    modelValue: [String, Number, Array],
    icon: {
      type: String,
      default: null,
    },
    block: Boolean,
    label: String,
    isLabelActive: {
      type: Boolean,
      default: false,
    },
    isCombobox: {
      type: Boolean,
      default: false,
    },
    notFocus: {
      type: Boolean,
      default: false,
    },
    isIconHover: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    create: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isFocused: false,
      search: "",
      internalModelValue: this.modelValue,
    };
  },
  methods: {
    onFocus() {
      this.isFocused = true;
    },
    onBlur() {
      if (this.notFocus) return;
      this.isFocused = false;
    },
    async toggleSelection(value) {
      nextTick(() => {
        if (this.internalValue.includes(value)) {
          this.internalValue = this.internalValue.filter((v) => v !== value);
        } else {
          this.internalValue.push(value);
        }
      });
    },
    handleModelValueUpdate(value) {
      this.internalValue = value;
      this.$emit("update:modelValue", value);
    },
    onUpdateSearch(searchValue) {
      this.search = searchValue;
      if (this.isCombobox) {
        if (searchValue.trim() === "") {
          this.internalModelValue = Array.isArray(this.internalModelValue)
            ? this.internalModelValue.filter((value) => {
                if (typeof value === "string") {
                  return value.trim() !== "";
                }
                return true; // Оставляем не-строковые значения без изменений
              })
            : this.internalModelValue;
          this.$emit("update:modelValue", this.internalModelValue);
        }
      }
    },
    clearSearch() {
      this.search = "";
      if (this.$refs.combobox) {
        this.$refs.combobox.search = "";
      }
    },
    customFilter(item, queryText) {
      const itemTitle = item.title || item.value || "";
      const text =
        typeof itemTitle === "string"
          ? itemTitle.toLowerCase()
          : String(itemTitle).toLowerCase();
      const searchText = queryText.toLowerCase();
      return text.indexOf(searchText) > -1;
    },
  },
  computed: {
    internalValue: {
      get() {
        return this.modelValue;
      },
      set(value) {
        if (this.isCombobox && !this.multiple) {
          // Для combobox без multiple используем nextTick
          this.$nextTick(() => {
            if (value !== this.modelValue) {
              this.$emit("update:modelValue", value);
            }
          });
        } else {
          // Для остальных случаев оставляем как есть
          this.$emit("update:modelValue", value);
        }
      },
    },
    hasValue() {
      return Array.isArray(this.internalValue)
        ? this.internalValue.length > 0
        : !!this.internalValue;
    },
  },
  watch: {
    modelValue: {
      handler(newValue, oldValue) {
        this.internalModelValue = newValue;
        if (this.isCombobox && Array.isArray(newValue) && this.multiple) {
          const lastValue = newValue[newValue.length - 1];
          const isValueInItems = this.$attrs.items?.some(
            (item) =>
              item[this.$attrs["item-title"]] === lastValue ||
              item[this.$attrs["item-value"]] === lastValue
          );
          if (!this.create) {
            if (!isValueInItems && lastValue !== undefined) {
              this.internalModelValue = this.internalModelValue.filter(
                (value) => value !== lastValue
              );
              this.$emit("update:modelValue", this.internalModelValue);
            }
            if (newValue.length > (oldValue?.length || 0)) {
              this.$nextTick(() => {
                this.clearSearch();
              });
            }
          }
          console.log("isValueInItems", isValueInItems, oldValue);
        }
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" src="./styles.scss" scoped></style>
