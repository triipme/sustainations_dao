import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/userSlice';
import QRCode from "react-qr-code";
import { fCurrency, fICP } from '../../utils/NumberFormat';
import { walletAddressLink } from '../../utils/TextFormat';

const Root = styled('div')(({ theme }) => ({
  '& .username, & .email': {
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
  },

  '& .avatar': {
    background: theme.palette.background.default,
    transition: theme.transitions.create('all', {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
    bottom: 0,
    '& > img': {
      borderRadius: '50%',
    },
  },
}));

function UserNavbarHeader(_props) {
  const user = useSelector(selectUser);
  if (user.depositAddress == '') {
    return (<></>)
  }
  return (
    <Root className="user relative flex flex-col items-center justify-center p-16 pb-14 shadow-0">
      <div className="flex items-center justify-center mb-24 w-128 h-128">
        <QRCode
          size={256}
          style={{ height: "auto", maxWidth: "20rem", width: "100%" }}
          value={user.depositAddress}
          viewBox={`0 0 256 256`}
        />
      </div>
      <Typography title={user.depositAddress} className="username text-14 text-center break-all font-medium flex-auto w-full">
        {walletAddressLink(user.depositAddress)}
      </Typography>
      <Typography className="username text-14 truncate font-medium text-center w-full">
        {fICP(user.balance)}
        <br/>
        &nbsp;~&nbsp;{fCurrency(parseInt(user.balanceUsd) / 1e8, 'USD')}
      </Typography>
    </Root>
  );
}

export default UserNavbarHeader;
