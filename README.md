# 🎮 Tetrascape - Escape Puzzle Tetris

Welcome to **Tetrascape**, a unique twist on the classic Tetris game that transforms into an exciting escape-puzzle adventure! Complete level objectives to help your character escape through increasingly challenging levels.

## 🎮 Play Online
**[🕹️ Play Tetrascape Now!](https://tetrascape.apps4net.eu)**

![30-05--2025_23-29](https://github.com/user-attachments/assets/3131b7d6-6472-4950-9ed7-935e468bd7be)


## 🎯 Game Overview

Tetrascape combines traditional Tetris mechanics with escape-game elements. Your goal is not just to clear lines, but to achieve specific objectives within time and block limits to progress through 5 challenging stages. Watch your character move along the escape track below the game board as you make progress toward your goals!

## 🎮 Game Layout & Controls

### Control Scheme
- **Movement**: Arrow keys (←→↓) or WASD
- **Rotation**: Space bar for clockwise rotation
- **Hard Drop**: Shift key for instant piece placement
- **Power-ups**: Number keys 1-4 for activating items
- **Game Controls**: Dedicated buttons for start/pause/restart/sound toggle

### Interface Layout
The game features a modern three-panel layout:
- **Left Panel**: Live piece statistics with authentic Tetris piece graphics
- **Center Panel**: Main game board with character escape track below
- **Right Panel**: Game controls, stage information, next piece preview, and inventory display

### Live Timer Display
The game includes a real-time countdown timer that updates every frame, showing:
- Remaining time in seconds
- Visual progress indicators
- Time bonus calculations for store rewards

## 🕹️ How to Play

### Basic Controls
- **A/D or ←/→**: Move piece left/right
- **S or ↓**: Soft drop (faster fall)
- **W or ↑**: Rotate piece clockwise
- **Q**: Rotate piece counterclockwise
- **Space**: Hard drop (instant drop)

### Power-ups
Use special power-ups to overcome difficult situations:

- **💣 Dynamite** (1 key): Drops the current piece to the bottom and creates a 3x3 explosion around each block, clearing surrounding pieces
- **🔨 Shovel** (2 key): Clears an entire vertical column where your current piece would land
- **🔄 Trade** (3 key): Changes your current piece to a completely new random piece
- **⏰ Extra Time** (4 key): Adds +10 seconds to your time limit for the current stage

## 🏃‍♂️ Character System

Your character appears below the game board and moves along the escape track based on your progress:

- **👤 Waiting**: Character is idle when not actively playing
- **💪 Working**: Character shows effort when you're actively placing pieces and making progress
- **🏃 Escaping**: Character runs toward the exit when close to completing objectives

Each power-up triggers unique character animations:
- Dynamite: Throwing and explosion animation with emoji sequence 💣🧨
- Shovel: Digging animation with emoji sequence ⛏️🕳️
- Trade: Handoff gesture animation with emoji sequence 🤝💱
- Extra Time: Time manipulation effect with emoji sequence ⏰✨

## 🎖️ Stage Progression

### Level Objectives
Each stage has three requirements that must be met within the limits:

| Stage | Score Target | Time Limit | Block Limit | Reward Money |
|-------|-------------|------------|-------------|--------------|
| 1     | 500         | 180s       | 50 blocks   | $100         |
| 2     | 1,000       | 150s       | 45 blocks   | $150         |
| 3     | 1,500       | 135s       | 40 blocks   | $200         |
| 4     | 2,500       | 120s       | 35 blocks   | $300         |
| 5     | 4,000       | 105s       | 30 blocks   | $500         |

### Stage Completion
To advance to the next stage, you must:
1. ✅ Reach the target score
2. ✅ Stay within the time limit
3. ✅ Use fewer blocks than the limit

### Stage Failure
You fail a stage if:
- ❌ Time runs out before reaching the target score
- ❌ You use more blocks than allowed
- ❌ The game board fills up (traditional game over)

## 💰 Store System

After each stage (completed or failed), visit the store to purchase power-ups:

### Power-up Pricing
- **💣 Dynamite**: $50
- **🔨 Shovel**: $75
- **🔄 Trade**: $40
- **⏰ Extra Time**: $60

### Money System
- **Stage Completion Bonus**: Varies by stage ($100-$500)
- **Remaining Time Bonus**: $10 per second left
- **Remaining Blocks Bonus**: $5 per unused block
- **Starting Inventory**: 5 of each power-up (first stage only)

## 🏆 Achievement System

Unlock achievements upon game completion:
- **💎 Μεγαλοαγοραστής**: Accumulate 1000+ total money
- **💣 Bomber**: Own 3+ dynamite power-ups
- **⛏️ Εργάτης**: Own 2+ shovel power-ups
- **🎯 Τέλειος Στόχος**: Complete all 5 stages successfully

## 🎲 Tetris Pieces & Statistics

The game features all 7 standard Tetris pieces with real-time statistics tracking:
- **I-piece** (Red): Long straight line - 4 blocks horizontal
- **O-piece** (Green): 2x2 square
- **T-piece** (Blue): T-shaped - 3 blocks with center extension
- **S-piece** (Yellow): S-shaped - offset horizontal blocks
- **Z-piece** (Magenta): Z-shaped - offset horizontal blocks (opposite of S)
- **J-piece** (Cyan): J-shaped - L-shape rotated
- **L-piece** (Orange): L-shaped - corner piece

### 📊 Live Statistics Panel
The left side of the game displays a comprehensive statistics panel that shows:
- **Piece Graphics**: Mini-canvas renderings of each Tetris piece using the exact same colors and shapes as in the game
- **Usage Count**: How many times each piece has been used in the current stage
- **Percentage Distribution**: Real-time calculation of piece distribution percentages
- **Visual Tracking**: Statistics reset at the start of each new stage

## 📈 Enhanced Scoring System

- **Single line**: 100 points
- **Double lines**: 300 points
- **Triple lines**: 500 points
- **Tetris (4 lines)**: 800 points
- **Soft drop**: 1 point per cell
- **Hard drop**: No points (convenience feature)
- **⏰ Time Bonus**: +2 seconds per line cleared (Tetris earns +8 seconds, doubled to +16 seconds total)
- **🎬 Visual Effects**: Individual block animations when lines are cleared
- **🔊 Audio Feedback**: Realistic bubble pop sounds for each cleared block

## 🆕 Recent Enhancements

### 🎬 Visual & Audio Improvements (Latest Update)
- **Block Pop Animations**: Individual blocks now scale, rotate, fade, and change colors when lines are cleared
- **Realistic Sound Effects**: Added bubble pop synthesis for individual blocks plus falling/crash sounds
- **Enhanced Line Clearing**: Fixed critical bug in gravity simulation - blocks now properly drop after line clears
- **Time Bonus System**: Earn extra time for efficient play - 2 seconds per line cleared, doubled for Tetris
- **Code Optimization**: Renamed classes and files for better organization (TetrascapeGame, SoundManager, PowerUpLogic)

### 🔧 Technical Improvements
- **Improved Gravity Physics**: Fixed multi-line clear bugs where remaining blocks didn't drop correctly
- **Audio System Overhaul**: Added `playBlockPop()`, `playFalling()`, and `playCrash()` methods with Web Audio API synthesis
- **Animation System**: CSS `@keyframes blockPop` with scaling, rotation, and color transitions
- **Performance Optimization**: Better block manipulation algorithms for smoother gameplay
- **File Structure**: Consistent PascalCase naming convention for all class files

## 💡 Strategy Tips

1. **Power-up Management**: Save powerful items like dynamite for critical situations
2. **Time vs. Efficiency**: Balance speed with block conservation
3. **Line Clearing**: Focus on multiple line clears for higher scores
4. **Character Progress**: Watch your character's position to gauge progress
5. **Store Planning**: Budget wisely for power-ups in later stages
6. **Emergency Tactics**: Use shovel to clear dangerous column buildups

## 🎨 Enhanced Features

- **Modern UI**: Glassmorphism design with smooth animations
- **🎬 Visual Block Animations**: Individual blocks scale, rotate, and fade with color transitions when lines are cleared
- **💫 Block Pop Effects**: CSS animations create satisfying visual feedback for each cleared block
- **Visual Feedback**: Character animations respond to your actions
- **Progressive Difficulty**: Each stage increases the challenge
- **Achievement System**: Track your accomplishments
- **Responsive Design**: Works on desktop and mobile devices
- **⏱️ Time Bonus System**: Earn +2 seconds per line cleared (doubled for Tetris clears = 16 seconds total)
- **🎯 Enhanced Line Clearing**: Improved gravity simulation ensures proper block dropping after line clears
- **🔊 Enhanced Audio**: Realistic bubble pop synthesis and falling/crash sound effects
- **Live Statistics**: Real-time piece usage tracking with authentic Tetris piece graphics
- **Canvas-based Graphics**: Mini-canvas elements display exact replicas of game pieces
- **Real-time Updates**: Statistics, timer, and progress indicators update continuously
- **Interactive Controls**: Intuitive button layout with transparent design

## 🔊 Enhanced Sound System

The game features a comprehensive audio experience with realistic sound synthesis:
- **Movement Sounds**: Piece movement, rotation, and dropping (including soft drop)
- **Line Clear Effects**: Different sounds for single lines vs. Tetris (4 lines) with explosive audio
- **🫧 Block Pop Effects**: Individual blocks create realistic bubble pop sounds when lines are cleared
- **🎯 Falling Sounds**: Blocks make falling/whoosh sounds when dropping after line clears
- **💥 Crash Effects**: Impact sounds when blocks land after gravity simulation
- **Power-up Audio**: Unique sounds for each power-up activation
- **Stage Progression**: Victory fanfares and completion sounds
- **Character Actions**: Audio feedback for character animations
- **Web Audio API**: Dynamic sound generation with oscillators and filters for consistent audio experience
- **Toggle Control**: Sound can be enabled/disabled via the 🔊/🔇 button

## 🚀 Getting Started

1. Open `index.html` in your web browser
2. Read the on-screen instructions
3. Start with Stage 1 (you begin with 5 of each power-up)
4. Use your power-ups strategically to complete objectives
5. Visit the store between stages to resupply
6. Progress through all 5 stages to win!

## 🏁 Victory Condition

Complete all 5 stages to achieve ultimate victory! Each stage becomes progressively more challenging, requiring better strategy, faster reflexes, and smarter power-up usage.

---

Good luck, and may you successfully escape through all the stages! 🎉
