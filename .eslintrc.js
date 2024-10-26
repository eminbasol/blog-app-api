module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: ['airbnb-typescript/base', 'plugin:prettier/recommended'],
	overrides: [],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: './tsconfig.eslint.json',
	},
	plugins: ['@typescript-eslint', 'import'],
	rules: {
		'@typescript-eslint/return-await': 'off',
		'@typescript-eslint/no-shadow': 'off',
		'@typescript-eslint/naming-convention': 'off',
		'@typescript-eslint/no-use-before-define': 'off',
		'@typescript-eslint/dot-notation': 'off',
		'@typescript-eslint/no-redeclare': 'off',
		'@typescript-eslint/no-unused-expressions': 'off',
	},
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.ts', '.tsx'],
			},
		},
	},
	ignorePatterns: [],
}
