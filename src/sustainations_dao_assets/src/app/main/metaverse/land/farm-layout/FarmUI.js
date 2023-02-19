import "../styles.css";
const UIFarm = (props) => {
  const warehouses = [0, 0, 0]
  props.warehouses.map(product => {
    switch (product.productName) {
      case "Wheat":
        warehouses[0] = product.amount;
        break;
      case "Carrot":
        warehouses[1] = product.amount;
        break;
      case "Tomato":
        warehouses[2] = product.amount;
        break;
    }
  })
  return (
    <>
      {
        <ul style={{
          position: "fixed",
          left: "50%",
          zIndex: "0",
          height: "80px",
          width: "79%",
          transform: "translateX(-50%)",
          top: "8%",
        
        }} key={Math.floor(Math.random() * 9999999)}>
          <li>
            <div style={{ scale: 0.8 }}>
              <img src="metaverse/farm/Sustaination_farm/decor-object/PNG/Sustaination__farm-object-27.png"></img>
            </div>
          </li>
          <li>
            <div className="container" style={{ scale: 0.8 }}>
              <img style={{ left: "0em" }} src="metaverse/farm/Sustaination_farm/decor-object/PNG/Sustaination__farm-object-35.png" />
              <div style={{
                position: "absolute",
                top: "50%",
                left: "4em",
                fontSize: "1.5vw",
                transform: "translate(-50%, -50%)"
              }}>{Number(warehouses[0])}</div>
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
              }}>{Number(warehouses[1])}</div>
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
              }}>{Number(warehouses[2])}</div>
            </div>
          </li>


          {/* <li>
          <img src="metaverse/farm/Sustaination_farm/decor-object/PNG/Sustaination__farm-object-31.png"></img>
        </li> */}
        </ul>
      }
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