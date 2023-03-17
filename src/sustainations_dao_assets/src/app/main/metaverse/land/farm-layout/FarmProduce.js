import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useEffect, useState } from "react"
import { selectUser } from "app/store/userSlice";
import { listRecipesInfo } from "../../LandApi";
import "./farmproduce.css"
import { useSelector } from 'react-redux';
const FarmProduce = (props) => {
  const user = useSelector(selectUser);

  let path = "/metaverse/farm/Sustaination_farm/farm-object/PNG/"
  const [recipes, setRecipes] = useState([])
  const [rcp, setRcp] = useState({})
  const [num, setNum] = useState(-1)
  const [queue, setQueue] = useState([])
  const [loadingFarmProduce, setLoadingFarmProduce] = useState("");
  const style = {
    position: 'absolute',
    top: '42%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    borderRadius: "10px",
  };

  useEffect(() => {
    (async () => {
      console.log(await user.actor.listStash())
      console.log(await user.actor.listProductStorage())
      setRecipes(await listRecipesInfo(props.objectId));
      setQueue((await user.actor.listProductionQueueNodesInfo(props.objectId))?.ok)
    })()
  }, [loadingFarmProduce])

  if (queue.length != 0) {
    let t = (queue.filter(item => {
      return item.status !== "Completed"
    }))
    if (t.length != 0) {
      let tTime = (recipes.filter(item => {
        return t[0].recipeId == item.id
      }))
      var time = Number(t[0].remainingTime)
      var totalTime = Number(tTime[0].craftingTime)
    }
  }
  return (
    <div
      key={Math.floor(Math.random() * 9999999)}
    >
      {/* <Button sx={{ zIndex: 999999 }} onClick={handleOpen}>Open modal</Button> */}
      <Modal
        open={true}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="modal-header">
            <div className="close" onClick={() => { props.handlePopupFactory(false); }}><img src={"/metaverse/" + "close.png"} /></div>
            <h1 style={{
              position: "relative",
              top: "-32px",
              fontSize: "224.5%",
            }}>FACTORY</h1>

          </div>
          <div id="myProgress" style={{ textAlign: "center", alignItems: "center", border: "solid 1px", lineHeight: "28px" }}>
            {time ? <span style={{ position: "absolute" }}>{Math.round(time / 60, 0)} min</span> : <></>}
            <div id="myBar" style={{ width: String(time * 100 / totalTime) + "%" }}></div>
          </div>
          <div className="modal-body" style={{ background: "radial-gradient(circle, rgba(111,149,236,1) 0%, rgba(40,109,232,1) 100%)" }}>
            <div className="scrollmenu">
              {queue.map((item, idx) => {
                if (item.status == "Completed") {
                  return (
                    <a key={idx}
                      style={{
                        backgroundColor: "#9DC40E",
                        borderRadius: "10px",
                        marginRight: "14px",
                        marginTop: "14px",
                        boxShadow: "1px 1px 1px 1px rgb(0 0 0 / 28%)",
                      }}
                    ><img src={path + "craftingItem/" + item.itemName + ".png"} style={{ height: "100px" }} /> </a>
                  )
                } else {
                  return (
                    <a key={idx} style={{
                      backgroundColor: "#80cbc4",
                      borderRadius: "10px",
                      marginRight: "14px",
                      marginTop: "14px",
                      boxShadow: "1px 1px 1px 1px rgb(0 0 0 / 28%)",
                    }}><img src={path + "craftingItem/" + item.itemName + ".png"} style={{ height: "100px" }} /> </a>
                  )
                }
              })}
            </div>

          </div>
          <div className="modal-body" style={{
            height: "155px",
            background: "radial-gradient(circle, rgba(111,149,236,1) 0%, rgba(40,109,232,1) 100%)"
          }}>
            <div className="scrollmenu-chooser">
              {recipes.map((recipe, idx) => {
                return (
                  <a
                    key={Math.floor(Math.random() * 9999999)}
                    style={{
                      backgroundColor: idx == num ? "yellow" : "rgba(255, 255, 255, 0.3)",
                      borderRadius: "10px",
                      marginRight: "14px",
                      marginTop: "14px",
                      boxShadow: "1px 1px 1px 1px rgb(0 0 0 / 28%)",

                    }} onClick={() => {
                      setNum(idx)
                      setRcp(recipes[idx])
                    }}>

                    <img src={path + "craftingItem/" + recipe.itemName + ".png"} style={{ height: "100px" }} /><div className="text">
                      {recipe.recipeDetails.map(item => {
                        return (
                          <div key={Math.floor(Math.random() * 9999999)} className="cal">
                            <img src={path + item.productName + "-icon.png"} style={{ height: "100px" }} />
                            {item.currentAmount.toString()}/{item.requiredAmount.toString()}
                          </div>
                        )
                      })}
                    </div>
                  </a>)
              })}
            </div>
          </div>

          <div className="modal-footer" style={{ display: "flex" }}>
            <h3 style={{ backgroundColor: rcp.canCraft == true ? "#ffa200" : "#cccccc", }} onClick={async () => {
              if (rcp.canCraft === true && props.objectId !== "None") {
                setLoadingFarmProduce("craft")
                await user.actor.craftFromRecipe(props.objectId, rcp.id)
                setQueue((await user.actor.listProductionQueueNodesInfo(props.objectId))?.ok)
                setRecipes(await listRecipesInfo(props.objectId));
                setLoadingFarmProduce("")
                // setTileplant(await loadTileSlots(landSlotProperties));
              }
            }}>{loadingFarmProduce === "craft" ? <span>CRAFTING...</span> : <span>CRAFT</span>}
            </h3>

            <h3 style={{
              backgroundColor: queue.filter(item => {
                return item.status == "Completed"
              }).length > 0 ? "#ffa200" : "#cccccc",
            }}
              onClick={async () => {
                if (props.objectId !== "None" && queue.filter(item => {
                  return item.status == "Completed"
                }).length > 0) {
                  setLoadingFarmProduce("collect")
                  await user.actor.collectFromBuilding(props.objectId)
                  setQueue((await user.actor.listProductionQueueNodesInfo(props.objectId))?.ok)
                  setLoadingFarmProduce("")
                }
              }}
            >{loadingFarmProduce === "collect" ? <span>COLLECTING...</span> : <span>COLLECT</span>}</h3>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
//  update realtime every second reactjs
export default FarmProduce;