/**
 * @fileoverview disallow chain of `cy.get()` calls
 * @author benoit
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-chained-get')
const tsParser = require('@typescript-eslint/parser')
const { RuleTester } = require('@typescript-eslint/rule-tester')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester()

const tests = {
  valid: [
    { code: 'cy.get(\'div\')' },
    { code: 'cy.get(\'.div\').find().get()' },
    { code: 'cy.get(\'input\').should(\'be.disabled\')' },
  ],
  invalid: [
    {
      code: 'cy.get(\'div\').get(\'div\')',
      errors: [{ messageId: 'unexpected' }],
    },
  ],
}

const typedTests = {
  valid: [
    ...tests.valid,
    {
      code: `
        /// <reference types="cypress" />
        function getContainer() {
          return cy.get("container")
        }
        getContainer().get("parent").find("child")
      `,
    },
  ],
  invalid: [
    ...tests.invalid,
    {
      code: `
        /// <reference types="cypress" />
        function getContainer() {
          return cy.get("container")
        }
        getContainer().get("parent").get("child")
      `,
      errors: [{ messageId: 'unexpected' }],
    },
  ],
}

ruleTester.run('no-chained-get', rule, tests)

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

typedRuleTester.run('no-chained-get', rule, typedTests)
