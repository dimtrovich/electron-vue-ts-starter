import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from 'eslint-config-prettier/flat'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

  	globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  	...pluginVue.configs['flat/essential'],
  	vueTsConfigs.recommended,
  	skipFormatting,
  	{
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
			'brace-style': [2, '1tbs'],
			camelcase: ['error', { ignoreDestructuring: true, ignoreGlobals: true, ignoreImports: true }],
			'comma-dangle': ['error', 'always-multiline'],
			'curly': [1, 'all'],
			'no-else-return': ['error', { allowElseIf: false }],
			'no-empty': ['error', { allowEmptyCatch: true }],
			'no-empty-function': ['error'],
			'no-mixed-operators': [
				'error',
				{
					'allowSamePrecedence': true,
					'groups': [
						['&', '|', '^', '~', '<<', '>>', '>>>'],
						['==', '!=', '===', '!==', '>', '>=', '<', '<='],
						['&&', '||'],
						['in', 'instanceof'],
					],
				},
			],
			'object-shorthand': ['error', 'always', { avoidExplicitReturnArrows: true, avoidQuotes: true }],
			'prefer-const': ['error', { destructuring: 'all' }],
			// 'prefer-destructuring': ['error', { 'array': false, 'object': true }, { enforceForRenamedProperties: true }],
			'prefer-object-spread': 'error',
			semi: ['error', 'never'],
			'sort-imports': ['error', { allowSeparatedGroups: true, ignoreCase: true }],
			'sort-keys': ['error', 'asc', { caseSensitive: false, natural: true }],
			'sort-vars': ['error', { ignoreCase: true }],
			'vue/comma-dangle': ['error', 'always-multiline'],
            'vue/multi-word-component-names': 'off',
        },
    },
)
