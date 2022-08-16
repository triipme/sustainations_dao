import Phaser from 'phaser';
import BaseScene from '../BaseScene'
import gameConfig from '../../GameConfig';
import { 
  loadEventOptions, 
  loadCharacter,
  updateCharacterStats,
  getCharacterStatus,
  characterTakeOption,
  listCharacterSelectsItems,
  loadEventItem,
  useHpPotion,
  characterCollectsMaterials,
  createCharacterCollectsMaterials
} from '../../GameApi';
const heroRunningSprite = 'metaverse/walkingsprite.png';
const ground = 'metaverse/transparent-ground.png';
const bg1 = 'metaverse/scenes/catalonia/Scene6/PNG/back.png';
const bg2 = 'metaverse/scenes/catalonia/Scene6/PNG/mid.png';
const bg3 = 'metaverse/scenes/catalonia/Scene6/PNG/front.png';
const selectAction = 'metaverse/scenes/background_menu.png';
const btnBlank = 'metaverse/scenes/selection.png';

export default class catalonia_scene6 extends BaseScene {
  constructor() {
    super('catalonia_scene6');
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
    this.eventId = "e15";
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
          // if(this.characterTakeOptions[i].currentHP > this.characterTakeOptions[i].maxHp) {
          //   this.characterTakeOptions[i].currentHP = this.characterTakeOptions[i].maxHp;
          // }
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
    for (let x = -50; x < 5120; x += 4) {
      platforms.create(x, 635, "ground").refreshBody();
    }

    //player
    this.player = this.physics.add.sprite(-50, 500, "hero-running").setScale(0.67);
    this.physics.add.collider(this.player, platforms);

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

    //UI
    this.add.image(20, 30, "UI_NameCard").setOrigin(0).setScrollFactor(0);
    this.add.image(255, 30, "UI_HP").setOrigin(0).setScrollFactor(0);
    this.add.image(490, 30, "UI_Mana").setOrigin(0).setScrollFactor(0);
    this.add.image(725, 30, "UI_Stamina").setOrigin(0).setScrollFactor(0);
    this.add.image(960, 30, "UI_Morale").setOrigin(0).setScrollFactor(0);
    
    //set value
    this.hp = this.makeBar(325, 65, 100, 15, 0x74e044).setScrollFactor(0);
    this.mana = this.makeBar(325+235, 65, 100, 15, 0xc038f6).setScrollFactor(0);
    this.stamina = this.makeBar(325+235*2, 65, 100, 15, 0xcf315f).setScrollFactor(0);
    this.morale = this.makeBar(325+235*3, 65, 100, 15, 0x63dafb).setScrollFactor(0);
    // this.setValue(this.hp, 50)

    this.add.image(1190, 50, "BtnExit").setOrigin(0).setScrollFactor(0).setScale(0.7)
    .setInteractive()
      .on('pointerdown', () => {
        this.clickSound.play();
        this.ingameSound.stop();
        this.sfx_char_footstep.stop();
        this.ambientSound.stop();
        this.scene.start('menuScene');
      });

    //mycam
    this.myCam = this.cameras.main;
    this.myCam.setBounds(0, 0, gameConfig.scale.width*4, gameConfig.scale.height); //furthest distance the cam is allowed to move
    this.myCam.startFollow(this.player);

    //pause screen
    this.veil = this.add.graphics({x: 0, y: 0});
    this.veil.fillStyle('0x000000', 0.2);
    this.veil.fillRect(0,0, gameConfig.scale.width, gameConfig.scale.height);
    this.selectAction = this.add.image(0, 0, 'selectAction').setOrigin(0,0);

    this.veil.setScrollFactor(0);
    this.veil.setVisible(false);
    this.selectAction.setScrollFactor(0);
    this.selectAction.setVisible(false);

    // load event item
    this.eventItem = await loadEventItem();
    //UI2
    this.isHadPotion = false;
    console.log("EVENT ITEM",this.eventItem);
    if(this.eventItem != undefined) {
      this.isHadPotion = true;
    };
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
        // delete hp potion
        console.log("Used potion => ",useHpPotion(this.characterData.id));
      });
    } else {
      this.itemSlot[0] = this.add.image(55, 550, "UI_Utility_Sprite").setOrigin(0).setScrollFactor(0).setScale(0.5);
    }
    this.itemSlot[1] =this.add.image(125, 505, "UI_Utility_Sprite").setOrigin(0).setScrollFactor(0).setScale(0.5);
    this.itemSlot[2] =this.add.image(195, 550, "UI_Utility_Sprite").setOrigin(0).setScrollFactor(0).setScale(0.5);

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
  }

  update() {
    //new player logic
    if (this.player.body.touching.down && this.isInteracting == false) {
      this.player.setVelocityX(200);
    }

    if (this.player.x > gameConfig.scale.width*4) {
      this.ingameSound.stop();
      this.sfx_char_footstep.stop();
      this.scene.start('catalonia_scene7', {isUsedPotion: this.isUsedPotion});
    }

    if (this.player.x > gameConfig.scale.width*4 - 1000 && this.isInteracted == false) {
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
    this.bg_3.tilePositionX = this.myCam.scrollX * 1;
  }
}