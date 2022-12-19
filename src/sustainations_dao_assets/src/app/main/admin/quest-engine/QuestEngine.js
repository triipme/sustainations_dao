import { useState } from 'react';
import _ from '@lodash';
import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/system/Box';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  TextField,
} from '@mui/material';

import { createQuestEngine, createEventEngine, createScene } from '../../metaverse/GameApi';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import { v4 as uuid } from 'uuid'

import { useSelector, useDispatch } from "react-redux";
import { selectUser, setUser } from 'app/store/userSlice';
import { showMessage } from 'app/store/fuse/messageSlice';

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

  const { control, handleSubmit, formState } = useForm({
    mode: 'onChange',
    defaultValues: {
      idQuest: idQuest,
      idEvent: idEvent,
      idScene: idScene,
      name: '',
      price: 0,
      description: '',
      scene:{
        location: '',
        destination: '',
        description: '',
        location: '',
        destination: '',
        imageQuest: {
          base64data: '',
          path: ''
        },
        imageFront:{
          base64data: '',
          path: '',
        },
        imageMid:{
          base64data: '',
          path: '',
        },
        imageBack:{
          base64data: '',
          path: '',
        },
        imageObstacle:{
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
      // ========== QUEST ==========
      let quest = {
        id: data.idQuest,
        name: data.name,
        price: data.price,
        description: data.description,
        images: data.scene.imageQuest.path
      }
      const resultQuest = await createQuestEngine(quest)
      if ('Success' == resultQuest) {
        let bufQuest = Buffer.from(data.scene.imageQuest.base64data, 'base64')
        let dataImagQuest = {
          Key: data.scene.imageQuest.path,
          Body: bufQuest,
          ContentEncoding: 'base64',
          ContentType: 'image/jpeg'
        };
        s3Bucket.putObject(dataImagQuest, function (err, dataS3) {
          if (err) {
            console.log('Error uploading data!');
          } else {
            console.log('Successfully uploaded the image quest!');
          }
        });
      }
        // s3Bucket.putObject(dataImagQuest, function (err, dataS3) {
        //   if (err) {
        //     console.log('Error uploading data!');
        //   } else {
        //     console.log('Successfully uploaded the image!');
        //   }
        // });

      // ========== SCENE ==========
      //EVENT
      let event = {
        id : data.idEvent,
        questId : data.idQuest,
        description : data.scene.description,
        locationName : data.scene.location,
        destinationName : data.scene.destination
      };
      const resultEvent = await createEventEngine(event);

      //SCENE
      let scene = {
        id : data.idScene,
        idEvent : data.idEvent,
        front : data.scene.imageFront.path,
        mid : data.scene.imageMid.path,
        back : data.scene.imageBack.path,
        obstacle : data.scene.imageObstacle.path
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

      
      console.log("test: ", resultQuest, resultEvent, resultScene)
      // console.log("quest:", quest)
      // console.log("event:", event)
      // console.log("scene:", scene)
      dispatch(showMessage({ message: 'Success!' }));
    }
    catch (err) {
      console.log(err)
      dispatch(showMessage({ message: 'Error!' }));
    }
    setLoading(false);
  };

  return (
    <div className="relative flex flex-col flex-auto items-center">
      <div className="w-full max-w-7xl">
        <Card className="w-full py-32 mx-auto mt-24 rounded-2xl shadow">
          <CardContent className="p-24 pt-0 sm:p-48 sm:pt-0">
            <Typography className="mt-32 mb-16 text-3xl font-bold tracking-tight leading-tight">
              Quest info
            </Typography>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <TextField
                  className="mt-32"
                  {...field}
                  label="Quest name"
                  placeholder="Quest name"
                  id="questName"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
            <Controller
              control={control}
              name="price"
              render={({ field }) => (
                <TextField
                  className="mt-32"
                  type={"number"}
                  {...field}
                  label="Quest price"
                  placeholder="Quest price"
                  id="questPrice"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <TextField
                  className="mt-32"
                  {...field}
                  label="Quest Description"
                  placeholder="Quest description"
                  id="questDescription"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
            <Controller
              control={control}
              name="scene.imageQuest"
              render={({ field: { onChange } }) => (
                <Box
                  className='mt-32'
                >
                  <div>
                    <h3>Image Quest</h3>
                    <input
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
                                path: `development/quests/${idQuest}`
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
            {/* <Box
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
            </Box> */}
          </CardContent>
        </Card>
      </div>

      {/* ================= Scene 1 ================= */}
      <div className="w-full max-w-7xl">
        <Card className="w-full py-32 mx-auto mt-24 rounded-2xl shadow">
          <CardContent className="p-24 pt-0 sm:p-48 sm:pt-0">
            <Typography className="mt-32 mb-16 text-3xl font-bold tracking-tight leading-tight">
              Scene 1
            </Typography>
            {/* ===== description ===== */}
            <Controller
              control={control}
              name="scene.description"
              render={({ field }) => (
                <TextField
                  className="mt-32"
                  {...field}
                  label="Descrition"
                  placeholder="Descrition"
                  // id="questName"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
             {/* ===== location ===== */}
             <Controller
              control={control}
              name="scene.location"
              render={({ field }) => (
                <TextField
                  className="mt-32"
                  {...field}
                  label="Location"
                  placeholder="Location"
                  // id="questName"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
            {/* ===== destinaton ===== */}
            <Controller
              control={control}
              name="scene.destination"
              render={({ field }) => (
                <TextField
                  className="mt-32"
                  {...field}
                  label="Destination"
                  placeholder="Destination"
                  // id="questName"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
            {/* ===== FRONT ===== */}
            <Controller
              control={control}
              name="scene.imageFront"
              render={({ field: { onChange } }) => (
                <Box
                  className='mt-32'
                >
                  <div>
                    <h3>Image Front</h3>
                    <input
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
                    <h3>Image Mid</h3>
                    <input
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
                    <h3>Image Back</h3>
                    <input
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
                    <h3>Image Obstacle</h3>
                    <input
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
            </Box>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


export default QuestEngine;