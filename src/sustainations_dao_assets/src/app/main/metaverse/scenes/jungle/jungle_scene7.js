import Phaser from 'phaser';
import BaseScene from '../BaseScene'
import gameConfig from '../../GameConfig';
import history from "@history";

import { 
  loadCharacter,
  getCharacterStatus,
  canGetARItemPromise,
  gainCharacterExp,
  resetCharacterCollectsMaterials,
  listInventories,
  createInventory
} from '../../GameApi';
const heroRunningSprite = 'metaverse/walkingsprite.png';
const ground = 'metaverse/transparent-ground.png';
const bg1 = 'metaverse/scenes/jungle/Scene7/PNG/back-01.png';
const bg2 = 'metaverse/scenes/jungle/Scene7/PNG/mid-01.png';
const bg3 = 'metaverse/scenes/jungle/Scene7/PNG/front-01.png';
const obstacle = 'metaverse/scenes/jungle/Scene7/PNG/obstacle-01.png';
const selectAction = 'metaverse/scenes/background_menu.png';
const btnBlank = 'metaverse/scenes/selection.png';

export default class jungle_scene7 extends BaseScene {
  constructor() {
    super('jungle_scene7');
  }

  clearSceneCache() {
    const textures_list = ['ground', 'background1', 'background2', 
      'background3', 'selectAction', 'btnBlank', 'obstacle'];
    for (const index in textures_list){
      this.textures.remove(textures_list[index]);
    }
  }

  preload() {
    this.addLoadingScreen();
    this.eventItemId = "ui1";
    this.load.rexAwait(function(successCallback, failureCallback) {
      loadCharacter().then( (result) => {
        this.characterData = result.ok[1];
        console.log(this.characterData);
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
      canGetARItemPromise(this.eventItemId).then( (result) => {
        this.canGetARItem = result.ok;
        successCallback();
      });
    }, this);

    //Preload
    this.clearSceneCache();
    this.isInteracting = false;
    this.isInteracted = false;
    this.load.spritesheet("hero-running", heroRunningSprite, {
      frameWidth: 197,
      frameHeight: 337
    });
    this.load.image("ground", ground);
    this.load.image("background1", bg1);
    this.load.image("background2", bg2);
    this.load.image("background3", bg3);
    this.load.image("selectAction", selectAction);
    this.load.spritesheet('btnBlank', btnBlank, { frameWidth: 1102, frameHeight: 88});
    this.load.image("obstacle", obstacle);
  }

  //defined function
  triggerPause(){
    this.isInteracting = true;
    this.veil.setVisible(true);
    this.selectAction.setVisible(true);
    for (const idx in this.options){
      this.options[idx].setVisible(true);
      this.options[idx].text.setVisible(true);
    }
  }

  triggerContinue(){
    this.veil.setVisible(false);
    this.selectAction.setVisible(false);
    for (const idx in this.options){
      this.options[idx].setVisible(false);
      this.options[idx].text.setVisible(false);
    }
    this.isInteracting = false;
    this.isInteracted = true;
    this.player.play('running-anims');
  }

  async create() {
    if(this.characterStatus == 'Exhausted') {
      this.scene.start('exhausted');
    }
    // add audios
    this.hoverSound = this.sound.add('hoverSound');
    this.clickSound = this.sound.add('clickSound');
    this.ingameSound = this.sound.add('ingameSound', {loop: true});
    this.ingameSound.isRunning = false;
    this.ambientSound = this.sound.add('ambientSound', {loop: true});
    this.sfx_char_footstep = this.sound.add('sfx_char_footstep', {loop: true, volume: 0.2});

    if(this.characterStatus != 'Exhausted') {
      this.ambientSound.play();
      this.sfx_char_footstep.play();
    }

    this.createSceneLayers();
    // platforms
    const platforms = this.physics.add.staticGroup();
    for (let x = -50; x < gameConfig.scale.width*4; x += 4) {
      platforms.create(x, 635, "ground").refreshBody();
    }
    this.physics.add.collider(this.player, platforms);

    this.createUIElements(true);
    this.defineCamera(gameConfig.scale.width, gameConfig.scale.height);
    this.createPauseScreen();
    
    // stats before choose option
    this.setValue(this.hp, this.characterData.currentHP/this.characterData.maxHP*100);
    this.setValue(this.stamina, this.characterData.currentStamina/this.characterData.maxStamina*100);
    this.setValue(this.mana, this.characterData.currentMana/this.characterData.maxMana*100);
    this.setValue(this.morale, this.characterData.currentMorale/this.characterData.maxMorale*100);
      
    const testData = ['Collect a gift'];
    this.options = [];
    for (const idx in testData){
      this.options[idx] = this.add.sprite(gameConfig.scale.width/2, gameConfig.scale.height/2 -100 + idx*70, 'btnBlank').setScale(0.67);
      this.options[idx].text = this.add.text(
        gameConfig.scale.width/2, gameConfig.scale.height/2 - 100 + idx*70, testData[idx], { fill: '#fff', align: 'center', fontSize: '20px' })
      .setScrollFactor(0).setVisible(false).setOrigin(0.5);
      this.options[idx].setInteractive().setScrollFactor(0).setVisible(false);
      this.options[idx].on('pointerover', () => {
        this.options[idx].setFrame(1);
        this.hoverSound.play();
      });
      this.options[idx].on('pointerout', () => {
        this.options[idx].setFrame(0);
      });
      this.options[idx].on('pointerdown', () => {
        this.triggerContinue();
        this.sfx_char_footstep.play();
        this.clickSound.play();
        if(this.canGetARItem == true) {
          history.push("/metaverse/ar");
        };
      });
    };
    createInventory(this.characterData.id);
    gainCharacterExp(this.characterData);
    this.inventory = await listInventories(this.characterData.id);
    resetCharacterCollectsMaterials(this.characterData.id);
  }

  update() {
    //new player logic
    if (this.player.body.touching.down && this.isInteracting == false) {
      this.player.setVelocityX(250);
    }

    if (this.player.x > gameConfig.scale.width) {
      this.ingameSound.stop();
      this.sfx_char_footstep.stop();
      this.scene.start("thanks");
    }

    if (this.player.x > 500 && this.isInteracted == false) {
      this.triggerPause();
      this.ambientSound.stop();
      this.sfx_char_footstep.stop();
      if (this.ingameSound.isRunning == false) {
        this.ingameSound.play();
        this.ingameSound.isRunning = true;
      }
      this.player.setVelocityX(0);
      this.player.play('idle-anims');
      this.player.stop()
    }

    //bg
    // scroll the texture of the tilesprites proportionally to the camera scroll
    this.bg_1.tilePositionX = this.myCam.scrollX * .3;
    this.bg_2.tilePositionX = this.myCam.scrollX * .6;
    this.obstacle.tilePositionX = this.myCam.scrollX * .6;
    this.bg_3.tilePositionX = this.myCam.scrollX * 1;
  }
}