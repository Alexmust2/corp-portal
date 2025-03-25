<template>

  <div class="container">
    <loader-wrapper :loading="isLoading">
      <div class="block" v-if="statements.length">
        <div class="statement-header" v-auto-animate>
          <SearchInput class="mr-5 statements-search" placeholder="Поиск" :height="isMobile ? '35' : ''"
            v-model="typedSearch" />
          <div v-if="!isMobile" class="header-selects ga-5 w-75 ml-auto">
            <c-date-input v-model="dateRange" :placeholder="datePlaceholder" multiple="range"
              :allowed-dates="allowedFilterDates"></c-date-input>
            <c-select v-model="selectedStatements" :items="statementsOptions" placeholder="Заявления"
              multiple></c-select>
            <c-select v-model="selectedStatuses" :items="statusesOptions" placeholder="Статус" multiple></c-select>
            <c-select v-model="selectedDepartments" :items="departmentsOptions" placeholder="Отдел" multiple></c-select>

          </div>


          <div v-else class="d-flex align-center">
            <v-icon @click="isSortFormOpen = true">mdi-tune</v-icon>
            <c-slide-panel v-model="isSortFormOpen" title="Сортировка">
              <c-date-input v-model="dateRange" :placeholder="mobileDatePlaceholder" multiple="range"
                :allowed-dates="allowedFilterDates" label="Дата"></c-date-input>
              <c-select v-model="selectedStatements" :items="statementsOptions" label="Тип заявления"
                multiple></c-select>
              <c-select v-model="selectedStatuses" :items="statusesOptions" label="Статус" multiple></c-select>
              <c-select v-model="selectedDepartments" :items="departmentsOptions" label="Отдел" multiple></c-select>
              <template #footer>
                <div class="d-flex justify-space-between w-100">
                  <div class="w-50">
                    <c-btn color="gray" block style="color: rgb(var(--v-theme-white))"
                      @click="closeSortForm">Сбросить</c-btn>
                  </div>
                  <div class="w-50 ml-3">
                    <c-btn block @click="applySortForm">Применить</c-btn>
                  </div>
                </div>
              </template>
            </c-slide-panel>
          </div>

          <c-switch v-show="isTableSwitchVisible" class="ml-5 lg"
            @update:modelValue="handleTableViewToggle(isTableView)" v-model="isTableView" :table-view-switch="true" />

          <v-icon v-show="!isMobile && isFiltered" color="gray" size="24" class="ml-5 clear-filter-icon"
            @click="clearFilters">mdi-close</v-icon>
        </div>
        <!-- Слот для списка заявлений -->
        <div v-if="!isTableView">
          <slot name="statements-list" :filtered-statements="filteredStatements"></slot>
        </div>
        <div v-else>
          <slot name="statements-table" :filtered-statements="filteredStatements"></slot>
        </div>
      </div>

      <div v-else class="empty-statements-container">
        <div class="empty-statements-content">
          <img src="/assets/illustrations/statements.png" alt="Нет чатов" />
          <div>
            <div class="empty-statements-text">
              <h2>Нет созданных заявлений</h2>
              <p>
                Пока у Вас нет заявлений. Чтобы начать, создайте новое заявление,
                заполнив необходимые данные. Для этого нажмите «Создать
                заявление», выберите тип заявления и заполните форму.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Дополнительный контент -->
      <slot name="additional-content"></slot>
    </loader-wrapper>
  </div>


</template>

