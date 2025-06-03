import TemplateEngine from './TemplateEngine.js';

/**
 * StoreManager - Handles all store-related functionality for the Tetrascape game
 * Manages the store modal, purchases, progression, and game completion screens
 */
class StoreManager {
    /**
     * Initialize the StoreManager with a reference to the main game instance
     * @param {TetrascapeGame} gameInstance - Reference to the main game object
     */
    constructor(gameInstance) {
        this.game = gameInstance;
        this.templateEngine = new TemplateEngine();
        
        // Store configuration
        this.storePrices = {
            dynamite: 50,
            shovel: 75,
            trade: 40,
            slow: 60
        };
        
        this.storeItems = [
            {
                key: 'dynamite',
                icon: '💣',
                name: 'Dynamite',
                description: 'Explodes current piece',
                price: this.storePrices.dynamite
            },
            {
                key: 'shovel',
                icon: '🔨',
                name: 'Shovel',
                description: 'Clears vertical line',
                price: this.storePrices.shovel
            },
            {
                key: 'trade',
                icon: '🔄',
                name: 'Trade',
                description: 'Changes current piece',
                price: this.storePrices.trade
            },
            {
                key: 'slow',
                icon: '⏰',
                name: 'Extra Time',
                description: 'Adds +10 seconds',
                price: this.storePrices.slow
            }
        ];
    }
    
    /**
     * Display the store modal after completing a stage
     * Shows completion stats, available power-ups for purchase, and next level button
     * @param {number} earnedMoney - Amount of money earned from completing the stage
     */
    async showStore(earnedMoney) {
        // Prepare template data
        const templateData = {
            currentLevel: this.game.currentLevel,
            earnedMoney: earnedMoney,
            totalMoney: this.game.totalMoney,
            timeRemaining: this.game.timeLimit - this.game.getElapsedTime(),
            blocksRemaining: this.game.maxBlocks - this.game.blocksUsed,
            storeItems: await this.generateStoreItemsHTML(),
            nextButtonText: this.game.currentLevel >= 5 ? '🏆 Game End' : '➡️ Next Level'
        };

        // Render template and add to body
        const content = await this.templateEngine.renderTemplate('storeModal', templateData);
        document.body.insertAdjacentHTML('beforeend', content);
    }
    
    /**
     * Generate HTML for all store items
     * @returns {Promise<string>} HTML string for store items
     */
    async generateStoreItemsHTML() {
        const itemsHtml = await Promise.all(
            this.storeItems.map(async (item) => {
                const itemData = {
                    icon: item.icon,
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    key: item.key,
                    inventoryCount: this.game.inventory[item.key],
                    disabledClass: this.game.totalMoney >= item.price ? '' : 'disabled',
                    disabledAttribute: this.game.totalMoney >= item.price ? '' : 'disabled'
                };
                
                return await this.templateEngine.renderTemplate('storeItem', itemData);
            })
        );
        
        return itemsHtml.join('');
    }
    
    /**
     * Purchase a power-up item from the store
     * Deducts cost from total money, adds item to inventory, and updates UI
     * @param {string} item - Type of power-up to purchase ('dynamite', 'shovel', 'trade', 'slow')
     * @param {number} cost - Cost of the item in game currency
     */
    buyItem(item, cost) {
        if (this.game.totalMoney >= cost) {
            this.game.totalMoney -= cost;
            this.game.inventory[item]++;
            this.game.soundManager.playPurchase();
            
            // Update store display
            this.updateStoreDisplay(item);
            this.game.updateInventoryDisplay();
        } else {
            // Not enough money - show feedback
            this.game.soundManager.playError();
            this.showPurchaseError();
        }
    }
    
    /**
     * Update the store display after a purchase
     * @param {string} purchasedItem - The item that was purchased
     */
    updateStoreDisplay(purchasedItem) {
        // Update total money display
        const totalMoneySpan = document.querySelector('#store-modal-overlay .total-money');
        if (totalMoneySpan) {
            totalMoneySpan.textContent = this.game.totalMoney;
        }
        
        // Update inventory count in store
        const inventoryCount = document.getElementById(purchasedItem + '-count');
        if (inventoryCount) {
            inventoryCount.textContent = this.game.inventory[purchasedItem];
        }
        
        // Update all buttons state based on current money
        this.updateStoreButtonStates();
    }
    
