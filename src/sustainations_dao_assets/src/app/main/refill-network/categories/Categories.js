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
import CategoriesTable from './CategoriesTable';

const Categories = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const categories = useAsyncMemo(async () => {
    setLoading(true);
    const result = await user.actor.listRBCategories(user.brandId);
    setLoading(false);
    return result.ok;
  }, [user]);

  useLayoutEffect(() => {
    function getFilteredArray() {
      if (searchText.length === 0) {
        return categories;
      }
      return _.filter(categories, (item) => {
        return item[1].name.toLowerCase().includes(searchText.toLowerCase());
      });
    }

    if (categories) {
      setFilteredData(getFilteredArray());
    }
  }, [categories, searchText]);

  function handleSearchText(event) {
    setSearchText(event.target.value);
  }

  const handleDelete = async (selectedId) => {
    setModalLoading(true);
    try {
      const result = await user.actor.deleteRBCategory(selectedId);
      if ("ok" in result) {
        dispatch(showMessage({ message: 'Success!' }));
        _.remove(categories, category => category[0] == selectedId);
      } else {
        throw result?.err;
      }
    } catch (error) {
      console.log(error);
      const message = {
        "NotAuthorized": "Please sign in!.",
        "Notfound": "Category is not found.",
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
          searchPlaceholder="Search categories" title="Categories"
          addLink="/refill-network/categories/new" addLinkText="Create Category"
        />
      }
      content={
        <CategoriesTable
          modalLoading={modalLoading} data={filteredData}
          handleDelete={handleDelete} editPathLink="/refill-network/categories/:itemId/edit"
        />
      }
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default Categories;
