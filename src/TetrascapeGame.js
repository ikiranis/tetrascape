import SoundManager from './SoundManager.js';
import PowerUpLogic from './PowerUpLogic.js';
import ControlsManager from './ControlsManager.js';
import StoreManager from './StoreManager.js';

/**
 * TetrascapeGame - A Tetris-based escape room game
 * Players must reach score goals within time and block limits to progress through levels
 */
class TetrascapeGame {
    /**
     * Initialize the TetrascapeGame with all required properties and setup
     * Sets up canvas contexts, sound management, game state, and power-up systems
     */
    constructor() {
        this.canvas = document.getElementById('tetris-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById('next-canvas');
        this.nextCtx = this.nextCanvas.getContext('2d');
        
        // Initialize sound manager
        this.soundManager = new SoundManager();
        
        this.BOARD_WIDTH = 10;
        this.BOARD_HEIGHT = 20;
        this.BLOCK_SIZE = 30;
        
        this.board = [];
        this.currentPiece = null;
        this.nextPiece = null;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.dropTime = 0;
        this.dropInterval = 1000; // milliseconds
        this.gameRunning = false;
        this.gamePaused = false;
        
        // Escape Game Features
        this.currentLevel = 1;
        this.totalMoney = 0;
        this.levelGoals = {};
        this.timeLimit = 0;
        this.levelStartTime = 0;
        this.maxBlocks = 0;
        this.blocksUsed = 0;
        this.stageCompleted = false;
        
        // Timer interval for live time updates
        this.timerInterval = null;
        
        // Character system - no longer drawn on canvas
        this.characterElement = document.getElementById('character');
        this.characterState = 'waiting'; // waiting, working, escaping
        this.characterProgress = 0; // 0-100% progress towards goal
        
        // Power-ups inventory - start with 5 of each in first stage
        this.inventory = {
            dynamite: 5,
            shovel: 5,
            trade: 5,
            slow: 5
        };
        
        this.activePowerups = {
            slowActive: false,
            slowTimeLeft: 0
        };
        
        // Piece statistics tracking
        this.pieceStats = {
            I: 0, O: 0, T: 0, S: 0, Z: 0, J: 0, L: 0
        };
        this.totalPieces = 0;
        
        // Animation state tracking
        this.isAnimatingLineClear = false;
        
        this.colors = [
            '#000000', // Empty
            '#ff0000', // I-piece (Red)
            '#00ff00', // O-piece (Green)
            '#0000ff', // T-piece (Blue)
            '#ffff00', // S-piece (Yellow)
            '#ff00ff', // Z-piece (Magenta)
            '#00ffff', // J-piece (Cyan)
            '#ffa500'  // L-piece (Orange)
        ];
        
        this.pieces = {
            I: { shape: [[1,1,1,1]], color: 1 },
            O: { shape: [[2,2],[2,2]], color: 2 },
            T: { shape: [[0,3,0],[3,3,3]], color: 3 },
            S: { shape: [[0,4,4],[4,4,0]], color: 4 },
            Z: { shape: [[5,5,0],[0,5,5]], color: 5 },
            J: { shape: [[6,0,0],[6,6,6]], color: 6 },
            L: { shape: [[0,0,7],[7,7,7]], color: 7 }
        };
        
        this.initBoard();
        // Initialize PowerUpLogic
        this.powerUpLogic = new PowerUpLogic(this.soundManager, this.triggerPowerupAnimation.bind(this));
        // Initialize ControlsManager
        this.controlsManager = new ControlsManager(this);
        // Initialize StoreManager
        this.storeManager = new StoreManager(this);
    }
    
    /**
     * Initialize the game board with empty cells
     * Creates a 2D array filled with zeros representing empty spaces
     */
    initBoard() {
        this.board = Array(this.BOARD_HEIGHT).fill().map(() => Array(this.BOARD_WIDTH).fill(0));
    }
    
    /**
     * Generate level goals based on current level
     * Sets score requirements, time limits, block limits, and rewards for each stage
     * Difficulty increases with each level
     */
    generateLevelGoals() {
        const stages = [
            { minScore: 500, timeLimit: 180, maxBlocks: 50, reward: 100 },
            { minScore: 1000, timeLimit: 150, maxBlocks: 45, reward: 150 },
            { minScore: 1500, timeLimit: 135, maxBlocks: 40, reward: 200 },
            { minScore: 2500, timeLimit: 120, maxBlocks: 35, reward: 300 },
            { minScore: 4000, timeLimit: 105, maxBlocks: 30, reward: 500 }
        ];
        
        const stageIndex = Math.min(this.currentLevel - 1, stages.length - 1);
        const stage = stages[stageIndex];
        
        this.levelGoals = {
            minScore: stage.minScore,
            timeLimit: stage.timeLimit,
            maxBlocks: stage.maxBlocks,
            reward: stage.reward
        };
        
        this.timeLimit = stage.timeLimit;
        this.maxBlocks = stage.maxBlocks;
        this.blocksUsed = 0;
        this.levelStartTime = Date.now();
    }
    
    /**
     * Check if the current stage has been completed or failed
     * Evaluates score goals, time remaining, and block usage
     * Triggers stage completion or failure accordingly
     */
    checkStageCompletion() {
        if (this.stageCompleted) return;
        
        const timeElapsed = Math.floor((Date.now() - this.levelStartTime) / 1000);
        const timeRemaining = this.timeLimit - timeElapsed;
        
        if (this.score >= this.levelGoals.minScore && timeRemaining > 0) {
            this.completeStage();
        } else if (timeRemaining <= 0 || this.blocksUsed >= this.maxBlocks) {
            this.failStage();
        }
    }
    
    /**
     * Handle successful stage completion
     * Stops the game, plays completion effects, calculates bonuses, and shows store
     * @param {number} earnedMoney - Total money earned from completing the stage
     */
    completeStage() {
        this.stageCompleted = true;
        this.gameRunning = false;
        this.stopTimerInterval(); // Stop timer when stage completes
        
        // Play stage complete sound
        this.soundManager.playStageComplete();
        
        // Trigger escape animation
        this.setCharacterState('escaping');
        if (this.characterElement) {
            this.characterElement.classList.add('escape-animation');
        }
        
        // Calculate bonus money
        const timeBonus = Math.max(0, this.timeLimit - Math.floor((Date.now() - this.levelStartTime) / 1000)) * 10;
        const blockBonus = Math.max(0, this.maxBlocks - this.blocksUsed) * 5;
        const totalEarned = this.levelGoals.reward + timeBonus + blockBonus;
        
        this.totalMoney += totalEarned;
        
        setTimeout(async () => {
            await this.storeManager.showStore(totalEarned);
        }, 3000); // Increased delay to 3 seconds
        
        // Play escape sound after a delay
        setTimeout(() => {
            this.soundManager.playEscape();
        }, 1000);
    }
    
    /**
     * Handle stage failure (time up, blocks exceeded, or piece collision)
     * Stops the game, plays game over sound, and shows game over screen
     */
    failStage() {
        this.gameRunning = false;
        this.stopTimerInterval(); // Stop timer when stage fails
        this.soundManager.playGameOver();
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('game-over').style.display = 'flex';
        document.getElementById('start-button').disabled = false;
        document.getElementById('pause-button').disabled = true;
        document.getElementById('restart-button').disabled = true;
    }
    
    
    
    
    
    /**
     * Update the inventory display in the UI
     * Shows current count of each power-up type in the inventory panel
     */
    updateInventoryDisplay() {
        const inventoryDiv = document.getElementById('inventory');
        if (inventoryDiv) {
            inventoryDiv.innerHTML = `
                <h4>Inventory:</h4>
                <p>💣: ${this.inventory.dynamite}</p>
                <p>🔨: ${this.inventory.shovel}</p>
                <p>🔄: ${this.inventory.trade}</p>
                <p>⏰: ${this.inventory.slow}</p>
            `;
        }
    }
    
    /**
     * Update the piece statistics display
     * Shows usage count and percentage for each Tetris piece type
     * Renders mini piece previews on individual canvases
     */
    updatePieceStatsDisplay() {
        const statsGrid = document.getElementById('stats-grid');
        if (!statsGrid) return;
        
        let html = '';
        Object.keys(this.pieceStats).forEach(piece => {
            const count = this.pieceStats[piece];
            const percentage = this.totalPieces > 0 ? ((count / this.totalPieces) * 100).toFixed(1) : '0.0';
            
            // Create unique canvas ID for each piece
            const canvasId = `piece-canvas-${piece}`;
            
            html += `
                <div class="stat-item">
                    <canvas id="${canvasId}" class="piece-canvas" width="60" height="60"></canvas>
                    <div class="stat-numbers">
                        <div class="stat-count">${count}</div>
                        <div class="stat-percent">${percentage}%</div>
                    </div>
                </div>
            `;
        });
        
        statsGrid.innerHTML = html;
        
        // Draw each piece on its canvas after DOM update
        requestAnimationFrame(() => {
            Object.keys(this.pieceStats).forEach(piece => {
                this.drawPieceOnCanvas(`piece-canvas-${piece}`, piece);
            });
        });
    }
    
    /**
     * Draw a specific piece type on a canvas for display purposes
     * Used in piece statistics display to show mini previews of each piece
     * @param {string} canvasId - ID of the canvas element to draw on
     * @param {string} pieceType - Type of piece to draw ('I', 'O', 'T', 'S', 'Z', 'J', 'L')
     */
    drawPieceOnCanvas(canvasId, pieceType) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const pieceData = this.pieces[pieceType];
        if (!pieceData) return;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calculate block size to fit the piece in the canvas
        const shape = pieceData.shape;
        const rows = shape.length;
        const cols = shape[0].length;
        const maxSize = Math.min(canvas.width / cols, canvas.height / rows);
        const blockSize = Math.floor(maxSize * 0.8); // Leave some padding
        
        // Calculate centering offset
        const offsetX = (canvas.width - (cols * blockSize)) / 2;
        const offsetY = (canvas.height - (rows * blockSize)) / 2;
        
        // Draw the piece
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (shape[row][col] !== 0) {
                    // Use the same glossy drawBlock method for consistency
                    this.drawBlock(ctx, col, row, this.colors[pieceData.color], blockSize, offsetX, offsetY, true);
                }
            }
        }
    }
    
    /**
     * Use a power-up from the inventory
     * Activates the power-up effect, plays sounds/animations, and updates inventory
     * @param {string} type - Type of power-up to use ('dynamite', 'shovel', 'trade', 'slow')
     */
    usePowerup(type) {
        if (this.inventory[type] <= 0) {
            this.soundManager.playError();
            return;
        }
        
        this.inventory[type]--;
        this.updateInventoryDisplay();

        this.powerUpLogic.activate(type); // Handles sounds and animations

        switch(type) {
            case 'dynamite':
                if (!this.currentPiece) return;
                
                // Drop the current piece
                while (this.movePiece(0, 1)) { /* empty */ }
                
                const pieceContextForExplosion = { 
                    shape: this.currentPiece.shape.map(r => [...r]), 
                    x: this.currentPiece.x, 
                    y: this.currentPiece.y 
                };

                this.placePiece(); // Places the piece and sets this.currentPiece to null
                
                this.powerUpLogic.applyDynamiteEffect(this.board, pieceContextForExplosion, this.BOARD_WIDTH, this.BOARD_HEIGHT);
                
                this.clearLines();
                
                this.currentPiece = this.nextPiece;
                this.nextPiece = this.getRandomPiece();
                this.blocksUsed++;
                this.updateDisplay();
                break;
            case 'shovel':
                if (!this.currentPiece) return;
                this.powerUpLogic.applyShovelEffect(this.board, this.currentPiece, this.BOARD_HEIGHT, this.BOARD_WIDTH);
                this.draw(); // Redraw to show cleared column
                break;
            case 'trade':
                this.currentPiece = this.getRandomPiece();
                this.updateDisplay();
                break;
            case 'slow':
                this.timeLimit += 10;
                this.updateDisplay(); // Or a more specific timer update if available
                break;
        }
    }
        
    /**
     * Update character progress based on current score relative to goal
     * Moves character position and updates character state (waiting/working/escaping)
     */
    updateCharacterProgress() {
        if (!this.levelGoals.minScore) return;
        
        // Calculate progress based on score relative to goal
        this.characterProgress = Math.min(100, (this.score / this.levelGoals.minScore) * 100);
        
        // Update character position (move from left to right)
        const maxDistance = 256; // Width of character area minus character width
        const newPosition = 10 + (this.characterProgress / 100) * maxDistance;
        
        if (this.characterElement) {
            this.characterElement.style.left = newPosition + 'px';
        }
        
        // Update character state based on progress
        if (this.characterProgress >= 100) {
            this.setCharacterState('escaping');
        } else if (this.characterProgress > 0) {
            this.setCharacterState('working');
        } else {
            this.setCharacterState('waiting');
        }
    }
    
    /**
     * Set the character's visual state and update display
     * @param {string} state - Character state ('waiting', 'working', 'escaping')
     */
    setCharacterState(state) {
        if (this.characterState === state) return;
        
        this.characterState = state;
        if (this.characterElement) {
            this.characterElement.className = 'character ' + state;
        }
        this.renderCharacter(); // Add this line to update the emoji
    }
    
    /**
     * Trigger a power-up animation on the character
     * Adds CSS animation classes and automatically removes them after completion
     * @param {string} type - Type of power-up animation to trigger
     */
    triggerPowerupAnimation(type) {
        if (!this.characterElement) return;
        
        // Remove any existing animation classes
        this.characterElement.classList.remove('dynamite-animation', 'shovel-animation', 'trade-animation', 'slow-animation');
        
        // Add the specific animation class
        this.characterElement.classList.add(type + '-animation');
        
        // Update character display immediately
        this.renderCharacter();
        
        // Remove animation class after animation completes
        setTimeout(() => {
            if (this.characterElement) {
                this.characterElement.classList.remove(type + '-animation');
                this.renderCharacter(); // Reset to normal emoji
            }
        }, type === 'shovel' ? 1500 : 1000);
    }
    
    /**
     * Render the character emoji based on current state and active animations
     * Updates character element innerHTML with appropriate emoji
     */
    renderCharacter() {
        if (!this.characterElement) return;
        
        // Set character emoji based on state and animations
        let characterEmoji = '👤';
        
        // Check for active power-up animations
        if (this.characterElement.classList.contains('dynamite-animation')) {
            characterEmoji = '💣🧨'; // Throwing dynamite at wall
        } else if (this.characterElement.classList.contains('shovel-animation')) {
            characterEmoji = '⛏️🕳️'; // Digging with shovel
        } else if (this.characterElement.classList.contains('trade-animation')) {
            characterEmoji = '🤝💱'; // Trading/exchanging
        } else if (this.characterElement.classList.contains('slow-animation')) {
            characterEmoji = '⏰✨'; // Time extension effect
        } else {
            // Normal state-based emojis
            switch(this.characterState) {
                case 'waiting':
                    characterEmoji = '🧍‍♂️';
                    break;
                case 'working':
                    characterEmoji = '🏃‍♂️';
                    break;
                case 'escaping':
                    characterEmoji = '🏃‍♂️💨';
                    break;
            }
        }
        
        this.characterElement.innerHTML = characterEmoji;
    }
    
    /**
     * Generate a random Tetris piece
     * Selects randomly from available piece types, tracks statistics, and awards points
     * @returns {Object} New piece object with shape, color, and starting position
     */
    getRandomPiece() {
        const pieceKeys = Object.keys(this.pieces);
        const randomKey = pieceKeys[Math.floor(Math.random() * pieceKeys.length)];
        const piece = this.pieces[randomKey];
        
        // Track piece statistics
        this.pieceStats[randomKey]++;
        this.totalPieces++;
        this.updatePieceStatsDisplay();
        
        // Add 1 point for new piece spawn
        this.score += 1;
        
        return {
            shape: piece.shape.map(row => [...row]),
            color: piece.color,
            x: Math.floor(this.BOARD_WIDTH / 2) - Math.floor(piece.shape[0].length / 2),
            y: 0
        };
    }
    
    /**
     * Start a new game or restart the current level
     * Initializes all game state, generates goals, sets up UI, and begins game loop
     */
    startGame() {
        this.gameRunning = true;
        this.gamePaused = false;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.dropInterval = 1000;
        this.stageCompleted = false;
        this.characterProgress = 0;
        this.initBoard();
        
        // Reset piece statistics for new stage
        this.pieceStats = {
            I: 0, O: 0, T: 0, S: 0, Z: 0, J: 0, L: 0
        };
        this.totalPieces = 0;
        
        // Reset inventory for stage 1 only
        if (this.currentLevel === 1) {
            this.inventory = {
                dynamite: 5,
                shovel: 5,
                trade: 5,
                slow: 5
            };
        }
        
        // Generate stage goals
        this.generateLevelGoals();
        
        // Start timer interval for live time updates
        this.startTimerInterval();
        
        // Initialize character
        this.setCharacterState('waiting');
        this.updateCharacterProgress();
        this.renderCharacter();
        
        this.currentPiece = this.getRandomPiece();
        this.nextPiece = this.getRandomPiece();
        
        document.getElementById('start-button').disabled = true;
        document.getElementById('pause-button').disabled = false;
        document.getElementById('restart-button').disabled = false;
        document.getElementById('game-over').style.display = 'none';
        
        this.updateDisplay();
        this.updatePieceStatsDisplay();
        this.gameLoop();
    }
    
    /**
     * Toggle game pause state
     * Pauses/resumes game loop, timer, and updates pause button appearance
     */
    togglePause() {
        if (!this.gameRunning) return;
        
        this.gamePaused = !this.gamePaused;
        const pauseButton = document.getElementById('pause-button');
        if (this.gamePaused) {
            pauseButton.textContent = '▶️';
            pauseButton.title = 'Resume';
            // Stop timer interval when paused
            this.stopTimerInterval();
        } else {
            pauseButton.textContent = '⏸️';
            pauseButton.title = 'Pause';
            // Resume timer interval when unpaused
            this.startTimerInterval();
        }
        
        if (!this.gamePaused) {
            this.gameLoop();
        }
    }
    
    /**
     * Restart the current game level
     * Stops current game and starts fresh from the beginning of the current level
     */
    restartGame() {
        this.gameRunning = false;
        this.gamePaused = false;
        this.startGame();
    }
    
    /**
     * Main game loop that runs continuously during gameplay
     * Handles piece dropping, power-up timers, stage completion checks, and rendering
     * Uses requestAnimationFrame for smooth 60fps gameplay
     */
    gameLoop() {
        if (!this.gameRunning || this.gamePaused || this.isAnimatingLineClear) return;
        
        const now = Date.now();
        
        // Handle slow powerup
        if (this.activePowerups.slowActive) {
            this.activePowerups.slowTimeLeft -= 16; // Roughly 60fps
            if (this.activePowerups.slowTimeLeft <= 0) {
                this.activePowerups.slowActive = false;
                this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
            }
        }
        
        if (now - this.dropTime > this.dropInterval) {
            this.softDrop(); // Changed from this.dropPiece()
            this.dropTime = now;
        }
        
        // Check stage completion
        this.checkStageCompletion();
        
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    /**
     * Move the current piece by the specified offset
     * Validates the move before applying and plays appropriate sound effects
     * @param {number} dx - Horizontal movement offset (-1 for left, 1 for right, 0 for no movement)
     * @param {number} dy - Vertical movement offset (1 for down, 0 for no movement)
     * @returns {boolean} True if the move was successful, false if blocked
     */
    movePiece(dx, dy) {
        if (this.isValidMove(this.currentPiece.x + dx, this.currentPiece.y + dy, this.currentPiece.shape)) {
            this.currentPiece.x += dx;
            this.currentPiece.y += dy;
            
            // Play move sound only for horizontal movement
            if (dx !== 0) {
                this.soundManager.playMove();
            }
            
            return true;
        }
        return false;
    }
    
    /**
     * Perform a soft drop (move piece down one row)
     * If movement fails, places the piece on the board
     */
    softDrop() {
        if (this.movePiece(0, 1)) {
            this.soundManager.playSoftDrop();
            this.updateDisplay();
        } else {
            this.placePiece();
        }
    }
    
    /**
     * Perform a hard drop (instantly drop piece to bottom)
     * Awards points based on distance dropped and immediately places piece
     */
    hardDrop() {
        let cellsDropped = 0;
        while (this.isValidMove(this.currentPiece.x, this.currentPiece.y + 1, this.currentPiece.shape)) {
            this.currentPiece.y++;
            cellsDropped++;
        }
        this.score += cellsDropped * 2; // Score for hard drop
        this.soundManager.playHardDrop();
        this.placePiece();
    }
    
    /**
     * Rotate the current piece 90 degrees clockwise
     * Includes wall kick logic to handle rotation near boundaries
     * Supports both square and rectangular piece shapes
     */
    rotatePiece() {
        const originalShape = this.currentPiece.shape.map(row => [...row]);
        const N = this.currentPiece.shape.length;
        const M = this.currentPiece.shape[0].length;
        
        // Create a new shape with swapped dimensions for non-square pieces
        const newShape = Array(M).fill(null).map(() => Array(N).fill(0));
        
        for (let r = 0; r < N; r++) {
            for (let c = 0; c < M; c++) {
                newShape[c][N - 1 - r] = this.currentPiece.shape[r][c];
            }
        }
        
        if (this.isValidMove(this.currentPiece.x, this.currentPiece.y, newShape)) {
            this.currentPiece.shape = newShape;
            this.soundManager.playRotate();
        } else {
            // Try wall kick (basic version: move left/right by 1)
            if (this.isValidMove(this.currentPiece.x + 1, this.currentPiece.y, newShape)) {
                this.currentPiece.x += 1;
                this.currentPiece.shape = newShape;
                this.soundManager.playRotate();
            } else if (this.isValidMove(this.currentPiece.x - 1, this.currentPiece.y, newShape)) {
                this.currentPiece.x -= 1;
                this.currentPiece.shape = newShape;
                this.soundManager.playRotate();
            } else if (this.isValidMove(this.currentPiece.x + 2, this.currentPiece.y, newShape)) { // For I-piece
                this.currentPiece.x += 2;
                this.currentPiece.shape = newShape;
                this.soundManager.playRotate();
            } else if (this.isValidMove(this.currentPiece.x - 2, this.currentPiece.y, newShape)) { // For I-piece
                this.currentPiece.x -= 2;
                this.currentPiece.shape = newShape;
                this.soundManager.playRotate();
            }
        }
    }
    
    /**
     * Check if a move is valid (no collisions or boundary violations)
     * Tests piece placement against board boundaries and existing blocks
     * @param {number} x - X position to test
     * @param {number} y - Y position to test  
     * @param {Array[]} shape - 2D array representing the piece shape
     * @returns {boolean} True if the move is valid, false if blocked
     */
    isValidMove(x, y, shape) {
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c] !== 0) {
                    const boardX = x + c;
                    const boardY = y + r;
                    
                    if (boardX < 0 || boardX >= this.BOARD_WIDTH || boardY >= this.BOARD_HEIGHT) {
                        return false; // Out of bounds (bottom collision handled by board check)
                    }
                    if (boardY >= 0 && this.board[boardY][boardX] !== 0) {
                        return false; // Collision with existing piece
                    }
                }
            }
        }
        return true;
    }
    
    /**
     * Place the current piece permanently on the board
     * Adds piece blocks to board, clears completed lines, and spawns next piece
     * Checks for game over condition if new piece cannot be placed
     */
    placePiece() {
        for (let r = 0; r < this.currentPiece.shape.length; r++) {
            for (let c = 0; c < this.currentPiece.shape[r].length; c++) {
                if (this.currentPiece.shape[r][c] !== 0) {
                    const boardX = this.currentPiece.x + c;
                    const boardY = this.currentPiece.y + r;
                    if (boardY >= 0) { // Ensure piece is within board vertically
                        this.board[boardY][boardX] = this.currentPiece.color;
                    }
                }
            }
        }
        
        this.soundManager.playDrop();
        this.clearLines();
        
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.getRandomPiece();
        this.blocksUsed++;
        
        if (!this.isValidMove(this.currentPiece.x, this.currentPiece.y, this.currentPiece.shape)) {
            this.failStage(); // Game over if new piece immediately collides
        }
        
        this.updateDisplay();
        this.updateCharacterProgress();
    }
    
    /**
     * Check for and clear completed horizontal lines
     * Initiates block pop animations for visual feedback before line removal
     */
    clearLines() {
        // Find completed lines
        const completedLines = [];
        for (let r = this.BOARD_HEIGHT - 1; r >= 0; r--) {
            if (this.board[r].every(cell => cell !== 0)) {
                completedLines.push(r);
            }
        }
        
        if (completedLines.length > 0) {
            // Temporarily disable game input during animation
            this.isAnimatingLineClear = true;
            
            // Play initial line clear sound
            this.soundManager.playLineClearStart();
            
            // Create block pop animations for each completed line
            this.animateBlockPops(completedLines, () => {
                // This callback runs after all blocks have popped
                this.finalizeLinesClearing(completedLines);
            });
        }
    }

    /**
     * Animate individual block pops for completed lines
     * Creates DOM elements with CSS animations for each block in completed lines
     * @param {number[]} completedLines - Array of row indices that are completed
     * @param {Function} onComplete - Callback function to execute when animations finish
     */
    animateBlockPops(completedLines, onComplete) {
        const allBlocks = [];
        
        // Collect all blocks that need to pop from all completed lines
        completedLines.forEach(row => {
            for (let col = 0; col < this.BOARD_WIDTH; col++) {
                if (this.board[row][col] !== 0) {
                    allBlocks.push({
                        row: row,
                        col: col,
                        color: this.board[row][col],
                        originalColor: this.colors[this.board[row][col]]
                    });
                }
            }
        });

        // Create animated blocks using DOM elements for CSS animations
        const animatedBlocks = [];
        allBlocks.forEach((block, index) => {
            const blockElement = document.createElement('div');
            blockElement.style.position = 'absolute';
            blockElement.style.width = this.BLOCK_SIZE + 'px';
            blockElement.style.height = this.BLOCK_SIZE + 'px';
            blockElement.style.backgroundColor = block.originalColor;
            blockElement.style.left = (block.col * this.BLOCK_SIZE) + 'px';
            blockElement.style.top = (block.row * this.BLOCK_SIZE) + 'px';
            blockElement.style.zIndex = '1000';
            blockElement.style.pointerEvents = 'none';
            blockElement.style.border = '1px solid rgba(255, 255, 255, 0.3)';
            blockElement.style.borderRadius = '2px';
            blockElement.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.2)';
            blockElement.style.transition = 'background-color 0.1s ease';
            
            // Position relative to canvas
            const canvasRect = this.canvas.getBoundingClientRect();
            blockElement.style.position = 'fixed';
            blockElement.style.left = (canvasRect.left + block.col * this.BLOCK_SIZE) + 'px';
            blockElement.style.top = (canvasRect.top + block.row * this.BLOCK_SIZE) + 'px';
            
            document.body.appendChild(blockElement);
            animatedBlocks.push(blockElement);
            
            // Schedule the pop animation with staggered timing
            setTimeout(() => {
                blockElement.classList.add('block-pop');
                this.soundManager.playBlockPop();
                
                // Remove the block element after animation completes
                setTimeout(() => {
                    if (blockElement.parentNode) {
                        blockElement.parentNode.removeChild(blockElement);
                    }
                }, 400); // Duration of pop animation
                
            }, index * 50); // Stagger each block by 50ms
        });

        // Remove blocks from the board immediately (they're now animated separately)
        completedLines.forEach(row => {
            for (let col = 0; col < this.BOARD_WIDTH; col++) {
                this.board[row][col] = 0;
            }
        });

        // Call the completion callback after all animations finish
        const totalAnimationTime = allBlocks.length * 50 + 400; // Stagger time + animation duration
        setTimeout(() => {
            this.soundManager.playLineClearComplete();
            onComplete();
        }, totalAnimationTime);
    }

    /**
     * Finalize line clearing after animations complete
     * Removes completed lines, applies gravity, updates score, and adds time bonuses
     * @param {number[]} completedLines - Array of row indices that were completed
     */
    finalizeLinesClearing(completedLines) {
        const linesCleared = completedLines.length;
        
        // Remove the completed lines properly to simulate gravity
        completedLines.sort((a, b) => b - a); // Sort in descending order to remove from bottom up
        
        // Create a new board by filtering out completed lines
        const newBoard = [];
        for (let row = 0; row < this.BOARD_HEIGHT; row++) {
            if (!completedLines.includes(row)) {
                newBoard.push([...this.board[row]]); // Copy the row
            }
        }
        
        // Add empty lines at the top for the number of lines cleared
        while (newBoard.length < this.BOARD_HEIGHT) {
            newBoard.unshift(Array(this.BOARD_WIDTH).fill(0));
        }
        
        // Replace the board with the new one
        this.board = newBoard;

        // Play falling sound when lines above start falling down
        if (linesCleared > 0) {
            this.soundManager.playFalling();
            
            // Play crash sound after falling sound completes
            setTimeout(() => {
                this.soundManager.playCrash();
            }, 600); // Duration of falling sound
        }
        
        // Update game state
        this.lines += linesCleared;
        if (linesCleared === 1) this.score += 100;
        else if (linesCleared === 2) this.score += 300;
        else if (linesCleared === 3) this.score += 500;
        else if (linesCleared >= 4) this.score += 800; // Tetris
        
        // Play special Tetris sound for 4+ lines
        if (linesCleared >= 4) {
            setTimeout(() => {
                this.soundManager.playTetris();
            }, 200); // Slight delay after the completion sound
        }
        
        // Add time bonus for line clears
        if (linesCleared > 0) {
            let timeBonus = linesCleared * 2; // 2 seconds per line
            
            // Double bonus for Tetris (4+ lines)
            if (linesCleared >= 4) {
                timeBonus *= 2; // 2 sec * 4 lines * 2 = 16 seconds
            }
            
            this.timeLimit += timeBonus;
            
            // Update timer display to reflect the added time
            this.updateTimerDisplay();
        }
        
        // Increase level every 10 lines
        if (this.lines >= this.level * 10) {
            this.level++;
            this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
        }
        
        // Re-enable game input
        this.isAnimatingLineClear = false;
        
        this.updateDisplay();
        
        // Restart the game loop if it was paused due to animation
        if (this.gameRunning && !this.gamePaused) {
            this.gameLoop();
        }
    }
    
    /**
     * Main rendering method that draws the entire game state
     * Renders board blocks, current piece, and next piece preview
     * Called every frame during the game loop
     */
    draw() {
        // Clear main canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#1a1a2e'; // Dark blue-purple background
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw board with glassmorphism effect for blocks
        for (let r = 0; r < this.BOARD_HEIGHT; r++) {
            for (let c = 0; c < this.BOARD_WIDTH; c++) {
                if (this.board[r][c] !== 0) {
                    this.drawBlock(this.ctx, c, r, this.colors[this.board[r][c]]);
                }
            }
        }
        
        // Draw current piece with glassmorphism effect
        if (this.currentPiece) {
            for (let r = 0; r < this.currentPiece.shape.length; r++) {
                for (let c = 0; c < this.currentPiece.shape[r].length; c++) {
                    if (this.currentPiece.shape[r][c] !== 0) {
                        this.drawBlock(this.ctx, this.currentPiece.x + c, this.currentPiece.y + r, this.colors[this.currentPiece.color]);
                    }
                }
            }
        }
        
        // Draw next piece on next canvas
        this.nextCtx.clearRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        this.nextCtx.fillStyle = '#1a1a2e';
        this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        
        if (this.nextPiece) {
            const piece = this.nextPiece;
            const shape = piece.shape;
            const color = this.colors[piece.color];
            const blockSize = this.nextCanvas.width / 4; // Assuming next piece area is 4x4 blocks
            
            const pieceWidth = shape[0].length * blockSize;
            const pieceHeight = shape.length * blockSize;
            const offsetX = (this.nextCanvas.width - pieceWidth) / 2;
            const offsetY = (this.nextCanvas.height - pieceHeight) / 2;
            
            for (let r = 0; r < shape.length; r++) {
                for (let c = 0; c < shape[r].length; c++) {
                    if (shape[r][c] !== 0) {
                        this.drawBlock(this.nextCtx, c, r, color, blockSize, offsetX, offsetY, true);
                    }
                }
            }
        }
    }
    
    /**
     * Draw a single block with glassmorphism visual effects
     * Creates glossy gradients, highlights, shadows, and subtle borders
     * @param {CanvasRenderingContext2D} context - Canvas context to draw on
     * @param {number} x - Block X coordinate
     * @param {number} y - Block Y coordinate  
     * @param {string} color - Hex color code for the block
     * @param {number} blockSize - Size of the block in pixels (default: BLOCK_SIZE)
     * @param {number} offsetX - X offset for positioning (default: 0)
     * @param {number} offsetY - Y offset for positioning (default: 0)
     * @param {boolean} isNextPiece - Whether this is for next piece preview (default: false)
     */
    drawBlock(context, x, y, color, blockSize = this.BLOCK_SIZE, offsetX = 0, offsetY = 0, isNextPiece = false) {
        const blockX = offsetX + x * blockSize;
        const blockY = offsetY + y * blockSize;
        
        // Create glossy gradient background
        const gradient = context.createLinearGradient(blockX, blockY, blockX, blockY + blockSize);
        
        // Parse the base color to create lighter and darker variants
        const baseColor = color;
        const colorMatch = baseColor.match(/^#([0-9a-f]{6})$/i);
        let r = 255, g = 0, b = 0; // Default to red if parsing fails
        
        if (colorMatch) {
            r = parseInt(colorMatch[1].substr(0, 2), 16);
            g = parseInt(colorMatch[1].substr(2, 2), 16);
            b = parseInt(colorMatch[1].substr(4, 2), 16);
        }
        
        // Create glossy gradient with enhanced brightness at top
        gradient.addColorStop(0, `rgba(${Math.min(255, r + 80)}, ${Math.min(255, g + 80)}, ${Math.min(255, b + 80)}, 1)`);
        gradient.addColorStop(0.1, `rgba(${Math.min(255, r + 40)}, ${Math.min(255, g + 40)}, ${Math.min(255, b + 40)}, 1)`);
        gradient.addColorStop(0.5, baseColor);
        gradient.addColorStop(0.9, `rgba(${Math.max(0, r - 40)}, ${Math.max(0, g - 40)}, ${Math.max(0, b - 40)}, 1)`);
        gradient.addColorStop(1, `rgba(${Math.max(0, r - 60)}, ${Math.max(0, g - 60)}, ${Math.max(0, b - 60)}, 1)`);
        
        // Fill base block with glossy gradient
        context.fillStyle = gradient;
        context.fillRect(blockX, blockY, blockSize, blockSize);
        
        // Add subtle glossy highlight at top
        const highlightGradient = context.createLinearGradient(blockX, blockY, blockX, blockY + blockSize * 0.25);
        highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
        highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)');
        highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
        
        context.fillStyle = highlightGradient;
        context.fillRect(blockX, blockY, blockSize, blockSize * 0.25);
        
        // Add minimal shine stripe at the very top
        const shineGradient = context.createLinearGradient(blockX, blockY, blockX, blockY + blockSize * 0.1);
        shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        context.fillStyle = shineGradient;
        context.fillRect(blockX, blockY, blockSize, blockSize * 0.1);
        
        // Add subtle left-side glossy highlight
        const leftGradient = context.createLinearGradient(blockX, blockY, blockX + blockSize * 0.15, blockY);
        leftGradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
        leftGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        context.fillStyle = leftGradient;
        context.fillRect(blockX, blockY, blockSize * 0.15, blockSize);
        
        // Add bottom shadow for depth
        const shadowGradient = context.createLinearGradient(blockX, blockY + blockSize * 0.7, blockX, blockY + blockSize);
        shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
        
        context.fillStyle = shadowGradient;
        context.fillRect(blockX, blockY + blockSize * 0.7, blockSize, blockSize * 0.3);
        
        // Add right-side shadow
        const rightShadowGradient = context.createLinearGradient(blockX + blockSize * 0.8, blockY, blockX + blockSize, blockY);
        rightShadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        rightShadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
        
        context.fillStyle = rightShadowGradient;
        context.fillRect(blockX + blockSize * 0.8, blockY, blockSize * 0.2, blockSize);
        
        // Add very subtle corner highlights
        context.fillStyle = 'rgba(255, 255, 255, 0.3)';
        context.fillRect(blockX + 1, blockY + 1, 2, 2); // Top-left corner
        
        context.fillStyle = 'rgba(255, 255, 255, 0.2)';
        context.fillRect(blockX + blockSize - 3, blockY + 1, 2, 2); // Top-right corner
        
        // Minimal border - very subtle
        context.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        context.lineWidth = 0.5;
        context.strokeRect(blockX + 0.5, blockY + 0.5, blockSize - 1, blockSize - 1);
    }
    
    /**
     * Update all game display elements in the UI
     * Updates score, level, lines, money, goals, and timer displays
     */
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.currentLevel;
        document.getElementById('lines').textContent = this.lines;
        const stageElement = document.getElementById('stage');
        if (stageElement) {
            stageElement.textContent = this.currentLevel;
        }
        document.getElementById('money').textContent = this.totalMoney;
        
        // Update stage goals display
        document.getElementById('goal-score').textContent = this.levelGoals.minScore || '-';
        document.getElementById('goal-blocks').textContent = this.maxBlocks || '-';
        document.getElementById('blocks-used').textContent = this.blocksUsed;
        
        this.updateInventoryDisplay();
        this.updateTimerDisplay(); // Ensure timer is updated with other display elements
    }
    
    /**
     * Update the countdown timer display and progress bar
     * Shows remaining time in MM:SS format and updates progress bar color
     * Handles display when game is paused or completed
     */
    updateTimerDisplay() {
        if (!this.gameRunning || this.gamePaused || this.stageCompleted) {
            // If timer is not active, ensure display is cleared or shows default
            document.getElementById('time-remaining').textContent = '--:--';
            document.getElementById('time-progress').style.width = '0%';
            return;
        }
        
        const timeElapsed = Math.floor((Date.now() - this.levelStartTime) / 1000);
        let timeRemaining = this.timeLimit - timeElapsed;
        
        if (timeRemaining < 0) timeRemaining = 0;
        
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        
        document.getElementById('time-remaining').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update progress bar
        const progressPercentage = (timeRemaining / this.timeLimit) * 100;
        const progressBar = document.getElementById('time-progress');
        if (progressBar) {
            progressBar.style.width = `${Math.max(0, progressPercentage)}%`;
            // Change color based on time remaining
            if (progressPercentage < 25) {
                progressBar.style.backgroundColor = '#ff4d4d'; // Red
            } else if (progressPercentage < 50) {
                progressBar.style.backgroundColor = '#ffa500'; // Orange
            } else {
                progressBar.style.backgroundColor = '#4caf50'; // Green
            }
        }
    }
    
    /**
     * Start the timer interval for live time updates
     * Clears any existing interval and sets up new one with 1-second updates
     */
    startTimerInterval() {
        this.stopTimerInterval(); // Clear any existing interval
        this.timerInterval = setInterval(() => {
            this.updateTimerDisplay();
            // No need to check stage completion here, gameLoop does it
        }, 1000); // Update timer every second
        this.updateTimerDisplay(); // Initial update
    }
    
    /**
     * Stop the timer interval
     * Clears the interval and sets reference to null
     */
    stopTimerInterval() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
}

export default TetrascapeGame;

// Global instance (if needed, or handle instantiation in main.js)
// window.tetrisGame = new TetrascapeGame();
