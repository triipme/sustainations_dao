import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectUser, setUser } from 'app/store/userSlice';
import { useEffect, useState } from "react";
import FullFeaturedCrudGrid from "./FullFeaturedCrudGrid";


const EditScene =  () => {
  const user = useSelector(selectUser);
  const routeParams = useParams();
  const { sceneId } = routeParams;

  const [editScene, setEditScene] = useState({})
  const [event, setEvent] = useState({})
  // const [option, setOption] = useState([])

  useEffect( async () => {
    const sceneInfo = (await user.actor.readSceneEngine(sceneId))?.ok
    setEditScene(sceneInfo)
    // const eventInfo = (await user.actor.readEventEngine(sceneInfo.idEvent))?.ok
    const eventInfo = (await user.actor.getAllEventOptionEngines(sceneInfo.idEvent))?.ok
    setEvent(eventInfo)
    // const optionInfo = (await user.actor.readEventEngine(eventInfo.idEvent))?.ok
    // setOption(optionInfo)
  }, []);
  console.log("readSceneEngine: ")
  console.log(editScene)
  console.log("Event: ")
  console.log(event)


  return (
    <div><FullFeaturedCrudGrid rows={event}/></div>
  )
}

export default EditScene;