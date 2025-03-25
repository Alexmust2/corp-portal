// describe("Авторизация", () => {
//   beforeEach(() => {
//     cy.visit("/auth");
//     cy.log("Начало теста");
//   });

//   it("Тест авторизации", () => {
//     cy.log("Тест авторизации");

//     cy.get('input[placeholder="Ваша почта"]').type("admin");
//     cy.get('input[placeholder="Ваш пароль"]').type("1234");
//     cy.get("button.form-button").contains("Войти").click();

//     cy.url().should("eq", Cypress.config().baseUrl + "/");
//     cy.window().its("localStorage.token").should("exist");

//     cy.log("Авторизация успешна");
//   });

//   it("Регистрация с динамическим именем пользователя", () => {
//     cy.log("Тест регистрации");

//     const currentDateTime = new Date();
//     const username = `test_${currentDateTime.getTime()}`;
//     const password = "password123";

//     cy.log(`Попытка регистрации с именем пользователя: ${username}`);

//     cy.get('input[placeholder="Ваша почта"]').type(username);
//     cy.get('input[placeholder="Ваш пароль"]').type(password);
//     cy.get("button.form-button").contains("Регистрация").click();

//     cy.url().should("eq", Cypress.config().baseUrl + "/");
//     cy.window().its("localStorage.token").should("exist");

//     cy.log("Регистрация успешна");
//   });

//   it("Тест неверных учетных данных", () => {
//     cy.log("Тест неверных учетных данных");

//     cy.get('input[placeholder="Ваша почта"]').type("wronguser");
//     cy.get('input[placeholder="Ваш пароль"]').type("wrongpassword");
//     cy.get("button.form-button").contains("Войти").click();

//     cy.get("span.error").should("be.visible");

//     cy.log("Ошибка при неверных учетных данных отображена");
//   });

//   it("Тест регистрации с существующим именем пользователя", () => {
//     cy.log("Тест регистрации с существующим именем пользователя");

//     const existingUsername = "admin";
//     const password = "1234";
//     cy.wait(1000)

//     cy.get('input[placeholder="Ваша почта"]').type(existingUsername);
//     cy.get('input[placeholder="Ваш пароль"]').type(password);
//     cy.get("button.form-button").contains("Регистрация").click();

//     cy.get("span.error").should("be.visible");
//     cy.get("span.error").should("contain", "Пользователь с таким именем уже существует");

//     cy.url().should("include", "/auth");

//     cy.log("Ошибка при попытке регистрации с существующим именем пользователя отображена");
//   });

//   afterEach(() => {
//     cy.log("Тест завершен");
//   });
// });
