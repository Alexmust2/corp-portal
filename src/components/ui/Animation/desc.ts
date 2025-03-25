export const dAnimation = {
    title: "Анимация",
    description:
      "Компонент анимации, который позволяет отображать различные анимации, загружаемые из папки public.",
    defaultComponent: "c-animation",
    examples: [
      {
        props: { animationName: "divan" },
        description: "Анимация",
      },
      {
        props: { animationName: "successful_action", class: "custom-size" },
        description: "Анимация с классом для изменения размера.",
      },
    ],
    attributeGroups: [
      {
        groupTitle: "Атрибуты",
        attributes: [
          {
            value: "animationName",
            description: "Имя анимационного файла, который загружается из папки public/anime (без расширения .json).",
            example: '<c-animation animationName="team_building" />',
          },
          {
            value: "class",
            description: "Дополнительные классы для изменения стилей компонента.",
            example: '<c-animation animationName="divan" class="custom-animation-class" />',
          },
        ],
      },
      {
        groupTitle: "Список",
        attributes: [
          {
            value: "divan",
            example: '<c-animation animationName="divan" />',
          },
          {
            value: "notification",
            example: '<c-animation animationName="notification" />',
          },
          {
            value: "successful_action",
            example: '<c-animation animationName="successful_action" />',
          },
          {
            value: "support",
            example: '<c-animation animationName="support" />',
          },
          {
            value: "team_building",
            example: '<c-animation animationName="team_building" />',
          },
        ],
      },
    ],
  };