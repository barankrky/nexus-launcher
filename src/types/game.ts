/**
 * Represents a game in the Nexus Launcher system
 */
export interface Game {
	/** Unique identifier for the game */
	id: number;
	/** Display title of the game */
	title: string;
	/** URL-friendly slug for the game */
	slug: string;
	/** URL to the cover image */
	coverImage: string;
	/** URL to the thumbnail image */
	thumbnail: string;
	/** Full description of the game */
	description: string;
	/** Short description/excerpt */
	excerpt: string;
	/** Date when the game was published */
	publishedDate: string;
	/** Author information */
	author: Author;
	/** Categories the game belongs to */
	categories: Category[];
	/** Tags associated with the game */
	tags: Tag[];
	/** Download links for the game */
	downloadLinks: DownloadLink[];
	/** System requirements for the game */
	systemRequirements: SystemRequirements;
	/** Permanent link to the game page */
	permalink: string;
	/** Media gallery images */
	mediaGallery: string[];
}

/**
 * Represents a download link
 */
export interface DownloadLink {
	/** Type of download (direct, torrent, etc.) */
	type: DownloadLinkType;
	/** URL to download the game */
	url: string;
	/** Whether the link is currently available */
	available: boolean;
	/** Display name for the link */
	label: string;
}

/**
 * Types of download links available
 */
export type DownloadLinkType =
	| "direct"
	| "torrent"
	| "mediafire"
	| "googledrive"
	| "pixeldrain"
	| "turbobit"
	| "other";

/**
 * Represents a game category
 */
export interface Category {
	/** Unique identifier for the category */
	id: number;
	/** Display name of the category */
	name: string;
	/** URL-friendly slug for the category */
	slug: string;
	/** Link to the category page */
	link: string;
}

/**
 * Represents a game tag
 */
export interface Tag {
	/** Unique identifier for the tag */
	id: number;
	/** Display name of the tag */
	name: string;
	/** URL-friendly slug for the tag */
	slug: string;
	/** Link to the tag page */
	link: string;
}

/**
 * Represents an author
 */
export interface Author {
	/** Unique identifier for the author */
	id: number;
	/** Display name of the author */
	name: string;
	/** URL-friendly slug for the author */
	slug: string;
	/** Profile link */
	link: string;
	/** Avatar URLs for different sizes */
	avatarUrls: {
		size24: string;
		size48: string;
		size96: string;
	};
}

/**
 * Represents system requirements
 */
export interface SystemRequirements {
	/** Operating system requirements */
	os: string;
	/** CPU/Processor requirements */
	cpu: string;
	/** GPU/Video card requirements */
	gpu: string;
	/** RAM/Memory requirements */
	ram: string;
	/** Storage/disk space requirements */
	storage: string;
	/** DirectX version requirements */
	directX?: string;
	/** Additional requirements or notes */
	additional?: string;
}

/**
 * Represents a WordPress API post response
 */
export interface WordPressPostResponse {
	/** Unique post ID */
	id: number;
	/** Post title with rendered HTML */
	title: {
		rendered: string;
	};
	/** Post content with rendered HTML */
	content: {
		rendered: string;
	};
	/** Post excerpt with rendered HTML */
	excerpt: {
		rendered: string;
	};
	/** Post author ID */
	author: number;
	/** Featured media (cover image) ID */
	featured_media: number;
	/** Category IDs */
	categories: number[];
	/** Tag IDs */
	tags: number[];
	/** Post permalink */
	link: string;
	/** Post slug */
	slug: string;
	/** Post publication date */
	date: string;
	/** Post modification date */
	modified: string;
	/** Embedded data (author, media, terms) */
	_embedded: {
		/** Author information */
		author: WordPressAuthor[];
		/** Featured media */
		"wp:featuredmedia": WordPressMedia[];
		/** Categories and tags */
		"wp:term": WordPressTerm[][];
	};
}

/**
 * Represents WordPress media attachment
 */
export interface WordPressMedia {
	/** Unique media ID */
	id: number;
	/** Media title */
	title: {
		rendered: string;
	};
	/** Source URL of the media */
	source_url: string;
	/** Media type (image, video, etc.) */
	media_type: string;
	/** MIME type */
	mime_type: string;
	/** Media details including sizes */
	media_details: {
		width: number;
		height: number;
		file: string;
		sizes: {
			[prefix: string]: {
				file: string;
				width: number;
				height: number;
				mime_type: string;
				source_url: string;
			};
		};
	};
}

/**
 * Represents WordPress author
 */
export interface WordPressAuthor {
	/** Unique author ID */
	id: number;
	/** Author name */
	name: string;
	/** Author slug */
	slug: string;
	/** Author link */
	link: string;
	/** Avatar URLs */
	avatar_urls: {
		"24": string;
		"48": string;
		"96": string;
	};
}

/**
 * Represents WordPress term (category or tag)
 */
export interface WordPressTerm {
	/** Unique term ID */
	id: number;
	/** Term name */
	name: string;
	/** Term slug */
	slug: string;
	/** Taxonomy type (category or post_tag) */
	taxonomy: string;
	/** Term link */
	link: string;
}

/**
 * Represents a game provider
 */
export interface Provider {
	/** Provider name */
	readonly name: string;
	/** Provider base URL */
	readonly baseUrl: string;
	/**
	 * Fetch a paginated list of games
	 * @param page Page number (1-indexed)
	 * @param limit Number of games per page
	 * @returns Promise resolving to an array of games
	 */
	getGames(page?: number, limit?: number): Promise<Game[]>;
	/**
	 * Fetch a single game by ID
	 * @param id Unique game identifier
	 * @returns Promise resolving to the game or null if not found
	 */
	getGameById(id: number): Promise<Game | null>;
	/**
	 * Search for games by query
	 * @param query Search query string
	 * @returns Promise resolving to an array of matching games
	 */
	searchGames(query: string): Promise<Game[]>;
	/**
	 * Fetch available categories
	 * @returns Promise resolving to an array of categories
	 */
	getCategories(): Promise<Category[]>;
}

/**
 * Provider configuration options
 */
export interface ProviderConfig {
	/** Base URL for the provider API */
	baseUrl: string;
	/** Default category to filter by */
	category?: string;
	/** API key if authentication is required */
	apiKey?: string;
	/** Additional custom headers for requests */
	headers?: Record<string, string>;
}

/**
 * WordPress-specific provider configuration
 */
export interface WordPressProviderConfig extends ProviderConfig {
	/** WordPress REST API endpoint */
	apiEndpoint?: string;
	/** Number of posts per page (default: 10) */
	postsPerPage?: number;
	/** Whether to embed author, media, and term data */
	embed?: boolean;
}

/**
 * Represents paginated response
 */
export interface PaginatedResponse<T> {
	/** Array of items */
	data: T[];
	/** Current page number */
	page: number;
	/** Number of items per page */
	limit: number;
	/** Total number of items */
	total: number;
	/** Total number of pages */
	totalPages: number;
	/** Whether there's a next page */
	hasNextPage: boolean;
	/** Whether there's a previous page */
	hasPreviousPage: boolean;
}
