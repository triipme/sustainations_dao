import Phaser from 'phaser';

const bg = 'metaverse/loading/loading3.png';
const btn = 'metaverse/loading/gamestart.png';

class ReadyScene extends Phaser.Scene {
  constructor() {
    super('ReadyScene');
  }

  // onObjectClicked() {
  //     this.scene.start('JungleScene');
  //     console.log('clicked');
  // }

  preload() {
    this.load.image('bg', bg);
    this.load.image('btn', btn);
  }

  create() {
    this.background = this.add.image(0, 0, 'bg').setOrigin(0);
    this.startButton = this.add.image(960, 540, 'btn');
    // this.startButton.setInteractive();
    // this.startButton.on('gameobjectdown', function () {
    //     self.scene.start('JungleScene');
    // }, this);
    // this.input.on('pointerdown', () => this.scene.start('JungleScene'));
    this.input.on('pointerdown', () => this.scene.transition({target: 'JungleScene', duration: 500 }));
  }
};

export default ReadyScene;