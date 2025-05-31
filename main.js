import TetrisGame from './tetris-game.js';

// Sound Manager Class has been moved to sound-manager.js
// PowerUpLogic Class has been moved to powerup-logic.js
// TetrisGame Class has been moved to tetris-game.js

document.addEventListener('DOMContentLoaded', () => {
    // Ensure the global tetrisGame instance is created and accessible if needed by inline HTML event handlers
    window.tetrisGame = new TetrisGame(); 
});
