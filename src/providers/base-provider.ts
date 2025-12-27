import type {
	Game,
	Category,
	Provider,
	ProviderConfig,
	PaginatedResponse,
} from '../types/game';

/**
 * Abstract base class for game providers
 * 
 * This class provides a common interface and shared functionality
 * for all game data providers (WordPress, custom APIs, etc.)
 * 
 * @example
 * ```typescript
 * class CustomProvider extends BaseProvider {
 *   public readonly name = 'Custom Provider';
 *   
 *   async getGames(page = 1, limit = 10): Promise<Game[]> {
 *     // Implementation specific to this provider
 *   }
 * }
 * ```
 */
export abstract class BaseProvider implements Provider {
	/** Provider configuration */
	protected config: ProviderConfig;

	/** Cached games for performance optimization */
	protected cache: Map<string, Game[]> = new Map();

	/** Cache expiration time in milliseconds (default: 5 minutes) */
	protected cacheExpiry = 5 * 60 * 1000;

	/** Cache timestamps for each cache entry */
	protected cacheTimestamps: Map<string, number> = new Map();

	/**
	 * Creates a new BaseProvider instance
	 * @param config Provider configuration options
	 */
	constructor(config: ProviderConfig) {
		this.config = config;
	}

	/** Provider name - must be implemented by subclasses */
	public abstract readonly name: string;

	/**
	 * Fetch a paginated list of games
	 * @param page Page number (1-indexed, default: 1)
	 * @param limit Number of games per page (default: 10)
	 * @returns Promise resolving to an array of games
	 * 
	 * @example
	 * ```typescript
	 * const games = await provider.getGames(1, 20);
	 * console.log(`Found ${games.length} games`);
	 * ```
	 */
	public abstract getGames(page?: number, limit?: number): Promise<Game[]>;

	/**
	 * Fetch a single game by ID
	 * @param id Unique game identifier
	 * @returns Promise resolving to the game or null if not found
	 * 
	 * @example
	 * ```typescript
	 * const game = await provider.getGameById(12345);
	 * if (game) {
	 *   console.log(`Found: ${game.title}`);
	 * }
	 * ```
	 */
	public abstract getGameById(id: number): Promise<Game | null>;

	/**
	 * Search for games by query
	 * @param query Search query string
	 * @returns Promise resolving to an array of matching games
	 * 
	 * @example
	 * ```typescript
	 * const results = await provider.searchGames('action');
	 * console.log(`Found ${results.length} action games`);
	 * ```
	 */
	public abstract searchGames(query: string): Promise<Game[]>;

	/**
	 * Fetch available categories
	 * @returns Promise resolving to an array of categories
	 * 
	 * @example
	 * ```typescript
	 * const categories = await provider.getCategories();
	 * categories.forEach(cat => console.log(cat.name));
	 * ```
	 */
	public abstract getCategories(): Promise<Category[]>;

	/**
	 * Fetch games by category
	 * @param categoryId Category identifier
	 * @param page Page number (default: 1)
	 * @param limit Number of games per page (default: 10)
	 * @returns Promise resolving to an array of games in the category
	 * 
	 * @example
	 * ```typescript
	 * const actionGames = await provider.getGamesByCategory(5, 1, 20);
	 * ```
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

		// This should be implemented by subclasses
		// Default implementation returns empty array
		const games: Game[] = [];
		this.setCache(cacheKey, games);
		return games;
	}

	/**
	 * Fetch games with pagination metadata
	 * @param page Page number (default: 1)
	 * @param limit Number of games per page (default: 10)
	 * @returns Promise resolving to paginated response
	 * 
	 * @example
	 * ```typescript
	 * const response = await provider.getGamesPaginated(1, 20);
	 * console.log(`Page ${response.page} of ${response.totalPages}`);
	 * console.log(`Total games: ${response.total}`);
	 * ```
	 */
	public async getGamesPaginated(
		page = 1,
		limit = 10
	): Promise<PaginatedResponse<Game>> {
		const games = await this.getGames(page, limit);
		
		return {
			data: games,
			page,
			limit,
			total: games.length, // Subclasses should override this with actual total
			totalPages: Math.ceil(games.length / limit),
			hasNextPage: games.length === limit,
			hasPreviousPage: page > 1,
		};
	}

	/**
	 * Clear all cached data
	 * 
	 * @example
	 * ```typescript
	 * provider.clearCache();
	 * ```
	 */
	public clearCache(): void {
		this.cache.clear();
		this.cacheTimestamps.clear();
	}

