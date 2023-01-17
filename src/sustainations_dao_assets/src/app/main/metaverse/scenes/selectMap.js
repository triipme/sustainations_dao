import Phaser from 'phaser';
import BaseScene from './BaseScene'
import gameConfig from '../GameConfig';
import history from "@history";
import {
  resetCharacter,
  loadCharacter,
  getRemainingTime,
  payQuest,
  payQuestEngine,
  getUserInfo,
  buyLandSlot,
  getAllScenes,
  getAdminQuest
} from '../GameApi';

const bg = 'metaverse/selectMap/background.png';
const text = 'metaverse/selectMap/call_to_action.png';
const selectArea = 'metaverse/selectMap/select-area.png';
const jungleLocationDetail = 'metaverse/selectMap/jungle_location_detail.png';
const cataloniaLocationDetail = 'metaverse/selectMap/catalonia_location_detail.png';
const lavaLocationDetail = 'metaverse/selectMap/lava_location_detail.png';
const lakeLocationDetail = 'metaverse/selectMap/lake_location_detail.png'
const engineLocationDetail = 'metaverse/selectMap/lake_location_detail.png'
const btnBack = 'metaverse/selectItems/UI_back.png';
const popupWindow = 'metaverse/selectMap/Jungle_popup.png';
const popupClose = 'metaverse/selectMap/UI_ingame_close.png';
const popupAccept = 'metaverse/selectMap/UI_ingame_popup_accept.png';
const itemnotice = 'metaverse/selectMap/item_notice.png';

// const popupWindowEngine = 'metaverse/selectMap/Jungle_popup.png';
const popupWindowEngine = 'metaverse/selectMap/Catalonia_popup.png';
const popupCloseEngine = 'metaverse/selectMap/UI_ingame_close.png';
const popupAcceptEngine = 'metaverse/selectMap/UI_ingame_popup_accept.png';




class selectMap extends BaseScene {
  constructor() {
    super('selectMap');
    // this.questPrice = 0;
  }

  clearCache() {
    const textures_list = ["bg", "welcomeText", 'introduction_btn', 'bootcamp_btn', 'departure_btn', 'land_btn', 'quest_btn'];
    for (const index in textures_list) {
      this.textures.remove(textures_list[index]);
    }
    console.clear();
  }



  preload() {
    this.addLoadingScreen();
    this.load.rexAwait(function (successCallback, failureCallback) {
      getUserInfo().then((result) => {
        this.userInfo = result.ok;
        console.log(this.userInfo);
        successCallback();
      });
    }, this);
    this.load.rexAwait(function (successCallback, failureCallback) {
      loadCharacter().then((result) => {
        this.characterData = result.ok[1];
        console.log(this.characterData);
        successCallback();
      });
    }, this);

    //just for quest-design
    this.questPrice
    this.load.rexAwait(function (successCallback, failureCallback) {
      getAdminQuest().then((result) => {
        this.questId = result.id;
        this.questPrice = result.price
        // console.log("quest price: ", result.price)
        this.load.rexAwait(function (successCallback, failureCallback) {
          getAllScenes(this.questId).then((result) => {
            this.listScene = result;
            console.log(result);
            successCallback();
          });
        }, this);
        successCallback();
      });
    }, this);
    console.log(this.questPrice)
   
    //preload
    this.clearCache();
    this.load.image('bg', bg);
    this.load.image('text', text);
    this.load.image('jungleLocationDetail', jungleLocationDetail);
    this.load.image('cataloniaLocationDetail', cataloniaLocationDetail);
    this.load.image('lavaLocationDetail', lavaLocationDetail);
    this.load.image('lakeLocationDetail', lakeLocationDetail);
    this.load.image('engineLocationDetail', engineLocationDetail); //enigne
    this.load.spritesheet('selectArea', selectArea, { frameWidth: 498, frameHeight: 800 });
    this.load.image("btnBack", btnBack);
    this.load.spritesheet('popupWindow', popupWindow, { frameWidth: 980, frameHeight: 799 });
    this.load.image("popupClose", popupClose);
    this.load.image("popupAccept", popupAccept);
    this.load.image("itemnotice", itemnotice);

    //engine
    this.load.spritesheet('popupWindowEngine', popupWindowEngine, { frameWidth: 980, frameHeight: 799 });
    this.load.image("popupCloseEngine", popupCloseEngine);
    this.load.image("popupAcceptEngine", popupAcceptEngine);
  }




