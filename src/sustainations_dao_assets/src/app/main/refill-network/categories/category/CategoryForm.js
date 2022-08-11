import { Link } from 'react-router-dom';
import {
  Button,
  Box,
  Card,
  CardContent,
  TextField,
  Typography
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { FormProvider } from 'react-hook-form';
import { Controller } from 'react-hook-form';

const CategoryForm = (props) => {
  const { methods, submitLoading, onSubmit, backLink } = props;
  const { control, handleSubmit, formState } = methods;
  const { errors } = formState;

  return (
    <Card className="w-full py-32 mx-auto rounded-2xl shadow">
      <CardContent>
        <FormProvider {...methods}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <div className="flex-1 mb-24">
                <div className="flex items-center mt-16 mb-12">
                  <Typography className="font-semibold text-16 mx-8">
                    <span className="text-red-500">*</span>&nbsp;Item name
                  </Typography>
                </div>
                <TextField
                  {...field}
                  label="Item name"
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
          <React.Fragment>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                variant="contained"
                to={backLink}
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

export default CategoryForm;