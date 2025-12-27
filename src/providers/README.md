# Nexus Launcher Provider System

## Overview

The Nexus Launcher provider system is a flexible, extensible architecture for fetching game data from various sources. It provides a unified interface for accessing game information regardless of the underlying data source.

## Architecture

### Core Components

#### 1. Type Definitions ([`../types/game.ts`](../types/game.ts))

Defines all TypeScript interfaces and types used throughout the provider system:

- **`Game`**: Complete game data structure
- **`DownloadLink`**: Download link with type and availability
- **`Category`**: Game category information
- **`Tag`**: Game tag information
- **`Author`**: Author/poster information
- **`SystemRequirements`**: System requirements structure
- **`Provider`**: Interface defining the contract for all providers
- **`WordPressPostResponse`**: WordPress API response structure
- **`WordPressMedia`**: WordPress media attachment structure
- **`WordPressAuthor`**: WordPress author structure
- **`WordPressTerm`**: WordPress category/tag structure

#### 2. Base Provider ([`base-provider.ts`](base-provider.ts))

Abstract base class that provides common functionality for all providers:

**Features:**
- Caching mechanism with configurable expiration
- HTML parsing utilities for extracting download links, system requirements
- Error handling with context
- Health check functionality
- Cache management

**Methods:**
- `getGames(page, limit)`: Fetch paginated games
- `getGameById(id)`: Fetch single game
- `searchGames(query)`: Search games
- `getCategories()`: Fetch categories
- `getGamesByCategory(categoryId, page, limit)`: Filter by category
- `getGamesPaginated(page, limit)`: Get games with pagination metadata
- `clearCache()`: Clear all cached data
- `healthCheck()`: Check provider health

#### 3. WordPress Provider ([`wordpress-provider.ts`](wordpress-provider.ts))

Concrete implementation for WordPress-based game sites (like oyunindir.vip):

**Features:**
- Fetches games from WordPress REST API
- Transforms WordPress posts to Game objects
- Handles embedded data (author, media, terms)
- Supports category filtering and search
- Configurable API endpoint and pagination

**Methods:**
- `getGames(page, limit)`: Fetch games with pagination
- `getGameById(id)`: Fetch specific game by WordPress post ID
- `searchGames(query)`: Search games by title/content
- `getCategories()`: Fetch all available categories
- `getGamesByCategory(categoryId, page, limit)`: Filter games by category

#### 4. Configuration ([`../config/providers.ts`](../config/providers.ts))

Configuration management for providers:

**Exports:**
- `OYUNINDIR_CONFIG`: Default configuration for oyunindir.vip
- `WORDPRESS_PROVIDERS`: Registry of WordPress provider configurations
- `DEFAULT_PROVIDER_CONFIG`: Default configuration values
- `PROVIDER_SETTINGS`: Runtime settings and preferences
- `PROVIDER_ENV_VARS`: Environment variable names

**Functions:**
- `getWordPressProviderConfig(name)`: Get configuration by name
- `getAvailableProviders()`: List all available providers
- `createWordPressConfig(baseUrl, options)`: Create custom configuration
- `loadFromEnvironment(config)`: Load with environment overrides
- `validateProviderConfig(config)`: Validate configuration
- `getProviderMetadata(config)`: Get provider metadata

## Usage Examples

### Basic Usage

```typescript
import { WordPressProvider } from './providers/wordpress-provider';
import { OYUNINDIR_CONFIG } from './config/providers';

// Create a provider instance
const provider = new WordPressProvider(OYUNINDIR_CONFIG);

// Fetch games
const games = await provider.getGames(1, 10);
console.log(`Found ${games.length} games`);

// Fetch a specific game
const game = await provider.getGameById(12345);
if (game) {
  console.log(`Game: ${game.title}`);
  console.log(`Categories: ${game.categories.map(c => c.name).join(', ')}`);
}

// Search for games
const actionGames = await provider.searchGames('action');

// Get categories
const categories = await provider.getCategories();
```

### Using Custom Configuration

```typescript
import { WordPressProvider } from './providers/wordpress-provider';
import { createWordPressConfig } from './config/providers';

const config = createWordPressConfig('https://mysite.com', {
  postsPerPage: 20,
  category: 'games',
  apiKey: 'my-api-key',
});

const provider = new WordPressProvider(config);
```

### Working with Categories

```typescript
import { WordPressProvider } from './providers/wordpress-provider';
import { OYUNINDIR_CONFIG } from './config/providers';

const provider = new WordPressProvider(OYUNINDIR_CONFIG);

// Get all categories
const categories = await provider.getCategories();
const actionCategory = categories.find(c => c.slug === 'aksiyon-oyunlari');

if (actionCategory) {
  // Get games in this category
  const actionGames = await provider.getGamesByCategory(actionCategory.id, 1, 20);
  console.log(`Found ${actionGames.length} action games`);
}
```

### Pagination

