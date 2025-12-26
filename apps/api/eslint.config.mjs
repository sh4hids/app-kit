import createConfig from '@app-kit/eslint-config/create-config';
import drizzle from 'eslint-plugin-drizzle';
import globals from 'globals';

export default createConfig({
  files: ['**/*.ts', '**/*.js'],
  ignores: ['src/db/migrations/*', 'public/*'],
  languageOptions: {
    globals: globals.node,
  },
  plugins: { drizzle },
  rules: {
    ...drizzle.configs.recommended.rules,
  },
});
