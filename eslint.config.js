import eslint from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

export default [
  {
    ignores: ["node_modules/**", "dist/**", "*.config.js", "docs/dist/**"],
  },
  eslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setImmediate: "readonly",
        HTMLElement: "readonly",
        HTMLInputElement: "readonly",
        HTMLLabelElement: "readonly",
        Element: "readonly",
        MouseEvent: "readonly",
        KeyboardEvent: "readonly",
        React: "readonly",
        jest: "readonly",
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        MSApp: "readonly",
        MessageChannel: "readonly",
        MutationObserver: "readonly",
        performance: "readonly",
        fetch: "readonly",
        reportError: "readonly",
        queueMicrotask: "readonly",
        __REACT_DEVTOOLS_GLOBAL_HOOK__: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "no-console": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "no-empty": ["error", { allowEmptyCatch: true }],
      "no-constant-condition": ["error", { checkLoops: false }],
      "no-prototype-builtins": "off",
      "no-useless-escape": "warn",
      "no-control-regex": "off",
      "no-func-assign": "off",
      "no-fallthrough": "off",
      "no-cond-assign": ["error", "except-parens"],
      "getter-return": ["error", { allowImplicit: true }],
      "valid-typeof": ["error", { requireStringLiterals: false }],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
