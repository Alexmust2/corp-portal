<template>
  <div class="block" style="min-height: 100%">
    <div class="container">
      <v-row>
        <v-col cols="12">
          <div class="filters_container d-flex">
            <SearchInput
              :width="isMobile ? '' : 280"
              :height="isMobile ? 35 : ''"
              class="mr-5 search-input"
              v-model="typedSearch"
              placeholder="Поиск по всем данным"
            />
            <div v-if="!isMobile" class="selects_container d-flex ga-5">
              <!-- <c-select
                :items="departmentsOptions"
                style="width: 250px"
                v-model="selectedDepartments"
                placeholder="Отдел"
                multiple
              /> -->
              <!-- <c-select
                :items="positionsOptions"
                style="width: 250px"
                v-model="selectedPositions"
                placeholder="Должность"
                multiple
              /> -->
              <v-icon
                v-show="!isMobile && isFiltered"
                color="gray"
                size="24"
                class="clear-filter-icon"
                @click="clearFilters"
                >mdi-close</v-icon
              >
            </div>
            <!-- <div v-else class="d-flex align-center">
              <v-icon @click="isSortFormOpen = true">mdi-tune</v-icon>
              <c-slide-panel v-model="isSortFormOpen" title="Сортировка">
                <c-select
                  :items="departmentsOptions"
                  v-model="selectedDepartments"
                  placeholder="Отдел"
                  multiple
                />
                <c-select
                  :items="positionsOptions"
                  v-model="selectedPositions"
                  placeholder="Должность"
                  multiple
                />
                <template #footer>
                  <div class="d-flex justify-space-between w-100">
                    <div class="w-50">
                      <c-btn
                        color="gray"
                        block
                        style="color: rgb(var(--v-theme-white))"
                        @click="closeSortForm"
                        >Сбросить</c-btn
                      >
                    </div>
                    <div class="w-50 ml-3">
                      <c-btn block @click="applySortForm">Применить</c-btn>
                    </div>
                  </div>
                </template>
              </c-slide-panel>
            </div> -->
          </div>
          <div class="user-table" @scroll="handleScroll">
            <loader-wrapper :loading="loading" :is-mobile="isMobile">
              <v-data-table
                v-if="!isMobile"
                :headers="headers"
                :items="filteredUsers"
                height="100%"
                :items-per-page="itemsPerPage"
                hide-default-footer
                class="mt-5"
              >
                <template #[`item.full_name`]="{ item }">
                  <div
                    class="d-flex align-center cursor-pointer"
                    @click="openUserInfo(item, $event)"
                    v-profile="{ user: item }"
                  >
                    <div class="user_info d-flex align-center flex-grow-1">
                      <c-checkbox
                        :value="selected.includes(item.id)"
                        color="rgb(var(--v-theme-accent))"
                        v-if="checkboxes"
                        @change.stop="updateSelected($event, item)"
                      />
                      <c-avatar
                        :size="36"
                        class="mr-2"
                        v-bind="getAvatarProps(item)"
                      />
                      <div class="full-name-container text-no-wrap flex-grow-1">
                        {{ item.full_name }}
                      </div>
                    </div>
                    <!-- <v-icon class="ml-2" color="secondary"
                    >mdi-open-in-new</v-icon
                  > -->
                    <v-icon
                      class="ml-2"
                      color="secondary"
                      @click.stop="openEditModal(item)"
                      v-role="'can_edit_users'"
                      >mdi-pencil</v-icon
                    >
                  </div>
                  <!-- <c-user-card
                  :user="item"
                  v-if="showUserCardId === item.id"
                  :style="{
                    top: userCardPosition.top + 'px',
                    left: userCardPosition.left + 'px',
                  }"
                  clition-absolute"
                  @close="showUserCardId = null"
                /> -->
                </template>
                <template #[`item.department`]="{ item }">
                  <div class="text-no-wrap text-capitalize">
                    {{ item.department || "Не указано" }}
                  </div>
                </template>
                <template #[`item.roles`]="{ item }">
                  <div class="text-no-wrap table-soles">
                    {{ item.roles.name || "Не указано" }}
                  </div>
                </template>
                <template #[`item.email`]="{ item }">
                  <div class="text-no-wrap table-email">
                    {{ item.email || "Не указано" }}
                  </div>
                </template>
              </v-data-table>
              <v-data-table
                v-else
                :headers="headersMobile"
                :items="filteredUsers"
                height="100%"
                :items-per-page="itemsPerPage"
                hide-default-footer
              >
                <template #[`item.full_name`]="{ item }">
                  <div
                    class="d-flex align-center cursor-pointer"
                    @click="openUserInfo(item, $event)"
                    v-profile="{ user: item }"
                  >
                    <div class="user_info d-flex align-center flex-grow-1">
                      <c-checkbox
                        :value="selected.includes(item.id)"
                        color="rgb(var(--v-theme-accent))"
                        v-if="checkboxes"
                        @change.stop="updateSelected($event, item)"
                      />
                      <c-avatar
                        :size="36"
                        v-bind="getAvatarProps(item)"
                        class="mr-2"
                      />
                      <div class="full-name-container text-no-wrap flex-grow-1">
                        {{ item.full_name.slice(0, 40) }}
                      </div>
                    </div>
                    <v-icon class="mr-4" color="secondary">mdi-open-in-new</v-icon>
                    <v-icon
                      class="ml-2"
                      color="secondary"
                      @click.stop="openEditModal(item)"
                      v-role="'can_edit_users'"
                      >mdi-pencil</v-icon
                    >
                  </div>
                  <!-- <c-user-card
                  :user="item"
                  v-if="showUserCardId === item.id"
                  :style="{
                    top: userCardPosition.top + 'px',
                    left: userCardPosition.left + 'px',
                  }"
                  class="position-absolute"
                  @close="showUserCardId = null"
                /> -->
                </template>
              </v-data-table>
            </loader-wrapper>
          </div>
        </v-col>
      </v-row>
    </div>
    <div class="buttons-container d-flex" v-role="'can_edit_users'">
      <c-btn
        class="mt-4 ml-2 mb-5"
        size="sm"
        @click="checkboxes = true"
        v-if="selected.length === 0"
      >
        Выбрать нескольких
      </c-btn>
      <c-btn
        class="mt-4 ml-2 mb-5"
        size="sm"
        v-if="selected.length > 0"
        @click="openEditModal(selected)"
      >
        Изменить выбранных
      </c-btn>
      <button
        v-if="checkboxes"
        class="ml-5 cancel-btn"
        @click="checkboxes = false"
      >
        Отменить
      </button>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/store/user.store";
