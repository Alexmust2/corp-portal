export const dAlert = {
    title: "Уведомления",
    description: "Компонент с уведомлением",
    defaultComponent: "c-Alert",
    examples: [
      {
        text: "Ваш аккаунт успешно прошёл проверку безопасности. Спасибо, что заботитесь о своей безопасности!",
        props: {
            title: "Заголовок"
        },
      }
    ],
    attributeGroups: [
      {
        groupTitle: "Атрибуты",
        attributes: [
          {
            value: "title",
            description: "Заголовок уведомления",
            example: '<c-alert title="Заголовок">Внутренний текст</c-alert>',
          },
        ],
      },
    ],
  };
