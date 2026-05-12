# cypress/no-debug

📝 Disallow using `cy.debug()` calls.

<!-- end auto-generated rule header -->

It is recommended to remove any [cy.debug](https://on.cypress.io/debug) commands before committing specs to avoid other developers getting unexpected results.

## Rule Details

Examples of **incorrect** code for this rule:

```js
cy.debug()
cy.get('selector').debug()
```

Examples of **correct** code for this rule:

```js
cy.get('selector')
```

## Typed Linting

If [Typed Linting](../../README.md#typed-linting) is enabled, this rule also catches `cy.debug()` calls when the Cypress chain was started from a helper function.

```js
function getButton() {
	return cy.get('button')
}

getButton().debug()
```
