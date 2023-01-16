import * as React from 'react';
// import TextField from '@mui/material/TextField';
import { TextField, Button, Card, CardContent } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import UploadAndDisplayImage from './UploadAndDisplayImage';

const QuestEngine = () => {
  return (
    <div>
      <Card className="w-full py-32 px-16 mx-auto rounded-2xl shadow break-all">
        <CardContent>
          <TextField fullWidth label={'Quest Name:'} id="margin-normal" margin="normal" />
          <TextField fullWidth label={'Quest Price:'} id="margin-normal" margin="normal" />
          <TextField
            id="outlined-multiline-flexible" label={'Quest Description:'}
            fullWidth multiline maxRows={5} margin="normal"
          />
          <TextField fullWidth label={'Quest Location:'} id="margin-normal" margin="normal" />

          <br></br> <br></br> <br></br>
          <h3>Quest Image</h3>
          <UploadAndDisplayImage></UploadAndDisplayImage>
          <br></br> <br></br> <br></br>


          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={3}>
              <Grid item xs>
                <h3>Back Image</h3>
                <UploadAndDisplayImage></UploadAndDisplayImage>
              </Grid>
              <Grid item xs={6}>
                <h3>Mid Image:</h3>
                <UploadAndDisplayImage></UploadAndDisplayImage>
              </Grid>
              <Grid item xs={6}>
                <h3>Front Image:</h3>
                <UploadAndDisplayImage></UploadAndDisplayImage>
              </Grid>
              <Grid item xs={6}>
                <h3>Obstacle:</h3>
                <UploadAndDisplayImage></UploadAndDisplayImage>
              </Grid>
            </Grid>
          </Box>

          <br></br> <br></br> <br></br>
          <Button variant="contained">Submit</Button>


        </CardContent>
      </Card>


    </div>

  );
}

export default QuestEngine;
