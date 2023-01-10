import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import FuseLoading from '@fuse/core/FuseLoading';
import { canisterId, createActor } from "../../../../../../declarations/sustainations_dao";

function QuestPreview() {
  const navigate = useNavigate();
  const routeParams = useParams();
  const { questId } = routeParams;
  const [quest, setQuest] = useState({});
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadQuest() {
      const actor = createActor(canisterId);
      const res = await actor.readQuest(questId);
      if ('ok' in res) {
        setQuest(res.ok);
        setLoading(false);
      } else {
        navigate('404');
      }
    }
    loadQuest();
  });

  if (loading) {
    return (<FuseLoading />);
  }

  const divStyle = {
    backgroundImage: 'url(https://images.immediate.co.uk/production/volatile/sites/3/2021/04/pokemon-games-7cedcc4.png?quality=90&webp=true&resize=620,414)',
  };

  // TODO: update html/css
  return (
    <div className="flex flex-col flex-auto items-center sm:justify-center min-w-0">
      <div style={divStyle}>Hello World!</div>
      <Paper className="w-full sm:w-auto min-h-full sm:min-h-auto rounded-0 py-32 px-16 sm:p-48 sm:rounded-2xl sm:shadow">
        <div className="w-full max-w-5xl sm\:w-auto mx-auto sm:mx-0">
          <Typography className="mt-32 justify-center">
            Welcome to my newly designed Sustainations Quest ! We're excited to have you join us on this epic journey.
            <br />
            As a new player, you will take on the role of a pioneer traveling in search of a lost treasures . You will face many challenges along the way, from treacherous river crossings to harsh weather and unexpected events.
            <br />
            To succeed in this quest, you will need to use your resourcefulness and problem-solving skills to overcome these obstacles. You'll also need to make tough decisions as well.
            <br />
            You have a chance to earn attractive prizes ($ICP, $TIIM or land and items)
            <br />
            We wish you the best of luck on your journey, and we hope you have a great time exploring the wilds of Sustainations World.
          </Typography>
          <div className="text-center">
            <Link className="block font-normal mt-48" to="/metaverse/quest">
            Click here to login/sign up!
            </Link>
          </div>
        </div>
      </Paper>
    </div>
  );
}

export default QuestPreview;
