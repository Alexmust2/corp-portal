<template>
  <StatementsBase
    :statements="accessibleRequests"
    @toggle-table-view="handleTableViewToggle"
    :is-table-switch-visible="true"
  >
    <template #statements-list="{ filteredStatements }">
      <div class="statement-table outer-scrollbar">
        <v-row class="pt-5">
          <v-col
            v-for="request in filteredStatements"
            :key="request.id"
            cols="12"
            sm="12"
            lg="6"
            xl="4"
          >
            <StatementsCard
              :data="request"
              @click="openStatementDetails(request)"
            />
          </v-col>
        </v-row>
      </div>
    </template>

    <template #statements-table="{ filteredStatements }">
      <div class="statement-table outer-scrollbar">
        <v-data-table
          :headers="headers"
          :items="filteredStatements"
          :loading="loading"
          :items-per-page="filteredStatements.length"
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

              <td>{{ item.user.first_name }} {{ item.user.last_name }}</td>

              <td>
                <div :style="{ color: statusColors[item.status] }">
                  {{ item.status }}
                </div>
              </td>

              <td>{{ formatDate(item.created_at) }}</td>
            </tr>
          </template>
        </v-data-table>
      </div>
    </template>
    <!-- slide panel -->
    <template #additional-content>
      <c-slide-panel
        class="statement-panel"
        v-model="isStatementDetailsOpen"
        :title="'Заявление'"
      >

        <!-- statement header -->
        <div class="header-content">
          <div
            v-if="viewedStatement?.user"
            class="statement-process-user d-flex align-center"
          >
            <c-avatar
              v-bind="getAvatarProps(viewedStatement.user)"
              :size="40"
              class="rounded-circle mr-2"
            ></c-avatar>
            <div class="d-flex flex-column">
              <div class="name">
                {{ viewedStatement.user.first_name }}
                {{ viewedStatement.user.last_name }}
              </div>
              <div class="email">{{ viewedStatement.user.email }}</div>
            </div>
          </div>

          <h2 class="mt-4" :class="{'mb-3' : viewedFormFields.some(field => field.isHeaderContent) }">{{ viewedStatementTitle }}</h2>
          
          <div
            v-for="(field, index) in viewedFormFields.filter(
              (field) => field.isHeaderContent
            )"
            :key="index"
          >
            <h3>{{ field.attrs.label }}</h3>
            <template
              v-if="
                field.type === 'c-table-input' &&
                viewedFormData[field.name][0]?.quantity
              "
            >
              <c-table-input
                :model-value="viewedFormData[field.name]"
                :columns="field.attrs.columns"
                :readonly="true"
                :hide-add-button="true"
                :is-header-content="true"
                :header-content-class="field.headerContentClass"
              />
            </template>
            <template v-else>
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
        
        <template #footer v-if="statusActions.length">
          <c-checkbox
            class="mb-4"
            v-if="statusActions.length"
            v-model="isAddingComment"
            ref="commentCheckbox"
            label="Написать комментарий к заявлению"
          />
          <cTextarea
            disableResize
            v-if="viewedStatement && isAddingComment"
            label="Комментарий для заявителя"
            class="mb-2"
            v-model="comment"
          />
          <div class="d-flex ga-2">
            <c-chip
              v-for="action in statusActions"
              :key="action"
              :color="actionColors[action]"
              clickable
              @click="handleActionClick(action)"
              class="w-100"
            >
              {{ action }}
            </c-chip>
          </div>
        </template>
        <template #footer v-else>
          <cTextarea
            disableResize
            disabled
            v-if="viewedStatement"
            label="Комментарий для заявителя"
            class="mb-2"
            v-model="comment"
          />
          <c-chip :color="actionColors[viewedStatement?.status]">
            {{ viewedStatement?.status }}
          </c-chip>
        </template>
      </c-slide-panel>
    </template>
  </StatementsBase>
</template>

<script>
import StatementsBase from "../StatementsBase.vue";
import StatementsCard from "./StatementCard.vue";
import CTableInput from "../CTableInput.vue";
import formsData from "../forms.json";
import { userHavePermission } from "@/globalFunctions/guardFunctions";
import { useUserStore } from "@/store/user.store";
import { socket } from "@/websocket";
import { getAvatarProps } from "@/globalFunctions/avatarUtils";

