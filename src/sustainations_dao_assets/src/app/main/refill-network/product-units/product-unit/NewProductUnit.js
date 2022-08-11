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
import FormHeader from '../../../../shared-components/FormHeader';
import CategoryForm from '../../categories/category/CategoryForm';
/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  name: yup
    .string()
    .required('You must enter a tag name'),
});

const NewProductUnit = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await user.actor.createRBProductUnit(data.name);
      if ("ok" in result) {
        dispatch(showMessage({ message: 'Success!' }));
        navigate('/refill-network/product-units');
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
      header={<FormHeader actionText="Create Product Unit" backLink="/refill-network/product-units" />}
      content={<CategoryForm
        methods={methods} submitLoading={loading}
        onSubmit={onSubmit} backLink="/refill-network/product-units"
      />}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default NewProductUnit;
