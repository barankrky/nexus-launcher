# Nexus Launcher - AI Development Guide

## Project Overview
Nexus Launcher is an Electron-based desktop gaming launcher that aggregates content from WordPress gaming blogs. It features an AMOLED dark theme, custom window controls, and aims to provide an Epic Games Launcher-like experience.

## Architecture & Key Patterns

### Electron Architecture
- **Main Process** (`electron/main.ts`): Handles window creation, IPC handlers for window controls
- **Preload Script** (`electron/preload.mjs`): Bridges main and renderer via `contextBridge`
- **Renderer Process** (React app): UI layer with TypeScript

### Custom Window Controls
Critical pattern - the app uses a frameless window with custom controls:
```typescript
// IPC communication pattern
window.windowAPI.minimizeWindow() // Exposed via preload script
```
- TitleBar component implements draggable area with `-webkit-app-region: drag`
- Window controls must have `-webkit-app-region: no-drag`
- Window state is tracked with periodic polling (1 second intervals)

### AMOLED Theme System
Strict color palette - **always** use these colors:
- `pure-black` (#000000) - Main background
- `onyx` (#0f0f0f) - Sidebar, title bar
- `carbon-black` (#1b1a1d) - Hover states, secondary elements
- `cool-gray` (#99adbc) - Icons, accent elements
- `pure-white` (#ffffff) - Primary text
- `text-gray` (#a0a0a0) - Secondary text

### Component Structure
- All components use TypeScript with proper interfaces
- Follow the existing pattern in `TitleBar.tsx` for window API integration
- Use Lucide React icons consistently
- Components should extend the AMOLED theme with hover states and transitions

## Development Workflow

### Build Commands
```bash
bun dev          # Development with hot reload
bun run build:web    # Web build only
bun run build:desktop # Interactive desktop build (asks for platform)
bun run start:desktop # Run built desktop app
bun run test      # Run Vitest tests
bun run coverage  # Generate test coverage
```

### Testing Setup
- **Vitest** with **happy-dom** for React component testing
- Test files in `src/__tests__/`
- Coverage reports generated in `coverage/`
- Use `@testing-library/react` for component testing

### Linting & Formatting
- Uses **BiomeJS** for linting and formatting
- Run `bun run lint` to check and fix issues
- Biome configuration in `biome.json`

## Key Integration Points

### WordPress API Integration
- Connect to WordPress REST APIs (`/wp-json/wp/v2/posts`, `/wp-json/wp/v2/media`)
- Parse game titles from post titles
- Extract download links from post content
- Featured images become game cover art

### Navigation Architecture
- Sidebar navigation with user profile section
- Main nav: Ana Sayfa (Home), Kütüphane (Library)
- Bottom nav: İndirmeler (Downloads), Ayarlar (Settings)
- All navigation items should have hover states with `carbon-black` background

### Asset Management
- Icons and images in `src/assets/`
- Use `@/` alias for imports (configured in Vite)
- Nexus icon: `nexus_icon.png`
- Profile picture: `nextrobyte_profile_picture.png`

## Critical Implementation Details

### TypeScript Configuration
- Strict mode enabled
- Path aliases: `@` maps to `src/`
- Electron types in `electron/electron-env.d.ts`

### Vite Configuration
- Electron plugin handles main/preload compilation
- React plugin for JSX
- Externalizes Electron modules in build

### Styling Conventions
- Always use AMOLED theme colors from `tailwind.config.js`
- Font family: Inter (`font-inter`)
- Smooth transitions: `transition-all duration-200`
- Hover states: `hover:bg-carbon-black` for interactive elements

## Common Patterns to Follow

### Window API Usage
```typescript
// Always check if windowAPI exists
if (window.windowAPI) {
  try {
    await window.windowAPI.minimizeWindow();
  } catch (error) {
    // Handle error gracefully
  }
}
```

### Component Structure
```typescript
export default function ComponentName() {
  // State management
  const [state, setState] = useState(initialValue);
  
  // Effects for side effects
  useEffect(() => {
    // Setup/teardown logic
  }, []);
  
  // Event handlers
  const handleAction = async () => {
    // Action logic with error handling
  };
  
  // JSX with AMOLED theme classes
  return (
    <div className="bg-onyx text-pure-white">
      {/* Component content */}
    </div>
  );
}
```

### Error Handling
- Always wrap window API calls in try-catch
- Provide fallback UI for failed operations
- Log errors appropriately without breaking UX

## File Organization
```
src/
├── components/    # Reusable UI components
├── pages/        # Main application pages
├── assets/       # Images, icons
├── lib/          # Utilities, helpers
├── types/        # TypeScript type definitions
└── __tests__/    # Test files
```

## Build Process Notes
- Desktop build is interactive - prompts for platform (mac/win/linux)
- Uses `electron-builder` with configuration in `package.json`
- Build outputs to `release/` directory
- Web build outputs to `dist/`

## Context Isolation Security
- Never disable context isolation
- All IPC communication must go through preload script
- No direct Node.js access in renderer process