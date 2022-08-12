import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

function PricingTab() {
  const methods = useFormContext();
  const { control, formState } = methods;
  const { errors } = formState;

  return (
    <div>
      <Controller
        name="price"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            error={!!errors.price}
            required
            helperText={errors?.price?.message}
            className="mt-8 mb-16"
            label="Price"
            id="price"
            type="number"
            variant="outlined"
            autoFocus
            fullWidth
          />
        )}
      />

      <Controller
        name="salePrice"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            label="Sale Price"
            id="salePrice"
            type="number"
            variant="outlined"
            fullWidth
          />
        )}
      />

      <Controller
        name="currency"
        control={control}
        render={({ field }) => (
          <FormControl required className="mt-8 mb-16 min-w-full">
            <InputLabel id="product-currency-label">Currency</InputLabel>
            <Select
              {...field}
              required
              error={!!errors.currency}
              labelId="product-currency-label"
              id="product-currency"
              label="Currency *"
              variant="outlined"
            >
              <MenuItem value="VND">VND</MenuItem>
            </Select>
            {errors?.currency?.message && (<FormHelperText error>{errors?.currency?.message}</FormHelperText>)}
          </FormControl>
        )}
      />
    </div>
  );
}

export default PricingTab;
