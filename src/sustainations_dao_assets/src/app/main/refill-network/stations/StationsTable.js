import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import {
  Chip,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { motion } from 'framer-motion';
import { useState } from 'react';

import withRouter from '@fuse/core/withRouter';
import StationsTableHead from './StationsTableHead';

function StationsTable(props) {
  const { stations } = props;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  function handleClick(stationId) {
    props.navigate(`/refill-network/stations/${stationId}/edit`);
  }

  function handleChangePage(_event, value) {
    setPage(value);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
  }

  if (stations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          There are no stations!
        </Typography>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-full">
      <FuseScrollbars className="grow overflow-x-auto">
        <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
          <StationsTableHead />

          <TableBody>
            {stations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((station, index) => {
                return (
                  <TableRow
                    className="h-72 cursor-pointer"
                    hover
                    key={station[0]}
                    onClick={() => handleClick(station[0])}
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
                      {station[1].name}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {station[1].phone}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {station[1].address}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="right">
                      {station[1].activate ? (
                        <Chip label="Active" color="primary" />
                      ) : (<Chip label="Inactive" color="warning" />)}
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
        count={stations.length}
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
    </div>
  );
}

export default withRouter(StationsTable);
