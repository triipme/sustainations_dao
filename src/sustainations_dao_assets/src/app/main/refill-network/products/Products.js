import _ from 'lodash';
import { useState, useEffect, useLayoutEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useAsyncMemo } from "use-async-memo";
import { selectUser } from 'app/store/userSlice';
import { getS3Object } from "../../../hooks";
import { showMessage } from "app/store/fuse/messageSlice";
import FuseLoading from '@fuse/core/FuseLoading';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import FusePageCarded from '@fuse/core/FusePageCarded';
import ProductsHeader from './ProductsHeader';
import ProductsTable from './ProductsTable';

const Products = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

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
      return  {
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
    async function loadCategories() {
      setLoading(true);
      const result = await user.actor.listRBCategories(user.brandId);
      setCategories(result.ok.map(cat => cat[1].name));
      setLoading(false);
    }
    loadCategories();
  }, [user]);

  useEffect(() => {
    function getFilteredArray() {
      if (searchText.length === 0 && selectedCategory === 'all') {
        return products;
      }
      return _.filter(products, (item) => {
        if (selectedCategory !== 'all' && !_.includes(item.categories, selectedCategory)) {
          return false;
        }
        return item.name.toLowerCase().includes(searchText.toLowerCase());
      });
    }

    if (products) {
      setFilteredData(getFilteredArray());
    }
  }, [products, searchText, selectedCategory]);

  function handleSelectedCategory(event) {
    setSelectedCategory(event.target.value);
  }

  function handleSearchText(event) {
    setSearchText(event.target.value);
  }

  const handleDelete = async (selectedId) => {
    setModalLoading(true);
    try {
      const result = await user.actor.deleteRBProduct(selectedId);
      if ("ok" in result) {
        dispatch(showMessage({ message: 'Success!' }));
        _.remove(products, item => item.id == selectedId);
      } else {
        throw result?.err;
      }
    } catch (error) {
      console.log(error);
      const message = {
        "NotAuthorized": "Please sign in!.",
        "Notfound": "Product is not found.",
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
        <ProductsHeader
          handleSearchText={handleSearchText} categories={categories}
          selectedCategory={selectedCategory} handleSelectedCategory={handleSelectedCategory}
          searchPlaceholder="Search products" title="Products"
          addLink="/refill-network/products/new" addLinkText="Create Product"
        />
      }
      content={
        <ProductsTable
          modalLoading={modalLoading} data={filteredData}
          handleDelete={handleDelete} editPathLink="/refill-network/products/:itemId/edit"
        />
      }
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default Products;
