# Claude Code Guide for Nexus Launcher

This document provides guidance for using Claude Code effectively with the Nexus Launcher project, including project-specific considerations, recommended workflows, and best practices for collaboration.

## About Claude Code

Claude Code is an AI assistant that helps with software engineering tasks, code analysis, and project development. For the Nexus Launcher project, Claude Code can assist with:

- Code review and quality assurance
- Feature implementation and debugging
- Documentation generation and improvement
- Architecture analysis and optimization
- Testing strategy and implementation
- Cross-platform development guidance

## Project Status Overview

**Current Version:** 1.0.0 "Nebula"
**Status:** MVP Complete and Production-Ready
**Test Status:** 100% Success (12/12 tests passed)
**Last Updated:** 2025-12-27

### Completed Features
- ✓ Full provider system with WordPress integration
- ✓ All four main pages (Home, Library, Downloads, Settings)
- ✓ AMOLED theme implementation
- ✓ Custom window controls and title bar
- ✓ Navigation and routing
- ✓ Search and filtering functionality
- ✓ Category management (78 categories)
- ✓ Pagination and caching
- ✓ Comprehensive testing suite

### Known Limitations
- Download functionality is UI-only (no actual file downloads yet)
- Some settings are UI-only (backend integration needed)
- Single provider (oyunindir.vip) - multi-provider planned for v2.0
- No user account system (planned for v2.2)

## Project-Specific Guidance

### Understanding the Nexus Launcher Architecture

The Nexus Launcher uses a modern tech stack that Claude Code is well-suited to work with:

- **Frontend:** React 18.3.1 + TypeScript in a Vite build system
- **Backend:** Electron 30.5.1 with IPC communication
- **Styling:** Tailwind CSS 3.4.18 with custom AMOLED theme
- **Testing:** Vitest 2.1.9 with React Testing Library 16.3.0
- **Build Tools:** Vite 5.4.21, electron-builder 24.13.3, BiomeJS 1.9.1
- **Package Manager:** Bun (npm compatible)

### Working with the AMOLED Theme

The Nexus Launcher features a custom AMOLED dark theme that Claude Code should understand:

**Color Palette:**
- **pure-black:** #000000 (true black for AMOLED efficiency)
- **onyx:** #0f0f0f (primary background)
- **onyx-2:** #0c0c0b (alternative background)
- **carbon-black:** #1b1a1d (cards and containers)
- **cool-gray:** #99adbc (accent color and highlights)
- **onyx-3:** #101010 (borders and separators)
- **text-gray:** #a0a0a0 (secondary text)

**Theme Characteristics:**
- Optimized for AMOLED displays (low power consumption)
- High contrast and readability
- Depth through tone variations
- Consistent visual language

**Layout Structure:**
- Custom title bar (frameless window)
- Sidebar navigation (264px width)
- Scrollable content area
- Responsive grid layouts

**Components:**
- Custom TitleBar component with window controls
- ShadcnUI components (Card, Button, Input, Select, Tabs, etc.)
- Custom components (GameCard, Carousel, CarouselGameCard, HorizontalGameRow)
- Reusable UI primitives (Badge, Progress, Separator, Switch)

**Styling:**
- Hover effects with scale and glow
- Smooth transitions (200-300ms)
- Card depth through border and tone changes
- Gradient overlays on game cards
- Backdrop blur effects on badges
- Custom scrollbar styling
- Active state indicators in sidebar

### Custom Window Controls

The Nexus Launcher implements a frameless window with custom controls - this is a key architectural element:

```typescript
// Window control IPC communication
windowAPI.minimizeWindow()
windowAPI.maximizeWindow()
windowAPI.closeWindow()
windowAPI.isMaximized()
```

### Navigation Panel Architecture

The navigation panel structure that Claude Code should be familiar with:

- User profile section with avatar and username
- Main navigation items (Ana Sayfa, Kütüphane)
- Bottom navigation items (İndirmeler, Ayarlar)
- Flex layout with proper spacing and AMOLED styling

## Provider System Architecture

### Understanding the Provider Pattern

The Nexus Launcher implements an extensible provider system for fetching game data from various sources. This is a critical architectural component that Claude Code should be familiar with.

**Key Components:**

1. **BaseProvider** ([`src/providers/base-provider.ts`](src/providers/base-provider.ts))
   - Abstract base class with common functionality
   - Built-in caching mechanism (5-minute TTL)
   - HTML parsing utilities for download links and system requirements
   - Error handling with context
   - Health check functionality

