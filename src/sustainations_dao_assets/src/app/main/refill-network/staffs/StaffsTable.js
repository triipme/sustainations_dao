import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import {
  TablePagination,
  TableRow,
  Typography,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';

import withRouter from '@fuse/core/withRouter';
import StaffsTableHead from './StaffsTableHead';
import ConfirmationDialog from '../../../shared-components/ConfirmationDialog';

function StaffsTable(props) {
  const dispatch = useDispatch();
  const { user, staffs } = props;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState();

  function handleChangePage(_event, value) {
    setPage(value);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
  }

  const confirmDeleteStaff = (staffPrincipal) => {
    setOpenDialog(true);
    setSelectedStaff(staffPrincipal);
  }

  const handleDelete = async (confirm) => {
    if (confirm) {
      setLoading(true);
      try {
        const result = await user.actor.deleteRBManager(selectedStaff);
        if ("ok" in result) {
          dispatch(showMessage({ message: 'Success!' }));
          _.remove(staffs, staff => staff[0] == selectedStaff);
        } else {
          throw result?.err;
        }
      } catch (error) {
        console.log(error);
        const message = {
          "NotAuthorized": "Please sign in!.",
          "Notfound": "Staff is not found.",
          "OwnerRoleRequired": 'Required admin role.'
        }[Object.keys(error)[0]] || 'Error! Please try again later!'
        dispatch(showMessage({ message }));
      }
      setLoading(false);
    }
    setOpenDialog(false);
    setSelectedStaff(null);
  }

  if (staffs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          There are no staffs!
        </Typography>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-full">
      <FuseScrollbars className="grow overflow-x-auto">
        <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
          <StaffsTableHead />

          <TableBody>
            {staffs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((staff, index) => {
                return (
                  <TableRow
                    className="h-72"
                    hover
                    key={staff[0]}
                  >
                    <TableCell
                      className="w-40 md:w-64 text-center"
                      component="th"
                      scope="row"
                      padding="none"
                    >
                      {index + 1}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {staff[0]}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {staff[1]}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="right">
                      <IconButton
                        aria-label="edit" color="primary"
                        to={`/refill-network/staffs/${staff[0]}/edit`}
                        component={Link}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete" color="warning"
                        onClick={() => confirmDeleteStaff(staff[0])}
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
        count={staffs.length}
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
        loading={loading}
        message="Are you sure you want to remove this Staff?"
        onClose={handleDelete}
      />
    </div>
  );
}

export default withRouter(StaffsTable);
