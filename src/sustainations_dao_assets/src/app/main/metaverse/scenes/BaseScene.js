import Phaser from "phaser";

class BaseScene extends Phaser.Scene {
  constructor(key) {
    super(key);
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
