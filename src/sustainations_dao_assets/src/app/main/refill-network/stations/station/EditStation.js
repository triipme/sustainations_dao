import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { selectUser } from 'app/store/userSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import FusePageCarded from '@fuse/core/FusePageCarded';
import FuseLoading from '@fuse/core/FuseLoading';
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
    .string()
    .required('You must select a station status'),
});

const EditStation = () => {
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const dispatch = useDispatch();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const routeParams = useParams();
  const { stationId } = routeParams;

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      uid: '',
      name: '',
      phone: '',
      address: '',
      activate: 'true',
    },
    resolver: yupResolver(schema),
  });
  const { reset } = methods;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await user.actor.getRBStation(stationId)
        if ('ok' in result) {
          reset({
            uid: result.ok.uid[0],
            name: result.ok.name,
            phone: result.ok.phone,
            address: result.ok.address,
            // latitude: result.ok.latitude[0],
            // longitude: result.ok.longitude[0],
            activate: result.ok.activate.toString(),
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
    const payload = {
      brandId: user.brandId,
      uid: [data.uid],
      name: data.name,
      phone: data.phone,
      address: data.address,
      latitude: [],
      longitude: [],
      activate: data.activate == 'true',
    };
    try {
      const result = await user.actor.updateRBStation(stationId, payload);
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
        "AdminRoleRequired": 'Required admin role.',
        "Notfound": "Station is not found."
      }[Object.keys(error)[0]] || 'Error! Please try again later!'
      dispatch(showMessage({ message }));
    }
    setSubmitLoading(false);
  };

  if (loading) {
    return <FuseLoading />;
  }

  return (
    <FusePageCarded
      header={<StationFormHeader actionText="Edit" />}
      content={<StationForm
        methods={methods} submitLoading={submitLoading}
        onSubmit={onSubmit}
      />}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default EditStation;
