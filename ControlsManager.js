/**
 * ControlsManager - Handles all input controls for the Tetrascape game
 * Manages keyboard and button event listeners, input processing, and control bindings
 */
class ControlsManager {
    /**
     * Initialize the ControlsManager with game instance reference
     * @param {TetrascapeGame} game - Reference to the main game instance
     */
    constructor(game) {
        this.game = game;
        this.setupEventListeners();
        this.setupControls();
    }

    /**
     * Set up keyboard event listeners for game controls
     * Binds keydown events to the handleKeyPress method
     */
    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    /**
     * Set up click event listeners for UI buttons
     * Binds start, pause, restart, and sound toggle buttons to their respective methods
     */
    setupControls() {
        document.getElementById('start-button').addEventListener('click', () => this.game.startGame());
        document.getElementById('pause-button').addEventListener('click', () => this.game.togglePause());
        document.getElementById('restart-button').addEventListener('click', () => this.game.restartGame());
        document.getElementById('sound-toggle').addEventListener('click', () => this.toggleSound());
    }

    /**
     * Handle keyboard input for game controls
     * Processes arrow keys, space, shift, and number keys for movement and power-ups
     * @param {KeyboardEvent} e - The keyboard event object
     */
    handleKeyPress(e) {
        if (!this.game.gameRunning || this.game.gamePaused || this.game.isAnimatingLineClear) return;
        
        switch(e.code) {
            case 'ArrowLeft':
                e.preventDefault();
                this.game.movePiece(-1, 0);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.game.movePiece(1, 0);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.game.softDrop();
                break;
            case 'Space':
                e.preventDefault();
                this.game.rotatePiece();
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                e.preventDefault();
                this.game.hardDrop();
                break;
            case 'KeyP':
                e.preventDefault();
                this.game.togglePause();
                break;
            // Power-up keys
            case 'Digit1':
                e.preventDefault();
                this.game.usePowerup('dynamite');
                break;
            case 'Digit2':
                e.preventDefault();
                this.game.usePowerup('shovel');
                break;
            case 'Digit3':
                e.preventDefault();
                this.game.usePowerup('trade');
                break;
            case 'Digit4':
                e.preventDefault();
                this.game.usePowerup('slow');
                break;
        }
    }

    /**
     * Toggle sound on/off and update the UI button appearance
     * Changes button text and styling to reflect current sound state
     */
    toggleSound() {
        this.game.soundManager.enabled = !this.game.soundManager.enabled;
        const button = document.getElementById('sound-toggle');
        if (this.game.soundManager.enabled) {
            button.textContent = '🔊';
            button.title = 'Sound ON - Click to mute';
            button.classList.remove('muted');
        } else {
            button.textContent = '🔇';
            button.title = 'Sound OFF - Click to enable';
            button.classList.add('muted');
        }
    }

    /**
     * Remove all event listeners (cleanup method)
     * Should be called when destroying the game instance
     */
    cleanup() {
        // Note: In a more complex implementation, you might want to store
        // references to the event listeners to properly remove them
        // For now, this is a placeholder for potential cleanup logic
    }
}

export default ControlsManager;
