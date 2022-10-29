import "./styles.css";

const Loading = () => {
  return (
    <>
      <div className="containPopup" style={{ left: "37%", scale:"50%"}}>
        <div className="popupBoder" style={{ opacity: 1 }}>
          <img src="metaverse/sustainations-logo.png"></img>
          <img src="metaverse/loading.gif" style={{
            height: "25%", width: "25%", marginLeft: "37%"
          }}></img>
        </div>
      </div>
    </>
  )
}

export default Loading;