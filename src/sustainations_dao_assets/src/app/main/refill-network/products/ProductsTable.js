import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';

import withRouter from '@fuse/core/withRouter';
import ContentsTableHead from '../../../shared-components/ContentsTableHead';
import ConfirmationDialog from '../../../shared-components/ConfirmationDialog';

const rows = [
  {
    id: 'index',
    align: 'left',
    disablePadding: false,
    label: '#',
  },
  {
    id: 'image',
    align: 'left',
    disablePadding: false,
    label: '',
  },
  {
    id: 'name',
    align: 'left',
    disablePadding: false,
    label: 'Name',
  },
  {
    id: 'categories',
    align: 'left',
    disablePadding: false,
    label: 'Category',
  },
  {
    id: 'price',
    align: 'left',
    disablePadding: false,
    label: 'Price',
  },
  {
    id: 'actions',
    align: 'right',
    disablePadding: false,
    label: 'Actions',
  }
];

function ProductsTable(props) {
  const { data, modalLoading, handleDelete, editPathLink } = props;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  function handleChangePage(_event, value) {
    setPage(value);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
  }

  const confirmDeleteItem = (itemId) => {
    setOpenDialog(true);
    setSelectedId(itemId);
  }

  const handleDeleteItem = async (confirm) => {
    if (confirm) {
      await handleDelete(selectedId);
    }
    setOpenDialog(false);
    setSelectedId(null);
  }

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          No data found!
        </Typography>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-full">
      <FuseScrollbars className="grow overflow-x-auto">
        <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
        <ContentsTableHead rows={rows} />

          <TableBody>
            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item, index) => {
                return (
                  <TableRow
                    className="h-72"
                    hover
                    key={item[0]}
                  >
                    <TableCell
                      className="w-40 md:w-64 text-center"
                      component="th"
                      scope="row"
                      padding="none"
                    >
                      {index + 1}
                    </TableCell>

                    <TableCell
                      className="w-64 px-4 md:px-0"
                      component="th"
                      scope="row"
                      padding="none">
                      {item[1]?.image && (
                        <img
                          className="w-full block rounded"
                          src={item[1]?.image}
                          alt={item[1].name}
                        />
                      )}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {item[1].name}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {item[1]?.categories?.join(', ')}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {item[1].price}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="right">
                      <IconButton
                        aria-label="edit" color="primary"
                        to={_.replace(editPathLink, ':itemId', item[0])}
                        component={Link}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete" color="warning"
                        onClick={() => confirmDeleteItem(item[0])}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </FuseScrollbars>

      <TablePagination
        className="shrink-0 border-t-1"
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        backIconButtonProps={{
          'aria-label': 'Previous Page',
        }}
        nextIconButtonProps={{
          'aria-label': 'Next Page',
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <ConfirmationDialog
        id="confirmation-dialog"
        keepMounted
        open={openDialog}
        loading={modalLoading}
        message="Are you sure you want to remove this product?"
        onClose={handleDeleteItem}
      />
    </div>
  );
}

export default withRouter(ProductsTable);
