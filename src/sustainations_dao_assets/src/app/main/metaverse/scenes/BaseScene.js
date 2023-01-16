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
  listCharacterCollectsMaterials,
  getHpPotion,
  getUsableItem,
  useUsableItem,
  getQuestGameInfo,
  listStash,
  randomStashPotion,
  listSceneQuests
} from '../GameApi';
import { random } from "lodash";

class BaseScene extends Phaser.Scene {
  constructor(key) {
    super(key);
  }

  initialLoad(eventID) {
    this.eventId = eventID;
    // this.load.rexAwait(function (successCallback, failureCallback) {
    //   getUserInfo().then((result) => {
    //     this.userInfo = result.ok;
    //     successCallback();
    //   });
    // }, this);
    // // load character
    // this.load.rexAwait(function (successCallback, failureCallback) {
    //   loadCharacter().then((result) => {
    //     this.characterData = result.ok[1];
    //     console.log(this.characterData);
    //     successCallback();
    //   });
    // }, this);

    // this.load.rexAwait(function (successCallback, failureCallback) {
    //   characterTakeOption(this.eventId).then((result) => {
    //     this.characterTakeOptions = result;
    //     successCallback();
    //   });
    // }, this);

    // this.load.rexAwait(function (successCallback, failureCallback) {
    //   getCharacterStatus().then((result) => {
    //     this.characterStatus = result.ok;
    //     successCallback();
    //   });
    // }, this);

    // this.load.rexAwait(function (successCallback, failureCallback) {
    //   getCharacterStatus().then((result) => {
    //     this.characterStatus = result.ok;
    //     successCallback();
    //   });
    // }, this);

    this.load.rexAwait(function (successCallback, failureCallback) {
      characterCollectsMaterials(this.eventId).then((result) => {
        this.characterCollectMaterials = result;
        console.log(result);
        successCallback();
      });
    }, this);

    // this.load.rexAwait(function (successCallback, failureCallback) {
    //   getHpPotion().then((result) => {
    //     this.hpPotion = result.ok;
    //     successCallback();
    //   });
    // }, this);
    this.load.rexAwait(function (successCallback, failureCallback) {
      randomStashPotion().then((result) => {
        this.usableItem = result?.[0];
        this.usableItemName = result?.[1];
        console.log(" this.usableItem: ",  this.usableItem);
        successCallback();
      });
    }, this);

    // this.load.rexAwait(function (successCallback, failureCallback) {
    //   listStash().then((result) => {
    //     this.listStash = result;
    //     console.log("this.listStash: ", this.listStash);
    //     successCallback();
    //   });
    // }, this);

    this.load.rexAwait(function (successCallback, failureCallback) {
      getQuestGameInfo(this.eventId).then((result) => {
        this.questGameInfo = result.ok;
        this.userInfo = result.ok.userProfile.username[0];
        this.characterData = result.ok.characterData[0][1];
        console.log("character: ", this.characterData)
        this.characterStatus = result.ok.characterStatus;
        this.characterTakeOptions = result.ok.characterTakesOption;
        this.listStash = result.ok.stashInfo;
        successCallback();
      });
    }, this);

    // this.load.rexAwait(function (successCallback, failureCallback) {
    //   getCharacterActions(this.eventId).then((result) => {
    //     console.log("GET CHARACTER ACTIONS",result.ok);
    //     this.characterTakeOptions = result.ok.characterTakeOption;
    //     this.characterCollectMaterials = result.ok.characterCollectsMaterials;
    //     successCallback();
    //   });
    // }, this);
  }

