import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Controller, useFormContext } from 'react-hook-form';

function ProjectOverview({ proposalTypeName }) {
  const methods = useFormContext();
  const { control, formState } = methods;
  const { errors } = formState;

  return (
    <div>
      <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
        {proposalTypeName} overview
      </Typography>
      <div className="text-lg mt-16 mb-16">Please respect our Community Guidelines</div>
      <div className="flex-auto mt-px border-t" />
      <Typography className="mt-32 mb-16 text-3xl font-bold tracking-tight leading-tight">
        General info
      </Typography>
      <div className="text-lg mt-16 mb-8">
        <span className="text-red-500">*</span>&nbsp;{proposalTypeName} name
      </div>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={`${proposalTypeName} name`}
            className="mt-8 mb-16"
            error={!!errors.name}
            required
            helperText={errors?.name?.message}
            autoFocus
            id="name"
            variant="outlined"
            fullWidth
          />
        )}
      />
      <div className="text-lg mt-16 mb-8">
        <span className="text-red-500">*</span>&nbsp;Elevator pitch
      </div>
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Elevator pitch"
            className="mt-8 mb-16"
            error={!!errors.description}
            required
            helperText={errors?.description?.message}
            id="description"
            type="text"
            multiline
            rows={5}
            variant="outlined"
            fullWidth
          />
        )}
      />
    </div>
  );
}

export default ProjectOverview;
