import { baseConfig } from './base.js';

export default function createConfig(userConfig = {}) {
  const { ignores: userIgnores = [], ...restConfig } = userConfig;

  return [
    {
      ignores: ['**/node_modules/**', '**/dist/**', '**/.turbo/**', '**/.vite/**', ...userIgnores],
    },
    ...baseConfig,
    Object.keys(restConfig).length > 0 ? restConfig : null,
  ].filter(Boolean);
}
