import { useState } from "react";
import "../styles.css";
let inventoryStatus = {};

const HotBar = ({ inventory, onUpdate }) => {
  function initialInventory(item) {
    for (const property in inventoryStatus) {
      if (property !== item) inventoryStatus[property] = false;
    }
  }
  const [color, setColor] = useState(-1);
  const [render, setRender] = useState(false);
  const [displayBuilding, setDisplayBuilding] = useState(false)
  const [displayPlant, setDisplayPlant] = useState(false)
  // Capacity = [..., ..., ..., ...,] 

  let path = "/metaverse/farm/Sustaination_farm/farm-object/PNG/";
  return (
    <div
      key={Math.floor(Math.random() * 9999999)}
      className="farmItem"
      style={{ overflowX: "auto" }}>

      <div
        className="imgItem"
        style={{
          border: inventoryStatus["dig"] == true ? "2px" : "0px",
          borderStyle: inventoryStatus["dig"] == true ? "dashed dashed dashed dashed" : "none"
        }}>
        <img
          onClick={() => {
            inventoryStatus["dig"] = !inventoryStatus["dig"];
            if (inventoryStatus["dig"] === true) onUpdate({ objectId: "dig" });
            else onUpdate({});
            initialInventory("dig");
            setRender(!render);
          }}
          src={"/metaverse/farm/Sustaination_farm/farm-object/PNG/shovel.png"}
          alt=""
        />
      </div>
      <div className="imgItem" style={{ backgroundColor: displayBuilding ? "yellow" : "none" }}>
        <img
          onClick={() => {
            setDisplayBuilding(!displayBuilding)
            setDisplayPlant(false)
          }}
          src={"/metaverse/farm25D/building/tempBuilding.png"}
          alt=""
          loading=""
        />
      </div>
      <ul style={{ display: displayBuilding ? "inline-block" : "none" }}>
        <div
          className="imgItem"
          style={{
            border: inventoryStatus["factory"] == true ? "2px" : "0px",
            borderStyle: inventoryStatus["factory"] == true ? "dashed dashed dashed dashed" : "none",
            width: "65px",
            height: "65px"
          }}>
          <img
            onClick={() => {
              inventoryStatus["factory"] = !inventoryStatus["factory"];
              if (inventoryStatus["factory"] === true) onUpdate({ objectId: "factory", amount: 1 });
              else onUpdate({});
              initialInventory("factory");
              setRender(!render);
            }}
            src={"/metaverse/farm25D/building/Factory.png"}
            alt=""
          />
        </div>
        <div
          className="imgItem"
          style={{
            border: inventoryStatus["Windmill"] == true ? "2px" : "0px",
            borderStyle: inventoryStatus["Windmill"] == true ? "dashed dashed dashed dashed" : "none",
            width: "65px",
            height: "65px"
          }}>
          <img
            onClick={() => {
              inventoryStatus["Windmill"] = !inventoryStatus["Windmill"];
              if (inventoryStatus["Windmill"] === true) onUpdate({ objectId: "Windmill", amount: 1 });
              else onUpdate({});
              initialInventory("Windmill");
              setRender(!render);
            }}
            src={"/metaverse/farm25D/building/Windmill.png"}
            alt=""
          />
        </div>
        <div
          className="imgItem"
          style={{
            border: inventoryStatus["Henhouse"] == true ? "2px" : "0px",
            borderStyle: inventoryStatus["Henhouse"] == true ? "dashed dashed dashed dashed" : "none",
            width: "65px",
            height: "65px"
          }}>
          <img
            onClick={() => {
              inventoryStatus["Henhouse"] = !inventoryStatus["Henhouse"];
              if (inventoryStatus["Henhouse"] === true) onUpdate({ objectId: "Henhouse", amount: 1 });
              else onUpdate({});
              initialInventory("Henhouse");
              setRender(!render);
            }}
            src={"/metaverse/farm25D/building/Henhouse.png"}
            alt=""
          />
        </div>
        <div
          className="imgItem"
          style={{
            border: inventoryStatus["Goathouse"] == true ? "2px" : "0px",
            borderStyle: inventoryStatus["Goathouse"] == true ? "dashed dashed dashed dashed" : "none",
            width: "65px",
            height: "65px"
          }}>
          <img
            onClick={() => {
              inventoryStatus["Goathouse"] = !inventoryStatus["Goathouse"];
              if (inventoryStatus["Goathouse"] === true) onUpdate({ objectId: "Goathouse", amount: 1 });
              else onUpdate({});
              initialInventory("Goathouse");
              setRender(!render);
            }}
            src={"/metaverse/farm25D/building/Goathouse.png"}
            alt=""
          />
        </div>
      </ul>
      <div className="imgItem" style={{ backgroundColor: displayPlant ? "yellow" : "none" }}>
        <img
          onClick={() => {
            setDisplayPlant(!displayPlant)
            setDisplayBuilding(false)
          }}
          src={"/metaverse/farm25D/plant/planticon.png"}
          alt=""
        />
      </div>
      <ul style={{ display: displayPlant ? "inline-block" : "none" }}>
        {inventory.length > 0 ? (
          <>
            {inventory.map((value, i) => {
              if (value.materialName !== "wood" && value.materialName !== "seed") {
                let pathItem = path + value.materialName + "-icon.png";
                return (
                  <div
                    className="imgItem"
                    key={i}
                    style={{
                      border:
                        i == color && inventoryStatus[value.materialName] == true ? "2px" : "0px",
                      borderStyle:
                        i == color && inventoryStatus[value.materialName] == true
                          ? "dashed dashed dashed dashed"
                          : "none"
                    }}>
                    <img
                      onClick={() => {
                        inventoryStatus[value.materialName] = !inventoryStatus[value.materialName];
                        if (inventoryStatus[value.materialName] === true)
                          onUpdate({
                            id: value.id,
                            objectId: value.materialId,
                            amount: value.amount
                          });
                        else onUpdate({});
                        initialInventory(value.materialName);
                        setRender(!render);
                        setColor(i);
                      }}
                      src={pathItem}
                      alt=""
                    />
                    <div className="top-right">{value.amount.toString()}</div>
                  </div>
                );
              } else {
                <></>;
              }
            })}
          </>
        ) : null}
      </ul>
    </div>
  );
};

export default HotBar;
