<template>
  <!-- view in statements header -->
  <div v-if="isHeaderContent">
    <div
      v-for="(item, index) in modelValue"
      :key="index"
      :class="headerContentClass"
    >
      <div class="header-content-row">
        <div>{{ item.name }}</div>
        <div>{{ item.quantity }} шт</div>
      </div>
      <div class="header-content-row">
        <div>Артикул:</div>
        <div>{{ item.article }}</div>
      </div>
    </div>
  </div>
  <div v-else>
    <!-- Заголовки -->
    <v-row class="flex-nowrap">
      <v-col v-for="(column, index) in columns" :key="index" :cols="column.col">
        <h2 class="mb-3">{{ column.label }}</h2>
      </v-col>
    </v-row>

    <!-- Строки с данными -->
    <div class="table" v-auto-animate>
      <v-row v-for="(row, rowIndex) in modelValue" :key="rowIndex">
        <v-col
          v-for="(column, colIndex) in columns"
          :key="colIndex"
          :cols="
            isMobile
              ? ''
              : colIndex === 0 && showDeleteColumn
              ? column.col - 1
              : column.col
          "
        >
          <template v-if="readonly">
            <span>{{ row[column.name] }}</span>
          </template>
          <template v-else>
            <c-input
              v-model="row[column.name]"
              :type="column.type || 'text'"
              :required="column.required"
              :disabled="disabled || readonly"
              :readonly="readonly"
              :max="column.max"
              density="compact"
              variant="outlined"
              :min="column.type === 'number' ? column.min : ''"
              :placeholder="column.placeholder"
            />
          </template>
        </v-col>
        <v-col
          v-if="showDeleteColumn"
          cols="auto"
          class="d-flex justify-center align-center"
        >
          <v-icon
            v-if="!readonly"
            color="red"
            @click="deleteRow(rowIndex)"
            class="clickable-icon"
          >
            mdi-close
          </v-icon>
        </v-col>
      </v-row>
    </div>

    <!-- Кнопка добавления -->
    <div class="mt-6">
      <span v-if="showAddButton" @click="addRow" class="add-row-link">
        Добавить строку
      </span>
    </div>
  </div>
</template>

<script>
import { vAutoAnimate } from "@formkit/auto-animate/vue";
export default {
  name: "CTableInput",
  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      required: true,
    },
    disabled: Boolean,
    readonly: Boolean,
    hideAddButton: Boolean,
    isHeaderContent: Boolean,
    headerContentClass: String,
  },
  directives: {
    autoAnimate: vAutoAnimate,
  },
  computed: {
    isMobile() {
      return !this.$vuetify.display.mdAndUp;
    },
    showAddButton() {
      return !this.hideAddButton && !this.readonly;
    },
    showDeleteColumn() {
      return this.modelValue.length > 1;
    },
  },
  emits: ["update:modelValue"],
  created() {
    // Автоматически добавляем строку, если данных нет
    if (this.modelValue.length === 0) {
      this.addRow();
    }
  },
  methods: {
    addRow() {
      const newRow = this.columns.reduce((acc, column) => {
        acc[column.name] = column.type === "number" ? 0 : "";
        return acc;
      }, {});
      this.$emit("update:modelValue", [...this.modelValue, newRow]);
    },
    deleteRow(index) {
      const newRows = this.modelValue.filter((_, i) => i !== index);
      this.$emit("update:modelValue", newRows);
    },
  },
  unmounted() {
  this.$emit('update:modelValue', []);
}
};
</script>

<style scoped>
.table {
  margin-left: 8px;
  .v-col {
    padding: 4px !important;
  }
}
.clickable-icon {
  cursor: pointer;
}

.add-row-link {
  font-size: 16px;
  line-height: 16px;
  letter-spacing: 0.03em;
  text-decoration-line: underline;
  text-decoration-skip-ink: none;
  color: rgb(var(--v-theme-gray));
  cursor: pointer;
  user-select: none;
  width: 100%;
  text-align: start;
  display: inline-block;
}

.order-goods {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
  .header-content-row {
    display: flex;
    justify-content: space-between;
    > *:first-child {
      color: rgb(var(--v-theme-secondary));
      text-transform: capitalize;
    }
  }
}
</style>
