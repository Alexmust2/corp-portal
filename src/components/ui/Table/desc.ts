export const dTable = {
  title: "Таблица",
  description: "Блок с таблицей",
  defaultComponent: "c-table",
  examples: [
    {
      props: {
        search: '',
        headers: [
          { title: '', key: 'selected', width: '5%' },
          { title: 'Сотрудник', key: 'employee' },
          { title: 'Отдел', key: 'department' },
          { title: 'Должность', key: 'position' },
        ],
        items: [
          { selected: true, employee: 'Антон Павлов', department: 'Логистика', position: 'Кладовщик' },
          { selected: false, employee: 'Антон Павлов', department: 'Логистика', position: 'Кладовщик' },
          { selected: false, employee: 'Антон Павлов', department: 'Логистика', position: 'Кладовщик' },
          { selected: false, employee: 'Антон Павлов', department: 'Логистика', position: 'Кладовщик' },
          { selected: false, employee: 'Антон Павлов', department: 'Логистика', position: 'Кладовщик' },
          { selected: false, employee: 'Антон Павлов', department: 'Логистика', position: 'Кладовщик' },
          { selected: false, employee: 'Антон Павлов', department: 'Логистика', position: 'Кладовщик' },
        ],
      }
    },
    {
      props: {
        search: '',
        headers: [
          { title: 'Тип', key: 'type' },
          { title: 'Статус', key: 'status' },
          { title: 'Дата', key: 'date' },
        ],
        items: [
          { type: 'Запрос канцелярии', status: 'disapproved', date: '20.08.2024' },
          { type: 'Запрос канцелярии', status: 'approved', date: '20.08.2024' },
          { type: 'Запрос канцелярии', status: 'approved', date: '20.08.2024' },
          { type: 'Запрос канцелярии', status: 'disapproved', date: '20.08.2024' },
          { type: 'Запрос канцелярии', status: 'approved', date: '20.08.2024' },
          { type: 'Запрос канцелярии', status: 'disapproved', date: '20.08.2024' },
          { type: 'Запрос канцелярии', status: 'disapproved', date: '20.08.2024' },
        ],
      }
    }
  ],
  attributeGroups: [
    {
      groupTitle: "Attrubutes",
      attributes: [
        {
          value: "search",
          description: "Строка поиска",
          example: "<cTable search='disapproved' />"
        },
        {
          value: "headers",
          description: "Список столбцов по `title` и `key`",
          example: "<cTable :headers=\"[\n" +
                   "\t{\n" +
                   "\t\ttext: 'Тип',\n" +
                   "\t\tkey: 'type'\n" +
                   "\t},\n" +
                   "\t{\n" +
                   "\t\ttext: 'Статус',\n" +
                   "\t\tkey: 'status'\n" +
                   "\t},\n" +
                   "\t{\n" +
                   "\t\ttext: 'Дата',\n" +
                   "\t\tkey: 'date'\n" +
                   "\t}\n" +
                   "]\" />"
        },
        {
          value: "items",
          description: "Список объектов, содержащих в себе поля столбцов из `headers.key`",
          example: "<cTable :items=\"[\n" +
                   "\t{\n" +
                   "\t\ttype: 'Запрос канцелярии',\n" +
                   "\t\tstatus: 'disapproved',\n" +
                   "\t\tdate: '20.08.2024'\n" +
                   "\t}\n" +
                   "]\" />"
        }
      ],
    },
    {
      groupTitle: "Заголовок (header)",
      attributes: [
        {
          value: "text",
          description: "Отображаемое имя столбца"
        },
        {
          value: "key",
          description: "Внутреннее название"
        }
      ]
    },
    {
      groupTitle: "Содержимое (item)",
      attributes: [
        {
          value: "Внутреннее название столбца",
          description: "Его значение"
        },
        {
          value: "...",
          description: "И так далее"
        }
      ]
    }
  ],
};