	/**
	 * Clear cache for a specific key
	 * @param key Cache key to clear
	 * 
	 * @example
	 * ```typescript
	 * provider.clearCacheKey('games-1-10');
	 * ```
	 */
	public clearCacheKey(key: string): void {
		this.cache.delete(key);
		this.cacheTimestamps.delete(key);
	}

	/**
	 * Get provider configuration
	 * @returns Current provider configuration
	 */
	public getConfig(): ProviderConfig {
		return { ...this.config };
	}

	/**
	 * Update provider configuration
	 * @param config New configuration options
	 * 
	 * @example
	 * ```typescript
	 * provider.updateConfig({ apiKey: 'new-key' });
	 * ```
	 */
	public updateConfig(config: Partial<ProviderConfig>): void {
		this.config = { ...this.config, ...config };
		// Clear cache when configuration changes
		this.clearCache();
	}

	/**
	 * Check if provider is healthy/responsive
	 * @returns Promise resolving to true if provider is healthy
	 * 
	 * @example
	 * ```typescript
	 * const isHealthy = await provider.healthCheck();
	 * if (!isHealthy) {
	 *   console.error('Provider is not responding');
	 * }
	 * ```
	 */
	public async healthCheck(): Promise<boolean> {
		try {
			// Try to fetch a small batch of games to test connectivity
			await this.getGames(1, 1);
			return true;
		} catch (error) {
			console.error(`Provider ${this.name} health check failed:`, error);
			return false;
		}
	}

	/**
	 * Get data from cache if available and not expired
	 * @param key Cache key
	 * @returns Cached data or undefined if not found or expired
	 */
	protected getFromCache<T>(key: string): T | undefined {
		const timestamp = this.cacheTimestamps.get(key);
		if (!timestamp) {
			return undefined;
		}

		const now = Date.now();
		if (now - timestamp > this.cacheExpiry) {
			// Cache expired
			this.cache.delete(key);
			this.cacheTimestamps.delete(key);
			return undefined;
		}

		return this.cache.get(key) as T;
	}

	/**
	 * Set data in cache
	 * @param key Cache key
	 * @param data Data to cache
	 */
	protected setCache<T>(key: string, data: T): void {
		this.cache.set(key, data as unknown as Game[]);
		this.cacheTimestamps.set(key, Date.now());
	}