2. **WordPressProvider** ([`src/providers/wordpress-provider.ts`](src/providers/wordpress-provider.ts))
   - Concrete implementation for WordPress-based sites
   - Currently integrated with oyunindir.vip
   - Transforms WordPress posts to Game objects
   - Handles embedded data (author, media, categories, tags)

3. **ProviderService** ([`src/services/provider-service.ts`](src/services/provider-service.ts))
   - Singleton service layer
   - Wraps WordPressProvider with React-friendly patterns
   - Includes logging and error handling
   - Provides consistent interface

4. **ProviderContext** ([`src/contexts/ProviderContext.tsx`](src/contexts/ProviderContext.tsx))
   - React Context for provider access
   - Manages loading and error states
   - Exposes hooks for components

**Data Flow:**
```
Component → ProviderContext → ProviderService → WordPressProvider → WordPress API
```

**Key Methods:**
- `getGames(page, limit)` - Fetch paginated games
- `getGameById(id)` - Fetch single game
- `searchGames(query)` - Search games
- `getCategories()` - Fetch all categories
- `getGamesByCategory(categoryId, page, limit)` - Filter by category
- `healthCheck()` - Check provider health
- `clearCache()` - Clear cached data

### Adding a New Provider

When extending the provider system:

```typescript
import { BaseProvider } from './base-provider';
import type { Game, Category } from '../types/game';

class CustomProvider extends BaseProvider {
  public readonly name = 'Custom Provider';
  
  async getGames(page = 1, limit = 10): Promise<Game[]> {
    // Fetch from custom API
    const response = await fetch(`${this.config.baseUrl}/games?page=${page}`);
    const data = await response.json();
    return data.map(this.transformToGame);
  }
  
  // Implement other required methods...
}
```

### Provider Configuration

Provider configurations are managed in [`src/config/providers.ts`](src/config/providers.ts):

```typescript
export const OYUNINDIR_CONFIG: WordPressProviderConfig = {
  name: 'oyunindir.vip',
  baseUrl: 'https://www.oyunindir.vip',
  apiEndpoint: '/wp-json/wp/v2/posts',
  postsPerPage: 10,
  embed: true,
};
```

## Recommended Workflows

### 1. Code Review and Quality Assurance

When asking Claude Code to review code, provide context about the AMOLED theme and custom components:

```
Please review the TitleBar component in src/components/TitleBar.tsx.
The Nexus Launcher uses an AMOLED theme with colors: onyx (#0f0f0f),
carbon-black (#1b1a1d), and pure-white (#ffffff). The title bar should
be draggable with -webkit-app-region: drag, and buttons should be
non-draggable with -webkit-app-region: no-drag.

Please also check for:
- Type safety improvements
- Performance optimizations
- Error handling robustness
- Accessibility considerations
```

### 2. Feature Implementation

For implementing new features:

```
I need to implement a new feature for the Nexus Launcher:
[Describe the feature in detail]

Requirements:
- Must use the AMOLED theme colors (onyx, carbon-black, cool-gray)
- Should integrate with the existing provider system
- Include proper loading and error states
- Follow the existing component patterns
- Include TypeScript types

The feature should be implemented in [location] and follow the patterns
established in [similar component/page].
```

### 3. Debugging and Troubleshooting

For debugging issues:

```
I'm experiencing an issue in the Nexus Launcher:

**Issue:** [Describe the problem]

**Expected Behavior:** [What should happen]
**Actual Behavior:** [What's actually happening]

**Context:**
- The issue occurs in [component/page]
- It involves [provider/EIPC/UI/etc.]
- Error message: [if any]

Please help me:
1. Identify the root cause
2. Suggest specific fixes
3. Provide code examples if needed

Relevant files:
- [File paths]
```

### 4. Testing

For writing or reviewing tests:

```
Please help me write comprehensive tests for [component/function].

The tests should:
- Use Vitest and React Testing Library
- Test all critical paths
- Include edge cases
- Mock external dependencies (API calls, etc.)
- Follow the existing test patterns in src/__tests__/

Test requirements:
- [Specific test cases needed]
```

### 5. Documentation Enhancement

For improving documentation:

