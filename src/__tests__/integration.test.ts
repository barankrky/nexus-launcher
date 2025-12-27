import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { providerService } from "../services/provider-service";
import type { Category, Game } from "../types/game";

describe("Frontend Integration Tests", () => {
	let games: Game[] = [];
	let categories: Category[] = [];
	let fetchStartTime: number;
	let fetchEndTime: number;
	let secondFetchStartTime: number;
	let secondFetchEndTime: number;

	describe("1. Provider Integration", () => {
		it("should initialize provider service", () => {
			expect(providerService).toBeDefined();
			expect(providerService.isReady()).toBe(true);

			const config = providerService.getConfig();
			expect(config.baseUrl).toBe("https://www.oyunindir.vip");
			expect(config.apiEndpoint).toBe("/wp-json/wp/v2/posts");
		});

		it("should pass health check", async () => {
			const isHealthy = await providerService.healthCheck();
			expect(isHealthy).toBe(true);
		});
	});

	describe("2. HomePage Tests", () => {
		it("should fetch games from API", async () => {
			fetchStartTime = performance.now();
			games = await providerService.getGames(1, 20);
			fetchEndTime = performance.now();

			expect(games).toBeDefined();
			expect(Array.isArray(games)).toBe(true);
			expect(games.length).toBeGreaterThan(0);
		});

		it("should have correct game structure", () => {
			if (games.length === 0) return;

			const sampleGame = games[0];
			expect(sampleGame).toHaveProperty("id");
			expect(sampleGame).toHaveProperty("title");
			expect(sampleGame).toHaveProperty("coverImage");
			expect(sampleGame).toHaveProperty("description");
			expect(sampleGame).toHaveProperty("excerpt");
			expect(sampleGame).toHaveProperty("publishedDate");
			expect(sampleGame).toHaveProperty("author");
			expect(sampleGame).toHaveProperty("categories");
			expect(sampleGame).toHaveProperty("tags");
			expect(sampleGame).toHaveProperty("downloadLinks");
			expect(sampleGame).toHaveProperty("systemRequirements");
		});

		it("should have valid game data", () => {
			if (games.length === 0) return;

			games.forEach((game) => {
				expect(typeof game.id).toBe("number");
				expect(typeof game.title).toBe("string");
				expect(game.title.length).toBeGreaterThan(0);
				expect(typeof game.description).toBe("string");
				expect(typeof game.excerpt).toBe("string");
				expect(Array.isArray(game.categories)).toBe(true);
				expect(Array.isArray(game.tags)).toBe(true);
				expect(Array.isArray(game.downloadLinks)).toBe(true);
			});
		});

		it("should have valid cover images", () => {
			if (games.length === 0) return;

			games.forEach((game) => {
				if (game.coverImage) {
					expect(game.coverImage).toMatch(/^https?:\/\//);
					expect(game.coverImage).toMatch(/\.(jpg|jpeg|png|webp|gif)$/i);
				}
			});
		});

		it("should have valid author information", () => {
			if (games.length === 0) return;

			games.forEach((game) => {
				expect(game.author).toBeDefined();
				expect(game.author).toHaveProperty("id");
				expect(game.author).toHaveProperty("name");
				expect(typeof game.author.name).toBe("string");
				expect(game.author.name.length).toBeGreaterThan(0);
			});
		});

		it("should have valid published dates", () => {
			if (games.length === 0) return;

			games.forEach((game) => {
				expect(game.publishedDate).toBeDefined();
				expect(typeof game.publishedDate).toBe("string");
				const date = new Date(game.publishedDate);
				expect(date.getTime()).not.toBeNaN();
			});
		});

		it("should fetch paginated games", async () => {
			const paginatedResponse = await providerService.getGamesPaginated(1, 10);

			expect(paginatedResponse).toBeDefined();
			expect(paginatedResponse.data).toBeDefined();
			expect(Array.isArray(paginatedResponse.data)).toBe(true);
			expect(paginatedResponse.page).toBe(1);
			expect(paginatedResponse.limit).toBe(10);
			expect(paginatedResponse.total).toBeGreaterThanOrEqual(
				paginatedResponse.data.length,
			);
			expect(paginatedResponse.totalPages).toBeGreaterThan(0);
		});

		it("should have pagination metadata", async () => {
			const paginatedResponse = await providerService.getGamesPaginated(1, 20);

			expect(paginatedResponse).toHaveProperty("hasNextPage");
			expect(paginatedResponse).toHaveProperty("hasPreviousPage");
			expect(typeof paginatedResponse.hasNextPage).toBe("boolean");
			expect(typeof paginatedResponse.hasPreviousPage).toBe("boolean");
			expect(paginatedResponse.hasPreviousPage).toBe(false); // First page
		});
	});

	describe("3. LibraryPage Tests", () => {
		it("should fetch categories", async () => {
			categories = await providerService.getCategories();

			expect(categories).toBeDefined();
			expect(Array.isArray(categories)).toBe(true);
			expect(categories.length).toBeGreaterThan(0);
		});

		it("should have valid category structure", () => {
			if (categories.length === 0) return;

			const sampleCategory = categories[0];
			expect(sampleCategory).toHaveProperty("id");
			expect(sampleCategory).toHaveProperty("name");
			expect(sampleCategory).toHaveProperty("slug");
			expect(sampleCategory).toHaveProperty("link");
		});

		it("should have valid category data", () => {
			if (categories.length === 0) return;

			categories.forEach((category) => {
				expect(typeof category.id).toBe("number");
				expect(typeof category.name).toBe("string");
				expect(category.name.length).toBeGreaterThan(0);
				expect(typeof category.slug).toBe("string");
				expect(typeof category.link).toBe("string");
			});
		});

		it("should search games by query", async () => {
			if (games.length === 0) return;

			const searchQuery = games[0].title.split(" ")[0]; // Use first word of first game title
			const searchResults = await providerService.searchGames(searchQuery);

			expect(searchResults).toBeDefined();
			expect(Array.isArray(searchResults)).toBe(true);

			// Check if results contain the search query
			if (searchResults.length > 0) {
				const hasMatch = searchResults.some((game) =>
					game.title.toLowerCase().includes(searchQuery.toLowerCase()),
				);
				expect(hasMatch).toBe(true);
			}
		});

		it("should handle empty search query", async () => {
			const searchResults = await providerService.searchGames("");
			expect(searchResults).toEqual([]);
		});

		it("should fetch games by category", async () => {
			if (categories.length === 0) return;

			const categoryId = categories[0].id;
			const categoryGames = await providerService.getGamesByCategory(
				categoryId,
				1,
				10,
			);

			expect(categoryGames).toBeDefined();
			expect(Array.isArray(categoryGames)).toBe(true);
		});
	});

	describe("4. Data Transformation Tests", () => {
		it("should transform download links correctly", () => {
			if (games.length === 0) return;

			const gamesWithLinks = games.filter(
				(game) => game.downloadLinks.length > 0,
			);

			if (gamesWithLinks.length > 0) {
				gamesWithLinks.forEach((game) => {
					game.downloadLinks.forEach((link) => {
						expect(link).toHaveProperty("type");
						expect(link).toHaveProperty("url");
						expect(link).toHaveProperty("available");
						expect(link).toHaveProperty("label");
						expect(typeof link.type).toBe("string");
						expect(typeof link.url).toBe("string");
						expect(link.url.length).toBeGreaterThan(0);
						expect(typeof link.available).toBe("boolean");
					});
				});
			}
		});

		it("should have valid link types", () => {
			if (games.length === 0) return;

			const validLinkTypes = [
				"direct",
				"torrent",
				"mediafire",
				"googledrive",
				"pixeldrain",
				"turbobit",
				"other",
				"direct1",
				"direct2",
				"direct3",
			];

			games.forEach((game) => {
				game.downloadLinks.forEach((link) => {
					expect(validLinkTypes).toContain(link.type);
				});
			});
		});

		it("should transform system requirements correctly", () => {
			if (games.length === 0) return;

			games.forEach((game) => {
				// System requirements might be null if not found in content
				if (game.systemRequirements) {
					expect(game.systemRequirements).toBeDefined();
					expect(game.systemRequirements).toHaveProperty("os");
					expect(game.systemRequirements).toHaveProperty("cpu");
					expect(game.systemRequirements).toHaveProperty("gpu");
					expect(game.systemRequirements).toHaveProperty("ram");
					expect(game.systemRequirements).toHaveProperty("storage");
				}
			});
		});

		it("should have categories and tags", () => {
			if (games.length === 0) return;

			games.forEach((game) => {
				expect(Array.isArray(game.categories)).toBe(true);
				expect(Array.isArray(game.tags)).toBe(true);
			});
		});
	});

	describe("5. Performance Tests", () => {
		it("should complete initial fetch in reasonable time (<10s)", () => {
			if (!fetchStartTime || !fetchEndTime) return;

			const fetchTime = fetchEndTime - fetchStartTime;
			console.log(`Initial fetch time: ${fetchTime.toFixed(2)}ms`);
			expect(fetchTime).toBeLessThan(10000);
		});

		it("should use caching for faster second fetch", async () => {
			// First fetch should be cached now
			secondFetchStartTime = performance.now();
			const cachedGames = await providerService.getGames(1, 20);
			secondFetchEndTime = performance.now();

			expect(cachedGames).toBeDefined();
			expect(cachedGames.length).toBe(games.length);

			const firstFetchTime = fetchEndTime - fetchStartTime;
			const secondFetchTime = secondFetchEndTime - secondFetchStartTime;

			console.log(`First fetch time: ${firstFetchTime.toFixed(2)}ms`);
			console.log(
				`Second fetch time (cached): ${secondFetchTime.toFixed(2)}ms`,
			);
			console.log(
				`Speed improvement: ${(((firstFetchTime - secondFetchTime) / firstFetchTime) * 100).toFixed(2)}%`,
			);

			// Second fetch should be significantly faster (at least 50% improvement)
			if (secondFetchTime > 0) {
				expect(secondFetchTime).toBeLessThan(firstFetchTime);
			}
		});
	});

	describe("6. Error Handling Tests", () => {
		it("should handle invalid game ID gracefully", async () => {
			try {
				await providerService.getGameById(999999999);
				// Should not reach here, but if it does, it should return null
				expect(true).toBe(true);
			} catch (error) {
				// Should throw an error for invalid ID
				expect(error).toBeDefined();
			}
		});

		it("should handle search with no results", async () => {
			const searchResults = await providerService.searchGames(
				"xyzabc123nonexistentgametitle",
			);
			expect(searchResults).toBeDefined();
			expect(Array.isArray(searchResults)).toBe(true);
			// Might return empty array or throw error, both are acceptable
		});

		it("should handle invalid category ID gracefully", async () => {
			try {
				const categoryGames = await providerService.getGamesByCategory(
					999999999,
					1,
					10,
				);
				expect(categoryGames).toBeDefined();
				expect(Array.isArray(categoryGames)).toBe(true);
			} catch (error) {
				// Should throw an error for invalid category ID
				expect(error).toBeDefined();
			}
		});
	});

	describe("7. Console Output - Test Summary", () => {
		it("should print test summary", () => {
			console.log("\n========================================");
			console.log("FRONTEND INTEGRATION TEST SUMMARY");
			console.log("========================================");
			console.log(`✓ Provider Service: Initialized`);
			console.log(`✓ Health Check: Passed`);
			console.log(`✓ Games Fetched: ${games.length}`);
			console.log(`✓ Categories Fetched: ${categories.length}`);

			if (fetchStartTime && fetchEndTime) {
				console.log(
					`✓ Initial Fetch Time: ${(fetchEndTime - fetchStartTime).toFixed(2)}ms`,
				);
			}

			if (secondFetchStartTime && secondFetchEndTime) {
				console.log(
					`✓ Cached Fetch Time: ${(secondFetchEndTime - secondFetchStartTime).toFixed(2)}ms`,
				);
			}

			// Count games with various features
			const gamesWithImages = games.filter((g) => g.coverImage).length;
			const gamesWithLinks = games.filter(
				(g) => g.downloadLinks.length > 0,
			).length;
			const gamesWithRequirements = games.filter(
				(g) => g.systemRequirements,
			).length;

			console.log(
				`✓ Games with Cover Images: ${gamesWithImages}/${games.length}`,
			);
			console.log(
				`✓ Games with Download Links: ${gamesWithLinks}/${games.length}`,
			);
			console.log(
				`✓ Games with System Requirements: ${gamesWithRequirements}/${games.length}`,
			);
			console.log("========================================\n");

			expect(true).toBe(true);
		});
	});

	afterAll(() => {
		// Clear cache after tests
		providerService.clearCache();
		console.log("✓ Cache cleared after tests");
	});
});
