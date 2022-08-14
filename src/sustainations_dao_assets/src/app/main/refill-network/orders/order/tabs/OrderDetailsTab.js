import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import OrdersStatus from '../OrdersStatus';
import _ from 'lodash';
import { fDate } from '../../../../../utils/NumberFormat';

function OrderDetailsTab({ order }) {
  return (
    <div className='w-full'>
      {order?.station && (
        <div className="pb-48">
          <div className="pb-16 flex items-center">
            <FuseSvgIcon color="action">account_circle_outlined</FuseSvgIcon>
            <Typography className="h2 mx-12 font-medium" color="text.secondary">
              Station
            </Typography>
          </div>

          <div className="mb-24">
            <div className="table-responsive mb-48">
              <table className="simple">
                <thead>
                  <tr>
                    <th>
                      <Typography className="font-semibold">Name</Typography>
                    </th>
                    <th>
                      <Typography className="font-semibold">Phone</Typography>
                    </th>
                    <th>
                      <Typography className="font-semibold">Address</Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <Typography>{order.station.name}</Typography>
                    </td>
                    <td>
                      <Typography>{order.station.phone}</Typography>
                    </td>
                    <td>
                      <Typography>{order.station.address}</Typography>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="pb-48">
        <div className="pb-16 flex items-center">
          <FuseSvgIcon color="action">access_time_outlined</FuseSvgIcon>
          <Typography className="h2 mx-12 font-medium" color="text.secondary">
            Order Status
          </Typography>
        </div>

        <div className="table-responsive">
          <table className="simple">
            <thead>
              <tr>
                <th>
                  <Typography className="font-semibold">Status</Typography>
                </th>
                <th>
                  <Typography className="font-semibold">Updated On</Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              {order.history.map((item) => (
                <tr key={_.keys(item.status)[0]}>
                  <td>
                    {_.capitalize(_.keys(item.status)[0])}
                  </td>
                  <td>{fDate(item.timestamp, 'lll')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsTab;
