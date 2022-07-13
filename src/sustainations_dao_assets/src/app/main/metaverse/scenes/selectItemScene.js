import { isThisQuarter } from 'date-fns';
import Phaser from 'phaser';
import gameConfig from '../GameConfig';
const bg = 'metaverse/selectItems/UI_background.png';
const btnBack = 'metaverse/selectItems/UI_back.png';
const btnClear = 'metaverse/selectItems/UI_clear.png';
const btnValid = 'metaverse/selectItems/UI_valid.png';
const itembox = 'metaverse/selectItems/UI_itembox.png';

const classtag = 'metaverse/selectItems/UI_classtag.png';
const effect = 'metaverse/selectItems/UI_effect.png';
const UI_HP = 'metaverse/selectItems/UI_id_hp.png';
const UI_mana = 'metaverse/selectItems/UI_id_mana.png';
const UI_morale = 'metaverse/selectItems/UI_id_morale.png';
const UI_stamina = 'metaverse/selectItems/UI_id_stamina.png';
const UI_name = 'metaverse/selectItems/UI_id_name.png';
const player = 'metaverse/selectItems/UI_player.png';
const pickItemText = 'metaverse/selectItems/UI_pick_item.png';

class selectItemScene extends Phaser.Scene {
  constructor() {
    super('selectItemScene');
  }

  clearCache() {
    const textures_list = ['bg', 'text', 'selectArea', 'locationDetail'];
    for (const index in textures_list){
      this.textures.remove(textures_list[index]);
    }
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
    this.load.image("bg", bg);
    this.load.image("classtag", classtag);
    this.load.image("effect", effect);
    this.load.image("UI_HP", UI_HP);
    this.load.image("UI_mana", UI_mana);
    this.load.image("UI_morale", UI_morale);
    this.load.image("UI_stamina", UI_stamina);
    this.load.image("UI_name", UI_name);
    this.load.image("player", player);
    this.load.image("btnBack", btnBack);
    this.load.image("pickItemText", pickItemText);
    this.load.spritesheet("itembox", itembox, { frameWidth: 237, frameHeight: 185 });
    this.load.spritesheet("btnClear", btnClear, { frameWidth: 339, frameHeight: 141 });
    this.load.spritesheet("btnValid", btnValid, { frameWidth: 339, frameHeight: 141 });
  }

  create() {
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
    this.add.image(550, 390, 'classtag').setOrigin(0);

    this.add.image(50, 200, 'UI_name').setOrigin(0);
    this.add.image(50, 320, 'UI_HP').setOrigin(0);
    this.add.image(50, 440, 'UI_stamina').setOrigin(0);
    this.add.image(50, 560, 'UI_mana').setOrigin(0);
    this.add.image(50, 680, 'UI_morale').setOrigin(0);

    this.add.image(1245, 80, 'pickItemText').setOrigin(0);
    this.gridItem = [];
    for (let row = 0; row <= 3; row++){
      for (let col = 0; col <= 3; col++){
        this.gridItem.push(
          this.add.sprite(750 + 218*(col+1), 166*(row+1), "itembox").setOrigin(0).setInteractive()
        );
        this.gridItem[col+row*4].isSelected = false;
        this.gridItem[col+row*4].on('pointerdown', () => {
          this.clickSound.play();
          if (this.gridItem[col+row*4].isSelected == false) {
            this.gridItem[col+row*4].setFrame(1);
          } else {
            this.gridItem[col+row*4].setFrame(0);
          }
          this.gridItem[col+row*4].isSelected = !this.gridItem[col+row*4].isSelected;
        });
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
      }
    });

    this.btnValid = this.add.sprite(1400, 870, "btnValid")
      .setOrigin(0).setInteractive();
    this.btnValid.on('pointerover', () => {
      this.btnValid.setFrame(1);
      this.hoverSound.play()
    });
    this.btnValid.on('pointerout', () => {
      this.btnValid.setFrame(0);
    });
    this.btnValid.on('pointerdown', () => {
      this.clickSound.play();
      this.scene.transition({target: 'Scene1', duration: 0 });
    });
  }
}

export default selectItemScene;