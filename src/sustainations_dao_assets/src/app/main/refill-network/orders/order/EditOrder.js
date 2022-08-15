import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { selectUser } from 'app/store/userSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import {
  Button,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { getS3Object } from '../../../../hooks';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import FusePageCarded from '@fuse/core/FusePageCarded';
import FuseLoading from '@fuse/core/FuseLoading';
import LoadingButton from '@mui/lab/LoadingButton';
import FormHeader from '../../../../shared-components/FormHeader';
import _ from 'lodash';
/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  status: yup
    .string()
    .required('You must select a status'),
});

const orderStatus = [
  'new',
  'pending',
  'delivering',
  'delivered',
  'canceled',
  'rejected',
];

const EditOrder = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const routeParams = useParams();
  const { orderId } = routeParams;
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [noOrder, setNoOrder] = useState(false);
  const [station, setStation] = useState();
  const [products, setProducts] = useState([]);

  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 2,
  });

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      note: '',
      status: 'new',
    },
    resolver: yupResolver(schema),
  });

  const { control, handleSubmit, reset, formState } = methods;
  const { errors } = formState;

  useDeepCompareEffect(() => {
    const loadImage = async (path) => {
      if (_.isEmpty(path)) {
        return;
      }
      const file = await getS3Object(path);
      return file;
    }
    const loadData = async () => {
      setLoading(true);
      const result = await user.actor.getRBOrder(orderId);
      if ('ok' in result) {
        const sRes = await user.actor.getRBStation(result.ok.stationId);
        const list = await Promise.all(result.ok.products.map(async (op) => {
          const pRes = await user.actor.getRBProduct(op.productId);
          if ('ok' in pRes) {
            const image = await loadImage(pRes.ok?.images?.[0]?.[0]);
            return _.merge(op, {name: pRes.ok.name, image});
          }
        }));
        setProducts(list);
        setStation(sRes.ok);
        reset({
          note: result.ok.note?.[0],
          status: _.keys(_.last(result.ok.history).status)[0]
        });
      } else {
        setNoOrder(true);
      }
      setLoading(false);
    }
    loadData();
  }, [dispatch, routeParams]);

  useEffect(() => {
    return () => {
      setNoOrder(false);
    };
  }, [dispatch]);

  const onSubmit = async (data) => {
    setSubmitLoading(true);
    try {
      const result = await user.actor.updateRBOrder(
        orderId, [data.note], {[data.status]: null}
      );
      if ("ok" in result) {
        dispatch(showMessage({ message: 'Success!' }));
        navigate(`/refill-network/orders/${orderId}`);
      } else {
        throw result?.err;
      }
    } catch (error) {
      console.log(error);
      const message = {
        "NotAuthorized": "Please sign in!.",
        "AdminRoleRequired": 'Required admin role.',
        "NotFound": 'Order is not found.'
      }[Object.keys(error)[0]] || 'Error! Please try again later!'
      dispatch(showMessage({ message }));
    }
    setSubmitLoading(false);
  };

  if (noOrder) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          There is no such order!
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to="/refill-network/orders"
          color="inherit"
        >
          Go to Orders Page
        </Button>
      </motion.div>
    );
  }

  if (loading) {
    return <FuseLoading />;
  }

  return (
    <FusePageCarded
      header={<FormHeader actionText="Update Order" backLink="/refill-network/orders" />}
      content={
        <FormProvider {...methods}>
          <div className="w-full p-32 mt-24 mx-auto">
            {products && (
              <div className='mb-16'>
                <Table className="simple">
                  <TableHead>
                    <TableRow>
                      <TableCell className="w-20">#</TableCell>
                      <TableCell>PRODUCT</TableCell>
                      <TableCell>PRICE</TableCell>
                      <TableCell align="right">QUANTITY</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product, index) => {
                      const quantity = parseInt(product.quantity);
                      return (
                        <TableRow key={product.productId}>
                          <TableCell className="w-20">{index + 1}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <img className="w-80" src={product.image} alt="product" />
                              <Typography variant="subtitle1" className='mx-8'>{product.name}</Typography>
                            </div>
                          </TableCell>
                          <TableCell align="right">{formatter.format(product.price)}</TableCell>
                          <TableCell align="right">{quantity}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
            {station && (
              <Typography className="mb-24 py-16 print:mb-12" variant="body1">
                Station: {station.name} - {station.phone} - {station.address}
              </Typography>
            )}
            <Controller
              name="status"
              control={control}
              defaultValue={'new'}
              render={({ field }) => (
                <FormControl required className="mt-8 mb-16 min-w-full">
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    {...field}
                    error={!!errors.status}
                    required
                    labelId="status-label"
                    id="status"
                    label="Status *"
                    variant="outlined"
                  >
                    {orderStatus?.map((item) => (
                      <MenuItem key={item} value={item}>{_.capitalize(item)}</MenuItem>
                    ))}
                  </Select>
                  {errors?.status?.message && (<FormHelperText error>{errors?.status?.message}</FormHelperText>)}
                </FormControl>
              )}
            />
            <Controller
              name="note"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mt-8 mb-16"
                  id="note"
                  label="Note"
                  type="text"
                  multiline
                  rows={10}
                  variant="outlined"
                  fullWidth
                />
              )}
            />
            <React.Fragment>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                  color="inherit"
                  variant="contained"
                  to="/refill-network/orders"
                  component={Link}
                  sx={{ mr: 1 }}
                >
                  Cancel
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                <LoadingButton
                  variant="contained" color="primary"
                  loading={submitLoading} onClick={handleSubmit(onSubmit)}
                >Submit</LoadingButton>
              </Box>
            </React.Fragment>
          </div>
        </FormProvider>
      }
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default EditOrder;
