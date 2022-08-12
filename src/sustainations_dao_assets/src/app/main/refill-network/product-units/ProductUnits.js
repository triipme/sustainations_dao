import _ from 'lodash';
import { useState, useLayoutEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useAsyncMemo } from "use-async-memo";
import { selectUser } from 'app/store/userSlice';
import { showMessage } from "app/store/fuse/messageSlice";
import FuseLoading from '@fuse/core/FuseLoading';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import FusePageCarded from '@fuse/core/FusePageCarded';
import ContentsHeader from '../../../shared-components/ContentsHeader';
import CategoriesTable from '../categories/CategoriesTable';

const ProductUnits = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const productUnits = useAsyncMemo(async () => {
    setLoading(true);
    const result = await user.actor.listRBProductUnits(user.brandId);
    setLoading(false);
    return result.ok;
  }, [user]);

  useLayoutEffect(() => {
    function getFilteredArray() {
      if (searchText.length === 0) {
        return productUnits;
      }
      return _.filter(productUnits, (item) => {
        return item[1].name.toLowerCase().includes(searchText.toLowerCase());
      });
    }

    if (productUnits) {
      setFilteredData(getFilteredArray());
    }
  }, [productUnits, searchText]);

  function handleSearchText(event) {
    setSearchText(event.target.value);
  }

  const handleDelete = async (selectedId) => {
    setModalLoading(true);
    try {
      const result = await user.actor.deleteRBProductUnit(selectedId);
      if ("ok" in result) {
        dispatch(showMessage({ message: 'Success!' }));
        _.remove(productUnits, item => item[0] == selectedId);
      } else {
        throw result?.err;
      }
    } catch (error) {
      console.log(error);
      const message = {
        "NotAuthorized": "Please sign in!.",
        "Notfound": "Product unit is not found.",
        "AdminRoleRequired": 'Required admin role.'
      }[Object.keys(error)[0]] || 'Error! Please try again later!'
      dispatch(showMessage({ message }));
    }
    setModalLoading(false);
  }

  if (loading) {
    return <FuseLoading />;
  }

  return (
    <FusePageCarded
      header={
        <ContentsHeader
          handleSearchText={handleSearchText}
          searchPlaceholder="Search product units" title="Product units"
          addLink="/refill-network/product-units/new" addLinkText="Create Product Unit"
        />
      }
      content={
        <CategoriesTable
          modalLoading={modalLoading} data={filteredData}
          handleDelete={handleDelete} editPathLink="/refill-network/product-units/:itemId/edit"
        />
      }
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default ProductUnits;
