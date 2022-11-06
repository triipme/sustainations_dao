import "./styles.css";
import FuseLoading from "@fuse/core/FuseLoading";
const Loading = () => {
  return (
    <>
      <div style={{
        backgroundColor: "#111827", width: "100%", height: "100%", display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white"
      }}>
        <div style={{width: "120px" }}>
          <img style={{
            width: "120px",
            height: "120px",
            display: "block"
          }} src="metaverse/sustainations-logo.png" />
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