import Phaser from 'phaser';
import BaseScene from '../BaseScene'
import gameConfig from '../../GameConfig';
import {
  loadEventOptionEngines,
  updateCharacterStatsEngine,
  listCharacterSelectsItems,
  loadItemUrl,
  characterTakeOptionEngine,
  characterCollectsMaterialEngines,
  readSceneEngine,
  readEventEngine 
} from '../../GameApi';
import { settings } from '../settings';
import { func } from 'prop-types';

const heroRunningSprite = 'metaverse/walkingsprite.png';
const ground = 'metaverse/transparent-ground.png';
const selectAction = 'metaverse/scenes/background_menu.png';
const btnBlank = 'metaverse/scenes/selection.png';

const BtnExit = 'metaverse/scenes/UI_exit.png'
const UI_Utility = 'metaverse/scenes/UI-utility.png'
const UI_Utility_Sprite = 'metaverse/scenes/UI_Utility_Sprite.png'
const item_hp = 'metaverse/farm/Sustaination_farm/farm-object/PNG/potion/HP_Potion.png'
const item_stamina = 'metaverse/farm/Sustaination_farm/farm-object/PNG/potion/Stamina_Potion.png'
const item_mana = 'metaverse/farm/Sustaination_farm/farm-object/PNG/potion/Mana_Potion.png'
const item_morale = 'metaverse/farm/Sustaination_farm/farm-object/PNG/potion/Morale_Potion.png'
const item_super = 'metaverse/farm/Sustaination_farm/farm-object/PNG/potion/Super_Potion.png'
const item_carrot = 'metaverse/scenes/item_ingame_carrot.png'
const item_tomato = 'metaverse/scenes/item_ingame_tomato.png'
const item_wheat = 'metaverse/scenes/item_ingame_wheat.png'

const popupWindo = 'metaverse/selectMap/Catalonia_popup.png';
const popupClose = 'metaverse/selectMap/UI_ingame_close.png';

export default class Engine extends BaseScene {
  constructor() {
    super('Test');
  }

  clearSceneCache() {
    const textures_list = ['bg', 'UI_strength', 'effect', 'player', 'pickItemText',
      'itembox', 'btnGo', 'btnClear', 'ground', 'background1', 'background2',
      'background3', 'selectAction', 'btnBlank', 'obstacle', 'popupWindow'];
    for (const index in textures_list) {
      this.textures.remove(textures_list[index]);
    }
  }

  init(data) {
    this.listScene = data.listScene;
    this.isUsedUsableItem = data.isUsedUsableItem;
    if (this.isUsedUsableItem == undefined){
      this.isUsedUsableItem = {
        useUsableItem: false,
        stashId: ""
      }
    }
  }

