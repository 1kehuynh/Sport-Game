import Phaser from 'phaser';
import Player from './player.js';
import Enemy from './enemies.js';
import Goals from './goals.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.player = null;
        this.enemy = null;
        this.ball = null;
        this.goalsManager = null;
        this.powerUps = null;
        this.cursors = null;
        this.score = { player: 0, ai: 0 };
        this.gameOver = false;
        this.scoreText = null;
        this.timerText = null;
        this.gravityTimer = null;
        this.startTime = null;
        this.powerUpSpawnTimer = null;
        this.effectTimer = null;
    }

    preload() {
        this.load.image('sky', '/assets/sky.png');
        this.load.image('ground', '/assets/platform.png');
        this.load.image('star', '/assets/star.png');
        this.load.image('bomb', '/assets/bomb.png');
        this.load.spritesheet('dude', '/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    create() {
        // Field (ground)
        this.add.image(400, 300, 'sky');
        const ground = this.physics.add.staticImage(400, 568, 'ground').setScale(2).refreshBody();

        // Ball
        this.ball = this.physics.add.sprite(400, 300, 'bomb');
        this.ball.setBounce(0.8);
        this.ball.setCollideWorldBounds(true);
        this.ball.setDrag(10); // Slight air resistance

        // Goals
        this.goalsManager = new Goals(this, this.ball);

        // Power-ups
        this.powerUps = this.physics.add.group();

        // Players
        this.player = new Player(this, 200, 450);
        this.enemy = new Enemy(this, 600, 450, this.ball);

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.kickKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Score and timer text
        this.scoreText = this.add.text(16, 16, 'Player: 0 | AI: 0', { fontSize: '24px', fill: '#000' });
        this.timerText = this.add.text(600, 16, 'Time: 0', { fontSize: '24px', fill: '#000' });

        // Colliders
        this.physics.add.collider(this.player, ground);
        this.physics.add.collider(this.enemy, ground);
        this.physics.add.collider(this.ball, ground);

        // Overlaps
        this.physics.add.overlap(this.player, this.powerUps, this.collectPowerUp, null, this);


        // Start timer
        this.startTime = this.time.now;
        this.gravityTimer = this.time.addEvent({
            delay: 120000, // 2 minutes
            callback: this.startGravityDecrease,
            callbackScope: this
        });
        this.powerUpSpawnTimer = this.time.addEvent({
            delay: 15000, // Spawn every 15 seconds
            callback: this.spawnPowerUp,
            callbackScope: this,
            loop: true
        });
    }

    update() {
        if (this.gameOver) {
            return;
        }

        // Update player
        this.player.update(this.cursors);

        // Update enemy
        this.enemy.update();

        // Kicking
        if (Phaser.Input.Keyboard.JustDown(this.kickKey) && Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.ball.getBounds())) {
            const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.ball.x, this.ball.y);
            this.ball.setVelocity(Math.cos(angle) * 400, Math.sin(angle) * 400);
        }

        // Update timer
        const elapsed = Math.floor((this.time.now - this.startTime) / 1000);
        this.timerText.setText('Time: ' + elapsed);

        // Decrease gravity after 2 minutes
        if (elapsed > 120) {
            const gravityDecrease = Math.min((elapsed - 120) * 5, 250); // Decrease by 5 per second, max 250
            this.physics.world.gravity.y = 300 - gravityDecrease;
        }
    }

    startGravityDecrease() {
        // Add visual effect: change background or add text
        this.add.text(350, 50, 'Low Gravity Mode!', { fontSize: '32px', fill: '#ff0000' });
    }

    spawnPowerUp() {
        const x = Phaser.Math.Between(100, 700);
        const y = Phaser.Math.Between(100, 400);
        const powerUp = this.powerUps.create(x, y, 'star'); // Using star as power-up sprite
        powerUp.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        powerUp.type = Phaser.Math.RND.pick(['gravityBoost', 'antiGravity']);
        powerUp.setTint(powerUp.type === 'gravityBoost' ? 0x00ff00 : 0xff00ff);
    }

    collectPowerUp(player, powerUp) {
        powerUp.disableBody(true, true);

        if (powerUp.type === 'gravityBoost') {
            // Temporarily increase gravity
            this.physics.world.gravity.y = 500;
            if (this.effectTimer) this.effectTimer.remove();
            this.effectTimer = this.time.addEvent({
                delay: 5000,
                callback: () => { this.physics.world.gravity.y = 300; },
                callbackScope: this
            });
        } else if (powerUp.type === 'antiGravity') {
            // Temporarily reverse gravity
            this.physics.world.gravity.y = -200;
            if (this.effectTimer) this.effectTimer.remove();
            this.effectTimer = this.time.addEvent({
                delay: 10000,
                callback: () => { this.physics.world.gravity.y = 300; },
                callbackScope: this
            });
        }
    }
    
}