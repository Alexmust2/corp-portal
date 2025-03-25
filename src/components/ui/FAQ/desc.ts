export const dFAQ = {
    title: "FAQ",
    description: "Блок со спойлерами из вопросов",
    defaultComponent: "c-FAQ",
    examples: [
      {
        text: "Личные данные профиля обновляются автоматически с помощью привязанного аккаунта на госуслугах. Самостоятельно изменить можно только видимость личного номера.",
        props: {
          title:
            "Как обновить свои личные данные (адрес, телефон, и т.д.)?",
        },
      },
    ],
    attributeGroups: [
      {
        groupTitle: "Attrubutes",
        attributes: [
          {
            value: "title",
            description: "Сам заголовок с вопросом",
            example: "<c-FAQ title='Заголовок'>Текст под ним</c-FAQ>"
          },
        ],
      },
    ],
  };