<script>
import SearchInput from "@/components/widgets/SearchInput";
import LoaderWrapper from "@/components/ui/LoaderWrapper/Component.vue";
import { vAutoAnimate } from "@formkit/auto-animate/vue";
import { onboardingService } from "@/globalFunctions/onBoarding";
export default {
  name: "StatementsBase",
  components: {
    SearchInput,
    LoaderWrapper,
  },
  directives: {
    autoAnimate: vAutoAnimate,
  },
  props: {
    statements: {
      type: Array,
      required: true,
      default: null,
    },
    datePlaceholder: {
      type: String,
      default: "Поиск по дате",
    },
    mobileDatePlaceholder: {
      type: String,
      default: "Поиск по дате (диапазон)",
    },
    isTableSwitchVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      typedSearch: "",
      dateRange: null,
      selectedStatements: [],
      selectedStatuses: [],
      selectedDepartments: [],
      statementsOptions: [],
      statusesOptions: [],
      departmentsOptions: [],
      isSortFormOpen: false,
      isTableView: false,
      isLoading: true,
    };
  },
  computed: {
    isMobile() {
      return !this.$vuetify.display.mdAndUp;
    },
    allowedFilterDates() {
      const datesSet = new Set();
      this.statements.forEach((statement) => {
        const date = new Date(statement.created_at).toISOString().split("T")[0];
        datesSet.add(date);
      });
      return Array.from(datesSet);
    },
    filteredStatements() {
      let dateRangeStart = null;
      let dateRangeEnd = null;

      if (this.dateRange && this.dateRange.length > 0) {
        // Convert all dates in dateRange to Date objects
        const dateRangeDates = this.dateRange.map(
          (dateStr) => new Date(dateStr)
        );

        // Find the earliest and latest dates in the dateRange
        const sortedDates = dateRangeDates.sort((a, b) => a - b);
        dateRangeStart = new Date(sortedDates[0]).setHours(0, 0, 0, 0);
        dateRangeEnd = new Date(sortedDates[sortedDates.length - 1]).setHours(
          23,
          59,
          59,
          999
        );
      }

      return this.statements
        .filter((statement) => {
          const matchesSearch =
            !this.typedSearch ||
            statement.type
              .toLowerCase()
              .includes(this.typedSearch.toLowerCase()) ||
            statement.department
              .toLowerCase()
              .includes(this.typedSearch.toLowerCase()) ||
            statement.status
              .toLowerCase()
              .includes(this.typedSearch.toLowerCase()) ||
            (statement.user &&
              statement.user.full_name
                ?.toLowerCase()
                .includes(this.typedSearch.toLowerCase()));

          const statementDate = new Date(statement.created_at);
          const matchesDate =
            !this.dateRange ||
            this.dateRange.length === 0 ||
            (statementDate >= dateRangeStart && statementDate <= dateRangeEnd);

          const matchesStatements =
            this.selectedStatements.length === 0 ||
            this.selectedStatements.includes(statement.type);
          const matchesStatuses =
            this.selectedStatuses.length === 0 ||
            this.selectedStatuses.includes(statement.status);
          const matchesDepartments =
            this.selectedDepartments.length === 0 ||
            this.selectedDepartments.includes(statement.department);

          return (
            matchesSearch &&
            matchesDate &&
            matchesStatements &&
            matchesStatuses &&
            matchesDepartments
          );
        })
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },
    isFiltered() {
      
      return (
        this.typedSearch.length > 0 ||
        this.selectedStatements.length > 0 ||
        this.selectedStatuses.length > 0 ||
        this.selectedDepartments.length > 0 ||
        this.dateRange != null
      );
    }
  },
  watch: {
    statements: {
      immediate: true,
      handler() {
        if (this.statements != null) {
        this.isLoading = false;
      }
        this.populateFilterOptions();
      },
    },
  },
  methods: {
    populateFilterOptions() {
      const statementsSet = new Set();
      const statusesSet = new Set();
      const departmentsSet = new Set();
      for (const statement of this.statements) {
        statementsSet.add(statement.type);
        statusesSet.add(statement.status);
        departmentsSet.add(statement.department);
      }
      this.statementsOptions = Array.from(statementsSet);
      this.statusesOptions = Array.from(statusesSet);
      this.departmentsOptions = Array.from(departmentsSet);
    },
    closeSortForm() {
      this.selectedStatements = [];
      this.selectedStatuses = [];
      this.selectedDepartments = [];
      this.dateRange = null;
      this.isSortFormOpen = false;
    },
    continueOnboarding() {
      onboardingService.startPageOnboarding("statements");
      onboardingService.setRouter(this.$router);
    },
    applySortForm() {
      this.isSortFormOpen = false;
    },
    handleTableViewToggle(value) {
      this.isTableView = value;
    },
    clearFilters() {
      this.typedSearch = "";
      this.closeSortForm()
    }
  },
};
</script>

<style lang="scss" scoped src="./styles.scss" />
