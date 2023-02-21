import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  TextField,
  Stack,
  FormControl,
  FormHelperText,
  Select,
  MenuItem,
  Typography,
  Box,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setUser } from 'app/store/userSlice';
import * as yup from 'yup';
import { useEffect, useState } from 'react';

const defaultValues = {
  chain: '',
  address: '',
}

const schema = yup.object().shape({
  address: yup.string().required('You must enter a value'),
  chain: yup.string().required('You must enter a value'),
})

const options = new Set(["BTC"])

const EditWallets = ()=>{
  const {control, handleSubmit, formState:{errors}, setError} = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  });
  const [wallets, setWallets] = useState([])
  const dispatch = useDispatch();
  const user = useSelector(state=>state.user)
  const onSubmit = async (data)=>{
    try {
      const response_update = await user.actor.updateUserWallet({...data,chain:{[`${data.chain}`]:null}});
      if (response_update.ok) {
        dispatch(setUser({...user, profiles: response_update.ok}));
      } else {
        throw response_update.err
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(()=>{
    (async()=>{
      try {
        const response_wallets = await user.actor.getBalanceWallet(user.profile.wallets?.flat(1));
        if (response_wallets.ok) {
          setWallets(response_wallets.ok);
          response_wallets.ok?.forEach(({chain})=>{
            options.delete(Object.keys(chain)[0])
          })
        } else {
          throw response_wallets.err
        }
      } catch (error) {
        console.log(error);
      }
    })()
  },[user.profile.wallets])
  return (
    <>
      {wallets?.map(w=>(
        <Stack key={w.address} direction="row" alignItems="center" columnGap={3}>
          <Typography>{parseInt(w.balance)}</Typography>
          <Typography>{Object.keys(w.chain)[0]}</Typography>
          <Typography>{w.address}</Typography>
          <Button variant="contained">Edit</Button>
        </Stack>
      ))}
      <Stack direction="row" alignItems="center" columnGap={2}>
        <Box>
          <Controller 
            control={control}
            name="address"
            render={({field, formState:{errors}})=>(
              <TextField error={!!errors.address} {...field}/>
            )}
          />
          {!!errors.address && (
            <Typography className="px-4 py-8 font-medium text-14" color="error">
              {errors?.address?.message}
            </Typography>
          )}
        </Box>
        <Controller
          control={control}
          name="chain"
          render={({ field }) => (
            <FormControl error={!!errors.chain} required>
              <Select {...field} variant="outlined" fullWidth>
                {Array.from(options).map(o=> <MenuItem key={o} value="BTC">{o}</MenuItem>)}
              </Select>
              {!!errors.chain && (
                <Typography className="px-4 py-8 font-medium text-14" color="error">
                  {errors?.chain?.message}
                </Typography>
              )}
            </FormControl>
          )}
        />
        <Button variant="contained" size="medium" onClick={handleSubmit(onSubmit)}>
          Add Wallet
        </Button>
      </Stack>
    </>
  )
}

export default EditWallets;
