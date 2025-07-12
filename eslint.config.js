import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import react from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import reactCompiler from 'eslint-plugin-react-compiler';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.strict,
      eslintPluginPrettier,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'react-compiler': reactCompiler,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react-compiler/react-compiler': 'error',
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      '@typescript-eslint/no-explicit-any': 'error',
      // Требует описывать возвращаемый тип у экспортируемых функций (внешние API)
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      // Предупреждает, если функция неявно возвращает undefined
      '@typescript-eslint/no-confusing-void-expression': 'warn',
      // ✍️ Требует писать return тип у функций (особенно полезно в коллбэках)
      '@typescript-eslint/explicit-function-return-type': 'warn',

      // объявления переменных без использования
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      // неявное преобразование типов (например, !!value, value + '')
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',

      // объявление переменной и сразу её переприсвоение
      '@typescript-eslint/prefer-const': 'err',

      // 💡 Предупреждает, если тип можно вывести
      '@typescript-eslint/no-inferrable-types': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  }
);
