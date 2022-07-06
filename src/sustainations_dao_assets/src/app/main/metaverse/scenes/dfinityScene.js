import Phaser from 'phaser';
const bg1 = 'metaverse/loading/loading1.png';
const bg2 = 'metaverse/loading/loading2.png';

class dfinityScene extends Phaser.Scene {
    constructor() {
        super('dfinityScene');
    }


    preload() {
        this.load.image('bg1', bg1);
        this.load.image('bg2', bg2);
    }
    
    create() {
        this.add.image(0, 0, 'bg1').setOrigin(0,0);
        this.time.addEvent({ delay: 4000, callback: () => {this.add.image(0, 0, 'bg2').setOrigin(0,0);}, callbackScope: this });
        this.time.addEvent({ delay: 8000, callback: () => {this.scene.transition({target: 'greetingScene', duration: 0 })}, callbackScope: this });
    }

}
export default dfinityScene;