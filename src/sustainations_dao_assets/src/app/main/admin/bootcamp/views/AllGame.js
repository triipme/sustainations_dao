import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const AllGame = ({ status }) => {
  const [games, setGames] = useState();
  const { actor } = useSelector(state => state.user);
  async function memoryCardEngineAllGames() {
    try {
      const rs = await actor.memoryCardEngineAllGames();
      if ("ok" in rs) {
        setGames(rs.ok);
      } else {
        throw rs.err;
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    memoryCardEngineAllGames();
  }, [status]);
  return (
    <>
      {games?.length > 0 && (
        <div style={{ width: "100%", marginTop: 20 }}>
          <DataGrid
            getRowId={row => row.gameId}
            autoHeight
            pagination
            disableSelectionOnClick
            disableColumnMenu
            pageSize={10}
            rowsPerPageOptions={[10]}
            rows={games.map(gameType => ({ ...gameType[1], gameId: gameType[0] }))}
            columns={[
              {
                field: "gameId",
                headerName: "Id",
                flex: 1
              },
              ...Object.keys(games?.[0]?.[1]).map(key => ({
                field: key,
                headerName: key,
                flex: ["description", "slug"].includes(key) ? 1 : 0
              }))
            ]}
          />
        </div>
      )}
    </>
  );
};

export default AllGame;
