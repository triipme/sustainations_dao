import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

function DocumentationButton({ className }) {
  return (
    <Button
      component={Link}
      to="/documentation"
      role="button"
      className={className}
      variant="contained"
      color="primary"
      startIcon={<FuseSvgIcon size={16}>menu_book_outlined</FuseSvgIcon>}
    >
      Documentation
    </Button>
  );
}

export default DocumentationButton;
