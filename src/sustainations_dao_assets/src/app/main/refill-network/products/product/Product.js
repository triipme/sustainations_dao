import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { useDeepCompareEffect } from '@fuse/hooks';
import {
  Box,
  Button,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import { motion } from 'framer-motion';
import { useAsyncMemo } from "use-async-memo";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import _ from '@lodash';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { selectUser } from 'app/store/userSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { getS3Object, setS3Object, deleteS3Object } from "../../../../hooks";
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import FormHeader from '../../../../shared-components/FormHeader';
import BasicInfoTab from './tabs/BasicInfoTab';
import PricingTab from './tabs/PricingTab';
import ProductImagesTab from './tabs/ProductImagesTab';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  name: yup
    .string()
    .required('You must enter a product name'),
  sku: yup
    .string()
    .required('You must enter a product sku'),
  categories: yup.array().of(yup.string()).min(1, 'You must select product category')
    .required('You must select product category'),
  unit: yup
    .string()
    .required('You must select a product unit'),
  price: yup.number().typeError('You must enter a product price')
    .moreThan(0, 'You must enter a positive product price'),
  salePrice: yup.number().nullable().typeError('You must enter a sale price')
    .moreThan(0, 'You must enter a positive sale price'),
  currency: yup
    .string()
    .required('You must select a product currency'),
});

function Product() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [actionText, setActionText] = useState('');
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const routeParams = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [noProduct, setNoProduct] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [productUnits, setProductUnits] = useState([]);
  const [images, setImages] = useState([]);

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      categories: [],
      tags: [],
      sku: '',
      images: [],
      price: '',
      salePrice: '',
      currency: '',
      unit: '',
    },
    resolver: yupResolver(schema),
  });
  const { reset, handleSubmit, formState } = methods;
  const { errors } = formState;

  useDeepCompareEffect(() => {
    const loadImages = async (paths) => {
      async function getFile(name) {
        const file = await getS3Object(name);
        return {
          id: name.split("/")[2].split(".")[0],
          file,
          name
        };
      };
      const result = await Promise.all(paths.map(async (item) => await getFile(item)));
      return result;
    }
    const updateProductState = async () => {
      const cRes = await user.actor.listRBCategories(user.brandId);
      setCategories(cRes?.ok?.map(item => item[1].name));
      const tRes = await user.actor.listRBTags(user.brandId);
      setTags(tRes?.ok?.map(item => item[1].name));
      const pRes = await user.actor.listRBProductUnits(user.brandId);
      setProductUnits(pRes?.ok?.map(item => item[1].name));

      const { productId } = routeParams;
      if (productId === 'new') {
        setActionText('Create Product')
      } else {
        setActionText('Edit Product')
        /**
         * Get Product data
         */
        const result = await user.actor.getRBProduct(productId);
        if ('ok' in result) {
          if (result.ok?.images[0]) {
            setImages(await loadImages(result.ok?.images[0]));
          }
          setProduct(result.ok);
        } else {
          setNoProduct(true);
        }
      }
      setLoading(false);
    }

    updateProductState();
  }, [dispatch, routeParams]);

  useEffect(() => {
    if (!product) {
      return;
    }
    /**
     * Reset the form on product state changes
     */

    reset({
      name: product.name,
      description: product?.description[0],
      categories: product.categories,
      tags: product?.tags[0],
      sku: product.sku,
      images,
      price: product.price,
      salePrice: product.salePrice,
      currency: product.currency,
      unit: product.unit,
    });
  }, [product, reset]);

  useEffect(() => {
    return () => {
      /**
       * Reset Product on component unload
       */
      setProduct(null);
      setNoProduct(false);
    };
  }, [dispatch]);

  /**
   * Tab Change
   */
  function handleTabChange(_event, value) {
    setTabValue(value);
  }

  /**
   * Save Product
   */
  const onSubmit = async (data) => {
    setSubmitLoading(true);
    const newImagePaths = data.images.map(image => image.name);
    const payload = {
      brandId: user.brandId,
      name: data.name,
      description: [data.description],
      categories: data.categories,
      tags: [data.tags],
      sku: data.sku,
      images: [newImagePaths],
      price: parseFloat(data.price),
      salePrice: [data.salePrice && parseFloat(data.salePrice)],
      currency: data.currency,
      unit: data.unit,
    };
    try {
      let result;
      if (routeParams.productId === 'new') {
        result = await user.actor.createRBProduct(payload);
      } else {
        result = await user.actor.updateRBProduct(routeParams.productId, payload);
      }
      if ("ok" in result) {
        const oldImagePaths = images.map(image => image.name);
        const needUploadPaths = _.difference(newImagePaths, oldImagePaths);
        const needDeletePaths = _.difference(oldImagePaths, newImagePaths);
        const uploadFiles = _.filter(data.images, item => _.includes(needUploadPaths, item.name));
        const promise = await setS3Object(uploadFiles);
        promise.push(await deleteS3Object(needDeletePaths));
        Promise.all(promise).then(() => {
          dispatch(showMessage({ message: 'Success!' }));
          navigate('/refill-network/products');
        })
      } else {
        throw result?.err;
      }
    } catch (error) {
      console.log(error);
      const message = {
        "NotAuthorized": "Please sign in!.",
        "AdminRoleRequired": 'Required admin role.',
        "Notfound": "Product is not found."
      }[Object.keys(error)[0]] || 'Error! Please try again later!'
      dispatch(showMessage({ message }));
    }
    setSubmitLoading(false);
  };

  /**
   * Show Message if the requested products is not exists
   */
  if (noProduct) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          There is no such product!
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to="/refill-network/products"
          color="inherit"
        >
          Go to Products Page
        </Button>
      </motion.div>
    );
  }

  /**
   * Wait while product data is loading and form is setted
   */
  if (loading) {
    return <FuseLoading />;
  }

  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={<FormHeader actionText={actionText} backLink="/refill-network/products" />}
        content={
          <>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="secondary"
              textColor="secondary"
              variant="scrollable"
              scrollButtons="auto"
              classes={{ root: 'w-full h-64 border-b-1' }}
            >
              <Tab className="h-64" label="Basic Info" iconPosition="start" icon={<ReportProblemOutlinedIcon color="error" className={!((!!errors.name || !!errors.sku || !!errors.categories || !!errors.unit)) && 'hidden'} />} />
              <Tab className="h-64" label="Product Images" iconPosition="start" icon={<ReportProblemOutlinedIcon color="error" className="hidden" />} />
              <Tab className="h-64" label="Pricing" iconPosition="start" icon={<ReportProblemOutlinedIcon color="error" className={!((!!errors.price || !!errors.currency)) && 'hidden'} />} />
            </Tabs>
            <div className="p-16 sm:p-24 max-w-7xl">
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Box sx={{ flex: '1 1 auto' }} />
                <LoadingButton
                  variant="contained" color="primary"
                  loading={submitLoading} onClick={handleSubmit(onSubmit)}
                >Save</LoadingButton>
              </Box>
              <div className={tabValue !== 0 ? 'hidden' : ''}>
                <BasicInfoTab categories={categories} tags={tags} productUnits={productUnits} />
              </div>

              <div className={tabValue !== 1 ? 'hidden' : ''}>
                <ProductImagesTab />
              </div>

              <div className={tabValue !== 2 ? 'hidden' : ''}>
                <PricingTab />
              </div>
            </div>
          </>
        }
        scroll={isMobile ? 'normal' : 'content'}
      />
    </FormProvider>
  );
}

export default Product;
