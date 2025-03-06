module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'prettier', 'workspaces', 'jest'],
  extends: [
    'eslint:recommended',
  ],
  root: true,
  env: {
    node: true,
    "jest/globals": true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/parser': 'off',
    'prettier/prettier': 'error'
  },
  settings: {
    jest: {
      globalAliases: {
        describe: ["context"],
        fdescribe: ["fcontext"],
        xdescribe: ["xcontext"]
      }
    }
  }
};
