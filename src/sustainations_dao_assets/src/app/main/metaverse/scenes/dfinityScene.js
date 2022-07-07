import Phaser from 'phaser';
import gameConfig from '../GameConfig';
const bg1 = 'metaverse/loading/loading1.png';
const logo = 'images/logo/sustainations-logo.png';
const loading = 'metaverse/loading/loading-text.png';

class dfinityScene extends Phaser.Scene {
  constructor() {
    super('dfinityScene');
  }

  preload() {
    this.load.image('bg1', bg1);
    this.load.image('logo', logo);
    this.load.image('loading', loading);
  }

  create() {
    this.add.image(0, 0, 'bg1').setOrigin(0,0);
    this.time.addEvent({
      delay: 4000,
      callback: () => {
        this.scene.transition({target: 'menuScene', duration: 0 })
      },
      callbackScope: this
    });
  }

}
export default dfinityScene;