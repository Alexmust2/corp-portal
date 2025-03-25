export const dCheckbox = {
  title: "Checkbox",
  description:
    "Компонент чекбокса, который позволяет управлять состоянием как с двухсторонним связыванием (v-model), так и без него.",
  defaultComponent: "c-checkbox",
  examples: [
    {
      props: {label: "Текст"},
    },
    {
      text: "Чекбокс с disabled",
      props: { disabled: true },
    },
    {
      text: "Чекбокс с кастомным цветом",
      props: { color: "#FFFF00", value: true },
    },
  ],
  attributeGroups: [
    {
      groupTitle: "Атрибуты",
      attributes: [
        {
          value: "v-model",
          description:
            "Двустороннее связывание состояния чекбокса. При его наличии компонент обновляется через v-model.",
          example: '<c-checkbox v-model="isChecked">Текст</c-checkbox>',
        },
        {
          value: "value",
          description:
            "Начальное состояние компонента, если v-model не передан.",
          example: '<c-checkbox :value="true">Текст</c-checkbox>',
        },
        {
          value: "color",
          description:
            "Цвет активного состояния чекбокса. По умолчанию: #4CAF50.",
          example: '<c-checkbox color="#ff5722">Текст</c-checkbox>',
        },
        {
          value: "unchecked-color",
          description:
            "Цвет неактивного состояния чекбокса. По умолчанию: #9E9E9E.",
          example: '<c-checkbox unchecked-color="#8BC34A">Текст</c-checkbox>',
        },
        {
          value: "disabled",
          description: "Отключает возможность взаимодействия с чекбоксом.",
          example: "<c-checkbox disabled>Текст</c-checkbox>",
        },
      ],
    },
  ],
};
