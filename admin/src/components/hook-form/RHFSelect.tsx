import { Box, Checkbox, Chip, FormControl, FormHelperText, FormLabel, InputLabel, ListSubheader, MenuItem, OutlinedInput, Select, Stack, TextField } from "@mui/material";
import { ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface MS {
    name: string;
    textLabel?: string;
    children: ReactNode;
    label: string;
    placeholder: string;
    required?: boolean;
    fullWidth?: boolean;
    size?: 'small' | 'medium',
    disabled?: boolean;
    sx?: object
}

export const RHFSelect = ({ name, size, textLabel, disabled, children, label, placeholder, fullWidth = true, required, sx }: MS) => {

    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <Stack sx={{ width: '100%' }} gap={2}>
                    {textLabel && <FormLabel>{textLabel}</FormLabel>}
                    <TextField
                        {...field}
                        size={size}
                        select
                        disabled={disabled}
                        fullWidth={fullWidth}
                        sx={sx}
                        required={required}
                        error={!!error}
                        label={label}
                        placeholder={placeholder}
                        helperText={error ? error?.message : ''}
                    >{children}</TextField>
                </Stack>
            )}
        />
    )

}

interface MMS {
    name: string;
    chip?: boolean;
    required?: boolean;
    label: string;
    options: Array<any>;
    checkbox?: boolean;
    placeholder?: string;
    helperText?: string;
    sx?: object
    fullWidth?: boolean;
    size?: 'small' | 'medium'
}

export function RHFMultiSelect({
    name,
    chip,
    required,
    label,
    options,
    checkbox,
    placeholder,
    helperText,
    size,
    fullWidth = true,
    sx,
    ...other
  }: MMS) {
    const { control } = useFormContext();
  
    const renderValues = (selectedIds: any) => {
      const selectedItems = options.filter((item) => selectedIds.includes(item.value));
  
      if (!selectedItems.length && placeholder) {
        return (
          <Box component="em" sx={{ color: 'text.disabled' }}>
            {placeholder}
          </Box>
        );
      }
  
      if (chip) {
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selectedItems.map((item) => (
              <Chip key={item.value} size="small" label={item.label} />
            ))}
          </Box>
        );
      }
  
      return selectedItems.map((item) => item.label).join(', ');
    };
  
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FormControl sx={sx}>
            {label && <InputLabel id={name}> {label} </InputLabel>}
  
            <Select
              {...field}
              multiple
              size={size}
              required={required}
              displayEmpty={!!placeholder}
              labelId={name}
              input={<OutlinedInput fullWidth={fullWidth} label={label} error={!!error} />}
              renderValue={renderValues}
              MenuProps={{
                PaperProps: {
                  sx: { px: 1, maxHeight: 280 },
                },
              }}
              {...other}
            >
              {placeholder && (
                <MenuItem
                  disabled
                  value=""
                  sx={{
                    py: 1,
                    px: 2,
                    borderRadius: 0.75,
                    typography: 'body2',
                  }}
                >
                  <em> {placeholder} </em>
                </MenuItem>
              )}
  
              {options.map((option: any) => {
                const selected = field.value.includes(option.value);

                if (option?.isTitle) {
                  return <ListSubheader>{option.label}</ListSubheader>
                }
  
                return (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    sx={{
                      py: 1,
                      px: 2,
                      borderRadius: 0.75,
                      typography: 'body2',
                      ...(selected && {
                        fontWeight: 'fontWeightMedium',
                      }),
                      ...(checkbox && {
                        p: 0.25,
                      }),
                    }}
                  >
                    {checkbox && <Checkbox disableRipple size="small" checked={selected} />}
  
                    {option.label}
                  </MenuItem>
                );
              })}
            </Select>
  
            {(!!error || helperText) && (
              <FormHelperText error={!!error}>{error ? error?.message : helperText}</FormHelperText>
            )}
          </FormControl>
        )}
      />
    );
  }