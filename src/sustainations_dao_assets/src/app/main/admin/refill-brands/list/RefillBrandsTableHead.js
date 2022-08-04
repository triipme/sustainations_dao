import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import { lighten } from '@mui/material/styles';

const rows = [
  {
    id: 'uuid',
    align: 'left',
    disablePadding: false,
    label: 'UUID',
  },
  {
    id: 'name',
    align: 'left',
    disablePadding: false,
    label: 'Name',
  },
  {
    id: 'phone',
    align: 'left',
    disablePadding: false,
    label: 'Phone',
  },
  {
    id: 'email',
    align: 'left',
    disablePadding: false,
    label: 'Email',
  },
  {
    id: 'address',
    align: 'left',
    disablePadding: false,
    label: 'Address',
  },
];

function RefillBrandsTableHead() {
  return (
    <TableHead>
      <TableRow className="h-48 sm:h-64">
        {rows.map((row) => {
          return (
            <TableCell
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'light'
                    ? lighten(theme.palette.background.default, 0.4)
                    : lighten(theme.palette.background.default, 0.02),
              }}
              className="p-4 md:p-16"
              key={row.id}
              align={row.align}
              padding={row.disablePadding ? 'none' : 'normal'}
            >
              {row.label}
            </TableCell>
          );
        }, this)}
      </TableRow>
    </TableHead>
  );
}

export default RefillBrandsTableHead;
