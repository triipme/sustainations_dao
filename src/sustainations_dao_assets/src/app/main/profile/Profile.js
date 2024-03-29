import { useState, useEffect } from 'react';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Typography
} from '@mui/material';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useSelector } from "react-redux";
import { selectUser } from 'app/store/userSlice';
import QRCode from "react-qr-code";
import { fICP } from '../../utils/NumberFormat';
import { walletAddressLink } from '../../utils/TextFormat';

const Profile = () => {
  const user = useSelector(selectUser);
  const { profile } = user;
  const [isCopied, setIsCopied] = useState(false);
  const [loading, setLoading] = useState(true)
  const [referralCount, setReferralCount] = useState(0);
  const referralLink = `${window.location.protocol}//${window.location.host}/sign-in?inviter=${user.principal}`;

  useEffect(() => {
    async function loadReferralCount() {
      let res = await user.actor.getReferralCount();
      console.log(res);
      if ('ok' in res) {
        setReferralCount(res.ok);
      }
      setLoading(false);
    }
    loadReferralCount();
  }, [user]);

  // This is the function we wrote earlier
  async function copyTextToClipboard() {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(referralLink);
    } else {
      return document.execCommand('copy', true, referralLink);
    }
  }

  // onClick handler function for the copy button
  const handleCopyClick = () => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard()
      .then(() => {
        // If successful, update the isCopied state value
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  if (loading) {
    return (<FuseLoading />)
  }

  return (
    <div className="relative flex flex-col flex-auto items-center">
      <div className="w-full max-w-7xl">
        <Card className="w-full py-32 mx-auto mt-24 rounded-2xl shadow">
          <CardContent className="p-24 pt-0 sm:p-48 sm:pt-0">
            <div className="flex flex-auto items-end">
              <Avatar
                sx={{
                  borderWidth: 4,
                  borderStyle: 'solid',
                  borderColor: 'background.paper',
                  backgroundColor: 'background.default',
                  color: 'text.secondary',
                }}
                className="w-128 h-128 text-64 font-bold"
                src={user.avatar}
                alt={profile?.username[0]}
              >
                <QRCode
                  size={120}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={user.depositAddress}
                  viewBox={`0 0 120 120`}
                />
              </Avatar>
              <div className="flex items-center ml-auto mb-4">
                <Button variant="contained" color="secondary" component={NavLinkAdapter} to="edit">
                  <FuseSvgIcon size={20}>edit_outlined</FuseSvgIcon>
                  <span className="mx-8">Edit</span>
                </Button>
              </div>
            </div>

            <Typography className="mt-12 text-4xl font-bold truncate">{profile?.username[0]}</Typography>

            <div className="flex flex-wrap items-center mt-8">
              <Chip
                label={fICP(user.balance)}
                className="mr-12 mb-12"
                size="small"
              />
            </div>

            <Divider className="mt-16 mb-24" />

            <div className="flex flex-col space-y-32">
              <div className="flex items-center">
                <FuseSvgIcon>fingerprint_outlined</FuseSvgIcon>
                <div className="ml-24 leading-6">{user.principal}</div>
              </div>

              <div className="flex items-center">
                <FuseSvgIcon>account_balance_wallet_outlined</FuseSvgIcon>
                <div className="ml-24 leading-6">{walletAddressLink(user.depositAddress)}</div>
              </div>

              <div className="flex">
                <FuseSvgIcon>local_phone_outlined</FuseSvgIcon>
                <div className="min-w-0 ml-24 space-y-4">
                  <div className="flex items-center leading-6">
                    <div className="ml-10 font-mono">{profile?.phone[0] || "N/A"}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <FuseSvgIcon>account_tree_outlined</FuseSvgIcon>
                <div className="ml-24 leading-6 referralLink">
                  <code>Referral Count: {parseInt(referralCount)}</code>
                  <Button variant="text" color="secondary" sx={{ fontSize: 14 }} onClick={handleCopyClick}>
                    <FuseSvgIcon sx={{ fontSize: 14 }}>content_copy_outlined</FuseSvgIcon>
                    <span className="mx-4">{isCopied ? 'Copied!' : 'Copy Link'}</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
};

export default Profile;