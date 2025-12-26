import { baseConfig } from "./base.js";

/**
 * Create a Prettier config by extending the base.
 * User options override base options.
 *
 * @param {Partial<import('prettier').Options>} userConfig
 * @returns {import('prettier').Options}
 */
export default function createConfig(userConfig = {}) {
  return {
    ...baseConfig,
    ...userConfig,
  };
}
