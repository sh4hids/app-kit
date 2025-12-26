import type { Linter } from 'eslint';

/**
 * A Flat ESLint config with optional global ignores.
 *
 * `ignores` is lifted to the top level so it can be merged
 * with the base ignores by createConfig.
 */
export type CreateConfigInput = Linter.FlatConfig & {
  /**
   * Additional ignore patterns to be merged with base ignores.
   */
  ignores?: string[];
};

/**
 * Creates an ESLint flat config array by extending the base config.
 *
 * - Base config is always applied first
 * - User config is applied last and always wins
 * - `ignores` are merged globally
 */
declare function createConfig(config?: CreateConfigInput): Linter.FlatConfig[];

export default createConfig;
