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
import FormHeader from '../../../../shared-components/FormHeader';
import CategoryForm from './CategoryForm';
/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  name: yup
    .string()
    .required('You must enter a category name'),
});

const EditCategory = () => {
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const dispatch = useDispatch();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const routeParams = useParams();
  const { categoryId } = routeParams;

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
    },
    resolver: yupResolver(schema),
  });
  const { reset } = methods;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await user.actor.getRBCategory(categoryId)
        if ('ok' in result) {
          reset({
            name: result.ok.name,
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
      const result = await user.actor.updateRBCategory(categoryId, data.name);
      if ("ok" in result) {
        dispatch(showMessage({ message: 'Success!' }));
        navigate('/refill-network/categories');
      } else {
        throw result?.err;
      }
    } catch (error) {
      console.log(error);
      const message = {
        "NotAuthorized": "Please sign in!.",
        "AdminRoleRequired": 'Required admin role.',
        "Notfound": "Category is not found."
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
      header={<FormHeader actionText="Edit Category" backLink="/refill-network/categories" />}
      content={<CategoryForm
        methods={methods} submitLoading={submitLoading}
        onSubmit={onSubmit} backLink="/refill-network/categories"
      />}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default EditCategory;
