import ClickAwayListener from '@mui/material/ClickAwayListener';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import NoteForm from './note-form/NoteForm';

const errorMessages = {
  "NotAuthorized": "Please sign in!.",
  "Notfound": "Product is not found."
}

function NewNote(props) {
  const dispatch = useDispatch();
  const { actor } = props;
  const [formOpen, setFormOpen] = useState(false);

  function handleFormOpen(ev) {
    ev.stopPropagation();
    setFormOpen(true);
    document.addEventListener('keydown', escFunction, false);
  }

  function handleFormClose() {
    if (!formOpen) {
      return;
    }
    setFormOpen(false);
    document.removeEventListener('keydown', escFunction, false);
  }

  const handleCreate = async (note) => {
    const payload = {
      title: [note.title],
      description: [note.description],
      image: [note.image?.name],
      todos: [note.todos],
      labels: [note.labels],
      remindTime: [note.remindTime?.unix()],
      archived: note.archived == true,
    };
    try {
      const result = await actor.createWsNote(payload);
      if ("ok" in result) {
        // upload image
        if (note?.image) {
          const uploadImage = await setS3Object({
            file: note.image.base64data,
            name: note.image.path
          });
          Promise.resolve(uploadImage);
        }
      } else {
        throw result?.err;
      }
    } catch (error) {
      console.log(error);
      const message = errorMessages[Object.keys(error)[0]] || 'Error! Please try again later!'
      dispatch(showMessage({ message }));
    }
    handleFormClose();
  }

  function escFunction(event) {
    if (event.keyCode === 27) {
      handleFormClose();
    }
  }

  function handleClickAway(ev) {
    const preventCloseElements = document.querySelector('.prevent-add-close');
    const preventClose = preventCloseElements ? preventCloseElements.contains(ev.target) : false;
    if (preventClose) {
      return;
    }
    handleFormClose();
  }

  return (
    <Paper className="flex items-center w-full max-w-512 mt-8 mb-16 min-h-48 shadow shrink-0 cursor-text">
      {formOpen ? (
        <ClickAwayListener onClickAway={handleClickAway}>
          <div className="w-full">
            <NoteForm onCreate={handleCreate} variant="new" />
          </div>
        </ClickAwayListener>
      ) : (
        <Typography
          className="w-full px-16 py-12 text-16 w-full"
          color="text.secondary"
          onClick={handleFormOpen}
        >
          Take a note...
        </Typography>
      )}
    </Paper>
  );
}

export default NewNote;
