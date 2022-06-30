import Phaser from 'phaser';
const bg = 'metaverse/loading/selectTrip.png';
const selectArea = 'metaverse/loading/selectarea.png';

class greetingScene extends Phaser.Scene {
    constructor() {
        super('greetingScene');
    }

    preload() {
        this.load.image('bg', bg);
        this.load.image('selectArea', selectArea);
    }
    
    create() {
        this.background = this.add.image(0, 0, 'bg').setOrigin(0);
        this.selectArea = this.add.image(850, 750, 'selectArea')
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.transition({target: 'selectItemScene', duration: 0 });
            });
    }

}
export default greetingScene;