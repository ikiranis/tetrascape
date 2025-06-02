import TetrascapeGame from './TetrascapeGame.js';

/**
 * Main entry point for the Tetrascape game application
 * Initializes the game instance when the DOM is fully loaded
 */

/**
 * Initialize the game when DOM content is loaded
 * Creates a global tetrisGame instance for accessibility from HTML event handlers
 */
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Create the game instance
        const game = new TetrascapeGame(); 
        
        // Wait for the game to be fully initialized
        await game.initializeGameUI();
        
        // Make it available globally if needed by inline HTML event handlers
        window.tetrisGame = game;
        
        console.log('Tetrascape game fully initialized and ready');
    } catch (error) {
        console.error('Failed to initialize Tetrascape game:', error);
    }
});