    /**
     * Update the enabled/disabled state of all store buttons
     */
    updateStoreButtonStates() {
        const storeItems = document.querySelectorAll('#store-modal-overlay .store-item');
        this.storeItems.forEach((itemConfig, index) => {
            const storeElement = storeItems[index];
            const button = storeElement.querySelector('button');
            
            if (this.game.totalMoney < itemConfig.price) {
                storeElement.classList.add('disabled');
                button.disabled = true;
            } else {
                storeElement.classList.remove('disabled');
                button.disabled = false;
            }
        });
    }
    
    /**
     * Show purchase error feedback when player doesn't have enough money
     */
    showPurchaseError() {
        const button = event.target;
        const originalText = button.textContent;
        const originalBackground = button.style.background;
        
        button.textContent = 'Not enough money!';
        button.style.background = '#ff4444';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = originalBackground;
        }, 1000);
    }
    
    /**
     * Proceed to the next stage or complete the game
     * Removes store modal and either starts next level or shows game completion
     */
    nextStage() {
        const storeModal = document.getElementById('store-modal-overlay');
        if (storeModal) {
            storeModal.remove();
        }
        
        if (this.game.currentLevel >= 5) {
            // Game completed!
            this.showGameComplete();
        } else {
            this.game.currentLevel++;
            this.game.startGame();
        }
    }
    
    /**
     * Display the game completion screen when all levels are finished
     * Shows final stats, achievements, and option to play again
     */
    async showGameComplete() {
        // Prepare template data
        const templateData = {
            totalMoney: this.game.totalMoney,
            achievements: await this.generateAchievementsHTML()
        };
        
        // Render template and add to body
        const content = await this.templateEngine.renderTemplate('gameCompleteModal', templateData);
        document.body.insertAdjacentHTML('beforeend', content);
    }
    
    /**
     * Generate HTML for achievements based on player performance
     * @returns {Promise<string>} HTML string for achievements
     */
    async generateAchievementsHTML() {
        const achievements = [];
        
        if (this.game.totalMoney >= 1000) {
            achievements.push({
                icon: '💎',
                title: 'Big Spender',
                description: 'You have 1000+ money!'
            });
        }
        
        if (this.game.inventory.dynamite >= 3) {
            achievements.push({
                icon: '💣',
                title: 'Bomber',
                description: 'You have 3+ dynamites!'
            });
        }
        
        if (this.game.inventory.shovel >= 2) {
            achievements.push({
                icon: '⛏️',
                title: 'Worker',
                description: 'You have 2+ shovels!'
            });
        }
        
        // Render achievement templates
        const achievementHtml = await Promise.all(
            achievements.map(achievement => 
                this.templateEngine.renderTemplate('achievement', achievement)
            )
        );
        
        return achievementHtml.join('');
    }

    /**
     * Display the game over screen when player fails a stage
     * Shows failure message, final stats, and option to try again
     */
    async showGameOver() {
        // Prepare template data
        const templateData = {
            finalScore: this.game.score,
            currentLevel: this.game.currentLevel,
            totalMoney: this.game.totalMoney
        };
        
        // Render template and add to body
        const content = await this.templateEngine.renderTemplate('gameOverModal', templateData);
        document.body.insertAdjacentHTML('beforeend', content);
    }

    /**
     * Restart the game from level 1 without reloading the page
     * Removes current modal and resets the game to initial state
     */
    restartGame() {
        // Remove any existing modals
        const existingModals = document.querySelectorAll('.modal-overlay');
        existingModals.forEach(modal => modal.remove());
        
        // Reset game to level 1
        this.game.currentLevel = 1;
        this.game.totalMoney = 0;
        
        // Reset inventory to starting values
        this.game.inventory = {
            dynamite: 5,
            shovel: 5,
            trade: 5,
            slow: 5
        };
        
        // Start the game
        this.game.startGame();
    }
}

export default StoreManager;
