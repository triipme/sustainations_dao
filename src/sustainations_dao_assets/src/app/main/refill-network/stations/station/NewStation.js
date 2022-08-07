import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { selectUser } from 'app/store/userSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import FusePageCarded from '@fuse/core/FusePageCarded';
import StationFormHeader from './StationFormHeader';
import StationForm from './StationForm';
/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  name: yup
    .string()
    .required('You must enter a station name'),
  phone: yup
    .string()
    .required('You must enter a station phone number'),
  address: yup
    .string()
    .required('You must enter a station address'),
  activate: yup
    .boolean()
    .required('You must select a station status'),
});

const NewStation = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      uid: '',
      name: '',
      phone: '',
      address: '',
      latitude: '',
      longitude: '',
      activate: true,
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const payload = {
      brandId: user.brandId,
      uid: [data.uid],
      name: data.name,
      phone: data.phone,
      address: data.address,
      latitude: [parseFloat(data.latitude)],
      longitude: [parseFloat(data.longitude)],
      activate: data.activate == true,
    };
    try {
      const result = await user.actor.createRBStation(payload);
      if ("ok" in result) {
        dispatch(showMessage({ message: 'Success!' }));
        navigate('/refill-network/stations');
      } else {
        throw result?.err;
      }
    } catch (error) {
      console.log(error);
      const message = {
        "NotAuthorized": "Please sign in!.",
        "AdminRoleRequired": 'Required admin role.'
      }[Object.keys(error)[0]] || 'Error! Please try again later!'
      dispatch(showMessage({ message }));
    }
    setLoading(false);
  };

  return (
    <FusePageCarded
      header={<StationFormHeader actionText="Create" />}
      content={<StationForm
        methods={methods} submitLoading={loading}
        onSubmit={onSubmit}
      />}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default NewStation;
