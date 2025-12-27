#!/usr/bin/env node

/**
 * Standalone Integration Test Script
 * This script tests the frontend integration with real backend data
 * Run with: bun run scripts/test-integration.ts
 */

import { WordPressProvider } from '../src/providers/wordpress-provider';
import { OYUNINDIR_CONFIG } from '../src/config/providers';
import type { Game, Category } from '../src/types/game';

// ANSI color codes for terminal output
const colors = {
	reset: '\x1b[0m',
	bright: '\x1b[1m',
	green: '\x1b[32m',
	red: '\x1b[31m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
	console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title: string) {
	console.log('\n' + '='.repeat(60));
	console.log(`${colors.bright}${colors.blue}${title}${colors.reset}`);
	console.log('='.repeat(60));
}

function logTest(testName: string, passed: boolean) {
	const icon = passed ? '✓' : '✗';
	const color = passed ? 'green' : 'red';
	log(`  ${icon} ${testName}`, color);
}

async function runTests() {
	const provider = new WordPressProvider(OYUNINDIR_CONFIG);
	let passedTests = 0;
	let failedTests = 0;
	const results: { test: string; passed: boolean; error?: string }[] = [];

	logSection('FRONTEND INTEGRATION TEST WITH REAL BACKEND DATA');
	log(`Testing WordPress Provider: ${OYUNINDIR_CONFIG.baseUrl}`);
	log(`API Endpoint: ${OYUNINDIR_CONFIG.apiEndpoint}`);
	log(`Started at: ${new Date().toISOString()}`);

	// Test 1: Provider Initialization
	logSection('1. PROVIDER INITIALIZATION');
	try {
		const test1 = provider.name === 'WordPress Provider';
		const test2 = provider.getConfig().baseUrl === OYUNINDIR_CONFIG.baseUrl;
		
		if (test1 && test2) {
			logTest('Provider initialized correctly', true);
			passedTests++;
			results.push({ test: 'Provider initialized', passed: true });
		} else {
			logTest('Provider initialized correctly', false);
			failedTests++;
			results.push({ test: 'Provider initialized', passed: false, error: 'Name or config mismatch' });
		}
	} catch (error) {
		logTest('Provider initialized correctly', false);
		failedTests++;
		results.push({ test: 'Provider initialized', passed: false, error: String(error) });
	}

	// Test 2: Health Check
	logSection('2. HEALTH CHECK');
	try {
		const isHealthy = await provider.healthCheck();
		if (isHealthy) {
			logTest('Health check passed', true);
			passedTests++;
			results.push({ test: 'Health check', passed: true });
		} else {
			logTest('Health check passed', false);
			failedTests++;
			results.push({ test: 'Health check', passed: false, error: 'Provider not healthy' });
		}
	} catch (error) {
		logTest('Health check passed', false);
		failedTests++;
		results.push({ test: 'Health check', passed: false, error: String(error) });
	}

	// Test 3: Fetch Games
	logSection('3. FETCH GAMES');
	let games: Game[] = [];
	try {
		const fetchStart = performance.now();
		games = await provider.getGames(1, 20);
		const fetchEnd = performance.now();
		const fetchTime = fetchEnd - fetchStart;

		log(`  ✓ Fetched ${games.length} games in ${fetchTime.toFixed(2)}ms`, 'green');
		passedTests++;
		results.push({ test: 'Fetch games', passed: true });

		// Test 4: Game Structure
		logSection('4. GAME DATA STRUCTURE');
		if (games.length > 0) {
			const sampleGame = games[0];
			const requiredFields = ['id', 'title', 'coverImage', 'description', 'excerpt', 'publishedDate', 'author', 'categories', 'tags', 'downloadLinks', 'systemRequirements'];
			
			let hasAllFields = true;
			requiredFields.forEach(field => {
				if (!(field in sampleGame)) {
					logTest(`Game has ${field} field`, false);
					hasAllFields = false;
					failedTests++;
					results.push({ test: `Game has ${field}`, passed: false });
				}
			});

			if (hasAllFields) {
				logTest(`Game has all required fields (${requiredFields.length})`, true);
				passedTests++;
				results.push({ test: 'Game structure validation', passed: true });
			}
		}

		// Test 5: Game Data Validation
		logSection('5. GAME DATA VALIDATION');
		let validGames = 0;
		let gamesWithCover = 0;
		let gamesWithLinks = 0;
		let gamesWithRequirements = 0;

		for (const game of games) {
			const hasTitle = typeof game.title === 'string' && game.title.length > 0;
			const hasId = typeof game.id === 'number' && game.id > 0;
			const hasDate = game.publishedDate && !isNaN(new Date(game.publishedDate).getTime());

			if (game.coverImage) gamesWithCover++;
			if (game.downloadLinks.length > 0) gamesWithLinks++;
			if (game.systemRequirements) gamesWithRequirements++;

			if (hasTitle && hasId && hasDate) validGames++;
		}

		logTest(`All games have valid data (${validGames}/${games.length})`, validGames === games.length);
		if (validGames === games.length) {
			passedTests++;
			results.push({ test: 'Game data validation', passed: true });
		} else {
			failedTests++;
			results.push({ test: 'Game data validation', passed: false, error: `${games.length - validGames} invalid games` });
		}

		log(`  • Games with cover images: ${gamesWithCover}/${games.length}`, 'cyan');
		log(`  • Games with download links: ${gamesWithLinks}/${games.length}`, 'cyan');
		log(`  • Games with system requirements: ${gamesWithRequirements}/${games.length}`, 'cyan');

		// Test 6: Pagination
		logSection('6. PAGINATION');
		try {
			const paginatedResponse = await provider.getGamesPaginated(1, 10);
			const hasCorrectData = Array.isArray(paginatedResponse.data);
			const hasMetadata = paginatedResponse.page === 1 && paginatedResponse.limit === 10;
			const hasPaginationFlags = typeof paginatedResponse.hasNextPage === 'boolean' && typeof paginatedResponse.hasPreviousPage === 'boolean';

			if (hasCorrectData && hasMetadata && hasPaginationFlags) {
				logTest('Pagination works correctly', true);
				log(`  • Page: ${paginatedResponse.page}/${paginatedResponse.totalPages}`, 'cyan');
				log(`  • Total: ${paginatedResponse.total} games`, 'cyan');
				log(`  • Has next page: ${paginatedResponse.hasNextPage}`, 'cyan');
				passedTests++;
				results.push({ test: 'Pagination', passed: true });
			} else {
				logTest('Pagination works correctly', false);
				failedTests++;
				results.push({ test: 'Pagination', passed: false, error: 'Invalid pagination data' });
			}
		} catch (error) {
			logTest('Pagination works correctly', false);
			failedTests++;
			results.push({ test: 'Pagination', passed: false, error: String(error) });
		}

		// Test 7: Categories
		logSection('7. CATEGORIES');
		let categories: Category[] = [];
		try {
			categories = await provider.getCategories();
			log(`  ✓ Fetched ${categories.length} categories`, 'green');
			passedTests++;
			results.push({ test: 'Fetch categories', passed: true });

			if (categories.length > 0) {
				const sampleCat = categories[0];
				const hasValidCategory = typeof sampleCat.id === 'number' && typeof sampleCat.name === 'string' && sampleCat.name.length > 0;
				
				logTest('Categories have valid structure', hasValidCategory);
				if (hasValidCategory) {
					passedTests++;
					results.push({ test: 'Category structure', passed: true });
				} else {
					failedTests++;
					results.push({ test: 'Category structure', passed: false });
				}
			}
		} catch (error) {
			logTest('Fetch categories', false);
			failedTests++;
			results.push({ test: 'Fetch categories', passed: false, error: String(error) });
		}

		// Test 8: Search
		logSection('8. SEARCH FUNCTIONALITY');
		try {
			if (games.length > 0) {
				const searchQuery = games[0].title.split(' ')[0];
				const searchResults = await provider.searchGames(searchQuery);
				
				log(`  ✓ Search for "${searchQuery}" returned ${searchResults.length} results`, 'green');
				passedTests++;
				results.push({ test: 'Search functionality', passed: true });
			}
		} catch (error) {
			logTest('Search functionality', false);
			failedTests++;
			results.push({ test: 'Search functionality', passed: false, error: String(error) });
		}

		// Test 9: Caching
		logSection('9. CACHING PERFORMANCE');
		try {
			const firstFetchStart = performance.now();
			await provider.getGames(1, 20);
			const firstFetchEnd = performance.now();
			const firstFetchTime = firstFetchEnd - firstFetchStart;

			const secondFetchStart = performance.now();
			await provider.getGames(1, 20);
			const secondFetchEnd = performance.now();
			const secondFetchTime = secondFetchEnd - secondFetchStart;

			log(`  • First fetch: ${firstFetchTime.toFixed(2)}ms`, 'cyan');
			log(`  • Second fetch (cached): ${secondFetchTime.toFixed(2)}ms`, 'cyan');
			
			if (firstFetchTime > 0 && secondFetchTime > 0) {
				const improvement = ((firstFetchTime - secondFetchTime) / firstFetchTime * 100);
				log(`  • Performance improvement: ${improvement.toFixed(2)}%`, improvement > 0 ? 'green' : 'yellow');
				
				logTest('Caching improves performance', secondFetchTime < firstFetchTime);
				if (secondFetchTime < firstFetchTime) {
					passedTests++;
					results.push({ test: 'Caching performance', passed: true });
				} else {
					failedTests++;
					results.push({ test: 'Caching performance', passed: false, error: 'No improvement detected' });
				}
			}
		} catch (error) {
			logTest('Caching performance', false);
			failedTests++;
			results.push({ test: 'Caching performance', passed: false, error: String(error) });
		}

		// Test 10: Error Handling
		logSection('10. ERROR HANDLING');
		try {
			const invalidGame = await provider.getGameById(999999999);
			logTest('Handles invalid game ID gracefully', invalidGame === null);
			if (invalidGame === null) {
				passedTests++;
				results.push({ test: 'Error handling - invalid ID', passed: true });
			} else {
				failedTests++;
				results.push({ test: 'Error handling - invalid ID', passed: false, error: 'Should return null' });
			}
		} catch (error) {
			logTest('Handles invalid game ID gracefully', true); // Throwing is also acceptable
			passedTests++;
			results.push({ test: 'Error handling - invalid ID', passed: true });
		}

		try {
			const emptySearch = await provider.searchGames('');
			logTest('Handles empty search query', Array.isArray(emptySearch) && emptySearch.length === 0);
			if (Array.isArray(emptySearch) && emptySearch.length === 0) {
				passedTests++;
				results.push({ test: 'Error handling - empty search', passed: true });
			} else {
				failedTests++;
				results.push({ test: 'Error handling - empty search', passed: false, error: 'Should return empty array' });
			}
		} catch (error) {
			logTest('Handles empty search query', false);
			failedTests++;
			results.push({ test: 'Error handling - empty search', passed: false, error: String(error) });
		}

	} catch (error) {
		logTest('Fetch games', false);
		failedTests++;
		results.push({ test: 'Fetch games', passed: false, error: String(error) });
	}

	// Test Summary
	logSection('TEST SUMMARY');
	const totalTests = passedTests + failedTests;
	const passRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(2) : '0.00';

	log(`Total Tests: ${totalTests}`, 'bright');
	log(`Passed: ${passedTests}`, 'green');
	log(`Failed: ${failedTests}`, failedTests > 0 ? 'red' : 'green');
	log(`Pass Rate: ${passRate}%`, passRate === '100.00' ? 'green' : 'yellow');

	if (failedTests > 0) {
		log('\nFailed Tests:', 'red');
		results.filter(r => !r.passed).forEach(r => {
			log(`  ✗ ${r.test}${r.error ? `: ${r.error}` : ''}`, 'red');
		});
	}

	log(`\nCompleted at: ${new Date().toISOString()}`, 'cyan');
	log('='.repeat(60));

	// Exit with appropriate code
	process.exit(failedTests > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
	log(`\n${colors.red}Fatal error: ${error}${colors.reset}`, 'red');
	process.exit(1);
});