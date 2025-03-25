export const dBtn = {
  title: "Кнопка",
  description:
    "Компонент кнопки, который позволяет создать различные типы кнопок.",
  defaultComponent: "c-btn",
  examples: [
    {
      props: { size: "sm", color: "accent" },
      text: "Кнопка",
    },
    {
      props: { icon: "mdi-account" },
    },
    {
      props: { prependIcon: "mdi-arrow-left" },
      text: "Назад",
    },
    {
      props: { appendIcon: "mdi-arrow-right" },
      text: "Вперед",
    },
    {
      props: { block: true, color: "grey" },
      text: "Кнопка",
    },
    {
      props: { disabled: true },
      text: "Отключенная кнопка",
    },
    {
      props: { isLoading: true, color: "primary" },
      text: "Кнопка в загрузке",
    },
  ],
  attributeGroups: [
    {
      groupTitle: "Атрибуты",
      attributes: [
        {
          value: "block",
          description: "На всю шиирну",
          example: "<c-btn block></c-btn>",
        },
        {
          value: "disabled",
          description: "Нельзя нажать",
          example: '<c-btn disabled>Отключенная кнопка</c-btn>',
        },
        {
          value: "isLoading",
          description: "Нельзя нажать",
          example: '<c-btn isLoading>Загрузка...</c-btn>',
        },
      ],
    },
    {
      groupTitle: "Размер (size)",
      groupDescription: "по дефолту стоит md",
      attributes: [
        {
          value: "sm",
          description: "height: 40px font-size: 16px line-height: 125%",
          example: '<c-btn size="sm">Кнопка</c-btn>',
        },
        {
          value: "md",
          description: "height: 50px font-size: 18px line-height: 111%",
          example: '<c-btn size="md">Кнопка</c-btn>',
        },
        {
          value: "lg",
          description: "height: 60px font-size: 18px.",
          example: '<c-btn size="lg">Кнопка</c-btn>',
        },
      ],
    },
    {
      groupTitle: "Цвет (color)",
      groupDescription: "по дефолту стоит accent",
      attributes: [
        {
          value: "accent",
          example: '<c-btn color="accent">Кнопка</c-btn>',
        },
      ],
    },
    {
      groupTitle: "Иконки (icon)",
      attributes: [
        {
          value: "icon",
          description: "одна иконка",
          example: '<c-btn icon="mdi-account"/>',
        },
        {
          value: "prepend-icon",
          description: "одна иконка перед текстом",
          example: `<c-btn prepend-icon="mdi-arrow-left">Назад</c-btn>`,
        },
        {
          value: "append-icon",
          description: "одна иконка после текста",
          example: `<c-btn append-icon="mdi-arrow-right">Вперед</c-btn>`,
        },
      ],
    },
  ],
};
