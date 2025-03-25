<template>
  <v-container class="table">
    <v-row>
      <v-col cols="12">
        <SearchInput style="width: 300px" v-model="typedSearch" />
        <v-data-table
          :headers="headers"
          :items="processedItems"
          :search="typedSearch"
          :height="tableHeight"
          :items-per-page="items.length"
          hide-default-footer
        >
          <template #[`item.roles`]="{ item }">
            {{ item.roles.name || 'Не указано' }}
          </template>
          <template #[`item.status`]="{ item }">
            <v-chip v-if="item.status == 'approved'" color="green-lighten-3"
              >Обработана</v-chip
            >
            <v-chip
              v-else-if="item.status == 'disapproved'"
              color="red-lighten-3"
              >Отклонена</v-chip
            >
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SearchInput from '@/components/widgets/SearchInput';
import { ROUTE_NAMES } from '@/router/routeNames';
import { useUserStore } from '@/store/user.store';

export default {
  name: 'c-table',
  components: {
    SearchInput,
  },
  props: {
    search: String,
    headers: Array,
    items: Array,
    checkboxes: Boolean,
    tableHeight: {
      type: String,
      default: 'auto',
    },
  },
  data() {
    return {
      typedSearch: this.search,
      showUserCardId: null,
      userCardPosition: { top: 0, left: 0 },
    };
  },
  computed: {
    userStore() {
      return useUserStore();
    },
    processedItems() {
      return this.items.map((item) => {
        const processedItem = { ...item };
        Object.keys(processedItem).forEach((key) => {
          if (
            !processedItem[key] ||
            (Array.isArray(processedItem[key]) && processedItem[key].length === 0)
          ) {
            processedItem[key] = 'Не указано';
          }
        });
        return processedItem;
      });
    },
  },
  methods: {
    toggleUserCard(item, event) {
      this.showUserCardId = this.showUserCardId === item.id ? null : item.id;
      const cardHeight = 200;
      const viewportHeight = window.innerHeight;
      const positionTop =
        event.clientY + cardHeight > viewportHeight
          ? event.clientY - cardHeight
          : event.clientY;
      this.userCardPosition = { top: positionTop, left: event.clientX };
    },
    updateSelected(value, item) {
      const { usersToEdit } = this.userStore;
      if (value) {
        if (!usersToEdit.includes(item.id)) {
          usersToEdit.push(item.id);
        }
      } else {
        const index = usersToEdit.indexOf(item.id);
        if (index > -1) {
          usersToEdit.splice(index, 1);
        }
      }
    },
    goToEdit(item) {
      const { usersToEdit } = this.userStore;
      if (!usersToEdit.includes(item.id)) {
        usersToEdit.push(item.id);
      }
      this.$router.push({ name: ROUTE_NAMES.USER_EDIT });
    },
  },
};
</script>

<style lang="scss" src="./styles.scss" />
