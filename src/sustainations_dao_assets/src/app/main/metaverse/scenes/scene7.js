import Phaser from 'phaser';
import gameConfig from '../GameConfig';
const heroRunningSprite = 'metaverse/walkingsprite.png';
const ground = 'metaverse/transparent-ground.png';
const bg1 = 'metaverse/scenes/Scene7/PNG/back-01.png';
const bg2 = 'metaverse/scenes/Scene7/PNG/mid-01.png';
const bg3 = 'metaverse/scenes/Scene7/PNG/front-01.png';
const obstacle = 'metaverse/scenes/Scene7/PNG/obstacle-01.png';
const selectAction = 'metaverse/scenes/background_menu.png';
const btnBlank = 'metaverse/scenes/selection.png';

export default class Scene7 extends Phaser.Scene {
    constructor() {
        super('Scene7');
    }

    clearSceneCache(){
        this.textures.remove('ground');
        this.textures.remove('background1');
        this.textures.remove('background2');
        this.textures.remove('background3');
        this.textures.remove('selectAction');
        this.textures.remove('btnBlank');
        this.textures.remove('obstacle');
    }

    preload() {
        this.clearSceneCache();
        this.isInteracting = false;
        this.isInteracted = false;
        this.load.spritesheet("hero-running", heroRunningSprite, {
            frameWidth: 197,
            frameHeight: 337
        });
        this.load.image("ground", ground);
        this.load.image("background1", bg1);
        this.load.image("background2", bg2);
        this.load.image("background3", bg3);
        this.load.image("selectAction", selectAction);
        this.load.spritesheet('btnBlank', btnBlank, { frameWidth: 1102, frameHeight: 88});
        this.load.image("obstacle", obstacle);
    }

    //defined function
    triggerPause(){
        this.isInteracting = true;
        this.veil.setVisible(true);
        this.selectAction.setVisible(true);
        this.option1.setVisible(true);
    }

    triggerContinue(){
        this.veil.setVisible(false);
        this.selectAction.setVisible(false);
        this.option1.setVisible(false);
        this.option1.text.setVisible(false);
        this.isInteracting = false;
        this.isInteracted = true;
        this.player.play('running-anims');
    }


    create() {

        //background
        this.bg_1 = this.add.tileSprite(0, 0, gameConfig.scale.width, gameConfig.scale.height, "background1");
        this.bg_1.setOrigin(0, 0);
        this.bg_1.setScrollFactor(0);
        
        this.bg_2 = this.add.tileSprite(0, 0, gameConfig.scale.width, gameConfig.scale.height, "background2");
        this.bg_2.setOrigin(0, 0);
        this.bg_2.setScrollFactor(0);

        this.obstacle = this.add.tileSprite(0, 0, gameConfig.scale.width, gameConfig.scale.height, "obstacle")
            .setOrigin(0,0)
            .setScrollFactor(0);

            // platforms
        const platforms = this.physics.add.staticGroup();
        for (let x = -100; x < 1920*4; x += 1) {
            platforms.create(x, 950, "ground").refreshBody();
        }

        //player
        this.player = this.physics.add.sprite(-80, 700, "hero-running");
        this.player.setBounce(0.25);
        this.player.setCollideWorldBounds(false);
        this.physics.add.collider(this.player, platforms);



        this.anims.create({
            key: "running-anims",
            frames: this.anims.generateFrameNumbers("hero-running", {start: 1, end: 4}),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: "idle-anims",
            frames: this.anims.generateFrameNumbers("hero-running", {start: 0, end: 0}),
            frameRate: 1,
            repeat: -1
        });
        this.player.play('running-anims');

        //frontlayer
        this.bg_3 = this.add.tileSprite(0, 0, gameConfig.scale.width, gameConfig.scale.height, "background3");
        this.bg_3.setOrigin(0, 0);
        this.bg_3.setScrollFactor(0);

        //UI
        this.add.image(20, 40, "UI_NameCard").setOrigin(0).setScrollFactor(0).setScale(0.95);
        this.add.image(370, 40, "UI_HP").setOrigin(0).setScrollFactor(0).setScale(0.95);
        this.add.image(720, 40, "UI_Mana").setOrigin(0).setScrollFactor(0).setScale(0.95);
        this.add.image(1070, 40, "UI_Stamina").setOrigin(0).setScrollFactor(0).setScale(0.95);
        this.add.image(1420, 40, "UI_Morale").setOrigin(0).setScrollFactor(0).setScale(0.95);
        this.add.image(80, 830, "UI_Utility").setOrigin(0).setScrollFactor(0);
        this.add.image(1780, 74, "BtnExit").setOrigin(0).setScrollFactor(0).setScale(0.7)
            .setInteractive()
            .on('pointerdown', () => {
                window.open('/', '_self');
            });

        //mycam
        this.myCam = this.cameras.main;
        this.myCam.setBounds(0, 0, gameConfig.scale.width, gameConfig.scale.height); //furthest distance the cam is allowed to move
        this.myCam.startFollow(this.player);


        //pause screen
        this.veil = this.add.graphics({x: 0, y: 0});
        this.veil.fillStyle('0x000000', 0.2);
        this.veil.fillRect(0,0, gameConfig.scale.width, gameConfig.scale.height);
        this.selectAction = this.add.image(0, 0, 'selectAction').setOrigin(0,0);
        this.veil.setScrollFactor(0);
        this.veil.setVisible(false);
        this.selectAction.setScrollFactor(0);
        this.selectAction.setVisible(false);

        this.option1 = this.add.sprite(gameConfig.scale.width/2, gameConfig.scale.height/2 -100, 'btnBlank');
        this.option1.text = this.add.text(gameConfig.scale.width/2, gameConfig.scale.height/2 -100, "...", { fill: '#fff', align: 'center', fontSize: '30px' })
            .setScrollFactor(0).setVisible(false).setOrigin(0.5);
        this.option1.setInteractive();
        this.option1.setScrollFactor(0);
        this.option1.setVisible(false);
        this.option1.on('pointerover', () => {
            this.option1.setFrame(1);
        });
        this.option1.on('pointerout', () => {
            this.option1.setFrame(0);
        });
        this.option1.on('pointerdown', () => {
            this.triggerContinue();
            // this.obstacle.setVisible(false);
        });
    }

    update() {
        //new player logic
        if (this.player.body.touching.down && this.isInteracting == false) {
            this.player.setVelocityX(350);
        }

        if (this.player.x > 1920) {
            this.player.setVelocityX(0);
            this.scene.start("thanks");
        }

        if (this.player.x > 500 && this.isInteracted == false) {
            this.triggerPause();
            this.player.setVelocityX(0);
            this.player.play('idle-anims');
            this.player.stop()
        }

        //bg
        // scroll the texture of the tilesprites proportionally to the camera scroll
        this.bg_1.tilePositionX = this.myCam.scrollX * .3;
        this.bg_2.tilePositionX = this.myCam.scrollX * .6;
        this.obstacle.tilePositionX = this.myCam.scrollX * .6;
        this.bg_3.tilePositionX = this.myCam.scrollX * 1;
    }
}