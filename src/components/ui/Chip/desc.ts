export const dChip = {
  title: "Чипc",
  description: "Компонент для создания цветных чипсов с возможностью клика.",
  defaultComponent: "c-chip",
  examples: [
    {
      text: "Your Chip Text",
      props: {
        color: "green",
      },
    },
    {
      text: "Your Chip Text",
      props: {
        color: "red",
      },
    },
    {
      text: "Your Chip Text",
      props: {
        color: "gray",
      },
    },
    {
      text: "Your Chip Text",
      props: {
        color: "white",
      },
    },
    {
      text: "Your Chip Text",
      props: {
        color: "green",
        clickable: "true",
      },
    },
    {
      text: "Your Chip Text",
      props: {
        color: "red",
        clickable: "true",
      },
    },
    {
      text: "Your Chip Text",
      props: {
        color: "gray",
        clickable: "true",
      },
    },
    {
      text: "Your Chip Text",
      props: {
        clickable: "true",
      },
    },
  ],
  attributeGroups: [
    {
      groupTitle: "Атрибуты",
      attributes: [
        {
          value: "color",
          description: "Цвет чипса, поддерживаемые цвета: green, red, gray, white.",
          example: '<c-chip color="green">Your Chip Text</c-chip>',
        },
        {
          value: "onClick",
          description: "Функция, которая будет вызвана при нажатии на чип. Если функция не передана, то кнопка НЕ кликабельная.",
          example: '<c-chip color="green" :onClick="testFunc">Your Chip Text</c-chip>',
        },
      ],
    },
  ],
};
