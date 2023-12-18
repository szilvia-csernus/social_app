const vitest = require('eslint-plugin-vitest');

module.exports = {
	root: true,
	env: { browser: true, es2020: true, 'jest/globals': true },
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react-hooks/recommended',
		'plugin:vitest/recommended',
	],
	ignorePatterns: ['dist', '.eslintrc.cjs'],
	parser: '@typescript-eslint/parser',
	plugins: ['react-refresh', 'vitest', 'jest'],
	rules: {
		'react-refresh/only-export-components': [
			'warn',
			{ allowConstantExport: true },
		],
		'jest/no-disabled-tests': 'warn',
		'jest/no-focused-tests': 'error',
		'jest/no-identical-title': 'error',
		'jest/prefer-to-have-length': 'warn',
		'jest/valid-expect': 'error',
	},
	globals: {
		...vitest.environments.env.globals,
	},
	settings: {
		jest: {
			globalAliases: {
				describe: ['context'],
				fdescribe: ['fcontext'],
				xdescribe: ['xcontext'],
			},
		},
	},
};
