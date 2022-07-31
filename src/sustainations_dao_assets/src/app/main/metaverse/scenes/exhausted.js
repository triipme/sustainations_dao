import Phaser from 'phaser';
import gameConfig from '../GameConfig';
const exhausted_text = 'metaverse/exhausted.png';
const btnBlank = 'metaverse/scenes/selection.png';
const BtnExit = 'metaverse/scenes/UI_exit.png';
const playagain_text = 'metaverse/playagain.png';

class exhausted extends Phaser.Scene {
  constructor() {
    super('exhausted');
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
    this.load.image('exhausted_text', exhausted_text);
    this.load.spritesheet('btnBlank', btnBlank, { frameWidth: 1102, frameHeight: 88});
    this.load.image('BtnExit', BtnExit);
    this.load.image('playagain_text', playagain_text);
  }
  
  create() {// add audios
    this.clickSound = this.sound.add('clickSound');
    // this.pregameSound = this.sound.add('pregameSound');
    // this.pregameSound.play();
    this.exhausted_text = this.add.image(gameConfig.scale.width/2, gameConfig.scale.height/4, 'exhausted_text');
    this.add.image(1780, 74, "BtnExit").setOrigin(0).setScrollFactor(0).setScale(0.7)
      .setInteractive()
      .on('pointerdown', () => {
        // this.clickSound.play();
        // this.pregameSound.stop();
        this.scene.start('menuScene');
      });
    this.playagain = this.add.sprite(gameConfig.scale.width/2, gameConfig.scale.height/2, 'btnBlank');
    this.playagain.setInteractive().setScrollFactor(0);
    this.playagain.on('pointerover', () => {
      this.playagain.setFrame(1);
      // this.hoverSound.play();
    });
    this.playagain.on('pointerout', () => {
      this.playagain.setFrame(0);
    });
    this.playagain.on('pointerdown', () => {
      this.clickSound.play();
      this.scene.start('selectMap');
    });
    this.playagain_text = this.add.image(gameConfig.scale.width/2, gameConfig.scale.height/2, 'playagain_text').setScale(0.3);
  }

}
export default exhausted;