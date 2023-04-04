import Phaser from 'phaser';
import gameConfig from '../GameConfig';
import BaseScene from './BaseScene';
import {
  getUserInfo,
  loadQuestItems,
  characterSelectsItems,
  loadItemUrl,
  resetCharacter,
  loadCharacterAwait,
  resetCharacterCollectsMaterials,
  loadQuestItemEngines,
  getAllScenes,
  checkCreatedQuestOfUser,
  getAdminQuest
} from '../GameApi';
import { throws } from 'assert';

const bg = 'metaverse/selectItems/UI_background.png';
const btnBack = 'metaverse/selectItems/UI_back.png';
const btnClear = 'metaverse/selectItems/UI_clear.png';
const btnGo = 'metaverse/selectItems/UI_go.png';
const itembox = 'metaverse/selectItems/UI_itembox.png';

const UI_strength = 'metaverse/selectItems/UI_Strength.png';
const effect = 'metaverse/selectItems/UI_effect.png';
const UI_HP = 'metaverse/selectItems/UI_id_hp.png';
const UI_Mana = 'metaverse/selectItems/UI_id_mana.png';
const UI_Morale = 'metaverse/selectItems/UI_id_morale.png';
const UI_Stamina = 'metaverse/selectItems/UI_id_stamina.png';
const UI_NameCard = 'metaverse/selectItems/UI_id_name.png';
const player = 'metaverse/selectItems/UI_player.png';
const pickItemText = 'metaverse/selectItems/UI_pick_item.png';

const skin1 = 'metaverse/selectItems/item_clothes.png';
const skin2 = 'metaverse/selectItems/item_hat.png';
const skin3 = 'metaverse/selectItems/item_food.png';

const skin4 = 'metaverse/selectItems/item_camera.png';
const skin5 = 'metaverse/selectItems/item_rope_hook.png';
const skin6 = 'metaverse/selectItems/item_bicycle.png';
const UI_Arrow = 'metaverse/selectItems/UI_arrow.png'

class selectItemScene extends BaseScene {
  constructor() {
    super('selectItemScene');
  }

  clearCache() {
    const textures_list = ['bg', 'text', 'selectArea', 'locationDetail', 'player', 'pickItemText',
      'btnGo', 'btnClear'];
    for (const index in textures_list) {
      this.textures.remove(textures_list[index]);
    }
    console.clear();
  }

  init(data) {
    this.map = data.map;
    this.questIdParam = data.questId;

    this.images = [];
    this.currentImageIndex = 0;
    this.imageWidth = 400;
  }


  addTextStat(x, y, text, bonusStat, visible) {
    if (bonusStat != 0) {
      return this.add.text(x, y, text + " + " + bonusStat, { fill: '#fff', align: 'center', fontSize: '27px', fontStyle: 'italic' })
        .setScrollFactor(0).setVisible(visible);
    } else {
      return this.add.text(x, y, text, { fill: '#fff', align: 'center', fontSize: '27px', fontStyle: 'italic' })
        .setScrollFactor(0).setVisible(visible);
    }
  }

  changeStat(index) {
    this.bonusMorale_visible = !this.bonusMorale_visible
    if (index == true) {
      this.bonusHP = 0
      this.bonusStamina = 1
      this.bonusMana = 2
      this.bonusMorale = 3
    } else {
      this.bonusHP = 1
      this.bonusStamina = 1
      this.bonusMana = 0
      this.bonusMorale = 2
    }

  }



