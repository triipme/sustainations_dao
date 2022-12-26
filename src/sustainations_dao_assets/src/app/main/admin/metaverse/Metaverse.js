import { useRef, useState } from "react";
import { Box, Button } from "@mui/material";
import { read, readFile, utils } from "xlsx";
import { LoadingButton } from "@mui/lab";
import { useSelector } from "react-redux";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { forEach } from "lodash";
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

  const createItem = () => {
    return new Promise(resolve => {
      const items = data[0];
      items.forEach(async item => {
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
      resolve();
    });
  };

  const createQuest = () => {
    return new Promise(resolve => {
      const quests = data[1];
      quests.forEach(async quest => {
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
      resolve();
    });
  };

  const createCharacterClass = () => {
    return new Promise(resolve => {
      const characterClasses = data[2];
      characterClasses.forEach(async characterClass => {
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
      resolve();
    });
  };

  const createEvent = () => {
    return new Promise(resolve => {
      const events = data[3];
      events.forEach(async event => {
        try {
          if (!!actor?.createEvent) {
            const rs = await actor.createEvent(event);
            console.log("Create Events");
            console.log(rs);
          }
        } catch (error) {
          console.log(error);
        }
      });
      resolve();
    });
  };

  const createEventOption = () => {
    return new Promise(resolve => {
      const eventOptions = data[4];
      eventOptions.forEach(async eventOption => {
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
      resolve();
    });
  };

  const createQuestItem = () => {
    return new Promise(resolve => {
      const questItems = data[5];
      questItems.forEach(async questItem => {
        try {
          if (!!actor?.createQuestItem) {
            const rs = await actor.createQuestItem(questItem);
            console.log("Create Quest Item");
            console.log(rs);
          }
        } catch (error) {
          console.log(error);
        }
      });
      resolve();
    });
  };

  const createMaterial = () => {
    return new Promise(resolve => {
      const materials = data[6];
      materials.forEach(async material => {
        try {
          if (!!actor?.createMaterial) {
            const rs = await actor.createMaterial(material);
            console.log("Create Material");
            console.log(rs);
          }
        } catch (error) {
          console.log(error);
        }
      });
      resolve();
    });
  };

  const createUsableItem = () => {
    return new Promise(resolve => {
      const usableItems = data[7];
      usableItems.forEach(async usableItem => {
        try {
          if (!!actor?.createUsableItem) {
            const rs = await actor.createUsableItem(usableItem);
            console.log("Create Usable Item");
            console.log(rs);
          }
        } catch (error) {
          console.log(error);
        }
      });
      resolve();
    });
  };

  const createSeed = () => {
    return new Promise(resolve => {
      const seeds = data[8];
      seeds.forEach(async seed => {
        try {
          if (!!actor?.createSeed) {
            const rs = await actor.createSeed(seed);
            console.log("Create Seed");
            console.log(rs);
          }
        } catch (error) {
          console.log(error);
        }
      });
      resolve();
    });
  };

  const createFarmEffect = () => {
    return new Promise(resolve => {
      const farmEffects = data[9];
      farmEffects.forEach(async farmEffect => {
        try {
          if (!!actor?.createFarmEffect) {
            const rs = await actor.createFarmEffect(farmEffect);
            console.log("Create Farm Effect");
            console.log(rs);
          }
        } catch (error) {
          console.log(error);
        }
      });
      resolve();
    });
  };

  const createLandEffect = () => {
    return new Promise(resolve => {
      const landEffects = data[10];
      landEffects.forEach(async landEffect => {
        try {
          if (!!actor?.createLandEffect) {
            const rs = await actor.createLandEffect(landEffect);
            console.log("Create Land Effect");
            console.log(rs);
          }
        } catch (error) {
          console.log(error);
        }
      });
      resolve();
    });
  };

  const createBuildingType = () => {
    return new Promise(resolve => {
      const buildingTypes = data[11];
      buildingTypes.forEach(async buildingType => {
        try {
          if (!!actor?.createBuildingType) {
            const rs = await actor.createBuildingType(buildingType);
            console.log("Create Building Type");
            console.log(rs);
          }
        } catch (error) {
          console.log(error);
        }
      });
      resolve();
    });
  };

  const createAlchemyRecipe = () => {
    return new Promise(resolve => {
      const alchemyRecipes = data[12];
      alchemyRecipes.forEach(async alchemyRecipe => {
        try {
          if (!!actor?.createAlchemyRecipe) {
            const rs = await actor.createAlchemyRecipe(alchemyRecipe);
            console.log("Create Alchemy Recipe");
            console.log(rs);
          }
        } catch (error) {
          console.log(error);
        }
      });
      resolve();
    });
  };

  const createAlchemyRecipeDetail = () => {
    return new Promise(resolve => {
      const alchemyRecipeDetails = data[13];
      alchemyRecipeDetails.forEach(async alchemyRecipeDetail => {
        try {
          if (!!actor?.createAlchemyRecipeDetail) {
            const rs = await actor.createAlchemyRecipeDetail(alchemyRecipeDetail);
            console.log("Create Alchemy Recipe Detail");
            console.log(rs);
          }
        } catch (error) {
          console.log(error);
        }
      });
      resolve();
    });
  };

  const createProduct = () => {
    return new Promise(resolve => {
      const products = data[14];
      products.forEach(async product => {
        try {
          if (!!actor?.createProduct) {
            const rs = await actor.createProduct(product);
            console.log("Create Product");
            console.log(rs);
          }
        } catch (error) {
          console.log(error);
        }
      });
      resolve();
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    await createItem();
    await createQuest();
    await createQuestItem();
    await createUsableItem();
    await createMaterial();
    await createEvent();
    await createEventOption();
    await createCharacterClass();
    await createSeed();
    await createFarmEffect();
    await createLandEffect();
    await createBuildingType();
    await createAlchemyRecipe();
    await createAlchemyRecipeDetail();
    await createProduct();
    console.log("DONE");
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
          sx={{ ml: 2 }}
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
