// describe('Заявления', () => {
//   beforeEach(() => {
//     cy.visit("/auth");
//     cy.get('input[placeholder="Ваша почта"]').type("admin");
//     cy.get('input[placeholder="Ваш пароль"]').type("1234");
//     cy.get("button.form-button").contains("Войти").click();
//     cy.wait(1000)
//     cy.visit("/statements");
//   });

//   it('отображение select для выбора типа заявления', () => {
//     cy.get('[data-cy=request-type-select]').should('exist');
//   });

//   it('Заполнение и отправка заявления', () => {
//     cy.get('[data-cy=request-type-select]').click();
//     cy.get('.v-list-item').contains('Проездной для автомобиля').click();

//     cy.get('[data-cy=car-model-input]').should('be.visible');
//     cy.get('[data-cy=car-number-input]').should('be.visible');

//     cy.get('[data-cy=car-model-input]').type('Toyota Corolla');
//     cy.get('[data-cy=car-number-input]').type('A123BC');

//     cy.get('[data-cy=submit-button]').click();

//     cy.get('tbody tr').should('contain', 'Проездной для автомобиля');
//     cy.get('tbody tr').should('contain', 'Отправлена');
//   });
// });