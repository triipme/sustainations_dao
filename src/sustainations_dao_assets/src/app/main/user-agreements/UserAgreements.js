import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import FuseLoading from '@fuse/core/FuseLoading';
import moment from 'moment';
import { canisterId, createActor } from "../../../../../declarations/sustainations_dao";

function UserAgreements() {
  const navigate = useNavigate();
  const routeParams = useParams();
  const { uid } = routeParams;
  const [agreement, setAgreement] = useState({});
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAgreement() {
      const actor = createActor(canisterId);
      const res = await actor.getUserAgreement(uid);
      if ('ok' in res) {
        setAgreement(res.ok);
        setLoading(false);
      } else {
        navigate('404');
      }
    }
    loadAgreement();
  });

  if (loading) {
    return (<FuseLoading />);
  }

  return (
    <div className="flex flex-col flex-auto items-center sm:justify-center min-w-0">
      <Paper className="w-full sm:w-auto min-h-full sm:min-h-auto rounded-0 py-32 px-16 sm:p-48 sm:rounded-2xl sm:shadow">
        <div className="w-full max-w-5xl sm\:w-auto mx-auto sm:mx-0">
          <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight text-center">
            THE SUSTAINATIONS D.A.O PLEDGE
          </Typography>
          <Typography className="mt-32 justify-center">
            A deep love of the environment and a recognition of the need to take strong, immediate action to protect is at the heart of everything we do. By joining our D.A.O, you're joining us in our mission to meaningful solutions to the growing ecological crisis. It means a lot to us, so we're offering all who sign the Sustainations Pledge a humble amount of token. You're already doing a lot by visiting our D.A.O, so please accept this gift as our show of thanks.
          </Typography>
          <Typography className="mt-32 justify-center">
            On top of that, we invite you to grow a Sustainable Fund that we're using to advance a series of sustainability projects, including a plastic waste reduction program via Sustainations Refill Stations, tree and coral planting via Sustainations Metaverse... We're a blockchain D.A.O, but we're also much more than that. Similarly, you're more than just a member and a consumer. You're an important part of the change we all need to make together to chart a different course for the Earth and all those who share our home.
          </Typography>
          <Typography className="mt-32 text-center font-bold">
            For myself and my posterity, I am taking this pledge to reduce my environmental impact and protect my immediate area and those I visit.
          </Typography>
          <Typography className="mt-16 text-center font-bold">
            I will always travel the Earth with an interest in learning about, respecting and protecting local cultures that have established a place there before me.
          </Typography>
          <Typography className="mt-16 text-center font-bold">
            I will leave behind just my footprints. I will take only the memories I've created in the place.
          </Typography>
          <Typography className="mt-32 text-center font-bold">
            {agreement.address.slice(0, 6)}...{agreement.address.slice(-6)}
          </Typography>
          <Typography className="mt-16 text-center font-bold">
            {moment.unix(parseInt(agreement.timestamp / BigInt(1e9))).format("dddd, MMMM Do YYYY, h:mm:ss a")}
          </Typography>
          <div className="text-center">
            <Button
              className="w-full max-w-64 min-w-128 mt-32 text-white"
              color="secondary"
              variant="contained"
            >
              Signed
            </Button>
            <Link className="block font-normal mt-48" to="/">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </Paper>
    </div>
  );
}

export default UserAgreements;
