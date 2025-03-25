<template>
  <StatementsBase :statements="userStatements">
    <template #statements-list="{ filteredStatements }">
      <div class="statement-table outer-scrollbar">
        <v-data-table
          :headers="headers"
          :items="filteredStatements"
          :loading="loading"
          :items-per-page="userStatements.length"
          :sort-by="[{ key: 'created_at', order: 'desc' }]"
          hide-default-footer
        >
          <template #no-data>
            <div>Заявления отсутствуют</div>
          </template>

          <template #item="{ item }">
            <tr @click="openStatementDetails(item)" class="cursor-pointer">
              <td>
                <div class="d-flex align-center justify-space-between">
                  {{ item.type }}
                </div>
              </td>

              <td>
                <div :style="{ color: getStatusColor(item.status) }">
                  {{ item.status }}
                </div>
              </td>

              <td>{{ item.department }}</td>

              <td>{{ formatDate(item.created_at) }}</td>
            </tr>
          </template>
        </v-data-table>
      </div>
    </template>

    <!-- Дополнительный контент -->
    <template #additional-content>
      <!-- Слайд-панель для подачи заявления -->
      <c-slide-panel v-model="isModalOpen" title="Подача заявления">
        <c-select
          v-model="selectedDepartment"
          :items="departments"
          label="Выберите отдел"
          @change="onDepartmentChange"
        ></c-select>
        <c-select
          v-if="selectedDepartment"
          v-model="selectedStatement"
          :items="availableStatements"
          label="Выберите заявление"
          @change="onStatementChange"
        ></c-select>
        <template v-if="selectedStatement">
          <v-row>
              <template v-for="(field, index) in formFields" :key="index">

                <v-col :cols="field.col || 12">
                  <div>
                    <c-checkbox
                    v-if="field?.isToggled !== undefined"
                    :model-value="field.isToggled"
                    color="rgb(var(--v-theme-accent))"
                    :label="field.toggleLabel"
                    @change="field.isToggled = !field.isToggled"
                  />
                  </div>
                  <component
                    v-if="'isToggled' in field ? field.isToggled : true"
                    :is="field.type"
                    v-model="formData[field.name]"
                    v-bind="field.attrs"
                    :mask="getMaskForField(field.maska)"
                    @input="onTimeInput(field.name, $event)"
                    :upwards-only="field.attrs.upwards"
                    :downwards-only="field.attrs.downwards"
                  ></component>
                </v-col>


              </template>

          </v-row>
        </template>
        <template #footer>
          <c-btn block @click="sendStatement" :disabled="!canSubmit">
            Отправить
          </c-btn>
        </template>
      </c-slide-panel>

      <!-- Слайд-панель для просмотра и обновления заявления -->
      <c-slide-panel
        class="statement-panel statement-creating-panel"
        v-model="isStatementDetailsOpen"
        :title="'Заявление'"
      >

        <div class="header-content">
          <!-- user -->
          <div class="d-flex align-center ga-2">
            <c-avatar
              v-bind="getAvatarProps(userStore.user)"
              size="40"
            ></c-avatar>

            <div>
              <div>
                {{ userStore.user.first_name }} {{ userStore.user.last_name }}
              </div>
              <div>{{ userStore.user.email }}</div>
            </div>
          </div>
          <!-- statement title -->
           <h2 class="mt-5" :class="{'mb-5': viewedFormFields.some(field => field.isHeaderContent)}">{{viewedStatement ? viewedStatement.type : 'Заявление'}}</h2>
           <!-- content with isHeaderContent that filtered out to be first -->
         
          <div
            v-for="(field, index) in viewedFormFields.filter(field => field.isHeaderContent)"
            :key="index"
            :class="field.headerContentClass"
          >
            <template
              v-if="
                field.type === 'c-table-input' &&
                viewedFormData[field.name][0]?.quantity
              "
            >
              <h3>{{ field.attrs.label }}</h3>
              <c-table-input
                :model-value="viewedFormData[field.name] || []"
                :columns="field.attrs.columns"
                :readonly="true"
                :hide-add-button="true"
                :is-header-content="true"
              />
            </template>
            <template v-else>
              <h3>{{ field.attrs.label }}</h3>
              <template v-if="typeof viewedFormData[field.name] === 'boolean'">
                {{ viewedFormData[field.name] ? "Да" : "Нет" }}
              </template>
              <template
                v-else-if="
                  formatDisplayValue(field, viewedFormData[field.name]).length
                "
              >
                {{ formatDisplayValue(field, viewedFormData[field.name]) }}
              </template>
            </template>
          </div>
        
        </div>
        
        <v-row>
          <template v-for="(field, index) in viewedFormFields.filter(field => !field.isHeaderContent)"  :key="index">
            <v-col :cols="field.col || 12" :class="field.headerContentClass">
                <template v-if="field.type === 'c-table-input' && viewedFormData[field.name][0]?.quantity">
                  <h3>{{ field.attrs.label }}</h3>
                  <c-table-input
                    :model-value="viewedFormData[field.name] || []"
                    :columns="field.attrs.columns"
                    :readonly="true"
                    :hide-add-button="true"
                    :is-header-content="true"
                  />
                </template>
                <template v-else>
                  <h3>{{ field.attrs.label }}</h3>
                  <template v-if="typeof viewedFormData[field.name] === 'boolean'">
                    {{ viewedFormData[field.name] ? "Да" : "Нет" }}
                  </template>
                  <template v-else-if="formatDisplayValue(field, viewedFormData[field.name]).length">
                    {{ formatDisplayValue(field, viewedFormData[field.name]) }}
                  </template>
                </template>
            </v-col>
          </template>
        </v-row>

        <template v-if="viewedStatement?.comment">
          <h3>Комментарий от отдела</h3>
          <div>{{ viewedStatement.comment }}</div>
        </template>

        <template #footer>
          <div class="d-flex flex-column ga-2">
            <c-chip
              :color="chipColors[viewedStatement ? viewedStatement.status : '']"
              class="mx-auto w-100"
            >
              {{ viewedStatement ? viewedStatement.status : "" }}
            </c-chip>
          </div>
        </template>
      </c-slide-panel>
    </template>
  </StatementsBase>
