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
    showStore(earnedMoney) {
        // Create store modal
        const storeModal = document.createElement('div');
        storeModal.id = 'store-modal';
        storeModal.className = 'store-modal';
        storeModal.innerHTML = `
            <div class="store-content">
                <h2>🎉 Level ${this.game.currentLevel} Complete! 🎉</h2>
                <div class="completion-stats">
                    <p>💰 Earned: <span class="earned-money">+${earnedMoney}</span> money</p>
                    <p>💳 Total money: <span class="total-money">${this.game.totalMoney}</span></p>
                    <p>⏱️ Time: ${this.game.timeLimit - Math.floor((Date.now() - this.game.levelStartTime) / 1000)}s remaining</p>
                    <p>🧱 Blocks: ${this.game.maxBlocks - this.game.blocksUsed} saved</p>
                </div>
                
                <h3>🛒 Buy Power-ups:</h3>
                <div class="store-items">
                    ${this.generateStoreItemsHTML()}
                </div>
                
                <div class="store-actions">
                    <button class="next-level-btn" onclick="tetrisGame.storeManager.nextStage()">
                        ${this.game.currentLevel >= 5 ? '🏆 Game End' : '➡️ Next Level'}
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(storeModal);
    }
    
    /**
     * Generate HTML for all store items
     * @returns {string} HTML string for store items
     */
    generateStoreItemsHTML() {
        return this.storeItems.map(item => `
            <div class="store-item ${this.game.totalMoney >= item.price ? '' : 'disabled'}">
                <div class="item-icon">${item.icon}</div>
                <div class="item-info">
                    <span class="item-name">${item.name}</span>
                    <span class="item-desc">${item.description}</span>
                    <span class="item-price">${item.price}$</span>
                    <span class="item-inventory">You have: <span id="${item.key}-count">${this.game.inventory[item.key]}</span></span>
                </div>
                <button onclick="tetrisGame.storeManager.buyItem('${item.key}', ${item.price})" ${this.game.totalMoney >= item.price ? '' : 'disabled'}>Buy</button>
            </div>
        `).join('');
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
        const totalMoneySpan = document.querySelector('#store-modal .total-money');
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
        const storeItems = document.querySelectorAll('#store-modal .store-item');
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
        const storeModal = document.getElementById('store-modal');
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
    showGameComplete() {
        const completeModal = document.createElement('div');
        completeModal.id = 'complete-modal';
        completeModal.className = 'store-modal';
        completeModal.innerHTML = `
            <div class="store-content">
                <h2>🎊 Congratulations! You escaped! 🎊</h2>
                <div class="completion-stats">
                    <p>🏆 You completed all levels!</p>
                    <p>💰 Total money: ${this.game.totalMoney}</p>
                    <p>🧠 You are a true escape artist!</p>
                </div>
                
                <div class="achievements">
                    <h3>🏅 Achievements:</h3>
                    <div class="achievement-list">
                        ${this.generateAchievementsHTML()}
                        <p class="achievement">🎯 Perfect Target - You reached the end!</p>
                    </div>
                </div>
                
                <div class="store-actions">
                    <button class="next-level-btn" onclick="location.reload()">
                        🔄 Play Again
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(completeModal);
    }
    
    /**
     * Generate HTML for achievements based on player performance
     * @returns {string} HTML string for achievements
     */
    generateAchievementsHTML() {
        const achievements = [];
        
        if (this.game.totalMoney >= 1000) {
            achievements.push('<p class="achievement">💎 Big Spender - You have 1000+ money!</p>');
        }
        
        if (this.game.inventory.dynamite >= 3) {
            achievements.push('<p class="achievement">💣 Bomber - You have 3+ dynamites!</p>');
        }
        
        if (this.game.inventory.shovel >= 2) {
            achievements.push('<p class="achievement">⛏️ Worker - You have 2+ shovels!</p>');
        }
        
        return achievements.join('');
    }
}

export default StoreManager;
