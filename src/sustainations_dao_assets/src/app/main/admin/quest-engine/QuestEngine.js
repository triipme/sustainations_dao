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

import { createQuestEngine } from '../../metaverse/GameApi';
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
  const id = uuid()

  const { control, handleSubmit, formState } = useForm({
    mode: 'onChange',
    defaultValues: {
      id: id,
      name: '',
      price: 0,
      description: '',
      imageQuest:
      {
        base64data: '',
        path: ''
      }
    }
  });

  const onSubmit = async (data) => {
    console.log(data.questEventName, "quest event name")
    setLoading(true);
    console.log('Luu data', data.imageQuest.path)
    try {
      var dataQuest = {
        id: data.id,
        name: data.name,
        price: data.price,
        description: data.description,
        images: data.imageQuest.path
      }
      const resultQuest = await createQuestEngine(dataQuest)
      if ('Success' == resultQuest) {
        var buf = Buffer.from(data.imageQuest.base64data, 'base64')
        var dataS3 = {
          Key:  data.imageQuest.path,
          Body: buf,
          ContentEncoding: 'base64',
          ContentType: 'image/jpeg'
        };
        s3Bucket.putObject(dataS3, function (err, dataS3) {
          if (err) {
            console.log('Error uploading data!');
          } else {
            console.log('Successfully uploaded the image!');
          }
        });
        dispatch(showMessage({ message: 'Success!' }));
      }
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
              name="imageQuest"
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
                                path: `development/quests/${id}`
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