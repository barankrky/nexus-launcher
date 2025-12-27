# Nexus Launcher Provider System Architecture

## Summary

The Nexus Launcher provider system is a complete, extensible backend architecture for fetching game data from various sources. It provides a unified interface for accessing game information, making it easy to support multiple data providers with consistent behavior.

## File Structure

```
src/
├── types/
│   ├── game.ts          # Core type definitions
│   └── index.ts         # Type exports
├── providers/
│   ├── base-provider.ts     # Abstract base class
│   ├── wordpress-provider.ts # WordPress implementation
│   ├── index.ts             # Provider exports
│   └── README.md            # Provider documentation
└── config/
    ├── providers.ts      # Configuration management
    └── index.ts         # Configuration exports
```

## Core Components

### 1. Type Definitions (`src/types/game.ts`)

**Purpose**: Define the data model for games and providers

**Key Interfaces**:
- [`Game`](src/types/game.ts:8) - Complete game data structure with all fields
- [`DownloadLink`](src/types/game.ts:45) - Download link with type and availability
- [`Category`](src/types/game.ts:56) - Game category information
- [`Author`](src/types/game.ts:92) - Author/poster information
- [`SystemRequirements`](src/types/game.ts:113) - System requirements structure
- [`Provider`](src/types/game.ts:149) - Interface defining provider contract
- [`WordPressPostResponse`](src/types/game.ts:189) - WordPress REST API response structure

**Design Decisions**:
- All interfaces use JSDoc comments for documentation
- Optional fields are clearly marked
- Download link types are defined as union type for type safety
- WordPress-specific types are separate from core game types

### 2. Base Provider (`src/providers/base-provider.ts`)

**Purpose**: Provide common functionality and contract for all providers

**Key Features**:
- Caching mechanism with configurable expiration (default: 5 minutes)
- HTML parsing utilities for extracting download links and system requirements
- Error handling with context information
- Health check functionality
- Pagination support with metadata

**Key Methods**:
- [`getGames(page, limit)`](src/providers/base-provider.ts:72) - Fetch paginated games
- [`getGameById(id)`](src/providers/base-provider.ts:88) - Fetch single game
- [`searchGames(query)`](src/providers/base-provider.ts:104) - Search games
- [`getCategories()`](src/providers/base-provider.ts:120) - Fetch categories
- [`getGamesByCategory(categoryId, page, limit)`](src/providers/base-provider.ts:136) - Filter by category
- [`getGamesPaginated(page, limit)`](src/providers/base-provider.ts:156) - Get games with pagination metadata
- [`healthCheck()`](src/providers/base-provider.ts:233) - Check provider health

**Protected Utilities**:
- [`extractDownloadLinks(htmlContent)`](src/providers/base-provider.ts:264) - Parse download links from HTML
- [`extractSystemRequirements(htmlContent)`](src/providers/base-provider.ts:309) - Parse system requirements from HTML
- [`extractMediaGallery(htmlContent)`](src/providers/base-provider.ts:373) - Extract image URLs from HTML
- [`sanitizeHtml(html)`](src/providers/base-provider.ts:395) - Remove HTML tags from content
- [`handleError(error, context)`](src/providers/base-provider.ts:413) - Consistent error handling

### 3. WordPress Provider (`src/providers/wordpress-provider.ts`)

**Purpose**: Concrete implementation for WordPress-based game sites

**Key Features**:
- Fetches games from WordPress REST API v2
- Transforms WordPress posts to Game objects
- Handles embedded data (author, media, categories, tags)
- Supports category filtering and search
- Configurable API endpoint and pagination

**Key Methods**:
- [`getGames(page, limit)`](src/providers/wordpress-provider.ts:72) - Fetch games with pagination
- [`getGameById(id)`](src/providers/wordpress-provider.ts:115) - Fetch specific game by WordPress post ID
- [`searchGames(query)`](src/providers/wordpress-provider.ts:160) - Search games by title/content
- [`getCategories()`](src/providers/wordpress-provider.ts:205) - Fetch all available categories
- [`getGamesByCategory(categoryId, page, limit)`](src/providers/wordpress-provider.ts:242) - Filter games by category

