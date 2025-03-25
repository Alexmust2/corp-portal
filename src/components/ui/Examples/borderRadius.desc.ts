export const dBorderRadius = {
  title: "Стили закруглений",
  description:
    "Набор CSS-классов для добавления различных значений закруглений к элементам.",
  defaultComponent: "div",
  examples: [
    {
      props: { class: "rounded-0 bg-light-blue pa-4" },
      text: ".rounded-0 (0)",
    },
    {
      props: { class: "rounded-sm bg-light-blue pa-4" },
      text: ".rounded-sm (2px)",
    },
    {
      props: { class: "rounded bg-light-blue pa-4" },
      text: ".rounded (4px)",
    },
    {
      props: { class: "rounded-lg bg-light-blue pa-4" },
      text: ".rounded-lg (8px)",
    },
    {
      props: { class: "br-md bg-light-blue pa-4" },
      text: ".br-md (12px)",
    },
    {
      props: { class: "br-lg bg-light-blue pa-4" },
      text: ".br-lg (16px)",
    },
    {
      props: { class: "rounded-xl bg-light-blue pa-4" },
      text: ".rounded-xl (24px)",
    },
    {
      props: { class: "br-xl bg-light-blue pa-4" },
      text: ".br-xl (32px)",
    },
  ],
  attributeGroups: [
    {
      groupTitle: "Стандартные закругления",
      attributes: [
        {
          value: ".rounded",
          description:
            "Небольшое закругление. Применяет `border-radius: 4px` для создания мягкого угла.",
          example: '<div class="rounded">Контент</div>',
        },
        {
          value: ".br-md",
          description:
            "Умеренное закругление. Применяет `border-radius: 12px` для более выраженного закругления углов.",
          example: '<div class="br-md">Контент</div>',
        },
        {
          value: ".br-lg",
          description:
            "Среднее закругление. Применяет `border-radius: 16px`, добавляя заметное округление углов.",
          example: '<div class="br-lg">Контент</div>',
        },
        {
          value: ".br-xl",
          description:
            "Сильное закругление. Применяет `border-radius: 32px` для очень округлых углов.",
          example: '<div class="br-xl">Контент</div>',
        },
      ],
    },
  ],
};
