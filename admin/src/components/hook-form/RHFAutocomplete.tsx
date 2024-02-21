import { useFormContext, Controller } from 'react-hook-form';
// @mui
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

// ----------------------------------------------------------------------

interface AC {
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
  size?: 'small' | 'medium',
  multiple?: boolean;
  options?: Array<any>,
  helperText?: string;
  freeSolo?: boolean;

}

export default function RHFAutocomplete({ name, label, placeholder, helperText, required, size, multiple, options = [], freeSolo, ...other }: AC) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...field}
          size={size}
          options={options}
          freeSolo={freeSolo}
          multiple={multiple}
          onChange={(_, newValue) => setValue(name, newValue, { shouldValidate: true })}
          renderInput={(params) => (
            <TextField
              required={required}
              label={label}
              placeholder={placeholder}
              error={!!error}
              helperText={error ? error?.message : helperText}
              {...params}
            />
          )}
          {...other}
        />
      )}
    />
  );
}
