import {
  Button,
  CircularProgress,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  Stack,
  Typography
} from '@mui/material';

const ConfirmationDialog = (props) => {
  const { message, open, loading, onClose, ...other } = props;

  const handleCancel = () => {
    onClose(false);
  };

  const handleOk = () => {
    onClose(true);
  };

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="xs"
      open={open}
      {...other}
    >
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogContent dividers>
        <Typography
          color="inherit"
          className="text-16 sm:text-20 my-16 sm:mt-24 tracking-tight text-center"
        >{message}</Typography>
      </DialogContent>
      <DialogActions>
        {loading && (
          <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row">
            <CircularProgress color="secondary" size="2rem" />
            <CircularProgress color="success" size="2rem" />
            <CircularProgress color="inherit" size="2rem" />
          </Stack>
        )}
        <Button autoFocus onClick={handleCancel} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleOk} disabled={loading}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationDialog;