import Phaser from "phaser";
import { createDefautCharacter } from "../GameApi";
import BaseScene from './BaseScene';
const logo = 'images/logo/sustainations-logo.png';
const loading = 'metaverse/loading/loadingSprite.png';
const bg = "metaverse/menu/background.png";
const welcomeText = "metaverse/menu/welcome.png";
const introduction_btn = "metaverse/menu/introduction.png";
const bootcamp_btn = "metaverse/menu/bootcamp.png";
const departure_btn = "metaverse/menu/departure.png";
const land_btn = "metaverse/menu/land.png";
const quest_btn = "metaverse/menu/quest.png";
const cs_noti = "metaverse/menu/commingsoon.png";
//audio
const hoverSound = "metaverse/audio/Hover_sound.mp3";
const clickSound = "metaverse/audio/Click_sound.mp3";
const ambientSound = "metaverse/audio/Ambient_sound.mp3";
const ingameSound = 'metaverse/audio/In_game.mp3';
const pregameSound = 'metaverse/audio/Pre_game.mp3';
const sfx_big_waterfall = 'metaverse/audio/SFX_bg_big_waterfall.mp3';
const sfx_monkey = 'metaverse/audio/SFX_bg_monkey.mp3';
const sfx_night = 'metaverse/audio/SFX_bg_night.mp3';
const sfx_small_waterfall = 'metaverse/audio/SFX_bg_small_waterfall.mp3';
const sfx_char_footstep = 'metaverse/audio/SFX_char_footstep.mp3';
const sfx_obstacle_remove = 'metaverse/audio/SFX_obstacle_remove.mp3';

class menuScene extends BaseScene {
  constructor() {
    super("menuScene");
  }
  clearCache() {
    const textures_list = ["bg"];
    for (const index in textures_list){
      this.textures.remove(textures_list[index]);
    }
    console.clear();
  }

  preload() {
    // assets global uses across scenes
    this.load.image('logo', logo);
    this.load.spritesheet("loading", loading, {
      frameWidth: 630,
      frameHeight: 637
    });
    //load audio 1 time
    this.load.audio('hoverSound', hoverSound);
    this.load.audio('clickSound', clickSound);
    this.load.audio('ambientSound', ambientSound);
    this.load.audio('ingameSound', ingameSound);
    this.load.audio('pregameSound', pregameSound);
    this.load.audio('sfx_big_waterfall', sfx_big_waterfall);
    this.load.audio('sfx_monkey', sfx_monkey);
    this.load.audio('sfx_night', sfx_night);
    this.load.audio('sfx_small_waterfall', sfx_small_waterfall);
    this.load.audio('sfx_char_footstep', sfx_char_footstep);
    this.load.audio('sfx_obstacle_remove', sfx_obstacle_remove);

    // preload
    this.load.image("bg", bg);
    this.load.image("welcomeText", welcomeText);
    this.load.image("cs_noti", cs_noti);
    this.load.spritesheet("introduction_btn", introduction_btn, {
      frameWidth: 693, frameHeight: 163
    });
    this.load.spritesheet("bootcamp_btn", bootcamp_btn, {
      frameWidth: 693, frameHeight: 163
    });
    this.load.spritesheet("departure_btn", departure_btn, {
      frameWidth: 693, frameHeight: 163
    });
    this.load.spritesheet("land_btn", land_btn, {
      frameWidth: 689, frameHeight: 166
    });
    this.load.spritesheet("quest_btn", quest_btn, {
      frameWidth: 693, frameHeight: 163
    });
  }

  async create() {
    await createDefautCharacter();
    //add audios
    this.hoverSound = this.sound.add('hoverSound');
    this.clickSound = this.sound.add('clickSound');

    this.background = this.add.image(0, 0, "bg").setOrigin(0);
    this.welcomeText = this.add.image(960, 210, "welcomeText");
    this.noti = this.add.image(100, 100, "cs_noti")
      .setOrigin(0).setVisible(false).setScale(0.7);

    //btn
    this.introduction_btn = this.add.sprite(960, 350, "introduction_btn")
      .setInteractive();
    this.introduction_btn.on("pointerover", () => {
      this.introduction_btn.setFrame(1);
      this.hoverSound.play();
    });
    this.introduction_btn.on("pointerout", () => {
      this.introduction_btn.setFrame(0);
    });
    this.introduction_btn.on("pointerdown", () => {
      this.clickSound.play();
      window.open("https://www.youtube.com/watch?v=ZgwDobu5OcY", "_blank");
    });

    this.quest_btn = this.add.sprite(960, 470, "quest_btn")
      .setInteractive();
    this.quest_btn.on("pointerover", () => {
      this.quest_btn.setFrame(1);
      this.hoverSound.play();
    });
    this.quest_btn.on("pointerout", () => {
      this.quest_btn.setFrame(0);
    });
    this.quest_btn.on("pointerdown", () => {
      this.clickSound.play();
      this.scene.transition({ target: "selectMap", duration: 0 });
    });

    this.bootcamp_btn = this.add.sprite(960, 590, "bootcamp_btn")
      .setInteractive();
    this.bootcamp_btn.on("pointerover", () => {
      this.bootcamp_btn.setFrame(1);
      this.hoverSound.play();
    });
    this.bootcamp_btn.on("pointerout", () => {
      this.bootcamp_btn.setFrame(0);
    });
    this.bootcamp_btn.on("pointerdown", () => {
      this.clickSound.play();
      this.noti.setVisible(true);
      this.time.addEvent({
        delay: 3000,
        callback: () => {
          this.noti.setVisible(false);
        },
        callbackScope: this
      });
    });

    this.land_btn = this.add.sprite(960, 710, "land_btn")
      .setInteractive();
    this.land_btn.on("pointerover", () => {
      this.land_btn.setFrame(1);
      this.hoverSound.play();
    });
    this.land_btn.on("pointerout", () => {
      this.land_btn.setFrame(0);
    });
    this.land_btn.on("pointerdown", () => {
      this.clickSound.play();
      window.location.href = "/metaverse/land";
    });

    this.departure_btn = this.add.sprite(960, 830, "departure_btn")
      .setInteractive();
    this.departure_btn.on("pointerover", () => {
      this.departure_btn.setFrame(1);
      this.hoverSound.play();
    });
    this.departure_btn.on("pointerout", () => {
      this.departure_btn.setFrame(0);
    });
    this.departure_btn.on("pointerdown", () => {
      this.clickSound.play();
      window.location.href = "/";
    });
  }
}
export default menuScene;
