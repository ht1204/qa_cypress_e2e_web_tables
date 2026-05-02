/// <reference types='cypress' />

import generateUser from '../support/generateUser';

describe('Web Tables page', () => {
  const { firstName, lastName, age, email, salary, department } =
    generateUser();

  const {
    firstName: newFirstName,
    lastName: newLastName,
    age: newAge,
    email: newEmail,
    salary: newSalary,
    department: newDepartment
  } = generateUser();

  beforeEach(() => {
    cy.visit('/');
  });

  it('should allow adding a new worker', () => {
    cy.get('#addNewRecordButton').click();
    // eslint-disable-next-line max-len
    cy.fillTheFormAndAddWorker(firstName, lastName, email, age, salary, department);

    cy.contains('tbody tr', firstName)
      .should('contain.text', firstName)
      .should('contain.text', lastName)
      .should('contain.text', age)
      .should('contain.text', email)
      .should('contain.text', salary)
      .should('contain.text', department);
  });

  it('should allow deleting a worker', () => {
    cy.get('#addNewRecordButton').click();
    // eslint-disable-next-line max-len
    cy.fillTheFormAndAddWorker(firstName, lastName, email, age, salary, department);

    cy.contains('tbody tr', email)
      .find('[title="Delete"]')
      .invoke('click');

    cy.contains('tbody tr', email).should('not.exist');
  });

  it('should allow deleting all workers', () => {
    cy.get('tbody tr td:first-child').then(($cells) => {
      const names = [...$cells].map((c) => c.textContent);

      names.forEach((name) => {
        cy.contains('tbody tr', name)
          .find('[title="Delete"]')
          .invoke('click');
        cy.contains('tbody tr', name).should('not.exist');
      });
    });
  });

  // eslint-disable-next-line max-len
  it('should allow finding and editing a worker', () => {
    cy.get('#addNewRecordButton').click();
    // eslint-disable-next-line max-len
    cy.fillTheFormAndAddWorker(firstName, lastName, email, age, salary, department);

    cy.get('#searchBox').type(firstName);
    cy.contains('tbody tr', firstName).should('exist');

    cy.contains('tbody tr', firstName)
      .find('[title="Edit"]')
      .invoke('click');

    cy.clearTheForm();
    // eslint-disable-next-line max-len
    cy.fillTheFormAndAddWorker(newFirstName, newLastName, newEmail, newAge, newSalary, newDepartment);

    cy.get('#searchBox').clear();

    cy.contains('tbody tr', newFirstName)
      .should('contain.text', newFirstName)
      .should('contain.text', newLastName)
      .should('contain.text', newAge)
      .should('contain.text', newEmail)
      .should('contain.text', newSalary)
      .should('contain.text', newDepartment);
  });

  it('should search by each column value', () => {
    cy.get('#addNewRecordButton').click();
    // eslint-disable-next-line max-len
    cy.fillTheFormAndAddWorker(firstName, lastName, email, age, salary, department);

    cy.get('#searchBox').type(firstName);
    // eslint-disable-next-line max-len
    cy.contains('tbody tr', firstName).should('contain.text', email);
    cy.get('#searchBox').clear();

    cy.get('#searchBox').type(lastName);
    // eslint-disable-next-line max-len
    cy.contains('tbody tr', lastName).should('contain.text', email);
    cy.get('#searchBox').clear();

    cy.get('#searchBox').type(email);
    // eslint-disable-next-line max-len
    cy.contains('tbody tr', email).should('contain.text', lastName);
    cy.get('#searchBox').clear();

    cy.get('#searchBox').type(age);
    // eslint-disable-next-line max-len
    cy.contains('tbody tr', age).should('contain.text', email);
    cy.get('#searchBox').clear();

    cy.get('#searchBox').type(salary);
    // eslint-disable-next-line max-len
    cy.contains('tbody tr', salary).should('contain.text', email);
    cy.get('#searchBox').clear();

    cy.get('#searchBox').type(department);
    // eslint-disable-next-line max-len
    cy.contains('tbody tr', department).should('contain.text', email);
  });

  it('should change rows count per page', () => {
    cy.addUsers(8);

    cy.get('tbody tr').should('have.length', 10);

    cy.get('select.form-control').select('20');
    cy.get('tbody tr').should('have.length', 11);
  });

  it('should navigate between pages', () => {
    cy.addUsers(8);

    cy.get('tbody tr').should('have.length', 10);

    cy.contains('.pagination button', 'Next').click();
    cy.get('tbody tr').should('have.length', 1);

    cy.contains('.pagination button', 'Previous').click();
    cy.get('tbody tr').should('have.length', 10);
  });
});
