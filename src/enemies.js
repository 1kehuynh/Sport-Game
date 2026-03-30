import Phaser from 'phaser';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, ball) {
        super(scene, x, y, 'dude');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.ball = ball;

        // Enemy physics properties
        this.setBounce(0.2);
        this.setCollideWorldBounds(true);

        // Animations (same as Player)
        scene.anims.create({
            key: 'left',
            frames: scene.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        scene.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        scene.anims.create({
            key: 'right',
            frames: scene.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
    }

    update() {
        // AI logic: move towards ball
        if (this.ball.x < this.x - 10) {
            this.setVelocityX(-160);
            this.anims.play('left', true);
        } else if (this.ball.x > this.x + 10) {
            this.setVelocityX(160);
            this.anims.play('right', true);
        } else {
            this.setVelocityX(0);
            this.anims.play('turn');
        }

        // AI jump if ball is above
        if (this.ball.y < this.y - 20 && this.body.touching.down) {
            this.setVelocityY(-330);
        }

        // AI kicking
        if (Phaser.Geom.Intersects.RectangleToRectangle(this.getBounds(), this.ball.getBounds())) {
            const angle = Phaser.Math.Angle.Between(this.x, this.y, 50, 500); // Towards left goal
            this.ball.setVelocity(Math.cos(angle) * 400, Math.sin(angle) * 400);
        }
    }
}