import SearchInput from "@/components/widgets/SearchInput";
import { ROUTE_NAMES } from "@/router/routeNames";
import { getAvatarProps } from "@/globalFunctions/avatarUtils";
import LoaderWrapper from "@/components/ui/LoaderWrapper/Component.vue";
import { onboardingService } from "@/globalFunctions/onBoarding";
export default {
  name: "UsersTable",
  components: {
    SearchInput,
    LoaderWrapper,
  },
  data() {
    return {
      roleEditDialog: false,
      selectedRole: null,
      selectedPermissions: [],
      availableRoles: [],
      itemsPerPage: 50,
      firstColWidth: 55,
      headers: [
        {
          title: "Сотрудник",
          key: "full_name",
          sortable: false,
        },
        // {
        //   title: "Отдел",
        //   key: "department",
        //   width: "15%",
        //   sortable: false,
        // },
        {
          title: "Должность",
          key: "roles",
          sortable: false,
          classes:"roles",
        },
        {
          title: "Контакты",
          key: "email",
          sortable: false,
        },
      ],
      headersMobile: [
        {
          title: "Сотрудник",
          key: "full_name",
          width: "100%",
          sortable: false,
        },
      ],
      users: [],
      selected: [],
      editDialog: false,
      loading: true,
      selectedUsers: [],
      updatedPermissions: [],
      checkboxes: false,
      currentUserIndex: 0,
      typedSearch: "",
      showUserCardId: null,
      userCardPosition: { top: 0, left: 0 },
      tableHeight: "60vh",
      isSortFormOpen: false,
      selectedDepartments: [],
      selectedPositions: [],
      departmentsOptions: [],
      positionsOptions: [],
    };
  },
  computed: {
    isMobile() {
      return !this.$vuetify.display.mdAndUp;
    },
    authUser() {
      return useUserStore().user;
    },
    userStore() {
      return useUserStore();
    },
    filteredUsers() {
      const searchTerm = this.typedSearch.toLowerCase();

      return this.users.filter((user) => {
        const matchesSearch =
          !this.typedSearch ||
          (user.full_name &&
            user.full_name.toLowerCase().includes(searchTerm)) ||
          (user.roles &&
            user.roles.description &&
            user.roles.description.toLowerCase().includes(searchTerm)) ||
          (user.department &&
            user.department.toLowerCase().includes(searchTerm)) ||
          (user.email && user.email.toLowerCase().includes(searchTerm)) ||
          (user.phone_number &&
            user.phone_number.toLowerCase().includes(searchTerm));

        const matchesDepartment =
          this.selectedDepartments.length === 0 ||
          (user.department &&
            this.selectedDepartments.includes(user.department));

        const userRolesDescriptions = Array.isArray(user.roles)
          ? user.roles.map((role) => role.description).filter(Boolean)
          : user.roles && user.roles.description
          ? [user.roles.description]
          : [];

        const matchesPosition =
          this.selectedPositions.length === 0 ||
          userRolesDescriptions.some((description) =>
            this.selectedPositions.includes(description)
          );

        return matchesSearch && matchesDepartment && matchesPosition;
      });
    },
    isFiltered() {
      return (
        this.typedSearch.length > 0 ||
        this.selectedDepartments.length > 0 ||
        this.selectedPositions.length > 0
      );
    },
  },
  mounted() {
    this.fetchUsers();
    this.fetchAvailableRoles();
  },
  methods: {
    getAvatarProps,
    closeSortForm() {
      this.selectedDepartments = [];
      this.selectedPositions = [];
      this.isSortFormOpen = false;
    },
    applySortForm() {
      this.isSortFormOpen = false;
    },
    continueOnboarding() {
      onboardingService.startPageOnboarding("users");
      onboardingService.setRouter(this.$router);
    },
    async fetchAvailableRoles() {
      try {
        this.availableRoles = await this.$API.roleApi.getAllWithDetails();
      } catch (error) {
        console.error("Ошибка при получении списка ролей:", error);
      }
    },
    async fetchUsers() {
      try {
        this.users = await this.$API.userApi.getAll();
        this.populateFilterOptions();
      } catch (error) {
        console.error("Ошибка при получении списка пользователей:", error);
      } finally {
        this.loading = false;
      }
    },
    handleScroll(event) {
      const table = event.target;
      if (table.scrollTop + table.clientHeight >= table.scrollHeight - 10) {
        this.loadMoreItems();
      }
    },
    loadMoreItems() {
      this.itemsPerPage += 50; // Увеличиваем лимит на 50
    },
    async populateFilterOptions() {
      const departmentsSet = new Set();
      const positionsSet = new Set();

      for (const user of this.users) {
        if (user.department) {
          departmentsSet.add(user.department);
        }
        if (user.roles) {
          if (Array.isArray(user.roles)) {
            for (const role of user.roles) {
              positionsSet.add(role.description);
            }
          } else if (user.roles.description) {
            positionsSet.add(user.roles.description);
          }
        }
      }

      this.departmentsOptions = Array.from(departmentsSet);
      this.positionsOptions = Array.from(["Не указано", ...positionsSet]);
    },

    availablePermissions(user) {
      return this.authUser.permissions.filter((storePermission) => {
        const isNotInUser = !user.permissions.some(
          (permission) => permission.id === storePermission.id
        );
        return isNotInUser && storePermission.allow_deny != 0;
      });
    },
    async saveRole() {
      try {
        await this.$API.userApi.attachRole(
          this.editingUserId,
          this.selectedRole
        );
        this.closeRoleEditModal();
        await this.fetchUsers();
      } catch (error) {
        console.error("Ошибка при сохранении роли пользователя:", error);
      }
    },
    async openEditModal(users) {
      this.userStore.usersToEdit.push(users);
      this.$router.push({
        name: ROUTE_NAMES.USER_EDIT,
        params: { id: users.id },
      });
    },
    setAndTogglePermission(user, permission, value) {
      permission.allow_deny = value;
      this.togglePermission(user, permission);
    },
    togglePermission(user, permission) {
      const permissionIndex = this.updatedPermissions.findIndex(
        (p) => p.user_id === user.id && p.id === permission.id
      );
      if (permissionIndex === -1) {
        if (!user.id) {
          console.error(
            "Отсутствует идентификатор пользователя для разрешения:",
            permission
          );
          return;
        }
        this.updatedPermissions.push({
          user_id: user.id,
          id: permission.id,
          allow_deny: permission.allow_deny,
        });
      } else {
        this.updatedPermissions[permissionIndex].allow_deny =
          permission.allow_deny;
      }
    },
    groupPermissionsByRole(permissions) {
      return permissions.reduce((acc, permission) => {
        if (!acc[permission.role_id]) {
          acc[permission.role_id] = [];
        }
        acc[permission.role_id].push(permission);
        return acc;
      }, {});
    },
    async saveUser() {
      try {
        const requests = this.updatedPermissions.map((permission) =>
          this.$API.userApi.updatePermission(
            permission.user_id,
            permission.id,
            permission.allow_deny
          )
        );
        await Promise.all(requests);
        this.closeEditModal();
        this.fetchUsers();
      } catch (error) {
        console.error("Ошибка при сохранении пользователей:", error);
      }
    },
    getRoleName(permissionGroup) {
      if (permissionGroup && permissionGroup.length > 0) {
        const roleId = permissionGroup[0].role_id;
        const role = this.availableRoles.find((role) => role.id === roleId);
        if (role) {
          return role.description;
        }
      }
      return "Возможности пользователя";
    },
    // Методы из c-table
    toggleUserCard(item, event) {
      this.showUserCardId = this.showUserCardId === item.id ? null : item.id;

      const cardHeight = 200;
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      let positionTop = event.clientY;
      let positionLeft = event.clientX;

      if (event.clientY + cardHeight > viewportHeight) {
        positionTop = viewportHeight - cardHeight - 10;
      }

      if (this.isMobile) {
        positionLeft = (viewportWidth - 300) / 2 / 2;
      }

      this.userCardPosition = { top: positionTop, left: positionLeft };
    },

    updateSelected(value, item) {
      if (value) {
        if (!this.selected.includes(item.id)) {
          this.selected.push(item.id);
        }
      } else {
        const index = this.selected.indexOf(item.id);
        if (index > -1) {
          this.selected.splice(index, 1);
        }
      }
    },
    async openUserInfo(item, event) {
      this.toggleUserCard(item, event);
    },
    clearFilters() {
      this.typedSearch = "";
      this.selectedDepartments = [];
      this.selectedPositions = [];
    },
  },
};
</script>

<style lang="scss" scoped src="./styles.scss" />