	/**
	 * Extract download links from HTML content
	 * @param htmlContent HTML content containing download links
	 * @returns Array of download links
	 *
	 * @example
	 * ```typescript
	 * const links = this.extractDownloadLinks(content.rendered);
	 * ```
	 */
	protected extractDownloadLinks(htmlContent: string): any[] {
		const links: any[] = [];
		
		// Pattern to match download links with nested tags and HTML entities
		// Matches: <a href="URL" ...><strong><<< Alternatif: Link1 >>></strong></a>
		// Also handles: <del><a href="URL">...</a></del> for unavailable links
		const linkPattern = /<a[^>]+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gis;
		let match;
		
		while ((match = linkPattern.exec(htmlContent)) !== null) {
			const fullMatch = match[0];
			const url = match[1];
			let labelText = match[2];
			
			// Skip empty or invalid URLs
			if (!url) {
				continue;
			}
			
			// Decode HTML entities FIRST before removing tags
			// This ensures < and > are converted to < and > before tag removal
			labelText = labelText
				.replace(/</g, '<')
				.replace(/>/g, '>')
				.replace(/&/g, '&')
				.replace(/&#8211;/g, '-')
				.replace(/&#8230;/g, '...')
				.replace(/"/g, '"')
				.replace(/&nbsp;/g, ' ');
			
			// Remove only actual HTML tags (not <<< or >>>)
			// This pattern matches tags like <strong>, <p>, etc. but not <<< or >>>
			labelText = labelText.replace(/<\/?[a-z][a-z0-9]*(?:\s[^>]*)?>/gi, '');
			
			// Clean up whitespace
			labelText = labelText.trim();
			
			// Skip if label is empty after cleanup
			if (labelText === '') {
				continue;
			}
			
			// Check if this link is wrapped in <del> tag (unavailable)
			// Look for <del> tag that directly wraps this <a> tag
			const beforeLink = htmlContent.substring(Math.max(0, linkPattern.lastIndex - fullMatch.length - 50), linkPattern.lastIndex - fullMatch.length);
			const isUnavailable = beforeLink.includes('<del>') || fullMatch.includes('<del>');
			
			// Determine link type based on URL first for turbobit, then label, then other URLs
			// IMPORTANT: Turbobit always uses URL-based detection
			let type: any = 'direct';
			
			// Check for torrent in label first
			if (labelText.toLowerCase().includes('torrent')) {
				type = 'torrent';
			} else if (url.includes('turbobit')) {
				// Turbobit is a special case - always use URL-based detection
				type = 'turbobit';
			} else if (labelText.toLowerCase().includes('alternatif')) {
				// Extract link number from label (e.g., "Link1", "Link2", "Link3")
				const linkNumberMatch = labelText.match(/Link\s*(\d+)/i);
				if (linkNumberMatch) {
					type = `direct${linkNumberMatch[1]}`;
				} else {
					type = 'direct';
				}
			} else {
				// Only check URL if label didn't match "Alternatif" or "Torrent"
				if (url.includes('pixeldrain')) {
					type = 'pixeldrain';
				} else if (url.includes('mediafire')) {
					type = 'mediafire';
				} else if (url.includes('drive.google.com')) {
					type = 'googledrive';
				} else if (url.toLowerCase().includes('torrent')) {
					type = 'torrent';
				}
			}
			
			links.push({
				type,
				url,
				available: !isUnavailable,
				label: labelText,
			});
		}
		
		return links;
	}

	/**
	 * Extract system requirements from HTML content
	 * @param htmlContent HTML content containing system requirements
	 * @returns System requirements object or null if not found
	 *
	 * @example
	 * ```typescript
	 * const requirements = this.extractSystemRequirements(content.rendered);
	 * ```
	 */
	protected extractSystemRequirements(htmlContent: string): any {
		const requirements: any = {
			os: '',
			cpu: '',
			gpu: '',
			ram: '',
			storage: '',
			directX: '',
		};
		
		// Look for the system requirements section pattern: "PC Sistem.*Gereksinimi" (case insensitive)
		const requirementsSectionPattern = /(?:PC\s*Sistem|Sistem)\s*(?:vb\s*)?Gereksinimi/i;
		const sectionMatch = htmlContent.search(requirementsSectionPattern);
		
		if (sectionMatch === -1) {
			return null;
		}
		
		// Extract content from the section start to the next <hr> tag or major section break
		const afterSection = htmlContent.substring(sectionMatch);
		const hrMatch = afterSection.search(/<hr\s*\/?>|<p[^>]*>\s*<strong/i);
		
		const requirementsText = hrMatch !== -1
			? afterSection.substring(0, hrMatch)
			: afterSection.substring(0, 3000); // Limit to 3000 chars as fallback
		
		// Replace <br> with line breaks
		const textWithBreaks = requirementsText.replace(/<br\s*\/?>/gi, '\n');
		
		// Remove all HTML tags (except we've already processed br tags)
		const text = textWithBreaks
			.replace(/<\/?[a-z][a-z0-9]*(?:\s[^>]*)?>/gi, ' ') // HTML tags
			.replace(/&nbsp;/g, ' ')
			.replace(/</g, '<')
			.replace(/>/g, '>')
			.replace(/&/g, '&')
			.replace(/&#8211;/g, '-')
			.replace(/&#8230;/g, '...')
			.replace(/–/g, '-') // en-dash to regular dash
			.replace(/\s+/g, ' ') // collapse whitespace
			.trim();
		
		// Keep the full text for pattern matching, don't split by lines
		// This allows us to match patterns across the entire requirements section
		
		// Process lines in a more robust way - search for patterns across the text
		const fullLower = text.toLowerCase();
		const upper = text;
		
		// Check if each requirement type exists in the text and extract the value
		// Look for Windows version - more flexible pattern
		if (!requirements.os) {
			const osPatterns = [
				/Window[\s\S]+?64-bit/i,
				/Windows[\s\S]+?64-bit/i,
				/Window[\s\S]+?bit/i,
				/Windows[\s\S]+?bit/i,
				/Window\s+\d+(?:\.\d+)?(?:[-\s\/]+\d+bit)?/i,
				/Windows\s+\d+(?:\.\d+)?(?:[-\s\/]+\d+bit)?/i,
				/Windows\s+\d+(-\d+)/i,
			];
			for (const pattern of osPatterns) {
				const match = text.match(pattern);
				if (match && match[0]) {
					requirements.os = match[0].trim();
					break;
				}
			}
		}
		
		// Extract CPU - look for processor-related keywords and extract the value before them
		if (!requirements.cpu) {
			// Find the processor value that comes BEFORE the keyword
			// Text format: "Intel i5-6500 / AMD A10-58OOK ++ İşlemci Hızı"
			// We want to extract "Intel i5" which is before the slash
			const cpuPatterns = [
				/([A-Za-z]+\s+[A-Za-z0-9\-]+)\s*\/\s*[A-Za-z0-9\s\-\.]+?\s*(?:\+\+)?\s*İşlemci/i,
				/([A-Za-z]+\s+[A-Za-z0-9\-]+)\s*\/\s*[A-Za-z0-9\s\-\.]+?\s*(?:\+\+)?\s*Processor/i,
				/([A-Za-z]+\s+[A-Za-z0-9\-]+)\s*\/\s*[A-Za-z0-9\s\-\.]+?\s*(?:\+\+)?\s*CPU/i,
				/([A-Za-z]+\s+[A-Za-z0-9\-]+)\s*(?:\+\+)?\s*GHZ/i,
				/(\d+\.\d+\s*GHZ)/i,
				/(\d+\.\s*GHZ)/i,
				/([^\s–-]+)\s*GPU\s*(?:\+\+)?\s*İşlemci/i,
				/([^\s–-]+)\s*(?:\+\+)?\s*İşlemci/i,
				/([^\s–-]+)\s*(?:\+\+)?\s*Processor/i,
				/([^\s–-]+)\s*(?:\+\+)?\s*CPU/i,
			];
			for (const pattern of cpuPatterns) {
				const match = text.match(pattern);
				if (match && match[1]) {
					const cpuText = match[1].trim();
					// For text like "Intel i5-6500", extract "Intel i5"
					// Split by space and take first two parts if available
					const parts = cpuText.split(/\s+/);
					if (parts.length >= 2) {
						requirements.cpu = parts[0] + ' ' + parts[1];
					} else if (parts.length === 1) {
						requirements.cpu = cpuText;
					}
					if (requirements.cpu) break;
				}
			}
		}
		
		// Extract GPU - look for graphics-related keywords and extract the value before them
		if (!requirements.gpu) {
			const gpuPatterns = [
				/(\d+\s*GB)\s*(?:\+\+)?\s*Vram/i,
				/([A-Za-z0-9\s\-\.]+?)\s*\/\s*[A-Za-z0-9\s\-\.]+?\s*(?:\+\+)?\s*Ekran Kart[ıi]/i,
				/([A-Za-z0-9\s\-\.]+?)\s*\/\s*[A-Za-z0-9\s\-\.]+?\s*(?:\+\+)?\s*Graphics/i,
				/([A-Za-z0-9\s\-\.]+?)\s*\/\s*[A-Za-z0-9\s\-\.]+?\s*(?:\+\+)?\s*GPU/i,
				/([^\s–-]+)\s*(?:\+\+)?\s*Ekran Kart[ıi]/i,
				/([^\s–-]+)\s*(?:\+\+)?\s*Graphics/i,
				/([^\s–-]+)\s*(?:\+\+)?\s*GPU/i,
			];
			for (const pattern of gpuPatterns) {
				const match = text.match(pattern);
				if (match && match[1]) {
					const gpuText = match[1].trim();
					// For text like "Nvidia GeForce GTX 650", extract "GeForce"
					const parts = gpuText.split(/\s+/);
					if (parts.length >= 2) {
						// Check if this is a Vram pattern (like "6 GB")
						if (parts[0].match(/^\d+$/) && parts[1].match(/^(GB|MB|TB)$/)) {
							requirements.gpu = match[1] + ' Vram'; // Keep the full match for Vram
						} else {
							// Extract the second word (e.g., "GeForce" from "Nvidia GeForce GTX 650")
							// Prioritize brand names over series names
							const brandNames = ['GeForce', 'Radeon', 'Arc'];
							const seriesNames = ['GTX', 'RTX', 'RX', 'HD', 'GT'];
							
							if (brandNames.includes(parts[1])) {
								requirements.gpu = parts[1];
							} else if (seriesNames.includes(parts[1]) && parts.length >= 3 && brandNames.includes(parts[2])) {
								// If we have "Nvidia GTX GeForce", prefer GeForce
								requirements.gpu = parts[2];
							} else if (seriesNames.includes(parts[1])) {
								requirements.gpu = parts[1];
							} else if (parts.length >= 3 && brandNames.includes(parts[2])) {
								requirements.gpu = parts[2];
							} else {
								requirements.gpu = parts[1];
							}
						}
					} else {
						requirements.gpu = gpuText;
					}
					if (requirements.gpu) break;
				}
			}
		}
		
		// Extract RAM - look for memory-related keywords
		if (!requirements.ram) {
			const ramPatterns = [
				/(\d+\s*(?:GB|MB))\s*(?:\+\+)?\s*RAM/i,
				/(\d+\s*(?:GB|MB))\s*(?:\+\+)?\s*Bellek/i,
				/(\d+\s*(?:GB|MB))\s*(?:\+\+)?\s*Memory/i,
				/(\d+\s*(?:GB|MB))\s*Ram/i,
			];
			for (const pattern of ramPatterns) {
				const match = text.match(pattern);
				if (match && match[1]) {
					requirements.ram = match[1].trim();
					break;
				}
			}
		}
		
		// Extract Storage - look for storage-related keywords
		if (!requirements.storage) {
			const storagePatterns = [
				/(\d+\.\d+\s*(?:GB|MB|TB))/i,
				/(\d+\s*(?:GB|MB|TB))\s*(?:\+\+)?\s*Depo/i,
				/(\d+\s*(?:GB|MB|TB))\s*(?:\+\+)?\s*Storage/i,
				/(\d+\s*(?:GB|MB|TB))\s*(?:\+\+)?\s*Disk/i,
				/(\d+\s*(?:GB|MB|TB))\s*(?:\+\+)?\s*Alan/i,
				/Oyunun Boyutu\s*(\d+\s*(?:GB|MB|TB))/i,
			];
			for (const pattern of storagePatterns) {
				const match = text.match(pattern);
				if (match && match[1]) {
					requirements.storage = match[1].trim();
					break;
				}
			}
		}
		
		// Extract DirectX
		if (!requirements.directX) {
			const dxPatterns = [
				/DX\s*(\d+(?:\.\d+)?)/i,
				/DirectX\s*(\d+(?:\.\d+)?)/i,
			];
			for (const pattern of dxPatterns) {
				const match = text.match(pattern);
				if (match && match[1]) {
					requirements.directX = `DirectX ${match[1]}`;
					break;
				}
			}
		}
		
		// Return null if no requirements were found
		if (!requirements.os && !requirements.cpu && !requirements.gpu && !requirements.ram && !requirements.storage && !requirements.directX) {
			return null;
		}
		
		return requirements;
	}

	/**
	 * Extract media gallery images from HTML content
	 * @param htmlContent HTML content containing images
	 * @returns Array of image URLs
	 * 
	 * @example
	 * ```typescript
	 * const gallery = this.extractMediaGallery(content.rendered);
	 * ```
	 */
	protected extractMediaGallery(htmlContent: string): string[] {
		const images: string[] = [];
		const imgPattern = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
		let match;
		
		while ((match = imgPattern.exec(htmlContent)) !== null) {
			const url = match[1];
			// Skip very small images (likely icons) and duplicate URLs
			if (url && !images.includes(url) && !url.includes('avatar')) {
				images.push(url);
			}
		}
		
		return images;
	}

	/**
	 * Sanitize HTML content by removing tags
	 * @param html HTML content to sanitize
	 * @returns Plain text content
	 * 
	 * @example
	 * ```typescript
	 * const description = this.sanitizeHtml(content.rendered);
	 * ```
	 */
	protected sanitizeHtml(html: string): string {
		// Remove HTML tags but preserve line breaks
		return html
			.replace(/<br\s*\/?>/gi, '\n')
			.replace(/<\/p>/gi, '\n\n')
			.replace(/<[^>]+>/g, '')
			.replace(/&nbsp;/g, ' ')
			.replace(/&/g, '&')
			.replace(/</g, '<')
			.replace(/>/g, '>')
			.trim();
	}

	/**
	 * Handle errors consistently across all providers
	 * @param error Error object or message
	 * @param context Context where the error occurred
	 * @throws Error with additional context
	 */
	protected handleError(error: unknown, context: string): never {
		const message = error instanceof Error ? error.message : String(error);
		const fullMessage = `[${this.name}] ${context}: ${message}`;
		throw new Error(fullMessage);
	}
}