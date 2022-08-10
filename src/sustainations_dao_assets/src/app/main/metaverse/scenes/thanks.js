import Phaser from 'phaser';
import BaseScene from './BaseScene'

const bg = 'metaverse/UI_finish.png';

class thanks extends BaseScene {
  constructor() {
    super('thanks');
  }

  clearSceneCache(){
    this.textures.remove('bg');
  }

  preload() {
    this.addLoadingScreen();
    this.clearSceneCache();
    this.load.image('bg', bg);
  }
  
  create() {// add audios
    this.clickSound = this.sound.add('clickSound');
    this.pregameSound = this.sound.add('pregameSound');
    this.pregameSound.play();
    this.background = this.add.image(0, 0, 'bg').setOrigin(0);
    this.add.image(1780, 74, "BtnExit").setOrigin(0).setScrollFactor(0).setScale(0.7)
      .setInteractive()
      .on('pointerdown', () => {
        this.clickSound.play();
        this.pregameSound.stop();
        this.scene.start('menuScene');
      });
  }

}
export default thanks;