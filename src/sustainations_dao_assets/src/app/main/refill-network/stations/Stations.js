import { useState, useLayoutEffect } from "react";
import { useSelector } from 'react-redux';
import { useAsyncMemo } from "use-async-memo";
import { selectUser } from 'app/store/userSlice';
import FuseLoading from '@fuse/core/FuseLoading';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import FusePageCarded from '@fuse/core/FusePageCarded';
import StationsHeader from './StationsHeader';
import StationsTable from './StationsTable';

const Stations = () => {
  const user = useSelector(selectUser);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const stations = useAsyncMemo(async () => {
    setLoading(true);
    const result = await user.actor.listRBStations(user.brandId);
    setLoading(false);
    return result.ok;
  }, [user]);

  useLayoutEffect(() => {
    function getFilteredArray() {
      if (searchText.length === 0) {
        return stations;
      }
      return _.filter(stations, (item) => {
        return item[1].name.toLowerCase().includes(searchText.toLowerCase());
      });
    }

    if (stations) {
      setFilteredData(getFilteredArray());
    }
  }, [stations, searchText]);

  function handleSearchText(event) {
    setSearchText(event.target.value);
  }

  if (loading) {
    return <FuseLoading />;
  }

  return (
    <FusePageCarded
      header={<StationsHeader handleSearchText={handleSearchText} />}
      content={<StationsTable user={user} stations={filteredData} searchText={searchText} />}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default Stations;
