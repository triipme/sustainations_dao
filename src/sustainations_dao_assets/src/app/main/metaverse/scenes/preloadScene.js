import Phaser from "phaser";
import gameConfig from '../GameConfig';

const logo = 'images/logo/sustainations-logo.png';
const loading = 'metaverse/loading/loadingSprite.png';

class preloadScene extends Phaser.Scene {
  constructor() {
    super("preloadScene");
  }

  preload() {
    // assets global uses across scenes
    this.load.image('logo', logo);
    this.load.spritesheet("loading", loading, {
      frameWidth: 630,
      frameHeight: 637
    });
  }

  create() {
    this.scene.start('initializing');
  }
}
export default preloadScene;
