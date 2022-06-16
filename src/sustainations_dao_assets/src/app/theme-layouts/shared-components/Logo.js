import { styled } from '@mui/material/styles';

const Root = styled('div')(({ theme }) => ({
  '& > .logo-icon': {
    transition: theme.transitions.create(['width', 'height'], {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
}));

function Logo() {
  return (
    <Root className="flex items-center">
      <img className="logo-icon w-32 h-32" src="images/logo/sustainations-logo.png" alt="logo" />

      <div
        className="flex items-center py-4 px-8 mx-8 rounded"
      >
        Sustainations DAO
      </div>
    </Root>
  );
}

export default Logo;
