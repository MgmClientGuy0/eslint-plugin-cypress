'use strict'

const rule = require('../../../lib/rules/no-pause')
const tsParser = require('@typescript-eslint/parser')
const { RuleTester } = require('@typescript-eslint/rule-tester')

const ruleTester = new RuleTester()

const errors = [{ messageId: 'unexpected' }]

const tests = {
  valid: [
    { code: 'pause()' },
    { code: 'cy.get(\'button\').dblclick()' },
  ],

  invalid: [
    { code: 'cy.pause()', errors },
    { code: 'cy.pause({ log: false })', errors },
    { code: 'cy.get(\'button\').pause()', errors },
    { code: 'cy.get(\'a\').should(\'have.attr\', \'href\').and(\'match\', /dashboard/).pause()', errors },
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
        getButton().pause()
      `,
      errors,
    },
  ],
}

ruleTester.run('no-pause', rule, tests)

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

typedRuleTester.run('no-pause', rule, typedTests)
