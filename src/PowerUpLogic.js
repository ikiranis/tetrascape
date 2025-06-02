/**
 * PowerUpLogic - Handles power-up effects and animations
 * Manages the activation and application of various power-ups in the game
 */
class PowerUpLogic {
    /**
     * Initialize PowerUpLogic with sound manager and animation callback
     * @param {SoundManager} soundManager - Instance for playing power-up sounds
     * @param {Function} animationTrigger - Callback function to trigger character animations
     */
    constructor(soundManager, animationTrigger) {
        this.soundManager = soundManager;
        this.triggerAnimation = animationTrigger; // callback: (type) => void
    }

    /**
     * Activate a power-up with sound and animation effects
     * Plays generic power-up sound, triggers character animation, and plays specific sound
     * @param {string} type - Type of power-up to activate ('dynamite', 'shovel', 'trade', 'slow')
     */
    activate(type) {
        this.soundManager.playPowerup(); // Generic powerup sound
        this.triggerAnimation(type);     // Trigger associated animation
        
        // Play specific sound for the powerup type
        switch(type) {
            case 'dynamite': this.soundManager.playExplosion(); break;
            case 'shovel': this.soundManager.playDig(); break;
            case 'trade': this.soundManager.playTrade(); break;
            case 'slow': this.soundManager.playSlow(); break;
        }
    }

    /**
     * Apply the dynamite power-up effect to the game board
     * Creates explosion centers at piece locations and clears 3x3 areas around each center
     * @param {Array[]} board - 2D array representing the game board
     * @param {Object} pieceContext - Object containing shape, x, y of the placed piece
     * @param {number} BOARD_WIDTH - Width of the game board
     * @param {number} BOARD_HEIGHT - Height of the game board
     */
    applyDynamiteEffect(board, pieceContext, BOARD_WIDTH, BOARD_HEIGHT) {
        const explosionCenters = [];
        for (let r = 0; r < pieceContext.shape.length; r++) {
            for (let c = 0; c < pieceContext.shape[r].length; c++) {
                if (pieceContext.shape[r][c] !== 0) {
                    const boardX = pieceContext.x + c;
                    const boardY = pieceContext.y + r;
                    // Ensure the block is within the board before considering it an explosion center
                    if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >=0 && boardX < BOARD_WIDTH) {
                        explosionCenters.push({ x: boardX, y: boardY });
                    }
                }
            }
        }

        explosionCenters.forEach(center => {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const explodeX = center.x + dx;
                    const explodeY = center.y + dy;
                    
                    if (explodeX >= 0 && explodeX < BOARD_WIDTH && 
                        explodeY >= 0 && explodeY < BOARD_HEIGHT) {
                        board[explodeY][explodeX] = 0;
                    }
                }
            }
        });
    }

    /**
     * Apply the shovel power-up effect to the game board
     * Clears an entire vertical column at the center of the current piece
     * @param {Array[]} board - 2D array representing the game board
     * @param {Object} currentPiece - Current piece object with shape and position
     * @param {number} BOARD_HEIGHT - Height of the game board
     * @param {number} BOARD_WIDTH - Width of the game board
     */
    applyShovelEffect(board, currentPiece, BOARD_HEIGHT, BOARD_WIDTH) {
        if (!currentPiece || !currentPiece.shape || !currentPiece.shape[0]) return; // Safety check
        const centerX = currentPiece.x + Math.floor(currentPiece.shape[0].length / 2);
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            if (centerX >= 0 && centerX < BOARD_WIDTH) {
                board[y][centerX] = 0;
            }
        }
    }
}

export default PowerUpLogic;
