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
import BrandFormHeader from './BrandFormHeader';
import RefillBrandForm from './RefillBrandForm';
/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  name: yup
    .string()
    .required('You must enter a brand name'),
  brandOwner: yup
    .string()
    .required('You must enter a brand owner'),
});

const NewRefillBrand = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      story: '',
      brandOwner: '',
    },
    resolver: yupResolver(schema),
  });
  const { getValues } = methods;

  const handleSubmit = async () => {
    setLoading(true);
    const data = getValues();
    const payload = {
      name: data.name,
      phone: [data.phone],
      email: [data.email],
      address: [data.address],
      story: [data.story],
    }

    try {
      const result = await user.actor.createRefillBrand(payload, data.brandOwner);
      if ("ok" in result) {
        dispatch(showMessage({ message: 'Success!' }));
        navigate('/admin/refill-brands');
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
      header={<BrandFormHeader actionText="Create" />}
      content={<RefillBrandForm methods={methods} submitLoading={loading} handleSubmit={handleSubmit} />}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default NewRefillBrand;
