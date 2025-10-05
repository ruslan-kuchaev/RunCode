import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  // Игнорируем файлы глобально
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "next-env.d.ts",
      "src/app/generated/**",
      "**/*.js",
      "**/*.mjs",
      "**/*.d.ts",
      "**/runtime/**",
      "**/prisma/**",
      "**/.prisma/**"
    ],
  },
  
  // Расширяем конфигурацию Next.js
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  
  // Переопределяем правила
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
      'react-hooks/exhaustive-deps': 'warn'
    },
  },
];

export default eslintConfig;
