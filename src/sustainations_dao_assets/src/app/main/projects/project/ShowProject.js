import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { Link, useParams } from 'react-router-dom';
import { lighten, darken } from '@mui/material/styles';
import _ from 'lodash';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
import { selectUser } from 'app/store/userSlice';
import { fPercent } from '../../../utils/NumberFormat';
import Markdown from 'markdown-to-jsx';

function ShowProject() {
  const user = useSelector(selectUser);
  const routeParams = useParams();
  const { projectId } = routeParams;
  const [project, setProject] = useState({});
  const theme = useTheme();

  useEffect(() => {
    async function loadData() {
      const res = await user.actor.getProposal(projectId);
      setProject(res.ok);
    }
    loadData();
  }, [projectId, user]);

  if (_.isEmpty(project)) {
    return <FuseLoading />;
  }
  console.log(project.payload.story);
  return (
    <div className="flex flex-col items-center p-24 sm:p-40">
      <div className="flex flex-col w-full max-w-7xl">
        <Button
          to="/projects"
          component={Link}
          className="mb-24"
          color="secondary"
          variant="text"
          startIcon={
            <FuseSvgIcon size={20}>
              {theme.direction === 'ltr'
                ? 'heroicons-outline:arrow-sm-left'
                : 'heroicons-outline:arrow-sm-right'}
            </FuseSvgIcon>
          }
        >
          Back to courses
        </Button>
        <Card className="w-full p-64 mx-auto rounded-2xl shadow">
          <CardContent>
            {project.payload.categories.map((category, index) => projectCategory(category, index))}
            <Typography className="mt-32 mb-16 text-3xl font-bold tracking-tight leading-tight">{project.payload.name}</Typography>
            <Typography className="mt-32 mb-16 text-2xl font-bold">{project.payload?.description}</Typography>
            <Typography className="space-x-6 text-13" color="text.secondary">
              <span className="whitespace-nowrap leading-none">{`Location: ${project.payload.location}`}</span>
            </Typography>
            <Typography className="space-x-6 text-13" color="text.secondary">
              <span className="whitespace-nowrap leading-none">{`Funding Type: ${project.payload.fundingType}`}</span>
            </Typography>
            <Typography className="space-x-6 text-13" color="text.secondary">
              <span className="whitespace-nowrap leading-none">{`Funding Amount: ${project.payload.fundingAmount}`}</span>
            </Typography>
            <Typography className="space-x-6 text-13" color="text.secondary">
              <span className="whitespace-nowrap leading-none">Video demo:&nbsp;</span>
              <a href={project.payload?.video}>{project.payload?.video}</a>
            </Typography>
            <Typography className="space-x-6 text-13" color="text.secondary">
              <span className="whitespace-nowrap leading-none">{`Progress: ${fPercent((parseInt(project.voteYes) * 100) / parseInt(project.payload.fundingAmount))}`}</span>
            </Typography>
            <Typography className="mt-32 mb-16 text-2xl font-bold" color="text.secondary">Project Story</Typography>
            <Markdown options={{ forceBlock: true }}>{project.payload.story}</Markdown>
          </CardContent>
        </Card>
      </div>
    </div>
  )
};

function projectCategory(category, key) {
  return (
    <Chip
      key={key}
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
}

export default ShowProject;