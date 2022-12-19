import "./styles.css";
const Loading = () => {
  return (
    <>
      <div style={{
        backgroundColor: "#111827", width: "100%", height: "100%", display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white"
      }}>
        <div style={{ width: "120px" }}>
          <img style={{
            width: "120px",
            height: "120px",
            display: "block"
          }} src="metaverse/sustainations-logo.png" />
          <h4 style={{
            width: "120px",
            display: "block",
            margin: "20px 0",
            textAlign: "center"
          }}>PLEASE WAIT</h4>
          <img style={{
            width: "50px",
            height: "50px",
            marginLeft: "35px",
            display: "block"
          }} src="metaverse/loading.gif">
          </img>
        </div>
      </div>
    </>
  )
}

export default Loading;