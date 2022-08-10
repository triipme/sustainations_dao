import Phaser from 'phaser';
import gameConfig from '../GameConfig';
import BaseScene from './BaseScene';
import { 
  loadQuestItems, 
  loadCharacter,
  characterSelectsItems,
  loadItemUrl
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

class selectItemScene extends BaseScene {
  constructor() {
    super('selectItemScene');
  }

  clearCache() {
    const textures_list = ['bg', 'text', 'selectArea', 'locationDetail', 'player', 'pickItemText',
    'btnGo', 'btnClear'];
    for (const index in textures_list){
      this.textures.remove(textures_list[index]);
    }
    console.clear();
  }

  init(data) {
    this.map = data.map;
  }

  preload() {
    this.itemNames = [];
    this.itemStrength = [];
    this.load.rexAwait(function(successCallback, failureCallback) {
      loadCharacter().then( (result) => {
        this.characterData = result.ok[1];
        console.log(this.characterData);
        successCallback();
      });
    }, this);
    this.load.rexAwait(function(successCallback, failureCallback) {
      loadQuestItems(this.map).then( (result) => {
        this.questItems = result;
        for(const index in result){
          this.itemNames.push(result[index].name);
          this.itemStrength.push(result[index].strengthRequire);
          this.load.image(result[index].name, loadItemUrl(result[index].images));
        };
        successCallback();
      });
    }, this);
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
  }

  //async 
  async create(data) {
    // load character strength
    this.characterStrength = this.characterData.strength;
    // add audios
    this.hoverSound = this.sound.add('hoverSound');
    this.clickSound = this.sound.add('clickSound');

    this.add.image(0, 0, 'bg').setOrigin(0);
    this.btnBack = this.add.image(80, 50, 'btnBack')
      .setOrigin(0).setInteractive();
    this.btnBack.on('pointerdown', () => {
      this.clickSound.play();
      this.scene.transition({target: 'selectMap', duration: 0 });
    });
    this.add.image(180, 0, 'effect').setOrigin(0);
    this.add.image(420, 215, 'player').setOrigin(0);
    this.add.image(585, 390, 'UI_strength').setOrigin(0).setScale(0.55);
    // strength text
    this.strengthText = this.add.text(630, 455, String(this.characterStrength), { fill: '#fff', align: 'center', fontSize: '40px', fontStyle: 'italic' })
      .setScrollFactor(0);

    this.add.image(50, 200, 'UI_NameCard').setOrigin(0);
    this.add.image(50, 320, 'UI_HP').setOrigin(0);
    this.add.image(50, 440, 'UI_Stamina').setOrigin(0);
    this.add.image(50, 560, 'UI_Mana').setOrigin(0);
    this.add.image(50, 680, 'UI_Morale').setOrigin(0);

    this.hp = this.makeBar(158, 372, 150, 22, 0x74e044);
    this.stamina =  this.makeBar(158, 372+120, 150, 22, 0xcf311f);
    this.mana = this.makeBar(158, 372+240, 150, 22, 0xc038f6);
    this.morale = this.makeBar(158, 372+360, 150, 22, 0x63dafb);

    this.setValue(this.hp, this.characterData.currentHP/this.characterData.maxHP*100);
    this.setValue(this.stamina, this.characterData.currentStamina/this.characterData.maxStamina*100);
    this.setValue(this.mana, this.characterData.currentMana/this.characterData.maxMana*100);
    this.setValue(this.morale, this.characterData.currentMorale/this.characterData.maxMorale*100);

    this.add.image(1234, 70, 'pickItemText').setOrigin(0);
    this.gridItem = [];
    for (let row = 0; row <= 3; row++){
      for (let col = 0; col <= 3; col++){
        this.gridItem.push(
          this.add.sprite(750 + 218*(col+1), 166*(row+1), "itembox").setOrigin(0).setInteractive()
        );
        if(this.itemNames[col+row*4] == undefined) {
          this.gridItem[col+row*4].setFrame(2);
        }
        this.gridItem[col+row*4].isSelected = false;
        this.gridItem[col+row*4].on('pointerdown', () => {
          this.clickSound.play();
          if (this.gridItem[col+row*4].isSelected == false && this.itemNames[col+row*4] != undefined && this.characterStrength - this.itemStrength[col+row*4] > 0) {
            this.gridItem[col+row*4].setFrame(1);
            this.gridItem[col+row*4].isSelected = !this.gridItem[col+row*4].isSelected;
            this.characterStrength -= this.itemStrength[col+row*4];
          } else if (this.gridItem[col+row*4].isSelected == true && this.itemNames[col+row*4] != undefined){
            this.gridItem[col+row*4].setFrame(0);
            this.gridItem[col+row*4].isSelected = !this.gridItem[col+row*4].isSelected;
            this.characterStrength += this.itemStrength[col+row*4];
          }
          this.strengthText.setText(String(this.characterStrength));
        });
        this.add.image(750 + 120 + 218 * (col + 1), 90 + 166*(row + 1), this.itemNames[col+row*4]);
      }
    }
    this.btnClear = this.add.sprite(1100, 870, "btnClear")
      .setOrigin(0).setInteractive();
    this.btnClear.on('pointerover', () => {
      this.btnClear.setFrame(1);
      this.hoverSound.play()
    });
    this.btnClear.on('pointerout', () => {
      this.btnClear.setFrame(0);
    });
    this.btnClear.on('pointerdown', () => {
      this.clickSound.play();
      for (const i in this.gridItem) {
        this.gridItem[i].setFrame(0);
        this.gridItem[i].isSelected = false;
        this.characterStrength = this.characterData.strength;
        this.strengthText.setText(String(this.characterStrength));
      }
    });

    this.btnGo = this.add.sprite(1400, 870, "btnGo")
      .setOrigin(0).setInteractive();
    this.btnGo.on('pointerover', () => {
      this.btnGo.setFrame(1);
      this.hoverSound.play()
    });
    this.btnGo.on('pointerout', () => {
      this.btnGo.setFrame(0);
    });
    this.btnGo.on('pointerdown', () => {
      this.clickSound.play();
      switch(data.map){
        case 'catalonia1':
          this.scene.start('catalonia_scene1');
          break;
        case 'jungle':
          this.scene.start('jungle_scene1');
          break;
        default:
          console.log('invalid map name');
      }
      const returnValue = [];
      for (let idx = 0; idx < this.itemNames.length; idx++){
        if (this.gridItem[idx].isSelected == true) {
          returnValue.push(this.questItems[idx].id);
        }
      };
      characterSelectsItems(this.characterData.id, returnValue);
      console.log(returnValue);
    });
  }
}

export default selectItemScene;