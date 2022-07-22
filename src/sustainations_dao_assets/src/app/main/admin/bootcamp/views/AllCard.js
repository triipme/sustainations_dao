import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const AllCard = ({ status }) => {
  const [cards, setCards] = useState();
  const { actor } = useSelector(state => state.user);
  async function memoryCardEngineAllCards() {
    try {
      const rs = await actor.memoryCardEngineAllCards();
      if ("ok" in rs) {
        setCards(rs.ok);
      } else {
        throw rs.err;
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    memoryCardEngineAllCards();
  }, [status]);
  return (
    <>
      {cards?.length > 0 && (
        <div style={{ width: "100%", marginTop: 20 }}>
          <DataGrid
            getRowId={row => row.cardId}
            autoHeight
            pagination
            disableSelectionOnClick
            disableColumnMenu
            pageSize={10}
            rowsPerPageOptions={[10]}
            rows={cards.map(card => ({ ...card[1], cardId: card[0] }))}
            columns={[
              {
                field: "cardId",
                headerName: "Id",
                flex: 1
              },
              ,
              ...Object.keys(cards?.[0]?.[1]).map(key => ({
                field: key,
                headerName: key,
                flex: ["data", "stageId"].includes(key) ? 1 : 0
              }))
            ]}
          />
        </div>
      )}
    </>
  );
};

export default AllCard;
