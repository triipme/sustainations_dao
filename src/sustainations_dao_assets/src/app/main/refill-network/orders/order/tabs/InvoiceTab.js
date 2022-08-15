import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { memo } from 'react';

const Root = styled('div')(({ theme }) => ({
  '& table ': {
    '& th:first-of-type, & td:first-of-type': {
      paddingLeft: `${0}!important`,
    },
    '& th:last-child, & td:last-child': {
      paddingRight: `${0}!important`,
    },
  },

  '& .divider': {
    width: 1,
    backgroundColor: theme.palette.divider,
    height: 144,
  },

  '& .seller': {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.getContrastText(theme.palette.primary.dark),
    marginRight: -88,
    paddingRight: 66,
    width: 480,
    '& .divider': {
      backgroundColor: theme.palette.getContrastText(theme.palette.primary.dark),
      opacity: 0.5,
    },
  },
}));

const InvoiceTab = ({ products, note }) => {
  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 2,
  });
  let total = 0;
  console.log(products);
  return (
    <Root className="grow shrink-0 p-0">
      {products && (
        <Card className="w-full mx-auto shadow-0">
          <CardContent className="print:p-0">
            <div className="mt-64">
              <Table className="simple">
                <TableHead>
                  <TableRow>
                    <TableCell className="w-20">#</TableCell>
                    <TableCell>PRODUCT</TableCell>
                    <TableCell>PRICE</TableCell>
                    <TableCell align="right">QUANTITY</TableCell>
                    <TableCell align="right">TOTAL</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product, index) => {
                    const quantity = parseInt(product.quantity);
                    total += product.price * quantity;
                    return (
                      <TableRow key={product.productId}>
                        <TableCell className="w-20">{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <img className="w-80" src={product.image} alt="product" />
                            <Typography variant="subtitle1" className='mx-8'>{product.name}</Typography>
                          </div>
                        </TableCell>
                        <TableCell align="right">{formatter.format(product.price)}</TableCell>
                        <TableCell align="right">{quantity}</TableCell>
                        <TableCell align="right">
                          {formatter.format(product.price * quantity)}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              <Table className="simple mt-32">
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Typography className="font-light" variant="h4" color="text.secondary">
                        TOTAL
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography className="font-light" variant="h4" color="text.secondary">
                        {formatter.format(total)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            {note && (
              <div className="mt-64 sm:mt-96">
                <Typography className="mb-24 print:mb-12" variant="body1">
                  Note: {note}
                </Typography>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </Root>
  );
};

export default memo(InvoiceTab);
