import TemplateEngine from './TemplateEngine.js';

/**
 * UIManager - Manages the game's user interface components
 * Handles loading, rendering, and updating HTML templates for game UI
 */
class UIManager {
    constructor(gameInstance) {
        this.game = gameInstance;
        this.templateEngine = new TemplateEngine();
        this.isInitialized = false;
    }
    
    /**
     * Initialize the game UI by loading and rendering all components
     * This replaces the static HTML with dynamic template-based components
     */
    async initializeUI() {
        if (this.isInitialized) return;
        
        try {
            // Load and render control buttons
            const controlButtonsHTML = await this.templateEngine.renderTemplate('controlButtons', {});
            
            // Load and render score panel
            const scorePanelHTML = await this.templateEngine.renderTemplate('scorePanel', {
                score: this.game.score || 0,
                level: this.game.currentLevel || 1,
                timeRemaining: '00:00',
                timeProgress: 100,
                timeColor: 'green',
                lines: this.game.lines || 0
            });
            
            // Load and render game board components
            const leftPanelHTML = await this.templateEngine.renderTemplate('leftPanel', {});
            const mainGameAreaHTML = await this.templateEngine.renderTemplate('mainGameArea', {});
            const sidePanelHTML = await this.templateEngine.renderTemplate('sidePanel', {
                goalScore: this.game.levelGoals?.minScore || 500,
                blocksUsed: this.game.blocksUsed || 0,
                goalBlocks: this.game.maxBlocks || 50,
                money: this.game.totalMoney || 0,
                dynamiteCount: this.game.inventory?.dynamite || 0,
                shovelCount: this.game.inventory?.shovel || 0,
                tradeCount: this.game.inventory?.trade || 0,
                slowCount: this.game.inventory?.slow || 0
            });
            
            // Render game board with nested components
            const gameBoardHTML = await this.templateEngine.renderTemplate('gameBoard', {
                leftPanel: leftPanelHTML,
                mainGameArea: mainGameAreaHTML,
                sidePanel: sidePanelHTML
            });
            
            // Update the dedicated containers with template content
            const controlButtonsContainer = document.querySelector('#control-buttons-container');
            if (controlButtonsContainer) {
                controlButtonsContainer.innerHTML = controlButtonsHTML;
            }
            
            const scorePanelContainer = document.querySelector('#score-panel-container');
            if (scorePanelContainer) {
                scorePanelContainer.innerHTML = scorePanelHTML;
            }
            
            const gameBoardContainer = document.querySelector('#game-board-container');
            if (gameBoardContainer) {
                gameBoardContainer.innerHTML = gameBoardHTML;
            }
            
            this.isInitialized = true;
            console.log('UI components initialized with templates');
            
        } catch (error) {
            console.error('Failed to initialize UI components:', error);
            // Fall back to existing static HTML if template loading fails
        }
    }
    
    /**
     * Update the score panel with current game data
     */
    async updateScorePanel() {
        if (!this.isInitialized) return;
        
        // Calculate time progress
        const timeElapsed = this.game.getElapsedTime ? this.game.getElapsedTime() : 0;
        const timeRemaining = Math.max(0, this.game.timeLimit - timeElapsed);
        const timeProgress = this.game.timeLimit > 0 ? (timeRemaining / this.game.timeLimit) * 100 : 100;
        
        // Determine time color
        let timeColor = 'green';
        if (timeProgress < 25) timeColor = 'red';
        else if (timeProgress < 50) timeColor = 'orange';
        
        // Format time display
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        const timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update individual elements instead of replacing the entire panel
        const scoreElement = document.getElementById('score');
        const levelElement = document.getElementById('level');
        const timeRemainingElement = document.getElementById('time-remaining');
        const timeProgressElement = document.getElementById('time-progress');
        const linesElement = document.getElementById('lines');
        
        if (scoreElement) scoreElement.textContent = this.game.score || 0;
        if (levelElement) levelElement.textContent = this.game.currentLevel || 1;
        if (timeRemainingElement) timeRemainingElement.textContent = timeDisplay;
        if (linesElement) linesElement.textContent = this.game.lines || 0;
        
        if (timeProgressElement) {
            timeProgressElement.style.width = `${Math.max(0, timeProgress)}%`;
            timeProgressElement.style.backgroundColor = timeColor;
        }
    }
    
    /**
     * Update the side panel with current game data
     */
    async updateSidePanel() {
        if (!this.isInitialized) return;
        
        // Update individual elements instead of replacing the entire panel
        // This preserves the canvas elements and their contexts
        const goalScoreElement = document.getElementById('goal-score');
        const blocksUsedElement = document.getElementById('blocks-used');
        const goalBlocksElement = document.getElementById('goal-blocks');
        const moneyElement = document.getElementById('money');
        const dynamiteCountElement = document.getElementById('dynamite-count');
        const shovelCountElement = document.getElementById('shovel-count');
        const tradeCountElement = document.getElementById('trade-count');
        const slowCountElement = document.getElementById('slow-count');
        
        if (goalScoreElement) goalScoreElement.textContent = this.game.levelGoals?.minScore || 500;
        if (blocksUsedElement) blocksUsedElement.textContent = this.game.blocksUsed || 0;
        if (goalBlocksElement) goalBlocksElement.textContent = this.game.maxBlocks || 50;
        if (moneyElement) moneyElement.textContent = this.game.totalMoney || 0;
        if (dynamiteCountElement) dynamiteCountElement.textContent = this.game.inventory?.dynamite || 0;
        if (shovelCountElement) shovelCountElement.textContent = this.game.inventory?.shovel || 0;
        if (tradeCountElement) tradeCountElement.textContent = this.game.inventory?.trade || 0;
        if (slowCountElement) slowCountElement.textContent = this.game.inventory?.slow || 0;
    }
    
    /**
     * Update all UI components with current game data
     */
    async updateUI() {
        await this.updateScorePanel();
        await this.updateSidePanel();
    }
}

export default UIManager;
