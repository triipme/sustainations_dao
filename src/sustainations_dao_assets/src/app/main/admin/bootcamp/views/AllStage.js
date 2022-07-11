import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const AllStage = () => {
  const [stages, setStages] = useState();
  const { actor } = useSelector(state => state.user);
  async function memoryCardEngineAllStages() {
    try {
      const rs = await actor.memoryCardEngineAllStages();
      if ("ok" in rs) {
        setStages(rs.ok);
      } else {
        throw rs.err;
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    memoryCardEngineAllStages();
  }, []);
  return (
    <>
      {stages?.length > 0 && (
        <div style={{ width: "100%", marginTop: 20 }}>
          <DataGrid
            getRowId={row => row.stageId}
            autoHeight
            pagination
            disableColumnMenu
            pageSize={10}
            rowsPerPageOptions={[10]}
            rows={stages.map(stage => ({ ...stage[1], stageId: stage[0] }))}
            columns={Object.keys(stages?.[0]?.[1]).map(key => ({
              field: key,
              headerName: key
            }))}
          />
        </div>
      )}
    </>
  );
};

export default AllStage;
