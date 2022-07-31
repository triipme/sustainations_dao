import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Avatar, Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
const MemoryCardEngineTop = ({ slug, gameId }) => {
  const [list, setList] = useState();
  const { actor } = useSelector(state => state.user);
  async function initialEffect() {
    try {
      const rs = await actor.memoryCardEngineListOfDay(slug, gameId);
      setList(rs.ok);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    initialEffect();
  }, []);
  // const handlePlay = () => {
  //   navigate("/slug/magic-memory-photo/play", { state: { player_id: player?.[0]?.[0] } });
  // };
  const rows = useMemo(() => {
    return list
      ?.map((l, l_i) => {
        const col2 = totalTurn(l?.[0].history);
        const col3 = totalTime(l?.[0].history);
        return {
          col1: String(l?.[0].aId),
          col2,
          col3,
          col4: col2 + col3
        };
      })
      .sort((a, b) => a.col4 - b.col4)
      .map((row, id) => ({ ...row, id }));
  }, [list]);
  const columns = useMemo(
    () => [
      {
        field: "id",
        headerName: "#",
        sortable: false,
        width: 10,
        renderCell: params => (
          <Avatar
            sx={{
              bgcolor: params.value === 0 ? "yellow" : "transparent",
              color: params.value === 0 ? "white" : "black",
              width: 24,
              height: 24
            }}>
            {params.value + 1}
          </Avatar>
        )
      },
      { field: "col1", headerName: "Name", width: 100, sortable: false },
      { field: "col2", headerName: "Total turn", sortable: false },
      { field: "col3", headerName: "Total time(s)", width: 110, sortable: false },
      { field: "col4" }
    ],
    []
  );

  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h3" mb={3}>
        Leader Board
      </Typography>
      <DataGrid
        rows={rows ?? []}
        columns={columns}
        pageSize={10}
        sx={{ width: { md: 400, xs: 330 }, my: 3 }}
        rowsPerPageOptions={[10]}
        autoHeight
        pagination
        disableColumnMenu
        components={{
          NoRowsOverlay: () => (
            <Typography sx={{ height: "100%", display: "grid", placeItems: "center" }}>
              Be the first player today
            </Typography>
          )
        }}
        initialState={{
          columns: {
            columnVisibilityModel: {
              col4: false
            }
          }
          // sorting: {
          //   sortModel: [{ field: "col4", sort: "asc" }]
          // }
        }}
      />
    </Box>
  );
};

export default MemoryCardEngineTop;

function totalTurn(array) {
  return array?.reduce((a, b) => parseInt(a) + parseInt(b?.turn), 0n);
}

function totalTime(array) {
  return array?.reduce((a, b) => a + b?.timing, 0);
}

// 1034009035;
