import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from 'app/store/userSlice';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  Typography
} from '@mui/material';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from 'lodash';

const Brand = () => {
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const { brandId } = user;
  const [brand, setBrand] = useState({});

  if (_.isEmpty(brandId)) {
    navigate('/404');
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await user.actor.getRefillBrand(brandId)
        if ('ok' in result) {
          setIsOwner(result.ok[0].toLowerCase() == user.principal.toLowerCase());
          setBrand(result.ok[2]);
        } else {
          navigate('/404');
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    })();
  }, [user]);

  if (loading) {
    return <FuseLoading />;
  }

  return (
    <div className="flex flex-col items-center p-24 sm:p-40">
      <div className="flex flex-col w-full max-w-7xl">
        <Card className="w-full py-32 px-16 mx-auto rounded-2xl shadow break-all">
          <CardContent>
            {isOwner && (
              <div className="flex flex-auto items-end">
                <div className="flex items-center ml-auto mb-4">
                  <Button variant="contained" color="secondary" component={NavLinkAdapter} to="edit">
                    <FuseSvgIcon size={20}>edit_outlined</FuseSvgIcon>
                    <span className="mx-8">Edit</span>
                  </Button>
                </div>
              </div>
            )}
            <Typography className="my-32 text-3xl font-bold tracking-tight leading-tight">{brand.name}</Typography>
            <div className="flex flex-col space-y-32">
              <div className="flex">
                <FuseSvgIcon>local_phone_outlined</FuseSvgIcon>
                <div className="min-w-0 ml-24 space-y-4">
                  <div className="flex items-center leading-6">
                    <div className="ml-10 font-mono">{brand?.phone || "N/A"}</div>
                  </div>
                </div>
              </div>
              <div className="flex">
                <FuseSvgIcon>email_outlined</FuseSvgIcon>
                <div className="min-w-0 ml-24 space-y-4">
                  <div className="flex items-center leading-6">
                    <div className="ml-10 font-mono">{brand?.email || "N/A"}</div>
                  </div>
                </div>
              </div>
              <div className="flex">
                <FuseSvgIcon>location_on_outlined</FuseSvgIcon>
                <div className="min-w-0 ml-24 space-y-4">
                  <div className="flex items-center leading-6">
                    <div className="ml-10 font-mono">{brand?.address || "N/A"}</div>
                  </div>
                </div>
              </div>
            </div>
            {brand?.story[0] && (
              <>
                <Typography className="mt-32 mb-16 text-2xl font-bold">Story</Typography>
                <ReactMarkdown children={brand?.story[0]} remarkPlugins={[remarkGfm]} />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Brand;