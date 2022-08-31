import Phaser from "phaser";
import gameConfig from '../GameConfig';

const logo = 'images/logo/sustainations-logo.png';
const loading = 'metaverse/loading/loadingSprite.png';

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

class preloadScene extends Phaser.Scene {
  constructor() {
    super("preloadScene");
  }

  preload() {
    // assets global uses across scenes
    this.load.image('logo', logo);
    this.load.spritesheet("loading", loading, {
      frameWidth: 630,
      frameHeight: 637
    });
    // load audio 1 time
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
  }

  create() {
    this.scene.start('selectMap');
  }
}
export default preloadScene;
