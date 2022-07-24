import gameConfig from "./GameConfig";
import GetData from "./GetData";
class Metaverse extends React.Component {
  componentDidMount() {
    this.game = new Phaser.Game(gameConfig);
    document.body.classList.add('black-bg');
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div id="sustainations-game"></div>
    )
  }
}

export default Metaverse;
