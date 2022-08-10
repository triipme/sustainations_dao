import Phaser from 'phaser';
import BaseScene from './BaseScene'
import gameConfig from '../GameConfig';
import { resetCharacter } from '../GameApi';
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
      resetCharacter().then( (result) => {
        this.resetedCharacter = result;
        successCallback();
      });
    }, this);

    //preload
    this.clearCache();
    this.load.image('bg', bg);
    this.load.image('text', text);
    this.load.image('jungleLocationDetail', jungleLocationDetail);
    this.load.image('cataloniaLocationDetail', cataloniaLocationDetail);
    this.load.spritesheet('selectArea', selectArea, { frameWidth: 249, frameHeight: 400});
    this.load.image("btnBack", btnBack);
  }

  create() {
    // add audios
    this.hoverSound = this.sound.add('hoverSound');
    this.clickSound = this.sound.add('clickSound');

    this.background = this.add.image(0, 0, 'bg').setOrigin(0);
    this.jungleLocationDetail = this.add.image(185, 125, 'jungleLocationDetail')
      .setVisible(false).setInteractive().setScale(0.5);
    this.cataloniaLocationDetail = this.add.image(185, 125, 'cataloniaLocationDetail')
    .setVisible(false).setInteractive().setScale(0.5);
    this.btnBack = this.add.image(40, 25, 'btnBack')
      .setOrigin(0).setInteractive();
    this.btnBack.on('pointerdown', () => {
      this.clickSound.play();
      this.scene.transition({target: 'menuScene', duration: 0 });
    });

    this.selectAreaJungle = this.add.sprite(470, 350, 'selectArea')
      .setScale(0.25)
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
      this.scene.start('selectItemScene', {map: 'jungle'});
    });

    this.selectAreaCatalonia = this.add.sprite(465, 250, 'selectArea')
      .setScale(0.25)
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
      this.scene.start('selectItemScene', {map: 'catalonia1'});
    });

    this.text = this.add.image(65, 425, 'text').setOrigin(0).setScale(0.5);
  }

}
export default selectMap;