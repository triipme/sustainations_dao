import {
  Autocomplete,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

function BasicInfoTab(props) {
  const { categories, tags, productUnits } = props
  const methods = useFormContext();
  const { control, formState } = methods;
  const { errors } = formState;

  return (
    <div>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            error={!!errors.name}
            required
            helperText={errors?.name?.message}
            label="Name"
            autoFocus
            id="name"
            variant="outlined"
            fullWidth
          />
        )}
      />

      <Controller
        name="sku"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            error={!!errors.sku}
            required
            helperText={errors?.sku?.message}
            label="SKU"
            id="sku"
            variant="outlined"
            fullWidth
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            id="description"
            label="Description"
            type="text"
            multiline
            rows={10}
            variant="outlined"
            fullWidth
          />
        )}
      />

      <Controller
        name="categories"
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <Autocomplete
            className="mt-8 mb-16"
            multiple
            options={categories}
            value={value}
            onChange={(_event, newValue) => {
              onChange(newValue);
            }}
            renderInput={(params) => (
              <TextField
                error={!!errors.categories}
                required
                helperText={errors?.categories?.message}
                {...params}
                placeholder="Select multiple categories"
                label="Categories"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        )}
      />

      <Controller
        name="tags"
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <Autocomplete
            className="mt-8 mb-16"
            multiple
            options={tags}
            value={value}
            onChange={(_event, newValue) => {
              onChange(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select multiple tags"
                label="Tags"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        )}
      />

      <Controller
        name="unit"
        control={control}
        defaultValue={productUnits[0]}
        render={({ field }) => (
          <FormControl required className="mt-8 mb-16 min-w-full">
            <InputLabel id="product-unit-label">Product unit</InputLabel>
            <Select
              {...field}
              error={!!errors.unit}
              required
              labelId="product-unit-label"
              id="product-unit"
              label="Product unit *"
              variant="outlined"
            >
              {productUnits?.map((item) => (
                <MenuItem key={item} value={item}>{item}</MenuItem>
              ))}
            </Select>
            {errors?.unit?.message && (<FormHelperText error>{errors?.unit?.message}</FormHelperText>)}
          </FormControl>
        )}
      />
    </div>
  );
}

export default BasicInfoTab;
