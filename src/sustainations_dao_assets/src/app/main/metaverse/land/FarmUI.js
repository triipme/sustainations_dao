import "./styles.css";

const UIFarm = ({ Carrot, Wheat, Tomato }) => {
  return (
    <>
      <ul style={{ zIndex: 10000, position: "relative", width: "80vw" }}>
        <li>
          <div style={{ scale: 0.8 }}>
            <img src="metaverse/farm/Sustaination_farm/decor-object/PNG/Sustaination__farm-object-27.png"></img>
          </div>
        </li>
        <li>
          <div className="container" style={{ scale: 0.8 }}>
            <img style={{left: "0em"}} src="metaverse/farm/Sustaination_farm/decor-object/PNG/Sustaination__farm-object-35.png" />
            <div style={{
              position: "absolute",
              top: "50%",
              left: "4em",
              fontSize: "1.5vw",
              transform: "translate(-50%, -50%)"
            }}>{Wheat}</div>
          </div>
        </li>
        <li>
          <div className="container" style={{ scale: 0.8 }}>
            <img src="metaverse/farm/Sustaination_farm/decor-object/PNG/Sustaination__farm-object-34.png"></img>
            <div style={{
              position: "absolute",
              top: "50%",
              left: "4em",
              fontSize: "1.5vw",
              transform: "translate(-50%, -50%)"
            }}>{Carrot}</div>
          </div>
        </li>
        <li>
          <div className="container" style={{ scale: 0.8 }}>
            <img src="metaverse/farm/Sustaination_farm/decor-object/PNG/Sustaination__farm-object-33.png"></img>
            <div style={{
              position: "absolute",
              top: "50%",
              left: "4em",
              fontSize: "1.5vw",
              transform: "translate(-50%, -50%)"
            }}>{Tomato}</div>
          </div>
        </li>


        
        {/* <li>
          <img src="metaverse/farm/Sustaination_farm/decor-object/PNG/Sustaination__farm-object-31.png"></img>
        </li> */}
      </ul>
      {/* <div className="navBar">
        <img src="metaverse/farm/Sustaination_farm/decor-object/PNG/Sustaination__farm-object-32.png"></img>
      </div> */}
      {/* <div className="messengerBox">
        <img src="metaverse/farm/Sustaination_farm/decor-object/PNG/email.png"></img>
      </div> */}
    </>
  )
}

export default UIFarm; 