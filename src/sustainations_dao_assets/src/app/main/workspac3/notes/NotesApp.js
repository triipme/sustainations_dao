import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAsyncMemo } from "use-async-memo";
import { lighten, styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import FusePageCarded from '@fuse/core/FusePageCarded';
import FuseLoading from '@fuse/core/FuseLoading';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import LabelsDialog from './dialogs/labels/LabelsDialog';
import NoteDialog from './dialogs/note/NoteDialog';
import NewNote from './NewNote';
import NoteList from './NoteList';
import NotesHeader from './NotesHeader';
import NotesSidebarContent from './NotesSidebarContent';
import { selectUser } from 'app/store/userSlice';
import { getS3Object } from '../../../hooks';

const Root = styled(FusePageCarded)(() => ({
  '& .FusePageCarded-header': {},
  '& .FusePageCarded-sidebar': {},
  '& .FusePageCarded-leftSidebar': {},
}));

function NotesApp() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
  const { filter, label } = useParams();
  const [filteredData, setFilteredData] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [labels, setLabels] = useState([]);

  async function loadImage(path) {
    if (path) {
      const file = await getS3Object(path);
      return {
        id: path.split("/")[2].split(".")[0],
        file,
        name: path
      };
    }
  };
  console.log('user', user);
  const notes = useAsyncMemo(async () => {
    setLoading(true);
    const result = await user.actor.getWsNotes();
    const data = await Promise.all(result.ok.map(async item => {
      const image = await loadImage(item[1].payload.image[0]);
      return  {
        id: item[0],
        owner: item[1].owner,
        timestamp: item[1].timestamp,
        payload: _.merge(item[1].payload, { image, archived: item[1].payload.archived.toString() })
      }
    }));
    setLoading(false);
    return data;
  }, [user]);

  useEffect(() => {
    async function loadLabels() {
      setLoading(true);
      const result = await user.actor.getWsNoteLabels();
      setLabels(result.ok);
      setLoading(false);
    }
    loadLabels();
  }, [user]);

  useEffect(() => {
    function getFilteredArray() {
      if (searchText.length === 0 && filter === '') {
        return notes;
      }
      return _.filter(notes, (item) => {
        let valid = true;
        if (filter === 'labels') {
          valid = _.includes(item.payload?.labels[0], label);
        }
        if (filter === 'archive') {
          valid = item.payload.archived === 'true';
        }
        if (filter === 'reminders') {
          valid = !_.isNil(item.payload.remindTime)
        }
        valid = valid && (
          item.payload.title.toLowerCase().includes(searchText.toLowerCase())
          || item.payload?.description?.toLowerCase()?.includes(searchText.toLowerCase())
        );
        return valid;
      });
    }

    if (notes) {
      setFilteredData(getFilteredArray());
    }
  }, [notes, searchText]);

  function handleSearchText(event) {
    setSearchText(event.target.value);
  }

  if (loading) {
    return (<FuseLoading />);
  }

  return (
    <>
      <Root
        header={<NotesHeader onSetSidebarOpen={setLeftSidebarOpen} />}
        content={
          <div className="flex flex-col w-full items-center p-24">
            <Box
              className="w-full rounded-16 border p-12 flex flex-col items-center"
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'light'
                    ? lighten(theme.palette.background.default, 0.4)
                    : lighten(theme.palette.background.default, 0.02),
              }}
            >
              <NewNote handleCreate={handleCreate} actor={user.actor} />
              <NoteList />
            </Box>
            <NoteDialog />
            <LabelsDialog />
          </div>
        }
        leftSidebarOpen={leftSidebarOpen}
        leftSidebarOnClose={() => {
          setLeftSidebarOpen(false);
        }}
        leftSidebarContent={<NotesSidebarContent />}
        scroll={isMobile ? 'normal' : 'content'}
      />
    </>
  );
}

export default NotesApp;
