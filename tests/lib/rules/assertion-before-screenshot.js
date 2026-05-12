'use strict'

const rule = require('../../../lib/rules/assertion-before-screenshot')
const tsParser = require('@typescript-eslint/parser')
const { RuleTester } = require('@typescript-eslint/rule-tester')

const ruleTester = new RuleTester()

const errors = [{ messageId: 'unexpected' }]

const tests = {
  valid: [
    { code: 'cy.get(".some-element"); cy.screenshot();' },
    { code: 'cy.get(".some-element").should("exist").screenshot();' },
    { code: 'cy.get(".some-element").should("exist").screenshot().click()' },
    { code: 'cy.get(".some-element").should("exist"); if(true) cy.screenshot();' },
    { code: 'if(true) { cy.get(".some-element").should("exist"); cy.screenshot(); }' },
    { code: 'cy.get(".some-element").should("exist"); if(true) { cy.screenshot(); }' },
    { code: 'const a = () => { cy.get(".some-element").should("exist"); cy.screenshot(); }' },
    { code: 'cy.get(".some-element").should("exist").and("be.visible"); cy.screenshot();' },
    { code: 'cy.get(".some-element").contains("Text"); cy.screenshot();' },
  ],

  invalid: [
    { code: 'cy.screenshot()', errors },
    { code: 'cy.visit("somepage"); cy.screenshot();', errors },
    { code: 'cy.custom(); cy.screenshot()', errors },
    { code: 'cy.get(".some-element").click(); cy.screenshot()', errors },
    { code: 'cy.get(".some-element").click().screenshot()', errors },
    { code: 'if(true) { cy.get(".some-element").click(); cy.screenshot(); }', errors },
    { code: 'cy.get(".some-element").click(); if(true) { cy.screenshot(); }', errors },
    { code: 'cy.get(".some-element"); function a() { cy.screenshot(); }', errors },
    { code: 'cy.get(".some-element"); const a = () => { cy.screenshot(); }', errors },
  ],
}

const typedTests = {
  valid: [
    ...tests.valid,
    {
      code: `
        /// <reference types="cypress" />
        function getElement() {
          return cy.get(".some-element")
        }
        getElement().should("exist").screenshot()
      `,
    },
  ],
  invalid: [
    ...tests.invalid,
    {
      code: `
        /// <reference types="cypress" />
        function getElement() {
          return cy.get(".some-element")
        }
        getElement().click().screenshot()
      `,
      errors,
    },
  ],
}

ruleTester.run('assertion-before-screenshot', rule, tests)

const typedRuleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      projectService: {
        allowDefaultProject: ['*.ts'],
      },
    },
  },
})

typedRuleTester.run('assertion-before-screenshot', rule, typedTests)
