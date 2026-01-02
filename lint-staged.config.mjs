export default {
  '**/*.{js,mjs,ts,tsx}': ['eslint --fix'],
  '**/*.{js,mjs,ts,tsx,json,md,yml,yaml}': ['prettier --write'],
};
