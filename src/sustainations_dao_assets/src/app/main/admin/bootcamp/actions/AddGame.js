import React, { useRef, useState } from "react";
import { Box, Button } from "@mui/material";
import { read, readFile, utils } from "xlsx";
import { DataGrid } from "@mui/x-data-grid";
import { LoadingButton } from "@mui/lab";
import { useSelector } from "react-redux";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

const AddGame = ({ onSuccess }) => {
  const ref = useRef(null);
  const [data, setData] = useState();
  const { actor } = useSelector(state => state.user);
  const handleButton = () => {
    ref.current.click();
  };
  const handleChange = event => {
    console.log("change");
    const promise = new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(event.target.files[0]);
      reader.addEventListener("load", e => {
        const wb = read(e.target.result, { type: "buffer" }); // workaround
        const wsname = wb.SheetNames[0];
        console.log("====================================");
        console.log(wsname);
        console.log("====================================");
        const ws = wb.Sheets[wsname]; // get first worksheet
        const aoa = utils.sheet_to_json(ws); // get data as array of arrays
        resolve(aoa);
      });
      reader.addEventListener("error", e => {
        reject(e);
      });
    });
    promise
      .then(aoa => {
        setData(aoa);
      })
      .catch(err => {
        console.log(err);
      });
  };
  const handleSubmitGame = async () => {
    try {
      if (!!actor?.memoryCardEngineImportExcel) {
        const rs = await actor.memoryCardEngineImportExcel(data);
        console.log(rs);
        onSuccess(true);
        setData();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <input ref={ref} type="file" name="" id="upload-file-csv" hidden onChange={handleChange} />
      <Box display="flex" justifyContent="end" mt={2} mr={2}>
        <Button
          variant={!data ? "contained" : "outlined"}
          onClick={handleButton}
          startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}>
          Add
        </Button>
        {data && (
          <LoadingButton sx={{ ml: 2 }} variant="contained" onClick={handleSubmitGame}>
            Submit Game
          </LoadingButton>
        )}
      </Box>
      {data && "cardId" in data?.[0] && (
        <div style={{ width: "100%", marginTop: 20 }}>
          <DataGrid
            getRowId={row => row.cardId}
            rows={data}
            autoHeight
            pagination
            disableColumnMenu
            pageSize={10}
            rowsPerPageOptions={[10]}
            columns={Object.keys(data?.[0]).map(key => ({
              field: key,
              headerName: key,
              flex: key === "cardData" ? 1 : 0
            }))}
          />
        </div>
      )}
    </div>
  );
};

export default AddGame;