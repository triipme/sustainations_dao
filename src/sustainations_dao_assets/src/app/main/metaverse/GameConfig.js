import Phaser from 'phaser';
import AwaitLoaderPlugin from 'phaser3-rex-plugins/plugins/awaitloader-plugin.js';
import preloadScene from './scenes/preloadScene'
import selectItemScene from './scenes/selectItemScene';
import menuScene from './scenes/menuScene';
import selectMap from './scenes/selectMap';
import thanks from './scenes/thanks';
import exhausted from './scenes/exhausted';

import jungle_scene1 from './scenes/jungle/jungle_scene1';
import jungle_scene2 from './scenes/jungle/jungle_scene2';
import jungle_scene3 from './scenes/jungle/jungle_scene3';
import jungle_scene4 from './scenes/jungle/jungle_scene4';
import jungle_scene5 from './scenes/jungle/jungle_scene5';
import jungle_scene6 from './scenes/jungle/jungle_scene6';
import jungle_scene7 from './scenes/jungle/jungle_scene7';

import catalonia_scene1 from './scenes/catalonia/catalonia_scene1';
import catalonia_scene2_1 from './scenes/catalonia/catalonia_scene2_1';
import catalonia_scene2_2 from './scenes/catalonia/catalonia_scene2_2';
import catalonia_scene2_3 from './scenes/catalonia/catalonia_scene2_3';
import catalonia_scene2_4 from './scenes/catalonia/catalonia_scene2_4';
import catalonia_scene3 from './scenes/catalonia/catalonia_scene3';
import catalonia_scene5_1 from './scenes/catalonia/catalonia_scene5_1';
import catalonia_scene5_2 from './scenes/catalonia/catalonia_scene5_2';
import catalonia_scene6 from './scenes/catalonia/catalonia_scene6';
import catalonia_scene7 from './scenes/catalonia/catalonia_scene7';
import catalonia_scene8 from './scenes/catalonia/catalonia_scene8';
import catalonia_scene9 from './scenes/catalonia/catalonia_scene9';
import catalonia_scene10 from './scenes/catalonia/catalonia_scene10';
import catalonia_scene11 from './scenes/catalonia/catalonia_scene11';
import catalonia_scene12 from './scenes/catalonia/catalonia_scene12';

const gameConfig = {
  type: Phaser.CANVAS,
  parent: "sustainations-slug",
  scale: {
    width: 1280,
    height: 720,
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
  scene: [preloadScene, menuScene, selectMap, selectItemScene, jungle_scene1, jungle_scene2, 
    jungle_scene3, jungle_scene4, jungle_scene5, jungle_scene6, jungle_scene7, thanks, exhausted, 
    catalonia_scene1, catalonia_scene2_1, catalonia_scene2_2, catalonia_scene2_3, catalonia_scene2_4, 
    catalonia_scene3, catalonia_scene5_1, catalonia_scene5_2, catalonia_scene6, catalonia_scene7, catalonia_scene8,
    catalonia_scene9, catalonia_scene10, catalonia_scene11, catalonia_scene12]
};

export default gameConfig;
