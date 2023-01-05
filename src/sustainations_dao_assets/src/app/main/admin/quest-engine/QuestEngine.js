import { useState } from 'react';
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
  const idQuest = uuid()
  const idEvent = uuid()
  const idScene = uuid()

  // const [openOptions, setOpenOptions] = useState(false);

  const { control, handleSubmit, formState } = useForm({
    mode: 'onChange',
    defaultValues: {
      idQuest: "test",
      idEvent: idEvent,
      idScene: idScene,
      name: '',
      price: 0,
      description: '',
      scene: {
        location: '',
        destination: '',
        description: '',
        location: '',
        destination: '',
        imageQuest: {
          base64data: '',
          path: ''
        },
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
      //EVENT
      let event = {
        id: data.idEvent,
        questId: data.idQuest,
        description: data.scene.description,
        locationName: data.scene.location,
        destinationName: data.scene.destination
      };
      // const resultEvent = await createEventEngine(event);
      const resultEvent =await user.actor.createEventEngine(event);

      //SCENE
      let scene = {
        id: data.idScene,
        idEvent: data.idEvent,
        idQuest: data.idQuest,
        front: data.scene.imageFront.path,
        mid: data.scene.imageMid.path,
        back: data.scene.imageBack.path,
        obstacle: data.scene.imageObstacle.path
      }
      if(scene.front == "" || scene.mid == "" || scene.back == "" || scene.obstacle == "" ){
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
    }
    catch (err) {
      console.log(err)
      dispatch(showMessage({ message: 'Error!' }));
    }
    setLoading(false);
  };


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
  const [id, setId] = useState([])
  const handleView = async () => {
    let allScene =  await getAllScenes("test")
    setViewAll(allScene)
    setOpenScene(!openScene)
    const sceneInfo = (await user.actor.listSceneQuests("test"))?.ok
    console.log(sceneInfo)
    // setId()
  }


 
  return (
    <div className="relative flex flex-col flex-auto items-center">
      {/* ================= Scene 1 ================= */}
      <div className="w-full max-w-7xl">
        <Card className="w-full py-32 mx-auto mt-24 rounded-2xl shadow">
          <CardContent className="p-24 pt-0 sm:p-48 sm:pt-0">
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
              <TextField type='number' value={option.hp || 0.0} placeholder="HP" onChange={e => setOption({ ...option, hp: parseInt(e.target.value) })} className="mt-32" label="HP" variant="outlined" fullWidth></TextField>
              <TextField type='number' value={option.stamina || 0.0} placeholder="Stamina" onChange={e => setOption({ ...option, stamina: parseInt(e.target.value) })} className="mt-32" label="Stamina" variant="outlined" fullWidth></TextField>
              <TextField type='number' value={option.mana || 0.0} placeholder="Mana" onChange={e => setOption({ ...option, mana: parseInt(e.target.value) })} className="mt-32" label="Mana" variant="outlined" fullWidth></TextField>
              <TextField type='number' value={option.morale || 0.0} placeholder="Morale" onChange={e => setOption({ ...option, morale: parseInt(e.target.value) })} className="mt-32" label="Morale" variant="outlined" fullWidth></TextField>
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
            </Box>


            {/* { openScene ? <SceneTable rows={viewAll}/> : <></>} */}
            { openScene ? <RowOrderingGrid rows={viewAll} /> : <></>}
            {/* { openScene ? <DragDrop rows={viewAll} /> : <></>} */}
            
           


          </CardContent>
        </Card>
      </div>
    </div>
  )
}


export default QuestEngine;