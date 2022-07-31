import Phaser from 'phaser';
import AwaitLoaderPlugin from 'phaser3-rex-plugins/plugins/awaitloader-plugin.js';
import Scene1 from './scenes/scene1';
import Scene2 from './scenes/scene2';
import Scene3 from './scenes/scene3';
import Scene4 from './scenes/scene4';
import Scene5 from './scenes/scene5';
import Scene6 from './scenes/scene6';
import Scene7 from './scenes/scene7';
import selectItemScene from './scenes/selectItemScene';
import menuScene from './scenes/menuScene';
import selectMap from './scenes/selectMap';
import thanks from './scenes/thanks';
import exhausted from './scenes/exhausted';

const gameConfig = {
  type: Phaser.CANVAS,
  antialias: true,
  parent: "sustainations-slug",
  scale: {
    width: 1920,
    height: 1080,
    pixelArt: true,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  plugins: {
    global: [{
        key: 'rexAwaitLoader',
        plugin: AwaitLoaderPlugin,
        start: true
    },
    // ...
    ]
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 2000 },
      debug: false
    }
  },
  scene: [menuScene, selectMap, selectItemScene, Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7, thanks, exhausted]
};

export default gameConfig;
