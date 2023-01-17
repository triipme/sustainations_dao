import { useState, useEffect } from 'react';
import _ from '@lodash';
import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/system/Box';
import BasicTable from './Table'
import {
  Avatar,
  Button,
  Card,
  CardContent,
  TextField,
} from '@mui/material';

import {
  createQuestEngine,
  createEventEngine,
  createScene,
  createAllEventOptionEngine,
  getAllScenes
} from '../../metaverse/GameApi';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import { v4 as uuid } from 'uuid'

import { useSelector, useDispatch } from "react-redux";
import { selectUser, setUser } from 'app/store/userSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { setOptions } from 'leaflet';
import SceneTable from './SceneTable';
import RowOrderingGrid from './DragTable';
import DragDrop from './DragDrop';
import { useNavigate } from 'react-router-dom';

// AWS3
const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  region: process.env.S3_REGION,
});

var s3Bucket = new AWS.S3({ params: { Bucket: process.env.S3_BUCKET } });

const QuestEngine = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  let idQuest = uuid()
  const idEvent = uuid()
  const idScene = uuid()

  // const [openOptions, setOpenOptions] = useState(false);

  const { control, handleSubmit, formState } = useForm({
    mode: 'onChange',
    defaultValues: {
      idQuest: idQuest,
      idEvent: idEvent,
      idScene: idScene,
      quest: {
        name: '',
        price: 0,
        description: ''
      },
      imageQuest: {
        base64data: '',
        path: ''
      },
      scene: {
        location: '',
        destination: '',
        description: '',
        location: '',
        destination: '',
        imageFront: {
          base64data: '',
          path: '',
        },
        imageMid: {
          base64data: '',
          path: '',
        },
        imageBack: {
          base64data: '',
          path: '',
        },
        imageObstacle: {
          base64data: '',
          path: '',
        },
      }

    }
  });
  const onSubmit = async (data) => {
    console.log("data: ", data)
    console.log(data.questEventName, "quest event name")
    setLoading(true);
    try {
      //get quest id
      let checkCreateQuest = await user.actor.checkCreatedQuestOfUser()
      idQuest = checkCreateQuest.ok?.id;
      // console.log("idQuet: ", idQuest)
      console.log("checkCreateQuest", checkCreateQuest)
      if (idQuest != undefined) {
        //EVENT
        let event = {
          id: data.idEvent,
          questId: idQuest,
          description: data.scene.description,
          locationName: data.scene.location,
          destinationName: data.scene.destination
        };
        // console.log("quétId: ", idQuest)
        // console.log("event: ", event)
        const resultEvent = await user.actor.createEventEngine(event);

        //SCENE
        let scene = {
          id: data.idScene,
          idEvent: data.idEvent,
          idQuest: idQuest,
          front: data.scene.imageFront.path,
          mid: data.scene.imageMid.path,
          back: data.scene.imageBack.path,
          obstacle: data.scene.imageObstacle.path
        }
        if (scene.front == "" || scene.mid == "" || scene.back == "" || scene.obstacle == "") {
          dispatch(showMessage({ message: 'Required fields cannot be left blank.' }));
          return;
        }
        const resultScene = await createScene(scene);

        if ('Success' == resultScene) {
          let bufFront = Buffer.from(data.scene.imageFront.base64data, 'base64')
          let bufMid = Buffer.from(data.scene.imageMid.base64data, 'base64')
          let bufBack = Buffer.from(data.scene.imageBack.base64data, 'base64')
          let bufObstacle = Buffer.from(data.scene.imageObstacle.base64data, 'base64')
          let dataImageFront = {
            Key: data.scene.imageFront.path,
            Body: bufFront,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg'
          };
          let dataImageMid = {
            Key: data.scene.imageMid.path,
            Body: bufMid,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg'
          };
          let dataImageBack = {
            Key: data.scene.imageBack.path,
            Body: bufBack,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg'
          };
          let dataImageObstacle = {
            Key: data.scene.imageObstacle.path,
            Body: bufObstacle,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg'
          };
          s3Bucket.putObject(dataImageFront, function (err, data) {
            if (err) {
              console.log('Error uploading data!');
            } else {
              console.log('Successfully uploaded the image front!');
            }
          });
          s3Bucket.putObject(dataImageMid, function (err, data) {
            if (err) {
              console.log('Error uploading data!');
            } else {
              console.log('Successfully uploaded the image mid!');
            }
          });
          s3Bucket.putObject(dataImageBack, function (err, data) {
            if (err) {
              console.log('Error uploading data!');
            } else {
              console.log('Successfully uploaded the image back!');
            }
          });
          s3Bucket.putObject(dataImageObstacle, function (err, data) {
            if (err) {
              console.log('Error uploading data!');
            } else {
              console.log('Successfully uploaded the image obstacle!');
            }
          });
        }
        console.log("test: ", resultEvent, resultScene)
        let createOptions = await createAllEventOptionEngine(data.idEvent, options);
        console.log("createOptions", createOptions)
        dispatch(showMessage({ message: 'Success!' }));
        // setSceneInfoOutside(true)
      }
      else {
        console.log("quest not found")
      }
    }
    catch (err) {
      console.log(err)
      dispatch(showMessage({ message: 'Error!' }));
    }
    setLoading(false);
  };

  const onSubmitQuest = async (data) => {
    setLoading(true);
    try {
      let checkCreateQuest = await user.actor.checkCreatedQuestOfUser()
      console.log("price: ", checkCreateQuest.ok?.price)
      if (checkCreateQuest.ok?.id == undefined) {
        // QUEST ENGINE
        let quest = {
          id: data.idQuest,
          name: "",
          price: parseFloat(data.quest.price) * 100000000,
          description: "",
          images: ""
        }
        let resultEngine = await user.actor.createQuestEngine(quest);
        console.log("resultEngine ", resultEngine)
      }
      else {
        let questEngine = (await user.actor.readQuestEngine(checkCreateQuest.ok?.id)).ok;
        console.log("questEngine: ", questEngine)
        let quest = {
          id: questEngine.id,
          userId: questEngine.userId,
          name: questEngine.name,
          price: parseFloat(data.quest.price) * 100000000,
          description: questEngine.description,
          images: questEngine.images,
          isActive: questEngine.isActive,
          dateCreate: questEngine.dateCreate,
          listScene: questEngine.listScene
        }
        let resultEngine = await user.actor.updateQuestEngine(quest);
        console.log("updatedEngine ", resultEngine)
      }
    }
    catch (err) {
      console.log(err)
      dispatch(showMessage({ message: 'Error!' }));
    }
    setLoading(false);
  }

  //New Option
  const [option, setOption] = useState({ option: '', hp: 0.0, stamina: 0.0, mana: 0.0, morale: 0.0 })
  const [options, setOptions] = useState([])

  const handleAdd = () => {
    if (option !== null) {
      setOptions(prev => [...prev, option])
      setOption({ option: '', hp: 0, stamina: 0, mana: 0, morale: 0 })
    }
  }


  //View all Scene
  const [viewAll, setViewAll] = useState({})
  const [openScene, setOpenScene] = useState(false)
  const handleView = async () => {
    let checkCreateQuest = await user.actor.checkCreatedQuestOfUser()
    idQuest = checkCreateQuest.ok?.id
    console.log("idQuest", idQuest)
    let allScene = await getAllScenes(idQuest)
    setViewAll(allScene)
    setOpenScene(!openScene)
  }

  const [id, setId] = useState()

  useEffect(() => {
    const fetchData = async () => {
      try {
        let checkCreateQuest = await user.actor.checkCreatedQuestOfUser()
        idQuest = checkCreateQuest.ok?.id
        setId(idQuest)
      } catch (err) {
        console.error(err)
      }
    }
    fetchData();
  }, []);

  // const sceneInfoOutside = handleView();

  const navigate = useNavigate();

  const handleReview = () => {
    navigate(`/metaverse/quest-design/${id}/preview`);
  };


  const [error, setError] = useState(null);
  const validatePrice = (value) => {
    if (value < 0.0004) {
      setError("Quest price must be greater than 0.0004 ICP");
      return "Quest price must be greater than 0.0004 ICP";
    }
    return true;
  };


  return (
    <div className="relative flex flex-col flex-auto items-center">
      {/* ================= Scene 1 ================= */}
      <div className="w-full max-w-7xl">
        <Card className="w-full py-32 mx-auto mt-24 rounded-2xl shadow">
          <CardContent className="p-24 pt-0 sm:p-48 sm:pt-0">
            <Typography className="mt-32 mb-16 text-3xl font-bold tracking-tight leading-tight">
              YOUR QUEST DESIGN!
            </Typography>
            <Typography className="mt-32 mb-16 text-3xl font-bold tracking-tight leading-tight">
              Quest
            </Typography>

            {/* ===== location ===== */}
            <Controller
              control={control}
              name="quest.price"
              render={({ field }) => (
                <TextField
                  type='number'
                  className="mt-32"
                  {...field}
                  label="Quest Price"
                  placeholder="Min 0.0004 ICP"
                  // id="questName"
                  variant="outlined"
                  fullWidth
                  required
                  min={0.0004}
                  error={error !== null}
                  helperText={error}
                  onBlur={() => setError(null)}
                  // onChange={() => setError(null)}
                />
              )}
              rules={{ validate: validatePrice }}
            />
            <Controller
              control={control}
              name="scene.description"
              render={({ field }) => (
                <TextField
                  className="mt-32"
                  {...field}
                  label="Transaction Fee"
                  value="2%"
                  variant="outlined"
                  fullWidth
                  disabled
                />
              )}
            />

            <br></br>
            <div style={{ marginTop: "20px" }}>
              <LoadingButton
                className="ml-8"
                variant="contained"
                color="secondary"
                loading={loading}
                onClick={handleSubmit(onSubmitQuest)}
              >
                Save
              </LoadingButton>
            </div>


            <Typography className="mt-32 mb-16 text-3xl font-bold tracking-tight leading-tight">
              Event
            </Typography>

            {/* ===== location ===== */}
            <Controller
              control={control}
              name="scene.description"
              render={({ field }) => (
                <TextField
                  className="mt-32"
                  {...field}
                  label="Question"
                  placeholder="Question"
                  // id="questName"
                  variant="outlined"
                  fullWidth
                  required
                />
              )}
            />
            {/* <br> */}
            <br></br>
            <br></br>

            <Typography className="mt-32 mb-16 text-3xl font-bold tracking-tight leading-tight">
              Add option
            </Typography>

            <form>
              <TextField required type='text' value={option.option || ''} className="mt-32" label="Option" placeholder="Option" variant="outlined" fullWidth
                onChange={e => setOption({ ...option, option: e.target.value })}
              />
              {/* <TextField type='number' value={option.hp || 0.0} placeholder="HP" onChange={e => setOption({ ...option, hp: parseInt(e.target.value) })} className="mt-32" label="HP" variant="outlined" fullWidth></TextField>
              <TextField type='number' value={option.stamina || 0.0} placeholder="Stamina" onChange={e => setOption({ ...option, stamina: parseInt(e.target.value) })} className="mt-32" label="Stamina" variant="outlined" fullWidth></TextField>
              <TextField type='number' value={option.mana || 0.0} placeholder="Mana" onChange={e => setOption({ ...option, mana: parseInt(e.target.value) })} className="mt-32" label="Mana" variant="outlined" fullWidth></TextField>
              <TextField type='number' value={option.morale || 0.0} placeholder="Morale" onChange={e => setOption({ ...option, morale: parseInt(e.target.value) })} className="mt-32" label="Morale" variant="outlined" fullWidth></TextField> */}
              <TextField type='number' required placeholder="HP" onChange={e => setOption({ ...option, hp: parseInt(e.target.value) })} className="mt-32" label="HP" variant="outlined" fullWidth></TextField>
              <TextField type='number' required placeholder="Stamina" onChange={e => setOption({ ...option, stamina: parseInt(e.target.value) })} className="mt-32" label="Stamina" variant="outlined" fullWidth></TextField>
              <TextField type='number' required placeholder="Mana" onChange={e => setOption({ ...option, mana: parseInt(e.target.value) })} className="mt-32" label="Mana" variant="outlined" fullWidth></TextField>
              <TextField type='number' required placeholder="Morale" onChange={e => setOption({ ...option, morale: parseInt(e.target.value) })} className="mt-32" label="Morale" variant="outlined" fullWidth></TextField>

              <br></br>
              <br></br>


              {option.option ?
                <Button className="ml-auto" color="secondary" variant="contained" onClick={handleAdd}>
                  Add Option
                </Button> : ""}

            </form>
            <br></br>
            <br></br>

            {options.length != 0 ? <BasicTable rows={options} /> : <></>}



            {/* ===== FRONT ===== */}
            <Controller
              control={control}
              name="scene.imageFront"
              render={({ field: { onChange } }) => (
                <Box
                  className='mt-32'
                >
                  <div>
                    <h3>Image Front *</h3>
                    <input
                      required
                      accept="image/*"
                      type="file"
                      onChange={async (e) => {
                        function readFileAsync() {
                          return new Promise((resolve, reject) => {
                            const file = e.target.files[0];
                            file.preview = URL.createObjectURL(file)
                            // setAvatar(file)
                            if (!file) {
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = () => {
                              resolve({
                                base64data: `${btoa(reader.result)}`,
                                path: `development/quests/scene/front/${idScene}`
                              });
                            };
                            reader.onerror = reject;
                            reader.readAsBinaryString(file);
                          });
                        }
                        const newImage = await readFileAsync();
                        onChange(newImage)
                      }}
                    />
                  </div>
                </Box>
              )}
            />
            {/* ===== MID ===== */}
            <Controller
              control={control}
              name="scene.imageMid"
              render={({ field: { onChange } }) => (
                <Box
                  className='mt-32'
                >
                  <div>
                    <h3>Image Mid *</h3>
                    <input
                      required
                      accept="image/*"
                      type="file"
                      onChange={async (e) => {
                        function readFileAsync() {
                          return new Promise((resolve, reject) => {
                            const file = e.target.files[0];
                            file.preview = URL.createObjectURL(file)
                            // setAvatar(file)
                            if (!file) {
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = () => {
                              resolve({
                                base64data: `${btoa(reader.result)}`,
                                path: `development/quests/scene/mid/${idScene}`
                              });
                            };
                            reader.onerror = reject;
                            reader.readAsBinaryString(file);
                          });
                        }
                        const newImage = await readFileAsync();
                        onChange(newImage)
                      }}
                    />
                  </div>
                </Box>
              )}
            />
            {/* ===== BACK ===== */}
            <Controller
              control={control}
              name="scene.imageBack"
              render={({ field: { onChange } }) => (
                <Box
                  className='mt-32'
                >
                  <div>
                    <h3>Image Back *</h3>
                    <input
                      required
                      accept="image/*"
                      type="file"
                      onChange={async (e) => {
                        function readFileAsync() {
                          return new Promise((resolve, reject) => {
                            const file = e.target.files[0];
                            file.preview = URL.createObjectURL(file)
                            // setAvatar(file)
                            if (!file) {
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = () => {
                              resolve({
                                base64data: `${btoa(reader.result)}`,
                                path: `development/quests/scene/back/${idScene}`
                              });
                            };
                            reader.onerror = reject;
                            reader.readAsBinaryString(file);
                          });
                        }
                        const newImage = await readFileAsync();
                        onChange(newImage)
                      }}
                    />
                  </div>
                </Box>
              )}
            />
            {/* ===== OBSTACLE ===== */}
            <Controller
              control={control}
              name="scene.imageObstacle"
              render={({ field: { onChange } }) => (
                <Box
                  className='mt-32'
                >
                  <div>
                    <h3>Image Obstacle *</h3>
                    <input
                      required
                      accept="image/*"
                      type="file"
                      onChange={async (e) => {
                        function readFileAsync() {
                          return new Promise((resolve, reject) => {
                            const file = e.target.files[0];
                            file.preview = URL.createObjectURL(file)
                            // setAvatar(file)
                            if (!file) {
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = () => {
                              resolve({
                                base64data: `${btoa(reader.result)}`,
                                path: `development/quests/scene/obstacle/${idScene}`
                              });
                            };
                            reader.onerror = reject;
                            reader.readAsBinaryString(file);
                          });
                        }
                        const newImage = await readFileAsync();
                        onChange(newImage)
                      }}
                    />
                  </div>
                </Box>
              )}
            />


            <Box
              className="flex items-center mt-40 py-14 pr-16 pl-4 sm:pr-48 sm:pl-36 border-t"
            >
              <LoadingButton
                className="ml-8"
                variant="contained"
                color="secondary"
                loading={loading}
                onClick={handleSubmit(onSubmit)}
              >
                Save
              </LoadingButton>

              <LoadingButton
                className="ml-8"
                variant="contained"
                color="secondary"
                loading={loading}
                onClick={handleView}
              >
                All Scene
              </LoadingButton>

              <LoadingButton
                className="ml-8"
                variant="contained"
                color="secondary"
                loading={loading}
                onClick={handleReview}
              >
                Review
              </LoadingButton>



            </Box>


            {/* { openScene ? <SceneTable rows={viewAll}/> : <></>} */}
            {openScene ? <RowOrderingGrid rows={viewAll} /> : <></>}
            {/* { openScene ? <DragDrop rows={viewAll} /> : <></>} */}




          </CardContent>
        </Card>
      </div>
    </div>
  )
}


export default QuestEngine;