module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'standard',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 0,
    camelcase: 'off',
    // '@typescript-eslint/camelcase': 'off',
    'react/no-unescaped-entities': 0,
    'no-unused-vars': 'off',
    'no-empty-pattern': 0,
    'handle-callback-err': 0,
    'array-callback-return': 0
  },
  ignorePatterns: ['build/*', 'node_modules/*', 'public/*']
};
