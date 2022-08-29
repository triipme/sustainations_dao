import Phaser from "phaser";
import gameConfig from '../GameConfig';
import {
  getUserInfo,
  loadEventItem,
  useHpPotion,
  loadEventOptions, 
  loadCharacter,
  updateCharacterStats,
  getCharacterStatus,
  characterTakeOption,
  listCharacterSelectsItems,
  characterCollectsMaterials,
  getHpPotion
} from '../GameApi';

class BaseScene extends Phaser.Scene {
  constructor(key) {
    super(key);
  }

  initialLoad(eventID) {
    this.eventId = eventID;
    this.load.rexAwait(function(successCallback, failureCallback) {
      getUserInfo().then( (result) => {
        this.userInfo = result.ok;
        successCallback();
      });
    }, this);
    // load character
    this.load.rexAwait(function(successCallback, failureCallback) {
      loadCharacter().then( (result) => {
        this.characterData = result.ok[1];
        console.log(this.characterData);
        successCallback();
      });
    }, this);

    this.load.rexAwait(function(successCallback, failureCallback) {
      characterTakeOption(this.eventId).then( (result) => {
        this.characterTakeOptions = result;
        successCallback();
      });
    }, this);

    this.load.rexAwait(function(successCallback, failureCallback) {
      getCharacterStatus().then( (result) => {
        this.characterStatus = result.ok;
        successCallback();
      });
    }, this);

    this.load.rexAwait(function(successCallback, failureCallback) {
      characterCollectsMaterials(this.eventId).then( (result) => {
        this.characterCollectMaterials = result;
        successCallback();
      });
    }, this);
  }

  createSceneLayers() {
    //background
    this.bg_1 = this.add.tileSprite(0, 0, gameConfig.scale.width, gameConfig.scale.height, "background1");
    this.bg_1.setOrigin(0, 0);
    this.bg_1.setScrollFactor(0);
    
    this.bg_2 = this.add.tileSprite(0, 0, gameConfig.scale.width, gameConfig.scale.height, "background2");
    this.bg_2.setOrigin(0, 0);
    this.bg_2.setScrollFactor(0);
    
    if (this.textures.exists("obstacle")){
      this.obstacle = this.add.tileSprite(0, 0, gameConfig.scale.width, gameConfig.scale.height, "obstacle")
      .setOrigin(0,0)
      .setScrollFactor(0);
    } else {
      console.log('Obstacle not found');
    }
    
    //player
    this.player = this.physics.add.sprite(-50, 500, "hero-running").setScale(0.67);
    
    this.anims.create({
      key: "running-anims",
      frames: this.anims.generateFrameNumbers("hero-running", {start: 1, end: 8}),
      frameRate: 8,
      repeat: -1
    });
    
    this.anims.create({
      key: "idle-anims",
      frames: this.anims.generateFrameNumbers("hero-running", {start: 0, end: 0}),
      frameRate: 1,
      repeat: -1
    });
    this.player.play('running-anims');
    
    //frontlayer
    this.bg_3 = this.add.tileSprite(0, 0, gameConfig.scale.width, gameConfig.scale.height, "background3");
    this.bg_3.setOrigin(0, 0);
    this.bg_3.setScrollFactor(0);
  }

