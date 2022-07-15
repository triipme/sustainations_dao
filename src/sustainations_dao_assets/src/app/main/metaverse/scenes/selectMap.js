import Phaser from 'phaser';
import gameConfig from '../GameConfig';
const bg = 'metaverse/selectMap/background.png';
const text = 'metaverse/selectMap/call_to_action.png';
const selectArea = 'metaverse/selectMap/select-area.png';
const locationDetail = 'metaverse/selectMap/location_detail.png';
const btnBack = 'metaverse/selectItems/UI_back.png';

class selectMap extends Phaser.Scene {
  constructor() {
    super('selectMap');
  }

  clearCache() {
    const textures_list = ["bg", "welcomeText", 'introduction_btn', 'bootcamp_btn', 'departure_btn', 'land_btn', 'quest_btn'];
    for (const index in textures_list){
      this.textures.remove(textures_list[index]);
    }
    console.clear();
  }

  preload() {
    //loading screen
    this.add.image(
      gameConfig.scale.width/2, gameConfig.scale.height/2 - 50, 'logo'
    ).setOrigin(0.5, 0.5).setScale(0.26);
    this.anims.create({
      key: 'loading-anims',
      frames: this.anims.generateFrameNumbers("loading", {start: 0, end: 11}),
      frameRate: 12,
      repeat: -1
    });
    this.add.sprite(
      gameConfig.scale.width/2, gameConfig.scale.height/2 + 150, "loading"
    ).setScale(0.07).play('loading-anims');
    //preload
    this.clearCache();
    this.load.image('bg', bg);
    this.load.image('text', text);
    this.load.image('locationDetail', locationDetail);
    this.load.spritesheet('selectArea', selectArea, { frameWidth: 498, frameHeight: 800});
    this.load.image("btnBack", btnBack);
  }

  create() {
    // add audios
    this.hoverSound = this.sound.add('hoverSound');
    this.clickSound = this.sound.add('clickSound');

    this.background = this.add.image(0, 0, 'bg').setOrigin(0);
    this.locationDetail = this.add.image(370, 250, 'locationDetail')
      .setVisible(false)
      .setInteractive();
    this.btnBack = this.add.image(80, 50, 'btnBack')
      .setOrigin(0).setInteractive();
    this.btnBack.on('pointerdown', () => {
      this.clickSound.play();
      this.scene.transition({target: 'menuScene', duration: 0 });
    });
    this.selectArea = this.add.sprite(930, 740, 'selectArea')
      .setScale(0.3)
      .setInteractive();
    this.selectArea.on('pointerover', () => {
      this.selectArea.setFrame(1);
      this.locationDetail.setVisible(true);
      this.hoverSound.play();
    });
    this.selectArea.on('pointerout', () => {
      this.selectArea.setFrame(0);
      this.locationDetail.setVisible(false);
    });
    this.selectArea.on('pointerdown', () => {
      this.clickSound.play();
      this.scene.transition({target: 'selectItemScene', duration: 0 });
    });

    this.text = this.add.image(130, 850, 'text').setOrigin(0);
  }

}
export default selectMap;