```
Please enhance [filename] to include [specific documentation needed].

The documentation should:
- Be clear and concise
- Include code examples
- Reference related files
- Follow the existing documentation style
- Be written in [language if specified]
```

## Project Structure Navigation

Claude Code can effectively navigate the Nexus Launcher project structure:

```
nexus-launcher/
├── electron/          # Electron main process
│   ├── main.ts         # Frameless window, IPC handlers
│   └── preload.mjs      # IPC bridge, windowAPI
├── src/               # React frontend
│   ├── components/      # React components
│   │   ├── TitleBar.tsx  # Custom title bar
│   │   ├── GameCard.tsx  # Game display card
│   │   ├── Carousel.tsx  # Auto-playing carousel
│   │   └── [other components]
│   ├── contexts/        # React contexts
│   │   └── ProviderContext.tsx
│   ├── pages/           # Page components
│   │   ├── HomePage.tsx
│   │   ├── LibraryPage.tsx
│   │   ├── DownloadsPage.tsx
│   │   └── SettingsPage.tsx
│   ├── providers/       # Data providers
│   │   ├── base-provider.ts
│   │   ├── wordpress-provider.ts
│   │   └── index.ts
│   ├── services/        # Service layer
│   │   └── provider-service.ts
│   ├── types/           # TypeScript types
│   │   └── game.ts
│   ├── config/          # Configuration
│   │   └── providers.ts
│   ├── assets/          # Images and media
│   ├── __tests__/       # Integration tests
│   └── app.tsx          # Main application
├── public/            # Static assets
├── scripts/           # Build automation
│   ├── build-desktop.ts
│   └── test-integration.ts
├── tests/             # Test directories
├── cache/             # Cache directory
├── ARCHITECTURE.md    # Provider system architecture
├── PRD.md            # Product Requirements Document
├── TEST_REPORT.md    # Test results
└── CLAUDE.md         # This file
```

## Best Practices

### Code Quality Standards

When working with Claude Code on the Nexus Launcher:

- **Maintain AMOLED theme consistency** - Always use the established color palette
- **Follow TypeScript conventions** - Ensure type safety and proper interfaces
- **Test custom components** - Verify functionality before and after changes
- **Document architectural decisions** - Explain why certain approaches were chosen
- **Maintain commit message quality** - Use comprehensive, descriptive messages
- **Use the provider system** - Don't make direct API calls, use providers
- **Handle errors gracefully** - Include proper error handling and user feedback
- **Write tests for new features** - Maintain test coverage
- **Run BiomeJS linting** - Ensure code style consistency

### Testing Strategy

**Current Test Status:**
- 12/12 integration tests passing (100% success rate)
- Provider system fully tested
- HTML parsing validated
- Data transformation verified

**Testing Guidelines:**
- Ask Claude Code to write unit tests for custom components
- Request integration tests for provider functionality
- Generate test coverage reports and quality metrics
- Verify AMOLED theme consistency across all components
- Test error scenarios and edge cases
- Mock external dependencies appropriately
- Use Happy DOM for DOM simulation

**Running Tests:**
```bash
# Run all tests
bun run test

# Run tests with UI
bun run test:ui

# Generate coverage report
bun run coverage
```

### Performance Considerations

**Current Performance Metrics:**
- App startup: <3 seconds ✓
- Page transitions: <500ms ✓
- API fetch (10 games): ~800ms ✓
- Cached fetch: ~0.01ms (52.46% improvement) ✓
- Health check: <100ms ✓
- Categories fetch (78): <500ms ✓
- Search query: <200ms ✓

**Optimization Opportunities:**
- **AMOLED Theme Efficiency:** Ask for optimizations that maintain visual quality while ensuring smooth performance
- **Provider Caching:** Leverage built-in caching (5-minute TTL) to reduce API calls
- **Image Optimization:** Request lazy loading and compression strategies
- **Virtual Scrolling:** Implement for large lists (future enhancement)
- **Request Batching:** Optimize multiple concurrent requests
- **Window Control Performance:** Request analysis of IPC communication efficiency
- **React Component Optimization:** Ask for suggestions on memoization, useEffect usage, and render optimization
- **Build Process:** Request guidance on improving build times and bundle size

### Security Considerations

**Current Security Measures:**
- ✓ Context isolation enabled
- ✓ Node integration disabled
- ✓ IPC communication secured
- ✓ API key support via environment variables
- ✓ Input validation implemented
- ✓ HTML sanitization for user content
- ✓ Error handling without sensitive data exposure

