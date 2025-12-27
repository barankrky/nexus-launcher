import { OYUNINDIR_CONFIG } from "../config/providers";
import { WordPressProvider } from "../providers/wordpress-provider";
import type { Category, Game, PaginatedResponse } from "../types/game";

/**
 * Provider Service - Singleton service for managing game provider interactions
 *
 * This service wraps the WordPressProvider with React-friendly patterns,
 * including error handling, logging, and consistent interfaces.
 *
 * @example
 * ```typescript
 * import { providerService } from '@/services/provider-service';
 *
 * const games = await providerService.getGames(1, 10);
 * ```
 */
class ProviderService {
	private provider: WordPressProvider;
	private isInitialized = false;

	private constructor() {
		this.provider = new WordPressProvider(OYUNINDIR_CONFIG);
		this.isInitialized = true;
		this.log("Provider service initialized");
	}

	/**
	 * Get the singleton instance of the ProviderService
	 * @returns The singleton instance
	 */
	public static getInstance(): ProviderService {
		if (!ProviderService.instance) {
			ProviderService.instance = new ProviderService();
		}
		return ProviderService.instance;
	}

	private static instance: ProviderService | null = null;

	/**
	 * Log a message with provider context
	 * @param message Message to log
	 * @param level Log level (info, warn, error)
	 */
	private log(
		message: string,
		level: "info" | "warn" | "error" = "info",
	): void {
		const timestamp = new Date().toISOString();
		const logMessage = `[ProviderService ${timestamp}] ${message}`;

		switch (level) {
			case "error":
				console.error(logMessage);
				break;
			case "warn":
				console.warn(logMessage);
				break;
			default:
				console.log(logMessage);
		}
	}

	/**
	 * Handle errors consistently across service methods
	 * @param error Error object
	 * @param context Context where the error occurred
	 * @throws Error with additional context
	 */
	private handleError(error: unknown, context: string): never {
		const message = error instanceof Error ? error.message : String(error);
		const errorMessage = `[ProviderService] ${context}: ${message}`;
		this.log(errorMessage, "error");
		throw new Error(errorMessage);
	}

	/**
	 * Fetch a paginated list of games
	 * @param page Page number (1-indexed, default: 1)
	 * @param limit Number of games per page (default: 10)
	 * @returns Promise resolving to an array of games
	 *
	 * @example
	 * ```typescript
	 * const games = await providerService.getGames(1, 10);
	 * ```
	 */
	public async getGames(page = 1, limit = 10): Promise<Game[]> {
		try {
			this.log(`Fetching games - page: ${page}, limit: ${limit}`);
			const games = await this.provider.getGames(page, limit);
			this.log(`Successfully fetched ${games.length} games`);
			return games;
		} catch (error) {
			this.handleError(
				error,
				`Failed to fetch games (page: ${page}, limit: ${limit})`,
			);
		}
	}

	/**
	 * Fetch a single game by ID
	 * @param id Unique game identifier
	 * @returns Promise resolving to the game
	 * @throws Error if game is not found
	 *
	 * @example
	 * ```typescript
	 * const game = await providerService.getGameById(12345);
	 * ```
	 */
	public async getGameById(id: number): Promise<Game> {
		try {
			this.log(`Fetching game with id: ${id}`);
			const game = await this.provider.getGameById(id);

			if (!game) {
				this.log(`Game with id ${id} not found`, "warn");
				throw new Error(`Game with id ${id} not found`);
			}

			this.log(`Successfully fetched game: ${game.title}`);
			return game;
		} catch (error) {
			this.handleError(error, `Failed to fetch game with id ${id}`);
		}
	}

	/**
	 * Search for games by query
	 * @param query Search query string
	 * @returns Promise resolving to an array of matching games
	 *
	 * @example
	 * ```typescript
	 * const results = await providerService.searchGames('action');
	 * ```
	 */
	public async searchGames(query: string): Promise<Game[]> {
		try {
			if (!query.trim()) {
				this.log("Search query is empty, returning empty results");
				return [];
			}

			this.log(`Searching games with query: "${query}"`);
			const games = await this.provider.searchGames(query);
			this.log(`Found ${games.length} games matching "${query}"`);
			return games;
		} catch (error) {
			this.handleError(error, `Failed to search games with query "${query}"`);
		}
	}

