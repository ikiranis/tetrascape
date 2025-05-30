// Sound Manager
class SoundManager {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
        this.init();
    }
    
    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
            this.enabled = false;
        }
    }
    
    // Create different sound effects
    playTone(frequency, duration, type = 'sine', volume = 0.1) {
        if (!this.enabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    // Specific sound effects
    playMove() {
        this.playTone(200, 0.1, 'square', 0.05);
    }
    
    playRotate() {
        this.playTone(300, 0.15, 'triangle', 0.06);
    }
    
    playDrop() {
        this.playTone(100, 0.2, 'sawtooth', 0.08);
    }
    
    playSoftDrop() {
        // Soft drop sound - subtle but noticeable
        this.playTone(150, 0.1, 'sine', 0.04);
    }
    
    playHardDrop() {
        // More intense drop sound
        this.playTone(80, 0.3, 'sawtooth', 0.12);
        setTimeout(() => this.playTone(60, 0.2, 'square', 0.08), 100);
    }
    
    playLineClear() {
        // Pleasant ascending notes
        setTimeout(() => this.playTone(400, 0.15, 'sine', 0.1), 0);
        setTimeout(() => this.playTone(500, 0.15, 'sine', 0.1), 50);
        setTimeout(() => this.playTone(600, 0.15, 'sine', 0.1), 100);
        setTimeout(() => this.playTone(700, 0.2, 'sine', 0.1), 150);
    }
    
    playTetris() {
        // Special tetris sound - more explosive and elaborate
        // Lower boom sounds with higher celebration notes
        this.playTone(40, 0.4, 'sawtooth', 0.2); // Deep boom
        setTimeout(() => this.playTone(60, 0.3, 'square', 0.15), 50);
        setTimeout(() => this.playTone(80, 0.2, 'sawtooth', 0.12), 100);
        
        // Triumphant ascending melody with more energy
        const notes = [523, 659, 784, 1047, 1319]; // C, E, G, C, E (higher octave)
        notes.forEach((note, index) => {
            setTimeout(() => this.playTone(note, 0.25, 'triangle', 0.15), 200 + index * 80);
            // Add harmonics for richer sound
            setTimeout(() => this.playTone(note * 1.5, 0.2, 'sine', 0.08), 220 + index * 80);
        });
        
        // Final explosive flourish
        setTimeout(() => {
            this.playTone(100, 0.2, 'sawtooth', 0.18);
            setTimeout(() => this.playTone(1568, 0.3, 'sine', 0.12), 50); // High G
        }, 600);
    }
    
    playPowerup() {
        // Power-up activation sound
        this.playTone(800, 0.1, 'square', 0.1);
        setTimeout(() => this.playTone(1000, 0.1, 'square', 0.1), 100);
        setTimeout(() => this.playTone(1200, 0.2, 'sine', 0.08), 200);
    }
    
    playExplosion() {
        // Explosion sound for dynamite
        this.playTone(50, 0.3, 'sawtooth', 0.15);
        setTimeout(() => this.playTone(80, 0.2, 'square', 0.12), 50);
        setTimeout(() => this.playTone(40, 0.4, 'sawtooth', 0.1), 100);
    }
    
    playDig() {
        // Digging sound for shovel
        for (let i = 0; i < 5; i++) {
            setTimeout(() => this.playTone(150 + Math.random() * 50, 0.1, 'sawtooth', 0.06), i * 100);
        }
    }
    
    playTrade() {
        // Trade sound - two-tone exchange
        this.playTone(600, 0.15, 'triangle', 0.08);
        setTimeout(() => this.playTone(400, 0.15, 'triangle', 0.08), 150);
    }
    
    playSlow() {
        // Time extension effect - ascending celestial sounds
        const frequencies = [440, 523, 659, 784, 880]; // A, C, E, G, A
        frequencies.forEach((freq, index) => {
            setTimeout(() => this.playTone(freq, 0.3, 'sine', 0.06), index * 100);
        });
        // Add sparkle effect
        setTimeout(() => {
            for (let i = 0; i < 8; i++) {
                setTimeout(() => this.playTone(1200 + Math.random() * 400, 0.1, 'triangle', 0.03), i * 50);
            }
        }, 500);
    }
    
    playStageComplete() {
        // Victory fanfare
        const melody = [523, 659, 784, 1047]; // C, E, G, C
        melody.forEach((note, index) => {
            setTimeout(() => this.playTone(note, 0.3, 'triangle', 0.1), index * 200);
        });
    }
    
    playGameOver() {
        // Sad descending notes
        const notes = [400, 350, 300, 250];
        notes.forEach((note, index) => {
            setTimeout(() => this.playTone(note, 0.4, 'triangle', 0.08), index * 300);
        });
    }
    
    playEscape() {
        // Escape success - ascending triumphant notes
        const notes = [262, 330, 392, 523, 659, 784]; // C major scale
        notes.forEach((note, index) => {
            setTimeout(() => this.playTone(note, 0.25, 'sine', 0.1), index * 100);
        });
    }
    
    playPurchase() {
        // Purchase confirmation sound
        this.playTone(600, 0.1, 'triangle', 0.08);
        setTimeout(() => this.playTone(800, 0.15, 'sine', 0.06), 100);
    }
    
    playError() {
        // Error/invalid action sound
        this.playTone(150, 0.3, 'sawtooth', 0.1);
    }
}

// Tetris Game Implementation
class TetrisGame {
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
        this.currentStage = 1;
        this.totalMoney = 0;
        this.stageGoals = {};
        this.timeLimit = 0;
        this.stageStartTime = 0;
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
        this.setupEventListeners();
        this.setupControls();
    }
    
    initBoard() {
        this.board = Array(this.BOARD_HEIGHT).fill().map(() => Array(this.BOARD_WIDTH).fill(0));
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }
    
    setupControls() {
        document.getElementById('start-button').addEventListener('click', () => this.startGame());
        document.getElementById('pause-button').addEventListener('click', () => this.togglePause());
        document.getElementById('restart-button').addEventListener('click', () => this.restartGame());
        document.getElementById('sound-toggle').addEventListener('click', () => this.toggleSound());
    }
    
    toggleSound() {
        this.soundManager.enabled = !this.soundManager.enabled;
        const button = document.getElementById('sound-toggle');
        if (this.soundManager.enabled) {
            button.textContent = '🔊';
            button.title = 'Sound ON - Click to mute';
            button.classList.remove('muted');
        } else {
            button.textContent = '🔇';
            button.title = 'Sound OFF - Click to enable';
            button.classList.add('muted');
        }
    }
    
    generateStageGoals() {
        const stages = [
            { minScore: 500, timeLimit: 180, maxBlocks: 50, reward: 100 },
            { minScore: 1000, timeLimit: 150, maxBlocks: 45, reward: 150 },
            { minScore: 1500, timeLimit: 135, maxBlocks: 40, reward: 200 },
            { minScore: 2500, timeLimit: 120, maxBlocks: 35, reward: 300 },
            { minScore: 4000, timeLimit: 105, maxBlocks: 30, reward: 500 }
        ];
        
        const stageIndex = Math.min(this.currentStage - 1, stages.length - 1);
        const stage = stages[stageIndex];
        
        this.stageGoals = {
            minScore: stage.minScore,
            timeLimit: stage.timeLimit,
            maxBlocks: stage.maxBlocks,
            reward: stage.reward
        };
        
        this.timeLimit = stage.timeLimit;
        this.maxBlocks = stage.maxBlocks;
        this.blocksUsed = 0;
        this.stageStartTime = Date.now();
    }
    
    checkStageCompletion() {
        if (this.stageCompleted) return;
        
        const timeElapsed = Math.floor((Date.now() - this.stageStartTime) / 1000);
        const timeRemaining = this.timeLimit - timeElapsed;
        
        if (this.score >= this.stageGoals.minScore && timeRemaining > 0) {
            this.completeStage();
        } else if (timeRemaining <= 0 || this.blocksUsed >= this.maxBlocks) {
            this.failStage();
        }
    }
    
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
        const timeBonus = Math.max(0, this.timeLimit - Math.floor((Date.now() - this.stageStartTime) / 1000)) * 10;
        const blockBonus = Math.max(0, this.maxBlocks - this.blocksUsed) * 5;
        const totalEarned = this.stageGoals.reward + timeBonus + blockBonus;
        
        this.totalMoney += totalEarned;
        
        setTimeout(() => {
            this.showStore(totalEarned);
        }, 3000); // Increased delay to 3 seconds
        
        // Play escape sound after a delay
        setTimeout(() => {
            this.soundManager.playEscape();
        }, 1000);
    }
    
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
    
    showStore(earnedMoney) {
        // Create store modal
        const storeModal = document.createElement('div');
        storeModal.id = 'store-modal';
        storeModal.className = 'store-modal';
        storeModal.innerHTML = `
            <div class="store-content">
                <h2>🎉 Επίπεδο ${this.currentStage} Ολοκληρώθηκε! 🎉</h2>
                <div class="completion-stats">
                    <p>💰 Κέρδισες: <span class="earned-money">+${earnedMoney}</span> χρήματα</p>
                    <p>💳 Συνολικά χρήματα: <span class="total-money">${this.totalMoney}</span></p>
                    <p>⏱️ Χρόνος: ${this.timeLimit - Math.floor((Date.now() - this.stageStartTime) / 1000)}s υπόλοιπος</p>
                    <p>🧱 Blocks: ${this.maxBlocks - this.blocksUsed} εξοικονομημένα</p>
                </div>
                
                <h3>🛒 Αγόρασε Power-ups:</h3>
                <div class="store-items">
                    <div class="store-item ${this.totalMoney >= 50 ? '' : 'disabled'}">
                        <div class="item-icon">💣</div>
                        <div class="item-info">
                            <span class="item-name">Dynamite</span>
                            <span class="item-desc">Σκάει το τρέχον κομμάτι</span>
                            <span class="item-price">50$</span>
                            <span class="item-inventory">Έχεις: <span id="dynamite-count">${this.inventory.dynamite}</span></span>
                        </div>
                        <button onclick="tetrisGame.buyItem('dynamite', 50)" ${this.totalMoney >= 50 ? '' : 'disabled'}>Αγορά</button>
                    </div>
                    <div class="store-item ${this.totalMoney >= 75 ? '' : 'disabled'}">
                        <div class="item-icon">🔨</div>
                        <div class="item-info">
                            <span class="item-name">Shovel</span>
                            <span class="item-desc">Καθαρίζει κάθετη γραμμή</span>
                            <span class="item-price">75$</span>
                            <span class="item-inventory">Έχεις: <span id="shovel-count">${this.inventory.shovel}</span></span>
                        </div>
                        <button onclick="tetrisGame.buyItem('shovel', 75)" ${this.totalMoney >= 75 ? '' : 'disabled'}>Αγορά</button>
                    </div>
                    <div class="store-item ${this.totalMoney >= 40 ? '' : 'disabled'}">
                        <div class="item-icon">🔄</div>
                        <div class="item-info">
                            <span class="item-name">Trade</span>
                            <span class="item-desc">Αλλάζει το τρέχον κομμάτι</span>
                            <span class="item-price">40$</span>
                            <span class="item-inventory">Έχεις: <span id="trade-count">${this.inventory.trade}</span></span>
                        </div>
                        <button onclick="tetrisGame.buyItem('trade', 40)" ${this.totalMoney >= 40 ? '' : 'disabled'}>Αγορά</button>
                    </div>
                    <div class="store-item ${this.totalMoney >= 60 ? '' : 'disabled'}">
                        <div class="item-icon">⏰</div>
                        <div class="item-info">
                            <span class="item-name">Extra Time</span>
                            <span class="item-desc">Προσθέτει +10 δευτερόλεπτα</span>
                            <span class="item-price">60$</span>
                            <span class="item-inventory">Έχεις: <span id="slow-count">${this.inventory.slow}</span></span>
                        </div>
                        <button onclick="tetrisGame.buyItem('slow', 60)" ${this.totalMoney >= 60 ? '' : 'disabled'}>Αγορά</button>
                    </div>
                </div>
                
                <div class="store-actions">
                    <button class="next-level-btn" onclick="tetrisGame.nextStage()">
                        ${this.currentStage >= 5 ? '🏆 Τέλος Παιχνιδιού' : '➡️ Επόμενο Επίπεδο'}
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(storeModal);
    }
    
    buyItem(item, cost) {
        if (this.totalMoney >= cost) {
            this.totalMoney -= cost;
            this.inventory[item]++;
            this.soundManager.playPurchase();
            
            // Update store display
            const totalMoneySpan = document.querySelector('#store-modal .total-money');
            if (totalMoneySpan) {
                totalMoneySpan.textContent = this.totalMoney;
            }
            
            // Update inventory count in store
            const inventoryCount = document.getElementById(item + '-count');
            if (inventoryCount) {
                inventoryCount.textContent = this.inventory[item];
            }
            
            // Update all buttons state
            const storeItems = document.querySelectorAll('#store-modal .store-item');
            const costs = [50, 75, 40, 60]; // dynamite, shovel, trade, slow
            storeItems.forEach((item, index) => {
                const button = item.querySelector('button');
                if (this.totalMoney < costs[index]) {
                    item.classList.add('disabled');
                    button.disabled = true;
                } else {
                    item.classList.remove('disabled');
                    button.disabled = false;
                }
            });
            
            this.updateInventoryDisplay();
        } else {
            // Not enough money - show feedback
            this.soundManager.playError();
            const button = event.target;
            button.textContent = 'Δεν έχεις αρκετά!';
            button.style.background = '#ff4444';
            setTimeout(() => {
                button.textContent = 'Αγορά';
                button.style.background = '';
            }, 1000);
        }
    }
    
    nextStage() {
        document.getElementById('store-modal').remove();
        
        if (this.currentStage >= 5) {
            // Game completed!
            this.showGameComplete();
        } else {
            this.currentStage++;
            this.startGame();
        }
    }
    
    showGameComplete() {
        const completeModal = document.createElement('div');
        completeModal.id = 'complete-modal';
        completeModal.className = 'store-modal';
        completeModal.innerHTML = `
            <div class="store-content">
                <h2>🎊 Συγχαρητήρια! Απέδρασες! 🎊</h2>
                <div class="completion-stats">
                    <p>🏆 Ολοκλήρωσες όλα τα επίπεδα!</p>
                    <p>💰 Συνολικά χρήματα: ${this.totalMoney}</p>
                    <p>🧠 Είσαι ένας αληθινός escape artist!</p>
                </div>
                
                <div class="achievements">
                    <h3>🏅 Επιτεύγματα:</h3>
                    <div class="achievement-list">
                        ${this.totalMoney >= 1000 ? '<p class="achievement">💎 Μεγαλοαγοραστής - Έχεις 1000+ χρήματα!</p>' : ''}
                        ${this.inventory.dynamite >= 3 ? '<p class="achievement">💣 Bomber - Έχεις 3+ dynamites!</p>' : ''}
                        ${this.inventory.shovel >= 2 ? '<p class="achievement">⛏️ Εργάτης - Έχεις 2+ shovels!</p>' : ''}
                        <p class="achievement">🎯 Τέλειος Στόχος - Έφτασες το τέλος!</p>
                    </div>
                </div>
                
                <div class="store-actions">
                    <button class="next-level-btn" onclick="location.reload()">
                        🔄 Παίξε Ξανά
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(completeModal);
    }
    
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
                    const x = offsetX + col * blockSize;
                    const y = offsetY + row * blockSize;
                    
                    // Draw block with the same color as in the game
                    ctx.fillStyle = this.colors[pieceData.color];
                    ctx.fillRect(x, y, blockSize, blockSize);
                    
                    // Draw border for better visibility
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(x, y, blockSize, blockSize);
                }
            }
        }
    }
    
    usePowerup(type) {
        if (this.inventory[type] <= 0) {
            this.soundManager.playError();
            return;
        }
        
        this.inventory[type]--;
        this.soundManager.playPowerup();
        this.updateInventoryDisplay();
        
        switch(type) {
            case 'dynamite':
                this.useDynamite();
                break;
            case 'shovel':
                this.useShovel();
                break;
            case 'trade':
                this.useTrade();
                break;
            case 'slow':
                this.useSlow();
                break;
        }
    }
    
    useDynamite() {
        this.triggerPowerupAnimation('dynamite');
        this.soundManager.playExplosion();
        
        if (!this.currentPiece) return;
        
        // First, drop the piece to the bottom
        while (this.movePiece(0, 1)) {
            // Keep dropping until it can't move down anymore
        }
        
        // Get the position where the piece will be placed
        const explosionCenters = [];
        for (let row = 0; row < this.currentPiece.shape.length; row++) {
            for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
                if (this.currentPiece.shape[row][col] !== 0) {
                    const x = this.currentPiece.x + col;
                    const y = this.currentPiece.y + row;
                    if (y >= 0) {
                        explosionCenters.push({x, y});
                    }
                }
            }
        }
        
        // Place the piece
        this.placePiece();
        
        // Create explosion - clear blocks in a 3x3 area around each piece block
        explosionCenters.forEach(center => {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const explodeX = center.x + dx;
                    const explodeY = center.y + dy;
                    
                    // Check if the position is within board boundaries
                    if (explodeX >= 0 && explodeX < this.BOARD_WIDTH && 
                        explodeY >= 0 && explodeY < this.BOARD_HEIGHT) {
                        this.board[explodeY][explodeX] = 0;
                    }
                }
            }
        });
        
        // Clear any complete lines after explosion
        this.clearLines();
        
        // Get next piece
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.getRandomPiece();
        this.blocksUsed++;
        this.updateDisplay();
    }
    
    useShovel() {
        this.triggerPowerupAnimation('shovel');
        this.soundManager.playDig();
        
        if (!this.currentPiece) return;
        
        // Clear vertical line where the piece will land
        const centerX = this.currentPiece.x + Math.floor(this.currentPiece.shape[0].length / 2);
        
        for (let y = 0; y < this.BOARD_HEIGHT; y++) {
            if (centerX >= 0 && centerX < this.BOARD_WIDTH) {
                this.board[y][centerX] = 0;
            }
        }
    }
    
    useTrade() {
        this.triggerPowerupAnimation('trade');
        this.soundManager.playTrade();
        
        // Change current piece to a random new one
        this.currentPiece = this.getRandomPiece();
        this.updateDisplay(); // Update score display after new piece
    }
    
    useSlow() {
        this.triggerPowerupAnimation('slow');
        this.soundManager.playSlow();
        
        // Add 10 seconds to the time limit
        this.timeLimit += 10;
    }
    
    updateCharacterProgress() {
        if (!this.stageGoals.minScore) return;
        
        // Calculate progress based on score relative to goal
        this.characterProgress = Math.min(100, (this.score / this.stageGoals.minScore) * 100);
        
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
    
    setCharacterState(state) {
        if (this.characterState === state) return;
        
        this.characterState = state;
        if (this.characterElement) {
            this.characterElement.className = 'character ' + state;
        }
    }
    
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
        if (this.currentStage === 1) {
            this.inventory = {
                dynamite: 5,
                shovel: 5,
                trade: 5,
                slow: 5
            };
        }
        
        // Generate stage goals
        this.generateStageGoals();
        
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
    
    restartGame() {
        this.gameRunning = false;
        this.gamePaused = false;
        this.startGame();
    }
    
    gameLoop() {
        if (!this.gameRunning || this.gamePaused) return;
        
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
            this.dropPiece();
            this.dropTime = now;
        }
        
        // Check stage completion
        this.checkStageCompletion();
        
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    handleKeyPress(e) {
        if (!this.gameRunning || this.gamePaused) return;
        
        switch(e.code) {
            case 'ArrowLeft':
                e.preventDefault();
                this.movePiece(-1, 0);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.movePiece(1, 0);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.softDrop();
                break;
            case 'Space':
                e.preventDefault();
                this.rotatePiece();
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                e.preventDefault();
                this.hardDrop();
                break;
            case 'KeyP':
                e.preventDefault();
                this.togglePause();
                break;
            // Power-up keys
            case 'Digit1':
                e.preventDefault();
                this.usePowerup('dynamite');
                break;
            case 'Digit2':
                e.preventDefault();
                this.usePowerup('shovel');
                break;
            case 'Digit3':
                e.preventDefault();
                this.usePowerup('trade');
                break;
            case 'Digit4':
                e.preventDefault();
                this.usePowerup('slow');
                break;
        }
    }
    
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
    
    rotatePiece() {
        const rotated = this.rotateMatrix(this.currentPiece.shape);
        if (this.isValidMove(this.currentPiece.x, this.currentPiece.y, rotated)) {
            this.currentPiece.shape = rotated;
            this.soundManager.playRotate();
        }
    }
    
    rotateMatrix(matrix) {
        const rows = matrix.length;
        const cols = matrix[0].length;
        const rotated = Array(cols).fill().map(() => Array(rows).fill(0));
        
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                rotated[j][rows - 1 - i] = matrix[i][j];
            }
        }
        
        return rotated;
    }
    
    dropPiece() {
        if (!this.movePiece(0, 1)) {
            this.soundManager.playDrop();
            this.placePiece();
            this.clearLines();
            this.blocksUsed++;
            this.currentPiece = this.nextPiece;
            this.nextPiece = this.getRandomPiece();
            this.updateDisplay(); // Update score display after new piece
            
            if (!this.isValidMove(this.currentPiece.x, this.currentPiece.y, this.currentPiece.shape)) {
                this.failStage();
            }
        }
    }
    
    softDrop() {
        // Manual soft drop triggered by down arrow key
        if (this.movePiece(0, 1)) {
            // No points for soft drop movement
            this.soundManager.playSoftDrop();
            this.updateDisplay();
        } else {
            // If piece can't move down, place it
            this.soundManager.playDrop();
            this.placePiece();
            this.clearLines();
            this.blocksUsed++;
            this.currentPiece = this.nextPiece;
            this.nextPiece = this.getRandomPiece();
            this.updateDisplay(); // Update score display after new piece
            
            if (!this.isValidMove(this.currentPiece.x, this.currentPiece.y, this.currentPiece.shape)) {
                this.failStage();
            }
        }
    }
    
    hardDrop() {
        while (this.movePiece(0, 1)) {
            // No points for hard drop movement
        }
        this.soundManager.playHardDrop();
        this.updateDisplay();
    }
    
    isValidMove(x, y, shape) {
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col] !== 0) {
                    const newX = x + col;
                    const newY = y + row;
                    
                    if (newX < 0 || newX >= this.BOARD_WIDTH || 
                        newY >= this.BOARD_HEIGHT || 
                        (newY >= 0 && this.board[newY][newX] !== 0)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    
    placePiece() {
        for (let row = 0; row < this.currentPiece.shape.length; row++) {
            for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
                if (this.currentPiece.shape[row][col] !== 0) {
                    const x = this.currentPiece.x + col;
                    const y = this.currentPiece.y + row;
                    if (y >= 0) {
                        this.board[y][x] = this.currentPiece.color;
                    }
                }
            }
        }
    }
    
    clearLines() {
        let linesCleared = 0;
        
        for (let row = this.BOARD_HEIGHT - 1; row >= 0; row--) {
            if (this.board[row].every(cell => cell !== 0)) {
                this.board.splice(row, 1);
                this.board.unshift(Array(this.BOARD_WIDTH).fill(0));
                linesCleared++;
                row++; // Check the same row again
            }
        }
        
        if (linesCleared > 0) {
            this.lines += linesCleared;
            this.score += this.calculateScore(linesCleared);
            this.level = Math.floor(this.lines / 10) + 1;
            this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
            
            // Play appropriate sound based on lines cleared
            if (linesCleared === 4) {
                this.soundManager.playTetris();
            } else {
                this.soundManager.playLineClear();
            }
            
            this.updateDisplay();
        }
    }
    
    calculateScore(linesCleared) {
        const scores = [0, 40, 100, 300, 1200];
        return scores[linesCleared] * this.level;
    }
    
    gameOver() {
        this.gameRunning = false;
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('game-over').style.display = 'flex';
        document.getElementById('start-button').disabled = false;
        document.getElementById('pause-button').disabled = true;
        document.getElementById('restart-button').disabled = true;
    }
    
    draw() {
        // Clear main canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update character progress and render
        this.updateCharacterProgress();
        this.renderCharacter();
        
        // Draw board
        this.drawBoard();
        
        // Draw current piece
        if (this.currentPiece) {
            this.drawPiece(this.ctx, this.currentPiece, this.currentPiece.x, this.currentPiece.y);
        }
        
        // Draw ghost piece
        if (this.currentPiece) {
            this.drawGhostPiece();
        }
        
        // Draw next piece
        this.drawNextPiece();
    }
    
    drawBoard() {
        for (let row = 0; row < this.BOARD_HEIGHT; row++) {
            for (let col = 0; col < this.BOARD_WIDTH; col++) {
                if (this.board[row][col] !== 0) {
                    this.ctx.fillStyle = this.colors[this.board[row][col]];
                    this.ctx.fillRect(
                        col * this.BLOCK_SIZE,
                        row * this.BLOCK_SIZE,
                        this.BLOCK_SIZE,
                        this.BLOCK_SIZE
                    );
                    
                    // Add border
                    this.ctx.strokeStyle = '#fff';
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeRect(
                        col * this.BLOCK_SIZE,
                        row * this.BLOCK_SIZE,
                        this.BLOCK_SIZE,
                        this.BLOCK_SIZE
                    );
                }
            }
        }
    }
    
    drawPiece(ctx, piece, offsetX, offsetY) {
        ctx.fillStyle = this.colors[piece.color];
        
        for (let row = 0; row < piece.shape.length; row++) {
            for (let col = 0; col < piece.shape[row].length; col++) {
                if (piece.shape[row][col] !== 0) {
                    ctx.fillRect(
                        (offsetX + col) * this.BLOCK_SIZE,
                        (offsetY + row) * this.BLOCK_SIZE,
                        this.BLOCK_SIZE,
                        this.BLOCK_SIZE
                    );
                    
                    // Add border
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(
                        (offsetX + col) * this.BLOCK_SIZE,
                        (offsetY + row) * this.BLOCK_SIZE,
                        this.BLOCK_SIZE,
                        this.BLOCK_SIZE
                    );
                }
            }
        }
    }
    
    drawGhostPiece() {
        let ghostY = this.currentPiece.y;
        while (this.isValidMove(this.currentPiece.x, ghostY + 1, this.currentPiece.shape)) {
            ghostY++;
        }
        
        this.ctx.fillStyle = this.colors[this.currentPiece.color] + '40'; // Semi-transparent
        
        for (let row = 0; row < this.currentPiece.shape.length; row++) {
            for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
                if (this.currentPiece.shape[row][col] !== 0) {
                    this.ctx.fillRect(
                        (this.currentPiece.x + col) * this.BLOCK_SIZE,
                        (ghostY + row) * this.BLOCK_SIZE,
                        this.BLOCK_SIZE,
                        this.BLOCK_SIZE
                    );
                }
            }
        }
    }
    
    drawNextPiece() {
        // Clear next piece canvas
        this.nextCtx.fillStyle = '#000';
        this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        
        if (this.nextPiece) {
            const blockSize = 20;
            const offsetX = (this.nextCanvas.width - this.nextPiece.shape[0].length * blockSize) / 2;
            const offsetY = (this.nextCanvas.height - this.nextPiece.shape.length * blockSize) / 2;
            
            this.nextCtx.fillStyle = this.colors[this.nextPiece.color];
            
            for (let row = 0; row < this.nextPiece.shape.length; row++) {
                for (let col = 0; col < this.nextPiece.shape[row].length; col++) {
                    if (this.nextPiece.shape[row][col] !== 0) {
                        this.nextCtx.fillRect(
                            offsetX + col * blockSize,
                            offsetY + row * blockSize,
                            blockSize,
                            blockSize
                        );
                        
                        // Add border
                        this.nextCtx.strokeStyle = '#fff';
                        this.nextCtx.lineWidth = 1;
                        this.nextCtx.strokeRect(
                            offsetX + col * blockSize,
                            offsetY + row * blockSize,
                            blockSize,
                            blockSize
                        );
                    }
                }
            }
        }
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('lines').textContent = this.lines;
        
        // Update stage info with live timer
        this.updateStageInfoDisplay();
        
        this.updateInventoryDisplay();
        this.updatePieceStatsDisplay();
    }

    // Separate method for updating stage info display (used by timer interval)
    updateStageInfoDisplay() {
        if (this.stageGoals && this.gameRunning && !this.gamePaused) {
            const timeElapsed = Math.floor((Date.now() - this.stageStartTime) / 1000);
            const timeRemaining = Math.max(0, this.timeLimit - timeElapsed);
            
            document.getElementById('stage-info').innerHTML = `
                <h3>Στόχοι Πίστας</h3>
                <p>Επίπεδο: ${this.currentStage}</p>
                <p>Στόχος: ${this.stageGoals.minScore} πόντοι</p>
                <p>Χρόνος: ${timeRemaining}s</p>
                <p>Blocks: ${this.blocksUsed}/${this.maxBlocks}</p>
                <p>Χρήματα: $${this.totalMoney}</p>
            `;
        }
    }

    // Timer interval methods for live time updates
    startTimerInterval() {
        // Clear any existing interval
        this.stopTimerInterval();
        
        // Start new interval to update timer every second
        this.timerInterval = setInterval(() => {
            if (this.gameRunning && !this.gamePaused) {
                this.updateStageInfoDisplay();
            }
        }, 1000);
    }

    stopTimerInterval() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
}

// Initialize the game when the page loads
let tetrisGame;
window.addEventListener('load', () => {
    tetrisGame = new TetrisGame();
});