  createSceneLayers() {
    //background
    this.bg_1 = this.add.tileSprite(0, 0, gameConfig.scale.width, gameConfig.scale.height, "background1");
    this.bg_1.setOrigin(0, 0);
    this.bg_1.setScrollFactor(0);

    this.bg_2 = this.add.tileSprite(0, 0, gameConfig.scale.width, gameConfig.scale.height, "background2");
    this.bg_2.setOrigin(0, 0);
    this.bg_2.setScrollFactor(0);

    if (this.textures.exists("obstacle")) {
      this.obstacle = this.add.tileSprite(0, 0, gameConfig.scale.width, gameConfig.scale.height, "obstacle")
        .setOrigin(0, 0)
        .setScrollFactor(0);
    } else {
      console.log('Obstacle not found');
    }

    //player
    this.player = this.physics.add.sprite(-50, 500, "hero-running").setScale(0.67);
    // this.player = this.physics.add.sprite(-50, 500, "hero-running").setScale(0.67);

    this.anims.create({
      key: "running-anims",
      frames: this.anims.generateFrameNumbers("hero-running", { start: 1, end: 8 }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: "idle-anims",
      frames: this.anims.generateFrameNumbers("hero-running", { start: 0, end: 0 }),
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
    this.add.text(90, 47, 'Trekker', { fill: '#000', align: 'center', fontSize: '9px', font: 'Arial' }).setScrollFactor(0);
    this.add.text(90, 65, this.userInfo, { fill: '#000', align: 'center', font: '15px Arial' }).setScrollFactor(0);
    this.add.image(255, 30, "UI_HP").setOrigin(0).setScrollFactor(0);
    this.add.image(490, 30, "UI_Mana").setOrigin(0).setScrollFactor(0);
    this.add.image(725, 30, "UI_Stamina").setOrigin(0).setScrollFactor(0);
    this.add.image(960, 30, "UI_Morale").setOrigin(0).setScrollFactor(0);

    // this.add.image(20, 100, "item_ingame_HP").setOrigin(0).setScrollFactor(0);
    // this.add.image(20, 150, "item_ingame_HP").setOrigin(0).setScrollFactor(0);
    // this.add.image(20, 200, "item_ingame_HP").setOrigin(0).setScrollFactor(0);
    // this.add.image(20, 250, "item_ingame_HP").setOrigin(0).setScrollFactor(0);

    this.add.image(1190, 50, "BtnExit").setOrigin(0).setScrollFactor(0).setScale(0.7)
      .setInteractive()
      .on('pointerdown', () => {
        this.clickSound.play();
        try { this.pregameSound.stop(); } catch { }
        try { this.ambientSound.stop(); } catch { }
        try { this.sfx_char_footstep.stop(); } catch { }
        try { this.sfx_small_waterfall.stop(); } catch { }
        try { this.sfx_big_waterfall.stop(); } catch { }
        try { this.ingameSound.stop(); } catch { }
        try { this.sfx_monkey.stop(); } catch { }
        this.scene.start('selectMap');
      });
    //set value
    this.hp = this.makeBar(325, 65, 100, 15, 0x74e044).setScrollFactor(0);
    this.mana = this.makeBar(325 + 235, 65, 100, 15, 0xc038f6).setScrollFactor(0);
    this.stamina = this.makeBar(325 + 235 * 2, 65, 100, 15, 0xcf315f).setScrollFactor(0);
    this.morale = this.makeBar(325 + 235 * 3, 65, 100, 15, 0x63dafb).setScrollFactor(0);

    this.itemSlot = [];
    let imgLandItem = "";
    if (this.usableItem != undefined) {
      if (this.isUsedUsableItem.usedUsableItem != true) {
        this.stashRandom = this.usableItem
        this.isUsedUsableItem.usedUsableItem = false;
      }
      else {
        this.isUsedUsableItem.useUsableItem = false;
      }
    }
    else {
      this.isUsedUsableItem.usedUsableItem = true;
    }
    console.log("usableItemName:", this.usableItemName)
    switch (this.usableItemName) {
      case "HP_Potion":
        imgLandItem = "item_hp";
        break;
      case "Stamina_Potion":
        imgLandItem = "item_stamina";
        break;
      case "Mana_Potion":
        imgLandItem = "item_mana";
        break;
      case "Morale_Potion":
        imgLandItem = "item_morale";
        break;
      case "Super_Potion":
        imgLandItem = "item_super";
        break;
      default:
        imgLandItem = "";
    }
    if (this.isUsedUsableItem.usedUsableItem == false && imgLandItem != "") {
      this.itemSlot[0] = this.add.image(55, 550, "UI_Utility_Sprite")
        .setOrigin(0).setScrollFactor(0).setScale(0.5).setFrame(1);
      this.potion = this.add.image(68, 563, imgLandItem)
        .setOrigin(0).setInteractive().setScrollFactor(0).setScale(0.5);
      this.potion.on('pointerdown', () => {
        this.clickSound.play();
        this.itemSlot[0].setFrame(0);
        this.potion.setVisible(false);
        this.isUsedUsableItem = {
          useUsableItem: true,
          stashId: this.stashRandom.id,
          usedUsableItem: true,
          statusCharacter: this.characterData
        };
        this.itemnotice = this.add.image(gameConfig.scale.width / 2, gameConfig.scale.height / 2, "itemnotice").setScrollFactor(0).setScale(0.5).setOrigin(0.5);
        this.textnotice = this.make.text({
          x: gameConfig.scale.width / 2,
          y: gameConfig.scale.height / 2 - 10,
          text: "Your stats will be increased in the next scene.",
          origin: { x: 0.5, y: 0.5 },
          style: {
            font: 'bold 15px Arial',
            fill: 'black',
            wordWrap: { width: 400 }
          }
        }).setScrollFactor(0).setOrigin(0.5)

        this.tweens.add({
          targets: this.textnotice,
          alpha: 0,
          duration: 10000,
          ease: 'Power2'
        }, this);

        this.tweens.add({
          targets: this.itemnotice,
          alpha: 0,
          duration: 10000,
          ease: 'Power2'
        }, this);

        console.log("Used Usable Item => ");
      });
    } else {
      this.itemSlot[0] = this.add.image(55, 550, "UI_Utility_Sprite").setOrigin(0).setScrollFactor(0).setScale(0.5);
    }
    this.itemSlot[1] = this.add.image(125, 505, "UI_Utility_Sprite").setOrigin(0).setScrollFactor(0).setScale(0.5);
    this.itemSlot[2] = this.add.image(195, 550, "UI_Utility_Sprite").setOrigin(0).setScrollFactor(0).setScale(0.5);
  }

  isExhausted() {
    if (this.characterStatus == 'Exhausted') {
      this.scene.start('exhausted');
    } else {
      if (this.isHealedPreviously) {
        for (const i in this.characterTakeOptions) {
          this.characterTakeOptions[i].currentHP += 3;
        }
      }
    }
  };

  usePotion() {
    if (this.isHealedPreviously) {
      var newValue = this.characterData.currentHP + 3;
      if (newValue > this.characterData.maxHP) {
        newValue = this.characterData.maxHP;
      }
      this.setValue(this.hp, newValue / this.characterData.maxHP * 100);
    } else {
      this.setValue(this.hp, this.characterData.currentHP / this.characterData.maxHP * 100);
    }
  };

  async listMaterial() {
    this.collectedMaterials = await listCharacterCollectsMaterials(this.characterData.id);
    console.log("MATERIAL", this.collectedMaterials);
  };

  defineCamera(width, height) {
    this.myCam = this.cameras.main;
    this.myCam.setBounds(0, 0, width, height);
    this.myCam.startFollow(this.player);
  }

  createPauseScreen() {
    this.veil = this.add.graphics({ x: 0, y: 0 })
      .fillStyle('0x000000', 0.2);
    this.veil.fillRect(0, 0, gameConfig.scale.width, gameConfig.scale.height)
      .setScrollFactor(0).setVisible(false);
    this.selectAction = this.add.image(0, 0, 'selectAction')
      .setOrigin(0, 0).setScrollFactor(0).setVisible(false);
  }

  //loading screen for every scene
  addLoadingScreen() {
    this.add.image(
      gameConfig.scale.width / 2, gameConfig.scale.height / 2 - 35, 'logo'
    ).setOrigin(0.5, 0.5).setScale(0.15);
    this.anims.create({
      key: 'loading-anims',
      frames: this.anims.generateFrameNumbers("loading", { start: 0, end: 11 }),
      frameRate: 12,
      repeat: -1
    });
    this.add.sprite(
      gameConfig.scale.width / 2, gameConfig.scale.height / 2 + 100, "loading"
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
  setValue(bar, percentage) {
    if (percentage / 100 > 1) {
      bar.scaleX = 1;
    } else {
      bar.scaleX = percentage / 100;
    }
  }
  showLossStat(character_before, character_after) {
    let lossStamina = character_after.currentStamina - character_before.currentStamina
    let lossHp = character_after.currentHP - character_before.currentHP
    let lossMana = character_after.currentMana - character_before.currentMana
    let lossMorale = character_after.currentMorale - character_before.currentMorale
    if (lossHp != 0) {
      console.log('HP: ', lossHp)
    }
    if (lossMana != 0) {
      console.log('MANA: ', lossMana)
    }
    if (lossStamina != 0) {
      console.log('STAMINA: ', lossStamina)
    }
    if (lossMorale != 0) {
      console.log('MORALE: ', lossMorale)
    }
    let r = [lossHp, lossMana, lossStamina, lossMorale]
    console.log("finish");
    return r
  }

  showColorLossStat(x, y, stat) {
    let fill1 = "#ff0044";
    if (stat > 0) {
      fill1 = "#008000";
    }
    if (stat != 0) {
      if (stat > 0) {
        stat = "+" + stat;
      }

      this.statText = this.add.text(x, y, stat, {
        font: 'bold 13px Arial',
        fill: fill1
      }).setOrigin(0).setScrollFactor(0);

      this.tweens.add({
        targets: this.statText,
        alpha: 0,
        duration: 6000,
        ease: 'Power2'
      }, this);
    }
  }

  showColorLossAllStat(character_before, character_after) {
    let loss_stat = this.showLossStat(character_before, character_after)
    this.showColorLossStat(423, 65, loss_stat[0]);
    this.showColorLossStat(460 + 200, 65, loss_stat[1]);
    this.showColorLossStat(470 + 200 * 2 + 20, 65, loss_stat[2]);
    this.showColorLossStat(490 + 200 * 3 + 35, 65, loss_stat[3]);
    console.log(loss_stat)
  }

  clearSceneCache(textures_list) {
    for (const index in textures_list) {
      this.textures.remove(textures_list[index]);
    }
  }

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

  scrolling() {
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
  }

  playerLogicEngine(locationStop, locationInteract, nextScene) {
    //new player logic
    if (this.player.body.touching.down && this.isInteracting == false) {
      this.player.setVelocityX(settings.movementSpeed);
    }

    if (this.player.x > locationStop) { //5100
      console.log(this.sum)
      this.pregameSound.stop();
      this.sfx_char_footstep.stop();

      if (this.listScene.length === 0) this.scene.start("thanks");
      else this.scene.start(nextScene, {listScene: this.listScene });
    }

    if (this.player.x > locationInteract && this.isInteracted == false) { //4200

      this.premiumPopupWindow.setVisible(true);
      this.premiumPopupCloseBtn.setVisible(true);
      this.des.setVisible(true);
      this.sfx_char_footstep.stop();
      this.player.setVelocityX(0);
      this.player.play('idle-anims');
      this.player.stop();
    }
  }

  scrollTexture(speedBack, speedMid, speedObstacle, speedFront) {
    this.bg_1.tilePositionX = this.myCam.scrollX * speedBack;
    this.bg_2.tilePositionX = this.myCam.scrollX * speedMid;
    this.obstacle.tilePositionX = this.myCam.scrollX * speedObstacle;
    this.bg_3.tilePositionX = this.myCam.scrollX * speedFront;
  };

  useUsableItemScene(isUsedUsableItem, eventId) {
    let characterBefore;
    if (isUsedUsableItem.useUsableItem == true) {
      this.load.rexAwait(function (successCallback, failureCallback) {
        loadCharacter().then((result) => {
          this.characterData = result.ok[1];
          this.characterBefore = this.characterData;
          this.load.rexAwait(function (successCallback, failureCallback) {
            useUsableItem(this.characterData.id, isUsedUsableItem.stashId).then((result) => {
              this.initialLoad(eventId);
              successCallback();
            });
          }, this);
          successCallback();
        });
      }, this);
    }
    else {
      this.initialLoad(eventId);
    }
    return characterBefore;
  }
}
export default BaseScene;