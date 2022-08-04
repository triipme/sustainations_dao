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

const EditRefillBrand = () => {
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const dispatch = useDispatch();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const routeParams = useParams();
  const { brandId } = routeParams;
  const [brand, setBrand] = useState({});
  const [brandOwner, setBrandOwner] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await user.actor.getRefillBrand(brandId)
        console.log('result', result);
        if ('ok' in result) {
          setBrandOwner(result.ok[0]);
          setBrand(result.ok[1])
        } else {
          navigate('/404');
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    })();
  }, [user]);

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
  const { getValues, reset } = methods;

  useEffect(() => {
    reset(_.merge(brand, { brandOwner }));
  }, [brand, brandOwner]);

  const handleSubmit = async () => {
    setSubmitLoading(true);
    const data = getValues();
    const payload = {
      name: data.name,
      phone: [data.phone],
      email: [data.email],
      address: [data.address],
      story: [data.story],
    }

    try {
      const result = await user.actor.updateRefillBrand(brandId, payload);
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
        "AdminRoleRequired": 'Required admin role.',
        "Notfound": "Brand is not found."
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
      header={<BrandFormHeader actionText="Edit" />}
      content={<RefillBrandForm methods={methods} submitLoading={submitLoading} handleSubmit={handleSubmit} />}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default EditRefillBrand;
