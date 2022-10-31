import Phaser from 'phaser';
import BaseScene from '../BaseScene'
import gameConfig from '../../GameConfig';
import {
  loadEventOptionEngines,
  updateCharacterStats,
  listCharacterSelectsItems,
  createCharacterCollectsMaterials,
  readScene,
  loadItemUrl,
  characterTakeOptionEngine,
  characterCollectsMaterialEngines
} from '../../GameApi';
import { func } from 'prop-types';
import { readEventEngine } from '../../GameApi';

const heroRunningSprite = 'metaverse/walkingsprite.png';
const ground = 'metaverse/transparent-ground.png';
const selectAction = 'metaverse/scenes/background_menu.png';
const btnBlank = 'metaverse/scenes/selection.png';

const BtnExit = 'metaverse/scenes/UI_exit.png'
const UI_Utility = 'metaverse/scenes/UI-utility.png'
const UI_Utility_Sprite = 'metaverse/scenes/UI_Utility_Sprite.png'
const item_potion = 'metaverse/scenes/item_ingame_HP.png'

const popupWindow = 'metaverse/selectMap/Catalonia_popup.png';
const popupClose = 'metaverse/selectMap/UI_ingame_close.png';

export default class Engine extends BaseScene {
  constructor() {
    super('Engine');
  }


  init(data) {
    this.listScene = data.listScene;
  }

  async preload() {
    this.addLoadingScreen();
    console.log("data: ", this.listScene);
    this.eventId = this.listScene[0];
    this.initialLoad(this.eventId);
    console.log("this eventid: ", this.eventId);
    this.load.rexAwait(function (successCallback, failureCallback) {
      characterTakeOptionEngine(this.eventId).then((result) => {
        this.characterTakeOptions = result;
        successCallback();
      });
    }, this);
    this.load.rexAwait(function (successCallback, failureCallback) {
      characterCollectsMaterialEngines(this.eventId).then((result) => {
        this.characterCollectMaterials = result;
        successCallback();
      });
    }, this);
    this.sceneEvent = await readScene(this.listScene[0])
    console.log(this.sceneEvent);


    //Preload
    this.clearSceneCache(['bg', 'UI_strength', 'effect', 'player', 'pickItemText',
      'itembox', 'btnGo', 'btnClear', 'ground', 'background1', 'background2',
      'background3', 'selectAction', 'btnBlank', 'obstacle', 'popupWindow']);
    // this.clearSceneCache();
    this.isInteracting = false;
    this.isInteracted = false;
    this.load.spritesheet("hero-running", heroRunningSprite, {
      frameWidth: 197,
      frameHeight: 337
    });
    this.load.image("ground", ground);
    this.load.image("background1", loadItemUrl(this.sceneEvent.back));
    this.load.image("background2", loadItemUrl(this.sceneEvent.mid));
    this.load.image("background3", loadItemUrl(this.sceneEvent.front));
    this.load.image("selectAction", selectAction);
    this.load.spritesheet('btnBlank', btnBlank, { frameWidth: 1102, frameHeight: 88 });
    this.load.image("obstacle", loadItemUrl(this.sceneEvent.obstacle));

    //UI -- One time load
    this.load.image("BtnExit", BtnExit);
    this.load.spritesheet('UI_Utility_Sprite', UI_Utility_Sprite, { frameWidth: 192, frameHeight: 192 });
    this.load.image("item_potion", item_potion);

    //Popup
    this.load.spritesheet('popupWindow', popupWindow, { frameWidth: 980, frameHeight: 799 });
    this.load.image("popupClose", popupClose);

  }


