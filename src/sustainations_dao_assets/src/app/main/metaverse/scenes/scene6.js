import store from 'app/store';

import Phaser from 'phaser';
import gameConfig from '../GameConfig';
const heroRunningSprite = 'metaverse/walkingsprite.png';
const ground = 'metaverse/transparent-ground.png';
const bg1 = 'metaverse/scenes/Scene6/PNG/back-01.png';
const bg2 = 'metaverse/scenes/Scene6/PNG/mid-01-shortened.png';
const bg3 = 'metaverse/scenes/Scene6/PNG/front-01.png';
const obstacle = 'metaverse/scenes/Scene6/PNG/obstacle-01-shortened.png';
const selectAction = 'metaverse/scenes/background_menu.png';
const btnBlank = 'metaverse/scenes/selection.png';

export default class Scene6 extends Phaser.Scene {
  constructor() {
    super('Scene6');
  }

  clearSceneCache() {
    const textures_list = ['ground', 'background1', 'background2', 
      'background3', 'selectAction', 'btnBlank', 'obstacle'];
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
    // add audios
    this.hoverSound = this.sound.add('hoverSound');
    this.clickSound = this.sound.add('clickSound');
    this.ingameSound = this.sound.add('ingameSound', {loop: true});
    this.ingameSound.isRunning = false;
    this.ambientSound = this.sound.add('ambientSound', {loop: true});
    this.ambientSound.play();
    this.sfx_char_footstep = this.sound.add('sfx_char_footstep', {loop: true, volume: 0.2});
    this.sfx_char_footstep.play();
    this.sfx_small_waterfall = this.sound.add('sfx_small_waterfall', {loop: true});
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
    for (let x = -100; x < 1920*4; x += 1) {
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
    this.add.image(80, 830, "UI_Utility").setOrigin(0).setScrollFactor(0);
    this.add.image(1780, 74, "BtnExit").setOrigin(0).setScrollFactor(0).setScale(0.7)
      .setInteractive()
      .on('pointerdown', () => {
        this.clickSound.play();
        this.scene.start('menuScene');
        this.ambientSound.stop();
        this.ingameSound.stop();
        this.sfx_small_waterfall.stop();
        this.sfx_char_footstep.stop();
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
    // call api
    const { user } = store.getState();
    const listEventOptions = async () => await user.actor.listEventOptions("5CEBC33D-9ED1-4B96-8F4E-B6AA48DD26D9");
    const result = await listEventOptions();
    const testData = [];
    for(const i in result.ok){
      console.log(result.ok[i][1].description);
      testData.push(result.ok[i][1].description);
    }
    //const testData = ['Use inflatable boat to go through the river', 'Continue to move along the river-bank'];
    this.options = [];
    for (const idx in testData){
      this.options[idx] = this.add.sprite(gameConfig.scale.width/2, gameConfig.scale.height/2 -100 + idx*100, 'btnBlank');
      this.options[idx].text = this.add.text(
        gameConfig.scale.width/2, gameConfig.scale.height/2 - 100 + idx*100, testData[idx], { fill: '#fff', align: 'center', fontSize: '30px' })
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
        this.clickSound.play();
        this.sfx_char_footstep.play();
        this.cameras.main.fadeOut(500, 0, 0, 0);
      });
    }
  }

  update() {
    //new player logic
    if (this.player.body.touching.down && this.isInteracting == false) {
      this.player.setVelocityX(350);
    }

    if (this.player.x > 1920*4) {
      this.ingameSound.stop();
      this.sfx_char_footstep.stop();
      this.sfx_small_waterfall.stop();
      this.scene.start("Scene7");
    }

    if (this.player.x > 1920*3 && this.isInteracted == false) {
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

    if (this.player.x > 1920*2 && this.isCloseToObstacle == false) {
      this.sfx_small_waterfall.play();
      this.isCloseToObstacle = true;
    }
    
    //bg
    // scroll the texture of the tilesprites proportionally to the camera scroll
    this.bg_1.tilePositionX = this.myCam.scrollX * .3;
    this.bg_2.tilePositionX = this.myCam.scrollX * .6;
    this.obstacle.tilePositionX = this.myCam.scrollX * .6;
    this.bg_3.tilePositionX = this.myCam.scrollX * 1;
  }
}