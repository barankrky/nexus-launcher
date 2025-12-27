/**
 * Provider Configuration - Main Exports
 * 
 * This file exports all configuration-related functionality for easy importing.
 * 
 * @example
 * ```typescript
 * import { OYUNINDIR_CONFIG, getAvailableProviders } from './config';
 * 
 * const providers = getAvailableProviders();
 * console.log('Available providers:', providers);
 * ```
 */

// Default configurations
export {
	OYUNINDIR_CONFIG,
	WORDPRESS_PROVIDERS,
	DEFAULT_PROVIDER_CONFIG,
	PROVIDER_SETTINGS,
	PROVIDER_ENV_VARS,
} from './providers';

// Configuration functions
export {
	getWordPressProviderConfig,
	getAvailableProviders,
	createWordPressConfig,
	loadFromEnvironment,
	validateProviderConfig,
	getProviderMetadata,
} from './providers';

// Re-export types for convenience
export type {
	ProviderConfig,
	WordPressProviderConfig,
} from '../types/game';