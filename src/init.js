import Phaser from "phaser";
import GameScene from "./menu.js";    
var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT, // This is the magic part
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,  // Your logical game width
        height: 600  // Your logical game height
    },
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [GameScene]         
};

var game = new Phaser.Game(config);