	/**
	 * Fetch available categories
	 * @returns Promise resolving to an array of categories
	 *
	 * @example
	 * ```typescript
	 * const categories = await providerService.getCategories();
	 * ```
	 */
	public async getCategories(): Promise<Category[]> {
		try {
			this.log("Fetching categories");
			const categories = await this.provider.getCategories();
			this.log(`Successfully fetched ${categories.length} categories`);
			return categories;
		} catch (error) {
			this.handleError(error, "Failed to fetch categories");
		}
	}

	/**
	 * Fetch games with pagination metadata
	 * @param page Page number (default: 1)
	 * @param limit Number of games per page (default: 10)
	 * @returns Promise resolving to paginated response
	 *
	 * @example
	 * ```typescript
	 * const response = await providerService.getGamesPaginated(1, 20);
	 * console.log(`Page ${response.page} of ${response.totalPages}`);
	 * ```
	 */
	public async getGamesPaginated(
		page = 1,
		limit = 10,
	): Promise<PaginatedResponse<Game>> {
		try {
			this.log(`Fetching paginated games - page: ${page}, limit: ${limit}`);
			const paginatedResponse = await this.provider.getGamesPaginated(
				page,
				limit,
			);
			this.log(
				`Successfully fetched paginated games - page: ${paginatedResponse.page}, ` +
					`total: ${paginatedResponse.total}, total pages: ${paginatedResponse.totalPages}`,
			);
			return paginatedResponse;
		} catch (error) {
			this.handleError(
				error,
				`Failed to fetch paginated games (page: ${page}, limit: ${limit})`,
			);
		}
	}

	/**
	 * Fetch games by category
	 * @param categoryId Category identifier
	 * @param page Page number (default: 1)
	 * @param limit Number of games per page (default: 10)
	 * @returns Promise resolving to an array of games in the category
	 *
	 * @example
	 * ```typescript
	 * const actionGames = await providerService.getGamesByCategory(5, 1, 20);
	 * ```
	 */
	public async getGamesByCategory(
		categoryId: number,
		page = 1,
		limit = 10,
	): Promise<Game[]> {
		try {
			this.log(
				`Fetching games for category ${categoryId} - page: ${page}, limit: ${limit}`,
			);
			const games = await this.provider.getGamesByCategory(
				categoryId,
				page,
				limit,
			);
			this.log(
				`Successfully fetched ${games.length} games for category ${categoryId}`,
			);
			return games;
		} catch (error) {
			this.handleError(
				error,
				`Failed to fetch games for category ${categoryId} (page: ${page}, limit: ${limit})`,
			);
		}
	}

	/**
	 * Check if the provider is healthy/responsive
	 * @returns Promise resolving to true if provider is healthy
	 *
	 * @example
	 * ```typescript
	 * const isHealthy = await providerService.healthCheck();
	 * if (!isHealthy) {
	 *   console.error('Provider is not responding');
	 * }
	 * ```
	 */
	public async healthCheck(): Promise<boolean> {
		try {
			this.log("Performing health check");
			const isHealthy = await this.provider.healthCheck();

			if (isHealthy) {
				this.log("Health check passed");
			} else {
				this.log("Health check failed", "warn");
			}

			return isHealthy;
		} catch (error) {
			this.handleError(error, "Failed to perform health check");
		}
	}

	/**
	 * Clear the provider cache
	 *
	 * @example
	 * ```typescript
	 * providerService.clearCache();
	 * ```
	 */
	public clearCache(): void {
		try {
			this.log("Clearing provider cache");
			this.provider.clearCache();
			this.log("Provider cache cleared successfully");
		} catch (error) {
			this.handleError(error, "Failed to clear provider cache");
		}
	}

	/**
	 * Get the provider instance
	 * @returns The underlying WordPressProvider instance
	 *
	 * @example
	 * ```typescript
	 * const provider = providerService.getProvider();
	 * ```
	 */
	public getProvider(): WordPressProvider {
		if (!this.isInitialized) {
			throw new Error("Provider service is not initialized");
		}
		return this.provider;
	}

	/**
	 * Get provider configuration
	 * @returns Current provider configuration
	 *
	 * @example
	 * ```typescript
	 * const config = providerService.getConfig();
	 * ```
	 */
	public getConfig() {
		return this.provider.getConfig();
	}

	/**
	 * Check if the service is initialized
	 * @returns True if the service is initialized
	 */
	public isReady(): boolean {
		return this.isInitialized;
	}
}

// Export singleton instance
export const providerService = ProviderService.getInstance();
