import gameConfig from "./GameConfig";

class Metaverse extends React.Component {
  componentDidMount() {
    this.game = new Phaser.Game(gameConfig);
    document.body.classList.add("black-bg");
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    document.body.classList.remove("black-bg");
  }

  render() {
    return <div id="sustainations-game"></div>;
  }
}

export default Metaverse;
