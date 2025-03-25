export const dText = {
  title: "Текстовые стили",
  description:
    "Набор CSS-классов для форматирования текста, включая заголовки и различные размеры шрифта.",
  defaultComponent: "div",
  examples: [
    {
      props: { class: "h1" },
      text: ".h1 22",
    },
    {
      props: { class: "h2" },
      text: ".h2 18",
    },
    {
      props: { class: "h3" },
      text: ".h3 16",
    },
    {
      props: null,
      text: "_ 16",
    },
    {
      props: { class: "sm" },
      text: ".sm 14",
    },
    {
      props: { class: "lg" },
      text: ".lg 18",
    },
    {
      props: { class: "sm bold" },
      text: ".sm.bold 14",
    },
    {
      props: { class: "xs" },
      text: ".xs 14",
    },
  ],
  attributeGroups: [
    {
      groupTitle: "Заголовки",
      attributes: [
        {
          value: ".h1",
          description:
            "Стиль для заголовка первого уровня. Использует шрифт 'Raleway', размер шрифта 22px, межстрочный интервал 1.5. На экранах шириной от 960px устанавливается `line-height: 73%`.",
          example: '<h1 class="h1">Заголовок H1</h1>',
        },
        {
          value: ".h2",
          description:
            "Стиль для заголовка второго уровня. Шрифт 'Raleway', размер шрифта 18px, `line-height: 1.5`. На экранах от 960px размер шрифта увеличивается до 20px.",
          example: '<h2 class="h2">Заголовок H2</h2>',
        },
        {
          value: ".h3",
          description:
            "Стиль для заголовка третьего уровня. Размер шрифта 16px, `line-height: 1.5`. На экранах от 960px размер шрифта увеличивается до 18px.",
          example: '<h3 class="h3">Заголовок H3</h3>',
        },
      ],
    },
    {
      groupTitle: "Размеры текста",
      attributes: [
        {
          value: ".lg",
          description:
            "Большой текст. Размер шрифта 18px, `letter-spacing: -0.02em`. На экранах от 960px размер шрифта увеличивается до 21px.",
          example: '<p class="lg">Большой текст</p>',
        },
        {
          value: ".sm",
          description:
            "Маленький текст. Размер шрифта 14px, `letter-spacing: normal`.",
          example: '<p class="sm">Маленький текст</p>',
        },
        {
          value: ".sm.bold",
          description:
            "Жирный маленький текст. Добавляет `font-weight: 600`, `letter-spacing: -0.01em`. На экранах от 960px размер шрифта увеличивается до 16px, `line-height: 1.3`.",
          example: '<p class="sm bold">Жирный маленький текст</p>',
        },
        {
          value: ".xs",
          description:
            "Очень маленький текст. Размер шрифта 14px, `font-weight: 600`, `letter-spacing: -0.01em`.",
          example: '<p class="xs">Очень маленький текст</p>',
        },
      ],
    },
    {
      groupTitle: "Общие стили",
      attributes: [
        {
          value: "body",
          description:
            "Базовый стиль для тела документа. Шрифт 'Open Sans', цвет `--v-theme-primary`, размер шрифта 16px, `line-height: 1.5`, `letter-spacing: 0.01em`. На экранах от 960px размер шрифта увеличивается до 18px, `letter-spacing: -0.02em`.",
          example: "<body>Ваш контент</body>",
        },
        {
          value: "h1, h2, h3",
          description:
            "Базовые стили для заголовков h1, h2, h3 и соответствующих классов `.h1`, `.h2`, `.h3`. Устанавливают `font-weight: 600`, `font-variant: lining-nums`.",
          example: "<h1>Заголовок</h1>",
        },
      ],
    },
  ],
};