  async preload() {
    console.log("this.Lisce:", this.listScene)
    this.addLoadingScreen();
    this.load.rexAwait(function (successCallback, failureCallback) {
      readSceneEngine(this.listScene[0].id).then((result) => {
        this.characterBefore = this.useUsableItemScene(this.isUsedUsableItem, result.idEvent);
        // this.initialLoad(result.idEvent);
        this.sceneEvent = result;
        console.log("this.sceneEvent:", this.sceneEvent)
        this.load.image("background1", loadItemUrl(this.sceneEvent.back));
        this.load.image("background2", loadItemUrl(this.sceneEvent.mid));
        this.load.image("background3", loadItemUrl(this.sceneEvent.front));
        this.load.image("obstacle", loadItemUrl(this.sceneEvent.obstacle));
        this.load.rexAwait(function (successCallback, failureCallback) {
          characterTakeOptionEngine(this.sceneEvent.idEvent).then((result) => {
            this.characterTakeOptions = result;
            console.log(this.sceneEvent)
            console.log("da vao ham", result);
            successCallback();
          });
        }, this);
        this.load.rexAwait(function (successCallback, failureCallback) {
          characterCollectsMaterialEngines(this.sceneEvent.idEvent).then((result) => {
            this.characterCollectMaterials = result;
            successCallback();
          });
        }, this);          
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
    // this.load.image("background1", loadItemUrl(this.sceneEvent.back));
    // this.load.image("background2", loadItemUrl(this.sceneEvent.mid));
    // this.load.image("background3", loadItemUrl(this.sceneEvent.front));
    this.load.image("selectAction", selectAction);
    this.load.spritesheet('btnBlank', btnBlank, { frameWidth: 1102, frameHeight: 88 });
    // this.load.image("obstacle", loadItemUrl(this.sceneEvent.obstacle));

    //UI -- One time load
    this.load.image("BtnExit", BtnExit);
    this.load.spritesheet('UI_Utility_Sprite', UI_Utility_Sprite, { frameWidth: 192, frameHeight: 192 });
    this.load.image("item_hp", item_hp);
    this.load.image("item_stamina", item_stamina);
    this.load.image("item_morale", item_morale);
    this.load.image("item_mana", item_mana);
    this.load.image("item_super", item_super);
    this.load.image("item_carrot", item_carrot);
    this.load.image("item_tomato", item_tomato);
    this.load.image("item_wheat", item_wheat);

    //Popup
    this.load.spritesheet('popupWindo', popupWindo, { frameWidth: 980, frameHeight: 799 });
    this.load.image("popupClose", popupClose);

  }

  //defined function

  triggerPause() {
    this.isInteracting = true;
    this.veil.setVisible(true);
    this.selectAction.setVisible(true);
    for (const idx in this.options) {
      this.options[idx].setVisible(true);
      this.options[idx].text.setVisible(true);
    }

  }

  triggerContinue() {
    this.veil.setVisible(false);
    this.selectAction.setVisible(false);
    for (const idx in this.options) {
      this.options[idx].setVisible(false);
      this.options[idx].text.setVisible(false);
    }
    this.isInteracting = false;
    this.isInteracted = true;
    this.player.play('running-anims');
  }

  async create() {
    // if (this.isUsedUsableItem == undefined){
    //   this.isUsedUsableItem = {
    //     useUsableItem: false,
    //     stashId: ""
    //   }
    // }
    this.eventId = this.listScene[0].idEvent;
    this.listScene.shift()

    console.log(this.characterTakeOptions)
    console.log("this event id; ", this.eventId)
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
    this.defineCamera(5118, gameConfig.scale.height); //default 5118
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
    if (this.characterBefore != undefined) {
      this.showColorLossAllStat(this.characterBefore, this.characterData)
    }


    //popup
    this.premiumPopupWindow = this.add.sprite(gameConfig.scale.width / 2, gameConfig.scale.height / 2, "popupWindo")
      .setScale(0.5).setVisible(false).setScrollFactor(0);

    this.premiumPopupCloseBtn = this.add.image(gameConfig.scale.width / 2 + 230, gameConfig.scale.height / 2 - 150, "popupClose")
      .setInteractive().setScale(0.25).setVisible(false).setScrollFactor(0).setScale(0.25);

    this.premiumPopupCloseBtn.on('pointerdown', () => {
      console.log("Close");
      this.clickSound.play();
      this.isInteracted = true;
      this.premiumPopupWindow.setVisible(false);
      this.premiumPopupCloseBtn.setVisible(false);
      this.des.setVisible(false);
      this.triggerPause();
    });

    // load description of event
    this.rsEvent = await readEventEngine(this.eventId)
    this.event = this.rsEvent[0];
    console.log("time: ", this.rsEvent[1]);

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


    //scrolling
    this.graphics = this.make.graphics();

    this.graphics.fillRect(152, 230, 900, 250).setScrollFactor(0);

    this.mask = new Phaser.Display.Masks.GeometryMask(this, this.graphics);

    this.des.setMask(this.mask);

    // //  The rectangle they can 'drag' within
    this.add.zone(150, 230, 900, 250).setOrigin(0).setInteractive().setVisible(true).setScrollFactor(0)
      .on('pointermove', (pointer) => {
        if (pointer.isDown) {
          this.des.y += (pointer.velocity.y / 10);

          this.des.y = Phaser.Math.Clamp(this.des.y, -400, 720);
        }

      })

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
          updateCharacterStatsEngine(this.characterTakeOptions[idx]);
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

    if (this.player.x > 5100) { //default 5100
      this.pregameSound.stop();
      this.sfx_char_footstep.stop();

      if (this.listScene.length === 0) this.scene.start("thanks");
      else this.scene.start("Test", {listScene: this.listScene, isUsedUsableItem: this.isUsedUsableItem });
      // this.scene.start("Test", { isUsedPotion: this.isUsedPotion, listScene: this.listScene});
    }

    if (this.player.x > 4200 && this.isInteracted == false) { //default 4200

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
    // this.obstacle.tilePositionX = this.myCam.scrollX * 1;
    this.bg_3.tilePositionX = this.myCam.scrollX * 1;
  }
}