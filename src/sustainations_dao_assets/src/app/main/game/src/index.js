import Scene1 from './scenes/scene1';
import greetingScene from './scenes/greetingScene';
import selectItemScene from './scenes/selectItemScene';
import dfinityScene from './scenes/dfinityScene';
import Phaser from 'phaser';


let config = {
    type: Phaser.AUTO,
    // parent: 'phaser-example',
    parent: 'main-game', 
    scale: {
        width: 1920,
        height: 1080,
        pixelArt: true,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    // backgroundColor: '#a3c2c2',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 2000 },
            debug: false
        }
    },
    scene: [dfinityScene, greetingScene, selectItemScene, Scene1]
};
const game = new Phaser.Game(config);
export default game;