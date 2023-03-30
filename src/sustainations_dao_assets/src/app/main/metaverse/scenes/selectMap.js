import Phaser from "phaser";
import BaseScene from "./BaseScene";
import gameConfig from "../GameConfig";
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
  getAdminQuest,
  readQuestEngine,
  saveGameReward,
  getLeaderBoard
} from "../GameApi";

const bg = "metaverse/selectMap/background.png";
const text = "metaverse/selectMap/call_to_action.png";
const selectArea = "metaverse/selectMap/select-area.png";
const jungleLocationDetail = "metaverse/selectMap/jungle_location_detail.png";
const cataloniaLocationDetail = "metaverse/selectMap/catalonia_location_detail.png";
const lavaLocationDetail = "metaverse/selectMap/lava_location_detail.png";
const lakeLocationDetail = "metaverse/selectMap/lake_location_detail.png";
const engineLocationDetail = "metaverse/selectMap/lake_location_detail.png";
const btnBack = "metaverse/selectItems/UI_back.png";
const popupWindow = "metaverse/selectMap/Jungle_popup.png";
const popupClose = "metaverse/selectMap/UI_ingame_close.png";
const popupAccept = "metaverse/selectMap/UI_ingame_popup_accept.png";
const itemnotice = "metaverse/selectMap/item_notice.png";

// const popupWindowEngine = 'metaverse/selectMap/Jungle_popup.png';
const popupWindowEngine = "metaverse/selectMap/Catalonia_popup.png";
const popupCloseEngine = "metaverse/selectMap/UI_ingame_close.png";
const popupAcceptEngine = "metaverse/selectMap/UI_ingame_popup_accept.png";

//popup Leader board
const popupWindowLeaderBoard = "metaverse/selectMap/Catalonia_popup.png";
const popupCloseLeaderBoard = "metaverse/selectMap/UI_ingame_close.png";
const popupAcceptLeaderBoard = "metaverse/selectMap/UI_ingame_popup_accept.png";

const icoinWinner = "metaverse/selectMap/icoin_challenge.png";
const icoinGold = "metaverse/selectMap/icoin_gold.png";
const icoinSilver = "metaverse/selectMap/icoin_silver.png";
const icoinBronze = "metaverse/selectMap/icoin_bronze.png";

class selectMap extends BaseScene {
  constructor() {
    super("selectMap");
    // this.questPrice = 0;
  }

  clearCache() {
    const textures_list = [
      "bg",
      "welcomeText",
      "introduction_btn",
      "bootcamp_btn",
      "departure_btn",
      "land_btn",
      "quest_btn"
    ];
    for (const index in textures_list) {
      this.textures.remove(textures_list[index]);
    }
    console.clear();
  }

