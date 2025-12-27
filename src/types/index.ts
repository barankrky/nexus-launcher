/**
 * Type Definitions - Main Exports
 * 
 * This file exports all type definitions for easy importing throughout the application.
 * 
 * @example
 * ```typescript
 * import { Game, Provider } from './types';
 * 
 * const game: Game = { /* ... */ };
 * ```
 */

// Core game types
export type {
	Game,
	DownloadLink,
	DownloadLinkType,
	Category,
	Tag,
	Author,
	SystemRequirements,
} from './game';

// Provider types
export type {
	Provider,
	ProviderConfig,
	WordPressProviderConfig,
} from './game';

// WordPress API types
export type {
	WordPressPostResponse,
	WordPressMedia,
	WordPressAuthor,
	WordPressTerm,
} from './game';

// Response types
export type {
	PaginatedResponse,
} from './game';