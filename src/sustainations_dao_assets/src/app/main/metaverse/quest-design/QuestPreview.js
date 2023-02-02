import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import FuseLoading from '@fuse/core/FuseLoading';
import { canisterId, createActor } from "../../../../../../declarations/sustainations_dao";
import { fontGrid } from '@mui/material/styles/cssUtils';

let AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  region: process.env.S3_REGION,
});
let s3 = new AWS.S3();

function QuestPreview() {
  const navigate = useNavigate();
  const routeParams = useParams();
  console.log(routeParams)
  const { questId } = routeParams;
  const [quest, setQuest] = useState({});
  const [loading, setLoading] = useState(true)

  const [front, setFront] = useState()
  const [mid, setMid] = useState()
  const [back, setBack] = useState()
  const [obstacle, setObstacle] = useState()
  useEffect(() => {
    async function loadQuest() {
      const actor = createActor(canisterId);
      const res = await actor.readQuestEngine(questId);
      const scene = await actor.getScenePreviewQuest(questId);
      const front = s3.getSignedUrl('getObject', { Bucket: process.env.S3_BUCKET, Key: scene.ok.front })
      const mid = s3.getSignedUrl('getObject', { Bucket: process.env.S3_BUCKET, Key: scene.ok.mid })
      const back = s3.getSignedUrl('getObject', { Bucket: process.env.S3_BUCKET, Key: scene.ok.back })
      const obstacle = s3.getSignedUrl('getObject', { Bucket: process.env.S3_BUCKET, Key: scene.ok.obstacle })
      setFront(front)
      setMid(mid)
      setBack(back)
      setObstacle(obstacle)
      if ('ok' in res) {
        setQuest(res.ok);
        setLoading(false);
      } else {
        navigate('404');
      }
    }
    loadQuest();
  }, []);

  if (loading) {
    return (<FuseLoading />);
  }
  console.log(back)
  console.log(mid)
  const urlParams = new URLSearchParams(window.location.search);
  const myParam = urlParams.get('myParam');
  console.log(myParam)

  // TODO: update html/css
  return (
    <div className="flex flex-col flex-auto items-center sm:justify-center min-w-0" >
      <div
        className="bg-image"
        style={{
          backgroundImage: `url(${back})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div
        className="bg-image"
        style={{
          backgroundImage: `url(${mid})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div
        className="bg-image"
        style={{
          backgroundImage: `url(${front})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div
        className="bg-image"
        style={{
          backgroundImage: `url(${obstacle})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          backgroundRepeat: 'no-repeat',
        }}
      />
     <div className="parent-container" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", zIndex: "1" }}>
        <Paper className="w-full sm:w-auto min-h-full sm:min-h-auto rounded-0 py-32 px-16 sm:p-48 sm:rounded-2xl sm:shadow position-absolute" style={{ width: "50%", margin: "auto"}}>
          <div className="w-full max-w-5xl sm\:w-auto mx-auto sm:mx-0">
          <Typography className="mt-32 justify-center text-center" style={{margin: 'auto', textAlign:'center'}}>

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
              <Link className="block font-normal mt-48" to="/metaverse/quests">
                Click here to login/sign up!
              </Link>
            </div>
          </div>
        </Paper>
      </div>



    </div>

  );
}

export default QuestPreview;
