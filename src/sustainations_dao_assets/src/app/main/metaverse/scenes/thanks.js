import Phaser from 'phaser';
import BaseScene from './BaseScene'

import {
  gainCharacterExp,
  openInventory,
  createInventory,
  loadCharacter,
  resetCharacterCollectsMaterials,
  saveGameScore,
  getTopOne
} from '../GameApi';

const bg = 'metaverse/UI_finish.png';
const popupWindow = 'metaverse/selectMap/Catalonia_popup.png';

class thanks extends BaseScene {
  constructor() {
    super('thanks');
  }

  clearSceneCache() {
    this.textures.remove('bg', 'popupWindow');
  }

  init (data) {
    this.questDesignId = data.questDesingId;
    
  }

  preload() {
    this.addLoadingScreen();
    this.clearSceneCache();
    this.load.image('bg', bg);
    this.load.rexAwait(function (successCallback, failureCallback) {
      loadCharacter().then((result) => {
        this.characterData = result.ok[1];
        console.log(this.characterData);
        console.log("this.questDesingId ", this.questDesignId)
        if (this.questDesignId != undefined){
          this.load.rexAwait(function (successCallback, failureCallback) {
            saveGameScore(this.questDesignId, this.characterData).then((result) => {
              console.log("saveGame: ", result);
              this.load.rexAwait(function (successCallback, failureCallback) {
                getTopOne(this.questDesignId).then((result) => {
                  console.log("Top one: ", result);
                  successCallback();
                });
              }, this);
              successCallback();
            });
          }, this);
          // let game = saveGameScore(this.questDesignId, this.characterData);
          // console.log("saveQuest: ", game);
          // let top1 = getTopOne(this.questDesignId);
          // console.log("Get top one: ", top1);
        }
        successCallback();
      });
    }, this);
  }

  async create() {// add audios
    this.clickSound = this.sound.add('clickSound');
    this.pregameSound = this.sound.add('pregameSound');
    this.pregameSound.play();
    this.background = this.add.image(0, 0, 'bg').setOrigin(0);
    this.add.image(1185, 50, "BtnExit").setOrigin(0).setScrollFactor(0).setScale(0.7)
      .setInteractive()
      .on('pointerdown', () => {
        this.clickSound.play();
        this.pregameSound.stop();
        this.scene.start('selectMap');
      });
    await createInventory(this.characterData.id);
    resetCharacterCollectsMaterials(this.characterData.id);
    gainCharacterExp(this.characterData);
    // this.inventory = await openInventory(this.characterData.id);
  }

}
export default thanks; 