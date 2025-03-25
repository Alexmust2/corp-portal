export const dSelect = {
  title: "select",
  description:
    "Компонент `c-select` является обёрткой над `v-select` из Vuetify, позволяя использовать все его возможности, а также кастомизировать отображение опций и выбранных элементов через слоты. Предоставляет простой способ переопределить стили и поведение стандартного `v-select`.",
  defaultComponent: "c-select",
  examples: [
    {
      text: "Базовый выбор",
      props: {
        label: "Выберите опцию",
        items: ["Опция 1", "Опция 2", "Опция 3"],
      },
    },
    {
      text: "Выбор с множественным выбором",
      props: {
        label: "Выберите несколько опций",
        items: ["Опция 1", "Опция 2", "Опция 3", "Опция 4"],
        multiple: true,
      },
    },
    {
      text: "Выбор с иконкой поиска",
      props: {
        label: "Поиск опции",
        items: ["Опция 1", "Опция 2", "Опция 3"],
        prependIcon: "mdi-magnify",
        searchable: true,
        block: true
      },
    },
    {
      text: "Выбор с кастомным отображением опций",
      props: {
        label: "Выберите пользователя",
        items: [
          { id: 1, full_name: "Иван Иванов", role: "Менеджер", avatar: "/avatars/1.jpg" },
          { id: 2, full_name: "Мария Петрова", role: "Разработчик", avatar: "/avatars/2.jpg" },
          { id: 3, full_name: "Сергей Смирнов", role: "Дизайнер", avatar: "/avatars/3.jpg" },
        ],
        itemTitle: "full_name",
        itemValue: "id",
      },
      slots: {
        item: `
                <template #item="{ item }">
                  <v-list-item>
                    <v-list-item-avatar>
                      <v-img :src="item.avatar"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{ item.full_name }}</v-list-item-title>
                      <v-list-item-subtitle>{{ item.role }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </template>
            `,
      },
    },
    {
      text: "Выбор с кастомным отображением выбранных элементов",
      props: {
        label: "Выберите несколько пользователей",
        items: [
          { id: 1, full_name: "Иван Иванов", avatar: "/avatars/1.jpg" },
          { id: 2, full_name: "Мария Петрова", avatar: "/avatars/2.jpg" },
          { id: 3, full_name: "Сергей Смирнов", avatar: "/avatars/3.jpg" },
        ],
        itemTitle: "full_name",
        itemValue: "id",
        multiple: true,
      },
      slots: {
        selection: `
                <template #selection="{ item, index }">
                  <v-chip small>
                    <v-avatar left>
                      <v-img :src="item.avatar"></v-img>
                    </v-avatar>
                    {{ item.full_name }}
                  </v-chip>
                </template>
            `,
      },
    },
    {
      text: "Выбор с сообщением об отсутствии опций",
      props: {
        label: "Выберите элемент",
        items: [],
        noDataText: "Нет доступных опций",
      },
      slots: {
        noData: `
                <template #no-data>
                  <div class="text-center">Опции не найдены</div>
                </template>
            `,
      },
    },
  ],
  attributeGroups: [
    {
      groupTitle: "Атрибуты",
      attributes: [
        {
          value: "modelValue",
          description:
            "Значение выбранного элемента или элементов. Используется с `v-model` для двустороннего связывания данных.",
          example: '<c-select v-model="selectedOption" :items="options"></c-select>',
        },
        {
          value: "items",
          description:
            "Массив опций для выбора. Каждый элемент массива может быть простым значением или объектом с определёнными свойствами.",
          example: '<c-select :items="options"></c-select>',
        },
        {
          value: "item-title",
          description:
            "Имя свойства объекта опции, которое будет использоваться для отображения текста опции.",
          example: '<c-select :items="options" item-title="full_name"></c-select>',
        },
        {
          value: "item-value",
          description:
            "Имя свойства объекта опции, которое будет использоваться в качестве значения опции.",
          example: '<c-select :items="options" item-value="id"></c-select>',
        },
        {
          value: "multiple",
          description:
            "Если указано, позволяет выбирать несколько опций одновременно.",
          example: '<c-select :items="options" multiple></c-select>',
        },
        {
          value: "hide-details",
          description:
            "Скрывает сообщения об ошибках и подсказки. Значение может быть `true`, `false` или `'auto'`.",
          example: '<c-select :items="options" hide-details="auto"></c-select>',
        },
        {
          value: "label",
          description: "Добавляет метку к полю ввода.",
          example: '<c-select :items="options" label="Выберите опцию"></c-select>',
        },
        {
          value: "placeholder",
          description: "Добавляет текст-заполнитель в поле ввода.",
          example: '<c-select :items="options" placeholder="Выберите..."></c-select>',
        },
        {
          value: "loading",
          description:
            "Показывает индикатор загрузки. Может быть использован при асинхронной загрузке опций.",
          example: '<c-select :items="options" :loading="isLoading"></c-select>',
        },
        {
          value: "no-data-text",
          description:
            "Текст, отображаемый, когда нет доступных опций и слот `no-data` не предоставлен.",
          example: '<c-select :items="[]" no-data-text="Нет доступных опций"></c-select>',
        },
        {
          value: "searchable",
          description:
            "Позволяет пользователям искать по опциям. При включении добавляет поле поиска в выпадающий список.",
          example: '<c-select :items="options" searchable></c-select>',
        },
        {
          value: "disabled",
          description: "Отключает компонент, делая его недоступным для взаимодействия.",
          example: '<c-select :items="options" disabled></c-select>',
        },
        {
          value: "error",
          description: "Показывает компонент в состоянии ошибки.",
          example: '<c-select :items="options" error></c-select>',
        },
        {
          value: "block",
          example: '<c-select block></c-select>',
        },
        {
          value: "error-messages",
          description: "Сообщения об ошибках для отображения пользователю.",
          example:
            '<c-select :items="options" :error-messages="errorMessages"></c-select>',
        },
        // Дополнительные атрибуты можно передавать через `v-bind="$attrs"`.
      ],
    },
    {
      groupTitle: "Слоты",
      attributes: [
        {
          value: "item",
          description:
            "Слот для кастомизации отображения каждой опции в выпадающем списке.",
          example:
            `<c-select :items="users" item-title="full_name" item-value="id">
<template #item="{ item, index }">
  <v-list-item :key="index">
    <v-list-item-avatar>
      <v-img :src="item.avatar"></v-img>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title>{{ item.full_name }}</v-list-item-title>
      <v-list-item-subtitle>{{ item.position }}</v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>
</c-select>`,
        },
        {
          value: "selection",
          description:
            "Слот для кастомизации отображения выбранных элементов в поле ввода.",
          example:
            `<c-select v-model="selectedUsers" :items="users" item-title="full_name" item-value="id" multiple>
<template #selection="{ item, index }">
  <v-chip :key="index" small>
    <v-avatar left>
      <v-img :src="item.avatar"></v-img>
    </v-avatar>
    {{ item.full_name }}
  </v-chip>
</template>
</c-select>`,
        },
        {
          value: "no-data",
          description:
            "Слот для отображения пользовательского контента, когда список опций пуст.",
          example:
            `<c-select :items="[]">
<template #no-data>
  <div class="text-center">Нет доступных опций</div>
</template>
</c-select>`,
        },
      ],
    },
    {
      groupTitle: "Примеры использования",
      attributes: [
        {
          value: "Простой пример",
          description: "Использование `c-select` с базовым списком опций.",
          example:
            `<c-select v-model="selectedOption" :items="['Опция 1', 'Опция 2', 'Опция 3']" label="Выберите опцию"></c-select>`,
        },
        {
          value: "Множественный выбор",
          description: "Использование `c-select` с возможностью выбора нескольких опций.",
          example:
            `<c-select v-model="selectedOptions" :items="options" multiple label="Выберите опции"></c-select>`,
        },
        {
          value: "Кастомизация опций и выбранных элементов",
          description:
            "Использование слотов `item` и `selection` для кастомизации отображения опций и выбранных элементов.",
          example:
            `<c-select v-model="selectedUsers" :items="users" item-title="full_name" item-value="id" multiple>
<!-- Кастомизация опций -->
<template #item="{ item, index }">
  <v-list-item :key="index">
    <v-list-item-avatar>
      <v-img :src="item.avatar"></v-img>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title>{{ item.full_name }}</v-list-item-title>
      <v-list-item-subtitle>{{ item.position }}</v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>
<!-- Кастомизация выбранных элементов -->
<template #selection="{ item, index }">
  <v-chip :key="index" small>
    <v-avatar left>
      <v-img :src="item.avatar"></v-img>
    </v-avatar>
    {{ item.full_name }}
  </v-chip>
</template>
</c-select>`,
        },
        {
          value: "Отображение сообщения при пустом списке опций",
          description:
            "Использование слота `no-data` для отображения пользовательского сообщения, когда нет доступных опций.",
          example:
            `<c-select :items="[]" label="Выберите опцию">
<template #no-data>
  <div class="text-center">Опции не найдены</div>
</template>
</c-select>`,
        },
      ],
    },
  ],
};
