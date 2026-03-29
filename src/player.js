import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'dude');
        scene.add.existing(this);
        scene.physics.add.existing(this);

         //  Player physics properties. Give the little guy a slight bounce.
        this.setBounce(0.2);
        this.setCollideWorldBounds(true);

        //  Our player animations, turning, walking left and walking right.
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
        // Inside Player.js, after the constructor
    update(cursors) {
        if (cursors.left.isDown) {
            this.setVelocityX(-160);
            this.anims.play('left', true);
        } 
        else if (cursors.right.isDown) {
            this.setVelocityX(160);
            this.anims.play('right', true);
        } 
        else {
            this.setVelocityX(0);
            this.anims.play('turn');
        }

        if (cursors.up.isDown && this.body.touching.down) {
            this.setVelocityY(-330);
        }
    }
}