export default {
  name: "StatementsAdmin",
  components: {
    StatementsBase,
    StatementsCard,
    CTableInput,
  },
  data() {
    return {
      allRequests: [],
      accessibleRequests: [],
      typedSearch: "",
      dateRange: null,
      isStatementDetailsOpen: false,
      viewedStatement: null,
      viewedFormFields: [],
      viewedFormData: {},
      comment: "",
      isAddingComment: false,
      statusColors: {
        Обработана: "rgb(var(--v-theme-accent))",
        "В работе": "rgb(var(--v-theme-secondary))",
        Отклонено: "rgb(var(--v-theme-red))",
        Отправлена: "rgb(var(--v-theme-primary))",
      },
      actionColors: {
        "Взять в работу": "secondary",
        Обработана: "accent",
        Отклонить: "red",
        Отклонено: "red",
        Закуплено: "secondary",
        Выдано: "accent",
      },
      isTableView: false,
      headers: [
        { title: "Тип", key: "type", width: "50%" },
        { title: "Сотрудник", key: "status", width: "15%" },
        { title: "Отдел", key: "department", width: "20%" },
        { title: "Дата", key: "created_at", width: "15%" },
      ],
    };
  },
  computed: {
    isMobile() {
      return !this.$vuetify.display.mdAndUp;
    },
    viewedStatementTitle() {
      return this.viewedStatement ? this.viewedStatement.type : "";
    },
    statusActions() {
      const { viewedStatement } = this;
      if (!viewedStatement?.status) return [];

      const actionMap = {
        "Заказ канцелярии": {
          Отправлена: ["Взять в работу", "Отклонить"],
          "В работе": ["Закуплено", "Выдано", "Отклонить"],
          Закуплено: ["Выдано", "Отклонить"],
        },
        default: {
          Отправлена: ["Взять в работу", "Отклонить"],
          "В работе": ["Обработана", "Отклонить"],
        },
      };

      return (
        actionMap[viewedStatement.type]?.[viewedStatement.status] ||
        actionMap.default[viewedStatement.status] ||
        []
      );
    }
  },
  async created() {
    await this.fetchAllRequests();
    socket.on("newStatement", (data) => {
      this.allRequests.unshift(data);
      this.filterAccessibleRequests();
    });
    socket.on("newStatementStatus", (response) => {
      this.statusUpdate(response);
    });
  },
  methods: {
    getAvatarProps,
    statusUpdate(data) {
      const request = this.allRequests.find((request) => request.id == data.id);
      if (request) {
        request.status = data.status;
        request.comment = data.comment;
        request.updated_at = new Date().toISOString();
      } else {
        console.warn(`Заявка с ID ${data.id} не найдена`);
      }
    },
    async fetchAllRequests() {
      try {
        this.allRequests = await this.$API.statementApi.getAllStatements();
        this.filterAccessibleRequests();
        console.log(this.allRequests);
      } catch (error) {
        console.error("Ошибка при получении всех заявок:", error);
      }
    },
    filterAccessibleRequests() {
      const user = useUserStore().user;
      this.accessibleRequests = this.allRequests.filter((request) => {
        const permission = this.getDepartmentPermission(request.department);
        return userHavePermission(user, permission);
      });
    },
    getDepartmentPermission(departmentName) {
      return formsData[departmentName]?.permission || null;
    },
    openStatementDetails(request) {
      if (!request) return;
      this.viewedStatement = request;
      this.comment = "";
      this.viewedFormData = { ...request.data };
      const department = request.department;
      const type = request.type;
      this.viewedFormFields = formsData[department]?.statements?.[type] || [];
      this.isStatementDetailsOpen = true;
      this.isAddingComment = false;
      if (request.comment?.length > 0) {
        this.comment = request.comment;
        this.toggleComment();
      }
    },
    async handleActionClick(action) {
      if (!this.viewedStatement?.id) {
        console.error("Не удалось определить ID заявления");
        return;
      }

      const statusMapping = {
        "Взять в работу": "В работе",
        Обработана: "Обработана",
        Отклонить: "Отклонено",
        Закуплено: "Закуплено",
        Выдано: "Выдано",
      };

      const newStatus = statusMapping[action];
      if (!newStatus) {
        console.error(`Недопустимый статус действия: ${action}`);
        return;
      }

      const id = this.viewedStatement.id;
      const comment = this.comment || "";

      try {
        await this.$API.statementApi.updateStatementStatus(
          id,
          newStatus,
          comment
        );
        this.isStatementDetailsOpen = false;
      } catch (error) {
        console.error("Ошибка при обновлении статуса заявления:", error);
      }
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
    formatDate(dateValue) {
      if (!dateValue) return "Нет данных";
      const date = new Date(dateValue);
      if (isNaN(date)) return dateValue; // Если не удалось распарсить
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    },
    toggleComment() {
      this.isAddingComment = !this.isAddingComment;
      this.$nextTick(() => {
        if (this.isAddingComment) {
          this.$refs.commentCheckbox?.$el?.scrollIntoView({
            behavior: "smooth",
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped src="../styles.scss" />
