import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { selectUser } from 'app/store/userSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useForm } from 'react-hook-form';
import { useNavigate, Navigate } from 'react-router-dom';
import { authRoles } from "../../../../auth";
import FuseUtils from '@fuse/utils';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import FusePageCarded from '@fuse/core/FusePageCarded';
import FormHeader from '../../../../shared-components/FormHeader';
import StaffForm from './StaffForm';
/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  username: yup
    .string()
    .required('You must enter a staff name'),
  principal: yup
    .string()
    .required('You must enter a staff principal'),
});

const NewStaff = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  if (!FuseUtils.hasPermission(authRoles.refillBrandOwner, user.role)) {
    dispatch(showMessage({ message: 'Required owner role.' }));
    return (<Navigate to="/refill-network/brand" />);
  }

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      username: '',
      principal: '',
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await user.actor.setRBManager(data.principal, data.username);
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
        "OwnerRoleRequired": 'Required admin role.',
        "AlreadyExisting": 'This staff has been added to a brand.'
      }[Object.keys(error)[0]] || 'Error! Please try again later!'
      dispatch(showMessage({ message }));
    }
    setLoading(false);
  };

  return (
    <FusePageCarded
      header={<FormHeader actionText="Add Staff" backLink="/refill-network/staffs" />}
      content={<StaffForm
        methods={methods} submitLoading={loading}
        onSubmit={onSubmit} showPrincipal={true}
      />}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default NewStaff;
