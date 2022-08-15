import FusePageCarded from '@fuse/core/FusePageCarded';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import { getS3Object } from '../../../../hooks';
import { selectUser } from 'app/store/userSlice';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import OrderDetailsTab from './tabs/OrderDetailsTab';
import InvoiceTab from './tabs/InvoiceTab';
import _ from 'lodash';

function Order() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const theme = useTheme();
  const isMobile = useThemeMediaQuery((_theme) => _theme.breakpoints.down('lg'));

  const routeParams = useParams();
  const { orderId } = routeParams;
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [order, setOrder] = useState();
  const [products, setProducts] = useState([]);
  const [noOrder, setNoOrder] = useState(false);

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
      const oRes = await user.actor.getRBOrder(orderId);
      if ('ok' in oRes) {
        const sRes = await user.actor.getRBStation(oRes.ok.stationId);
        const list = [];
        oRes.ok.products.map(async (op) => {
          const pRes = await user.actor.getRBProduct(op.productId);
          if ('ok' in pRes) {
            const image = await loadImage(pRes.ok?.images?.[0]?.[0]);
            list.push(_.merge(op, {name: pRes.ok.name, image}));
          }
        })
        setOrder(_.merge(oRes.ok, {
          station: sRes?.ok
        }));
        setProducts(list);
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

  function handleTabChange(_event, value) {
    setTabValue(value);
  }

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
      header={
        order && (
          <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-32 px-24 md:px-32">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
            >
              <Typography
                className="flex items-center sm:mb-12"
                component={Link}
                role="button"
                to="/refill-network/orders"
                color="inherit"
              >
                <FuseSvgIcon size={20}>
                  {theme.direction === 'ltr'
                    ? 'arrow_back'
                    : 'arrow_forward'}
                </FuseSvgIcon>
                <span className="mx-4 font-medium">Orders</span>
              </Typography>
            </motion.div>
            <div className="flex flex-col w-full sm:w-auto sm:flex-row space-y-16 sm:space-y-0 flex-1 items-center justify-end space-x-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
              >
                <Button
                  color="primary"
                  variant="contained"
                  to="edit"
                  component={Link}
                  sx={{ mr: 1 }}
                >
                  Update
                </Button>
              </motion.div>
            </div>
          </div>
        )
      }
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
            <Tab className="h-64" label="Order Details" />
            <Tab className="h-64" label="Products" />
          </Tabs>
          <div className="p-16 sm:p-24 max-w-7xl w-full">
            {tabValue === 0 && <OrderDetailsTab order={order} />}
            {tabValue === 1 && <InvoiceTab products={products} note={order?.note?.[0]} />}
          </div>
        </>
      }
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default Order;
