import { useEffect } from 'react';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { FormHelperText } from '@mui/material';
//
import Editor from '../editor'

// ----------------------------------------------------------------------

interface RE {
  name: string;
  helperText?: string;
  required?: boolean;
  placeholder: string;
}

export default function RHFEditor({ name, helperText, required, placeholder, ...other }: RE) {
  const {
    control,
    watch,
    setValue,
    formState: { isSubmitSuccessful },
  } = useFormContext();

  const values = watch();

  useEffect(() => {
    if (values[name] === '<p><br></p>') {
      setValue(name, '', {
        shouldValidate: !isSubmitSuccessful,
      });
    }
  }, [isSubmitSuccessful, name, setValue, values]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Editor
          id={name}
          value={field.value}
          onChange={field.onChange}
          error={!!error}
          placeholder={placeholder}
          helperText={
            (!!error || helperText) && (
              <FormHelperText error={!!error} sx={{ px: 2 }}>
                {error ? error?.message : helperText}
              </FormHelperText>
            )
          }
          {...other}
        />
      )}
    />
  );
}
