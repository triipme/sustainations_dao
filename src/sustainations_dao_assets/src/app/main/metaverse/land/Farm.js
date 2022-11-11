import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "app/store/userSlice";
import { GeoJSON, useMap, useMapEvents, ImageOverlay, MapContainer } from "react-leaflet";
import "./styles.css";
import UIFarm from "./FarmUI";
import { subtractInventory, loadTileSlots, listInventory, plantTree } from "../LandApi";
import Land from "./Land";
import BigMap from "./BigMap";
import Loading from "./loading";
import { useLocation, useNavigate } from "react-router-dom";

var inventoryStatus = { dig: false };

const Farm = ({ mapFeatures, landSlotProperties }) => {
  const user = useSelector(selectUser);
  const [tileplant, setTileplant] = useState(mapFeatures);
  const [inventory, setInventory] = useState([]);
  const [characterId, setChacterId] = useState("");
  const map = useMap();
  const navigate = useNavigate();
  useEffect(() => {
    const load = async () => {
      const characterid = await user.actor.readCharacter();
      setChacterId(characterid.ok[0]);
      const inv = await listInventory(characterid.ok[0]);
      setInventory(inv.ok);
    };
    load(); // run it, run it
    map.setView(
      [
        Number(tileplant[0].geometry.coordinates[0][0][1]),
        Number(tileplant[0].geometry.coordinates[0][0][0])
      ],
      17
    );
  }, []);
  useEffect(() => {
    const loadinventoryStatus = async () => {
      for (let i = 0; i < inventory.length; i++) {
        if (inventory[i].materialName !== "wood" && inventory[i].materialName !== "seed") {
          inventoryStatus[inventory[i].materialName] = false;
        }
      }
    };
    loadinventoryStatus();
  }, [inventory]);

  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(async () => {
      setTime(Date.now());
      let tile = await loadTileSlots(landSlotProperties);
      setTileplant(tile);
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  const latlng = useMemo(
    () =>
      tileplant?.map(feature => {
        return feature.geometry.coordinates[0].map(item => {
          return [item[1], item[0]];
        });
      }),
    []
  );

  const onEachLandSlot = (country, layer) => {
    layer.setStyle({
      color: "#FFFFFF",
      fillColor: "#FFFFFF",
      fillOpacity: "0.1"
    });
    layer.on({
      click: async e => {
        for (let i = 0; i < inventory.length; i++) {
          if (
            inventoryStatus[inventory[i].materialName] === true &&
            country.properties.name === "None" &&
            inventory[i].amount > 0
          ) {
            console.log(
              "Plant tree status: ",
              await plantTree(
                country.properties.landId,
                country.properties.i,
                country.properties.j,
                inventory[i].materialId
              )
            );
            await subtractInventory(inventory[i].id);
            let tile = await loadTileSlots(landSlotProperties);
            let inv = await listInventory(characterId);
            setTileplant(tile);
            setInventory(inv.ok);
          }
        }
      }
    });
  };
  return (
    <>
      <GeoJSON
        key={Math.floor(Math.random() * 9999)}
        data={tileplant}
        onEachFeature={onEachLandSlot}
      />
      <CreateBound {...{ latlng, tileplant }}></CreateBound>
      <UIFarm></UIFarm>
      <Inventory inventory={inventory}></Inventory>
      {/* <ShowPlant inventory={inventory}></ShowPlant> */}
      <button
        className="button-85"
        style={{ top: "250px" }}
        onClick={() => {
          navigate("/metaverse/land");
        }}>
        Go to map mode
      </button>
    </>
  );
};

const Inventory = ({ inventory }) => {
  function initialInventory(item) {
    for (const property in inventoryStatus) {
      if (property !== item) inventoryStatus[property] = false;
    }
  }
  let path = "/metaverse/farm/Sustaination_farm/farm-object/PNG/";
  return (
    <div className="farmItem">
      <div className="imgItem" key={101}>
        <img
          onClick={() => {
            inventoryStatus["dig"] = !inventoryStatus["dig"];
            initialInventory("dig");
          }}
          src={"/metaverse/farm/Sustaination_farm/farm-object/PNG/shovel.png"}
          alt=""
        />
      </div>
      {inventory.length > 0 ? (
        <>
          {inventory.map((key, value) => {
            if (key.materialName !== "wood" && key.materialName !== "seed") {
              let pathItem = path + key.materialName + "-icon.png";
              return (
                <div className="imgItem" key={value}>
                  <img
                    onClick={() => {
                      inventoryStatus[key.materialName] = !inventoryStatus[key.materialName];
                      initialInventory(key.materialName);
                    }}
                    src={pathItem}
                    alt=""
                  />
                  <div className="top-right">{key.amount.toString()}</div>
                </div>
              );
            } else {
              <></>;
            }
          })}
        </>
      ) : null}
    </div>
  );
};

const CreateBound = ({ latlng, tileplant }) => {
  let path = "metaverse/farm/Sustaination_farm/farm-object/PNG/";
  return (
    <>
      {tileplant?.map((tag, value) => {
        let pathItem = path + tag.properties.status + "-" + tag.properties.name + ".png";

        if (tag.properties.name === "None") {
          return (
            <ImageOverlay
              key={value}
              url={"metaverse/farm/Sustaination_farm/farm-tiles/Farm-Tiles-05.png"}
              bounds={[
                [tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]],
                [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]
              ]}
            />
          );
        } else if (tag.properties.status === "newlyPlanted") {
          return (
            <ImageOverlay
              key={value}
              url={"metaverse/farm/Sustaination_farm/farm-object/PNG/newlyPlanted.png"}
              bounds={[
                [tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]],
                [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]
              ]}
            />
          );
        } else {
          return (
            <ImageOverlay
              key={value}
              url={pathItem}
              bounds={[
                [tag.geometry.coordinates[0][1][1], tag.geometry.coordinates[0][1][0]],
                [tag.geometry.coordinates[0][3][1], tag.geometry.coordinates[0][3][0]]
              ]}
            />
          );
        }
      })}
    </>
  );
};

function FarmContainer() {
  const { state: properties } = useLocation();
  const [farmFeatures, setFarmFeatures] = useState();
  const [farmProperties, setFarmProperties] = useState(properties);
  useEffect(() => {
    (async () => {
      let myFarmProperties = farmProperties;
      if (!farmProperties) {
        // if not click from land page ,then get my first land
        myFarmProperties = {
          id: "ce5rw-6vk5m-apk4a-hzex3-csd2n-wmsgi-6uzcn-rgf54-epapm-5ozzf-3qe",
          zoneNumber: 20n,
          zoneLetter: "N",
          i: 409n,
          j: 598n
        };
        setFarmProperties(myFarmProperties);
      }
      setFarmFeatures(await loadTileSlots(myFarmProperties));
    })();
  }, []);
  return (
    <Land>
      {farmFeatures ? (
        <>
          <BigMap />
          <Farm mapFeatures={farmFeatures} landSlotProperties={farmProperties} />
        </>
      ) : (
        <Loading />
      )}
    </Land>
  );
}

export default FarmContainer;