```typescript
import { WordPressProvider } from './providers/wordpress-provider';
import { OYUNINDIR_CONFIG } from './config/providers';

const provider = new WordPressProvider(OYUNINDIR_CONFIG);

// Get paginated response with metadata
const response = await provider.getGamesPaginated(1, 10);
console.log(`Page ${response.page} of ${response.totalPages}`);
console.log(`Total games: ${response.total}`);
console.log(`Has next page: ${response.hasNextPage}`);

// Fetch next page
if (response.hasNextPage) {
  const nextPage = await provider.getGames(response.page + 1, response.limit);
}
```

### Caching

```typescript
import { WordPressProvider } from './providers/wordpress-provider';
import { OYUNINDIR_CONFIG } from './config/providers';

const provider = new WordPressProvider(OYUNINDIR_CONFIG);

// First call fetches from API
const games1 = await provider.getGames(1, 10);

// Second call returns cached data (within 5 minutes)
const games2 = await provider.getGames(1, 10);

// Clear cache manually
provider.clearCache();

// Or clear specific cache key
provider.clearCacheKey('games-1-10');
```

### Health Check

```typescript
import { WordPressProvider } from './providers/wordpress-provider';
import { OYUNINDIR_CONFIG } from './config/providers';

const provider = new WordPressProvider(OYUNINDIR_CONFIG);

const isHealthy = await provider.healthCheck();
if (!isHealthy) {
  console.error('Provider is not responding');
  // Handle error or switch to fallback provider
}
```

## Data Model

### Game Object Structure

```typescript
interface Game {
  id: number;
  title: string;
  slug: string;
  coverImage: string;
  thumbnail: string;
  description: string;
  excerpt: string;
  publishedDate: string;
  author: Author;
  categories: Category[];
  tags: Tag[];
  downloadLinks: DownloadLink[];
  systemRequirements: SystemRequirements;
  permalink: string;
  mediaGallery: string[];
}
```

### Download Link Types

- `direct`: Direct download link
- `torrent`: Torrent file
- `mediafire`: MediaFire link
- `googledrive`: Google Drive link
- `pixeldrain`: PixelDrain link
- `turbobit`: TurboBit link
- `other`: Other link types

## Extending the System

### Creating a Custom Provider

```typescript
import { BaseProvider } from './base-provider';
import type { Game, Category } from '../types/game';

class CustomProvider extends BaseProvider {
  public readonly name = 'Custom Provider';

  async getGames(page = 1, limit = 10): Promise<Game[]> {
    // Implementation
  }

  async getGameById(id: number): Promise<Game | null> {
    // Implementation
  }

  async searchGames(query: string): Promise<Game[]> {
    // Implementation
  }

  async getCategories(): Promise<Category[]> {
    // Implementation
  }
}

// Use the custom provider
const provider = new CustomProvider({
  baseUrl: 'https://api.example.com',
  apiKey: 'your-api-key',
});
```

### Registering a New WordPress Provider

```typescript
import { WORDPRESS_PROVIDERS } from './config/providers';

WORDPRESS_PROVIDERS['my-provider'] = {
  baseUrl: 'https://my-games-site.com',
  apiEndpoint: '/wp-json/wp/v2/posts',
  postsPerPage: 20,
  embed: true,
  category: 'pc-games',
};
```

## Configuration

### Environment Variables

The provider system supports the following environment variables:

- `NEXUS_PROVIDER_API_KEY`: API key for authentication
- `NEXUS_PROVIDER_BASE_URL`: Override base URL
- `NEXUS_PROVIDER_CACHE`: Enable/disable caching
- `NEXUS_PROVIDER_CACHE_DURATION`: Cache duration in milliseconds
- `NEXUS_PROVIDER_TIMEOUT`: Request timeout in milliseconds
- `NEXUS_PROVIDER_MAX_RETRIES`: Maximum retry attempts

### Default Settings

```typescript
{
  enableCaching: true,
  cacheExpiry: 300000, // 5 minutes
  maxConcurrentRequests: 5,
  requestTimeout: 30000, // 30 seconds
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  enableLogging: true, // in development
  validateResponses: true,
}
```

## Error Handling

All providers throw errors with context information:

```typescript
try {
  const games = await provider.getGames(1, 10);
} catch (error) {
  // Error message includes provider name and context
  // Example: "[WordPress Provider] Failed to fetch games: HTTP 404"
  console.error(error);
}
```

## Best Practices

1. **Always handle errors**: Provider operations can fail due to network issues or API errors
2. **Use caching**: Leverage the built-in caching to reduce API calls
3. **Validate data**: Check for null/undefined values when working with optional fields
4. **Respect pagination**: Don't request too many items at once
5. **Monitor health**: Use `healthCheck()` to verify provider availability
6. **Clear cache when needed**: Clear cache after updates or when data becomes stale

## API Compatibility

The WordPress provider is designed to work with WordPress REST API v2. It expects:

- Standard post structure with `id`, `title`, `content`, `excerpt`, `author`, `featured_media`
- Embedded data for author, media, and terms (categories/tags)
- HTML content with download links and system requirements

## Future Enhancements

Potential areas for expansion:

- Support for additional provider types (Steam API, custom APIs)
- Offline mode with local caching
- Real-time updates via WebSocket
- Rate limiting and throttling
- Advanced search with filters
- User preferences and favorites
- Download management integration
- Multi-provider aggregation with deduplication