</template>

<script>
import StatementsBase from "./StatementsBase.vue";
import CTableInput from "./CTableInput.vue";
import { useHeaderStore } from "@/store/header.store";
import SearchInput from "@/components/widgets/SearchInput";
import jsonData from "./forms.json";
import { socket } from "@/websocket";
import { useUserStore } from "@/store/user.store";
import { getAvatarProps } from "@/globalFunctions/avatarUtils";

export default {
  name: "StatementsClient",
  components: {
    StatementsBase,
    SearchInput,
    CTableInput,
  },
  data() {
    return {
      isModalOpen: false,
      typedSearch: "",
      statusColors: {
        Обработана: "rgb(var(--v-theme-accent))",
        "В работе": "rgb(var(--v-theme-secondary))",
        Отклонено: "rgb(var(--v-theme-red))",
        Отправлена: "rgb(var(--v-theme-primary))",
        Закуплено: "rgb(var(--v-theme-secondary))",
        Выдано: "rgb(var(--v-theme-accent))",
      },
      chipColors: {
        "В работе": "secondary",
        Обработана: "accent",
        Отклонить: "red",
        Отклонено: "red",
        Закуплено: "secondary",
        Выдано: "accent",
        Отправлена: "secondary",
      },
      headers: [
        { title: "Тип", key: "type", width: "50%" },
        { title: "Статус", key: "status", width: "15%" },
        { title: "Отдел", key: "department", width: "20%" },
        { title: "Дата", key: "created_at", width: "15%" },
      ],
      formsData: jsonData,
      departments: Object.keys(jsonData),
      selectedDepartment: null,
      availableStatements: [],
      userStatements: [],
      selectedStatement: null,
      formFields: [],
      allStatements: [],
      formData: {},
      canSubmit: false,
      loading: false,
      isStatementDetailsOpen: false,
      viewedStatement: null,
      viewedFormFields: [],
      viewedFormData: {},
      isEditing: false,
    };
  },
  computed: {
    headerStore() {
      return useHeaderStore();
    },
    isMobile() {
      return !this.$vuetify.display.mdAndUp;
    },
    userStore() {
      return useUserStore();
    },
  },
  watch: {
    formData: {
      handler() {
        this.validateForm();
      },
      deep: true,
    },
    viewedFormData: {
      handler() {
        this.validateViewedFormFields();
      },
      deep: true,
    },
    selectedDepartment() {
      this.onDepartmentChange();
    },
    selectedStatement() {
      this.onStatementChange();
    },
    isStatementDetailsOpen(newVal) {
      if (!newVal) {
        this.resetViewedStatement();
        this.isEditing = false;
      }
    },
  },
  created() {
    this.headerStore.setHeaderButton("Подать заявление", this.createStatement);
    this.fetchStatements();
    socket.on("newStatement", (data) => {
      this.userStatements.push(data);
    });
    socket.on("newStatementStatus", (response) => {
      this.statusUpdate(response);
    });
  },
  methods: {
    getAvatarProps,
    validateViewedFormFields() {
      let valid = true;
      for (let field of this.viewedFormFields) {
        const data = this.viewedFormData[field.name];
        if (
          data === "" ||
          data === null ||
          data === undefined ||
          (Array.isArray(data) && data.length === 0)
        ) {
          valid = false;
          break;
        }
      }
      this.canSubmit = valid;
    },
    toggleEditMode() {
      this.isEditing = !this.isEditing;
    },
    async updateStatement() {
      try {
        const updatedData = {
          ...this.viewedStatement,
          data: this.viewedFormData,
        };

        await this.$API.statementApi.update(updatedData.id, updatedData.data);

        const index = this.userStatements.findIndex(
          (item) => item.id === updatedData.id
        );
        if (index !== -1) {
          this.userStatements.splice(index, 1, updatedData);
        }
      } catch (error) {
        console.error("Error updating:", error);
      }
      this.toggleEditMode();
      this.isStatementDetailsOpen = false;
    },
    statusUpdate(data) {
      const request = this.userStatements.find(
        (request) => request.id == data.id
      );
      if (request) {
        request.status = data.status;
        request.comment = data.comment;
      } else {
        console.warn(`Заявка с ID ${data.id} не найдена`);
      }
    },
    getMaskForField(masks) {
      return masks || null;
    },

    onTimeInput(fieldName, event) {
      if (
        ["arrival_time", "travel_time", "departure_time"].includes(fieldName)
      ) {
        const value = event.target.value;
        if (value.length === 5) {
          const [hours, minutes] = value.split(":").map(Number);
          const validHours = Math.min(Math.max(hours, 0), 23);
          const validMinutes = Math.min(Math.max(minutes, 0), 59);
          this.formData[fieldName] = `${String(validHours).padStart(
            2,
            "0"
          )}:${String(validMinutes).padStart(2, "0")}`;
        }
      }
    },
    validateTimeInput(value) {
      if (!value) return true;
      const [hours, minutes] = value.split(":").map(Number);
      return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
    },
    formatDate(isoDate) {
      const date = new Date(isoDate);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      // const hours = String(date.getHours()).padStart(2, "0");
      // const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${day}.${month}.${year}`;
    },
    getStatusColor(status) {
      return this.statusColors[status] || "";
    },
    async fetchStatements() {
      try {
        this.loading = true;
        this.userStatements = await this.$API.statementApi.getUserStatements();
      } catch (error) {
        console.error("Ошибка при получении заявок:", error);
      } finally {
        this.loading = false;
      }
    },
    createStatement() {
      this.isModalOpen = true;
    },
    onDepartmentChange() {
      this.selectedStatement = null;
      this.formFields = [];
      this.formData = {};
      if (this.selectedDepartment) {
        this.availableStatements = Object.keys(
          this.formsData[this.selectedDepartment].statements || {}
        );
      } else {
        this.availableStatements = [];
      }
      this.validateForm();
    },
    onStatementChange() {
      this.formFields = [];
      this.formData = {};
      if (this.selectedStatement) {
        this.formFields =
          this.formsData[this.selectedDepartment].statements[
            this.selectedStatement
          ];

        this.formFields.forEach((field) => {
          // Инициализация значения в зависимости от типа поля
          if (field.type === "c-checkbox") {
            this.formData[field.name] = false;
          } else if (field.type === "c-date-input") {
            // Если используется range
            if (field.attrs && field.attrs.range) {
              this.formData[field.name] = [null, null];
            } else {
              this.formData[field.name] = null;
            }
          } else {
            this.formData[field.name] = "";
          }
        });
      }
      this.validateForm();
    },
    validateForm() {
      let valid = true;
      let emptySets = 0;

      for (let field of this.formFields) {
        if (field.type === "c-table-input") {
          const rows = this.formData[field.name];
          if (field.attrs.required && rows.length === 0 && !field.requiredOne)
            valid = false;

          if (field.requiredOne?.length > 0) {
            for (const row of rows) {
              const values = Object.values(row);
              const hasSomeValues = values.some(
                (value) => value !== "" && value !== 0
              );
              const isFullyFilled = values.every(
                (value) => value !== "" && value !== 0
              );
              const isEmpty = values.every(
                (value) => value === "" || value === 0
              );

              if (isEmpty) {
                emptySets++;
                if (emptySets === field.requiredOne.length) {
                  emptySets = 0;
                  valid = false;
                  break;
                }
              }

              if (hasSomeValues && !isFullyFilled) {
                valid = false;
                break;
              }
            }
          }

          for (const row of rows) {
            for (const column of field.attrs.columns) {
              if (
                column.required &&
                !row[column.name] &&
                !field.requiredOne?.includes(field.name)
              ) {
                valid = false;
                break;
              }
            }
          }
        }

        // Handle other types of inputs if necessary
        if (field.attrs && field.attrs.required && !this.formData[field.name]) {
          valid = false;
        }
      }

      this.canSubmit = valid;
    },
    async sendStatement() {
      const formData = Object.entries(this.formData).reduce(
        (acc, [key, value]) => {
          if (Array.isArray(value)) {
            // Filter out rows where all values are empty or zero
            acc[key] = value.filter((row) => {
              return Object.values(row).some((v) => {
                // Check if the value is not empty and not zero (for numbers)
                return v !== "" && v !== 0;
              });
            });
          } else {
            // For non-array values, keep them as is
            acc[key] = value;
          }
          return acc;
        },
        {}
      );

      console.log(formData);

      const newStatement = {
        data: formData,
        department: this.selectedDepartment,
        type: this.selectedStatement,
      };

      await this.$API.statementApi.create(newStatement);
      this.resetForm();
      this.isModalOpen = false;
    },
    resetForm() {
      this.selectedDepartment = null;
      this.selectedStatement = null;
      this.formFields = [];
      this.formData = {};
      this.canSubmit = false;
    },
    openStatementDetails(statement) {
      this.viewedStatement = statement;
      this.viewedFormFields =
        this.formsData[statement.department].statements[statement.type];
      this.viewedFormData = { ...statement.data };
      this.isStatementDetailsOpen = true;
    },
    resetViewedStatement() {
      this.viewedStatement = null;
      this.viewedFormFields = [];
      this.viewedFormData = {};
    },
    formatDisplayValue(field, value) {
      // Проверяем, является ли поле датой или периодом дат
      if (field.type === "c-date-input") {
        // Если range=true, value - массив
        if (field.attrs && field.attrs.range && Array.isArray(value)) {
          return value
            .map((dateValue) => this.formatDate(dateValue))
            .join(" - ");
        } else {
          // Одна дата
          return this.formatDate(value);
        }
      } else {
        // Для остальных полей возвращаем как есть или "Нет данных"
        return value || "Нет данных";
      }
    },
  },

  beforeUnmount() {
    this.headerStore.setHeaderButton();
  },
};
</script>

<style lang="scss" scoped src="./styles.scss" />
