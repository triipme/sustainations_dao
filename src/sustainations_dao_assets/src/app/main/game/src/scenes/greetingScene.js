import Phaser from 'phaser';

import bg from '../assets/loading/loading3.png';
import btn from '../assets/loading/gamestart.png';


class greetingScene extends Phaser.Scene {
    constructor() {
        super('greetingScene');
    }

    // onObjectClicked() {
    //     this.scene.start('Scene1');
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
        //     self.scene.start('Scene1');
        // }, this);
        // this.input.on('pointerdown', () => this.scene.start('Scene1'));
        this.input.on('pointerdown', () => this.scene.transition({target: 'selectItemScene', duration: 0 }));

    }

}

export default greetingScene;