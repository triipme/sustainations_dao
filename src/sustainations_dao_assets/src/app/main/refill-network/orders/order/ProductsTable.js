import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { motion } from 'framer-motion';
import { useState } from 'react';

import withRouter from '@fuse/core/withRouter';
import ContentsTableHead from '../../../../shared-components/ContentsTableHead';

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
  }
];

function ProductsTable(props) {
  const { data, onSelectProduct, selectedProductIds, error } = props;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  function handleChangePage(_event, value) {
    setPage(value);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
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
    <div className={`w-full flex flex-col min-h-full ${error && 'border-error rounded-2xl'}`}>
      <FuseScrollbars className="grow overflow-x-auto">
        <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
          <ContentsTableHead rows={rows} />
          <TableBody>
            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item) => {
                const isSelected = _.findIndex(selectedProductIds, {'productId': item.id}) !== -1;
                return (
                  <TableRow
                    className="h-72 cursor-pointer"
                    hover
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    selected={isSelected}
                    onClick={(_event) => onSelectProduct(item.id)}
                    key={item.id}
                  >
                    <TableCell className="w-40 md:w-64 text-center" padding="none">
                      <Checkbox
                        checked={isSelected}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(_event) => onSelectProduct(item.id)}
                      />
                    </TableCell>

                    <TableCell
                      className="w-64 px-4 md:px-0"
                      component="th"
                      scope="row"
                      padding="none">
                      {item?.image && (
                        <img
                          className="w-full block rounded"
                          src={item?.image}
                          alt={item.name}
                        />
                      )}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {item.name}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {item?.categories?.join(', ')}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {item.price}
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
    </div>
  );
}

export default withRouter(ProductsTable);
