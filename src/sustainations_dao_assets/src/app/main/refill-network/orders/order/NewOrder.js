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
import OrderForm from './OrderForm';
import _ from 'lodash';
/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  stationId: yup
    .string()
    .required('You must select a station'),
  productIds: yup.array()
    .of(
      yup.object().shape({
        productId: yup
          .string()
          .required('You must select a product'),
        quantity: yup
          .number().typeError('You must enter a product quantity')
          .integer('You must enter an integer product quantity')
          .moreThan(0, 'You must enter a positive product quantity')
          .required('You must enter a product quantity'),
      })
    )
    .min(1, 'You must select product')
    .required('You must select product'),
  status: yup
    .string()
    .required('You must select a status'),
});

const NewOrder = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      stationId: '',
      productIds: [],
      note: '',
      status: 'new',
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await user.actor.createRBOrder(
        data.stationId,
        data.productIds.map(item => {
          let { productId, quantity } = item;
          quantity = parseInt(quantity);
          return [ productId, quantity ];
        }),
        [data.note], {[data.status]: null}
      );
      if ("ok" in result) {
        dispatch(showMessage({ message: 'Success!' }));
        navigate('/refill-network/orders');
      } else {
        throw result?.err;
      }
    } catch (error) {
      console.log(error);
      const message = {
        "NotAuthorized": "Please sign in!.",
        "AdminRoleRequired": 'Required admin role.',
        "StationNotFound": 'Station is not found.',
        "BalanceLow": 'Your wallet is not enough ICP.'
      }[Object.keys(error)[0]] || 'Error! Please try again later!'
      dispatch(showMessage({ message }));
    }
    setLoading(false);
  };

  return (
    <FusePageCarded
      header={<FormHeader actionText="Create Order" backLink="/refill-network/orders" />}
      content={<OrderForm
        methods={methods} submitLoading={loading}
        onSubmit={onSubmit} backLink="/refill-network/orders"
      />}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default NewOrder;
