import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useState } from 'react';
import { useEffect } from 'react';
import { LoadingButton } from '@mui/lab';
import { loadItemUrl } from '../../metaverse/GameApi';
import { NumberSchema } from 'yup';
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setUser } from 'app/store/userSlice';

function updateRowPosition(initialIndex, newIndex, rows) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const rowsClone = [...rows];
      const row = rowsClone.splice(initialIndex, 1)[0];
      rowsClone.splice(newIndex, 0, row);
      resolve(rowsClone);
    }, Math.random() * 500 + 100); // simulate network latency
  });
}

export default function RowOrderingGrid(props) {
  const user = useSelector(selectUser);
  // console.log(props?.rows)
  const { data, loading: initialLoadingState } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
    maxColumns: 20,
  });

  // const [rows, setRows] = React.useState(data.rows);
  // const [loading, setLoading] = React.useState(initialLoadingState);

  const [rows, setRows] = React.useState(props?.rows);
  const [loading, setLoading] = React.useState(initialLoadingState);
  console.log(rows)

  React.useEffect(() => {
    setRows(props?.rows);
  }, [props]);

  React.useEffect(() => {
    setLoading(initialLoadingState);
  }, [initialLoadingState]);

  const handleRowOrderChange = async (params) => {
    setLoading(true);
    const newRows = await updateRowPosition(
      params.oldIndex,
      params.targetIndex,
      rows,
    );

    setRows(newRows);
    setLoading(false);
  };

  const handleUpdate = async () => {
    console.log(idList)
    const sceneInfo = (await user.actor.updateSceneQuest("test", idList))?.ok
    console.log(sceneInfo)
  }


  const columns = [
    { field: 'id', headerName: 'Id', width: 100 },
    {
      field: 'mid',
      headerName: 'Mid Images',
      height: 1000,
      renderCell: (params) => {
        const [img, setImg] = useState("")
        useEffect(() => {
          setImg(loadItemUrl(params.value))
        }, [])
        return (
          <img src={img} />
        );
      },

    },
    {
      field: 'back',
      headerName: 'Back Images',
      width: 150,
      renderCell: (params) => {
        const [img, setImg] = useState("")
        useEffect(() => {
          setImg(loadItemUrl(params.value))
        }, [])
        return (
          <img src={img} />
        );
      },
    },
    {
      field: 'front',
      headerName: 'Front Images',
      width: 150,
      renderCell: (params) => {
        const [img, setImg] = useState("")
        useEffect(() => {
          setImg(loadItemUrl(params.value))
        }, [])
        return (
          <img src={img} />
        );
      },
    },
    {
      field: 'obstacle',
      headerName: 'Obstacle Images',
      width: 150,
      renderCell: (params) => {
        const [img, setImg] = useState("")
        useEffect(() => {
          setImg(loadItemUrl(params.value))
        }, [])
        return (
          <img src={img} />
        );
      },
    },

    {
      field: 'actions', headerName: 'Actions', width: 400, renderCell: (params) => {
        const handleDelete = async (id) => {
          setLoading(true);
          try {
            await user.actor.deleteSceneEventAndEventOption(id);
            setList(list.filter((item) => item.id !== id));
          } catch (err) {
            console.log(err)
          }
          setLoading(false);

        };
        return (
          <div>
            <LoadingButton
              onClick={() => handleDelete(params.row.id)}
              variant="contained"
              loading={loading}
              style={{ color: "red" }}

            >
              Delete
            </LoadingButton>
            {/* <LoadingButton
              variant="contained"
              loading={loading}
              style={{ color: "green", marginLeft: "10px" }}
              onClick={() => handleClick(params.row.id)}
            >
              Edit
            </LoadingButton> */}
          </div>
        );
      }
    }
  ];

  const idList = rows?.map(data => data.id)
  console.log(idList)

  return (
    <>
      <div style={{ marginBottom: "50px" }}>
        <div style={{ height: 400, width: '100%' }}>
          <DataGridPro
            loading={loading}
            rows={rows}
            columns={columns}
            rowReordering
            onRowOrderChange={handleRowOrderChange}
          />
        </div>

        <LoadingButton
          className="ml-8"
          variant="contained"
          color="secondary"
          loading={loading}
          style={{ marginbot: "50px" }}
          onClick={handleUpdate} 
        >
          Update Scene
        </LoadingButton>
      </div>

    </>

  );
}