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

const StaffForm = (props) => {
  const { methods, submitLoading, showPrincipal, onSubmit } = props;
  const { control, handleSubmit, formState } = methods;
  const { isValid, errors } = formState;

  return (
    <Card className="w-full py-32 mx-auto rounded-2xl shadow">
      <CardContent>
        <FormProvider {...methods}>
          {showPrincipal && (
            <Controller
              name="principal"
              control={control}
              render={({ field }) => (
                <div className="flex-1 mb-24">
                  <div className="flex items-center mt-16 mb-12">
                    <Typography className="font-semibold text-16 mx-8">
                      <span className="text-red-500">*</span>&nbsp;Staff Principal
                    </Typography>
                  </div>
                  <TextField
                    {...field}
                    label="Staff Principal"
                    className="mt-8 mb-16"
                    error={!!errors.principal}
                    required
                    helperText={errors?.principal?.message}
                    autoFocus
                    id="principal"
                    variant="outlined"
                    fullWidth
                  />
                </div>
              )}
            />
          )}
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <div className="flex-1 mb-24">
                <div className="flex items-center mt-16 mb-12">
                  <Typography className="font-semibold text-16 mx-8">
                    <span className="text-red-500">*</span>&nbsp;Staff name
                  </Typography>
                </div>
                <TextField
                  {...field}
                  label="Staff name"
                  className="mt-8 mb-16"
                  error={!!errors.username}
                  required
                  helperText={errors?.username?.message}
                  id="username"
                  variant="outlined"
                  fullWidth
                />
              </div>
            )}
          />
          <React.Fragment>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                variant="contained"
                to="/refill-network/staffs"
                component={Link}
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <LoadingButton
                variant="contained" color="primary"
                disabled={!isValid}
                loading={submitLoading} onClick={handleSubmit(onSubmit)}
              >Submit</LoadingButton>
            </Box>
          </React.Fragment>
        </FormProvider>
      </CardContent>
    </Card>
  );
}

export default StaffForm;