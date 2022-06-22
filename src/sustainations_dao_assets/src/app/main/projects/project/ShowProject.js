import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { Link, useParams } from 'react-router-dom';
import { lighten, darken } from '@mui/material/styles';
import _ from 'lodash';
import moment from 'moment';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
import { selectUser } from 'app/store/userSlice';
import { fPercent, fICP } from '../../../utils/NumberFormat';
import { showMessage } from 'app/store/fuse/messageSlice';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import ShowProjectMedia from './ShowProjectMedia';

function ShowProject() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const routeParams = useParams();
  const { projectId } = routeParams;
  const [project, setProject] = useState({});
  const theme = useTheme();
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      const res = await user.actor.getProposal(projectId);
      if ('open' in res.ok.status) {
        if (_.findIndex(res.ok.voters, (voter) => voter[0].uid.toText() === user.principal) !== -1) {
          setVoted(true);
        }
      }
      setProject(res.ok);
    }
    loadData();
  }, [projectId, user]);

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
        "BalanceLow": "You need minimum 0.00003 ICP to Invest in this project.",
        "TransferFailure": "Can not transfer ICP.",
        "ProposalIsNotOpened": "Project is not opened.",
        "AlreadyVoted": "You has been invested this project."
      }[Object.keys(error)[0]] || 'Error! Please try again later!'
      dispatch(showMessage({ message }));
    }
    setLoading(false);
  };

  if (_.isEmpty(project)) {
    return <FuseLoading />;
  }

  const { images } = project.payload;
  return (
    <div className="flex flex-col items-center p-24 sm:p-40">
      <div className="flex flex-col w-full max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <Button
            to="/projects"
            component={Link}
            className="float-left"
            color="secondary"
            variant="text"
            startIcon={
              <FuseSvgIcon size={20}>
                {theme.direction === 'ltr'
                  ? 'arrow_back'
                  : 'arrow_forward'}
              </FuseSvgIcon>
            }
          >
            Back to list
          </Button>
          <LoadingButton
            className="px-16 min-w-128 float-right"
            color={voted ? "inherit" : "secondary"}
            variant="contained"
            onClick={handleVote}
            loading={loading}
            disabled={voted}
          >
            {voted ? 'Invested' : 'Invest'}
          </LoadingButton>
        </div>
        <Card className="w-full py-32 mx-auto rounded-2xl shadow break-all">
          <CardContent>
            {project.payload.categories.map((category, index) => (
              <ProjectCategory category={category} key={index} index={index} />
            ))}
            <Typography className="mt-32 mb-16 text-3xl font-bold tracking-tight leading-tight">{project.payload.name}</Typography>
            <Typography className="mt-32 mb-16 text-2xl font-bold">{project.payload?.description}</Typography>
            <Typography className="space-x-6 text-13">
              <span className="whitespace-nowrap leading-none">{`Location: ${project.payload.location}`}</span>
            </Typography>
            <Typography className="space-x-6 text-13">
              <span className="whitespace-nowrap leading-none">{`Due Date: ${moment.unix(parseInt(project.payload.dueDate / BigInt(1e9))).format("MM/DD/YYYY h:mm:ss a")}`}</span>
            </Typography>
            <Typography className="space-x-6 text-13">
              <span className="whitespace-nowrap leading-none">{`Funding Type: ${project.payload.fundingType}`}</span>
            </Typography>
            <Typography className="space-x-6 text-13">
              <span className="whitespace-nowrap leading-none">Funding Amount:</span>
              {fICP(project.payload.fundingAmount)}
            </Typography>
            <Typography className="space-x-6 text-13">
              <span className="whitespace-nowrap leading-none">Invested Amount:</span>
              {fICP(project.votesYes)}
            </Typography>
            <Typography className="space-x-6 text-13">
              <span className="whitespace-nowrap leading-none">Video demo:&nbsp;</span>
              <a href={project.payload?.video}>{project.payload?.video}</a>
            </Typography>
            {!!project.payload?.document && (
              <Typography className="space-x-6 text-13">
                <span className="whitespace-nowrap leading-none">Document:&nbsp;</span>
                <a href={`https://sustainations-dao.s3.ap-southeast-1.amazonaws.com/${project.payload?.document}`}>here</a>
              </Typography>
            )}
            <Typography className="space-x-6 text-13">
              <span className="whitespace-nowrap leading-none">Discussion link:&nbsp;</span>
              <a href={project.payload?.discussionLink}>{project.payload?.discussionLink}</a>
            </Typography>
            <Typography className="space-x-6 text-13">
              <span className="whitespace-nowrap leading-none">{`Progress: ${fPercent((parseInt(project.voteYes) * 100) / parseInt(project.payload.fundingAmount))}`}</span>
            </Typography>
            <Typography className="mt-32 mb-16 text-2xl font-bold">Media</Typography>
            <ShowProjectMedia images={images} />
            <Typography className="mt-32 mb-16 text-2xl font-bold">Project Story</Typography>
            <ReactMarkdown children={project.payload?.story[0]} remarkPlugins={[remarkGfm]} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
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

export default ShowProject;
