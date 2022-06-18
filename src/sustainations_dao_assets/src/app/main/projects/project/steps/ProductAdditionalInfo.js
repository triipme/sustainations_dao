import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import { v4 as uuidv4 } from 'uuid';
import { Controller, useFormContext } from 'react-hook-form';

function ProjectAdditionalInfo(props) {
  const { categories } = props;
  const methods = useFormContext();
  const { control } = methods;

  return (
    <div>
      <Typography className="my-32 text-4xl font-extrabold tracking-tight leading-tight">
        Additional info
      </Typography>
      <div className="flex-auto mt-px border-t" />

      <Controller
        name="document"
        control={control}
        render={({ field: { onChange } }) => (
          <div className="flex-1 mb-24">
            <div className="mt-16 mb-12">
              <div className="font-semibold text-16 mx-8 my-16">Upload a file</div>
              <div className="italic mx-8 mb-16">Upload a file as part of your submission. PDF only.</div>
            </div>
            <input
              accept="application/pdf"
              id="document"
              type="file"
              onChange={async (e) => {
                function readFileAsync() {
                  return new Promise((resolve, reject) => {
                    const file = e.target.files[0];

                    if (!file) {
                      return;
                    }
                    const reader = new FileReader();

                    reader.onload = () => {
                      resolve({
                        id: uuidv4(),
                        base64data: `data:${file.type};base64,${btoa(reader.result)}`,
                        type: file.type,
                      });
                    };

                    reader.onerror = reject;

                    reader.readAsBinaryString(file);
                  });
                }

                const newImage = await readFileAsync();

                onChange(newImage);
              }}
            />
          </div>
        )}
      />

      <Controller
        name="categories"
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <div className="flex-1 mb-24">
            <div className="flex items-center mt-16 mb-12">
              <Typography className="font-semibold text-16 mx-8">Which categories are you submitting your project?</Typography>
            </div>
            <Autocomplete
              className="mt-8 mb-16"
              freeSolo
              multiple
              options={categories}
              value={value}
              onChange={(_event, newValue) => {
                if (newValue.length > 3) {
                  return;
                }
                onChange(newValue);
              }}
              getOptionLabel={(option) => option || ""}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  return (
                    <Chip label={option} {...getTagProps({ index })} className="m-3" />
                  );
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Categories"
                  label="Categories"
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
    </div>
  );
}

export default ProjectAdditionalInfo;
