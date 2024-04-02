import { TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form'

interface RTF {
    name: string, 
    label: string, 
    placeholder: string, 
    helperText ? : string, 
    type ? : string, 
    InputProps ? : any, 
    required ? : boolean,
    disabled ? : boolean,
    multiline?: boolean,
    rows?: number,
    sx?: object,
    size?: any
    onBlur?: any;
    fullWidth?: boolean;
    secondaryColor?: boolean
}

const RHFTextField = ({ name, label, onBlur, size, placeholder, InputProps, helperText = '', type, required, disabled, fullWidth = true, sx, multiline, secondaryColor, rows = 1, ...other }: RTF) => {

    const { control } = useFormContext();

  return (
    <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
            <TextField 
              size={size} 
              {...field} 
              type={type} 
              onBlur={onBlur} 
              label={label} 
              sx={sx} 
              disabled={disabled} 
              multiline={multiline} 
              required={required} 
              placeholder={placeholder} 
              rows={rows} 
              InputProps={{ ...InputProps, sx }} 
              fullWidth={fullWidth} 
              value={typeof field.value === 'number' && field.value === 0 ? '' : field.value} 
              error={!!error} 
              helperText={error ? error?.message : helperText} {...other} 
              variant='outlined'
              color={secondaryColor ? 'secondary' : 'primary'}
            />
        )}
    />
  )
}

export default RHFTextField;
