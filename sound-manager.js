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

    playLineClearStart() {
        // Sound that plays at the beginning of line clear sequence
        this.playTone(500, 0.1, 'square', 0.08);
    }

    playLineClearComplete() {
        // Sound that plays when all blocks in lines have popped
        setTimeout(() => this.playTone(400, 0.15, 'sine', 0.1), 0);
        setTimeout(() => this.playTone(500, 0.15, 'sine', 0.1), 50);
        setTimeout(() => this.playTone(600, 0.15, 'sine', 0.1), 100);
        setTimeout(() => this.playTone(700, 0.2, 'sine', 0.1), 150);
    }

    playBlockPop() {
        // Individual block pop sound - short and satisfying
        const frequency = 300 + Math.random() * 200; // Randomize frequency slightly
        this.playTone(frequency, 0.08, 'triangle', 0.06);
        // Add a subtle higher harmonic for sparkle
        setTimeout(() => this.playTone(frequency * 1.5, 0.05, 'sine', 0.03), 10);
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
        setTimeout(() => this.playTone(80, 0.2, 'square', 0.12), 100);
        setTimeout(() => this.playTone(120, 0.15, 'triangle', 0.08), 200);
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

    playBlockPop() {
        // Bubble pop sound - quick pitch drop with resonant quality
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

    playLineClearStart() {
        // Sound that plays at the beginning of line clear sequence
        this.playTone(500, 0.1, 'square', 0.08);
    }

    playLineClearComplete() {
        // Sound that plays when all blocks in lines have popped
        setTimeout(() => this.playTone(400, 0.15, 'sine', 0.1), 0);
        setTimeout(() => this.playTone(500, 0.15, 'sine', 0.1), 50);
        setTimeout(() => this.playTone(600, 0.15, 'sine', 0.1), 100);
        setTimeout(() => this.playTone(700, 0.2, 'sine', 0.1), 150);
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

export default SoundManager;
