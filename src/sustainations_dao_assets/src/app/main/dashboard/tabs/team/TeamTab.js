import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import TeamMembersWidget from './widgets/TeamMembersWidget';

function TeamTab() {
  const container = {
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="flex flex-wrap p-24 opacity-25"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <Typography className="text-lg font-medium tracking-tight leading-6 truncate mb-32">
        Comming soon...
      </Typography>
      <motion.div variants={item} className="widget flex w-full">
        <TeamMembersWidget />
      </motion.div>
    </motion.div>
  );
}

export default TeamTab;
