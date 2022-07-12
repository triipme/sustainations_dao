import store from 'app/store';
import Phaser from 'phaser';

const startBtn = 'metaverse/startbtn.png';
const item = 'metaverse/items/item.png';
const selectItemsText = 'metaverse/selectItemText.png';

class selectItemScene extends Phaser.Scene {
  constructor() {
    super('selectItemScene');
  }

  clearCache() {
    const textures_list = ["bg", "text", 'selectArea', 'locationDetail'];
    for (const index in textures_list){
      this.textures.remove(textures_list[index]);
    }
  }
  preload() {
    this.clearCache();
    this.load.image("startBtn", startBtn);
    this.load.image("item", item);
    this.load.image("selectItemsText", selectItemsText);
  }

  async create() {
    const { user } = store.getState();
    // const readCharacter = async () => await user.actor.readCharacter();
    const listQuestItems = async () => await user.actor.listQuestItems("179230D4-1028-4A4A-A6D7-085608D23D37");

    // const character = await readCharacter();
    const items = await listQuestItems();
    console.log(items);
    // console.log(character);

    //text
    this.add.image(960, 150, 'selectItemsText');

    //startBtn
    this.startButton = this.add.image(960, 900, 'startBtn').setScale(0.3).setInteractive();
    this.startButton.on('pointerdown', () => this.scene.transition({target: 'Scene1', duration: 0 }));

    //item list
    this.item1 = this.add.image(960 - 500, 500, 'item').setScale(0.7).setInteractive();
    this.item1.isChoosen = false;
    this.item2 = this.add.image(960, 500, 'item').setScale(0.7).setInteractive();
    this.item2.isChoosen = false;
    this.item3 = this.add.image(960 + 500, 500, 'item').setScale(0.7).setInteractive();
    this.item3.isChoosen = false;
    this.item1.on('pointerdown', () => {
      if (this.item1.isChoosen == false){
        this.item1.setTintFill(0xffffff);
      } else {
        this.item1.clearTint();
      }
      this.item1.isChoosen = !this.item1.isChoosen;
    });
    this.item2.on('pointerdown', () => {
      if (this.item2.isChoosen == false){
        this.item2.setTintFill(0xffffff);
      } else {
        this.item2.clearTint();
      }
      this.item2.isChoosen = !this.item2.isChoosen;
    });
    this.item3.on('pointerdown', () => {
      if (this.item3.isChoosen == false){
        this.item3.setTintFill(0xffffff);
      } else {
        this.item3.clearTint();
      }
      this.item3.isChoosen = !this.item3.isChoosen;
    });
  }
}

export default selectItemScene;