// GameFinishedScene.js

export default class GameFinishedScene extends Phaser.Scene {

    constructor() {
        super('GameFinishedScene');
    }

    create() {
        // Add background or game over image
        this.add.text(400, 300, 'Game Finished!', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);
        
        // Add a button to restart the game or go back to the main menu
        this.input.on('pointerdown', () => {
            this.scene.start('MainMenu'); // Adjust to your main menu scene name
        });
    }
}
