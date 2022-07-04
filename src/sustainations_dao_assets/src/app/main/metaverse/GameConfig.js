import JungleScene from './scenes/JungleScene';
import ReadyScene from './scenes/ReadyScene';

const gameConfig = {
  type: Phaser.AUTO,
  parent: 'sustainations-game',
  scale: {
    width: 1920,
    height: 1080,
    pixelArt: true,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 2000 },
      debug: false
    }
  },
  scene: [ReadyScene, JungleScene]
};

export default gameConfig;