  preload() {
    this.addLoadingScreen();
    this.load.rexAwait(function (successCallback, failureCallback) {
      getUserInfo().then(result => {
        this.userInfo = result.ok;
        console.log("User info: ", this.userInfo);
        successCallback();
      });
    }, this);
    this.load.rexAwait(function (successCallback, failureCallback) {
      loadCharacter().then(result => {
        this.characterData = result.ok[1];
        console.log(this.characterData);
        successCallback();
      });
    }, this);

    //just for quest-design
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get("questId");
    if (myParam != null) {
      //get quest with param id
      this.load.rexAwait(function (successCallback, failureCallback) {
        readQuestEngine(myParam).then(result => {
          this.questId = result?.id;
          this.questPrice = result?.price;

          //get top one of quest id
          this.load.rexAwait(function (successCallback, failureCallback) {
            getLeaderBoard(this.questId).then(result => {
              console.log("Top one: ", result);
              if (result != undefined) {
                let user_index = result.find(element => element = this.characterData.userId)
                console.log("current user ", result.indexOf(user_index))
              }
              this.topone = result;
              successCallback();
            });
          }, this);

          if (result != undefined) {
            this.load.rexAwait(function (successCallback, failureCallback) {
              getAllScenes(this.questId).then(result => {
                this.listScene = result;
                console.log(result);
                successCallback();
              });
            }, this);
          }
          successCallback();
        });
      }, this);
    } else {
      //get quest default admin
      this.load.rexAwait(function (successCallback, failureCallback) {

        getAdminQuest().then(result => {
          this.questId = result?.id;
        
          //get top one of quest id

          this.load.rexAwait(function (successCallback, failureCallback) {
            getLeaderBoard(this.questId).then(result => {
              this.textLeaderboard = 'Be the best player to get rewards'
              this.visibleLeaderBoard = true
              this.topone = result;
              successCallback();
            }).catch( error =>{
              this.topone = undefined
              this.visibleLeaderBoard = false
              this.textLeaderboard = 'This quest is not available now'
              successCallback();
            });
          }, this);

          this.questPrice = result?.price;
          console.log("quest price: ", result?.price);
          console.log("result: ", result);
          if (result != undefined) {
            this.load.rexAwait(function (successCallback, failureCallback) {
              getAllScenes(this.questId).then(result => {
                this.listScene = result;
                console.log(result);
                successCallback();
              });
            }, this);
          }
          successCallback();
        })
      }, this)
    }

    //preload
    this.clearCache();
    this.load.image("bg", bg);
    this.load.image("text", text);
    this.load.image("jungleLocationDetail", jungleLocationDetail);
    this.load.image("cataloniaLocationDetail", cataloniaLocationDetail);
    this.load.image("lavaLocationDetail", lavaLocationDetail);
    this.load.image("lakeLocationDetail", lakeLocationDetail);
    this.load.image("engineLocationDetail", engineLocationDetail); //enigne
    this.load.spritesheet("selectArea", selectArea, { frameWidth: 498, frameHeight: 800 });
    this.load.image("btnBack", btnBack);
    this.load.spritesheet("popupWindow", popupWindow, { frameWidth: 980, frameHeight: 799 });
    this.load.image("popupClose", popupClose);
    this.load.image("popupAccept", popupAccept);
    this.load.image("itemnotice", itemnotice);

    //engine
    this.load.spritesheet("popupWindowEngine", popupWindowEngine, {
      frameWidth: 980,
      frameHeight: 799
    });
    this.load.image("popupCloseEngine", popupCloseEngine);
    this.load.image("popupAcceptEngine", popupAcceptEngine);

    //leader board
    this.load.spritesheet("popupWindowLeaderBoard", popupWindowLeaderBoard, {
      frameWidth: 980,
      frameHeight: 799
    });
    this.load.image("popupCloseLeaderBoard", popupCloseLeaderBoard);
    this.load.image("popupAcceptLeaderBoard", popupAcceptLeaderBoard);

    //Icoin winner
    this.load.image("icoinWinner", icoinWinner);
    this.load.image("icoinGold", icoinGold);
    this.load.image("icoinSilver", icoinSilver);
    this.load.image("icoinBronze", icoinBronze);
  }

