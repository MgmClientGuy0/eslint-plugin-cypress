# cypress/no-pause

📝 Disallow using `cy.pause()` calls.

<!-- end auto-generated rule header -->

It is recommended to remove any [cy.pause](https://on.cypress.io/pause) commands before committing specs to avoid other developers getting unexpected results.

## Rule Details

Examples of **incorrect** code for this rule:

```js
cy.pause()
cy.get('selector').pause()
```

Examples of **correct** code for this rule:

```js
cy.get('selector')
```

## Typed Linting

If [Typed Linting](../../README.md#typed-linting) is enabled, this rule also catches `cy.pause()` calls when the Cypress chain was started from a helper function.

```js
function getButton() {
	return cy.get('button')
}

getButton().pause()
```
