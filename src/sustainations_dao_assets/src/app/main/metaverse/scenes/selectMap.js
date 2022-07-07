import Phaser from 'phaser';
const bg = 'metaverse/selectMap/background.png'
const text = 'metaverse/selectMap/call_to_action.png'
const selectArea = 'metaverse/selectMap/select-area.png'
const locationDetail = 'metaverse/selectMap/location_detail.png'

class selectMap extends Phaser.Scene {
  constructor() {
    super('selectMap');
  }

  clearCache() {
    const textures_list = ["bg", "welcomeText", 'introduction_btn', 'bootcamp_btn', 'departure_btn', 'land_btn', 'quest_btn'];
    for (const index in textures_list){
      this.textures.remove(textures_list[index]);
    }
  }

  preload() {
    this.clearCache();
    this.load.image('bg', bg);
    this.load.image('text', text);
    this.load.image('locationDetail', locationDetail);
    this.load.spritesheet('selectArea', selectArea, { frameWidth: 498, frameHeight: 800});
  }

  create() {
    this.background = this.add.image(0, 0, 'bg').setOrigin(0);
    this.locationDetail = this.add.image(370, 250, 'locationDetail')
      .setVisible(false)
      .setInteractive();

    this.selectArea = this.add.sprite(930, 740, 'selectArea')
      .setScale(0.3)
      .setInteractive();
    this.selectArea.on('pointerover', () => {
      this.selectArea.setFrame(1);
      this.locationDetail.setVisible(true);
    });
    this.selectArea.on('pointerout', () => {
      this.selectArea.setFrame(0);
      this.locationDetail.setVisible(false);
    });
    this.selectArea.on('pointerdown', () => {
      this.scene.transition({target: 'selectItemScene', duration: 0 });
    });

    this.text = this.add.image(130, 850, 'text').setOrigin(0);
  }

}
export default selectMap;