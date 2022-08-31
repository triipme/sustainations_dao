import gameConfig from "./GameConfig";
import GetData from "./GetData";
class MetaverseQuests extends React.Component {
  componentDidMount() {
    this.slug = new Phaser.Game(gameConfig);
    document.body.classList.add("black-bg");
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    document.body.classList.remove("black-bg");
  }

  render() {
    return <div id="sustainations-slug"></div>;
  }
}

export default MetaverseQuests;