**Security Guidelines:**
- **Context Isolation:** Ensure all IPC communication maintains security boundaries
- **Preload Script Security:** Ask for security best practices in electron/preload.mjs
- **Node Integration:** Verify that node integration remains disabled in renderer process
- **Third-party Dependencies:** Request security reviews for any new dependencies added
- **API Keys:** Never hardcode credentials; use environment variables
- **Input Validation:** Always validate and sanitize user inputs
- **Error Messages:** Don't expose sensitive information in error messages
- **Downloads:** Validate file types and paths before downloading (when implemented)

## Examples of Effective Prompts

### Code Review Example

```
Please review the following TypeScript component for the Nexus Launcher:

```typescript
export default function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);

  const handleMinimize = async () => {
    if (window.windowAPI) {
      try {
        await window.windowAPI.minimizeWindow();
      } catch (error) {
        // Error handling for minimize operation
      }
    }
  };

  return (
    <div className="bg-onyx h-8 flex items-center px-4">
      {/* Title bar content */}
    </div>
  );
}
```

The component uses the windowAPI for window control, maintains AMOLED styling, and includes error handling. Please check for:
- Type safety improvements
- Performance optimizations
- AMOLED theme consistency
- Error handling robustness
```

### Feature Development Example

```
I need to implement a settings page for the Nexus Launcher with the following requirements:
- Navigation item in the sidebar
- Settings for download location
- Theme customization options (future AMOLED variations)
- Application version information
- AMOLED theme styling that matches the rest of the app

Please implement a Settings component that integrates with the existing
navigation panel and maintains the AMOLED theme throughout. Focus on
clean, maintainable code with proper TypeScript types.
```

### Debugging Assistance Example

```
I'm experiencing a bug in the Nexus Launcher:

**Issue:** [Describe the bug clearly]

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior:** What should happen
**Actual Behavior:** What actually happens

**Error Information:**
- Error message: [If available]
- Console logs: [Any relevant logs]
- Stack trace: [If available]

**Environment:**
- OS: [Windows/macOS/Linux]
- Node version: [If relevant]
- Build type: [Development/Production]

**Relevant Files:**
- [List file paths related to the issue]

Please help me:
1. Identify the root cause
2. Provide specific fixes with code examples
3. Suggest how to prevent similar issues
4. Recommend additional testing if needed
```

## Collaboration Tips

### Team Development

- **Establish Clear Guidelines:** Use CLAUDE.md to document team-specific approaches
- **Shared Understanding:** Ensure all team members understand the AMOLED theme requirements
- **Code Review Standards:** Use Claude Code to maintain consistent code quality across the team
- **Documentation Updates:** Regularly update documentation as the project evolves

### Knowledge Sharing

- **Architecture Decisions:** Document why specific approaches were chosen for the AMOLED theme or window controls
- **Testing Strategies:** Share effective testing patterns for custom components
- **Performance Insights:** Share optimizations discovered during development
- **User Experience Considerations:** Document accessibility and usability improvements

## Limitations and Considerations

### What Claude Code Cannot Do

- **Run the application** - Claude Code cannot execute or test the application
- **Access external APIs** - Cannot make actual network requests or file system operations
- **Direct file modifications** - Can suggest changes but cannot directly edit files without user confirmation
- **Environment-specific testing** - Cannot test platform-specific build issues

### Best Practices

- **Provide Context:** Always include relevant code snippets and current state information
- **Be Specific:** Give detailed requirements rather than general suggestions
- **Ask for Clarification:** Request more information when requirements are unclear
- **Verify Suggestions:** Always test Claude Code's suggestions before applying them
- **Document Decisions:** Keep track of why certain architectural choices were made

## Conclusion

Claude Code is a powerful tool for Nexus Launcher development, particularly valuable for:
- Implementing AMOLED theme components with proper styling and behavior
- Debugging complex IPC communication between Electron processes
- Writing comprehensive tests for custom functionality
- Maintaining code quality and documentation standards
- Providing architectural insights and optimization suggestions

When used effectively with an understanding of the project's specific requirements and constraints, Claude Code becomes an invaluable partner in the Nexus Launcher development process.

---

**Last Updated:** 2024
**Project Version:** 1.0.0 "Nebula"
**Claude Version:** Sonnet 4.5
**Project Status:** Complete and Functional