  async create() {
    console.log("this.characterTakeOptions 2", this.characterTakeOptions);
    console.log(this.listScene.shift())
    // add audios
    this.hoverSound = this.sound.add('hoverSound');
    this.clickSound = this.sound.add('clickSound');
    this.pregameSound = this.sound.add('pregameSound', { loop: true });
    this.sfx_obstacle_remove = this.sound.add('sfx_obstacle_remove');
    this.sfx_char_footstep = this.sound.add('sfx_char_footstep', { loop: true, volume: 0.2 });

    if (this.characterStatus == 'Exhausted') {
      this.scene.start('exhausted');
    } else {
      this.pregameSound.play();
      this.sfx_char_footstep.play();
    }

    this.createSceneLayers();
    // platforms
    const platforms = this.physics.add.staticGroup();
    for (let x = -50; x < gameConfig.scale.width * 4; x += 4) {
      platforms.create(x, 635, "ground").refreshBody();
    }
    this.physics.add.collider(this.player, platforms);

    this.createUIElements();
    this.defineCamera(5118, gameConfig.scale.height);
    this.createPauseScreen();

    // load selected items ids
    this.selectedItemsIds = await listCharacterSelectsItems(this.characterData.id);
    console.log(this.selectedItemsIds);


    // load event options
    this.eventOptions = await loadEventOptionEngines(this.eventId, this.selectedItemsIds);

    // stats before choose option
    this.setValue(this.hp, this.characterData.currentHP / this.characterData.maxHP * 100);
    this.setValue(this.stamina, this.characterData.currentStamina / this.characterData.maxStamina * 100);
    this.setValue(this.mana, this.characterData.currentMana / this.characterData.maxMana * 100);
    this.setValue(this.morale, this.characterData.currentMorale / this.characterData.maxMorale * 100);

    this.options = [];


    //popup
    this.premiumPopupWindow = this.add.sprite(gameConfig.scale.width / 2, gameConfig.scale.height / 2, "popupWindow")
      .setScale(0.5).setVisible(false).setScrollFactor(0);

    this.premiumPopupCloseBtn = this.add.image(gameConfig.scale.width / 2 + 230, gameConfig.scale.height / 2 - 150, "popupClose")
      .setInteractive().setScale(0.25).setVisible(false).setScrollFactor(0).setScale(0.25);

    this.premiumPopupCloseBtn.on('pointerdown', () => {
      this.clickSound.play();
      this.isInteracted = true;
      this.premiumPopupWindow.setVisible(false);
      this.premiumPopupCloseBtn.setVisible(false);
      this.des.setVisible(false);
      this.triggerPause();
   
    });

    // load description of event
    this.event = await readEventEngine(this.eventId)

    this.des = this.make.text({
      x: gameConfig.scale.width / 2,
      y: gameConfig.scale.height / 2 - 10,
      text: this.event.description,
      origin: { x: 0.5, y: 0.5 },
      style: {
        font: 'bold 25px Arial',
        fill: 'gray',
        wordWrap: { width: 400 }
      }
    }).setVisible(false).setScrollFactor(0);

    //Scrolling
    this.scrolling();


    for (const idx in this.eventOptions) {

      // can take option or not
      const takeable = this.eventOptions[idx][0];

      this.options[idx] = this.add.sprite(gameConfig.scale.width / 2, gameConfig.scale.height / 2 - 100 + idx * 70, 'btnBlank').setScale(0.67);


      this.options[idx].text = this.add.text(
        gameConfig.scale.width / 2, gameConfig.scale.height / 2 - 100 + idx * 70, this.eventOptions[idx][1].description, { fill: '#fff', align: 'center', fontSize: '20px' })
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
          this.sfx_obstacle_remove.play();
          // stats after choose option
          this.setValue(this.hp, this.characterTakeOptions[idx].currentHP / this.characterTakeOptions[idx].maxHP * 100);
          this.setValue(this.stamina, this.characterTakeOptions[idx].currentStamina / this.characterTakeOptions[idx].maxStamina * 100);
          this.setValue(this.mana, this.characterTakeOptions[idx].currentMana / this.characterTakeOptions[idx].maxMana * 100);
          this.setValue(this.morale, this.characterTakeOptions[idx].currentMorale / this.characterTakeOptions[idx].maxMorale * 100);
          
          //HP, Stamina, mana, morele in col 
          let loss_stat = this.showLossStat(this.characterData, this.characterTakeOptions[idx])
          this.showColorLossStat(423, 65, loss_stat[0]);
          this.showColorLossStat(460 + 200, 65, loss_stat[1]);
          this.showColorLossStat(470 + 200 * 2 + 20, 65, loss_stat[2]);
          this.showColorLossStat(490 + 200 * 3 + 35, 65, loss_stat[3]);
          
          // update character after choose option
          updateCharacterStats(this.characterTakeOptions[idx]);
          // create charactercollectsmaterials after choose option
          // createCharacterCollectsMaterials(this.characterCollectMaterials[idx]);
        }
      });
    };
  }
  
  update() {
    //new player logic
    if (this.player.body.touching.down && this.isInteracting == false) {
      this.player.setVelocityX(settings.movementSpeed);
    }

    if (this.player.x > 5100) {
      console.log(this.sum)
      this.pregameSound.stop();
      this.sfx_char_footstep.stop();

      if (this.listScene.length === 0) this.scene.start("thanks", { isUsedPotion: this.isUsedPotion });
      else this.scene.start("Engine", { isUsedPotion: this.isUsedPotion, listScene: this.listScene });
    }

    if (this.player.x > 4200 && this.isInteracted == false) {

      this.premiumPopupWindow.setVisible(true);
      this.premiumPopupCloseBtn.setVisible(true);
      this.des.setVisible(true);
      // this.triggerPause();
      this.sfx_char_footstep.stop();
      this.player.setVelocityX(0);
      this.player.play('idle-anims');
      this.player.stop();
    }

    //bg
    // scroll the texture of the tilesprites proportionally to the camera scroll
    this.bg_1.tilePositionX = this.myCam.scrollX * .3;
    this.bg_2.tilePositionX = this.myCam.scrollX * 1;
    this.obstacle.tilePositionX = this.myCam.scrollX * 1;
    this.bg_3.tilePositionX = this.myCam.scrollX * 1;
  }
}