**Private Methods**:
- [`transformPostToGame(post)`](src/providers/wordpress-provider.ts:289) - Transform WordPress post to Game object
- [`buildApiUrl(params)`](src/providers/wordpress-provider.ts:368) - Build WordPress REST API URL
- [`buildHeaders()`](src/providers/wordpress-provider.ts:389) - Build request headers with authentication

### 4. Configuration (`src/config/providers.ts`)

**Purpose**: Manage provider configurations and settings

**Key Exports**:
- [`OYUNINDIR_CONFIG`](src/config/providers.ts:8) - Default configuration for oyunindir.vip
- [`WORDPRESS_PROVIDERS`](src/config/providers.ts:18) - Registry of provider configurations
- [`DEFAULT_PROVIDER_CONFIG`](src/config/providers.ts:36) - Default configuration values
- [`PROVIDER_SETTINGS`](src/config/providers.ts:48) - Runtime settings
- [`PROVIDER_ENV_VARS`](src/config/providers.ts:75) - Environment variable names

**Key Functions**:
- [`getWordPressProviderConfig(name)`](src/config/providers.ts:96) - Get configuration by name
- [`getAvailableProviders()`](src/config/providers.ts:112) - List all available providers
- [`createWordPressConfig(baseUrl, options)`](src/config/providers.ts:127) - Create custom configuration
- [`loadFromEnvironment(config)`](src/config/providers.ts:144) - Load with environment overrides
- [`validateProviderConfig(config)`](src/config/providers.ts:163) - Validate configuration
- [`getProviderMetadata(config)`](src/config/providers.ts:193) - Get provider metadata

## Data Flow

### Fetching Games

```
User Request
    ↓
WordPressProvider.getGames()
    ↓
Build API URL with pagination
    ↓
Fetch from WordPress REST API
    ↓
Transform WordPressPostResponse to Game[]
    ↓
Cache results
    ↓
Return Game[]
```

### Transforming WordPress Data

```
WordPressPostResponse
    ↓
Extract author from _embedded.author
    ↓
Extract media from _embedded.wp:featuredmedia
    ↓
Extract categories from _embedded.wp:term[0]
    ↓
Extract tags from _embedded.wp:term[1]
    ↓
Parse download links from content HTML
    ↓
Parse system requirements from content HTML
    ↓
Extract media gallery from content HTML
    ↓
Return Game object
```

## Design Patterns

### 1. Strategy Pattern
The [`Provider`](src/types/game.ts:149) interface defines a contract that all providers must implement, allowing different strategies for fetching game data.

### 2. Template Method Pattern
The [`BaseProvider`](src/providers/base-provider.ts:23) class defines the skeleton of algorithms, with subclasses implementing specific steps.

### 3. Caching Pattern
Built-in caching with TTL (Time To Live) expiration to reduce API calls and improve performance.

### 4. Factory Pattern
Configuration functions like [`createWordPressConfig`](src/config/providers.ts:127) act as factories for creating provider configurations.

## Extensibility

### Adding a New Provider

1. Create a new class extending [`BaseProvider`](src/providers/base-provider.ts:23)
2. Implement all abstract methods
3. Add configuration to [`WORDPRESS_PROVIDERS`](src/config/providers.ts:18) or create custom config
4. Register in [`src/providers/index.ts`](src/providers/index.ts)

Example:
```typescript
class SteamProvider extends BaseProvider {
  public readonly name = 'Steam Provider';
  
  async getGames(page = 1, limit = 10): Promise<Game[]> {
    // Fetch from Steam API
  }
  
  // Implement other methods...
}
```

### Adding New Data Fields

1. Update the [`Game`](src/types/game.ts:8) interface
2. Update [`WordPressProvider.transformPostToGame()`](src/providers/wordpress-provider.ts:289) to extract new fields
3. Update [`BaseProvider`](src/providers/base-provider.ts:23) utilities if needed

## Performance Considerations

### Caching Strategy
- Default cache expiration: 5 minutes
- Cache keys include page, limit, and query parameters
- Manual cache clearing available via [`clearCache()`](src/providers/base-provider.ts:208)
- Per-key cache clearing via [`clearCacheKey()`](src/providers/base-provider.ts:219)

### Request Optimization
- Embedded data fetched in single request when possible
- Pagination to limit data transfer
- Configurable posts per page

### Memory Management
- Cache automatically expires old entries
- Clear cache methods for manual cleanup
- Map-based cache for O(1) lookups

