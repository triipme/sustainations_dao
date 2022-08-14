import _ from 'lodash';
import { useState, useLayoutEffect } from "react";
import { useSelector } from 'react-redux';
import { useAsyncMemo } from "use-async-memo";
import { selectUser } from 'app/store/userSlice';
import FuseLoading from '@fuse/core/FuseLoading';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import FusePageCarded from '@fuse/core/FusePageCarded';
import ContentsHeader from '../../../shared-components/ContentsHeader';
import OrdersTable from './OrdersTable';

const Orders = () => {
  const user = useSelector(selectUser);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const orders = useAsyncMemo(async () => {
    setLoading(true);
    let result = [];
    const oRes = await user.actor.listRBOrders();
    if ('ok' in oRes) {
      const sRes = await user.actor.listRBStations(user.brandId);
      result = oRes.ok.map(order => {
        const station = _.find(sRes.ok, item => item[0] == order[1].stationId);
        return {
          orderId: order[0],
          stationName: station[1]?.name,
          totalAmount: order[1].totalAmount,
          status: _.capitalize(_.keys(order[1].history[0].status)[0]),
          timestamp: order[1].history[0].timestamp
        }
      });
    }
    setLoading(false);
    return result;
  }, [user]);

  useLayoutEffect(() => {
    function getFilteredArray() {
      if (searchText.length === 0) {
        return orders;
      }
      return _.filter(orders, (item) => {
        return item[1].stationName.toLowerCase().includes(searchText.toLowerCase());
      });
    }

    if (orders) {
      setFilteredData(getFilteredArray());
    }
  }, [orders, searchText]);

  function handleSearchText(event) {
    setSearchText(event.target.value);
  }

  if (loading) {
    return <FuseLoading />;
  }

  return (
    <FusePageCarded
      header={
        <ContentsHeader
          handleSearchText={handleSearchText}
          searchPlaceholder="Search orders" title="Orders"
          addLink="/refill-network/orders/new" addLinkText="Create Order"
        />
      }
      content={<OrdersTable data={filteredData} />}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default Orders;