  async create() {
    // add audios
    this.hoverSound = this.sound.add('hoverSound');
    this.clickSound = this.sound.add('clickSound');

    this.background = this.add.image(0, 0, 'bg').setOrigin(0);
    this.jungleLocationDetail = this.add.image(247, 167, 'jungleLocationDetail')
      .setVisible(false).setInteractive();
    this.cataloniaLocationDetail = this.add.image(247, 167, 'cataloniaLocationDetail')
      .setVisible(false).setInteractive();
    this.lavaLocationDetail = this.add.image(247, 167, 'lavaLocationDetail')
      .setVisible(false).setInteractive();
    this.lakeLocationDetail = this.add.image(247, 167, 'lakeLocationDetail')
      .setVisible(false).setInteractive();
    this.engineLocationDetail = this.add.image(247, 167, 'engineLocationDetail')
      .setVisible(false).setInteractive();
    this.btnBack = this.add.image(40, 25, 'btnBack')
      .setOrigin(0).setInteractive();
    this.btnBack.on('pointerdown', () => {
      this.clickSound.play();
      history.push("/metaverse");
    });

    this.currentICP = Number(this.userInfo.balance);
    this.requiredICP = 20000;
    this.waitingTime = 60;
    this.getRemainingTime = await getRemainingTime(this.waitingTime, this.characterData);

    this.selectAreaJungle = this.add.sprite(627, 467, 'selectArea')
      .setScale(0.18)
      .setInteractive();
    this.selectAreaJungle.on('pointerover', () => {
      this.selectAreaJungle.setFrame(1);
      this.jungleLocationDetail.setVisible(true);
      this.hoverSound.play();
    });
    this.selectAreaJungle.on('pointerout', () => {
      this.selectAreaJungle.setFrame(0);
      this.jungleLocationDetail.setVisible(false);
    });
    this.selectAreaJungle.on('pointerdown', async () => {
      this.clickSound.play();
      this.premiumPopupWindow.setVisible(true);
      this.premiumPopupCloseBtn.setVisible(true);
      if (this.currentICP >= this.requiredICP) {
        this.premiumPopupAcceptBtn.setVisible(true);
      }
      this.selectAreaJungle.disableInteractive();
      this.selectAreaCatalonia.disableInteractive();
    });

    this.selectAreaCatalonia = this.add.sprite(620, 337, 'selectArea')
      .setScale(0.18)
      .setInteractive();
    this.selectAreaCatalonia.on('pointerover', () => {
      this.selectAreaCatalonia.setFrame(1);
      this.cataloniaLocationDetail.setVisible(true);
      this.hoverSound.play();
    });
    this.selectAreaCatalonia.on('pointerout', () => {
      this.selectAreaCatalonia.setFrame(0);
      this.cataloniaLocationDetail.setVisible(false);
    });
    this.selectAreaCatalonia.on('pointerdown', () => {
      this.clickSound.play();
      if (this.getRemainingTime != 0) this.scene.start('exhausted');
      else {
        resetCharacter();
        this.scene.start('selectItemScene', { map: 'catalonia1' });
      };
    });

    this.selectAreaLava = this.add.sprite(1030, 250, 'selectArea')
      .setScale(0.18)
      .setInteractive();
    this.selectAreaLava.on('pointerover', () => {
      this.selectAreaLava.setFrame(1);
      this.lavaLocationDetail.setVisible(true);
      this.hoverSound.play();
    });
    this.selectAreaLava.on('pointerout', () => {
      this.selectAreaLava.setFrame(0);
      this.lavaLocationDetail.setVisible(false);
    });
    this.selectAreaLava.on('pointerdown', () => {
      this.clickSound.play();
      if (this.getRemainingTime != 0) this.scene.start('exhausted');
      else {
        resetCharacter();
        this.scene.start('selectItemScene', { map: 'lava' });
      };
    });

    this.selectAreaLake = this.add.sprite(762, 408, 'selectArea')
      .setScale(0.18)
      .setInteractive();
    this.selectAreaLake.on('pointerover', () => {
      this.selectAreaLake.setFrame(1);
      this.lakeLocationDetail.setVisible(true);
      this.hoverSound.play();
    });
    this.selectAreaLake.on('pointerout', () => {
      this.selectAreaLake.setFrame(0);
      this.lakeLocationDetail.setVisible(false);
    });
    this.selectAreaLake.on('pointerdown', () => {
      this.clickSound.play();
      if (this.getRemainingTime != 0) this.scene.start('exhausted');
      else {
        resetCharacter();
        this.scene.start('selectItemScene', { map: 'lake' });
      };
    });

    //Engine
    this.selectAreaEngine = this.add.sprite(420, 393, 'selectArea')
      .setScale(0.18)
      .setInteractive();
    this.selectAreaEngine.on('pointerover', () => {
      this.selectAreaEngine.setFrame(1);
      this.engineLocationDetail.setVisible(true);
      this.hoverSound.play();
    });
    this.selectAreaEngine.on('pointerout', () => {
      this.selectAreaEngine.setFrame(0);
      this.engineLocationDetail.setVisible(false);
    });
    this.selectAreaEngine.on('pointerdown', async () => {
      this.clickSound.play();
      this.premiumPopupWindowEngine.setVisible(true);
      this.premiumPopupCloseBtnEngine.setVisible(true);
      if (this.currentICP >= this.requiredICP) {
        this.premiumPopupAcceptBtnEngine.setVisible(true);
      }
      this.desPopup.setVisible(true)
      this.selectAreaEngine.disableInteractive();
      this.selectAreaCatalonia.disableInteractive();
      this.selectAreaEngine.disableInteractive();
    });

    //Engine popup
    this.premiumPopupWindowEngine = this.add.sprite(gameConfig.scale.width / 2, gameConfig.scale.height / 2, "popupWindowEngine")
      .setScale(0.5).setVisible(false);
    if (this.currentICP < this.requiredICP) {
      this.premiumPopupWindowEngine.setFrame(1);
    }
    this.premiumPopupCloseBtnEngine = this.add.image(gameConfig.scale.width / 2 + 230, gameConfig.scale.height / 2 - 150, "popupCloseEngine")
      .setInteractive().setScale(0.25).setVisible(false);
    this.premiumPopupAcceptBtnEngine = this.add.image(gameConfig.scale.width / 2, gameConfig.scale.height / 2 + 115, "popupAcceptEngine")
      .setInteractive().setScale(0.5).setVisible(false);

    this.premiumPopupCloseBtnEngine.on('pointerdown', () => {
      this.clickSound.play();
      this.premiumPopupWindowEngine.setVisible(false);
      this.premiumPopupCloseBtnEngine.setVisible(false);
      this.premiumPopupAcceptBtnEngine.setVisible(false);
      this.desPopup.setVisible(false)
      this.selectAreaJungle.setInteractive();
      this.selectAreaCatalonia.setInteractive();
      this.selectAreaEngine.setInteractive();
    });
    this.premiumPopupAcceptBtnEngine.on('pointerdown', async () => {
      this.clickSound.play();
      if (this.getRemainingTime != 0) this.scene.start('exhausted');
      else {
        resetCharacter();
        this.scene.start('selectItemScene', { map: 'quest-design'});
        // await payQuestEngine(this.questId));
      };
    });

      //Des
      let price = Number(this.questPrice) * 0.00000001
      this.desPopup = this.make.text({
        x: gameConfig.scale.width / 2,
        y: gameConfig.scale.height / 2 - 10,
        text: `THIS QUEST REQUIRES ${price} $ICP TO PLAY.\nDO YOU AGREE?`,
        origin: { x: 0.5, y: 0.5 },
        style: {
          font: 'bold 30px Arial',
          fill: 'gray',
          wordWrap: { width: 400 },
          lineSpacing: 10
        }
      }).setVisible(false)

      console.log("quest price: ", typeof this.questPrice)

    //jungle popup
    this.premiumPopupWindow = this.add.sprite(gameConfig.scale.width / 2, gameConfig.scale.height / 2, "popupWindow")
      .setScale(0.5).setVisible(false);
    if (this.currentICP < this.requiredICP) {
      this.premiumPopupWindow.setFrame(1);
    }
    this.premiumPopupCloseBtn = this.add.image(gameConfig.scale.width / 2 + 230, gameConfig.scale.height / 2 - 150, "popupClose")
      .setInteractive().setScale(0.25).setVisible(false);
    this.premiumPopupAcceptBtn = this.add.image(gameConfig.scale.width / 2, gameConfig.scale.height / 2 + 115, "popupAccept")
      .setInteractive().setScale(0.5).setVisible(false);

    this.premiumPopupCloseBtn.on('pointerdown', () => {
      this.clickSound.play();
      this.premiumPopupWindow.setVisible(false);
      this.premiumPopupCloseBtn.setVisible(false);
      this.premiumPopupAcceptBtn.setVisible(false);
      this.selectAreaJungle.setInteractive();
      this.selectAreaCatalonia.setInteractive();
    });
    this.premiumPopupAcceptBtn.on('pointerdown', async () => {
      this.clickSound.play();
      if (this.getRemainingTime != 0) this.scene.start('exhausted');
      else {
        resetCharacter();
        this.scene.start('selectItemScene', { map: 'jungle' });
        // pay for jungle quest
        await payQuest("jungle");
      };
    });

  

    // const urlParams = new URLSearchParams(window.location.search);
    // const myParam = urlParams.get('questId');
    // console.log(myParam)

  }


}
export default selectMap;