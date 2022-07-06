import gameConfig from "./GameConfig";
import { Link } from 'react-router-dom';

class Metaverse extends React.Component {
  componentDidMount() {
    this.game = new Phaser.Game(gameConfig);
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div id="sustainations-game"></div>
      // <div className="flex flex-col flex-1 items-center justify-center p-16">
      //   <div className="w-full max-w-3xl text-center">
      //     <Link className="block font-normal mt-48" to="/">
      //         Back to Dashboard
      //     </Link>
      //   </div>
      // </div>
    )
  }
};

export default Metaverse;