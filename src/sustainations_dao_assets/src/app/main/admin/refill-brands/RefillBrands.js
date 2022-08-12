import { useState, useLayoutEffect } from "react";
import { useSelector } from 'react-redux';
import { useAsyncMemo } from "use-async-memo";
import { selectUser } from 'app/store/userSlice';
import FuseLoading from '@fuse/core/FuseLoading';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import FusePageCarded from '@fuse/core/FusePageCarded';
import RefillBrandsHeader from './list/RefillBrandsHeader';
import RefillBrandsTable from './list/RefillBrandsTable';

const RefillBrands = () => {
  const user = useSelector(selectUser);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const brands = useAsyncMemo(async () => {
    setLoading(true);
    const result = await user.actor.listRefillBrands();
    setLoading(false);
    return result.ok;
  }, [user]);

  useLayoutEffect(() => {
    function getFilteredArray() {
      if (searchText.length === 0) {
        return brands;
      }
      return _.filter(brands, (item) => {
        return item[1].name.toLowerCase().includes(searchText.toLowerCase());
      });
    }

    if (brands) {
      setFilteredData(getFilteredArray());
    }
  }, [brands, searchText]);

  function handleSearchText(event) {
    setSearchText(event.target.value);
  }

  if (loading) {
    return <FuseLoading />;
  }

  return (
    <FusePageCarded
      header={<RefillBrandsHeader handleSearchText={handleSearchText} />}
      content={<RefillBrandsTable brands={filteredData} searchText={searchText} />}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default RefillBrands;
