import config from '@remcohaszing/eslint'

export default [
  ...config,
  {
    rules: {
      'func-style': 'off',
      'n/no-extraneous-import': 'off'
    }
  }
]
