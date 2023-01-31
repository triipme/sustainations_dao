import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
// import {
//   randomCreatedDate,
//   randomTraderName,
//   randomUpdatedDate,
// } from '@mui/x-data-grid-generator';

export default function FullFeaturedCrudGrid(props) {
  console.log("prop")
  console.log( (props?.rows[0]?.description))
  // const newData = props?.map(data => {description: data.description})
  // console.log(newData)


  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        rows={props?.rows}
        // rows={rows}
        columns={columns}
        experimentalFeatures={{ newEditingApi: true }}
      />
    </div>
  );
}

// const rows =[]

const columns = [
  { field: 'description', headerName: 'Descriptions', width: 400, editable: true },
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

