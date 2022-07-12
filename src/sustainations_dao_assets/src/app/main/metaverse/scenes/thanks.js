import Phaser from 'phaser';
const bg = 'metaverse/UI_finish.png';

class thanks extends Phaser.Scene {
  constructor() {
    super('thanks');
  }

  clearSceneCache(){
    this.textures.remove('ground');
    this.textures.remove('background1');
    this.textures.remove('background2');
    this.textures.remove('background3');
    this.textures.remove('selectAction');
    this.textures.remove('utility');
    this.textures.remove('btnBlank');
    this.textures.remove('obstacle');
  }

  preload() {
    this.clearSceneCache();
    this.load.image('bg', bg);
  }
  
  create() {// add audios
    this.clickSound = this.sound.add('clickSound');
    this.background = this.add.image(0, 0, 'bg').setOrigin(0);
    this.add.image(1780, 74, "BtnExit").setOrigin(0).setScrollFactor(0).setScale(0.7)
      .setInteractive()
      .on('pointerdown', () => {
        this.clickSound.play();
        this.scene.start('menuScene');
      });
  }

}
export default thanks;