  async createUIElements(isDisabled = false) {
    //UI
    this.add.image(20, 30, "UI_NameCard").setOrigin(0).setScrollFactor(0);
    this.add.text(90, 47, 'Trekker', { fill: '#000', align: 'center', fontSize: '9px', font: 'Arial'}).setScrollFactor(0);
    this.add.text(90, 65, this.userInfo.profile[0].username, { fill: '#000', align: 'center', font: '15px Arial'}).setScrollFactor(0);
    this.add.image(255, 30, "UI_HP").setOrigin(0).setScrollFactor(0);
    this.add.image(490, 30, "UI_Mana").setOrigin(0).setScrollFactor(0);
    this.add.image(725, 30, "UI_Stamina").setOrigin(0).setScrollFactor(0);
    this.add.image(960, 30, "UI_Morale").setOrigin(0).setScrollFactor(0);
    this.add.image(1190, 50, "BtnExit").setOrigin(0).setScrollFactor(0).setScale(0.7)
    .setInteractive()
      .on('pointerdown', () => {
        this.clickSound.play();
        try {this.pregameSound.stop();} catch {}
        try {this.ambientSound.stop();} catch {}
        try {this.sfx_char_footstep.stop();} catch {}
        try {this.sfx_small_waterfall.stop();} catch {}
        try {this.sfx_big_waterfall.stop();} catch {}
        try {this.ingameSound.stop();} catch {}
        try {this.sfx_monkey.stop();} catch {}
        this.scene.start('menuScene');
    });
    //set value
    this.hp = this.makeBar(325, 65, 100, 15, 0x74e044).setScrollFactor(0);
    this.mana = this.makeBar(325+235, 65, 100, 15, 0xc038f6).setScrollFactor(0);
    this.stamina = this.makeBar(325+235*2, 65, 100, 15, 0xcf315f).setScrollFactor(0);
    this.morale = this.makeBar(325+235*3, 65, 100, 15, 0x63dafb).setScrollFactor(0);

    // load event item
    if (!isDisabled) {
      this.eventItem = await loadEventItem();
      this.isHadPotion = false;
      console.log("EVENT ITEM",this.eventItem);
      if(this.eventItem != undefined) {
        this.isHadPotion = true;
      };
    } else {
      this.isHadPotion = false;
    }
    //UI
    console.log("HAD POTION ", this.isHadPotion);
    this.isUsedPotion = false;
    this.itemSlot = [];
    if (this.isHadPotion){
      this.itemSlot[0] = this.add.image(55, 550, "UI_Utility_Sprite")
        .setOrigin(0).setScrollFactor(0).setScale(0.5).setFrame(1);
      this.potion = this.add.image(68, 563, "item_potion")
        .setOrigin(0).setInteractive().setScrollFactor(0).setScale(0.5);
      this.potion.on('pointerdown', () => {
        this.clickSound.play();
        this.itemSlot[0].setFrame(0);
        this.potion.setVisible(false);
        this.isUsedPotion = true;
        console.log("Used potion => ",useHpPotion(this.characterData.id));
      });
    } else {
      this.itemSlot[0] = this.add.image(55, 550, "UI_Utility_Sprite").setOrigin(0).setScrollFactor(0).setScale(0.5);
    }
    this.itemSlot[1] =this.add.image(125, 505, "UI_Utility_Sprite").setOrigin(0).setScrollFactor(0).setScale(0.5);
    this.itemSlot[2] =this.add.image(195, 550, "UI_Utility_Sprite").setOrigin(0).setScrollFactor(0).setScale(0.5);
  }

  isExhausted() {
    if(this.characterStatus == 'Exhausted') {
      this.scene.start('exhausted');
    } else {
      if(this.isHealedPreviously) {
        for(const i in this.characterTakeOptions) {
          this.characterTakeOptions[i].currentHP += 3;
        }
      }
    }
  };

  usePotion() {
    if(this.isHealedPreviously){
      var newValue = this.characterData.currentHP+3;
      if (newValue > this.characterData.maxHP){
        newValue = this.characterData.maxHP;
      }
      this.setValue(this.hp, newValue/this.characterData.maxHP*100);
    } else{
      this.setValue(this.hp, this.characterData.currentHP/this.characterData.maxHP*100);
    }
  };

  defineCamera(width, height) {
    this.myCam = this.cameras.main;
    this.myCam.setBounds(0, 0, width, height);
    this.myCam.startFollow(this.player);
  }

  createPauseScreen(){
    this.veil = this.add.graphics({x: 0, y: 0})
      .fillStyle('0x000000', 0.2);
    this.veil.fillRect(0,0, gameConfig.scale.width, gameConfig.scale.height)
      .setScrollFactor(0).setVisible(false);
    this.selectAction = this.add.image(0, 0, 'selectAction')
      .setOrigin(0,0).setScrollFactor(0).setVisible(false);
  }

  //loading screen for every scene
  addLoadingScreen() {
    this.add.image(
      gameConfig.scale.width/2, gameConfig.scale.height/2 - 35, 'logo'
    ).setOrigin(0.5, 0.5).setScale(0.15);
    this.anims.create({
      key: 'loading-anims',
      frames: this.anims.generateFrameNumbers("loading", {start: 0, end: 11}),
      frameRate: 12,
      repeat: -1
    });
    this.add.sprite(
      gameConfig.scale.width/2, gameConfig.scale.height/2 + 100, "loading"
    ).setScale(0.05).play('loading-anims');
  }
  //draw graphic bars
  makeBar(x, y, width, height, color) {
    let bar = this.add.graphics();
    bar.fillStyle(color, 1);
    bar.fillRect(0, 0, width, height);
    bar.x = x;
    bar.y = y;
    return bar;
  }
  setValue(bar,percentage) {
    if (percentage/100 > 1){
      bar.scaleX = 1;
    } else {
      bar.scaleX = percentage/100;
    }
  }
}
export default BaseScene;
