// describe("Страница пользователей", () => {
//   beforeEach(() => {
//     cy.visit("/auth");
//     cy.get('input[placeholder="Ваша почта"]').type("admin");
//     cy.get('input[placeholder="Ваш пароль"]').type("1234");
//     cy.get("button.form-button").contains("Войти").click();
//     cy.wait(1000);
//     cy.visit("/users");
//   });

//   it("Отображение инпута для поиска пользователей", () => {
//     cy.get("[data-cy=search]").should("exist");
//   });

//   it("Фильтрация пользователей", () => {
//     cy.get("[data-cy=search]").type("admin");
//     cy.get("tbody tr").should("contain", "admin");
//   });

//   it("Редактирование роли пользователя", () => {
//     cy.get("[data-cy=search]").type("admin");
//     cy.get("tbody tr").should("contain", "admin");

//     cy.get("[data-cy=edit-role-icon]").first().click();
//     cy.get("[data-cy=edit-dialog]").should("be.visible");
//     cy.get("[data-cy=edit-dialog] [data-cy=role-select]").click();
//     cy.get(".v-list-item").contains("Бухгалтер").click();
//     cy.get("[data-cy=edit-dialog] [data-cy=save-role]").click();
//     cy.get("[data-cy=edit-dialog]").should("not.exist");
//   });

//   it("Открытие карточки пользователя", () => {
//     cy.get("tbody tr")
//       .first()
//       .find("td")
//       .last()
//       .find("[data-cy=view-user-icon]")
//       .click();
//     cy.get("[data-cy=user-info-card]").should("be.visible");
//   });

//   it("Редактирование разрешение пользователя", () => {
//     cy.get("[data-cy=search]", { timeout: 10000 }).type("admin");
//     cy.get("tbody tr", { timeout: 10000 }).should("contain", "admin");

//     cy.get("tbody tr")
//       .first()
//       .find("td")
//       .last()
//       .find("[data-cy=edit-user-icon]", { timeout: 10000 })
//       .click();
//     cy.get("[data-cy=edit-permissions-dialog]", { timeout: 10000 }).should(
//       "be.visible"
//     );
//     cy.wait(1000); // Добавьте небольшую задержку перед кликом
//     cy.get("[data-cy=permissions-select]", { timeout: 10000 }).click();

//     cy.get("[data-cy=permissions-select]", { timeout: 10000 }).then(($list) => {
//       if ($list.length > 0) {
//         const items = $list.toArray();
//         const randomIndex = Math.floor(Math.random() * items.length);
//         cy.wrap(items[randomIndex]).click();
//       } else {
//         cy.contains("Нет доступных разрешенний").should("exist");
//       }
//     });

//     cy.wait(1000); // Добавьте небольшую задержку перед сохранением
//     cy.get("[data-cy=save-permissions]", { timeout: 10000 }).click();
//     cy.get("[data-cy=edit-permissions-dialog]", { timeout: 10000 }).should(
//       "not.exist"
//     );
//   });
// });
