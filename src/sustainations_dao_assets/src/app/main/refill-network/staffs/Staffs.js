import { useState, useLayoutEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useAsyncMemo } from "use-async-memo";
import { selectUser } from 'app/store/userSlice';
import { Navigate } from 'react-router-dom';
import { authRoles } from "../../../auth";
import { showMessage } from "../../../store/fuse/messageSlice";
import FuseUtils from '@fuse/utils';
import FuseLoading from '@fuse/core/FuseLoading';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import FusePageCarded from '@fuse/core/FusePageCarded';
import StaffsHeader from './StaffsHeader';
import StaffsTable from './StaffsTable';

const Staffs = () => {
  const user = useSelector(selectUser);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const dispatch = useDispatch();

  if (!FuseUtils.hasPermission(authRoles.refillBrandOwner, user.role)) {
    dispatch(showMessage({ message: 'Required owner role.' }));
    return (<Navigate to="/refill-network/brand" />);
  }

  const staffs = useAsyncMemo(async () => {
    setLoading(true);
    const result = await user.actor.listRBManagers();
    setLoading(false);
    return result.ok;
  }, [user]);

  useLayoutEffect(() => {
    function getFilteredArray() {
      if (searchText.length === 0) {
        return staffs;
      }
      return _.filter(staffs, (item) => {
        return item[1].toLowerCase().includes(searchText.toLowerCase());
      });
    }

    if (staffs) {
      setFilteredData(getFilteredArray());
    }
  }, [staffs, searchText]);

  function handleSearchText(event) {
    setSearchText(event.target.value);
  }

  if (loading) {
    return <FuseLoading />;
  }

  return (
    <FusePageCarded
      header={<StaffsHeader handleSearchText={handleSearchText} />}
      content={<StaffsTable user={user} staffs={filteredData} searchText={searchText} />}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default Staffs;
