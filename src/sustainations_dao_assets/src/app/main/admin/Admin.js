import { useRef, useState } from "react";
import { Box, Button } from "@mui/material";
import { read, readFile, utils } from "xlsx";
import { DataGrid } from "@mui/x-data-grid";
import { LoadingButton } from "@mui/lab";
import { useSelector } from "react-redux";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
const Admin = () => {
  const [data, setData] = useState();
  const { actor } = useSelector(state => state.user);
  const ref = useRef(null);

  const handleButton = () => {
    ref.current.click();
  };
  const handleChange = event => {
    console.log("change");
    const promise = new Promise((resolve, reject) => {
      const reader = new FileReader();
      const resultData = [];
      reader.readAsArrayBuffer(event.target.files[0]);
      reader.addEventListener("load", e => {
        const wb = read(e.target.result, { type: "buffer" }); // workaround
        const wsnames = wb.SheetNames;
        console.log("====================================");
        console.log(wsnames);
        console.log("====================================");
        wsnames.forEach(function(wsname){
          const ws = wb.Sheets[wsname]; // get first worksheet
          const aoa = utils.sheet_to_json(ws); // get data as array of arrays
          var headers = {};
          var result = [];
          for(const z in ws) {
            if(z[0] === '!') continue;
            //parse out the column, row, and value
            var col = z.substring(0,1);
            var row = parseInt(z.substring(1));
            var value = ws[z].v;
            //store header names
            if(row == 1) {
                headers[col] = value;
                continue;
            };
            if(!result[row]) result[row]={};
            result[row][headers[col]] = value;
          };
          //drop those first two rows which are empty
          result.shift();
          result.shift();

          resultData.push(result);
          resolve(resultData);
          
        })
      });
      reader.addEventListener("error", e => {
        reject(e);
      });
    });
    promise
      .then(resultData => {
        setData(resultData);
      })
      .catch(err => {
        console.log(err);
      });
    };

  const handleSubmit = () => {
    const items = data[0];
    items.forEach(async(item)=>{
        try {
          if (!!actor?.createItem) {
            const rs = await actor.createItem(item);
            console.log("Create Items");
          console.log(rs);
        }
      } catch (error) {
        console.log(error);
      }
    });

    const quests = data[1];
    quests.forEach(async(quest)=>{
      try {
        if (!!actor?.createQuest) {
          const rs = await actor.createQuest(quest);
          console.log("Create Quest");
          console.log(rs);
        }
      } catch (error) {
        console.log(error);
      }
    });

    const events = data[2];
    events.forEach(async(event)=>{
      try {
        if (!!actor?.createEvent) {
          const rs = await actor.createEvent(event.questId, event);
          console.log("Create Events");
          console.log(rs);
        }
      } catch (error) {
        console.log(error);
      }
    });

    const eventOptions = data[3];
    eventOptions.forEach(async(eventOption)=>{
      try {
        if (!!actor?.createEventOption) {
          const rs = await actor.createEventOption(eventOption);
          console.log("Create Event Options");
          console.log(rs);
        }
      } catch (error) {
        console.log(error);
      }
    });

    const characterClasses = data[4];
    characterClasses.forEach(async(characterClass)=>{
      try {
        if (!!actor?.createCharacterClass) {
          const rs = await actor.createCharacterClass(characterClass);
          console.log("Create Character Class");
          console.log(rs);
        }
      } catch (error) {
        console.log(error);
      }
    });
  };  

  return (
    <>
      <input ref={ref} type="file" name="" id="upload-file-csv" hidden onChange={handleChange} />
      <Button
        variant={!data ? "contained" : "outlined"}
        onClick={handleButton}
        startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}>
        Add
      </Button>
      {data && (
        <LoadingButton sx={{ ml: 2 }} variant="contained" onClick={handleSubmit}>
          Submit
        </LoadingButton>
      )}
    </>
  )
}

export default Admin;