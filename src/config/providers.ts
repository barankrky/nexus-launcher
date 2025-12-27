import type { ProviderConfig, WordPressProviderConfig } from '../types/game';

/**
 * Default WordPress provider configuration for oyunindir.vip
 */
export const OYUNINDIR_CONFIG: WordPressProviderConfig = {
	baseUrl: 'https://www.oyunindir.vip',
	apiEndpoint: '/wp-json/wp/v2/posts',
	postsPerPage: 30,
	embed: true,
	category: '12', // Filter by PC games category (category ID 12)
};

/**
 * Alternative WordPress provider configurations
 * 
 * These configurations can be used to connect to other WordPress-based
 * game download sites with similar API structures.
 */
export const WORDPRESS_PROVIDERS: Record<string, WordPressProviderConfig> = {
	oyunindir: OYUNINDIR_CONFIG,
	
	// Future provider configurations can be added here
	// Example:
	// anotherSite: {
	//   baseUrl: 'https://another-games-site.com',
	//   apiEndpoint: '/wp-json/wp/v2/posts',
	//   postsPerPage: 20,
	//   embed: true,
	//   category: 'games',
	//   apiKey: process.env.ANOTHER_SITE_API_KEY,
	// },
};

/**
 * Get a WordPress provider configuration by name
 * @param name Provider name (key from WORDPRESS_PROVIDERS)
 * @returns Provider configuration or undefined if not found
 * 
 * @example
 * ```typescript
 * const config = getWordPressProviderConfig('oyunindir');
 * if (config) {
 *   const provider = new WordPressProvider(config);
 * }
 * ```
 */
export function getWordPressProviderConfig(
	name: string
): WordPressProviderConfig | undefined {
	return WORDPRESS_PROVIDERS[name];
}

/**
 * Get all available provider names
 * @returns Array of provider names
 * 
 * @example
 * ```typescript
 * const providers = getAvailableProviders();
 * console.log('Available providers:', providers);
 * ```
 */
export function getAvailableProviders(): string[] {
	return Object.keys(WORDPRESS_PROVIDERS);
}

/**
 * Create a custom WordPress provider configuration
 * @param baseUrl Base URL of the WordPress site
 * @param options Additional configuration options
 * @returns WordPress provider configuration
 * 
 * @example
 * ```typescript
 * const customConfig = createWordPressConfig('https://my-site.com', {
 *   postsPerPage: 20,
 *   category: 'games',
 *   apiKey: 'my-api-key',
 * });
 * ```
 */
export function createWordPressConfig(
	baseUrl: string,
	options: Partial<WordPressProviderConfig> = {}
): WordPressProviderConfig {
	return {
		baseUrl,
		apiEndpoint: options.apiEndpoint || '/wp-json/wp/v2/posts',
		postsPerPage: options.postsPerPage || 30,
		embed: options.embed !== false,
		category: options.category,
		apiKey: options.apiKey,
		headers: options.headers,
	};
}

/**
 * Default configuration values for WordPress providers
 */
export const DEFAULT_PROVIDER_CONFIG = {
	postsPerPage: 30,
	embed: true,
	cacheExpiry: 5 * 60 * 1000, // 5 minutes
	requestTimeout: 30000, // 30 seconds
	maxRetries: 3,
	retryDelay: 1000, // 1 second
} as const;

/**
 * Provider-specific settings and preferences
 */
export const PROVIDER_SETTINGS = {
	/** Whether to use caching for provider responses */
	enableCaching: true,
	
	/** Cache expiration time in milliseconds */
	cacheExpiry: DEFAULT_PROVIDER_CONFIG.cacheExpiry,
	
	/** Maximum number of concurrent requests */
	maxConcurrentRequests: 5,
	
	/** Request timeout in milliseconds */
	requestTimeout: DEFAULT_PROVIDER_CONFIG.requestTimeout,
	
	/** Number of retry attempts for failed requests */
	maxRetries: DEFAULT_PROVIDER_CONFIG.maxRetries,
	
	/** Delay between retry attempts in milliseconds */
	retryDelay: DEFAULT_PROVIDER_CONFIG.retryDelay,
	
	/** Whether to log provider operations */
	enableLogging: process.env.NODE_ENV === 'development',
	
	/** Whether to validate responses against schema */
	validateResponses: true,
	
	/** Custom headers to include in all requests */
	defaultHeaders: {
		'User-Agent': 'Nexus-Launcher/1.0',
		'Accept': 'application/json',
	},
} as const;

/**
 * Environment variable names for provider configuration
 */
export const PROVIDER_ENV_VARS = {
	/** API key for the primary provider */
	PRIMARY_API_KEY: 'NEXUS_PROVIDER_API_KEY',
	
	/** Base URL override for the primary provider */
	PRIMARY_BASE_URL: 'NEXUS_PROVIDER_BASE_URL',
	
	/** Whether to enable provider caching */
	ENABLE_CACHE: 'NEXUS_PROVIDER_CACHE',
	
	/** Cache duration in milliseconds */
	CACHE_DURATION: 'NEXUS_PROVIDER_CACHE_DURATION',
	
	/** Request timeout in milliseconds */
	REQUEST_TIMEOUT: 'NEXUS_PROVIDER_TIMEOUT',
	
	/** Maximum retry attempts */
	MAX_RETRIES: 'NEXUS_PROVIDER_MAX_RETRIES',
} as const;

/**
 * Load provider configuration from environment variables
 * @returns Provider configuration with environment overrides
 * 
 * @example
 * ```typescript
 * const config = loadFromEnvironment(OYUNINDIR_CONFIG);
 * ```
 */
export function loadFromEnvironment(
	baseConfig: WordPressProviderConfig
): WordPressProviderConfig {
	const env = process.env;
	
	return {
		...baseConfig,
		baseUrl: env[PROVIDER_ENV_VARS.PRIMARY_BASE_URL] || baseConfig.baseUrl,
		apiKey: env[PROVIDER_ENV_VARS.PRIMARY_API_KEY] || baseConfig.apiKey,
	};
}

/**
 * Validate a provider configuration
 * @param config Configuration to validate
 * @returns True if configuration is valid, false otherwise
 * 
 * @example
 * ```typescript
 * if (!validateProviderConfig(config)) {
 *   throw new Error('Invalid provider configuration');
 * }
 * ```
 */
export function validateProviderConfig(
	config: ProviderConfig
): boolean {
	// Check required fields
	if (!config.baseUrl) {
		return false;
	}

	// Validate URL format
	try {
		new URL(config.baseUrl);
	} catch {
		return false;
	}

	// Validate headers if provided
	if (config.headers) {
		for (const [key, value] of Object.entries(config.headers)) {
			if (typeof key !== 'string' || typeof value !== 'string') {
				return false;
			}
		}
	}

	return true;
}

/**
 * Get provider statistics and metadata
 * @param config Provider configuration
 * @returns Provider metadata object
 * 
 * @example
 * ```typescript
 * const metadata = getProviderMetadata(OYUNINDIR_CONFIG);
 * console.log('Provider:', metadata.name);
 * ```
 */
export function getProviderMetadata(config: ProviderConfig): {
	name: string;
	baseUrl: string;
	type: 'wordpress' | 'custom';
	hasAuth: boolean;
} {
	return {
		name: 'WordPress Provider',
		baseUrl: config.baseUrl,
		type: 'wordpress',
		hasAuth: !!config.apiKey,
	};
}


