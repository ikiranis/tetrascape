# CSS Architecture Documentation

## Overview
The Tetrascape project CSS has been refactored from a single monolithic file into a modular component-based architecture for better maintainability and organization.

## File Structure

```
styles/
├── main.css           # Main entry point - imports all other CSS files
├── variables.css      # CSS custom properties, colors, fonts, base styles
├── controls.css       # Control buttons (play, pause, restart, sound)
├── layout.css         # Game container, header, score panel, game board
├── game-canvas.css    # Canvas styles and character animations
├── panels.css         # Side panels (stats, inventory, controls, next piece)
├── modals.css         # Modal overlays, store interface, achievements
├── responsive.css     # Media queries and responsive design
└── footer.css         # Credits and GitHub link
```

## Component Breakdown

### variables.css
- **Purpose**: Central location for design tokens and base styles
- **Contains**: CSS custom properties, Material Design color palette, elevation shadows, typography, body styles
- **Benefits**: Easy theme customization, consistent design tokens

### controls.css
- **Purpose**: Game control buttons styling
- **Contains**: Control button layout, hover effects, disabled states, sound button styles
- **Components**: `.control-buttons`, `.control-btn`, `.sound-button`

### layout.css
- **Purpose**: Main game layout and structure
- **Contains**: Game container, header, score panel, game board layout, game over modal
- **Components**: `.game-container`, `.game-header`, `.score-panel`, `.game-board`, `.game-over`

### game-canvas.css
- **Purpose**: Game canvas and character animations
- **Contains**: Canvas styling, character area, escape track, all character animations
- **Components**: `.main-game-area`, `#tetris-canvas`, `.character-area`, `.character` + animations

### panels.css
- **Purpose**: Left and right side panels
- **Contains**: Piece statistics, stage info, next piece preview, inventory, controls guide
- **Components**: `.left-panel`, `.side-panel`, `.piece-stats`, `.stage-info`, `.next-piece`, `.inventory`, `.controls`

### modals.css
- **Purpose**: Modal dialogs and store interface
- **Contains**: Modal overlay, store content, store items, achievements, buttons
- **Components**: `.modal-overlay`, `.store-content`, `.store-item`, `.achievement-item`

### responsive.css
- **Purpose**: Responsive design and mobile adaptations
- **Contains**: Media queries for different screen sizes, mobile-first approach
- **Breakpoints**: 1024px, 768px, 600px, 450px

### footer.css
- **Purpose**: Page footer elements
- **Contains**: Credits and GitHub link positioning and styling
- **Components**: `.credits`, `.github-link`

## Usage

The CSS is automatically loaded through the main entry point:

```html
<link rel="stylesheet" href="styles/main.css">
```

## Benefits of This Architecture

1. **Maintainability**: Each component has its own file, making it easier to find and modify specific styles
2. **Modularity**: Components can be developed and tested independently
3. **Reusability**: Component styles can be easily reused across different parts of the application
4. **Performance**: CSS files can be loaded selectively if needed in the future
5. **Team Collaboration**: Multiple developers can work on different components without conflicts
6. **Debugging**: Easier to identify which file contains specific styles
7. **Organization**: Logical separation of concerns following component boundaries

## Development Guidelines

- **Variables First**: Always use CSS custom properties from `variables.css` instead of hardcoded values
- **Component Isolation**: Keep component styles self-contained within their respective files
- **Responsive Design**: Add responsive rules to `responsive.css` rather than inline in component files
- **Naming Convention**: Follow BEM methodology and existing class naming patterns
- **Performance**: Consider the cascade order when adding new imports to `main.css`

## Migration Notes

- All styles have been preserved from the original `styles.css`
- No functionality has been changed, only organization
- The import order in `main.css` follows dependency requirements
- CSS custom properties ensure consistent theming across all components
