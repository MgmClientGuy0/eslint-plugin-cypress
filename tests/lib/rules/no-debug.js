'use strict'

const rule = require('../../../lib/rules/no-debug')
const tsParser = require('@typescript-eslint/parser')
const { RuleTester } = require('@typescript-eslint/rule-tester')

const ruleTester = new RuleTester()

const errors = [{ messageId: 'unexpected' }]

const tests = {
  valid: [
    { code: 'debug()' },
    { code: 'cy.get(\'button\').dblclick()' },
  ],

  invalid: [
    { code: 'cy.debug()', errors },
    { code: 'cy.debug({ log: false })', errors },
    { code: 'cy.get(\'button\').debug()', errors },
    { code: 'cy.get(\'a\').should(\'have.attr\', \'href\').and(\'match\', /dashboard/).debug()', errors },
  ],
}

const typedTests = {
  valid: [
    ...tests.valid,
    {
      code: `
        /// <reference types="cypress" />
        function getButton() {
          return cy.get("button")
        }
        getButton().click()
      `,
    },
  ],
  invalid: [
    ...tests.invalid,
    {
      code: `
        /// <reference types="cypress" />
        function getButton() {
          return cy.get("button")
        }
        getButton().debug()
      `,
      errors,
    },
  ],
}

ruleTester.run('no-debug', rule, tests)

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

typedRuleTester.run('no-debug', rule, typedTests)
