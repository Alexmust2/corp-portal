export const dStatus = {
    title: "Блок со статусами",
    defaultComponent: "c-status",
    examples: [
      {
        text: "Обработана",
        props: {
          color: "light-green-lighten-3",
          cclass: "ma-2 h-25"
        },
      },
      {
        text: "В работе",
        props: {
          color: "grey-lighten-3",
          cclass: "ma-2 h-25"
        },
      },
      {
        text: "Отклонена",
        props: {
          color: "red-lighten-3",
          cclass: "ma-2 h-25"
        },
      },
      {
        text: "В работе",
        props: {
          color: "grey-lighten-3",
          cclass: "ma-2"
        },
      },
      {
        text: "Обработана",
        props: {
          color: "green-lighten-3",
          cclass: "ma-2"
        },
      },
      {
        text: "Отклонена",
        props: {
          color: "red-lighten-3",
          cclass: "ma-2"
        },
      },
      {
        text: "Отклонена",
        props: {
          color: "red",
          cclass: "ma-2 white--text"
        },
      },
      {
        text: "Обработана",
        props: {
          color: "green",
          cclass: "ma-2 white--text"
        },
      },
      {
        text: "В работе",
        props: {
          color: "grey",
          cclass: "ma-2 white--text"
        },
      },
    ],

    attributeGroups: [
      {
        groupTitle: "Attrubutes",
        attributes: [
          {
            value: "color",
            description: "Цвет чипса",
            example: "<cStatus color='green'>В работе</cStatus>"
          },
          {
            value: "cclass",
            description: "Пользовательский класс с применением на чипс — https://vuetifyjs.com/en/styles/colors/#material-colors",
            example: "<cStatus color='green' cclass='ma-2 white--text'>Обработана</cStatus>"
          },
        ],
      },
    ],
  };
