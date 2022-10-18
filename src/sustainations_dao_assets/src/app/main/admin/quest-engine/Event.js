import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from '@lodash';
import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/system/Box';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import LoadingButton from '@mui/lab/LoadingButton';

import {
  Avatar,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  TextField
} from '@mui/material';

const Event = ({ handleAddEventData }) => {
  const { control, watch, handleSubmit, formState } = useForm({
    mode: 'onChange',
    defaultValues: {
      eventDescription: '',
      locationName: '',
    }
  });

  const { errors } = formState;
  return (
    <div>
      <Typography className="mt-32 mb-16 text-3xl font-bold tracking-tight leading-tight">
        Event info
      </Typography>
      <div className="text-lg mt-16 mb-8">
        <span className="text-red-500">*</span>&nbsp;Event Description
      </div>
      <Controller
        name="eventDescription"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Event Description"
            className="mt-8 mb-16"
            error={!!errors.questName}
            required
            helperText={errors?.questName?.message}
            id="eventDescription"
            variant="outlined"
            fullWidth
          />
        )}
      />
      <div className="text-lg mt-16 mb-8">
        <span className="text-red-500">*</span>&nbsp;Event Location Name
      </div>
      <Controller
        name="locationName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Event Location Name"
            className="mt-8 mb-16"
            error={!!errors.questName}
            required
            helperText={errors?.questName?.message}
            id="locationName"
            variant="outlined"
            fullWidth
          />
        )}
      />

      <Box
        className="flex items-center mt-40 py-14 pr-16 pl-4 sm:pr-48 sm:pl-36 border-t"
      > 
        <Button className="ml-auto">
          Delete
        </Button>
        <LoadingButton
          className="ml-8"
          variant="contained"
          color="secondary"
          onClick={handleSubmit(handleAddEventData)}
        >
          Confirm
        </LoadingButton>
      </Box>
    </div>
  )
};

export default Event;