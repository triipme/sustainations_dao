import { Link } from 'react-router-dom';
import {
  IconButton,
  Button,
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Grid,
} from '@mui/material';
import _ from 'lodash';
import LoadingButton from '@mui/lab/LoadingButton';
import FuseLoading from '@fuse/core/FuseLoading';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/userSlice';
import { useAsyncMemo } from "use-async-memo";
import { Controller, FormProvider } from 'react-hook-form';
import { motion } from 'framer-motion';
import { getS3Object } from "../../../../hooks";
import Products from './Products';

const orderStatus = [
  'new',
  'pending',
  'delivering',
  'delivered',
  'canceled',
  'rejected',
];

const OrderForm = (props) => {
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [stations, setStations] = useState([]);
  const { methods, submitLoading, onSubmit, backLink } = props;
  const { control, handleSubmit, formState, setValue, watch } = methods;
  const { errors } = formState;

  let productIds = watch('productIds');
  const onSelectProduct = (productId) => {
    if (_.findIndex(productIds, item => item.productId == productId) == -1) {
      setValue('productIds', _.union(productIds, [{
        productId: productId,
        quantity: 1
      }]), { shouldValidate: true });
    } else {
      _.remove(productIds, item => item.productId == productId);
      setValue('productIds', productIds);
    }
  }

  const products = useAsyncMemo(async () => {
    setLoading(true);
    const res = await user.actor.listRBProducts(user.brandId);
    const loadImage = async (path) => {
      let file;
      if (_.isString(path)) {
        file = await getS3Object(path);
      }
      return file;
    }
    const result = await Promise.all(res.ok.map(async product => {
      const image = await loadImage(product[1].images[0][0]);
      return {
        id: product[0],
        image,
        name: product[1].name,
        categories: product[1].categories,
        price: product[1].price,
        currency: product[1].currency
      }
    }));
    setLoading(false);
    return result;
  }, [user]);

  useLayoutEffect(() => {
    async function loadData() {
      setLoading(true);
      const cRes = await user.actor.listRBCategories(user.brandId);
      setCategories(cRes.ok.map(cat => cat[1].name));
      const sRes = await user.actor.listRBStations(user.brandId);
      setStations(sRes.ok.map(item => {
        return { id: item[0], name: item[1].name };
      }))
      setLoading(false);
    }
    loadData();
  }, [user]);

  if (loading) {
    return <FuseLoading />;
  }

  return (
    <Card className="w-full pb-32 mx-auto rounded-2xl shadow">
      <CardContent>
        <Card className="w-full pb-16 mx-auto rounded-2xl shadow">
          <CardContent>
            <Products
              products={products} categories={categories} error={!!errors?.productIds}
              selectedProductIds={productIds} onSelectProduct={onSelectProduct}
            />
            {errors?.productIds?.message && (<FormHelperText error>{errors?.productIds?.message}</FormHelperText>)}
          </CardContent>
        </Card>
        <FormProvider {...methods}>
          <Card className="w-full py-16 mt-24 mx-auto rounded-2xl shadow">
            <CardContent>
              <Typography className="mb-16 text-2xl font-bold tracking-tight leading-tight">
                Selected Products
              </Typography>
              {_.isEmpty(productIds) ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.1 } }}
                  className="flex flex-1 items-center justify-center h-full"
                >
                  <Typography color="text.secondary" variant="h6">
                    No selected products.
                  </Typography>
                </motion.div>
              ) : (
                <div className="flex flex-col flex-auto items-center sm:justify-center min-w-0">
                  <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
                    <TableBody>
                      {productIds.map((selected, index) => {
                        const selectedProduct = _.find(products, product => product.id == selected.productId);
                        return (
                          <TableRow key={selectedProduct.id} className="h-72">
                            <TableCell
                              className="w-40 md:w-64 text-center"
                              component="th"
                              scope="row"
                              padding="none"
                            >
                              #{index + 1}
                            </TableCell>
                            <TableCell
                              className="w-64 px-4 md:px-0"
                              component="th"
                              scope="row"
                              padding="none">
                              {selectedProduct?.image && (
                                <img
                                  className="w-full block rounded"
                                  src={selectedProduct?.image}
                                  alt={selectedProduct.name}
                                />
                              )}
                            </TableCell>
                            <TableCell className="p-4 md:p-16" component="th" scope="row">
                              {selectedProduct.name}
                            </TableCell>
                            <TableCell className="p-4 md:p-16 max-w-xs" component="th" scope="row">
                              <Controller
                                name={`productIds[${index}][quantity]`}
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    error={!!errors.productIds?.[index]?.quantity}
                                    required
                                    helperText={errors?.productIds?.[index]?.quantity?.message}
                                    className="mt-8 mb-16"
                                    label="Quantity"
                                    type="number"
                                    variant="outlined"
                                    fullWidth
                                  />
                                )}
                              />
                            </TableCell>
                            <TableCell className="p-4 md:p-16" component="th" scope="row" align="right">
                              <IconButton
                                aria-label="delete" color="warning"
                                onClick={() => onSelectProduct(selectedProduct.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        )})
                      }
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="w-full py-32 mt-24 mx-auto rounded-2xl shadow">
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Controller
                    name="stationId"
                    control={control}
                    defaultValue={stations[0]?.id}
                    render={({ field }) => (
                      <FormControl required className="mt-8 mb-16 min-w-full">
                        <InputLabel id="stationId-label">Station</InputLabel>
                        <Select
                          {...field}
                          error={!!errors.stationId}
                          required
                          labelId="stationId-label"
                          id="stationId"
                          label="Station *"
                          variant="outlined"
                        >
                          {stations?.map((item) => (
                            <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                          ))}
                        </Select>
                        {errors?.stationId?.message && (<FormHelperText error>{errors?.stationId?.message}</FormHelperText>)}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
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
                </Grid>
              </Grid>
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
            </CardContent>
          </Card>
          <React.Fragment>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                variant="contained"
                to={backLink}
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
        </FormProvider>
      </CardContent>
    </Card>
  );
}

export default OrderForm;