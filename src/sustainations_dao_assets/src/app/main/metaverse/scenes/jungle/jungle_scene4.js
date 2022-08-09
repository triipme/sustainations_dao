import store from 'app/store';
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
  takeOptionAbility
} from '../../GameApi';
const heroRunningSprite = 'metaverse/walkingsprite.png';
const ground = 'metaverse/transparent-ground.png';
const bg1 = 'metaverse/scenes/jungle/Scene4/PNG/back-01.png';
const bg2 = 'metaverse/scenes/jungle/Scene4/PNG/mid-01.png';
const bg3 = 'metaverse/scenes/jungle/Scene4/PNG/front-01.png';
const obstacle = 'metaverse/scenes/jungle/Scene4/PNG/obstacle-01.png';
const selectAction = 'metaverse/scenes/background_menu.png';
const btnBlank = 'metaverse/scenes/selection.png';

export default class jungle_scene4 extends BaseScene {
  constructor() {
    super('jungle_scene4');
  }

  clearSceneCache() {
    const textures_list = ['ground', 'background1', 'background2', 
      'background3', 'selectAction', 'btnBlank', 'obstacle'];
    for (const index in textures_list){
      this.textures.remove(textures_list[index]);
    }
  }

  preload() {
    this.eventId = "e4";
    this.load.rexAwait(function(successCallback, failureCallback) {
      getCharacterStatus().then( (result) => {
        this.characterStatus = result.ok;
        successCallback();
      });
    }, this);
    
    this.load.rexAwait(function(successCallback, failureCallback) {
      loadEventOptions(this.eventId).then( (result) => {
        this.eventOptions = result;
        successCallback();
      });
    }, this);

    this.load.rexAwait(function(successCallback, failureCallback) {
      characterTakeOption(this.eventId).then( (result) => {
        this.characterTakeOptions = result;
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
    console.log(this.characterStatus);

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
    //background
    this.bg_1 = this.add.tileSprite(0, 0, gameConfig.scale.width, gameConfig.scale.height, "background1");
    this.bg_1.setOrigin(0, 0);
    this.bg_1.setScrollFactor(0);
    
    this.bg_2 = this.add.tileSprite(0, 0, gameConfig.scale.width, gameConfig.scale.height, "background2");
    this.bg_2.setOrigin(0, 0);
    this.bg_2.setScrollFactor(0);

    this.obstacle = this.add.tileSprite(0, 0, gameConfig.scale.width, gameConfig.scale.height, "obstacle")
      .setOrigin(0,0)
      .setScrollFactor(0);
    // platforms
    const platforms = this.physics.add.staticGroup();
    for (let x = -100; x < 1920*2; x += 1) {
      platforms.create(x, 950, "ground").refreshBody();
    }

    //player
    this.player = this.physics.add.sprite(-80, 700, "hero-running");
    this.player.setBounce(0.25);
    this.player.setCollideWorldBounds(false);
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
    this.add.image(20, 40, "UI_NameCard").setOrigin(0).setScrollFactor(0);
    this.add.image(370, 40, "UI_HP").setOrigin(0).setScrollFactor(0);
    this.add.image(720, 40, "UI_Mana").setOrigin(0).setScrollFactor(0);
    this.add.image(1070, 40, "UI_Stamina").setOrigin(0).setScrollFactor(0);
    this.add.image(1420, 40, "UI_Morale").setOrigin(0).setScrollFactor(0);
    //set value
    this.hp = this.makeBar(476, 92, 150, 22, 0x74e044).setScrollFactor(0);
    this.mana = this.makeBar(476+350, 92, 150, 22, 0xc038f6).setScrollFactor(0);
    this.stamina = this.makeBar(476+350*2, 92, 150, 22, 0xcf311f).setScrollFactor(0);
    this.morale = this.makeBar(476+350*3, 92, 150, 22, 0x63dafb).setScrollFactor(0);
    // this.setValue(this.hp, 50)

    //UI2
    this.add.image(80, 830, "UI_Utility").setOrigin(0).setScrollFactor(0);
    this.add.image(1780, 74, "BtnExit").setOrigin(0).setScrollFactor(0).setScale(0.7)
      .setInteractive()
      .on('pointerdown', () => {
        this.clickSound.play();
        this.scene.start('menuScene');
        this.pregameSound.stop();
        this.sfx_char_footstep.stop();
      });

    //mycam
    this.myCam = this.cameras.main;
    this.myCam.setBounds(0, 0, gameConfig.scale.width*2, gameConfig.scale.height); //furthest distance the cam is allowed to move
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

    // load character
    this.characterData = await loadCharacter();
    // list taken items by character
    this.takenItems = await listCharacterSelectsItems(this.characterData.id);
    console.log(this.takenItems);
    // stats before choose option
    this.setValue(this.hp, this.characterData.currentHP/this.characterData.maxHP*100);
    this.setValue(this.stamina, this.characterData.currentStamina/this.characterData.maxStamina*100);
    this.setValue(this.mana, this.characterData.currentMana/this.characterData.maxMana*100);
    this.setValue(this.morale, this.characterData.currentMorale/this.characterData.maxMorale*100);

    // take option abilities
    const takeOptionAbilities = []
    for (const idx in this.eventOptions){
      takeOptionAbilities.push(await takeOptionAbility(this.eventOptions[idx].id, this.takenItems));
    }
    
    // load event options
    this.options = [];
    for (const idx in this.eventOptions){
      // can take option or not
      const takeable = takeOptionAbilities[idx];

      this.options[idx] = this.add.sprite(gameConfig.scale.width/2, gameConfig.scale.height/2 -100 + idx*100, 'btnBlank');
      this.options[idx].text = this.add.text(
        gameConfig.scale.width/2, gameConfig.scale.height/2 - 100 + idx*100, this.eventOptions[idx].description, { fill: '#fff', align: 'center', fontSize: '30px' })
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
        if (takeable){
          this.triggerContinue();
          this.sfx_char_footstep.play();
          this.clickSound.play();
          this.choseOption = this.eventOptions[idx].id;
          // stats after choose option
          this.setValue(this.hp, this.characterTakeOptions[idx].currentHP/this.characterTakeOptions[idx].maxHP*100);
          this.setValue(this.stamina, this.characterTakeOptions[idx].currentStamina/this.characterTakeOptions[idx].maxStamina*100);
          this.setValue(this.mana, this.characterTakeOptions[idx].currentMana/this.characterTakeOptions[idx].maxMana*100);
          this.setValue(this.morale, this.characterTakeOptions[idx].currentMorale/this.characterTakeOptions[idx].maxMorale*100);
          // update character after choose option
          updateCharacterStats(this.characterTakeOptions[idx]);
        }
      });
    };
  }

  update() {
    //new player logic
    if (this.player.body.touching.down && this.isInteracting == false) {
      this.player.setVelocityX(350);
    }

    if (this.player.x > 1920*2) {
      this.sfx_char_footstep.stop();
      this.ingameSound.stop();
      this.scene.start("jungle_scene5");
    }

    if (this.player.x > 1920*2 - 1000 && this.isInteracted == false) {
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