import TetrascapeGame from './TetrascapeGame.js';
import LoadingManager from './LoadingManager.js';

/**
 * Main entry point for the Tetrascape game application
 * Initializes the game instance when the DOM is fully loaded
 */

/**
 * Initialize the game when DOM content is loaded
 * Creates a global tetrisGame instance for accessibility from HTML event handlers
 */
document.addEventListener('DOMContentLoaded', async () => {
    const loadingManager = new LoadingManager();
    
    try {
        // Initialize loading with total steps
        loadingManager.initialize(6);
        
        // Step 1: Create game instance
        loadingManager.nextStep('Initializing game engine...');
        const game = new TetrascapeGame();
        await new Promise(resolve => setTimeout(resolve, 400)); // Small delay for visual feedback
        
        // Step 2: Initialize managers
        loadingManager.nextStep('Loading sound and control systems...');
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Step 3: Load UI templates
        loadingManager.nextStep('Loading UI templates...');
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Step 4: Initialize game UI and canvas
        loadingManager.nextStep('Setting up game interface...');
        await game.initializeGameUI();
        
        // Initialize piece statistics display with zero values
        await game.updatePieceStatsDisplay();
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Step 5: Initialize game state
        loadingManager.nextStep('Preparing game components...');
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Step 6: Finalize setup
        loadingManager.nextStep('Finalizing setup...');
        
        // Make it available globally if needed by inline HTML event handlers
        window.tetrisGame = game;
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Complete loading
        loadingManager.complete('Ready to play!');
        
        console.log('Tetrascape game fully initialized and ready');
        
    } catch (error) {
        console.error('Failed to initialize Tetrascape game:', error);
        loadingManager.showError('Failed to load game. Please refresh and try again.');
        
        // Hide loading screen after error display
        setTimeout(() => {
            loadingManager.hide();
        }, 3000);
    }
});
