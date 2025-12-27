/**
 * Provider System - Main Exports
 *
 * This file exports all provider-related functionality for easy importing.
 *
 * @example
 * ```typescript
 * import { WordPressProvider, Provider } from './providers';
 * import { OYUNINDIR_CONFIG } from './config/providers';
 *
 * const provider: Provider = new WordPressProvider(OYUNINDIR_CONFIG);
 * ```
 */

// Base provider class
export { BaseProvider } from "./base-provider";

// WordPress provider implementation
export { WordPressProvider } from "./wordpress-provider";

// Re-export types for convenience
export type {
	Game,
	DownloadLink,
	DownloadLinkType,
	Category,
	Tag,
	Author,
	SystemRequirements,
	WordPressPostResponse,
	WordPressMedia,
	WordPressAuthor,
	WordPressTerm,
	Provider,
	ProviderConfig,
	WordPressProviderConfig,
	PaginatedResponse,
} from "../types/game";
