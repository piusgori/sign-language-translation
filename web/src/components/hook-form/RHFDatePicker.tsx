// eslint-disable-next-line import/no-extraneous-dependencies
import { MobileDatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { FormControl, FormHelperText } from '@mui/material';

interface RHFDP {
  name: string;
  label: string;
  minDate?: Date;
  required?: boolean;
  maxDate?: Date;
  helperText?: string;
  size?: any
  disablePast?: boolean;
  disableFuture?: boolean;
  sx?: any;
  secondaryColor?: boolean;
}

export default function RHFDatePicker({ name, label, size, helperText, maxDate, required, minDate, disablePast, sx, secondaryColor, disableFuture }: RHFDP) {
  const { control } = useFormContext();

  // const labelledby = label ? `${name}-${label}` : '';

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl sx={{ width: '100%' }}>
          {/* {label && (
            <FormLabel component="legend" id={labelledby} sx={{ typography: 'body2' }}>
              {label}
            </FormLabel>
          )} */}

          <MobileDatePicker
            orientation="portrait"
            label={label}
            disablePast={disablePast}
            disableFuture={disableFuture}
            value={dayjs(field.value)}
            onChange={field.onChange}
            maxDate={maxDate}
            minDate={minDate}
            slotProps={{
              textField: { 
                fullWidth: true, 
                required: required, 
                size,
                InputProps: {
                  sx,
                  color: secondaryColor ? 'secondary' : 'primary'
                }
              }
            }}
          />
          {(!!error || helperText) && (
            <FormHelperText error={!!error} sx={{ mx: 0 }}>
              {error ? error?.message : helperText}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}
