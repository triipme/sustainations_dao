import Phaser from 'phaser';
const bg = 'metaverse/UI_finish.png';

class thanks extends Phaser.Scene {
    constructor() {
        super('thanks');
    }

    clearSceneCache(){
        this.textures.remove('ground');
        this.textures.remove('background1');
        this.textures.remove('background2');
        this.textures.remove('background3');
        this.textures.remove('selectAction');
        this.textures.remove('utility');
        this.textures.remove('btnBlank');
        this.textures.remove('obstacle');
    }

    preload() {
        this.clearSceneCache();
        this.load.image('bg', bg);
    }
    
    create() {
        this.background = this.add.image(0, 0, 'bg').setOrigin(0);
    }

}
export default thanks;