import { useEffect, useState } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from '@lodash';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/system/Box';
import {
  Card,
  CardContent,
  TextField,
  Typography
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from 'app/store/userSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  treasuryContribution: yup.number().typeError('You must enter a treasury contribution')
    .moreThan(0, 'You must enter a positive treasury contribution'),
});

const Settings = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {},
    resolver: yupResolver(schema),
  });
  const { control, reset, handleSubmit, formState } = methods;
  const { errors } = formState;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await user.actor.getSystemParams()
        if ('ok' in result) {
          reset({
            treasuryContribution: parseFloat(result.ok.treasuryContribution),
          });
        } else {
          navigate('/404');
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    })();
  }, [user]);

  const onSubmit = async (data) => {
    setSubmitLoading(true);
    try {
      const result = await user.actor.updateSystemParams(
        parseFloat(data.treasuryContribution)
      );
      if ("ok" in result) {
        dispatch(showMessage({ message: 'Success!' }));
      } else {
        throw result?.err;
      }
    } catch (error) {
      console.log(error);
      const message = {
        "NotAuthorized": "Please sign in!.",
        "AdminRoleRequired": "Required admin role.",
        "InvalidData": "Invalid request data."
      }[Object.keys(error)[0]] || 'Error! Please try again later!'
      dispatch(showMessage({ message }));
    }
    setSubmitLoading(false);
  };

  if (loading) {
    return (<FuseLoading />)
  }

  return (
    <div className="relative flex flex-col flex-auto items-center">
      <div className="w-full max-w-7xl">
        <Card className="w-full py-32 mx-auto mt-24 rounded-2xl shadow">
          <CardContent className="p-24 pt-0 sm:p-48 sm:pt-0">
            <Typography
              variant="h1"
              className="mb-24 text-4xl font-extrabold tracking-tight leading-tight md:leading-none text-center"
            >
              System Settings
            </Typography>
            <Controller
              name="treasuryContribution"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  error={!!errors.treasuryContribution}
                  required
                  helperText={errors?.treasuryContribution?.message}
                  className="mt-8 mb-16"
                  label="Treasury Contribution"
                  id="treasuryContribution"
                  type="number"
                  variant="outlined"
                  autoFocus
                  fullWidth
                />
              )}
            />
            <Box
              className="flex items-center mt-40 py-14 pr-16 pl-4 sm:pr-48 sm:pl-36 border-t"
            >
              <LoadingButton
                className="ml-8"
                variant="contained"
                color="secondary"
                loading={submitLoading}
                onClick={handleSubmit(onSubmit)}
              >
                Update
              </LoadingButton>
            </Box>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Settings;