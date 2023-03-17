import { useRef, useState } from "react";
import { Box, Button } from "@mui/material";
import { read, readFile, utils } from "xlsx";
import { LoadingButton } from "@mui/lab";
import { useSelector } from "react-redux";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

const Metaverse = () => {
  const [data, setData] = useState();
  const { actor } = useSelector(state => state.user);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  const handleButton = () => {
    ref.current.click();
  };
  const handleChange = event => {
    console.log("change");
    const promise = new Promise((resolve, reject) => {
      const reader = new FileReader();
      const excelData = [];
      reader.readAsArrayBuffer(event.target.files[0]);
      reader.addEventListener("load", e => {
        const wb = read(e.target.result, { type: "buffer" }); // workaround
        const wsnames = wb.SheetNames;
        console.log("====================================");
        console.log(wsnames);
        console.log("====================================");
        wsnames.forEach(function (wsname) {
          const ws = wb.Sheets[wsname]; // get first worksheet
          const aoa = utils.sheet_to_json(ws); // get data as array of arrays
          var headers = {};
          var result = [];
          for (const z in ws) {
            if (z[0] === "!") continue;
            //parse out the column, row, and value
            var col = z.substring(0, 1);
            var row = parseInt(z.substring(1));
            var value = ws[z].v;
            //store header names
            if (row == 1) {
              headers[col] = value;
              continue;
            }
            if (!result[row]) result[row] = {};
            result[row][headers[col]] = value;
          }
          //drop those first two rows which are empty
          result.shift();
          result.shift();

          excelData.push(result);
          resolve(excelData);
        });
      });
      reader.addEventListener("error", e => {
        reject(e);
      });
    });
    promise
      .then(excelData => {
        setData(excelData);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const importData = (data, func) => {
    return new Promise(resolve => {
      const items = data;
      items.forEach(async item => {
        try {
          const rs = await func(item)
          if("ok" in rs) {
            console.log(rs);
          } else {
            console.log(rs?.err);
          }
        } catch (error) {
          console.log(error);
        }
      });
      resolve();
    });
  };

  const funcNames = [
    actor.createItem,
    actor.createQuest,
    actor.createCharacterClass,
    actor.createEvent,
    actor.createEventOption,
    actor.createQuestItem,
    actor.createMaterial,
    actor.createUsableItem,
    actor.createSeed,
    actor.createFarmEffect,
    actor.createLandEffect,
    actor.createBuildingType,
    actor.createAlchemyRecipe,
    actor.createAlchemyRecipeDetail,
    actor.createProduceRecipe,
    actor.createProduceRecipeDetail,
    actor.createProduct,
  ]

  const handleSubmit = async () => {
    setLoading(true);
    for (const index in funcNames) {
      await importData(data[index], funcNames[index]);
    }
    setLoading(false);
  };

  return (
    <>
      <input ref={ref} type="file" name="" id="upload-file-csv" hidden onChange={handleChange} />
      <Button
        variant={!data ? "contained" : "outlined"}
        onClick={handleButton}
        startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}>
        Upload file here
      </Button>
      {data && (
        <LoadingButton
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          loading={loading}>
          Submit
        </LoadingButton>
      )}
    </>
  );
};

export default Metaverse;
