import gameConfig from "./GameConfig";

class Metaverse extends React.Component {
  componentDidMount() {
    this.game = new Phaser.Game(gameConfig);
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (<div id="sustainations-game"></div>)
  }
};

export default Metaverse;