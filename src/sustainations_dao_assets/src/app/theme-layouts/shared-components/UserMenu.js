import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { selectUser } from 'app/store/userSlice';
import QRCode from "react-qr-code";
import { fCurrency, fICP } from '../../utils/NumberFormat';
import _ from 'lodash';

function UserMenu(_props) {
  const user = useSelector(selectUser);
  const { profile } = user;
  const [userMenu, setUserMenu] = useState(null);

  const userMenuClick = (event) => {
    setUserMenu(event.currentTarget);
  };

  const userMenuClose = () => {
    setUserMenu(null);
  };

  if (user.depositAddress == '') {
    return (
      <MenuItem component={Link} to="/sign-in" role="button">
        <ListItemIcon className="min-w-40">
          <FuseSvgIcon>login_outlined</FuseSvgIcon>
        </ListItemIcon>
        <ListItemText primary="Sign in" />
      </MenuItem>
    );
  }

  return (
    <>
      <Button
        className="min-h-40 min-w-40 px-0 md:px-16 py-0 md:py-6"
        onClick={userMenuClick}
        color="inherit"
      >
        <div className="hidden md:flex flex-col mx-4 items-end">
          <Typography component="span" className="max-w-2xl truncate font-semibold flex">
            {profile?.username || user.depositAddress}
          </Typography>
          <Typography className="text-11 font-medium capitalize" color="text.secondary">
            {fICP(user.balance)}
            <br/>
            &nbsp;~&nbsp;{fCurrency(parseInt(user.balanceUsd) / 1e8, 'USD')}
          </Typography>
        </div>

        <Avatar className="md:mx-4" src={user.avatar} alt={user.depositAddress}>
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={user.depositAddress}
            viewBox={`0 0 256 256`}
          />
        </Avatar>
      </Button>

      <Popover
        open={Boolean(userMenu)}
        anchorEl={userMenu}
        onClose={userMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        classes={{
          paper: 'py-8',
        }}
      >
        <>
          <MenuItem component={Link} to="/profile" onClick={userMenuClose} role="button">
            <ListItemIcon className="min-w-40">
              <FuseSvgIcon>account_circle_outlined</FuseSvgIcon>
            </ListItemIcon>
            <ListItemText primary="My Profile" />
          </MenuItem>
          <MenuItem component={Link} to={`/user-agreements/${user.principal}`} onClick={userMenuClose} role="button">
            <ListItemIcon className="min-w-40">
              <FuseSvgIcon>assignment_turned_in_outlined</FuseSvgIcon>
            </ListItemIcon>
            <ListItemText primary="My Agreement" />
          </MenuItem>
          <MenuItem
            component={NavLink}
            to="/sign-out"
            onClick={() => {
              userMenuClose();
            }}
          >
            <ListItemIcon className="min-w-40">
              <FuseSvgIcon>exit_to_app_outlined</FuseSvgIcon>
            </ListItemIcon>
            <ListItemText primary="Sign out" />
          </MenuItem>
        </>
      </Popover>
    </>
  );
}

export default UserMenu;
