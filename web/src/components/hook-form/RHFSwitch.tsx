
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Switch, FormControlLabel, FormHelperText } from '@mui/material';

// ----------------------------------------------------------------------

interface RHS {
  name: string;
  helperText?: string;
  label: string;
}

export default function RHFSwitch({ name, helperText, label, ...other }: RHS) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <FormControlLabel label={label} control={<Switch {...field} checked={field.value} />} {...other} />

          {(!!error || helperText) && (
            <FormHelperText error={!!error}>{error ? error?.message : helperText}</FormHelperText>
          )}
        </div>
      )}
    />
  );
}
