import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import { Controller, useFormContext } from 'react-hook-form';
import ProjectMedia from './ProjectMedia';

const storyPlaceholder = `
## Inspiration

## What it does

## How we built it

## Challenges we ran into

## Accomplishments that we're proud of ## What we learned

## What's next for Sustainations DAO
`;

function ProjectDetails(props) {
  const methods = useFormContext();
  const { control } = methods;
  const { locations, fundingTypes } = props;

  return (
    <div>
      <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
        Project details
      </Typography>
      <div className="text-lg mt-16 mb-16">Information entered below will appear on your public project page.</div>
      <div className="flex-auto mt-px border-t" />
      <Typography className="mt-32 text-3xl font-bold tracking-tight leading-tight">
        Project Story
      </Typography>
      <div className="text-lg mt-16 mb-16">
        <span className="text-red-500">*</span>
        &nbsp;Be sure to write what inspired you, what you learned, how you built your project, and the challenges you faced. Format your story in&nbsp;
        <a href="https://www.markdownguide.org/basic-syntax/">
          Markdown
        </a>.
      </div>
      <Controller
        name="story"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            id="story"
            label="Story"
            type="text"
            multiline
            rows={20}
            variant="outlined"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            placeholder={storyPlaceholder}
          />
        )}
      />

      <Controller
        name="location"
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <div className="flex-1 mb-24">
            <div className="flex items-center mt-16 mb-12">
              <Typography className="font-semibold text-16 mx-8">Location</Typography>
            </div>
            <Autocomplete
              className="mt-8 mb-16"
              freeSolo
              options={locations}
              value={value}
              onChange={(_event, newValue) => {
                onChange(newValue);
              }}
              getOptionLabel={(option) => option || ""}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Location"
                  label="Location"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            />
          </div>
        )}
      />

      <Controller
        name="fundingType"
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <div className="flex-1 mb-24">
            <div className="flex items-center mt-16 mb-12">
              <Typography className="font-semibold text-16 mx-8">Funding Type</Typography>
            </div>
            <Autocomplete
              className="mt-8 mb-16"
              freeSolo
              options={fundingTypes}
              value={value}
              onChange={(_event, newValue) => {
                onChange(newValue);
              }}
              getOptionLabel={(option) => option || ""}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Funding Type"
                  label="Funding Type"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            />
          </div>
        )}
      />

      <Controller
        name="fundingAmount"
        control={control}
        render={({ field }) => (
          <div className="flex-1 mb-24">
            <div className="flex items-center mt-16 mb-12">
              <Typography className="font-semibold text-16 mx-8">Funding Amount</Typography>
            </div>
            <TextField
              {...field}
              className="mt-8 mb-16"
              label="Funding Amount"
              id="fundingAmount"
              InputProps={{
                endAdornment: <InputAdornment position="end">ICP</InputAdornment>,
              }}
              type="number"
              variant="outlined"
              fullWidth
            />
          </div>
        )}
      />

      <Controller
        name="discussionLink"
        control={control}
        render={({ field }) => (
          <div className="flex-1 mb-24">
            <div className="flex items-center mt-16 mb-12">
              <Typography className="font-semibold text-16 mx-8">Discussion Link</Typography>
            </div>
            <TextField
              {...field}
              label="Discussion Link"
              className="mt-8 mb-16"
              id="discussionLink"
              variant="outlined"
              fullWidth
            />
          </div>
        )}
      />

      <ProjectMedia />

      <Controller
        name="video"
        control={control}
        render={({ field }) => (
          <div className="flex-1 mb-24">
            <div className="flex items-center mt-16 mb-12">
              <Typography className="font-semibold text-16 mx-8">Video demo link</Typography>
            </div>
            <TextField
              {...field}
              label="Video demo link"
              className="mt-8 mb-16"
              id="video"
              variant="outlined"
              fullWidth
            />
          </div>
        )}
      />
    </div>
  );
}

export default ProjectDetails;
