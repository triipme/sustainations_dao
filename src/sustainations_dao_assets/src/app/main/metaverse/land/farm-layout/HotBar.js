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
    </div>
  );
};

export default HotBar;
