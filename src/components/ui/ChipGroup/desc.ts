export const dChipGroup = {
  title: "Группа чипсов с статическими и динамическими элементами",
  description: "Группа чипсов, позволяющая выбрать несколько элементов, поддерживает как статические, так и динамические чипсы.",
  defaultComponent: "c-chip-group",
  examples: [
    {
      props: {
        modelValue: "selectedChips",
        multiple: false,
      },
      slots: [
        {
          component: "c-chip",
          text: "Chip One",
        },
        {
          component: "c-chip",
          text: "Chip Two",
        },
        {
          component: "c-chip",
          text: "Chip Three",
        },
        {
          component: "c-chip",
          text: "Chip Four",
        },
      ],
    },
    {
      props: {
        modelValue: "selectedChips2",
        multiple: true,
      },
      slots: [
        {
          component: "c-chip",
          vFor: "option in options2",
          key: "option",
          textBinding: "option",
          props: {
            value: "option",
          },
        },
      ],
    },
  ],
  attributeGroups: [
    {
      groupTitle: "Атрибуты группы",
      attributes: [
        {
          value: "modelValue",
          description: "Массив выбранных значений в группе.",
          example: '<c-chip-group v-model="selectedChips" multiple>...</c-chip-group>',
        },
        {
          value: "multiple",
          description: "Включает множественный выбор чипсов в группе.",
          example: '<c-chip-group v-model="selectedChips2" multiple>...</c-chip-group>',
        },
      ],
    },
    {
      groupTitle: "Атрибуты чипсов",
      attributes: [
        {
          value: "value",
          description: "Значение отдельного чипса, используется при динамической генерации.",
          example: '<c-chip :value="option">{{ option }}</c-chip>',
        },
      ],
    },
  ],
};
