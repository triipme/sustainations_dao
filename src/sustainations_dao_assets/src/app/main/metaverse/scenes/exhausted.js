import Phaser from 'phaser';
import gameConfig from '../GameConfig';
import BaseScene from './BaseScene'
const exhausted_text = 'metaverse/exhausted.png';
const btnBlank = 'metaverse/scenes/selection.png';
const BtnExit = 'metaverse/scenes/UI_exit.png';
const playagain_text = 'metaverse/playagain.png';
const ground = 'metaverse/transparent-ground.png';
const exhaustedSprite = 'metaverse/character_sprite_exhausted.png';

import { 
  loadCharacter,
  getRemainingTime,
  resetCharacterCollectsMaterials
} from '../GameApi';

class exhausted extends BaseScene {
  constructor() {
    super('exhausted');
  }

  clearSceneCache(){
    this.textures.remove('background1');
    this.textures.remove('background2');
    this.textures.remove('background3');
    this.textures.remove('selectAction');
    this.textures.remove('utility');
    this.textures.remove('btnBlank');
    this.textures.remove('obstacle');
  }

  preload() {
    this.load.rexAwait(function(successCallback, failureCallback) {
      loadCharacter().then( (result) => {
        this.characterData = result.ok[1];
        console.log(this.characterData);
        successCallback();
      });
    }, this);

    this.clearSceneCache();
    this.load.image("ground", ground);
    this.load.image('exhausted_text', exhausted_text);
    this.load.spritesheet('btnBlank', btnBlank, { frameWidth: 1102, frameHeight: 88});
    this.load.image('BtnExit', BtnExit);
    this.load.image('playagain_text', playagain_text);
    this.load.spritesheet("exhaustedSprite", exhaustedSprite, {
      frameWidth: 197,
      frameHeight: 337
    });
  }
  
  async create() {
    // reset character collect materials
    resetCharacterCollectsMaterials(this.characterData.id);
    // platforms
    const platforms = this.physics.add.staticGroup();
    for (let x = -50; x < gameConfig.scale.width; x += 4) {
      platforms.create(x, 635, "ground").refreshBody();
    }
    //player
    this.player = this.physics.add.sprite(467, 520, "exhaustedSprite").setScale(0.67);
    this.player.setCollideWorldBounds(false);
    this.physics.add.collider(this.player, platforms);

    this.anims.create({
      key: "exhausted-anims",
      frames: this.anims.generateFrameNumbers("exhaustedSprite"),
      frameRate: 8,
      repeat: 0
    });
    this.player.play('exhausted-anims');

    this.clickSound = this.sound.add('clickSound');
    this.hoverSound = this.sound.add('hoverSound');
    this.exhausted_text = this.add.image(gameConfig.scale.width/2, gameConfig.scale.height/4, 'exhausted_text').setScale(0.67);
    this.add.image(1185, 50, "BtnExit").setOrigin(0).setScrollFactor(0).setScale(0.7)
      .setInteractive()
      .on('pointerdown', () => {
        this.clickSound.play();
        this.scene.start('selectMap');
      });
    this.playagain = this.add.sprite(gameConfig.scale.width/2, gameConfig.scale.height/2, 'btnBlank').setScale(0.67);
    this.playagain.setInteractive().setScrollFactor(0);
    this.playagain.on('pointerover', () => {
      this.playagain.setFrame(1);
      this.hoverSound.play();
    });
    this.playagain.on('pointerout', () => {
      this.playagain.setFrame(0);
    });
    this.playagain.on('pointerdown', () => {
      this.clickSound.play();
      this.scene.start('selectMap');
    });
    this.playagain_text = this.add.image(gameConfig.scale.width/2, gameConfig.scale.height/2, 'playagain_text').setScale(0.3);
    this.waitingTime = 60;
    this.getRemainingTime = await getRemainingTime(this.waitingTime, this.characterData);

    this.add.text(gameConfig.scale.width/2, 260, "Please wait: " + this.getRemainingTime + 's', { align: 'center', fontSize: '25px', fontStyle: 'Italic' })
      .setOrigin(0.5);
  }

  update() {
    //new player logic
    if (this.player.body.touching.down && this.player.x < gameConfig.scale.width/2) {
      this.player.setVelocityX(135);
    } else {
      this.player.setVelocityX(0);
    }
  }

}
export default exhausted;