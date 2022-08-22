import Phaser from 'phaser';
import BaseScene from '../BaseScene'
import gameConfig from '../../GameConfig';
import { 
  loadEventOptions,
  updateCharacterStats,
  listCharacterSelectsItems,
  gainCharacterExp,
  createCharacterCollectsMaterials,
  resetCharacterCollectsMaterials,
  listInventories,
  createInventory,
  increaseClearedQuestGameTurn
} from '../../GameApi';
import {settings} from '../settings';
const heroRunningSprite = 'metaverse/walkingsprite.png';
const ground = 'metaverse/transparent-ground.png';
const bg1 = 'metaverse/scenes/catalonia/Scene7/PNG/back.png';
const bg2 = 'metaverse/scenes/catalonia/Scene7/PNG/mid.png';
const bg3 = 'metaverse/scenes/catalonia/Scene7/PNG/front.png';
const obstacle_back = 'metaverse/scenes/catalonia/Scene7/PNG/obstacle_back.png';
const obstacle_front = 'metaverse/scenes/catalonia/Scene7/PNG/obstacle_front.png';
const selectAction = 'metaverse/scenes/background_menu.png';
const btnBlank = 'metaverse/scenes/selection.png';

export default class catalonia_scene7 extends BaseScene {
  constructor() {
    super('catalonia_scene7');
  }
  
