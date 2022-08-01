import { LoadingButton } from "@mui/lab";
import { Button } from "@mui/material";
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
  const handleClick = (id, value, setLoading) => {
    (async () => {
      try {
        setLoading(true);
        const rs = await actor.memoryCardEngineGameChangeStatus(id, value);
        if ("ok" in rs) {
          memoryCardEngineAllGames();
        } else {
          throw rs.err;
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  };
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
            rows={games.map(slug => ({ ...slug[1], gameId: slug[0] }))}
            columns={[
              {
                field: "gameId",
                headerName: "Id",
                flex: 1
              },
              ...Object.keys(games?.[0]?.[1]).map(key => ({
                field: key,
                headerName: key,
                flex: ["description", "name"].includes(key) ? 1 : 0,
                renderCell:
                  key !== "status"
                    ? undefined
                    : props => <ButtonStatus {...props} handleClick={handleClick} />
              }))
            ]}
          />
        </div>
      )}
    </>
  );
};
const ButtonStatus = props => {
  const [loading, setLoading] = useState(false);
  return (
    <LoadingButton
      loading={loading}
      variant="contained"
      onClick={() => props.handleClick(props.id, !props.value, setLoading)}>
      {String(props?.value)}
    </LoadingButton>
  );
};

export default AllGame;
