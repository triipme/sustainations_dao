import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { selectUser } from 'app/store/userSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useForm } from 'react-hook-form';
import { useNavigate, Navigate } from 'react-router-dom';
import FuseUtils from '@fuse/utils';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import FusePageCarded from '@fuse/core/FusePageCarded';
import FuseLoading from '@fuse/core/FuseLoading';
import RefillBrandForm from '../../admin/refill-brands/brand/RefillBrandForm';
import { authRoles } from "../../../auth";
/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  name: yup
    .string()
    .required('You must enter a brand name'),
});

const EditBrand = () => {
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const dispatch = useDispatch();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const { brandId } = user;

  if (!FuseUtils.hasPermission(authRoles.refillBrandOwner, user.role)) {
    dispatch(showMessage({ message: 'Required owner role.' }));
    return (<Navigate to="/refill-network/brand" />);
  }

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      story: '',
    },
    resolver: yupResolver(schema),
  });
  const { reset } = methods;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await user.actor.getRefillBrand(brandId)
        if ('ok' in result) {
          const brand = result.ok[2];
          reset({
            name: brand.name,
            phone: brand.phone[0],
            email: brand.email[0],
            address: brand.address[0],
            story: brand.story[0]
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
      name: data.name,
      phone: [data.phone],
      email: [data.email],
      address: [data.address],
      story: [data.story],
    }

    try {
      const result = await user.actor.updateRefillBrand(brandId, payload, [], []);
      if ("ok" in result) {
        dispatch(showMessage({ message: 'Success!' }));
        navigate('/refill-network/brand');
      } else {
        throw result?.err;
      }
    } catch (error) {
      console.log(error);
      const message = {
        "NotAuthorized": "Please sign in!.",
        "AdminRoleRequired": 'Required owner role.',
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
      content={<RefillBrandForm
        methods={methods} submitLoading={submitLoading}
        onSubmit={onSubmit}
        showOwner={false}
        cancelLink="/refill-network/brand"
      />}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default EditBrand;
