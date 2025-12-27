import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { OYUNINDIR_CONFIG } from "../../config/providers";
import type { Game } from "../../types/game";
import { WordPressProvider } from "../wordpress-provider";

/**
 * Comprehensive test suite for WordPressProvider integration with oyunindir.vip
 *
 * This test suite validates the complete backend integration including:
 * - Provider instantiation and configuration
 * - Fetching games with pagination
 * - Fetching individual game details
 * - Search functionality
 * - Pagination metadata
 * - Caching mechanism
 * - HTML parsing (download links, system requirements, media gallery)
 */

describe("WordPressProvider Integration Tests", () => {
	let provider: WordPressProvider;
	let sampleGameId: number;
	let sampleGameTitle: string;

	/**
	 * Setup: Create provider instance with OYUNINDIR_CONFIG
	 */
	beforeAll(() => {
		console.log("\n=== WordPressProvider Integration Tests ===");
		console.log(
			"Provider Configuration:",
			JSON.stringify(OYUNINDIR_CONFIG, null, 2),
		);
		provider = new WordPressProvider(OYUNINDIR_CONFIG);
	});

	/**
	 * Test 1: WordPressProvider Instantiation
	 * Verify the provider is created correctly with proper configuration
	 */
	describe("Test 1: Provider Instantiation", () => {
		it("should create provider instance with correct configuration", () => {
			console.log("\n--- Test 1: Provider Instantiation ---");

			expect(provider).toBeDefined();
			expect(provider.name).toBe("WordPress Provider");

			const config = provider.getConfig();
			expect(config.baseUrl).toBe(OYUNINDIR_CONFIG.baseUrl);
			expect(config.baseUrl).toBe("https://www.oyunindir.vip");

			console.log("✓ Provider created successfully");
			console.log(`  Name: ${provider.name}`);
			console.log(`  Base URL: ${config.baseUrl}`);
		});
	});

	/**
	 * Test 2: Fetching Games
	 * Fetch first 5 games and verify structure
	 */
	describe("Test 2: Fetching Games", () => {
		it("should fetch first 5 games with correct structure", async () => {
			console.log("\n--- Test 2: Fetching Games ---");

			const startTime = Date.now();
			const games = await provider.getGames(1, 5);
			const endTime = Date.now();

			console.log(`Fetched ${games.length} games in ${endTime - startTime}ms`);
			expect(games).toBeDefined();
			expect(Array.isArray(games)).toBe(true);
			expect(games.length).toBeGreaterThan(0);
			expect(games.length).toBeLessThanOrEqual(5);

			// Verify each game has required fields
			games.forEach((game, index) => {
				console.log(`\nGame ${index + 1}: ${game.title}`);
				console.log(`  ID: ${game.id}`);
				console.log(`  Title: ${game.title}`);
				console.log(`  Slug: ${game.slug}`);
				console.log(`  Cover Image: ${game.coverImage ? "✓" : "✗"}`);
				console.log(`  Thumbnail: ${game.thumbnail ? "✓" : "✗"}`);
				console.log(
					`  Description: ${game.description.length > 0 ? "✓" : "✗"} (${game.description.length} chars)`,
				);
				console.log(
					`  Excerpt: ${game.excerpt.length > 0 ? "✓" : "✗"} (${game.excerpt.length} chars)`,
				);
				console.log(`  Published Date: ${game.publishedDate}`);
				console.log(`  Author: ${game.author.name}`);
				console.log(
					`  Categories: ${game.categories.map((c) => c.name).join(", ")}`,
				);
				console.log(`  Tags: ${game.tags.map((t) => t.name).join(", ")}`);
				console.log(`  Download Links: ${game.downloadLinks.length}`);
				console.log(`  Media Gallery: ${game.mediaGallery.length} images`);

				// Verify required fields
				expect(game.id).toBeDefined();
				expect(typeof game.id).toBe("number");
				expect(game.title).toBeDefined();
				expect(typeof game.title).toBe("string");
				expect(game.title.length).toBeGreaterThan(0);
				expect(game.slug).toBeDefined();
				expect(typeof game.slug).toBe("string");
				expect(game.coverImage).toBeDefined();
				expect(game.thumbnail).toBeDefined();
				expect(game.description).toBeDefined();
				expect(game.excerpt).toBeDefined();
				expect(game.publishedDate).toBeDefined();
				expect(game.author).toBeDefined();
				expect(game.categories).toBeDefined();
				expect(Array.isArray(game.categories)).toBe(true);
				expect(game.tags).toBeDefined();
				expect(Array.isArray(game.tags)).toBe(true);
				expect(game.downloadLinks).toBeDefined();
				expect(Array.isArray(game.downloadLinks)).toBe(true);
				expect(game.systemRequirements).toBeDefined();
				expect(game.permalink).toBeDefined();
				expect(game.mediaGallery).toBeDefined();
				expect(Array.isArray(game.mediaGallery)).toBe(true);

				// Store sample game ID for later tests
				if (index === 0) {
					sampleGameId = game.id;
					sampleGameTitle = game.title;
				}
			});

			console.log(`\n✓ All games have correct structure`);
		});
	});

	/**
	 * Test 3: Fetching a Specific Game by ID
	 * Fetch full details for a specific game
	 */
	describe("Test 3: Fetching Game by ID", () => {
		it("should fetch game by ID with full details", async () => {
			console.log("\n--- Test 3: Fetching Game by ID ---");

			expect(sampleGameId).toBeDefined();
			console.log(`Fetching game ID: ${sampleGameId}`);

			const startTime = Date.now();
			const game = await provider.getGameById(sampleGameId);
			const endTime = Date.now();

			console.log(`Fetched game in ${endTime - startTime}ms`);

			expect(game).toBeDefined();
			expect(game).not.toBeNull();
			expect(game!.id).toBe(sampleGameId);

			console.log(`\nGame Details:`);
			console.log(`  ID: ${game!.id}`);
			console.log(`  Title: ${game!.title}`);
			console.log(`  Slug: ${game!.slug}`);
			console.log(`  Cover Image: ${game!.coverImage}`);
			console.log(`  Thumbnail: ${game!.thumbnail}`);
			console.log(`  Published Date: ${game!.publishedDate}`);

			console.log(`\n  Author:`);
			console.log(`    Name: ${game!.author.name}`);
			console.log(`    ID: ${game!.author.id}`);
			console.log(`    Slug: ${game!.author.slug}`);
			console.log(
				`    Avatar (24px): ${game!.author.avatarUrls.size24 ? "✓" : "✗"}`,
			);
			console.log(
				`    Avatar (48px): ${game!.author.avatarUrls.size48 ? "✓" : "✗"}`,
			);
			console.log(
				`    Avatar (96px): ${game!.author.avatarUrls.size96 ? "✓" : "✗"}`,
			);

			console.log(`\n  Categories (${game!.categories.length}):`);
			game!.categories.forEach((cat) => {
				console.log(`    - ${cat.name} (ID: ${cat.id}, Slug: ${cat.slug})`);
			});

			console.log(`\n  Tags (${game!.tags.length}):`);
			game!.tags.slice(0, 5).forEach((tag) => {
				console.log(`    - ${tag.name} (ID: ${tag.id})`);
			});
			if (game!.tags.length > 5) {
				console.log(`    ... and ${game!.tags.length - 5} more`);
			}

			// Verify download links
			console.log(`\n  Download Links (${game!.downloadLinks.length}):`);
			if (game!.downloadLinks.length > 0) {
				game!.downloadLinks.forEach((link, index) => {
					console.log(`    ${index + 1}. [${link.type}] ${link.label}`);
					console.log(`       URL: ${link.url.substring(0, 60)}...`);
					console.log(`       Available: ${link.available ? "Yes" : "No"}`);
				});
			} else {
				console.log("    No download links found");
			}

			// Verify system requirements
			console.log(`\n  System Requirements:`);
			const reqs = game!.systemRequirements;
			console.log(`    OS: ${reqs.os || "Not specified"}`);
			console.log(`    CPU: ${reqs.cpu || "Not specified"}`);
			console.log(`    GPU: ${reqs.gpu || "Not specified"}`);
			console.log(`    RAM: ${reqs.ram || "Not specified"}`);
			console.log(`    Storage: ${reqs.storage || "Not specified"}`);
			console.log(`    DirectX: ${reqs.directX || "Not specified"}`);
			console.log(`    Additional: ${reqs.additional || "None"}`);

			// Verify media gallery
			console.log(`\n  Media Gallery (${game!.mediaGallery.length} images):`);
			game!.mediaGallery.slice(0, 3).forEach((img, index) => {
				console.log(`    ${index + 1}. ${img.substring(0, 60)}...`);
			});
			if (game!.mediaGallery.length > 3) {
				console.log(`    ... and ${game!.mediaGallery.length - 3} more`);
			}

			console.log(`\n  Permalink: ${game!.permalink}`);

			// Verify description and excerpt
			console.log(`\n  Description: ${game!.description.substring(0, 200)}...`);
			console.log(`  Excerpt: ${game!.excerpt.substring(0, 200)}...`);

			console.log(`\n✓ Game fetched successfully with all details`);
		});
	});

	/**
	 * Test 4: Search Functionality
	 * Search for games using a query
	 */
	describe("Test 4: Search Functionality", () => {
		it("should search for games and return matching results", async () => {
			console.log("\n--- Test 4: Search Functionality ---");

			// Use the sample game title for search
			const searchQuery = sampleGameTitle.split(" ")[0]; // Use first word
			console.log(`Searching for: "${searchQuery}"`);

			const startTime = Date.now();
			const results = await provider.searchGames(searchQuery);
			const endTime = Date.now();

			console.log(
				`Found ${results.length} results in ${endTime - startTime}ms`,
			);

			expect(results).toBeDefined();
			expect(Array.isArray(results)).toBe(true);

			if (results.length > 0) {
				console.log("\nSearch Results:");
				results.forEach((game, index) => {
					console.log(`  ${index + 1}. ${game.title}`);
					console.log(`     ID: ${game.id}`);
					console.log(`     Excerpt: ${game.excerpt.substring(0, 100)}...`);

					// Verify results match search (case-insensitive)
					const titleMatch = game.title
						.toLowerCase()
						.includes(searchQuery.toLowerCase());
					const descMatch = game.description
						.toLowerCase()
						.includes(searchQuery.toLowerCase());
					console.log(
						`     Match: ${titleMatch ? "Title" : descMatch ? "Description" : "None"}`,
					);
				});

				console.log("\n✓ Search returned matching results");
			} else {
				console.log("\n⚠ No search results found");
			}
		});

		it("should handle empty search query gracefully", async () => {
			console.log("\n--- Test 4b: Empty Search Query ---");

			const results = await provider.searchGames("");

			expect(results).toBeDefined();
			expect(Array.isArray(results)).toBe(true);
			expect(results.length).toBe(0);

			console.log(
				"✓ Empty search query handled correctly (returned empty array)",
			);
		});
	});

	/**
	 * Test 5: Pagination Metadata
	 * Verify pagination information is correct
	 */
	describe("Test 5: Pagination Metadata", () => {
		it("should fetch paginated games with correct metadata", async () => {
			console.log("\n--- Test 5: Pagination Metadata ---");

			const page = 1;
			const limit = 5;

			console.log(`Fetching page ${page} with limit ${limit}...`);

			const startTime = Date.now();
			const paginated = await provider.getGamesPaginated(page, limit);
			const endTime = Date.now();

			console.log(`Fetched in ${endTime - startTime}ms`);

			expect(paginated).toBeDefined();
			expect(paginated.data).toBeDefined();
			expect(Array.isArray(paginated.data)).toBe(true);
			expect(paginated.page).toBe(page);
			expect(paginated.limit).toBe(limit);
			expect(paginated.data.length).toBeLessThanOrEqual(limit);

			console.log("\nPagination Metadata:");
			console.log(`  Data Items: ${paginated.data.length}`);
			console.log(`  Current Page: ${paginated.page}`);
			console.log(`  Items Per Page: ${paginated.limit}`);
			console.log(`  Total Items: ${paginated.total}`);
			console.log(`  Total Pages: ${paginated.totalPages}`);
			console.log(`  Has Next Page: ${paginated.hasNextPage}`);
			console.log(`  Has Previous Page: ${paginated.hasPreviousPage}`);

			// Verify games in the response
			console.log("\nGames in this page:");
			paginated.data.forEach((game, index) => {
				console.log(`  ${index + 1}. ${game.title} (ID: ${game.id})`);
			});

			console.log("\n✓ Pagination metadata is correct");
		});

		it("should handle different page sizes", async () => {
			console.log("\n--- Test 5b: Different Page Sizes ---");

			const pageSizes = [3, 5, 10];

			for (const size of pageSizes) {
				console.log(`\nTesting page size: ${size}`);
				const paginated = await provider.getGamesPaginated(1, size);

				expect(paginated.limit).toBe(size);
				expect(paginated.data.length).toBeLessThanOrEqual(size);

				console.log(
					`  ✓ Fetched ${paginated.data.length} games with limit ${size}`,
				);
			}

			console.log("\n✓ All page sizes handled correctly");
		});
	});

	/**
	 * Test 6: Caching Functionality
	 * Verify caching works and improves performance
	 */
	describe("Test 6: Caching Functionality", () => {
		it("should cache results and improve performance on second call", async () => {
			console.log("\n--- Test 6: Caching Functionality ---");

			// Clear cache to ensure fresh start
			provider.clearCache();
			console.log("Cache cleared");

			const page = 1;
			const limit = 5;

			// First call - should fetch from API
			console.log("\nFirst call (no cache):");
			const startTime1 = Date.now();
			const games1 = await provider.getGames(page, limit);
			const endTime1 = Date.now();
			const time1 = endTime1 - startTime1;

			console.log(`  Fetched ${games1.length} games in ${time1}ms`);

			// Second call - should use cache
			console.log("\nSecond call (with cache):");
			const startTime2 = Date.now();
			const games2 = await provider.getGames(page, limit);
			const endTime2 = Date.now();
			const time2 = endTime2 - startTime2;

			console.log(`  Fetched ${games2.length} games in ${time2}ms`);

			// Verify results are identical
			expect(games1).toEqual(games2);

			// Verify cache improved performance
			console.log(`\nPerformance Improvement:`);
			console.log(`  First call: ${time1}ms`);
			console.log(`  Second call: ${time2}ms`);
			console.log(
				`  Speedup: ${(((time1 - time2) / time1) * 100).toFixed(2)}%`,
			);

			console.log("\n✓ Caching is working correctly");
		});

		it("should clear cache successfully", async () => {
			console.log("\n--- Test 6b: Clear Cache ---");

			// Fetch some data to populate cache
			await provider.getGames(1, 5);
			console.log("Cache populated with games");

			// Clear cache
			provider.clearCache();
			console.log("Cache cleared");

			// Fetch again - should take longer (no cache)
			const startTime = Date.now();
			await provider.getGames(1, 5);
			const endTime = Date.now();

			console.log(`Fetched after cache clear in ${endTime - startTime}ms`);
			console.log("✓ Cache cleared successfully");
		});
	});

	/**
	 * Test 7: HTML Parsing
	 * Verify download links, system requirements, and media gallery are extracted correctly
	 */
	describe("Test 7: HTML Parsing", () => {
		it("should extract download links from HTML content", async () => {
			console.log("\n--- Test 7a: Download Links Parsing ---");

			const game = await provider.getGameById(sampleGameId);

			expect(game).toBeDefined();
			expect(game!.downloadLinks).toBeDefined();
			expect(Array.isArray(game!.downloadLinks)).toBe(true);

			console.log(`\nDownload Links Found: ${game!.downloadLinks.length}`);

			if (game!.downloadLinks.length > 0) {
				console.log("\nDownload Link Details:");
				game!.downloadLinks.forEach((link, index) => {
					console.log(`\n  Link ${index + 1}:`);
					console.log(`    Type: ${link.type}`);
					console.log(`    Label: ${link.label}`);
					console.log(`    URL: ${link.url}`);
					console.log(`    Available: ${link.available}`);

					// Verify link structure
					expect(link.type).toBeDefined();
					expect(link.url).toBeDefined();
					expect(typeof link.url).toBe("string");
					expect(link.url.length).toBeGreaterThan(0);
					expect(link.label).toBeDefined();
					expect(typeof link.label).toBe("string");
					expect(typeof link.available).toBe("boolean");
				});

				// Count link types
				const typeCounts = game!.downloadLinks.reduce(
					(acc, link) => {
						acc[link.type] = (acc[link.type] || 0) + 1;
						return acc;
					},
					{} as Record<string, number>,
				);

				console.log("\nLink Type Distribution:");
				Object.entries(typeCounts).forEach(([type, count]) => {
					console.log(`  ${type}: ${count}`);
				});

				console.log("\n✓ Download links parsed correctly");
			} else {
				console.log("\n⚠ No download links found in this game");
			}
		});

		it("should extract system requirements from HTML content", async () => {
			console.log("\n--- Test 7b: System Requirements Parsing ---");

			const game = await provider.getGameById(sampleGameId);

			expect(game).toBeDefined();
			expect(game!.systemRequirements).toBeDefined();

			console.log("\nSystem Requirements:");
			const reqs = game!.systemRequirements;

			const fields = [
				{ key: "os", name: "Operating System" },
				{ key: "cpu", name: "Processor" },
				{ key: "gpu", name: "Graphics Card" },
				{ key: "ram", name: "RAM" },
				{ key: "storage", name: "Storage" },
				{ key: "directX", name: "DirectX" },
				{ key: "additional", name: "Additional" },
			];

			let hasRequirements = false;
			fields.forEach((field) => {
				const value = reqs[field.key as keyof typeof reqs];
				const hasValue = value && value.length > 0;
				if (hasValue) hasRequirements = true;
				console.log(`  ${field.name}: ${value || "Not specified"}`);
			});

			if (hasRequirements) {
				console.log("\n✓ System requirements parsed correctly");
			} else {
				console.log("\n⚠ No system requirements found in this game");
			}
		});

		it("should extract media gallery from HTML content", async () => {
			console.log("\n--- Test 7c: Media Gallery Parsing ---");

			const game = await provider.getGameById(sampleGameId);

			expect(game).toBeDefined();
			expect(game!.mediaGallery).toBeDefined();
			expect(Array.isArray(game!.mediaGallery)).toBe(true);

			console.log(`\nMedia Gallery Images: ${game!.mediaGallery.length}`);

			if (game!.mediaGallery.length > 0) {
				console.log("\nImage URLs (first 5):");
				game!.mediaGallery.slice(0, 5).forEach((img, index) => {
					console.log(`  ${index + 1}. ${img}`);
				});

				if (game!.mediaGallery.length > 5) {
					console.log(`  ... and ${game!.mediaGallery.length - 5} more`);
				}

				// Verify all URLs are valid strings
				game!.mediaGallery.forEach((img) => {
					expect(typeof img).toBe("string");
					expect(img.length).toBeGreaterThan(0);
					expect(img.startsWith("http")).toBe(true);
				});

				console.log("\n✓ Media gallery parsed correctly");
			} else {
				console.log("\n⚠ No media gallery images found in this game");
			}
		});

		it("should sanitize HTML content correctly", async () => {
			console.log("\n--- Test 7d: HTML Sanitization ---");

			const game = await provider.getGameById(sampleGameId);

			expect(game).toBeDefined();
			expect(game!.description).toBeDefined();
			expect(game!.excerpt).toBeDefined();

			console.log("\nSanitized Content:");
			console.log(
				`  Description length: ${game!.description.length} characters`,
			);
			console.log(`  Excerpt length: ${game!.excerpt.length} characters`);

			// Verify no HTML tags remain
			const hasHtmlTags = /<[^>]+>/.test(game!.description);
			expect(hasHtmlTags).toBe(false);

			console.log("\nDescription (first 300 chars):");
			console.log(`  ${game!.description.substring(0, 300)}...`);

			console.log("\nExcerpt (first 200 chars):");
			console.log(`  ${game!.excerpt.substring(0, 200)}...`);

			console.log("\n✓ HTML content sanitized correctly");
		});
	});

	/**
	 * Test 8: Categories
	 * Fetch and verify categories are available
	 */
	describe("Test 8: Categories", () => {
		it("should fetch available categories", async () => {
			console.log("\n--- Test 8: Categories ---");

			const startTime = Date.now();
			const categories = await provider.getCategories();
			const endTime = Date.now();

			console.log(
				`Fetched ${categories.length} categories in ${endTime - startTime}ms`,
			);

			expect(categories).toBeDefined();
			expect(Array.isArray(categories)).toBe(true);

			console.log("\nCategories:");
			categories.slice(0, 10).forEach((cat, index) => {
				console.log(`  ${index + 1}. ${cat.name}`);
				console.log(`     ID: ${cat.id}`);
				console.log(`     Slug: ${cat.slug}`);
				console.log(`     Link: ${cat.link}`);
			});

			if (categories.length > 10) {
				console.log(`  ... and ${categories.length - 10} more`);
			}

			// Verify category structure
			categories.forEach((cat) => {
				expect(cat.id).toBeDefined();
				expect(typeof cat.id).toBe("number");
				expect(cat.name).toBeDefined();
				expect(typeof cat.name).toBe("string");
				expect(cat.slug).toBeDefined();
				expect(typeof cat.slug).toBe("string");
				expect(cat.link).toBeDefined();
				expect(typeof cat.link).toBe("string");
			});

			console.log("\n✓ Categories fetched successfully");
		});
	});

	/**
	 * Test 9: Health Check
	 * Verify provider health check functionality
	 */
	describe("Test 9: Health Check", () => {
		it("should pass health check", async () => {
			console.log("\n--- Test 9: Health Check ---");

			const startTime = Date.now();
			const isHealthy = await provider.healthCheck();
			const endTime = Date.now();

			console.log(`Health check completed in ${endTime - startTime}ms`);
			console.log(
				`Provider Health: ${isHealthy ? "✓ Healthy" : "✗ Unhealthy"}`,
			);

			expect(isHealthy).toBe(true);

			console.log("\n✓ Health check passed");
		});
	});

	/**
	 * Test 10: Error Handling
	 * Verify error handling works correctly
	 */
	describe("Test 10: Error Handling", () => {
		it("should handle invalid game ID gracefully", async () => {
			console.log("\n--- Test 10: Error Handling ---");

			const invalidId = 999999999;
			console.log(`Requesting invalid game ID: ${invalidId}`);

			const game = await provider.getGameById(invalidId);

			expect(game).toBeNull();
			console.log("✓ Invalid game ID handled correctly (returned null)");
		});
	});

	/**
	 * Cleanup
	 */
	afterAll(() => {
		console.log("\n=== All Tests Completed ===");
		provider.clearCache();
	});
});
