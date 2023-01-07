import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from '@lodash';
import { Controller, useForm, useFormContext } from 'react-hook-form';
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
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { v4 as uuidv4 } from 'uuid';

import { useSelector, useDispatch } from "react-redux";
import { selectUser, setUser } from 'app/store/userSlice';
import QRCode from "react-qr-code";
import { setS3Object, deleteS3Object } from "../../../hooks";
import { showMessage } from 'app/store/fuse/messageSlice';
import Event from './Event';
import SceneImages from './SceneImages';

const QuestEngine = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const { profile } = user;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const currentAvatarPath = profile?.avatar[0];
  const avatarUUID = currentAvatarPath ? currentAvatarPath.split("/")[2].split(".")[0] : uuidv4();

  const { control, watch, handleSubmit, formState } = useForm({
    mode: 'onChange',
    defaultValues: {
      questName: '',
      price: '',
      description: '',
      backImage: {
        id: '',
        base64data: '',
        path: ''
      },
    }
  });
  const avatar = watch('avatar');
  const backImage = watch('backImage');
  const { errors } = formState;

  const [events, setEvents] = useState([]);
  const [eventDatas, setEventDatas] = useState([{}]);
  const handleAddEventData = (data) => {
    setEventDatas(prevValues => {
      return [...prevValues, data]
    })
  };
  const handleAddEvent = () => {
    setEvents(prevValues => {
      return [...prevValues, <Event handleAddEventData = {handleAddEventData}/>]
    })
  };
  console.log("Data event",eventDatas)

  const onSubmit = async (data) => {
    setLoading(true);
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
            <Typography className="mt-32 mb-16 text-3xl font-bold tracking-tight leading-tight">
              Quest info
            </Typography>
            <div className="text-lg mt-16 mb-8">
              <span className="text-red-500">*</span>&nbsp;Quest Name
            </div>
            <Controller
              name="questName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Quest Name"
                  className="mt-8 mb-16"
                  error={!!errors.questName}
                  required
                  helperText={errors?.questName?.message}
                  autoFocus
                  id="questName"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
            <div className="text-lg mt-16 mb-8">
              <span className="text-red-500">*</span>&nbsp;Price
            </div>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Price"
                  className="mt-8 mb-16"
                  error={!!errors.price}
                  required
                  helperText={errors?.price?.message}
                  id="price"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
            <div className="text-lg mt-16 mb-8">
              <span className="text-red-500">*</span>&nbsp;Description
            </div>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  className="mt-8 mb-16"
                  error={!!errors.description}
                  required
                  helperText={errors?.description?.message}
                  id="description"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
            <div className="text-lg mt-16 mb-8">
              <span className="text-red-500">*</span>&nbsp;Scene Images
            </div>
            <div className="flex">
              <SceneImages control={control} imageType={"Front"} image={backImage}/>
              <SceneImages control={control} imageType={"Mid"} image={backImage}/>
              <SceneImages control={control} imageType={"Back"} image={backImage}/>
              <SceneImages control={control} imageType={"Obstacle"} image={backImage}/>
            </div>
            {events}
            <Button
              className="ml-auto" 
              variant="contained"
              color="success"
              onClick={() => {handleAddEvent()}}>
              + Event
            </Button>
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
                onClick={handleSubmit(onSubmit)}
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

export default QuestEngine;