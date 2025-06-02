import TetrascapeGame from './TetrascapeGame.js';

/**
 * Main entry point for the Tetrascape game application
 * Initializes the game instance when the DOM is fully loaded
 */

/**
 * Initialize the game when DOM content is loaded
 * Creates a global tetrisGame instance for accessibility from HTML event handlers
 */
document.addEventListener('DOMContentLoaded', () => {
    // Ensure the global tetrisGame instance is created and accessible if needed by inline HTML event handlers
    window.tetrisGame = new TetrascapeGame(); 
});
