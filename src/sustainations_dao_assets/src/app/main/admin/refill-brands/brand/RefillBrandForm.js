import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import {
  Button,
  Box,
  Card,
  CardContent
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { FormProvider } from 'react-hook-form';
import { Controller } from 'react-hook-form';

const RefillBrandForm = (props) => {
  const { methods, submitLoading, handleSubmit } = props;
  const { control, formState } = methods;
  const { errors } = formState;

  return (
    <Card className="w-full py-32 mx-auto rounded-2xl shadow">
      <CardContent>
        <FormProvider {...methods}>
          <Controller
            name="brandOwner"
            control={control}
            render={({ field }) => (
              <div className="flex-1 mb-24">
                <div className="flex items-center mt-16 mb-12">
                  <Typography className="font-semibold text-16 mx-8">
                    <span className="text-red-500">*</span>&nbsp;Brand Owner
                  </Typography>
                </div>
                <TextField
                  {...field}
                  label="Brand Owner"
                  className="mt-8 mb-16"
                  error={!!errors.brandOwner}
                  required
                  helperText={errors?.brandOwner?.message}
                  autoFocus
                  id="brandOwner"
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
                    <span className="text-red-500">*</span>&nbsp;Brand name
                  </Typography>
                </div>
                <TextField
                  {...field}
                  label="Brand name"
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
                  <Typography className="font-semibold text-16 mx-8">Phone</Typography>
                </div>
                <TextField
                  {...field}
                  label="Phone"
                  className="mt-8 mb-16"
                  id="phone"
                  variant="outlined"
                  fullWidth
                />
              </div>
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <div className="flex-1 mb-24">
                <div className="flex items-center mt-16 mb-12">
                  <Typography className="font-semibold text-16 mx-8">Email</Typography>
                </div>
                <TextField
                  {...field}
                  label="Email"
                  className="mt-8 mb-16"
                  id="email"
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
                  <Typography className="font-semibold text-16 mx-8">Address</Typography>
                </div>
                <TextField
                  {...field}
                  label="Address"
                  className="mt-8 mb-16"
                  id="address"
                  variant="outlined"
                  fullWidth
                />
              </div>
            )}
          />
          <Controller
            name="story"
            control={control}
            render={({ field }) => (
              <div className="flex-1 mb-24">
                <div className="flex items-center mt-16 mb-12">
                  <Typography className="font-semibold text-16 mx-8">Story</Typography>
                </div>
                <TextField
                  {...field}
                  className="mt-8 mb-16"
                  id="story"
                  label="Story"
                  type="text"
                  multiline
                  rows={20}
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>
            )}
          />
          <React.Fragment>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                variant="contained"
                to={'/admin/refill-brands'}
                component={Link}
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <LoadingButton variant="contained" color="primary" loading={submitLoading} onClick={handleSubmit}>Submit</LoadingButton>
            </Box>
          </React.Fragment>
        </FormProvider>
      </CardContent>
    </Card>
  );
}

export default RefillBrandForm;