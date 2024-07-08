// GameScene3.js

export default class GameScene3 extends Phaser.Scene {

    constructor() {
        super('GameScene3');
        
        // Initialize variables
        this.speed = 5;
        this.coinScore = 0;
        this.player;
        this.enemies;
        this.platforms;
        this.finishText;
        this.coincollectSound;
        this.gameOverText;
        this.gameOver = false;
        this.spaceKey; // Define space key variable
        this.levelLabel; // Define level label variable
    }

    init() {
        // Initialize scene variables
        this.speed = 5;
        this.coinScore = 0;
        this.gameOver = false;
    }

    preload() {
        // Preload assets
        this.load.image('sky', './assets/images/sky.png');
        this.load.image('mountain', './assets/images/mountains.png');
        this.load.image('plant', './assets/images/plant.png');
        this.load.image('trees', './assets/images/trees-1.png');
        this.load.image('ground', './assets/images/platform-1.png');
        this.load.image('platform-small', './assets/images/mini-platform.png');
        this.load.image('platform-large', './assets/images/large-platform.png');
        this.load.image('finish', './assets/images/house.png');
        this.load.image('coins', './assets/images/gold.png');
        this.load.audio('coinCollect', './assets/audio/coinCollect.mp3');
        this.load.audio('music', './assets/audio/bgMusic.mp3');
        this.load.image('obstacle', './assets/images/monster.png');
        this.load.image('game-over', './assets/images/gameover.png');
        this.load.image('level', './assets/images/levelup.png');
        this.load.spritesheet('owlet', './assets/images/owlet.png', { frameWidth: 32, frameHeight: 32 });
    }

    create() {
        // Create assets and set up scene

        // Background images
        this.add.image(0, 0, 'sky').setScrollFactor(0);
        this.add.image(0, 0, 'mountain').setOrigin(0, 0).setScrollFactor(0.25);
        this.add.image(0, 0, 'trees').setOrigin(0, 0).setScrollFactor(0.5);
        this.add.image(0, 0, 'plant').setOrigin(0, -2.4);

        // Sound effects
        this.coincollectSound = this.sound.add('coinCollect');

        // Player sprite and physics
        this.player = this.physics.add.sprite(50, 440, 'owlet', 0);
        this.player.setBounce(0.2);
        this.player.setScale(2);
        this.player.setCollideWorldBounds(true);

        // World bounds
        this.physics.world.bounds.width = this.scale.width * 5.8;

        // Static platforms
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(0, 0, 'ground').setOrigin(0, -2.5).refreshBody();
        this.platforms.create(400, 350, 'platform-small');
        this.platforms.create(800, 250, 'platform-large');
        this.platforms.create(1200, 360, 'platform-small');
        this.platforms.create(1450, 280, 'platform-small'); // Adjusted layout example
        this.platforms.create(1750, 340, 'platform-large'); // Adjusted layout example
        this.platforms.create(2050, 260, 'platform-large'); // Adjusted layout example
        // Additional platforms or adjustments for Level 3

        // Finish line sprite
        this.finish = this.physics.add.sprite(4500, 180, 'finish').setScale(3);
        this.finish.setCollideWorldBounds(true);

        // Finish line text
        this.finishText = this.add.image(405, 150, 'level');
        this.finishText.setVisible(false);
        this.finishText.setScrollFactor(0);

        // Level label
        this.levelLabel = this.add.text(10, 50, 'Level: 3', { fontSize: '35px', fill: '#000' });
        this.levelLabel.setScrollFactor(0);

        // Camera setup
        this.cameras.main.setBounds(0, 0, this.scale.width * 5.8, this.scale.height);
        this.cameras.main.startFollow(this.player);

        // Player animations
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('owlet', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'owlet', frame: 5 }],
            frameRate: 15
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('owlet', { start: 6, end: 10 }),
            frameRate: 10,
            repeat: -1
        });

        // Keyboard cursors
        this.cursors = this.input.keyboard.createCursorKeys();

        // Physics colliders
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.finish, this.platforms);

        // Overlap for finish line
        this.physics.add.overlap(this.player, this.finish, this.finishLine, null, this);

        // Start background music
        this.backgroundMusic = this.sound.add('music');
        this.backgroundMusic.play();

        // Score text
        this.scoreText = this.add.text(10, 16, 'Gold: 0', { fontSize: '35px', fill: '#000' });
        this.scoreText.setVisible(true);
        this.scoreText.setScrollFactor(0);

        // Groups for coins and enemies
        this.coins = this.physics.add.group({
            key: 'coins',
            repeat: 11,
            setXY: { x: 750, y: 0, stepX: 280 }
        });

        this.coins.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        // Group for enemies
        this.enemies = this.physics.add.group({
            key: 'obstacle',
            collideWorldBounds: true,
            repeat: 4,
            setXY: { x: 1200, y: 0, stepX: 550 }
        });

        this.enemies.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        // Physics colliders for coins and enemies
        this.physics.add.collider(this.coins, this.platforms);
        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.collider(this.enemies, this.player, this.hitEnemy, null, this);
        this.physics.add.overlap(this.coins, this.player, this.collectGold, null, this);

        // Game over text
        this.gameOverText = this.add.image(405, 150, 'game-over');
        this.gameOverText.setVisible(false);
        this.gameOverText.setScrollFactor(0);

        // Space key for restart
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        // Update game logic

        // Player movement controls
        if (!this.gameOver) {
            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-300);
                this.player.anims.play('left', true);
            } else if (this.cursors.right.isDown) {
                this.player.setVelocityX(300);
                this.player.anims.play('right', true);
            } else {
                this.player.setVelocityX(0);
                this.player.anims.play('turn');
            }

            // Jumping
            if (this.cursors.up.isDown && this.player.body.touching.down) {
                this.player.setVelocityY(-330);
            }
        }

        // Restart game with spacebar if game over
        if (this.gameOver) {
            this.gameOverText.setVisible(true);
            if (this.spaceKey.isDown) {
                this.scene.restart();
                this.gameOver = false;
            }
        }
    }

    collectGold(player, coins) {
        coins.disableBody(true, true);
        this.coincollectSound.play();
        this.coinScore += 10;
        this.scoreText.setText('Gold: ' + this.coinScore);
        if (this.coins.countActive(true) === 0) {
            this.coins.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });
        }
    }

    finishLine(player, finish) {
        this.physics.pause();
        this.scoreText.setVisible(false);
        this.finishText.setVisible(true);

        // Transition to GameFinishedScene after a delay
        this.time.delayedCall(2000, () => {
            this.scene.start('GameFinishedScene');
        });
    }

    hitEnemy(player, filler) {
        this.physics.pause();
        this.player.setTint(0xff0000);
        this.player.anims.play('turn');
        this.gameOver = true;
    }
}
