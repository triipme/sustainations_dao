import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from '@lodash';
import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/system/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  TextField
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { v4 as uuidv4 } from 'uuid';

import { useSelector, useDispatch } from "react-redux";
import { selectUser, setUser } from 'app/store/userSlice';
import QRCode from "react-qr-code";
import { setS3Object, deleteS3Object } from "../../hooks";
import { showMessage } from 'app/store/fuse/messageSlice';

const EditProfile = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const { profile } = user;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const currentAvatarPath = profile?.avatar[0];
  const avatarUUID = currentAvatarPath ? currentAvatarPath.split("/")[2].split(".")[0] : uuidv4();

  const { control, watch, formState, getValues } = useForm({
    mode: 'onChange',
    defaultValues: {
      username: profile?.username[0],
      phone: profile?.phone[0],
      avatar: {
        id: avatarUUID,
        base64data: user.avatar,
        path: currentAvatarPath
      },
    }
  });
  const avatar = watch('avatar');
  const { errors } = formState;

  const handleSubmit = async () => {
    setLoading(true);
    const data = getValues();
    try {
      const result = await user.actor.updateUserProfile(
        [data.username], [data.phone], [data.avatar.path || '']
      );
      if ("ok" in result) {
        let avatarChanged;
        if (data.avatar.path) {
          avatarChanged = await setS3Object({
            file: data.avatar.base64data,
            name: data.avatar.path
          });
        } else {
          avatarChanged = await deleteS3Object(currentAvatarPath);
        }
        Promise.resolve(avatarChanged).then(() => {
          const newUserState = {
            role: user.role,
            actor: user.actor,
            depositAddress: user.depositAddress,
            balance: user.balance,
            principal: user.principal,
            brandId: user.brandId,
            profile: result.ok,
            avatar: data.avatar.base64data
          };
          dispatch(setUser(newUserState));
          dispatch(showMessage({ message: 'Success!' }));
          navigate('/profile');
        });
      } else {
        throw result?.err;
      }
    } catch (error) {
      console.log(error);
      const message = {
        "NotAuthorized": "Please sign in!."
      }[Object.keys(error)[0]] || 'Error! Please try again later!'
      dispatch(showMessage({ message }));
    }
    setLoading(false);
  };

  if (!user) {
    return (<FuseLoading />)
  }

  return (
    <div className="relative flex flex-col flex-auto items-center">
      <div className="w-full max-w-7xl">
        <Card className="w-full py-32 mx-auto mt-24 rounded-2xl shadow">
          <CardContent className="p-24 pt-0 sm:p-48 sm:pt-0">
            <div className="flex flex-auto items-end">
              <Controller
                control={control}
                name="avatar"
                render={({ field: { onChange } }) => (
                  <Box
                    sx={{
                      borderWidth: 4,
                      borderStyle: 'solid',
                      borderColor: 'background.paper',
                    }}
                    className="relative flex items-center justify-center w-128 h-128 rounded-full overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <div>
                        <label htmlFor="button-avatar" className="flex p-8 cursor-pointer">
                          <input
                            accept="image/*"
                            className="hidden"
                            id="button-avatar"
                            type="file"
                            onChange={async (e) => {
                              function readFileAsync() {
                                return new Promise((resolve, reject) => {
                                  const file = e.target.files[0];
                                  if (!file) {
                                    return;
                                  }
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    resolve({
                                      id: avatarUUID,
                                      base64data: `data:${file.type};base64,${btoa(reader.result)}`,
                                      path: `${process.env.NODE_ENV}/profile/${avatarUUID}.${file.type.split("/")[1]}`
                                    });
                                  };
                                  reader.onerror = reject;
                                  reader.readAsBinaryString(file);
                                });
                              }
                              const newImage = await readFileAsync();
                              onChange(newImage);
                            }}
                          />
                          <FuseSvgIcon className="text-white">camera_alt_outlined</FuseSvgIcon>
                        </label>
                      </div>
                      <div>
                        <IconButton
                          onClick={() => {
                            onChange('');
                          }}
                        >
                          <FuseSvgIcon className="text-white">delete_outlined</FuseSvgIcon>
                        </IconButton>
                      </div>
                    </div>
                    <Avatar
                      sx={{
                        backgroundColor: 'background.default',
                        color: 'text.secondary',
                      }}
                      className="object-cover w-full h-full text-64 font-bold"
                      src={avatar.base64data}
                      alt={profile?.username[0]}
                    >
                      <QRCode
                        size={120}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        value={user.depositAddress}
                        viewBox={`0 0 120 120`}
                      />
                    </Avatar>
                  </Box>
                )}
              />
            </div>
            <Controller
              control={control}
              name="username"
              render={({ field }) => (
                <TextField
                  className="mt-32"
                  {...field}
                  label="Username"
                  placeholder="Username"
                  id="username"
                  error={!!errors.username}
                  helperText={errors?.username?.message}
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FuseSvgIcon size={20}>account_circle_outlined</FuseSvgIcon>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <TextField
                  className="mt-32"
                  {...field}
                  label="Phone"
                  placeholder="Phone"
                  id="phone"
                  error={!!errors.phone}
                  helperText={errors?.phone?.message}
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FuseSvgIcon size={20}>local_phone_outlined</FuseSvgIcon>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <Box
              className="flex items-center mt-40 py-14 pr-16 pl-4 sm:pr-48 sm:pl-36 border-t"
            >
              <Button className="ml-auto" component={NavLinkAdapter} to={-1}>
                Cancel
              </Button>
              <LoadingButton
                className="ml-8"
                variant="contained"
                color="secondary"
                loading={loading}
                onClick={handleSubmit}
              >
                Save
              </LoadingButton>
            </Box>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default EditProfile;