  preload() {
    this.addLoadingScreen();
    this.itemNames = [];
    this.itemStrength = [];
    this.load.rexAwait(function (successCallback, failureCallback) {
      getUserInfo().then((result) => {
        this.userInfo = result.ok;
        successCallback();
      });
    }, this);
    this.load.rexAwait(function (successCallback, failureCallback) {
      resetCharacter().then((result) => {
        this.resetedCharacter = result;
        successCallback();
      });
    }, this);

    if (this.map == "quest-design") {
      this.load.rexAwait(function (successCallback, failureCallback) {
        if (this.questIdParam != null) {
          this.questId = this.questIdParam;
          this.load.rexAwait(function (successCallback, failureCallback) {
            getAllScenes(this.questId).then((result) => {
              this.listScene = result;
              console.log(result);
              successCallback();
            });
          }, this);
        }
        else {
          getAdminQuest().then((result) => {
            this.questId = result.id;
            console.log("this.questId: ", this.questId)
            console.log("questIdParam: ", this.questIdParam)
            this.load.rexAwait(function (successCallback, failureCallback) {
              getAllScenes(this.questId).then((result) => {
                this.listScene = result;
                console.log(result);
                successCallback();
              });
            }, this);
          });
        }
        successCallback();
      }, this);
    }

    if (this.map == "engine") {
      this.load.rexAwait(function (successCallback, failureCallback) {
        loadQuestItemEngines(this.map).then((result) => {
          if (result != []) { }
          this.questItems = result;
          console.log("result: ", result);
          for (const index in result) {
            this.itemNames.push(result[index].name);
            this.itemStrength.push(result[index].strengthRequire);
            this.load.image(result[index].name, loadItemUrl(result[index].images));
          };
          //For Engine
          // this.load.rexAwait(function (successCallback, failureCallback) {
          //   getListEventQuest().then((result) => { // for test
          //     this.listEvent = result.listEvent;
          //     this.listScene = result.listScene;
          //     successCallback();
          //   });
          // }, this);
          successCallback();
        });
      }, this)
    }
    else {
      this.load.rexAwait(function (successCallback, failureCallback) {
        loadQuestItems(this.map).then((result) => {
          if (result != []) { }
          this.questItems = result;
          for (const index in result) {
            this.itemNames.push(result[index].name);
            this.itemStrength.push(result[index].strengthRequire);
            this.load.image(result[index].name, loadItemUrl(result[index].images));
          };
          successCallback();
        });
      }, this)
    }

    //preload
    this.clearCache();
    this.load.image("bg", bg);
    this.load.image("UI_strength", UI_strength);
    this.load.image("effect", effect);
    this.load.image("UI_HP", UI_HP);
    this.load.image("UI_Mana", UI_Mana);
    this.load.image("UI_Morale", UI_Morale);
    this.load.image("UI_Stamina", UI_Stamina);
    this.load.image("UI_NameCard", UI_NameCard);
    this.load.image("player", player);
    this.load.image("btnBack", btnBack);
    this.load.image("pickItemText", pickItemText);
    this.load.spritesheet("itembox", itembox, { frameWidth: 237, frameHeight: 185 });
    this.load.spritesheet("btnClear", btnClear, { frameWidth: 339, frameHeight: 141 });
    this.load.spritesheet("btnGo", btnGo, { frameWidth: 339, frameHeight: 141 });

    this.load.image("skin1", skin1);
    this.load.image("skin2", skin2);
    this.load.image("skin3", skin3);

    this.load.image("skin4", skin4);
    this.load.image("skin5", skin5);
    this.load.image("skin6", skin6);

    this.load.image("UI_Arrow", UI_Arrow)
  }

