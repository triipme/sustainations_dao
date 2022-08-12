import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useState } from 'react';

import withRouter from '@fuse/core/withRouter';
import RefillBrandsTableHead from './RefillBrandsTableHead';

function RefillBrandsTable(props) {
  const { brands } = props;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  function handleClick(brandId) {
    props.navigate(`/admin/refill-brands/${brandId}/edit`);
  }

  function handleChangePage(_event, value) {
    setPage(value);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
  }

  if (brands.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          There are no refill brands!
        </Typography>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-full">
      <FuseScrollbars className="grow overflow-x-auto">
        <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
          <RefillBrandsTableHead />

          <TableBody>
            {brands.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((brand, index) => {
                return (
                  <TableRow
                    className="h-72 cursor-pointer"
                    hover
                    key={brand[0]}
                    onClick={() => handleClick(brand[0])}
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
                      {brand[1].name}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {brand[1].phone}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {brand[1].email}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {brand[1].address}
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
        count={brands.length}
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

export default withRouter(RefillBrandsTable);
