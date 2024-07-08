export default class MenuScene extends Phaser.Scene {
    
    constructor() {
        super('MenuScene');
    }
    

    preload()
    {
    this.load.image('start', './assets/images/start.png');
    this.load.image('controls', './assets/images/Player1Instruction.png');
    this.load.image('menu', './assets/images/menuscreen.jpg');
    }

    create()
    {
    //Background 
    this.cameras.main.setBackgroundColor('#FFFFFF');
    //Game Logo
    this.add.image(500, 650, 'logo');
    //Menu screen
    this.add.image(170, 340, 'menu');
    //Player 1 Instruction   
    this.add.image(400, 50, 'controls');
    
    //Start Text
    let start = this.add.sprite(400,480, 'start');
    start.setInteractive();
    start.on('pointerdown', () => this.startButton());
    }
    startButton(pointer, start) {
        this.scene.start('GameScene');
    }
}
