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

## Project-Specific Guidance

### Understanding the Nexus Launcher Architecture

The Nexus Launcher uses a modern tech stack that Claude Code is well-suited to work with:

- **Frontend:** React 18.3.1 + TypeScript in a Vite build system
- **Backend:** Electron 30.5.1 with IPC communication
- **Styling:** Tailwind CSS with custom AMOLED theme
- **Testing:** Vitest with React Testing Library
- **Build Tools:** Vite, electron-builder, BiomeJS

### Working with the AMOLED Theme

The Nexus Launcher features a custom AMOLED dark theme that Claude Code should understand:

- **Color Palette:** Pure black (#000000), onyx (#0f0f0f), carbon-black (#1b1a1d), cool-gray (#99adbc)
- **Layout Structure:** Custom title bar + sidebar navigation + content area
- **Components:** Custom TitleBar component with window controls
- **Styling:** Hover effects, transitions, and visual depth

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

## Recommended Workflows

### 1. Code Review and Quality Assurance

When asking Claude Code to review code, provide context about the AMOLED theme and custom components:

```
Please review the TitleBar component in src/components/TitleBar.tsx.
The Nexus Launcher uses an AMOLED theme with colors: onyx (#0f0f0f),
carbon-black (#1b1a1d), and pure-white (#ffffff). The title bar should
be draggable with -webkit-app-region: drag, and buttons should be
non-draggable with -webkit-app-region: no-drag.
```

### 2. Feature Implementation

For implementing new features like the game grid or library management:

```
I need to implement a game grid component for the home page.
The Nexus Launcher should display games in a responsive grid layout
with hover effects using the AMOLED theme. Each game card should include:
- Game image/cover art
- Game title and description
- Download button with proper hover states
- Consistent spacing and AMOLED styling

The grid should be responsive and work with the existing
navigation panel layout.
```

### 3. Debugging and Troubleshooting

For debugging issues with the custom window controls:

```
The custom title bar controls aren't working correctly. The buttons
are visible but clicking them doesn't minimize, maximize, or close the
window. The windowAPI is exposed through contextBridge in the
preload script. Please check:
1. IPC handlers in electron/main.ts
2. windowAPI exposure in electron/preload.mjs
3. Event handlers in the TitleBar component
4. Console errors in the development tools
```

### 4. Documentation Enhancement

For improving documentation like README.md or adding new documentation:

```
Please enhance the README.md to include a "Development Setup"
section that explains the complete development workflow, including:
- Prerequisites (Node.js, Bun package manager)
- Installation and configuration steps
- Development server commands
- Build and deployment procedures
- Testing workflow with Vitest
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
│   │   └── TitleBar.tsx  # Custom title bar
│   ├── assets/          # Images and media
│   └── app.tsx          # Main application
├── public/            # Static assets
├── scripts/           # Build automation
└── docs/             # Documentation
```

## Best Practices

### Code Quality Standards

When working with Claude Code on the Nexus Launcher:

- **Maintain AMOLED theme consistency** - Always use the established color palette
- **Follow TypeScript conventions** - Ensure type safety and proper interfaces
- **Test custom components** - Verify functionality before and after changes
- **Document architectural decisions** - Explain why certain approaches were chosen
- **Maintain commit message quality** - Use comprehensive, descriptive messages

### Testing Strategy

- Ask Claude Code to write unit tests for custom components
- Request integration tests for IPC communication
- Generate test coverage reports and quality metrics
- Verify AMOLED theme consistency across all components

### Performance Considerations

- **AMOLED Theme Efficiency:** Ask for optimizations that maintain visual quality while ensuring smooth performance
- **Window Control Performance:** Request analysis of IPC communication efficiency
- **React Component Optimization:** Ask for suggestions on memoization, useEffect usage, and render optimization
- **Build Process:** Request guidance on improving build times and bundle size

### Security Considerations

- **Context Isolation:** Ensure all IPC communication maintains security boundaries
- **Preload Script Security:** Ask for security best practices in electron/preload.mjs
- **Node Integration:** Verify that node integration remains disabled in renderer process
- **Third-party Dependencies:** Request security reviews for any new dependencies added

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
The Nexus Launcher window controls work in development but not in the
production build. The development build works correctly, but after packaging
with electron-builder, the window controls stop functioning.

The issue appears related to the preload script or main process configuration
when packaged. Please analyze:
1. The vite.config.ts preload configuration
2. The electron-builder.json packaging settings
3. Any differences between development and production environments
4. Console errors or warnings from the packaged application

Focus on identifying the root cause and providing specific solutions.
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