import Phaser from 'phaser';
import game from '../index';
import heroRunningSprite from '../assets/walkingsprite.png';
import ground from '../assets/transparent-ground.png';
import bg1 from '../assets/layer1-scene1.png';
import bg2 from '../assets/layer2-scene1-shortened.png';
import bg3 from '../assets/layer3-scene1.png';
import utility from '../assets/status_utility.png';
import selectAction from '../assets/selectAction.png';
import btnBlank from '../assets/btn-blank.png';

export default class Scene1 extends Phaser.Scene {
    constructor() {
        super('Scene1');
    }


    preload() {
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
        this.load.image("utility", utility);
        this.load.image("selectAction", selectAction);
        this.load.image("btnBlank", btnBlank);
    }

    //defined function

    triggerPause(){
        this.isInteracting = true;
        this.veil.setVisible(true);
        this.selectAction.setVisible(true);
        this.option1.setVisible(true);
    }

    create() {

        //background
        this.bg_1 = this.add.tileSprite(0, 0, game.config.width, game.config.height, "background1");
        this.bg_1.setOrigin(0, 0);
        this.bg_1.setScrollFactor(0);
        
        this.bg_2 = this.add.tileSprite(0, 0, game.config.width, game.config.height, "background2");
        this.bg_2.setOrigin(0, 0);
        this.bg_2.setScrollFactor(0);

        this.add.tileSprite()
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
        this.bg_3 = this.add.tileSprite(0, 0, game.config.width, game.config.height, "background3");
        this.bg_3.setOrigin(0, 0);
        this.bg_3.setScrollFactor(0);

        //utility
        this.utility = this.add.tileSprite(50, 0, 575, 964, "utility");
        this.utility.setOrigin(0, 0);
        this.utility.setScrollFactor(0);

        //mycam
        this.myCam = this.cameras.main;
        this.myCam.setBounds(0, 0, game.config.width*4, game.config.height); //furthest distance the cam is allowed to move
        this.myCam.startFollow(this.player);


        //pause screen
        this.veil = this.add.graphics({x: 0, y: 0});
        this.veil.fillStyle('0x000000', 0.2);
        this.veil.fillRect(0,0, game.config.width, game.config.height);
        this.selectAction = this.add.image(0, 0, 'selectAction').setOrigin(0,0);
        this.option1 = this.add.image(game.config.width/2, game.config.height/2 -100, 'btnBlank').setScale(1.3);
        this.option1.setInteractive();

        this.veil.setScrollFactor(0);
        this.veil.setVisible(false);
        this.selectAction.setScrollFactor(0);
        this.selectAction.setVisible(false);
        this.option1.setScrollFactor(0);
        this.option1.setVisible(false);


        this.option1.on('pointerdown', () => {
            console.log('clicked');
            this.veil.setVisible(false);
            this.selectAction.setVisible(false);
            this.option1.setVisible(false);
            this.isInteracting = false;
            this.isInteracted = true;

            this.player.play('running-anims');
        });
    }

    update() {
        //new player logic
        if (this.player.body.touching.down && this.isInteracting == false) {
            this.player.setVelocityX(350);
        }

        if (this.player.x > 1920*4) {
            this.scene.restart();
        }

        if (this.player.x > 1920*4 -1000 && this.isInteracted == false) {
            this.triggerPause();
            this.player.setVelocityX(0);
            this.player.play('idle-anims');
            this.player.stop()
        }

        //bg
        // scroll the texture of the tilesprites proportionally to the camera scroll
        this.bg_1.tilePositionX = this.myCam.scrollX * .3;
        this.bg_2.tilePositionX = this.myCam.scrollX * .6;
        this.bg_3.tilePositionX = this.myCam.scrollX * .9;
    }
}