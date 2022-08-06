import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { selectUser } from 'app/store/userSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useForm } from 'react-hook-form';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import { authRoles } from "../../../../auth";
import FuseUtils from '@fuse/utils';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import FusePageCarded from '@fuse/core/FusePageCarded';
import FuseLoading from '@fuse/core/FuseLoading';
import StaffFormHeader from './StaffFormHeader';
import StaffForm from './StaffForm';
/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  username: yup
    .string()
    .required('You must enter a staff name'),
});

const EditStaff = () => {
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const dispatch = useDispatch();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const routeParams = useParams();
  const { staffPrincipal } = routeParams;

  if (!FuseUtils.hasPermission(authRoles.refillBrandOwner, user.role)) {
    dispatch(showMessage({ message: 'Required owner role.' }));
    return (<Navigate to="/refill-network/brand" />);
  }

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      username: ''
    },
    resolver: yupResolver(schema),
  });
  const { reset } = methods;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await user.actor.getRBManager(staffPrincipal)
        if ('ok' in result) {
          reset({
            username:result.ok.username
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

  const handleSubmit = async (data) => {
    setSubmitLoading(true);
    try {
      const result = await user.actor.updateRBManager(staffPrincipal, data.username);
      if ("ok" in result) {
        dispatch(showMessage({ message: 'Success!' }));
        navigate('/refill-network/staffs');
      } else {
        throw result?.err;
      }
    } catch (error) {
      console.log(error);
      const message = {
        "NotAuthorized": "Please sign in!.",
        "OwnerRoleRequired": 'Required owner role.',
        "Notfound": "Staff is not found."
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
      header={<StaffFormHeader actionText="Edit" />}
      content={<StaffForm
        methods={methods} submitLoading={submitLoading}
        handleSubmit={handleSubmit} showPrincipal={false}
      />}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default EditStaff;
