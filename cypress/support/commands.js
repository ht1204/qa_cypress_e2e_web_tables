import generateUser from './generateUser';

Cypress.Commands.add('fillTheForm',
  (firstName, lastName, email, age, salary, department) => {
    cy.get('#firstName').type(firstName);
    cy.get('#lastName').type(lastName);
    cy.get('#userEmail').type(email);
    cy.get('#age').type(age);
    cy.get('#salary').type(salary);
    cy.get('#department').type(department);
  });

Cypress.Commands.add('clearTheForm', () => {
  cy.get('#firstName').clear();
  cy.get('#lastName').clear();
  cy.get('#userEmail').clear();
  cy.get('#age').clear();
  cy.get('#salary').clear();
  cy.get('#department').clear();
});

// eslint-disable-next-line max-len
Cypress.Commands.add('fillTheFormAndAddWorker',
  (firstName, lastName, email, age, salary, department) => {
    cy.fillTheForm(firstName, lastName, email, age, salary, department);
    cy.get('#submit').click();
  });

Cypress.Commands.add('addUsers', (count) => {
  for (let i = 0; i < count; i++) {
    const { firstName, lastName, email, age, salary, department } =
      generateUser();

    cy.get('#addNewRecordButton').click();
    // eslint-disable-next-line max-len
    cy.fillTheFormAndAddWorker(firstName, lastName, email, age, salary, department);
  }
});
