import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "app/store/userSlice";
import { useLocation } from "react-router-dom";
import { loadTileSlots } from "../LandApi";
import Loading from "./loading";
import Back from "./Back";
import Farm from "./farm-layout/Farmfeatures";
import "./styles.css";

const URL_IMAGE = {
  TempBuilding: "metaverse/farm25D/building_webp/tempBuilding.webp",
  Factory: "metaverse/farm25D/building_webp/Factory.webp",
  Windmill: "metaverse/farm25D/building_webp/Windmill.webp",
  Ground: "metaverse/farm25D/Ground.webp",
  Ground_Selected: "metaverse/farm25D/Ground_Selected.webp",
  newlyPlanted: "metaverse/farm25D/plant_webp/newlyPlanted.webp",
  Carrot_Seed_growing: "metaverse/farm25D/plant_webp/Carrot_Seed/Carrot_Seed_growing.webp",
  Carrot_Seed_fullGrown: "metaverse/farm25D/plant_webp/Carrot_Seed/Carrot_Seed_fullGrown.webp",
  Tomato_Seed_growing: "metaverse/farm25D/plant_webp/Tomato_Seed/Tomato_Seed_growing.webp",
  Tomato_Seed_fullGrown: "metaverse/farm25D/plant_webp/Tomato_Seed/Tomato_Seed_fullGrown.webp",
  Wheat_Seed_growing: "metaverse/farm25D/plant_webp/Wheat_Seed/Wheat_Seed_growing.webp",
  Wheat_Seed_fullGrown: "metaverse/farm25D/plant_webp/Wheat_Seed/Wheat_Seed_fullGrown.webp",
  Bean_Seed_growing: "metaverse/farm25D/plant_webp/Bean_Seed/Bean_Seed_growing.webp",
  Bean_Seed_fullGrown: "metaverse/farm25D/plant_webp/Bean_Seed/Bean_Seed_fullGrown.webp",
  Sugarcane_Seed_growing: "metaverse/farm25D/plant_webp/SugarCane_Seed/SugarCane_Seed_growing.webp",
  Sugarcane_Seed_fullGrown: "metaverse/farm25D/plant_webp/SugarCane_Seed/SugarCane_Seed_fullGrown.webp",
  Goathouse: "metaverse/farm25D/building_webp/Goathouse.webp",
  Henhouse: "metaverse/farm25D/building_webp/Henhouse.webp",
};



function FarmContainer() {
  const user = useSelector(selectUser);
  const { state: properties } = useLocation();
  const [farmFeatures, setFarmFeatures] = useState();
  const [farmProperties, setFarmProperties] = useState(properties);
  const [indexFarm, setIndexFarm] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [listFarm, setListFarm] = useState(0);
  const [listImg, setListImg] = useState({});

  const loadImage = useCallback((url, obj) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setListImg(prevState => ({
        ...prevState,
        [obj]: img
      }));
    };
  });

  useEffect(() => {
    (async () => {
      let myFarmProperties = (await user.actor.listUserLandSlots())?.ok;
      if (myFarmProperties) {
        let myFarm = {
          id: myFarmProperties[indexFarm].id,
          zoneNumber: myFarmProperties[indexFarm].zoneNumber,
          zoneLetter: myFarmProperties[indexFarm].zoneLetter,
          i: myFarmProperties[indexFarm].indexRow,
          j: myFarmProperties[indexFarm].indexColumn
        };
        setFarmProperties(myFarm);
        setFarmFeatures(await loadTileSlots(myFarm));
        setListFarm(Object.keys(myFarmProperties).length);
      }
      setIsDone(true);
    })();
    for (let key in URL_IMAGE) {
      loadImage(URL_IMAGE[key], key);
    }
  }, [indexFarm]);

  return (
    <>
      <meta name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"></meta>
      {isDone ? (
        <div>
          {farmFeatures ? (
            <>
              <Back />
              {indexFarm > 0 ? (
                <button
                  className="btn-farm"
                  style={{ top: "250px", left: "50px" }}
                  onClick={() => {
                    setIsDone(false);
                    setIndexFarm(indexFarm - 1);
                  }}>
                  Previous Farm
                </button>
              ) : (
                <></>
              )}
              {indexFarm < listFarm - 1 ? (
                <button
                  className="btn-farm"
                  style={{ top: "250px", right: "50px" }}
                  onClick={() => {
                    setIsDone(false);
                    setIndexFarm(indexFarm + 1);
                  }}>
                  Next Farm
                </button>
              ) : (
                <></>
              )}
              <Farm mapFeatures={farmFeatures} landSlotProperties={farmProperties} farmImages={listImg}/>
            </>
          ) : (
            <div
              style={{
                backgroundColor: "#111827",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white"
              }}>
              <div>
                <Back />
                <img
                  style={{
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                    width: "50%"
                  }}
                  src="metaverse/sustainations-logo.png"
                />
                <h1 style={{ display: "block", textAlign: "center" }}>
                  YOU DON'T HAVE ANY LAND SLOT !!!
                </h1>
                <br></br>
                <h1
                  style={{
                    textAlign: "center",
                    color: "white",
                    cursor: "pointer",
                    backgroundColor: "orange",
                    margin: "0 200px"
                  }}
                  onClick={() => {
                    window.location.replace("/metaverse/land");
                  }}>
                  Click here to go to buy land slot
                </h1>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}
export default FarmContainer;