## Error Handling

### Error Types
- Network errors (fetch failures)
- API errors (HTTP status codes)
- Parsing errors (invalid data)
- Configuration errors (invalid URLs, missing fields)

### Error Handling Strategy
- All providers use [`handleError()`](src/providers/base-provider.ts:413) for consistent error formatting
- Error messages include provider name and context
- [`healthCheck()`](src/providers/base-provider.ts:233) for proactive monitoring

## Security Considerations

### API Keys
- Support for API key authentication via configuration
- Environment variable support for secure key storage
- Keys included in Authorization header

### Input Validation
- [`validateProviderConfig()`](src/config/providers.ts:163) validates configuration before use
- URL validation to prevent malformed requests
- Type safety via TypeScript interfaces

### Data Sanitization
- [`sanitizeHtml()`](src/providers/base-provider.ts:395) removes HTML tags from user-facing content
- HTML entity decoding for proper display

## Testing Strategy

### Unit Tests
- Test [`BaseProvider`](src/providers/base-provider.ts:23) utilities in isolation
- Test [`WordPressProvider`](src/providers/wordpress-provider.ts:28) transformation logic
- Test configuration validation

### Integration Tests
- Test full data flow from API to Game objects
- Test caching behavior
- Test error scenarios

### E2E Tests
- Test provider initialization
- Test search and filtering
- Test pagination

## Future Enhancements

### Planned Features
- Support for additional provider types (Steam, Epic Games, etc.)
- Offline mode with local storage caching
- Real-time updates via WebSocket
- Rate limiting and throttling
- Advanced search with multiple filters
- User preferences and favorites
- Download management integration
- Multi-provider aggregation with deduplication

### Scalability Considerations
- Configurable concurrency limits
- Request queuing for high-traffic scenarios
- Distributed caching (Redis, etc.)
- Load balancing across multiple providers

## Dependencies

### External Dependencies
- None (uses only native fetch API)

### Internal Dependencies
- All providers depend on type definitions
- [`WordPressProvider`](src/providers/wordpress-provider.ts:28) extends [`BaseProvider`](src/providers/base-provider.ts:23)
- Configuration depends on type definitions

## API Compatibility

### WordPress REST API v2
- Standard post structure
- Embedded data support (`_embed` parameter)
- Pagination support
- Category and term filtering
- Search functionality

### Expected Response Format
```json
{
  "id": 123,
  "title": { "rendered": "Game Title" },
  "content": { "rendered": "<p>Game description</p>" },
  "excerpt": { "rendered": "<p>Short description</p>" },
  "author": 1,
  "featured_media": 456,
  "categories": [1, 2, 3],
  "tags": [4, 5],
  "link": "https://example.com/game",
  "slug": "game-slug",
  "date": "2025-12-26T12:00:00",
  "_embedded": {
    "author": [...],
    "wp:featuredmedia": [...],
    "wp:term": [[categories], [tags]]
  }
}
```

## Migration Guide

### From Direct API Calls
Replace direct API calls with provider methods:

**Before:**
```typescript
const response = await fetch('https://example.com/api/games');
const games = await response.json();
```

**After:**
```typescript
const provider = new WordPressProvider(config);
const games = await provider.getGames();
```

### Adding Caching
No changes needed - caching is built-in.

### Adding Error Handling
Errors are automatically handled with context.

## Best Practices

1. **Always use providers** instead of direct API calls
2. **Leverage caching** to reduce API overhead
3. **Handle errors** with try-catch blocks
4. **Validate data** before using (check for null/undefined)
5. **Use pagination** for large datasets
6. **Monitor health** with `healthCheck()`
7. **Clear cache** when data becomes stale
8. **Use configuration** instead of hardcoded values

## Conclusion

The Nexus Launcher provider system provides a robust, extensible architecture for game data management. It abstracts away the complexities of API interaction, caching, and data transformation, providing a clean interface for the rest of the application to consume.

The system is designed to be:
- **Extensible**: Easy to add new providers
- **Maintainable**: Clear separation of concerns
- **Performant**: Built-in caching and optimization
- **Type-safe**: Full TypeScript support
- **Well-documented**: JSDoc comments and README files

This architecture will serve as the foundation for all game data operations in the Nexus Launcher application.