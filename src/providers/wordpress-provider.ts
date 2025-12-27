import { BaseProvider } from './base-provider';
import type {
	Game,
	Category,
	WordPressPostResponse,
	WordPressMedia,
	WordPressAuthor,
	WordPressTerm,
	WordPressProviderConfig,
	Author,
	Tag,
	DownloadLink,
	SystemRequirements,
} from '../types/game';

/**
 * WordPress-based game provider
 * 
 * This provider fetches game data from a WordPress REST API,
 * specifically designed to work with oyunindir.vip or similar
 * WordPress-based game download sites.
 * 
 * @example
 * ```typescript
 * const provider = new WordPressProvider({
 *   baseUrl: 'https://www.oyunindir.vip',
 *   apiEndpoint: '/wp-json/wp/v2/posts',
 *   postsPerPage: 10,
 * });
 * 
 * const games = await provider.getGames(1, 10);
 * ```
 */
export class WordPressProvider extends BaseProvider {
	public readonly name = 'WordPress Provider';
	
	/** WordPress REST API endpoint path */
	private readonly apiEndpoint: string;
	
	/** Number of posts per page */
	private readonly postsPerPage: number;
	
	/** Whether to embed related data */
	private readonly embed: boolean;

	/**
	 * Creates a new WordPressProvider instance
	 * @param config WordPress provider configuration
	 */
	constructor(config: WordPressProviderConfig) {
		super(config);
		this.apiEndpoint = config.apiEndpoint || '/wp-json/wp/v2/posts';
		this.postsPerPage = config.postsPerPage || 10;
		this.embed = config.embed !== false;
	}

	/**
	 * Fetch a paginated list of games
	 * @param page Page number (1-indexed, default: 1)
	 * @param limit Number of games per page (default: 10)
	 * @returns Promise resolving to an array of games
	 */
	public async getGames(page = 1, limit = 10): Promise<Game[]> {
		const cacheKey = `games-${page}-${limit}`;
		const cached = this.getFromCache<Game[]>(cacheKey);
		if (cached) {
			return cached;
		}

		try {
			const url = this.buildApiUrl({
				page,
				per_page: Math.min(limit, this.postsPerPage),
				_embed: this.embed ? '1' : undefined,
				// Filter by category if specified in config
				categories: this.config.category ? undefined : undefined,
			});

			const response = await fetch(url, {
				headers: this.buildHeaders(),
			});

			if (!response.ok) {
				this.handleError(
					new Error(`HTTP ${response.status}: ${response.statusText}`),
					'Failed to fetch games'
				);
			}

			const posts: WordPressPostResponse[] = await response.json();
			const games = await Promise.all(
				posts.map((post) => this.transformPostToGame(post))
			);

			this.setCache(cacheKey, games);
			return games;
		} catch (error) {
			this.handleError(error, 'Error fetching games');
		}
	}

	/**
	 * Fetch a single game by ID
	 * @param id Unique game identifier (WordPress post ID)
	 * @returns Promise resolving to the game or null if not found
	 */
	public async getGameById(id: number): Promise<Game | null> {
		const cacheKey = `game-${id}`;
		const cached = this.getFromCache<Game>(cacheKey);
		if (cached) {
			return cached;
		}

		try {
			// For single post, ID should be in the path, not as a query parameter
			const embedParam = this.embed ? '?_embed=1' : '';
			const url = `${this.config.baseUrl}${this.apiEndpoint}/${id}${embedParam}`;

			const response = await fetch(url, {
				headers: this.buildHeaders(),
			});

			if (!response.ok) {
				if (response.status === 404) {
					return null;
				}
				this.handleError(
					new Error(`HTTP ${response.status}: ${response.statusText}`),
					'Failed to fetch game'
				);
			}

			const post: WordPressPostResponse = await response.json();
			const game = await this.transformPostToGame(post);
			
			this.setCache(cacheKey, game);
			return game;
		} catch (error) {
			this.handleError(error, `Error fetching game with id ${id}`);
		}
	}

	/**
	 * Search for games by query
	 * @param query Search query string
	 * @returns Promise resolving to an array of matching games
	 */
	public async searchGames(query: string): Promise<Game[]> {
		if (!query.trim()) {
			return [];
		}

		const cacheKey = `search-${query}`;
		const cached = this.getFromCache<Game[]>(cacheKey);
		if (cached) {
			return cached;
		}

		try {
			const url = this.buildApiUrl({
				search: query,
				_embed: this.embed ? '1' : undefined,
				per_page: this.postsPerPage,
			});

			const response = await fetch(url, {
				headers: this.buildHeaders(),
			});

			if (!response.ok) {
				this.handleError(
					new Error(`HTTP ${response.status}: ${response.statusText}`),
					'Failed to search games'
				);
			}

			const posts: WordPressPostResponse[] = await response.json();
			const games = await Promise.all(
				posts.map((post) => this.transformPostToGame(post))
			);

			this.setCache(cacheKey, games);
			return games;
		} catch (error) {
			this.handleError(error, `Error searching for games: ${query}`);
		}
	}

