import _ from 'lodash';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import LoadingButton from '@mui/lab/LoadingButton';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { lighten, darken } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { selectUser } from 'app/store/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import { fPercent } from '../../utils/NumberFormat';

function ProjectCard({ project }) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const progress = (parseInt(project.voteYes) * 100) / parseInt(project.payload.fundingAmount);

  useEffect(() => {
    if ('open' in project.status) {
      if (_.findIndex(project.voters, (voter) => voter[0].uid.toText() === user.principal) !== -1) {
        setVoted(true);
      }
    }
  });

  const handleVote = async () => {
    if (voted) {
      return;
    }
    setLoading(true);
    const payload = {
      vote: {yes: null},
      proposalId: project.uuid,
    }
    try {
      const result = await user.actor.vote(payload);
      if ("ok" in result) {
        setVoted(true);
        dispatch(showMessage({ message: "Success!" }));
      } else {
        throw result?.err;
      }
    } catch (error) {
      const message = {
        "NotAuthorized": "Please sign in!.",
        "NotFound": "Project is not found.",
        "BalanceLow": "Not enough ICP in your account.",
        "TransferFailure": "Can not transfer ICP.",
        "ProposalIsNotOpened": "Project is not opened.",
        "AlreadyVoted": "You has been invested this project."
      }[Object.keys(error)[0]] || 'Error! Please try again later!'
      dispatch(showMessage({ message }));
    }
    setLoading(false);
  };

  return (
    <Card key={project.uuid} className="flex flex-col h-384 shadow">
      <CardContent className="flex flex-col flex-auto p-24">
        {projectInfo(project)}
      </CardContent>
      <Typography className="mx-24 text-16 font-medium">{`Progress: ${fPercent(progress)}`}</Typography>
      <LinearProgress
        className="w-full h-2"
        variant="determinate"
        value={progress}
        color="secondary"
      />
      <CardActions
        className="items-center justify-end py-16 px-24"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? lighten(theme.palette.background.default, 0.4)
              : lighten(theme.palette.background.default, 0.03),
        }}
      >
        <LoadingButton
          className="px-16 min-w-128"
          color={voted ? "inherit" : "secondary"}
          variant="contained"
          onClick={handleVote}
          loading={loading}
          disabled={voted}
        >
          {voted ? 'Invested' : 'Invest'}
        </LoadingButton>
      </CardActions>
    </Card>
  );
}

function projectInfo(project) {
  const { payload } = project;
  return (
    <div className="w-full">
      <div className="mb-16">
        {payload.categories.map((category, index) => (
          <ProjectCategory category={category} key={index} index={index} />
        ))}
        {"succeeded" in project.status && (
          <FuseSvgIcon className="text-green-600" size={20}>
            heroicons-solid:badge-check
          </FuseSvgIcon>
        )}
      </div>

      <Typography className="text-16 font-medium">
        <Link to={`/projects/${project.uuid}`}>{payload.name}</Link>
      </Typography>

      <Typography className="text-13 mt-2 line-clamp-2" color="text.secondary">
        {payload.description}
      </Typography>

      <Divider className="w-48 my-8 border-1" light />

      <Typography className="flex items-center space-x-6 text-13" color="text.secondary">
        <span className="whitespace-nowrap leading-none">{`Location: ${payload.location}`}</span>
      </Typography>
      <Typography className="flex items-center space-x-6 text-13" color="text.secondary">
        <span className="whitespace-nowrap leading-none">{`Funding Type: ${payload.fundingType}`}</span>
      </Typography>
      <Typography className="flex items-center space-x-6 text-13" color="text.secondary">
        <span className="whitespace-nowrap leading-none">Video demo:&nbsp;</span>
        <a href={payload?.video}>here</a>
      </Typography>
    </div>
  );
};

const ProjectCategory = React.memo(({ category, index} ) => {
  return (
    <Chip
      key={index}
      className="font-semibold text-12 mr-4 mb-4"
      label={category}
      sx={{
        color: (theme) =>
          theme.palette.mode === 'light'
            ? darken("#2196f3", 0.4)
            : lighten("#2196f3", 0.8),
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? lighten("#2196f3", 0.8)
            : darken("#2196f3", 0.1),
      }}
      size="small"
    />
  );
});

export default ProjectCard;
