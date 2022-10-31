import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import _ from 'lodash';
import moment from "moment";
import DataTable from 'react-data-table-component';

import {
  TableContainer,
  Paper,
  Grid
} from "@mui/material";
import { fICP } from '../../../utils/NumberFormat';
import { walletAddressLink } from '../../../utils/TextFormat';
import { selectUser } from 'app/store/userSlice';

const Transactions = () => {
  const [loading, setLoading] = useState(true);
  const [systemAddress, setSystemAddress] = useState();
  const [systemBalance, setSystemBalance] = useState();
  const [transactions, setTransactions] = useState([]);
  const user = useSelector(selectUser);
  const columns = useMemo(
    () => [
      {
        name: 'Block Index',
        selector: row => row.blockIndex,
        format: row => row.blockIndex?.toString(),
        sortable: true,
        wrap: true,
      },
      {
        name: 'Caller',
        selector: row => row.caller,
        format: row => row.caller.toText(),
        sortable: false,
        wrap: true,
      },
      {
        name: 'From Principal',
        selector: row => row.fromPrincipal.toText(),
        sortable: false,
        wrap: true,
      },
      {
        name: 'To Principal',
        selector: row => row.toPrincipal.toText(),
        sortable: false,
        wrap: true,
      },
      {
        name: 'Amount',
        selector: row => row.amount,
        sortable: false,
        cell: row => (fICP(row.amount)),
        ignoreRowClick: true,
      },
      {
        name: 'Fee',
        selector: row => row.fee,
        sortable: false,
        cell: row => (fICP(row.fee)),
      },
      {
        name: 'Reference Type',
        selector: row => _.keys(row.refType),
        sortable: false,
      },
      {
        name: 'Reference ID',
        selector: row => row.refId,
        sortable: false,
        wrap: true,
      },
      {
        name: 'Timestamp',
        selector: row => row.timestamp,
        format: row => moment.unix(parseInt(row.timestamp / BigInt(1e9))).format("lll"),
        sortable: true,
      },
      {
        name: 'Tx Error',
        selector: row => row.txError,
        sortable: false,
        wrap: true,
      },
    ],
    []
  );

  async function getTransactions() {
    try {
      if (!!user.actor?.getTransactions) {
        const result = await user.actor.getTransactions();
        if ("ok" in result) {
          setTransactions(_.orderBy(result.ok), ['timestamp'], ['desc']);
          setLoading(false);
        } else {
          throw result.err;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function getSystemWallet() {
    const addressRes = await user.actor.getSystemAddressAsText();
    setSystemAddress(addressRes);
    console.log('addressRes', addressRes);
    const balanceRes = await user.actor.getSystemBalance();
    setSystemBalance(balanceRes);
    console.log('balanceRes', balanceRes)
  }
  useEffect(() => {
    getTransactions();
    getSystemWallet();
  }, [user]);

  return (
    <div className="flex flex-col items-center p-24 sm:p-40">
      <div className="flex flex-col pb-24 w-full">
        <p>System address: {walletAddressLink(systemAddress)}</p>
        <p>System balance: {fICP(systemBalance?.e8s)}</p>
      </div>
      <div className="flex flex-col w-full">
        <TableContainer component={Paper}>
          <Grid
            className="infor-manual"
            container
            direction="row"
            justifyContent="center"
            alignItems="flex-start">
            <DataTable title="Transactions" columns={columns} data={transactions} progressPending={loading} pagination />
          </Grid>
        </TableContainer>
      </div>
    </div>
  );
};

export default Transactions;