  init(data) {
    this.isHealedPreviously = data.isUsedPotion;
    console.log('healed', this.isHealedPreviously);
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
    this.initialLoad("e16");

    //Preload
    this.clearSceneCache();
    this.isInteracting = false;
    this.isInteracted = false;
    this.isCloseToObstacle = false;
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
    this.load.image("obstacle_front", obstacle_front);
    this.load.image("obstacle_back", obstacle_back);
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
    console.log(this.characterStatus);
    if(this.characterStatus == 'Exhausted') {
      this.scene.start('exhausted');
    } else {
      if(this.isHealedPreviously) {
        for(const i in this.characterTakeOptions) {
          this.characterTakeOptions[i].currentHP += 3;
        }
      }
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
    //background
    this.bg_1 = this.add.tileSprite(0, 0, gameConfig.scale.width, gameConfig.scale.height, "background1");
    this.bg_1.setOrigin(0, 0);
    this.bg_1.setScrollFactor(0);
    
    this.bg_2 = this.add.tileSprite(0, 0, gameConfig.scale.width, gameConfig.scale.height, "background2");
    this.bg_2.setOrigin(0, 0);
    this.bg_2.setScrollFactor(0);

    // platforms
    const platforms = this.physics.add.staticGroup();
    for (let x = -50; x < 2655; x += 4) {
      platforms.create(x, 635, "ground").refreshBody();
    }
    for (let x = 2655; x < 3360; x+=4) {
      platforms.create(x, 635-((x - 2655)/4), "ground").refreshBody();
      console.log(635-((x - 2655)/4))
    }
    for (let x = 3360; x < 4065; x+=4) {
      platforms.create(x, 459+((x - 3360)/4), "ground").refreshBody();
    }
    for (let x = 4065; x < gameConfig.scale.width*4; x+=4) {
      platforms.create(x, 635, "ground").refreshBody();
    }
    // obstacle back
    this.obstacle_back = this.add.tileSprite(0, 0, gameConfig.scale.width, gameConfig.scale.height, "obstacle_back")
      .setOrigin(0,0)
      .setScrollFactor(0);
    //player
    this.player = this.physics.add.sprite(-50, 500, "hero-running").setScale(0.67);
    this.physics.add.collider(this.player, platforms);
    // obstacle front
    this.obstacle_front = this.add.tileSprite(0, 0, gameConfig.scale.width, gameConfig.scale.height, "obstacle_front")
      .setOrigin(0,0)
      .setScrollFactor(0);

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

    this.createUIElements();
    this.defineCamera(gameConfig.scale.width*4, gameConfig.scale.height);
    this.createPauseScreen();

   // load selected items ids
   this.selectedItemsIds = await listCharacterSelectsItems(this.characterData.id);
   console.log(this.selectedItemsIds);
   // load event options
   this.eventOptions = await loadEventOptions(this.eventId, this.selectedItemsIds);

    // stats before choose option
    if(this.isHealedPreviously){
      var newValue = this.characterData.currentHP+3;
      if (newValue > this.characterData.maxHP){
        newValue = this.characterData.maxHP;
      }
      this.setValue(this.hp, newValue/this.characterData.maxHP*100);
    } else{
      this.setValue(this.hp, this.characterData.currentHP/this.characterData.maxHP*100);
    }
    this.setValue(this.stamina, this.characterData.currentStamina/this.characterData.maxStamina*100);
    this.setValue(this.mana, this.characterData.currentMana/this.characterData.maxMana*100);
    this.setValue(this.morale, this.characterData.currentMorale/this.characterData.maxMorale*100);

    this.options = [];
    for (const idx in this.eventOptions){
      // can take option or not
      const takeable = this.eventOptions[idx][0];
      
      this.options[idx] = this.add.sprite(gameConfig.scale.width/2, gameConfig.scale.height/2 -100 + idx*70, 'btnBlank').setScale(0.67);
      this.options[idx].text = this.add.text(
        gameConfig.scale.width/2, gameConfig.scale.height/2 - 100 + idx*70, this.eventOptions[idx][1].description, { fill: '#fff', align: 'center', fontSize: '20px' })
      .setScrollFactor(0).setVisible(false).setOrigin(0.5);
      this.options[idx].setInteractive().setScrollFactor(0).setVisible(false);
      if (takeable) {
        this.options[idx].on('pointerover', () => {
          this.options[idx].setFrame(1);
          this.hoverSound.play();
        });
        this.options[idx].on('pointerout', () => {
          this.options[idx].setFrame(0);
        });
      } else {
        this.options[idx].setFrame(2);
      }

      this.options[idx].on('pointerdown', () => {
        if (takeable) {
          this.triggerContinue();
          this.clickSound.play();
          this.sfx_char_footstep.play();
          // stats after choose option
          this.setValue(this.hp, this.characterTakeOptions[idx].currentHP/this.characterTakeOptions[idx].maxHP*100);
          this.setValue(this.stamina, this.characterTakeOptions[idx].currentStamina/this.characterTakeOptions[idx].maxStamina*100);
          this.setValue(this.mana, this.characterTakeOptions[idx].currentMana/this.characterTakeOptions[idx].maxMana*100);
          this.setValue(this.morale, this.characterTakeOptions[idx].currentMorale/this.characterTakeOptions[idx].maxMorale*100);
          // update character after choose option
          updateCharacterStats(this.characterTakeOptions[idx]);
          // create charactercollectsmaterials after choose option
	        createCharacterCollectsMaterials(this.characterCollectMaterials[idx]);
        }
      });
    };
    createInventory(this.characterData.id);
    gainCharacterExp(this.characterData);
    this.inventory = await listInventories(this.characterData.id);
    resetCharacterCollectsMaterials(this.characterData.id);
    this.increaseClearedQuestGameTurn = await increaseClearedQuestGameTurn(this.characterData.id);
  }

  update() {
    //new player logic
    if (this.player.body.touching.down && this.isInteracting == false) {
      this.player.setVelocityX(settings.movementSpeed);
    }

    if (this.player.x > gameConfig.scale.width*4) {
      this.ingameSound.stop();
      this.sfx_char_footstep.stop();
      this.scene.start('thanks');
    }

    if (this.player.x > 3967 && this.isInteracted == false) {
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
    this.bg_2.tilePositionX = this.myCam.scrollX * 1;
    this.obstacle_back.tilePositionX = this.myCam.scrollX * 1;
    this.obstacle_front.tilePositionX = this.myCam.scrollX * 1;
    this.bg_3.tilePositionX = this.myCam.scrollX * 1;
  }
}