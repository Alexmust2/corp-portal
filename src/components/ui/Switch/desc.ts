export const dSwitch = {
  title: "Переключатель",
  description:
    "Компонент переключателя, который позволяет включать и выключать различные состояния, а также поддерживает иконки и кастомное позиционирование.",
  defaultComponent: "c-switch",
  examples: [
    {
      props: { top: true, left: true, withIcons: true , value: true},
    },
    {
      props: null,
    },
    {
      props: { bottom: "10px", right: "20px", withIcons: true },
    },
  ],
  attributeGroups: [
    {
      groupTitle: "Атрибуты",
      attributes: [
        {
          value: "modelValue",
          description: "Значение переключателя (true или false).",
          example: '<c-switch v-model="isChecked" />',
        },
        {
          value: "withIcons",
          description: "Добавляет иконки в переключатель.",
          example: "<c-switch with-icons />",
        },
      ],
    },
    {
      groupTitle: "Позиционирование",
      groupDescription: "Позиционирование переключателя на экране.",
      attributes: [
        {
          value: "top",
          description:
            "Позиционирование по верхнему краю (может быть true или значением отступа).",
          example: '<c-switch top="10px" />',
        },
        {
          value: "right",
          description:
            "Позиционирование по правому краю (может быть true или значением отступа).",
          example: '<c-switch right="20px" />',
        },
        {
          value: "bottom",
          description:
            "Позиционирование по нижнему краю (может быть true или значением отступа).",
          example: "<c-switch bottom />",
        },
        {
          value: "left",
          description:
            "Позиционирование по левому краю (может быть true или значением отступа).",
          example: '<c-switch left="30px" />',
        },
      ],
    },
  ],
};
