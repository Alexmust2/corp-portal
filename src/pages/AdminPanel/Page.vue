<template>
  <div>
    <!-- Секция синхронизации пользователей -->
    <div class="d-flex flex-column align-end mb-5" v-role="'user_sync'">
      <c-btn @click="syncUsers" class="w-25" :disable="loading">
        {{ loading ? "Идет синхронизация" : "Синхронизировать пользователей" }}
      </c-btn>
    </div>

    <!-- Панель ролей и permissions -->
    <v-card class="v-card-custom block">
      <v-row no-gutters>
        <v-col>
          <v-card-text>
            <v-row>
              <v-col cols="10">
                <v-text-field
                  v-model="searchQuery"
                  label="Поиск по ролям"
                  placeholder="Введите название или описание роли"
                  clearable
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-btn color="green" @click="openCreateRoleModal" icon>
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <ul class="pl-2">
              <li v-for="role in filteredRoles" :key="role.id">
                <div
                  class="role-item"
                  :class="{ selected: selectedRole && selectedRole.id === role.id }"
                  @click="toggleRole(role)"
                >
                  <div class="role-text" :class="{ bold: role.ChildRoles && role.ChildRoles.length }">
                    {{ role.description }} ({{ role.name }})
                    <span v-if="role.ChildRoles && role.ChildRoles.length">
                      [{{ role.isOpen ? '-' : '+' }}]
                    </span>
                  </div>
                  <div class="role-actions">
                    <v-btn color="primary" size="small" icon @click.stop="openAttachRoleModal(role, 'roleToRole')">
                      <v-icon>mdi-paperclip</v-icon>
                    </v-btn>
                    <v-btn color="red" size="small" icon @click.stop="openDeleteRoleModal(role)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </div>
                </div>
                <ul v-if="role.ChildRoles && role.ChildRoles.length" v-show="role.isOpen">
                  <li
                    v-for="child in role.ChildRoles"
                    :key="child.id"
                    class="item"
                    style="margin-left: 30px"
                  >
                    <div class="role-item" @click="toggleRole(child)">
                      <div class="role-text" :class="{ bold: child.ChildRoles && child.ChildRoles.length }">
                        {{ child.description }} ({{ child.name }})
                        <span v-if="child.ChildRoles && child.ChildRoles.length">
                          [{{ child.isOpen ? '-' : '+' }}]
                        </span>
                      </div>
                      <div class="role-actions">
                        <v-btn color="yellow" size="small" icon @click.stop="openDetachRoleModal(child, role)">
                          <v-icon>mdi-minus</v-icon>
                        </v-btn>
                        <v-btn color="red" size="small" icon @click.stop="openDeleteRoleModal(child)">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </div>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </v-card-text>
        </v-col>

        <v-divider vertical></v-divider>

        <v-col cols="12" md="6">
          <v-card-text class="v-card-text">
            <v-row>
              <v-col cols="8">
                <v-select
                  v-model="selectedPermissions"
                  :items="availablePermissions"
                  item-title="name"
                  item-value="id"
                  label="Выберите permission"
                  required
                  clearable
                  chips
                  multiple
                  :disabled="!selectedRole"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <div class="button-group">
                  <v-btn
                    color="blue"
                    @click="attachPermissionToRole(selectedPermissions, selectedRole)"
                    :disabled="!selectedRole || selectedPermissions.length === 0"
                    icon
                  >
                    <v-icon>mdi-check</v-icon>
                  </v-btn>
                  <v-btn color="green" @click="openCreatePermissionModal" icon>
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                  <v-btn
                    color="red"
                    @click="openDeletePermissionModal"
                    :disabled="selectedPermissions.length === 0"
                    icon
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </div>
              </v-col>
            </v-row>
            <div
              key="title"
              class="text-h6 font-weight-light text-grey pa-4 text-center"
            >
              {{ selectedRole ? `Выбрана роль ${selectedRole.description} (${selectedRole.name})` : "Выберите роль" }}
            </div>
            <v-scroll-x-transition group hide-on-leave>
              <v-chip
                v-for="(selection, i) in rolePermissions"
                :key="i"
                :text="selection.name"
                class="ma-1"
                :color="selectedRolePermissionsForDetach.includes(selection.id) ? 'red lighten-4' : 'grey'"
                v-tooltip="selection.description"
                prepend-icon="mdi-gavel"
                size="large"
                @click="toggleDetachPermission('role', selection.id)"
              ></v-chip>
            </v-scroll-x-transition>
          </v-card-text>
        </v-col>
      </v-row>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn text variant="text" @click="resetSelections">Очистить выбор</v-btn>
        <v-spacer></v-spacer>
        <v-btn
          append-icon="mdi-minus"
          color="red-darken-1"
          text
          variant="flat"
          @click="detachRolePermissionsConfirmed"
          :disabled="selectedRolePermissionsForDetach.length === 0"
        >
          Отвязать выбранные
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Панель пользователей и их permissions -->
    <v-card class="v-card-custom block mt-5">
      <v-row no-gutters>
        <v-col>
          <v-card-text>
            <v-row>
              <v-col cols="10">
                <v-text-field
                  label="Поиск по пользователям"
                  v-model="userSearch"
                  placeholder="Введите имя пользователя"
                  clearable
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-btn color="green" @click="openCreateRoleModal" icon>
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-virtual-scroll :height="500" :items="filteredUsers">
              <template v-slot:default="{ item }">
                <div
                  class="d-flex justify-space-between align-center role-item"
                  @click="selectUser(item.id)"
                  :class="{ 'selected-user': selectedUserId === item.id }"
                >
                  {{ item.full_name }}
                  <div class="role-actions">
                    <v-btn color="primary" size="small" icon @click.stop="openAttachRoleModal(item, 'roleToUser')">
                      <v-icon>mdi-paperclip</v-icon>
                    </v-btn>
                  </div>
                </div>
              </template>
            </v-virtual-scroll>
          </v-card-text>
        </v-col>

        <v-divider vertical></v-divider>

        <v-col cols="12" md="6">
          <v-card-text class="v-card-text">
            <v-row>
              <v-col cols="8">
                <v-select
                  v-model="selectedUserPermissions"
                  :items="availablePermissions"
                  item-title="name"
                  item-value="id"
                  label="Выберите permission"
                  required
                  clearable
                  chips
                  multiple
                  :disabled="!selectedUserId"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <div class="button-group">
                  <v-btn
                    color="blue"
                    @click="attachPermissionsToUser"
                    :disabled="!selectedUserId || selectedUserPermissions.length === 0"
                    icon
                  >
                    <v-icon>mdi-check</v-icon>
                  </v-btn>
                  <v-btn color="green" @click="openCreatePermissionModal" icon>
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                  <v-btn
                    color="red"
                    @click="openDeletePermissionModal"
                    :disabled="selectedUserPermissions.length === 0"
                    icon
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </div>
              </v-col>
            </v-row>
            <div
              key="title"
              class="text-h6 font-weight-light text-grey pa-4 text-center"
            >
              {{ selectedUserId ? `Выбран пользователь ${selectedUserId}` : "Выберите пользователя" }}
            </div>
            <v-scroll-x-transition group hide-on-leave>
              <v-chip
                v-for="(selection, i) in userPermissions"
                :key="i"
                :text="selection.name"
                class="ma-1"
                :color="selectedUserPermissionsForDetach.includes(selection.id) ? 'red lighten-4' : 'grey'"
                v-tooltip="selection.description"
                prepend-icon="mdi-gavel"
                size="large"
                @click="toggleDetachPermission('user', selection.id)"
              ></v-chip>
            </v-scroll-x-transition>
          </v-card-text>
        </v-col>
      </v-row>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn text variant="text" @click="resetSelections">Очистить выбор</v-btn>
        <v-spacer></v-spacer>
        <v-btn
          append-icon="mdi-minus"
          color="red-darken-1"
          text
          variant="flat"
          @click="detachUserPermissionsConfirmed"
          :disabled="selectedUserPermissionsForDetach.length === 0"
        >
          Отвязать выбранные
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Модальные окна -->
    <!-- Создание новой роли -->
    <v-dialog v-model="createRoleDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Создать новую роль</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="newRole.name" label="Название" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="newRole.description" label="Описание" required></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeCreateRoleModal">Отмена</v-btn>
          <v-btn color="blue darken-1" text @click="createRole">Создать</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Создание нового permission -->
    <v-dialog v-model="createPermissionDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Создать новый permission</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="newPermission.name" label="Название" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="newPermission.description" label="Описание" required></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeCreatePermissionModal">Отмена</v-btn>
          <v-btn color="blue darken-1" text @click="createPermission">Создать</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Модальное окно привязки роли -->
    <v-dialog v-model="attachRoleDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">
            Привязать роль ({{ attachRoleDialogType === 'roleToRole' ? 'к роли' : 'к пользователю' }})
          </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="selectedRoleId"
                  :items="availableRoles"
                  item-title="description"
                  item-value="id"
                  label="Какую роль привязать?"
                  required
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeAttachRoleModal">Отмена</v-btn>
          <v-btn
            v-if="attachRoleDialogType === 'roleToRole'"
            color="blue darken-1"
            text
            @click="attachRoleToRole"
          >
            Добавить
          </v-btn>
          <v-btn
            v-else
            color="blue darken-1"
            text
            @click="attachRoleToUser"
          >
            Добавить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Модальное окно отвязки роли -->
    <v-dialog v-model="detachRoleDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Отвязка роли</span>
        </v-card-title>
        <v-card-text>Вы уверены, что хотите отвязать роль?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDetachRoleModal">Отмена</v-btn>
          <v-btn color="red darken-1" text @click="detachRoleConfirmed">Да</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Модальное окно удаления роли -->
    <v-dialog v-model="deleteRoleDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Удаление роли</span>
        </v-card-title>
        <v-card-text>Вы уверены, что хотите удалить роль?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDeleteRoleModal">Отмена</v-btn>
          <v-btn color="red darken-1" text @click="deleteRole">Да</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Модальное окно удаления permission -->
    <v-dialog v-model="deletePermissionDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Удаление permissions</span>
        </v-card-title>
        <v-card-text>
          Вы уверены, что хотите НАВСЕГДА удалить следующие права:
          <ul>
            <li v-for="permission in selectedPermissions" :key="permission">
              {{ getPermissionName(permission) }}
            </li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDeletePermissionModal">Отмена</v-btn>
          <v-btn color="red darken-1" text @click="deletePermissionsConfirmed">Да</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar для уведомлений -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="snackbarTimeout">
      {{ snackbarText }}
      <v-btn color="white" text @click="snackbar = false">Закрыть</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "AdminPanelPage",
  data() {
    return {
      // Данные для ролей и permissions
      treeData: [],
      selectedRole: null,
      rolePermissions: [],
      availablePermissions: [],
      selectedPermissions: [],
      searchQuery: "",
      // Данные для пользователей
      users: [],
      userSearch: "",
      selectedUserId: null,
      selectedUserPermissions: [],
      userPermissions: [],
      // Модальные окна и формы
      createRoleDialog: false,
      newRole: { name: "", description: "" },
      createPermissionDialog: false,
      newPermission: { name: "", description: "" },
      // Данные для привязки ролей
      availableRoles: [],
      attachRoleDialog: false,
      attachRoleDialogType: "",
      selectedRoleId: "",
      selectedParentRole: null, // для привязки "роль к роли"
      // Данные для отвязки ролей и permissions
      detachRoleDialog: false,
      selectedRoleForDetach: null,
      selectedParentRoleForDetach: null,
      selectedRolePermissionsForDetach: [],
      selectedUserPermissionsForDetach: [],
      // Модальные окна удаления
      deleteRoleDialog: false,
      deletePermissionDialog: false,
      // Загрузка и уведомления
      loading: false,
      snackbar: false,
      snackbarText: "",
      snackbarColor: "",
      snackbarTimeout: 3000,
    };
  },
  computed: {
    filteredRoles() {
      if (!this.searchQuery) return this.treeData;
      const query = this.searchQuery.toLowerCase();
      return this.treeData.filter(role => {
        const matchesRole =
          role.name.toLowerCase().includes(query) ||
          role.description.toLowerCase().includes(query);
        const matchesChild =
          role.ChildRoles &&
          role.ChildRoles.some(child =>
            child.name.toLowerCase().includes(query) ||
            child.description.toLowerCase().includes(query)
          );
        return matchesRole || matchesChild;
      });
    },
    filteredUsers() {
      if (!this.userSearch) return this.users;
      return this.users.filter(user =>
        user.full_name.toLowerCase().includes(this.userSearch.toLowerCase())
      );
    },
  },
  mounted() {
    this.fetchRoles();
    this.fetchPermissions();
    this.fetchUsers();
  },
  methods: {
    // Универсальный обработчик ошибок API
    handleApiError(error, defaultMsg = "Произошла ошибка") {
      const message = error.response?.data?.message || defaultMsg;
      console.error(message);
      this.showSnackbar(`Ошибка: ${message}`, "error");
    },
    showSnackbar(message, color) {
      this.snackbarText = message;
      this.snackbarColor = color;
      this.snackbar = true;
    },
    resetSelections() {
      this.selectedRole = null;
      this.selectedUserId = null;
      this.rolePermissions = [];
      this.userPermissions = [];
      this.selectedRolePermissionsForDetach = [];
      this.selectedUserPermissionsForDetach = [];
    },
    // API вызовы
    async fetchRoles() {
      try {
        this.treeData = await this.$API.roleApi.getAllWithDetails();
      } catch (error) {
        console.error("Ошибка получения ролей:", error);
      }
    },
    async fetchPermissions() {
      try {
        this.availablePermissions = await this.$API.permissionApi.getAll();
      } catch (error) {
        console.error("Ошибка получения permissions:", error);
      }
    },
    async fetchUsers() {
      try {
        this.users = await this.$API.userApi.getAll();
      } catch (error) {
        console.error("Ошибка получения пользователей:", error);
      }
    },
    // Выбор ролей и пользователей
    toggleRole(role) {
      this.updateSelectedRole(role);
      if (role.ChildRoles && role.ChildRoles.length) {
        role.isOpen = !role.isOpen;
      }
    },
    async updateSelectedRole(role) {
      this.selectedRole = role;
      try {
        const roleWithPermission = await this.$API.roleApi.getRolePermissions(role.id);
        this.rolePermissions = roleWithPermission.permissions;
      } catch (error) {
        console.error("Ошибка получения permissions для роли:", error);
      }
    },
    async selectUser(userId) {
      this.selectedUserId = userId;
      try {
        this.userPermissions = await this.$API.userApi.getPermissions(userId);
        this.selectedUserPermissionsForDetach = [];
      } catch (error) {
        console.error("Ошибка получения permissions для пользователя:", error);
      }
    },
    // Синхронизация пользователей
    async syncUsers() {
      try {
        this.loading = true;
        await this.$API.userApi.sync();
      } catch (error) {
        console.error("Ошибка синхронизации пользователей:", error);
      } finally {
        this.loading = false;
      }
    },
    // Привязка permission к роли
    async attachPermissionToRole(permissions, role) {
      if (!role || permissions.length === 0) return;
      try {
        await this.$API.roleApi.attachPermissions(role.id, permissions);
        this.updateSelectedRole(role);
        this.showSnackbar("Permission привязан", "success");
        this.selectedPermissions = [];
      } catch (error) {
        this.handleApiError(error, "Ошибка привязки permission к роли");
      }
    },
    // Привязка permission к пользователю
    async attachPermissionsToUser() {
      if (!this.selectedUserId || this.selectedUserPermissions.length === 0) {
        this.showSnackbar("Выберите пользователя и permissions", "error");
        return;
      }
      try {
        await this.$API.userApi.attachPermissions(
          this.selectedUserId,
          this.selectedUserPermissions,
          true
        );
        this.selectedUserPermissions = [];
      } catch (error) {
        this.handleApiError(error, "Ошибка привязки permissions к пользователю");
      }
    },
    // Создание новой роли
    openCreateRoleModal() {
      this.createRoleDialog = true;
    },
    closeCreateRoleModal() {
      this.createRoleDialog = false;
      this.newRole = { name: "", description: "" };
    },
    async createRole() {
      try {
        await this.$API.roleApi.create(this.newRole.name, this.newRole.description);
        this.showSnackbar("Новая роль создана", "success");
        this.closeCreateRoleModal();
        this.fetchRoles();
      } catch (error) {
        this.handleApiError(error, "Ошибка создания роли");
      }
    },
    // Создание нового permission
    openCreatePermissionModal() {
      this.createPermissionDialog = true;
    },
    closeCreatePermissionModal() {
      this.createPermissionDialog = false;
      this.newPermission = { name: "", description: "" };
    },
    async createPermission() {
      try {
        await this.$API.permissionApi.create(this.newPermission.name, this.newPermission.description);
        this.showSnackbar("Новый permission создан", "success");
        this.closeCreatePermissionModal();
        this.fetchPermissions();
      } catch (error) {
        this.handleApiError(error, "Ошибка создания permission");
      }
    },
    // Модальное окно привязки роли
    openAttachRoleModal(item, type) {
      if (type === "roleToRole") {
        this.selectedParentRole = item.id;
        this.availableRoles = this.treeData.filter(role => role.id !== item.id);
      } else if (type === "roleToUser") {
        this.selectedUserId = item.id;
        this.availableRoles = this.treeData;
      }
      this.attachRoleDialogType = type;
      this.attachRoleDialog = true;
      this.selectedRoleId = "";
    },
    closeAttachRoleModal() {
      this.attachRoleDialog = false;
      this.selectedParentRole = null;
    },
    async attachRoleToRole() {
      try {
        await this.$API.roleApi.attachChild(this.selectedParentRole, this.selectedRoleId);
        this.showSnackbar("Роль привязана", "success");
        this.closeAttachRoleModal();
        this.fetchRoles();
      } catch (error) {
        this.handleApiError(error, "Ошибка привязки роли");
      }
    },
    async attachRoleToUser() {
      try {
        await this.$API.userApi.attachRole(this.selectedUserId, this.selectedRoleId);
        this.showSnackbar("Роль привязана", "success");
        this.closeAttachRoleModal();
        this.fetchRoles();
      } catch (error) {
        this.handleApiError(error, "Ошибка привязки роли к пользователю");
      }
    },
    // Удаление роли
    openDeleteRoleModal(role) {
      this.selectedRoleId = role.id;
      this.deleteRoleDialog = true;
    },
    closeDeleteRoleModal() {
      this.deleteRoleDialog = false;
      this.selectedRoleId = "";
    },
    async deleteRole() {
      try {
        await this.$API.roleApi.delete(this.selectedRoleId);
        this.showSnackbar("Роль удалена", "success");
        this.closeDeleteRoleModal();
        this.fetchRoles();
      } catch (error) {
        this.handleApiError(error, "Ошибка удаления роли");
      }
    },
    // Отвязка роли
    openDetachRoleModal(role, parentRole) {
      this.selectedRoleForDetach = role.id;
      this.selectedParentRoleForDetach = parentRole.id;
      this.detachRoleDialog = true;
    },
    closeDetachRoleModal() {
      this.detachRoleDialog = false;
      this.selectedRoleForDetach = null;
      this.selectedParentRoleForDetach = null;
    },
    async detachRoleConfirmed() {
      try {
        await this.$API.roleApi.detachChild(this.selectedParentRoleForDetach, this.selectedRoleForDetach);
        this.showSnackbar("Роль отвязана", "success");
        this.closeDetachRoleModal();
        this.fetchRoles();
      } catch (error) {
        this.handleApiError(error, "Ошибка отвязки роли");
      }
    },
    // Отвязка permissions
    toggleDetachPermission(target, permissionId) {
      if (target === "role") {
        const index = this.selectedRolePermissionsForDetach.indexOf(permissionId);
        if (index > -1) {
          this.selectedRolePermissionsForDetach.splice(index, 1);
        } else {
          this.selectedRolePermissionsForDetach.push(permissionId);
        }
      } else if (target === "user") {
        const index = this.selectedUserPermissionsForDetach.indexOf(permissionId);
        if (index > -1) {
          this.selectedUserPermissionsForDetach.splice(index, 1);
        } else {
          this.selectedUserPermissionsForDetach.push(permissionId);
        }
      }
    },
    async detachRolePermissionsConfirmed() {
      try {
        await this.$API.roleApi.detachPermissions(this.selectedRole.id, {
          data: this.selectedRolePermissionsForDetach,
        });
        this.showSnackbar("Permissions отвязаны от роли", "success");
        this.selectedRolePermissionsForDetach = [];
        this.updateSelectedRole(this.selectedRole);
      } catch (error) {
        this.handleApiError(error, "Ошибка отвязки permissions от роли");
      }
    },
    async detachUserPermissionsConfirmed() {
      try {
        await this.$API.userApi.detachPermissions(this.selectedUserId, this.selectedUserPermissionsForDetach);
        this.showSnackbar("Permissions отвязаны от пользователя", "success");
        this.selectedUserPermissionsForDetach = [];
        await this.selectUser(this.selectedUserId);
      } catch (error) {
        this.handleApiError(error, "Ошибка отвязки permissions от пользователя");
      }
    },
    // Получение имени permission по id
    getPermissionName(permissionId) {
      const permission = this.availablePermissions.find(p => p.id === permissionId);
      return permission ? permission.name : "";
    },
  },
};
</script>

<style>
.v-card-custom {
  /* Опциональная настройка стилей */
}
.v-card-text {
  max-height: 500px;
  overflow-y: auto;
  text-align: left;
}
.role-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  line-height: 1.5;
}
.role-text {
  flex-grow: 1;
}
.role-actions {
  display: flex;
  align-items: center;
}
.item {
  cursor: pointer;
}
.bold {
  font-weight: bold;
}
.selected {
  background-color: #e0e0e0;
}
.selected-user {
  background-color: #e0e0e0;
}
</style>
