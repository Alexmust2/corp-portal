<template> 
  <div class="block pa-4"> 
    <div class="ticket-grid"> 
      <div class="ticket-card" v-for="(ticket, index) in tickets" :key="index"> 
        <div class="ticket-header"> 
          <span class="ticket-date">{{ formatDate(ticket.created_at) }}</span> 
        </div> 
        <div class="ticket-body"> 
          <div class="cursor-pointer mb-3" v-profile="{ user: ticket.user }"> 
            <c-avatar 
              v-bind="getAvatarProps(ticket.user)" 
              size="32" 
              class="rounded-circle mr-2" 
            ></c-avatar> 
            {{ ticket.user.full_name }} 
          </div> 
          <div class="mb-2"> 
            <b>Тип заявки:</b> 
            <div class="ticket-type">{{ ticket.type }}</div> 
          </div> 
          <div class="mb-3"> 
            <b>Описание проблемы:</b> 
            <div class="ticket-description">{{ ticket.description }}</div> 
          </div> 
          <div v-if="ticket.files.length"> 
            <b>Файлы:</b> 
            <div v-for="(file, idx) in ticket.files" :key="idx"> 
              <a :href="apiUrl + file" target="_blank">{{ getFileName(file) }}</a> 
            </div> 
          </div> 
        </div> 
      </div> 
    </div> 
  </div> 
</template>

<script>
import { getAvatarProps } from "@/globalFunctions/avatarUtils";

export default {
  name: "support-ticket-page",
  data() {
    return {
      tickets: [],
    };
  },
  computed: {
    apiUrl(){
      return process.env.VUE_APP_API_URL
    }
  },
  mounted() {
    this.$API.supportApi
      .getTickets()
      .then((response) => {
        this.tickets = response.data
        console.log("Полученные заявки:", response);
      })
      .catch((error) => {
        console.error("Ошибка при получении заявок:", error);
      });
  },
  methods: {
    formatDate(date) {
      return new Date(date)
        .toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
        .replace(",", " в");
    },
    getFileName(file) {
      return file.split("/").pop();
    },
    getAvatarProps,
  },
};
</script>

<style lang="scss" scoped> 
.ticket-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 16px; // Зазор между карточками
}

.ticket-card { 
  border: 1px solid rgb(var(--v-theme-tertiary)); 
  padding: 20px; 
  border-radius: 12px; 
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); 
  // Удалите фиксированную ширину, так как она теперь управляется сеткой
  /* width: calc(33% - 20px); */
  min-width: 400px; 
  position: relative; 
  display: flex;
  flex-direction: column;
  gap: 16px; 
}

.ticket-header { 
  text-align: right; 
  margin-bottom: 10px; 
} 

.ticket-date { 
  color: #808080; 
  font-weight: normal; 
} 

.ticket-body { 
  display: flex; 
  flex-direction: column; 
} 

.ticket-type, 
.ticket-description { 
  margin-top: 5px; 
  padding: 10px; 
  background: rgba(var(--v-theme-secondary), 0.1); 
  border-radius: 8px; 
} 

a { 
  color: rgb(var(--v-theme-accent)); 
  text-decoration: none; 
} 

a:hover { 
  text-decoration: underline; 
} 
</style>