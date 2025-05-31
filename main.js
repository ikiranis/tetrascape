import TetrascapeGame from './TetrascapeGame.js';

// Sound Manager Class has been moved to sound-manager.js
// PowerUpLogic Class has been moved to powerup-logic.js
// TetrascapeGame Class has been moved to TetrascapeGame.js

document.addEventListener('DOMContentLoaded', () => {
    // Ensure the global tetrisGame instance is created and accessible if needed by inline HTML event handlers
    window.tetrisGame = new TetrascapeGame(); 
});