	/**
	 * Fetch available categories
	 * @returns Promise resolving to an array of categories
	 */
	public async getCategories(): Promise<Category[]> {
		const cacheKey = 'categories';
		const cached = this.getFromCache<Category[]>(cacheKey);
		if (cached) {
			return cached;
		}

		try {
			const url = `${this.config.baseUrl}/wp-json/wp/v2/categories?per_page=100`;
			
			const response = await fetch(url, {
				headers: this.buildHeaders(),
			});

			if (!response.ok) {
				this.handleError(
					new Error(`HTTP ${response.status}: ${response.statusText}`),
					'Failed to fetch categories'
				);
			}

			const terms: WordPressTerm[] = await response.json();
			const categories: Category[] = terms.map((term) => ({
				id: term.id,
				name: term.name,
				slug: term.slug,
				link: term.link,
			}));

			this.setCache(cacheKey, categories);
			return categories;
		} catch (error) {
			this.handleError(error, 'Error fetching categories');
		}
	}

	/**
	 * Fetch games by category
	 * @param categoryId Category identifier
	 * @param page Page number (default: 1)
	 * @param limit Number of games per page (default: 10)
	 * @returns Promise resolving to an array of games in the category
	 */
	public async getGamesByCategory(
		categoryId: number,
		page = 1,
		limit = 10
	): Promise<Game[]> {
		const cacheKey = `category-${categoryId}-${page}-${limit}`;
		const cached = this.getFromCache<Game[]>(cacheKey);
		if (cached) {
			return cached;
		}

		try {
			const url = this.buildApiUrl({
				page,
				per_page: Math.min(limit, this.postsPerPage),
				categories: categoryId,
				_embed: this.embed ? '1' : undefined,
			});

			const response = await fetch(url, {
				headers: this.buildHeaders(),
			});

			if (!response.ok) {
				this.handleError(
					new Error(`HTTP ${response.status}: ${response.statusText}`),
					'Failed to fetch games by category'
				);
			}

			const posts: WordPressPostResponse[] = await response.json();
			const games = await Promise.all(
				posts.map((post) => this.transformPostToGame(post))
			);

			this.setCache(cacheKey, games);
			return games;
		} catch (error) {
			this.handleError(
				error,
				`Error fetching games for category ${categoryId}`
			);
		}
	}

	/**
	 * Transform a WordPress post to a Game object
	 * @param post WordPress post response
	 * @returns Promise resolving to a Game object
	 */
	private async transformPostToGame(post: WordPressPostResponse): Promise<Game> {
		// Extract author from embedded data
		const authorData = post._embedded?.author?.[0];
		const author: Author = authorData
			? {
					id: authorData.id,
					name: authorData.name,
					slug: authorData.slug,
					link: authorData.link,
					avatarUrls: {
						size24: authorData.avatar_urls['24'],
						size48: authorData.avatar_urls['48'],
						size96: authorData.avatar_urls['96'],
					},
				}
			: {
					id: post.author,
					name: 'Unknown',
					slug: 'unknown',
					link: '',
					avatarUrls: {
						size24: '',
						size48: '',
						size96: '',
					},
				};

		// Extract featured media
		const mediaData = post._embedded?.['wp:featuredmedia']?.[0];
		const coverImage = mediaData?.source_url || '';
		const thumbnail =
			mediaData?.media_details?.sizes?.thumbnail?.source_url || coverImage || '';

		// Extract categories
		const categoryTerms = post._embedded?.['wp:term']?.[0] || [];
		const categories: Category[] = categoryTerms.map((term) => ({
			id: term.id,
			name: term.name,
			slug: term.slug,
			link: term.link,
		}));

		// Extract tags
		const tagTerms = post._embedded?.['wp:term']?.[1] || [];
		const tags: Tag[] = tagTerms.map((term) => ({
			id: term.id,
			name: term.name,
			slug: term.slug,
			link: term.link,
		}));

		// Extract download links from content
		const downloadLinks: DownloadLink[] = this.extractDownloadLinks(
			post.content.rendered
		);

		// Extract system requirements from content
		const systemRequirements: SystemRequirements = this.extractSystemRequirements(
			post.content.rendered
		);

		// Extract media gallery
		const mediaGallery: string[] = this.extractMediaGallery(post.content.rendered);

		return {
			id: post.id,
			title: this.sanitizeHtml(post.title.rendered),
			slug: post.slug,
			coverImage,
			thumbnail,
			description: this.sanitizeHtml(post.content.rendered),
			excerpt: this.sanitizeHtml(post.excerpt.rendered),
			publishedDate: post.date,
			author,
			categories,
			tags,
			downloadLinks,
			systemRequirements,
			permalink: post.link,
			mediaGallery,
		};
	}

	/**
	 * Build WordPress REST API URL with query parameters
	 * @param params Query parameters
	 * @returns Complete API URL
	 */
	private buildApiUrl(params: Record<string, string | number | undefined>): string {
		const url = new URL(this.apiEndpoint, this.config.baseUrl);
		
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				url.searchParams.append(key, String(value));
			}
		});

		return url.toString();
	}

	/**
	 * Build request headers
	 * @returns Headers object
	 */
	private buildHeaders(): Record<string, string> {
		const headers: Record<string, string> = {
			'Accept': 'application/json',
		};

		// Add API key if configured
		if (this.config.apiKey) {
			headers['Authorization'] = `Bearer ${this.config.apiKey}`;
		}

		// Add custom headers from config
		if (this.config.headers) {
			Object.entries(this.config.headers).forEach(([key, value]) => {
				headers[key] = value;
			});
		}

		return headers;
	}
}