class PowerUpLogic {
    constructor(soundManager, animationTrigger) {
        this.soundManager = soundManager;
        this.triggerAnimation = animationTrigger; // callback: (type) => void
    }

    // Activates a powerup (plays sounds, triggers animation via callback).
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

    // Applies the effect of Dynamite power-up.
    // board: The game board array.
    // pieceContext: { shape, x, y } of the piece that was just placed.
    // BOARD_WIDTH, BOARD_HEIGHT: Dimensions of the board.
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

    // Applies the effect of Shovel power-up.
    // board: The game board array.
    // currentPiece: The current Tetris piece being controlled.
    // BOARD_HEIGHT, BOARD_WIDTH: Dimensions of the board.
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
