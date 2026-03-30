import Phaser from 'phaser';

export default class Goals{
    constructor(scene, ball) {
        this.scene = scene;
        this.ball = ball;
        this.goals = null;
        this.createGoals();
        this.setupOverlaps();
    }

    createGoals() {
        this.goals = this.scene.physics.add.staticGroup();
        // Left goal (AI's goal)
        const leftGoal = this.goals.create(50, 500, null).setDisplaySize(20, 100).refreshBody();
        // Right goal (Player's goal)
        const rightGoal = this.goals.create(750, 500, null).setDisplaySize(20, 100).refreshBody();

        // Draw goal graphics
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0xffffff);
        graphics.fillRect(40, 450, 20, 100);
        graphics.fillRect(740, 450, 20, 100);
    }

    setupOverlaps() {
        if (!this.ball) {
            console.warn('Goals setupOverlaps called before ball exists');
            return;
        }
        this.scene.physics.add.overlap(this.ball, this.goals, this.scoreGoal, null, this);
    }

    scoreGoal(ball, goal) {
        // Determine which goal
        if (goal.x < 400) {
            // AI scored
            this.scene.score.ai++;
        } else {
            // Player scored
            this.scene.score.player++;
        }

        this.scene.scoreText.setText('Player: ' + this.scene.score.player + ' | AI: ' + this.scene.score.ai);

        // Reset ball
        this.scene.ball.setPosition(400, 300);
        this.scene.ball.setVelocity(0, 0);

        // Check win condition
        if (this.scene.score.player >= 3 || this.scene.score.ai >= 3) {
            this.scene.gameOver = true;
            this.scene.add.text(300, 250, this.scene.score.player >= 3 ? 'You Win!' : 'AI Wins!', { fontSize: '48px', fill: '#000' });
        }
    }
}