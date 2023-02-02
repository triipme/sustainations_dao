import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from "app/store/userSlice";
import { useLocation } from 'react-router-dom';
import { loadTileSlots } from '../LandApi';
import Loading from './loading';
import Back from './Back';
import Farm from './farm-layout/Farmfeatures';
import "./styles.css"
function FarmContainer() {
  const user = useSelector(selectUser);
  const { state: properties } = useLocation();
  const [farmFeatures, setFarmFeatures] = useState();
  const [farmProperties, setFarmProperties] = useState(properties);
  const [indexFarm, setIndexFarm] = useState(0)
  const [isDone, setIsDone] = useState(false)
  const [listFarm, setListFarm] = useState(0)
  useEffect(() => {
    (async () => {
      let myFarmProperties = (await user.actor.listUserLandSlots())?.ok
      if (myFarmProperties) {
        let myFarm = {
          id: myFarmProperties[indexFarm].id,
          zoneNumber: myFarmProperties[indexFarm].zoneNumber,
          zoneLetter: myFarmProperties[indexFarm].zoneLetter,
          i: myFarmProperties[indexFarm].indexRow,
          j: myFarmProperties[indexFarm].indexColumn,
        };
        setFarmProperties(myFarm);
        setFarmFeatures(await loadTileSlots(myFarm));
        setListFarm(Object.keys(myFarmProperties).length)
      }
      setIsDone(true)
    })();
  }, [indexFarm]);
  return (
    <>
      {isDone ?
        <div>
          {farmFeatures ? <>
            <Back />

            {indexFarm > 0 ? <button
              className="btn-farm"
              style={{ top: "250px", left: "50px" }}
              onClick={() => {
                setIsDone(false)
                setIndexFarm(indexFarm - 1)
              }}>
              Previous Farm
            </button> : <></>}
            {indexFarm < listFarm - 1 ? <button
              className="btn-farm"
              style={{ top: "250px", right: "50px" }}
              onClick={() => {
                setIsDone(false)
                setIndexFarm(indexFarm + 1)
              }}>
              Next Farm
            </button> : <></>}
            <Farm mapFeatures={farmFeatures} landSlotProperties={farmProperties} />
          </> : (
            <div style={{
              backgroundColor: "#111827", width: "100%", height: "100%", display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white"
            }}>
              <div>
                <Back />
                <img style={{

                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                  width: "50%"
                }} src="metaverse/sustainations-logo.png" />
                <h1 style={{ display: "block", textAlign: "center" }}>YOU DON'T HAVE ANY LAND SLOT !!!</h1><br></br>
                <h1 style={{ textAlign: "center", color: "white", cursor: "pointer", backgroundColor: "orange", margin: "0 200px" }} onClick={() => {
                  window.location.replace("/metaverse/land");
                }}>Click here to go to buy land slot</h1>
              </div>
            </div>
          )}
        </div>
        : (
          <Loading />)}
    </>)
}
export default FarmContainer;
