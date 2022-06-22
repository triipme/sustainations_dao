import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { Controller, useFormContext } from 'react-hook-form';

function ProjectSubmit() {
  const methods = useFormContext();
  const { control, formState } = methods;
  const { errors } = formState;

  return (
    <div>
      <Typography className="my-32 text-4xl font-extrabold tracking-tight leading-tight">
        Submit project
      </Typography>
      <div className="flex-auto mt-px border-t" />
      <Typography className="mt-32 mb-16 text-3xl font-bold tracking-tight leading-tight">
        Due date
      </Typography>
      <Controller
        control={control}
        name="dueDate"
        render={({ field: { onChange, value } }) => (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDateTimePicker
              value={value}
              className="w-full"
              clearable
              showTodayButton
              disablePast
              onChange={(newValue) => {
                onChange(newValue);
              }}
              renderInput={(_props) => (
                <TextField
                  className=""
                  id="due-date"
                  label="Due date"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  fullWidth
                  {..._props}
                />
              )}
            />
          </LocalizationProvider>
        )}
      />
      <Typography className="mt-32 mb-16 text-3xl font-bold tracking-tight leading-tight">
        Terms &amp; conditions
      </Typography>
      <Controller
        name="termsConditions"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Checkbox
                {...field}
                error={!!errors.termsConditions}
                required
                helperText={errors?.termsConditions?.message}
                name="termsConditions"
              />
            }
            label="I, have read and agree to bound by the Official Rule and the D.A.O Terms of Service."
          />
        )}
      />
    </div>
  );
}

export default ProjectSubmit;
