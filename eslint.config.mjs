// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";
// @ts-expect-error
import eslintConfigPrettier from "eslint-config-prettier";

export default withNuxt({
  rules: {
    "prettier/prettier": "off",
  },
}).append(eslintConfigPrettier);