  //async 
  async create(data) {
    // load character strength
    this.characterData = await loadCharacterAwait();
    console.log("Character: ", this.characterData);
    this.characterStrength = this.characterData.strength;
    // add audios
    this.hoverSound = this.sound.add('hoverSound');
    this.clickSound = this.sound.add('clickSound');

    this.add.image(0, 0, 'bg').setOrigin(0);
    this.btnBack = this.add.image(40, 35, 'btnBack')
      .setOrigin(0).setInteractive();
    this.btnBack.on('pointerdown', () => {
      this.clickSound.play();
      this.scene.transition({ target: 'selectMap', duration: 0 });
    });
    let vector_player = -50
    this.add.image(120 + vector_player, 0, 'effect').setOrigin(0);
    this.add.image(280 + vector_player, 143, 'player').setOrigin(0);
    this.add.image(280 + vector_player, 260, 'UI_strength').setOrigin(0).setScale(0.55); //default 390, 260
    // strength text
    this.strengthText = this.add.text(280 + vector_player + 30, 303, String(this.characterStrength), { fill: '#fff', align: 'center', fontSize: '27px', fontStyle: 'italic' })
      .setScrollFactor(0); //default 420, 303

    this.bonusHP = 0
    this.bonusStamina = 0
    this.bonusMana = 0
    this.bonusMorale = 0
    this.changeStat(0)

    this.flagBonus = false

    this.strengthTextHP = this.addTextStat(35, 167, String(7), this.bonusHP, true, this.strengthTextHP)
    this.strengthTextStamina = this.addTextStat(35, 242, String(7), this.bonusStamina, true, this.strengthTextStamina)
    this.strengthTextMana = this.addTextStat(35, 317, String(7), this.bonusMana, true, this.strengthTextMana)
    this.strengthTextMorale = this.addTextStat(35, 392, String(7), this.bonusMorale, true, this.strengthTextMorale)

    this.add.image(35, 100, 'UI_NameCard').setOrigin(0);
    this.add.text(105, 117, 'Trekker', { fill: '#000', align: 'center', fontSize: '9px', font: 'Arial' })
    this.add.text(105, 135, this.userInfo.profile[0].username, { fill: '#000', align: 'center', font: '15px Arial' })
    this.add.image(35, 175, 'UI_HP').setOrigin(0);
    this.add.image(35, 250, 'UI_Stamina').setOrigin(0);
    this.add.image(35, 325, 'UI_Mana').setOrigin(0);
    this.add.image(35, 400, 'UI_Morale').setOrigin(0);

    let move_skin = 230

    this.add.sprite(300 + move_skin, this.cameras.main.height / 2, "itembox").setScale(0.67, 2)
    // this.images.push(this.add.image(300 + move_skin, this.cameras.main.height / 2, 'skin1').setVisible(true));
    // this.images.push(this.add.image(300 + move_skin, this.cameras.main.height / 2 - 100, 'skin2').setVisible(true));
    // this.images.push(this.add.image(300 + move_skin, this.cameras.main.height / 2 + 100, 'skin3').setVisible(true));
    this.indexSets = 0
    this.visibleIndexSets = []
    this.visibleIndexSets = true
    this.startChange = false
    this.set1 = []
    this.set2 = []
    this.set3 = []
    this.set1[this.indexSets] = this.add.image(300 + move_skin, this.cameras.main.height / 2, 'skin1').setVisible(this.visibleIndexSets)
    this.set2[this.indexSets] = this.add.image(300 + move_skin, this.cameras.main.height / 2 - 100, 'skin2').setVisible(this.visibleIndexSets)
    this.set3[this.indexSets] = this.add.image(300 + move_skin, this.cameras.main.height / 2 + 100, 'skin3').setVisible(this.visibleIndexSets)

    this.set1[this.indexSets + 1] = this.add.image(300 + move_skin, this.cameras.main.height / 2, 'skin4').setVisible(!this.visibleIndexSets)
    this.set2[this.indexSets + 1] = this.add.image(300 + move_skin, this.cameras.main.height / 2 - 100, 'skin5').setVisible(!this.visibleIndexSets)
    this.set3[this.indexSets + 1] = this.add.image(300 + move_skin, this.cameras.main.height / 2 + 100, 'skin6').setVisible(!this.visibleIndexSets)

    this.arrow = this.add.image(320 + move_skin, this.cameras.main.height / 2 + 200, 'UI_Arrow').setInteractive()
    this.arrow.flipX = true
    this.arrow.on('pointerover', () => {
      console.log("Click over")
      this.hoverSound.play()
    });
    this.arrow.on('pointerdown', (pointer) => {
      this.visibleIndexSets = !this.visibleIndexSets;
      this.startChange = true
      this.flagBonus = true
      console.log("Click down");
    });

    this.arrow.on('pointerout', function (pointer) {

      console.log("Click out")

    });

    this.arrowLeft = this.add.image(280 + move_skin, this.cameras.main.height / 2 + 200, 'UI_Arrow').setInteractive()
    this.arrowLeft.on('pointerover', () => {
      console.log("Click over")
      this.hoverSound.play()
    });
    this.arrowLeft.on('pointerdown', (pointer) => {
      this.visibleIndexSets = !this.visibleIndexSets;
      this.startChange = true
      this.flagBonus = true
      console.log("Click down");
    });
    this.arrowLeft.on('pointerout', function (pointer) {
      console.log("Click out")
    });



    this.hp = this.makeBar(107, 210, 100, 15, 0x74e044);
    this.stamina = this.makeBar(107, 210 + 75, 100, 15, 0xcf315f);
    this.mana = this.makeBar(107, 210 + 150, 100, 15, 0xc038f6);
    this.morale = this.makeBar(107, 210 + 225, 100, 15, 0x63dafb);

    resetCharacterCollectsMaterials(this.characterData.id);
    this.setValue(this.hp, this.characterData.currentHP / this.characterData.maxHP * 100);
    this.setValue(this.stamina, this.characterData.currentStamina / this.characterData.maxStamina * 100);
    this.setValue(this.mana, this.characterData.currentMana / this.characterData.maxMana * 100);
    this.setValue(this.morale, this.characterData.currentMorale / this.characterData.maxMorale * 100);

    this.add.image(823, 47, 'pickItemText').setOrigin(0);
    this.gridItem = [];
    for (let row = 0; row <= 3; row++) {
      for (let col = 0; col <= 3; col++) {
        this.gridItem.push(
          this.add.sprite(500 + 145 * (col + 1), 111 * (row + 1), "itembox").setOrigin(0).setInteractive().setScale(0.67)
        );
        if (this.itemNames[col + row * 4] == undefined) {
          this.gridItem[col + row * 4].setFrame(2);
        }
        this.gridItem[col + row * 4].isSelected = false;
        this.gridItem[col + row * 4].on('pointerdown', () => {
          this.clickSound.play();
          if (this.gridItem[col + row * 4].isSelected == false && this.itemNames[col + row * 4] != undefined && this.characterStrength - this.itemStrength[col + row * 4] > 0) {
            this.gridItem[col + row * 4].setFrame(1);
            this.gridItem[col + row * 4].isSelected = !this.gridItem[col + row * 4].isSelected;
            this.characterStrength -= this.itemStrength[col + row * 4];
          } else if (this.gridItem[col + row * 4].isSelected == true && this.itemNames[col + row * 4] != undefined) {
            this.gridItem[col + row * 4].setFrame(0);
            this.gridItem[col + row * 4].isSelected = !this.gridItem[col + row * 4].isSelected;
            this.characterStrength += this.itemStrength[col + row * 4];
          }
          this.strengthText.setText(String(this.characterStrength));
        });
        this.add.image(580 + 145 * (col + 1), 60 + 111 * (row + 1), this.itemNames[col + row * 4]);
      }
    }
    this.btnClear = this.add.sprite(733, 580, "btnClear")
      .setOrigin(0).setInteractive().setScale(0.67);
    this.btnClear.on('pointerover', () => {
      this.btnClear.setFrame(1);
      this.hoverSound.play()
    });
    this.btnClear.on('pointerout', () => {
      this.btnClear.setFrame(0);
    });
    this.btnClear.on('pointerdown', () => {
      this.clickSound.play();
      for (const i in this.itemNames) {
        this.gridItem[i].setFrame(0);
        this.gridItem[i].isSelected = false;
      }
      this.characterStrength = this.characterData.strength;
      this.strengthText.setText(String(this.characterStrength));
    });

    this.btnGo = this.add.sprite(933, 580, "btnGo")
      .setOrigin(0).setInteractive().setScale(0.67);
    this.btnGo.on('pointerover', () => {
      this.btnGo.setFrame(1);
      this.hoverSound.play()
    });
    this.btnGo.on('pointerout', () => {
      this.btnGo.setFrame(0);

    });

    this.btnGo.on('pointerdown', async () => {
      this.clickSound.play();
      switch (data.map) {
        case 'catalonia1':
          this.scene.start('catalonia_scene1');
          break;
        case 'jungle':
          this.scene.start('jungle_scene1');
          break;
        case 'lava':
          this.scene.start('lava_scene1');
          break;
        case 'lake':
          this.scene.start('lake_scene1');
          break;
        case 'quest-design':
          // this.scene.start('BaseEngine', {  listScene: await listSceneQuests("qe1")});
          // this.scene.start('Engine', {listScene: this.listScene, listEvent: this.listEvent});
          this.scene.start('Test', { listScene: this.listScene, listEvent: this.listEvent });
          break;
        default:
          console.log('invalid map name');
      }
      const returnValue = [];
      for (let idx = 0; idx < this.itemNames.length; idx++) {
        if (this.gridItem[idx].isSelected == true) {
          returnValue.push(this.questItems[idx].id);
        }
      };
      characterSelectsItems(this.characterData.id, returnValue);
      console.log(returnValue);
    });
  }

