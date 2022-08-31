import Phaser from 'phaser';
import BaseScene from './BaseScene'
import gameConfig from '../GameConfig';
import history from "@history";
import { 
  resetCharacter,
  loadCharacter,
  getRemainingTime,
} from '../GameApi';

const bg = 'metaverse/selectMap/background.png';
const text = 'metaverse/selectMap/call_to_action.png';
const selectArea = 'metaverse/selectMap/select-area.png';
const jungleLocationDetail = 'metaverse/selectMap/jungle_location_detail.png';
const cataloniaLocationDetail = 'metaverse/selectMap/catalonia_location_detail.png';
const btnBack = 'metaverse/selectItems/UI_back.png';

class selectMap extends BaseScene {
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
    this.addLoadingScreen();

    this.load.rexAwait(function(successCallback, failureCallback) {
      loadCharacter().then( (result) => {
        this.characterData = result.ok[1];
        console.log(this.characterData);
        successCallback();
      });
    }, this);

    //preload
    this.clearCache();
    this.load.image('bg', bg);
    this.load.image('text', text);
    this.load.image('jungleLocationDetail', jungleLocationDetail);
    this.load.image('cataloniaLocationDetail', cataloniaLocationDetail);
    this.load.spritesheet('selectArea', selectArea, { frameWidth: 498, frameHeight: 800});
    this.load.image("btnBack", btnBack);
  }

  async create() {
    // add audios
    this.hoverSound = this.sound.add('hoverSound');
    this.clickSound = this.sound.add('clickSound');

    this.background = this.add.image(0, 0, 'bg').setOrigin(0);
    this.jungleLocationDetail = this.add.image(247, 167, 'jungleLocationDetail')
      .setVisible(false).setInteractive();
    this.cataloniaLocationDetail = this.add.image(247, 167, 'cataloniaLocationDetail')
    .setVisible(false).setInteractive();
    this.btnBack = this.add.image(40, 25, 'btnBack')
      .setOrigin(0).setInteractive();
    this.btnBack.on('pointerdown', () => {
      this.clickSound.play();
      history.push("/metaverse");
    });
    this.waitingTime = 60;
    this.getRemainingTime = await getRemainingTime(this.waitingTime, this.characterData);

    this.selectAreaJungle = this.add.sprite(627, 467, 'selectArea')
      .setScale(0.18)
      .setInteractive();
    this.selectAreaJungle.on('pointerover', () => {
      this.selectAreaJungle.setFrame(1);
      this.jungleLocationDetail.setVisible(true);
      this.hoverSound.play();
    });
    this.selectAreaJungle.on('pointerout', () => {
      this.selectAreaJungle.setFrame(0);
      this.jungleLocationDetail.setVisible(false);
    });
    this.selectAreaJungle.on('pointerdown', () => {
      this.clickSound.play();
      if (this.getRemainingTime != 0) this.scene.start('exhausted');
      else {
        resetCharacter();
        this.scene.start('selectItemScene', { map: 'jungle' });
      };
    });

    this.selectAreaCatalonia = this.add.sprite(620, 337, 'selectArea')
      .setScale(0.18)
      .setInteractive();
    this.selectAreaCatalonia.on('pointerover', () => {
      this.selectAreaCatalonia.setFrame(1);
      this.cataloniaLocationDetail.setVisible(true);
      this.hoverSound.play();
    });
    this.selectAreaCatalonia.on('pointerout', () => {
      this.selectAreaCatalonia.setFrame(0);
      this.cataloniaLocationDetail.setVisible(false);
    });
    this.selectAreaCatalonia.on('pointerdown', () => {
      this.clickSound.play();
      if (this.getRemainingTime != 0) this.scene.start('exhausted');
      else {
        resetCharacter();
        this.scene.start('selectItemScene', { map: 'catalonia1' });
      };
    });

    this.text = this.add.image(65, 425, 'text').setOrigin(0).setScale(0.7);
  }

}
export default selectMap;