export const dFileInput = {
  title: "Карточка пользователя",
  description: "Блок с карточкой пользователя",
  defaultComponent: "c-user-card",
  examples: [
    {
      props: {
        fullName: "Ашурова Анна Владимировна",
        jobTitle: "Маркетинг",
        profession: "Копирайтер",
        email: "pochta@mail.ru",
        phone: "+7 (987) 678-97-23",
        imageSrc: "/ui/images/user/card/frame.jpg"
      },
    },
  ],
  attributeGroups: [
    {
      groupTitle: "Attrubutes",
      attributes: [
        {
          value: "fullName",
          description: "ФИО человека в карточке",
          example: "<cUserCard\n" +
                   "\tfullname='Ашурова Анна Владимировна'\n" + 
                   " />"
        },
        {
          value: "jobTitle",
          description: "Кем работает",
          example: "<cUserCard\n" +
                   "\tjobTitle='Маркетинг'\n" +
                   " />"
        },
        {
          value: "profession",
          description: "Должность",
          example: "<cUserCard\n" +
                   "\tprofession='Копирайтер'\n" +
                   " />"
        },
        {
          value: "email",
          description: "Электронная почта",
          example: "<cUserCard\n" +
                   "\temail='pochta@mail.ru'\n" +
                   " />"
        },
        {
          value: "phone",
          description: "Номер телефона",
          example: "<cUserCard\n" +
                   "\tphone='+7 (987) 678-97-23'\n" +
                   " />"
        },
        {
          value: "imageSrc",
          description: "Аватарка",
          example: "<cUserCard\n" +
                   "\timageSrc='images/user/card/frame.jpg'\n" + 
                   " />"
        },
      ],
    },
  ],
};
