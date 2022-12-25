import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams, GridCellEditStopParams, MuiBaseEvent, GridCellEditStopReasons } from '@mui/x-data-grid';
import { borderColor } from '@mui/system';

const columns = [
  { field: 'option', headerName: 'Options', width: 400, editable: true },
  {
    field: 'hp',
    headerName: 'HP',
    type: 'number',
    width: 90,
    editable: true
  },
  {
    field: 'stamina',
    headerName: 'Stamina',
    type: 'number',
    width: 90,
    editable: true
  },
  {
    field: 'mana',
    headerName: 'Mana',
    type: 'number',
    width: 90,
    editable: true
  },
  {
    field: 'morale',
    headerName: 'Morale',
    type: 'number',
    width: 90,
    editable: true
  },

];


export default function DataTable(props) {

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        style={{border: '5px solid rgba(0, 0, 0, 0.05)'}}
        rows={props?.rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        getRowId={(row) => Math.random() * 10000}
      />
    </div>
  );
}