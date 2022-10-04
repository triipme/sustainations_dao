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
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';

import withRouter from '@fuse/core/withRouter';
import ContentsTableHead from '../../../shared-components/ContentsTableHead';
import { fDate } from '../../../utils/NumberFormat';

const rows = [
  {
    id: 'index',
    align: 'left',
    disablePadding: false,
    label: '#',
  },
  {
    id: 'station',
    align: 'left',
    disablePadding: false,
    label: 'Station',
    sort: true,
  },
  {
    id: 'total',
    align: 'right',
    disablePadding: false,
    label: 'Total',
    sort: true,
  },
  {
    id: 'status',
    align: 'left',
    disablePadding: false,
    label: 'Status',
    sort: true,
  },
  {
    id: 'date',
    align: 'left',
    disablePadding: false,
    label: 'Date',
    sort: true,
  },
  {
    id: 'actions',
    align: 'right',
    disablePadding: false,
    label: 'Actions',
  }
];

function OrdersTable(props) {
  const { data } = props;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState({
    direction: 'asc',
    id: null,
  });

  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 2,
  });

  function handleChangePage(_event, value) {
    setPage(value);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
  }

  function handleRequestSort(_event, property) {
    const id = property;
    let direction = 'desc';
    if (order.id === property && order.direction === 'desc') {
      direction = 'asc';
    }
    setOrder({
      direction,
      id,
    });
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
        <ContentsTableHead rows={rows} order={order} onRequestSort={handleRequestSort} />

          <TableBody>
            {_.orderBy(
              data,
              [
                (o) => {
                  switch (order.id) {
                    case 'station': {
                      return o.stationName;
                    }
                    case 'total': {
                      return o.totalAmount;
                    }
                    case 'status': {
                      return o.status;
                    }
                    case 'date': {
                      return o.timestamp;
                    }
                    default: {
                      return o[order.timestamp];
                    }
                  }
                },
              ],
              [order.direction]
            ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item, index) => {
                return (
                  <TableRow
                    className="h-72"
                    hover
                    key={item.orderId}
                  >
                    <TableCell
                      className="w-40 md:w-64 text-center"
                      component="th"
                      scope="row"
                      padding="none"
                    >
                      {page * rowsPerPage + index + 1}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {item.stationName}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="right">
                      {formatter.format(item.totalAmount)}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {item.status}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {fDate(item.timestamp, 'lll')}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="right">
                      <IconButton
                        aria-label="view" color="info"
                        to={`/refill-network/orders/${item.orderId}`}
                        component={Link}
                      >
                        <VisibilityOutlinedIcon />
                      </IconButton>
                      <IconButton
                        aria-label="edit" color="primary"
                        to={`/refill-network/orders/${item.orderId}/edit`}
                        component={Link}
                      >
                        <EditIcon />
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
    </div>
  );
}

export default withRouter(OrdersTable);
