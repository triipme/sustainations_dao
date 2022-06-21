import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

function UserAgreement({ userAgreement }) {
  return (
    <Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-8 pt-12">
        <Typography
          className="px-16 text-lg font-medium tracking-tight leading-6 truncate"
          color="text.secondary"
        >
          Signed Pledges
        </Typography>
      </div>
      <div className="text-center mt-8 mb-24">
        <Typography className="text-7xl sm:text-8xl font-bold tracking-tight leading-none text-blue-500">
          {Number(userAgreement).toString()}
        </Typography>
        <Typography className="text-lg font-medium text-blue-600 dark:text-blue-500">
          Signed Pledges
        </Typography>
      </div>
    </Paper>
  );
}

export default memo(UserAgreement);
