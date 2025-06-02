/**
 * SoundManager - Handles all audio effects for the game
 * Uses Web Audio API to generate procedural sound effects
 */
class SoundManager {
    /**
     * Initialize the SoundManager with Web Audio API
     * Sets up audio context and enables sound by default
     */
    constructor() {
        this.audioContext = null;
        this.enabled = true;
        this.init();
    }
    
    /**
     * Initialize the Web Audio API context
     * Falls back gracefully if Web Audio API is not supported
     */
    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
            this.enabled = false;
        }
    }
    
    /**
     * Generate a tone with specified parameters using Web Audio API
     * @param {number} frequency - Frequency of the tone in Hz
     * @param {number} duration - Duration of the tone in seconds
     * @param {string} type - Oscillator type ('sine', 'square', 'sawtooth', 'triangle')
     * @param {number} volume - Volume level (0.0 to 1.0)
     */
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
    
    /**
     * Play sound effect for piece horizontal movement
     * Short, subtle square wave sound
     */
    playMove() {
        this.playTone(200, 0.1, 'square', 0.05);
    }
    
    /**
     * Play sound effect for piece rotation
     * Triangle wave with slightly longer duration
     */
    playRotate() {
        this.playTone(300, 0.15, 'triangle', 0.06);
    }
    
    /**
     * Play sound effect for piece landing/dropping
     * Deep sawtooth wave for impact sound
     */
    playDrop() {
        this.playTone(100, 0.2, 'sawtooth', 0.08);
    }
    
    /**
     * Play sound effect for soft drop (arrow down)
     * Subtle sine wave for gentle downward movement
     */
    playSoftDrop() {
        this.playTone(150, 0.1, 'sine', 0.04);
    }
    
    /**
     * Play sound effect for hard drop (shift key)
     * More intense double-impact sound effect
     */
    playHardDrop() {
        this.playTone(80, 0.3, 'sawtooth', 0.12);
        setTimeout(() => this.playTone(60, 0.2, 'square', 0.08), 100);
    }
    
    /**
     * Play sound effect for line clearing
     * Pleasant ascending notes sequence
     */
    playLineClear() {
        setTimeout(() => this.playTone(400, 0.15, 'sine', 0.1), 0);
        setTimeout(() => this.playTone(500, 0.15, 'sine', 0.1), 50);
        setTimeout(() => this.playTone(600, 0.15, 'sine', 0.1), 100);
        setTimeout(() => this.playTone(700, 0.2, 'sine', 0.1), 150);
    }

    /**
     * Play sound effect at the start of line clear sequence
     * Initial sound before block pop animations
     */
    playLineClearStart() {
        this.playTone(500, 0.1, 'square', 0.08);
    }

    /**
     * Play sound effect when line clear animations complete
     * Ascending notes to signal completion
     */
    playLineClearComplete() {
        setTimeout(() => this.playTone(400, 0.15, 'sine', 0.1), 0);
        setTimeout(() => this.playTone(500, 0.15, 'sine', 0.1), 50);
        setTimeout(() => this.playTone(600, 0.15, 'sine', 0.1), 100);
        setTimeout(() => this.playTone(700, 0.2, 'sine', 0.1), 150);
    }

    /**
     * Play sound effect for individual block popping during line clear
     * Bubble-like pop with frequency sweep for realistic effect
     */
    playBlockPop() {
        const startFreq = 400 + Math.random() * 300; // Higher starting frequency
        const endFreq = 150 + Math.random() * 100;   // Lower ending frequency
        
        if (!this.enabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Use sine wave for smooth bubble-like tone
        oscillator.type = 'sine';
        
        // Quick frequency sweep from high to low (bubble pop characteristic)
        oscillator.frequency.setValueAtTime(startFreq, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(endFreq, this.audioContext.currentTime + 0.1);
        
        // Quick attack and decay envelope
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.08, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.12);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.12);
        
        // Add a subtle "air release" sound for realism
        setTimeout(() => {
            const noiseOsc = this.audioContext.createOscillator();
            const noiseGain = this.audioContext.createGain();
            
            noiseOsc.connect(noiseGain);
            noiseGain.connect(this.audioContext.destination);
            
            noiseOsc.type = 'square';
            noiseOsc.frequency.setValueAtTime(80 + Math.random() * 40, this.audioContext.currentTime);
            
            noiseGain.gain.setValueAtTime(0, this.audioContext.currentTime);
            noiseGain.gain.linearRampToValueAtTime(0.02, this.audioContext.currentTime + 0.01);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.06);
            
            noiseOsc.start(this.audioContext.currentTime);
            noiseOsc.stop(this.audioContext.currentTime + 0.06);
        }, 20);
    }
    
    /**
     * Play special sound effect for Tetris (4+ lines cleared)
     * Elaborate fanfare with multiple components and harmonics
     */
    playTetris() {
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
    
    /**
     * Play generic power-up activation sound
     * Ascending electronic tones to signal power-up use
     */
    playPowerup() {
        // Power-up activation sound
        this.playTone(800, 0.1, 'square', 0.1);
        setTimeout(() => this.playTone(1000, 0.1, 'square', 0.1), 100);
        setTimeout(() => this.playTone(1200, 0.2, 'sine', 0.08), 200);
    }
    
    /**
     * Play explosion sound effect for dynamite power-up
     * Multi-layered explosion with bass and mid-range components
     */
    playExplosion() {
        // Explosion sound for dynamite
        this.playTone(50, 0.3, 'sawtooth', 0.15);
        setTimeout(() => this.playTone(80, 0.2, 'square', 0.12), 100);
        setTimeout(() => this.playTone(120, 0.15, 'triangle', 0.08), 200);
    }
    
    /**
     * Play digging sound effect for shovel power-up
     * Series of digging sounds with randomized frequencies
     */
    playDig() {
        // Digging sound for shovel
        for (let i = 0; i < 5; i++) {
            setTimeout(() => this.playTone(150 + Math.random() * 50, 0.1, 'sawtooth', 0.06), i * 100);
        }
    }
    
    /**
     * Play trade sound effect for piece exchange power-up
     * Two-tone exchange sound to represent swapping
     */
    playTrade() {
        // Trade sound - two-tone exchange
        this.playTone(600, 0.15, 'triangle', 0.08);
        setTimeout(() => this.playTone(400, 0.15, 'triangle', 0.08), 150);
    }
    
    /**
     * Play time extension sound effect for slow power-up
     * Ascending celestial tones with sparkle effects
     */
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
    
    /**
     * Play stage completion sound effect
     * Victory fanfare with ascending melody
     */
    playStageComplete() {
        // Victory fanfare
        const melody = [523, 659, 784, 1047]; // C, E, G, C
        melody.forEach((note, index) => {
            setTimeout(() => this.playTone(note, 0.3, 'triangle', 0.1), index * 200);
        });
    }
    
    /**
     * Play game over sound effect
     * Sad descending notes to indicate failure
     */
    playGameOver() {
        // Sad descending notes
        const notes = [400, 350, 300, 250];
        notes.forEach((note, index) => {
            setTimeout(() => this.playTone(note, 0.4, 'triangle', 0.08), index * 300);
        });
    }
    
    /**
     * Play escape success sound effect
     * Triumphant ascending scale for successful escape
     */
    playEscape() {
        // Escape success - ascending triumphant notes
        const notes = [262, 330, 392, 523, 659, 784]; // C major scale
        notes.forEach((note, index) => {
            setTimeout(() => this.playTone(note, 0.25, 'sine', 0.1), index * 100);
        });
    }
    
    /**
     * Play purchase confirmation sound effect
     * Two-tone confirmation for successful store purchases
     */
    playPurchase() {
        // Purchase confirmation sound
        this.playTone(600, 0.1, 'triangle', 0.08);
        setTimeout(() => this.playTone(800, 0.15, 'sine', 0.06), 100);
    }
    
    /**
     * Play error sound effect
     * Low sawtooth wave to indicate invalid action
     */
    playError() {
        // Error/invalid action sound
        this.playTone(150, 0.3, 'sawtooth', 0.1);
    }

    /**
     * Play falling sound effect when blocks fall after line clear
     * Descending whoosh effect to simulate falling blocks
     */
    playFalling() {
        // Falling sound - descending whoosh when blocks fall down
        const startFreq = 300;
        const endFreq = 80;
        const duration = 0.6;
        
        if (!this.enabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Use sawtooth for a whooshing effect
        oscillator.type = 'sawtooth';
        
        // Descending frequency sweep (falling effect)
        oscillator.frequency.setValueAtTime(startFreq, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(endFreq, this.audioContext.currentTime + duration);
        
        // Gradual fade in and out
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.06, this.audioContext.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0.06, this.audioContext.currentTime + duration - 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    /**
     * Play crash sound effect when falling blocks settle
     * Deep rumbling crash with multiple frequency components
     */
    playCrash() {
        // Crash sound when lines above fall down after block pops
        // Deep rumbling crash with multiple frequency components
        this.playTone(60, 0.4, 'sawtooth', 0.12);  // Deep bass rumble
        setTimeout(() => this.playTone(45, 0.3, 'square', 0.1), 50);   // Lower frequency thud
        setTimeout(() => this.playTone(80, 0.25, 'sawtooth', 0.08), 100); // Mid-range crash
        setTimeout(() => this.playTone(120, 0.2, 'triangle', 0.06), 150); // Higher frequency settle
        setTimeout(() => this.playTone(35, 0.15, 'square', 0.04), 200);   // Final low thump
    }
}

export default SoundManager;
