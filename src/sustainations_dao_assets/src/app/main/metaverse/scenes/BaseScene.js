import Phaser from "phaser";
import gameConfig from '../GameConfig';

class BaseScene extends Phaser.Scene {
  constructor(key) {
    super(key);
  }
  addLoadingScreen() {
    //loading screen
    this.add.image(
      gameConfig.scale.width/2, gameConfig.scale.height/2 - 35, 'logo'
    ).setOrigin(0.5, 0.5).setScale(0.15);
    this.anims.create({
      key: 'loading-anims',
      frames: this.anims.generateFrameNumbers("loading", {start: 0, end: 11}),
      frameRate: 12,
      repeat: -1
    });
    this.add.sprite(
      gameConfig.scale.width/2, gameConfig.scale.height/2 + 100, "loading"
    ).setScale(0.05).play('loading-anims');
  }

  makeBar(x, y, width, height, color) {
    let bar = this.add.graphics();
    bar.fillStyle(color, 1);
    bar.fillRect(0, 0, width, height);
    bar.x = x;
    bar.y = y;
    return bar;
  }
  setValue(bar,percentage) {
    bar.scaleX = percentage/100;
  }
}
export default BaseScene;
