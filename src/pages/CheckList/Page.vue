<template>
  <v-container class="checklist-container">
    <v-row>
      <v-col cols="12">
        <h2 class="text-center">Чек-лист - {{ checklistType }}</h2>

        <v-row class="mt-5">
          <v-select
            v-model="checklistType"
            :items="['Ежедневный', 'Еженедельный', 'Ежемесячный']"
            label="Выберите тип чек-листа"
            outlined
          ></v-select>
          <v-btn color="primary" fab @click="openDialog">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-row>

        <v-data-table
          :headers="headers"
          :items="tasks"
          item-value="task"
          class="elevation-1"
        >
          <template v-slot:[`item.status`]="{ item }">
            <v-checkbox
              v-model="item.status"
              @change="toggleTaskStatus(item)"
              :label="item.status ? 'Выполнено' : 'Не выполнено'"
            ></v-checkbox>
          </template>
        </v-data-table>

        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Новые задачи</span>
            </v-card-title>
            <v-card-text>
              <v-form ref="form">
                <v-textarea
                  v-model="newTasks"
                  label="Введите задачи, каждую с новой строки"
                  outlined
                  rows="4"
                  required
                ></v-textarea>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDialog"
                >Отмена</v-btn
              >
              <v-btn color="blue darken-1" text @click="addTasks"
                >Добавить</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "checklist-page",
  data() {
    return {
      tasks: [],
      newTasks: "",
      checklistType: "Ежедневный",
      dialog: false,
      headers: [
        { text: "Задача", value: "task", align: "start" },
        { text: "Статус", value: "status", align: "center" },
      ],
    };
  },
  methods: {
    async fetchTasks() {
      try {
        // const response = await this.$axios.get(
        //   `/api/checklists/${this.checklistType}`
        // );
        // TODO ждем checklistApi
        // this.tasks = response.data;
      } catch (error) {
        console.error("Ошибка при получении задач:", error);
      }
    },
    async addTasks() {
      try {
        // const tasksArray = this.newTasks
        //   .split("\n")
        //   .filter((task) => task.trim() !== "");

        // for (const task of tasksArray) {
        //   // const response = await this.$axios.post("/api/checklists/create", {
        //   //   task: task,
        //   //   type: this.checklistType,
        //   // });
        //   // TODO ждем checklistApi
        //   // this.tasks.push(response.data);
        // }

        this.newTasks = "";
        this.closeDialog();
      } catch (error) {
        console.error("Ошибка при добавлении задач:", error);
      }
    },
    // async toggleTaskStatus(task) {
    //   try {
    //     // const updatedTask = { ...task, status: task.status };
    //     // await this.$axios.put(`/api/checklists/${task.id}`, updatedTask);
    //     // TODO ждем checklistApi
    //   } catch (error) {
    //     console.error("Ошибка при обновлении статуса задачи:", error);
    //   }
    // },
    openDialog() {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
      this.newTasks = "";
    },
  },
  watch: {
    checklistType() {
      this.fetchTasks();
    },
  },
  mounted() {
    this.fetchTasks();
  },
};
</script>

<style scoped>
.checklist-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
</style>
