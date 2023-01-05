import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams, GridCellEditStopParams, MuiBaseEvent, GridCellEditStopReasons } from '@mui/x-data-grid';
import { borderColor } from '@mui/system';
import { useState } from 'react';
import { useEffect } from 'react';
import { loadItemUrl } from '../../metaverse/GameApi';
import { Button } from '@mui/material';
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setUser } from 'app/store/userSlice';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';



export default function SceneTable(props) {
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([])
  console.log("Image Scene")
  console.log(props?.rows)
  useEffect(() => {
    setList(props?.rows);
  }, [props?.rows]);
  const navigate = useNavigate();

  function handleClick(sceneId) {
    navigate(`/admin/quest-engine/${sceneId}/edit`);

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

  return (
    <>
      <div style={{ height: 300, width: '100%' }}>
        <DataGrid
          style={{ border: '5px solid rgba(0, 0, 0, 0.05)' }}
          rows={list}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          getRowId={(row) => Math.random() * 10000}
        />
      </div>
    </>

  );
}