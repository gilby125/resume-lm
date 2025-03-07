import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: process.env.NODE_ENV === 'production' ? {} : {
      // Development-only rules
      "jsx-a11y/alt-text": "warn"
    }
  }
];

export default eslintConfig;
