import Phaser from 'phaser';
import gameConfig from '../GameConfig';
const exhausted_text = 'metaverse/exhausted.png';
const btnBlank = 'metaverse/scenes/selection.png';
const BtnExit = 'metaverse/scenes/UI_exit.png';
const playagain_text = 'metaverse/playagain.png';
const ground = 'metaverse/transparent-ground.png';
const exhaustedSprite = 'metaverse/character_sprite_exhausted.png';


class exhausted extends Phaser.Scene {
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
    this.load.image("ground", ground);
    this.clearSceneCache();
    this.load.image('exhausted_text', exhausted_text);
    this.load.spritesheet('btnBlank', btnBlank, { frameWidth: 1102, frameHeight: 88});
    this.load.image('BtnExit', BtnExit);
    this.load.image('playagain_text', playagain_text);
    this.load.spritesheet("exhaustedSprite", exhaustedSprite, {
      frameWidth: 197,
      frameHeight: 337
    });
  }
  
  create() {
    // platforms
    const platforms = this.physics.add.staticGroup();
    for (let x = -100; x < 1920*4; x += 1) {
      platforms.create(x, 950, "ground").refreshBody();
    }
    //player
    this.player = this.physics.add.sprite(700, 780, "exhaustedSprite");
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
    this.exhausted_text = this.add.image(gameConfig.scale.width/2, gameConfig.scale.height/4, 'exhausted_text');
    this.add.image(1780, 74, "BtnExit").setOrigin(0).setScrollFactor(0).setScale(0.7)
      .setInteractive()
      .on('pointerdown', () => {
        this.clickSound.play();
        this.scene.start('menuScene');
      });
    this.playagain = this.add.sprite(gameConfig.scale.width/2, gameConfig.scale.height/2, 'btnBlank');
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
  }

  update() {
    //new player logic
    if (this.player.body.touching.down && this.player.x < 1920/2) {
      this.player.setVelocityX(200);
    } else {
      this.player.setVelocityX(0);
    }
  }

}
export default exhausted;