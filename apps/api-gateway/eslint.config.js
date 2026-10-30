import base from "../../packages/config/eslint.config.js";

export default [
  ...base,
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parserOptions: {
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
      },
      globals: {
        process: "readonly",
        console: "readonly",
      },
    },
  },
];
