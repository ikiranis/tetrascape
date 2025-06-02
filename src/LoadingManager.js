/**
 * LoadingManager - Manages the loading screen and progress tracking
 * Provides visual feedback during game initialization
 */
class LoadingManager {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.progressBar = document.getElementById('loading-progress-bar');
        this.loadingText = this.loadingScreen?.querySelector('.loading-text');
        this.totalSteps = 0;
        this.currentStep = 0;
        this.isVisible = true;
    }

    /**
     * Initialize the loading manager with total number of loading steps
     * @param {number} totalSteps - Total number of loading steps
     */
    initialize(totalSteps) {
        this.totalSteps = totalSteps;
        this.currentStep = 0;
        this.updateProgress();
    }

    /**
     * Update loading progress and text
     * @param {string} message - Optional message to display
     */
    updateProgress(message = null) {
        if (!this.progressBar || !this.isVisible) return;

        const percentage = this.totalSteps > 0 ? (this.currentStep / this.totalSteps) * 100 : 0;
        this.progressBar.style.width = `${percentage}%`;

        if (message && this.loadingText) {
            this.loadingText.textContent = message;
        }
    }

    /**
     * Advance to the next loading step
     * @param {string} message - Optional message to display for this step
     */
    nextStep(message = null) {
        this.currentStep++;
        this.updateProgress(message);
    }

    /**
     * Set loading to a specific step
     * @param {number} step - Step number to set
     * @param {string} message - Optional message to display
     */
    setStep(step, message = null) {
        this.currentStep = Math.min(step, this.totalSteps);
        this.updateProgress(message);
    }

    /**
     * Hide the loading screen with animation
     * @param {number} delay - Optional delay before hiding (in milliseconds)
     */
    hide(delay = 0) {
        if (!this.loadingScreen || !this.isVisible) return;

        setTimeout(() => {
            this.loadingScreen.classList.add('hidden');
            this.isVisible = false;
            
            // Show the game content
            const gameContent = document.getElementById('game-content');
            if (gameContent) {
                gameContent.style.opacity = '1';
            }
            
            // Remove loading screen from DOM after animation completes
            setTimeout(() => {
                if (this.loadingScreen && this.loadingScreen.parentNode) {
                    this.loadingScreen.parentNode.removeChild(this.loadingScreen);
                }
            }, 500); // Match CSS transition duration
        }, delay);
    }

    /**
     * Show the loading screen (in case it was hidden)
     */
    show() {
        if (!this.loadingScreen) return;

        this.loadingScreen.classList.remove('hidden');
        this.isVisible = true;
    }

    /**
     * Set loading to complete and hide after a short delay
     * @param {string} message - Final completion message
     * @param {number} delay - Delay before hiding
     */
    complete(message = "Loading complete!", delay = 500) {
        this.setStep(this.totalSteps, message);
        this.hide(delay);
    }

    /**
     * Handle loading error
     * @param {string} error - Error message to display
     */
    showError(error) {
        if (this.loadingText) {
            this.loadingText.textContent = `Error: ${error}`;
            this.loadingText.style.color = '#ff6b6b';
        }
    }

    /**
     * Create a promise that tracks a loading operation
     * @param {Promise} promise - Promise to track
     * @param {string} message - Message to display during this operation
     * @returns {Promise} The original promise with progress tracking
     */
    trackOperation(promise, message) {
        this.nextStep(message);
        
        return promise.catch(error => {
            this.showError(error.message || 'Unknown error occurred');
            throw error;
        });
    }
}

export default LoadingManager;