  // Update the carousel
  update() {
    if (this.visibleIndexSets == false) {
      this.set1[this.indexSets].setVisible(false)
      this.set2[this.indexSets].setVisible(false)
      this.set3[this.indexSets].setVisible(false)
      this.set1[this.indexSets + 1].setVisible(true)
      this.set2[this.indexSets + 1].setVisible(true)
      this.set3[this.indexSets + 1].setVisible(true)
      this.startChange = false

      this.strengthTextHP.setVisible(false)
      this.strengthTextStamina.setVisible(false)
      this.strengthTextMana.setVisible(false)
      this.strengthTextMorale.setVisible(false) 
      this.changeStat(this.visibleIndexSets)
      this.strengthTextHP = this.addTextStat(35, 167, String(this.characterData.currentHP), this.bonusHP, true)
      this.strengthTextStamina = this.addTextStat(35, 242, String(this.characterData.currentStamina), this.bonusStamina,true)
      this.strengthTextMana = this.addTextStat(35, 317, String(this.characterData.currentMana), this.bonusMana,true)
      this.strengthTextMorale = this.addTextStat(35, 392, String(this.characterData.currentMorale), this.bonusMorale,true)
   
    }
    if (this.visibleIndexSets == true) {
      this.set1[this.indexSets].setVisible(true)
      this.set2[this.indexSets].setVisible(true)
      this.set3[this.indexSets].setVisible(true)
      this.set1[this.indexSets + 1].setVisible(false)
      this.set2[this.indexSets + 1].setVisible(false)
      this.set3[this.indexSets + 1].setVisible(false)
      this.startChange = false

      this.strengthTextHP.setVisible(false)
      this.strengthTextStamina.setVisible(false)
      this.strengthTextMana.setVisible(false)
      this.strengthTextMorale.setVisible(false) 
      this.changeStat(this.visibleIndexSets)
      this.strengthTextHP = this.addTextStat(35, 167, String(this.characterData.currentHP), this.bonusHP, true)
      this.strengthTextStamina = this.addTextStat(35, 242, String(this.characterData.currentStamina), this.bonusStamina,true)
      this.strengthTextMana = this.addTextStat(35, 317, String(this.characterData.currentMana), this.bonusMana,true)
      this.strengthTextMorale = this.addTextStat(35, 392, String(this.characterData.currentMorale), this.bonusMorale,true)

    }

  }
}

export default selectItemScene;