  async create() {
    let truncatedId = ""
    let completedAtTop1 = ""
    let hpTop1 = ""
    console.log("this.topone: ", this.topone)
    if (this?.topone != undefined) {
      const id = this?.topone[0]?.id;
      truncatedId = id ? `${id.substring(0, 3)}...${id.substring(29)}` : '';
      const nanoseconds = Number(this.topone[0]?.timestamp);
      const milliseconds = nanoseconds / 1000000;
      const date = new Date(milliseconds);
      const dateString = date.toLocaleDateString();
      const timeString = date.toLocaleTimeString();
      completedAtTop1 = `${dateString}, ${timeString}`;
      hpTop1 = this.topone[0]?.hp
    }

    // add audios
    this.hoverSound = this.sound.add("hoverSound");
    this.clickSound = this.sound.add("clickSound");

    this.background = this.add.image(0, 0, "bg").setOrigin(0);
    this.jungleLocationDetail = this.add
      .image(247, 167, "jungleLocationDetail")
      .setVisible(false)
      .setInteractive();
    this.cataloniaLocationDetail = this.add
      .image(247, 167, "cataloniaLocationDetail")
      .setVisible(false)
      .setInteractive();
    this.lavaLocationDetail = this.add
      .image(247, 167, "lavaLocationDetail")
      .setVisible(false)
      .setInteractive();
    this.lakeLocationDetail = this.add
      .image(247, 167, "lakeLocationDetail")
      .setVisible(false)
      .setInteractive();
    this.engineLocationDetail = this.add
      .image(247, 167, "engineLocationDetail")
      .setVisible(false)
      .setInteractive();
    this.btnBack = this.add.image(40, 25, "btnBack").setOrigin(0).setInteractive();
    this.btnBack.on("pointerdown", () => {
      this.clickSound.play();
      history.push("/metaverse");
    });

    this.currentICP = Number(this.userInfo.balance);
    this.requiredICP = 20000;
    this.waitingTime = 60;
    this.getRemainingTime = await getRemainingTime(this.waitingTime, this.characterData);

    this.selectAreaJungle = this.add.sprite(627, 467, "selectArea").setScale(0.18).setInteractive();
    this.selectAreaJungle.on("pointerover", () => {
      this.selectAreaJungle.setFrame(1);
      this.jungleLocationDetail.setVisible(true);
      this.hoverSound.play();
    });
    this.selectAreaJungle.on("pointerout", () => {
      this.selectAreaJungle.setFrame(0);
      this.jungleLocationDetail.setVisible(false);
    });
    this.selectAreaJungle.on("pointerdown", async () => {
      this.clickSound.play();
      this.premiumPopupWindow.setVisible(true);
      this.premiumPopupCloseBtn.setVisible(true);
      if (this.currentICP >= this.requiredICP) {
        this.premiumPopupAcceptBtn.setVisible(true);
      }
      this.selectAreaJungle.disableInteractive();
      this.selectAreaCatalonia.disableInteractive();
    });

    this.selectAreaCatalonia = this.add
      .sprite(620, 337, "selectArea")
      .setScale(0.18)
      .setInteractive();
    this.selectAreaCatalonia.on("pointerover", () => {
      this.selectAreaCatalonia.setFrame(1);
      this.cataloniaLocationDetail.setVisible(true);
      this.hoverSound.play();
    });
    this.selectAreaCatalonia.on("pointerout", () => {
      this.selectAreaCatalonia.setFrame(0);
      this.cataloniaLocationDetail.setVisible(false);
    });
    this.selectAreaCatalonia.on("pointerdown", () => {
      this.clickSound.play();
      if (this.getRemainingTime != 0) this.scene.start("exhausted");
      else {
        resetCharacter();
        this.scene.start("selectItemScene", { map: "catalonia1" });
      }
    });

    this.selectAreaLava = this.add.sprite(1030, 250, "selectArea").setScale(0.18).setInteractive();
    this.selectAreaLava.on("pointerover", () => {
      this.selectAreaLava.setFrame(1);
      this.lavaLocationDetail.setVisible(true);
      this.hoverSound.play();
    });
    this.selectAreaLava.on("pointerout", () => {
      this.selectAreaLava.setFrame(0);
      this.lavaLocationDetail.setVisible(false);
    });
    this.selectAreaLava.on("pointerdown", () => {
      this.clickSound.play();
      if (this.getRemainingTime != 0) this.scene.start("exhausted");
      else {
        resetCharacter();
        this.scene.start("selectItemScene", { map: "lava" });
      }
    });

    this.selectAreaLake = this.add.sprite(762, 408, "selectArea").setScale(0.18).setInteractive();
    this.selectAreaLake.on("pointerover", () => {
      this.selectAreaLake.setFrame(1);
      this.lakeLocationDetail.setVisible(true);
      this.hoverSound.play();
    });
    this.selectAreaLake.on("pointerout", () => {
      this.selectAreaLake.setFrame(0);
      this.lakeLocationDetail.setVisible(false);
    });
    this.selectAreaLake.on("pointerdown", () => {
      this.clickSound.play();
      if (this.getRemainingTime != 0) this.scene.start("exhausted");
      else {
        resetCharacter();
        this.scene.start("selectItemScene", { map: "lake" });
      }
    });

    //Engine
    this.visible = false;
    this.visibleEnginePopup = false;
    this.selectAreaEngine = this.add.sprite(420, 393, "selectArea").setScale(0.18).setInteractive();
    this.selectAreaEngine.on("pointerover", () => {
      this.selectAreaEngine.setFrame(1);
      this.engineLocationDetail.setVisible(true);
      this.hoverSound.play();
    });
    this.selectAreaEngine.on("pointerout", () => {
      this.selectAreaEngine.setFrame(0);
      this.engineLocationDetail.setVisible(false);
    });
    this.selectAreaEngine.on("pointerdown", async () => {
      this.clickSound.play();
      this.visible = true;
      this.selectAreaEngine.disableInteractive();
      this.selectAreaCatalonia.disableInteractive();
      this.selectAreaEngine.disableInteractive();
    });

    this.premiumPopupWindowEngine = this.add
      .sprite(gameConfig.scale.width / 2, gameConfig.scale.height / 2, "popupWindowEngine")
      .setScale(0.5)
      .setVisible(this.visibleEnginePopup);
    this.premiumPopupCloseBtnEngine = this.add
      .image(
        gameConfig.scale.width / 2 + 230,
        gameConfig.scale.height / 2 - 150,
        "popupCloseEngine"
      )
      .setInteractive()
      .setScale(0.25)
      .setVisible(this.visibleEnginePopup);
    this.premiumPopupAcceptBtnEngine = this.add
      .image(gameConfig.scale.width / 2, gameConfig.scale.height / 2 + 115, "popupAcceptEngine")
      .setInteractive()
      .setScale(0.5)
      .setVisible(this.visibleEnginePopup);

    //LeaderBoard popup
    var style = { font: "13px Arial", fill: "#000000", align: "center" };
    var move_x = 350;
    var move_y = 150;
    var col0 = 100;
    var col1 = 150;
    var col2 = 275;
    var col3 = 350;
    var row1 = 125;
    var row2 = 175;
    var row3 = 225;
    var row4 = 275;
    var row5 = 300;
    var row6 = 325;

    const numUser = 0;
    // const heightLB = 0.6; //when have greate than 4 user
    // const heightLB = 0.1;
    if (numUser == 0) {
      var heightLB = 0.5;
    } else if (numUser == 4) {
      var heightLB = 0.6;
    }

    this.premiumPopupWindowLeaderBoard = this.add
      .sprite(gameConfig.scale.width / 1.5 + 40, gameConfig.scale.height / 4 - 30, "popupWindowLeaderBoard")
      .setScale(0.5, heightLB)
      .setVisible(this.visible)
      .setOrigin(1, 0)


    this.popupCloseLeaderBoard = this.add
      .image(
        gameConfig.scale.width / 2 + 230,
        gameConfig.scale.height / 2 - 150,
        "popupCloseEngine"
      )
      .setInteractive()
      .setScale(0.25)
      .setVisible(this.visibleEnginePopup);
    this.popupCloseLeaderBoard.on("pointerdown", () => {
      this.clickSound.play();
      this.visible = false;
      this.selectAreaJungle.setInteractive();
      this.selectAreaCatalonia.setInteractive();
      this.selectAreaEngine.setInteractive();
    });


    console.log(this.visibleLeaderBoard)
    this.popupAcceptLeaderBoard = this.add
      .image(
        gameConfig.scale.width / 2,
        // gameConfig.scale.height / 2 + 205,
        row5 + move_y + 30,
        "popupAcceptLeaderBoard"
      )
      .setInteractive()
      .setScale(0.25)
      .setVisible(this.visibleLeaderBoard);
    this.popupAcceptLeaderBoard.on("pointerdown", async () => {
      this.clickSound.play();
      this.visible = false;
      this.visibleEnginePopup = true;
      this.premiumPopupWindowEngine.setVisible(this.visibleEnginePopup);
      this.premiumPopupCloseBtnEngine.setVisible(this.visibleEnginePopup);
      if (this.currentICP >= this.price * 100_000_000) {
        console.log("this curent ICP: ", this.currentICP);
        this.desPopup.setVisible(this.visibleEnginePopup);
        this.premiumPopupAcceptBtnEngine.setVisible(this.visibleEnginePopup);
      } else {
        this.desPopupFailure.setVisible(this.visibleEnginePopup);
      }
      this.selectAreaJungle.setInteractive();
      this.selectAreaCatalonia.setInteractive();
      this.selectAreaEngine.setInteractive();
    });

    this.desPopupLeaderBoard = this.make
      .text({
        x: gameConfig.scale.width / 2,
        y: gameConfig.scale.height / 2 - 120,
        text: `Leaderboard`,
        origin: { x: 0.5, y: 0.5 },
        style: {
          font: "bold 30px Arial",
          fill: "gray",
          wordWrap: { width: 400 },
          lineSpacing: 10
        }
      })
      .setVisible(this.visible);

    this.text0 = this.add.text(col0 + move_x, row1 + move_y, "#", style).setVisible(this.visible);
    this.text1 = this.add
      .text(col1 + move_x, row1 + move_y, "Name", style)
      .setVisible(this.visible);
    this.text2 = this.add.text(col2 + move_x, row1 + move_y, "HP", style).setVisible(this.visible);
    this.text3 = this.add
      .text(col3 + move_x, row1 + move_y, "Completed At (GMT +7)", style)
      .setVisible(this.visible);

    this.text4 = this.add
      .text(col1 + move_x, row2 + move_y, truncatedId, style)
      .setVisible(this.visible);
    this.text5 = this.add.text(col2 + move_x, row2 + move_y, hpTop1, style).setVisible(this.visible);
    this.text6 = this.add
      .text(col3 + move_x, row2 + move_y, completedAtTop1, style)
      .setVisible(this.visible);

    this.text7 = this.add
      .text(col1 + move_x, row3 + move_y, "Beck", style)
      .setVisible(this.visible);
    this.text8 = this.add.text(col2 + move_x, row3 + move_y, "2", style).setVisible(this.visible);
    this.text9 = this.add
      .text(col3 + move_x, row3 + move_y, "2/12/2023, 8:02:15 AM", style)
      .setVisible(this.visible);

    this.text10 = this.add
      .text(col1 + move_x, row4 + move_y, "Carla", style)
      .setVisible(this.visible);
    this.text11 = this.add.text(col2 + move_x, row4 + move_y, "1", style).setVisible(this.visible);
    this.text12 = this.add
      .text(col3 + move_x, row4 + move_y, "2/12/2023, 3:30:23 PM", style)
      .setVisible(this.visible);

    this.text13 = this.add.text(col1 + move_x, row5 + move_y, ". . .", style).setVisible(this.visible);
    this.text14 = this.add.text(col2 + move_x, row5 + move_y, ". . .", style).setVisible(this.visible);
    this.text15 = this.add
      .text(col3 + move_x, row5 + move_y, ". . .", style)
      .setVisible(this.visible);

    this.text19 = this.add.text(col0 + move_x, row6 + move_y, "5", style).setVisible(this.visible);
    this.text16 = this.add.text(col1 + move_x, row6 + move_y, "You", style).setVisible(this.visible);
    this.text17 = this.add.text(col2 + move_x, row6 + move_y, "1", style).setVisible(this.visible);
    this.text18 = this.add
      .text(col3 + move_x, row6 + move_y, "2/14/2023, 3:26:26 PM", style)
      .setVisible(this.visible);

    
    this.firstPlayer = this.make
      .text({
        x: gameConfig.scale.width / 2,
        y: row4 + move_y,
        text: this.textLeaderboard,
        origin: { x: 0.5, y: 0.5 },
        style: {
          font: "13px Arial",
          fill: "black",
          wordWrap: { width: 400 },
          lineSpacing: 10
        }
      })
      .setVisible(this.visible);

    //add icoin
    this.icoinWinner = this.add
      .image(470, 220, "icoinWinner")
      .setScale(0.3)
      .setVisible(this.visible);
    this.icoinGold = this.add
      .image(col0 + move_x, row2 + move_y + 10, "icoinGold")
      .setScale(0.3)
      .setVisible(this.visible);
    this.icoinSilver = this.add
      .image(col0 + move_x, row3 + move_y + 10, "icoinSilver")
      .setScale(0.3)
      .setVisible(this.visible);
    this.icoinBronze = this.add
      .image(col0 + move_x, row4 + move_y + 10, "icoinBronze")
      .setScale(0.3)
      .setVisible(this.visible);

    this.premiumPopupCloseBtnEngine.on("pointerdown", () => {
      this.clickSound.play();
      // this.premiumPopupWindowEngine.setVisible(false);
      // this.premiumPopupCloseBtnEngine.setVisible(false);
      // this.premiumPopupAcceptBtnEngine.setVisible(false);
      this.visibleEnginePopup = false;
      this.desPopup.setVisible(false);
      this.desPopupFailure.setVisible(false);
      this.selectAreaJungle.setInteractive();
      this.selectAreaCatalonia.setInteractive();
      this.selectAreaEngine.setInteractive();
    });
    this.premiumPopupAcceptBtnEngine.on("pointerdown", async () => {
      this.clickSound.play();
      if (this.getRemainingTime != 0) this.scene.start("exhausted");
      else {
        resetCharacter();
        const urlParams = new URLSearchParams(window.location.search);
        const myParam = urlParams.get("questId");
        this.scene.start("selectItemScene", { map: "quest-design", questId: myParam });
        let pay = await payQuestEngine(this.questId);
        if (pay == "Success") {
          let saveReward = await saveGameReward(this.questId);
          console.log("saveReward: ", saveReward);
          console.log("pay Quest: ", pay);
        }
      }
    });

    //Des
    this.price = Number(this.questPrice) * 0.00000001 + 0.0001;
    this.desPopup = this.make
      .text({
        x: gameConfig.scale.width / 2,
        y: gameConfig.scale.height / 2 - 10,
        text: `THIS QUEST REQUIRES ${Math.floor(this.price * 10000) / 10000
          } $ICP TO PLAY.\nDO YOU AGREE?`,
        origin: { x: 0.5, y: 0.5 },
        style: {
          font: "bold 30px Arial",
          fill: "gray",
          wordWrap: { width: 400 },
          lineSpacing: 10
        }
      })
      .setVisible(false);

    this.desPopupFailure = this.make
      .text({
        x: gameConfig.scale.width / 2,
        y: gameConfig.scale.height / 2 - 10,
        text: `YOU DON'T HAVE ENOUGH ${this.price} $ICP TO PLAY THIS QUEST.`,
        origin: { x: 0.5, y: 0.5 },
        style: {
          font: "bold 30px Arial",
          fill: "gray",
          wordWrap: { width: 400 },
          lineSpacing: 10
        }
      })
      .setVisible(false);

    //jungle popup
    this.premiumPopupWindow = this.add
      .sprite(gameConfig.scale.width / 2, gameConfig.scale.height / 2, "popupWindow")
      .setScale(0.5)
      .setVisible(false);
    if (this.currentICP < this.requiredICP) {
      this.premiumPopupWindow.setFrame(1);
    }
    this.premiumPopupCloseBtn = this.add
      .image(gameConfig.scale.width / 2 + 230, gameConfig.scale.height / 2 - 150, "popupClose")
      .setInteractive()
      .setScale(0.25)
      .setVisible(false);
    this.premiumPopupAcceptBtn = this.add
      .image(gameConfig.scale.width / 2, gameConfig.scale.height / 2 + 115, "popupAccept")
      .setInteractive()
      .setScale(0.5)
      .setVisible(false);

    this.premiumPopupCloseBtn.on("pointerdown", () => {
      this.clickSound.play();
      this.premiumPopupWindow.setVisible(false);
      this.premiumPopupCloseBtn.setVisible(false);
      this.premiumPopupAcceptBtn.setVisible(false);
      this.selectAreaJungle.setInteractive();
      this.selectAreaCatalonia.setInteractive();
    });
    this.premiumPopupAcceptBtn.on("pointerdown", async () => {
      this.clickSound.play();
      if (this.getRemainingTime != 0) this.scene.start("exhausted");
      else {
        resetCharacter();
        this.scene.start("selectItemScene", { map: "jungle" });
        // pay for jungle quest
        await payQuest("jungle");
      }
    });
  }

