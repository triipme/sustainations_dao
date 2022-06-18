import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
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
            label="I, and all of my team members, have read and agree to bound by the Official Rule and the Devpost Terms of Service."
          />
        )}
      />
    </div>
  );
}

export default ProjectSubmit;
