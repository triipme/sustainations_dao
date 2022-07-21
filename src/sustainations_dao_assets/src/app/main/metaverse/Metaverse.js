import gameConfig from "./GameConfig";

class Metaverse extends React.Component {
  componentDidMount() {
    this.gameType = new Phaser.Game(gameConfig);
    document.body.classList.add("black-bg");
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    document.body.classList.remove("black-bg");
  }

  render() {
    return <div id="sustainations-gameType"></div>;
  }
}

export default Metaverse;
