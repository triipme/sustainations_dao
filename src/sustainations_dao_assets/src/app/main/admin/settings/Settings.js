import { useEffect, useState } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from '@lodash';
import { v4 as uuidv4 } from 'uuid';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm, FormProvider } from 'react-hook-form';
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
import { useAsyncMemo } from "use-async-memo";
import ReferralAwards from './ReferralAwards';
import GodUsers from './GodUsers'
/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  treasuryContribution: yup.number().typeError('You must enter a treasury contribution')
    .min(0, 'You must enter a non-negative treasury contribution'),
  referralAwards: yup.array()
    .of(
      yup.object().shape({
        refType: yup
          .string()
          .required('You must select award type'),
        refId: yup
          .string()
          .required('You must select award ID'),
        amount: yup
          .number().typeError('You must enter an award amount')
          .moreThan(0, 'You must enter a positive award amount')
          .required('You must enter an award amount'),
      })
    )
    .min(1, 'You must select award')
    .required('You must select award'),
  referralLimit: yup.number().typeError('You must enter a referral limit')
    .integer('You must enter an integer number')
    .min(0, 'You must enter a non-negative number'),
  godUser: yup.string().typeError('You must enter God user').required('You must enter God user'),
  landSlotPrice: yup.number().typeError('You must enter LandSlot Price')
    .moreThan(0, 'You must enter a positive landSlot Price')
    .required('You must enter LandSlot Price')
});

const Settings = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      treasuryContribution: '',
      referralAwards: [],
      referralLimit: '',
      godUser: '',
      landSlotPrice: '',
    },
    resolver: yupResolver(schema),
  });
  const { control, reset, handleSubmit, formState } = methods;
  const { errors } = formState;

  const usableItems = useAsyncMemo(async () => {
    setLoading(true);
    const res = await user.actor.listUsableItems();
    const result = res.ok.map(item => {
      return {
        id: item[0],
        name: item[1].name
      }
    });
    setLoading(false);
    return result;
  }, [user]);

  const materials = useAsyncMemo(async () => {
    setLoading(true);
    const res = await user.actor.listMaterials();
    const result = res.ok.map(item => {
      return {
        id: item[0],
        name: item[1].name
      }
    });
    setLoading(false);
    return result;
  }, [user]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await user.actor.getSystemParams()

        if ('ok' in result) {
          const awards = result.ok.referralAwards?.map(item => {
            return _.merge(item, { uuid: uuidv4(), deleted: false });
          });
          reset({
            treasuryContribution: parseFloat(result.ok.treasuryContribution),
            referralAwards: awards,
            referralLimit: parseInt(result.ok.referralLimit),
            godUser: result.ok.godUser,
            landSlotPrice: parseFloat(result.ok.landSlotPrice)
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
        parseFloat(data.treasuryContribution),
        data.godUser,
        parseFloat(data.landSlotPrice),
        _.filter(data.referralAwards, ['deleted', false]).map(item => {
          return {
            refType: item.refType,
            refId: item.refId,
            amount: item.amount
          };
        }),
        parseInt(data.referralLimit)
      );

      if ("ok" in result) {
        dispatch(showMessage({ message: 'Success!' }));
      } else {
        throw result?.err;
      }
    } catch (error) {
      console.log(error);
      const message = error && Object.keys(error)[0] ? {
        "NotAuthorized": "Please sign in!.",
        "AdminRoleRequired": "Required admin role.",
        "InvalidData": "Invalid request data."
      }[Object.keys(error)[0]] : 'Error! Please try again later!'
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
            <FormProvider {...methods}>
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
              <Controller
                name="referralLimit"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    error={!!errors.referralLimit}
                    required
                    helperText={errors?.referralLimit?.message}
                    className="mt-8 mb-16"
                    label="Referral Limit"
                    id="referralLimit"
                    type="number"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
              <Controller
                name="godUser"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    error={!!errors.godUser}
                    required
                    helperText={errors?.godUser?.message}
                    className="mt-8 mb-16"
                    label="Engine Quest Admin"
                    id="godUser"
                    type="text"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
              <Controller
                name="landSlotPrice"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    error={!!errors.landSlotPrice}
                    required
                    helperText={errors?.landSlotPrice?.message}
                    className="mt-8 mb-16"
                    label="LandSlot Price (not include transfer fee: 0.0001 ICP)"
                    id="landSlotPrice"
                    type="number"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
              <Typography className="mt-32 mb-16 text-3xl font-bold tracking-tight leading-tight">
                God Users
              </Typography>
              <GodUsers></GodUsers>
              <Typography className="mt-32 mb-16 text-3xl font-bold tracking-tight leading-tight">
                Referral Awards
              </Typography>
              <ReferralAwards usableItems={usableItems} materials={materials} />
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
            </FormProvider>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Settings;