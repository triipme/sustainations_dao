import history from "@history";
import { useEffect } from "react";

const AR = () => {
  function handleMessage(e) {
    if (e.data === "model--clicled") {
      console.log(e);
      history.back();
    }
  }
  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  });
  return (
    <div
      dangerouslySetInnerHTML={{
        __html:
          '<iframe src="https://mavis2103.github.io/react-three/" frameborder="0" style="width: 100vw; height:99vh" allowFullScreen allow="camera;geolocation;"></iframe>'
      }}></div>
  );
};
export default AR;
