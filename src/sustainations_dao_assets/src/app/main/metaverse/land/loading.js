import "./styles.css";
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';

const Loading = () => {
  return (
    <>
      <BrowserView>
        <div className="containPopup" style={{
          scale: "50%",
          position: "absolute ",
          top: "10%",
          left: "25%"
        }}>
          <div className="popupBoder" style={{ opacity: 1 }}>
            <img src="metaverse/sustainations-logo.png"></img>
            <img src="metaverse/loading.gif" style={{
              height: "25%", width: "25%", marginLeft: "37%"
            }}></img>
          </div>
        </div>
      </BrowserView>
      <MobileView>
        <div className="containPopup" style={{
              left: "-30%",
              scale: "50%",
              top: "5%"
        }}>
          <div className="popupBoder" style={{ opacity: 1 }}>
            <img src="metaverse/sustainations-logo.png"></img>
            <img src="metaverse/loading.gif" style={{
              height: "25%", width: "25%", marginLeft: "37%"
            }}></img>
          </div>
        </div>
      </MobileView>
    </>
  )
}

export default Loading;