  update() {
    if (this.visible === true) {
      this.text0.setVisible(true);
      this.text1.setVisible(true);
      this.text2.setVisible(true);
      this.text3.setVisible(true);
      this.text4.setVisible(true);
      this.text5.setVisible(true);
      this.text6.setVisible(true);
      // this.text7.setVisible(true);
      // this.text8.setVisible(true);
      // this.text9.setVisible(true);
      // this.text10.setVisible(true);
      // this.text11.setVisible(true);
      // this.text12.setVisible(true);
      // this.text13.setVisible(true);
      // this.text14.setVisible(true);
      // this.text15.setVisible(true);
      // this.text16.setVisible(true);
      // this.text17.setVisible(true);
      // this.text18.setVisible(true);
      // this.text19.setVisible(true);
      this.firstPlayer.setVisible(true);
      this.premiumPopupWindowLeaderBoard.setVisible(true);
      this.desPopupLeaderBoard.setVisible(true);
      this.popupCloseLeaderBoard.setVisible(true);
      if(this.visibleLeaderBoard){
        this.popupAcceptLeaderBoard.setVisible(true);
      }
      this.icoinWinner.setVisible(true);
      this.icoinGold.setVisible(true);
      // this.icoinSilver.setVisible(true);
      // this.icoinBronze.setVisible(true);
    }
    if (this.visible === false) {
      this.text0.setVisible(false);
      this.text1.setVisible(false);
      this.text2.setVisible(false);
      this.text3.setVisible(false);
      this.text4.setVisible(false);
      this.text5.setVisible(false);
      this.text6.setVisible(false);
      // this.text7.setVisible(false);
      // this.text8.setVisible(false);
      // this.text9.setVisible(false);
      // this.text10.setVisible(false);
      // this.text11.setVisible(false);
      // this.text12.setVisible(false);
      // this.text13.setVisible(false);
      // this.text14.setVisible(false);
      // this.text15.setVisible(false);
      // this.text16.setVisible(false);
      // this.text17.setVisible(false);
      // this.text18.setVisible(false);
      // this.text19.setVisible(false);
      this.firstPlayer.setVisible(false);
      this.premiumPopupWindowLeaderBoard.setVisible(false);
      this.desPopupLeaderBoard.setVisible(false);
      this.popupCloseLeaderBoard.setVisible(false);
      this.popupAcceptLeaderBoard.setVisible(false);
      this.icoinWinner.setVisible(false);
      this.icoinGold.setVisible(false);
      // this.icoinSilver.setVisible(false);
      // this.icoinBronze.setVisible(false);
    }
    if (this.visibleEnginePopup === true) {
      this.premiumPopupWindowEngine.setVisible(true);
      this.premiumPopupCloseBtnEngine.setVisible(true);
      this.premiumPopupAcceptBtnEngine.setVisible(true);
    }
    if (this.visibleEnginePopup === false) {
      this.premiumPopupWindowEngine.setVisible(false);
      this.premiumPopupCloseBtnEngine.setVisible(false);
      this.premiumPopupAcceptBtnEngine.setVisible(false);
    }
  }
}
export default selectMap;
