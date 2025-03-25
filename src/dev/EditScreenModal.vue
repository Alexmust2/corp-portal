<!-- src/components/EditScreenModal.vue -->
<template>
    <v-dialog v-model="show" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Редактирование экрана</span>
        </v-card-title>
        <v-card-text>
          <v-select
            v-model="selectedComponentIds"
            :items="components"
            item-title="name"
            item-value="id"
            label="Добавить компоненты"
            multiple
          ></v-select>
          <v-btn @click="addComponents">Добавить выбранные</v-btn>
          <v-list>
            <draggable 
              v-model="localScreen.components"
              handle=".drag-handle"
              @end="updateComponentIds">
              <v-list-item v-for="(element, index) in localScreen.components" :key="index">
                <v-list-item-content>
                  <v-row>
                    <v-col cols="1">{{ index + 1 }}</v-col>
                    <v-col cols="4">{{ element.name }}</v-col>
                    <v-col cols="4">
                      <v-text-field
                        v-model="element.duration"
                        label="Время (сек)"
                        type="number"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="2">
                      <v-btn icon @click="removeComponent(index)">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-col>
                    <v-col cols="1" class="drag-handle">
                      <v-icon>mdi-drag</v-icon>
                    </v-col>
                  </v-row>
                </v-list-item-content>
              </v-list-item>
            </draggable>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" @click="deleteScreen">Удалить экран</v-btn>
          <v-btn color="primary" @click="save">Сохранить изменения</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import { defineComponent } from 'vue'
  import { VueDraggableNext } from 'vue-draggable-next';
  
  export default defineComponent({
    components: {
      draggable: VueDraggableNext,
    },
    props: {
      screen: Object
    },
    data() {
      return {
        show: true,
        localScreen: JSON.parse(JSON.stringify(this.screen)),
        selectedComponentIds: [],
        components: [
          { id: 1, name: 'BestEmployeeComponent' },
          { id: 2, name: 'BirthdaysComponent' },
          { id: 3, name: 'test1' },
          { id: 4, name: 'test2' }
        ]
      };
    },
    methods: {
      addComponents() {
        this.selectedComponentIds.forEach(componentId => {
          const component = this.components.find(c => c.id === componentId);
          if (component) {
            this.localScreen.components.push({
              id: component.id,
              name: component.name,
              duration: 10 // Время отображения по умолчанию
            });
            console.log(this.localScreen.components);
          }
        });
        this.selectedComponentIds = [];
      },
      removeComponent(index) {
        this.localScreen.components.splice(index, 1);
      },
      save() {
        this.$emit('save', this.localScreen);
        console.log(this.localScreen);
      },
      deleteScreen() {
        this.$emit('delete', this.localScreen.id);
      },
      updateComponentIds() {
        this.localScreen.components.forEach((component, index) => {
          component.id = index + 1;
        });
      }
    }
  });
  </script>
  
  <style scoped>
  /* Добавьте стили по необходимости */
  </style>