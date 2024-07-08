// main.js

// Import necessary scenes
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import GameScene2 from './scenes/GameScene2.js';
import GameScene3 from './scenes/GameScene3.js'; // Import GameScene3
import GameFinishedScene from './scenes/GameFinishedScene.js'; // Import GameFinishedScene

// Configuration object for Phaser game
const config = {
    type: Phaser.AUTO,
    parent: 'game', // Make sure this matches your HTML div id
    width: 800,
    height: 640,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 250 },
        }
    },
    scene: [MenuScene, GameScene, GameScene2, GameScene3, GameFinishedScene] // Add GameScene3 to the scene list
};

// Create a new Phaser game instance
const game = new Phaser.Game(config);
