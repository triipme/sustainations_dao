import _ from 'lodash';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import {
  Button,
  Box,
  Card,
  CardContent,
  MenuItem,
  Select
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { FormProvider } from 'react-hook-form';
import { Controller } from 'react-hook-form';

const StationForm = (props) => {
  const { methods, submitLoading, onSubmit } = props;
  const { control, handleSubmit, formState } = methods;
  const { errors } = formState;

  return (
    <Card className="w-full py-32 mx-auto rounded-2xl shadow">
      <CardContent>
        <FormProvider {...methods}>
          <Controller
            name="uid"
            control={control}
            render={({ field }) => (
              <div className="flex-1 mb-24">
                <div className="flex items-center mt-16 mb-12">
                  <Typography className="font-semibold text-16 mx-8">
                    Station Owner Principal
                  </Typography>
                </div>
                <TextField
                  {...field}
                  label="Station Owner Principal"
                  className="mt-8 mb-16"
                  error={!!errors.uid}
                  helperText={errors?.uid?.message}
                  id="uid"
                  variant="outlined"
                  fullWidth
                />
              </div>
            )}
          />
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <div className="flex-1 mb-24">
                <div className="flex items-center mt-16 mb-12">
                  <Typography className="font-semibold text-16 mx-8">
                    <span className="text-red-500">*</span>&nbsp;Station name
                  </Typography>
                </div>
                <TextField
                  {...field}
                  label="Station name"
                  className="mt-8 mb-16"
                  error={!!errors.name}
                  required
                  helperText={errors?.name?.message}
                  id="name"
                  variant="outlined"
                  fullWidth
                />
              </div>
            )}
          />
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <div className="flex-1 mb-24">
                <div className="flex items-center mt-16 mb-12">
                  <Typography className="font-semibold text-16 mx-8">
                    <span className="text-red-500">*</span>&nbsp;Station phone number
                  </Typography>
                </div>
                <TextField
                  {...field}
                  label="Station phone number"
                  className="mt-8 mb-16"
                  error={!!errors.phone}
                  required
                  helperText={errors?.phone?.message}
                  id="phone"
                  variant="outlined"
                  fullWidth
                />
              </div>
            )}
          />
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <div className="flex-1 mb-24">
                <div className="flex items-center mt-16 mb-12">
                  <Typography className="font-semibold text-16 mx-8">
                    <span className="text-red-500">*</span>&nbsp;Station address
                  </Typography>
                </div>
                <TextField
                  {...field}
                  label="Station address"
                  className="mt-8 mb-16"
                  error={!!errors.address}
                  required
                  helperText={errors?.address?.message}
                  id="address"
                  variant="outlined"
                  fullWidth
                />
              </div>
            )}
          />
          <Controller
            name="activate"
            control={control}
            render={({ field }) => (
              <div className="flex-1 mb-24">
                <div className="flex items-center mt-16 mb-12">
                  <Typography className="font-semibold text-16 mx-8">Status</Typography>
                </div>
                <Select
                  {...field}
                  required
                  variant="outlined"
                >
                  <MenuItem value="true">Active</MenuItem>
                  <MenuItem value="false">Inactive</MenuItem>
                </Select>
              </div>
            )}
          />
          <React.Fragment>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                variant="contained"
                to="/refill-network/stations"
                component={Link}
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <LoadingButton
                variant="contained" color="primary"
                loading={submitLoading} onClick={handleSubmit(onSubmit)}
              >Submit</LoadingButton>
            </Box>
          </React.Fragment>
        </FormProvider>
      </CardContent>
    </Card>
  );
}

export default StationForm;