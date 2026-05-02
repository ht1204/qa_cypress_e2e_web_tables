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

      for (let i = names.length - 1; i >= 0; i--) {
        cy.contains('tbody tr', names[i])
          .find('[title="Delete"]')
          .invoke('click');
        cy.contains('tbody tr', names[i]).should('not.exist');
      }
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

    cy.get('#searchBox').should('be.visible').type(firstName);
    // eslint-disable-next-line max-len
    cy.get('tbody tr').should('contain.text', firstName)
      .and('contain.text', email);
    cy.get('#searchBox').clear();

    cy.get('#searchBox').should('be.visible').type(lastName);
    // eslint-disable-next-line max-len
    cy.get('tbody tr').should('contain.text', lastName)
      .and('contain.text', email);
    cy.get('#searchBox').clear();

    cy.get('#searchBox').should('be.visible').type(email);
    // eslint-disable-next-line max-len
    cy.get('tbody tr').should('contain.text', email)
      .and('contain.text', lastName);
    cy.get('#searchBox').clear();

    cy.get('#searchBox').should('be.visible').type(age);
    // eslint-disable-next-line max-len
    cy.get('tbody tr').should('contain.text', age)
      .and('contain.text', email);
    cy.get('#searchBox').clear();

    cy.get('#searchBox').should('be.visible').type(salary);
    // eslint-disable-next-line max-len
    cy.get('tbody tr').should('contain.text', salary)
      .and('contain.text', email);
    cy.get('#searchBox').clear();

    cy.get('#searchBox').should('be.visible').type(department);
    // eslint-disable-next-line max-len
    cy.get('tbody tr').should('contain.text', department)
      .and('contain.text', email);
  });

  it('should change rows count per page', () => {
    cy.get('tbody tr').its('length').then((initialCount) => {
      const total = initialCount + 8;

      cy.addUsers(8);
      cy.get('tbody tr').should('have.length', Math.min(total, 10));

      cy.get('select.form-control').select('20');
      cy.get('tbody tr').should('have.length', total);
    });
  });

  it('should navigate between pages', () => {
    cy.get('tbody tr').its('length').then((initialCount) => {
      const total = initialCount + 8;

      cy.addUsers(8);
      cy.get('tbody tr').should('have.length', Math.min(total, 10));

      cy.contains('.pagination button', 'Next').click();
      // eslint-disable-next-line max-len
      cy.get('tbody tr').should('have.length', total - 10);

      cy.contains('.pagination button', 'Previous').click();
      cy.get('tbody tr').should('have.length', Math.min(total, 10));
    });
  });
});
