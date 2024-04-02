import { Controller, useFormContext } from "react-hook-form";
import { FormHelperText } from "@mui/material";
import UploadAvatar from "../upload/upload-avatar";
import Upload from "../upload/upload";

interface RU {
    name: string;
    helperText?: string;
    placeholder?: string;
    multiple?: boolean;
    onDrop?: any;
    onDelete?: any;
    onRemove?: any;
    onRemoveAll?: any;
    accept?: any;
}

interface RHFUA {
  name: string;
  helperText?: string;
  placeholder?: string;
  onDrop?: any;
}

export const RHFUploadAvatar = ({ name, helperText, placeholder, onDrop }: RHFUA) => {
  const { control } = useFormContext();

  return (
    <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => <UploadAvatar
            placeholder={placeholder}
            file={field.value}
            onDrop={onDrop}
            error={!!error}
            helperText={
                (!!error || helperText) && (
                  <FormHelperText error={!!error} sx={{ px: 2 }}>
                    {error ? error?.message : helperText}
                  </FormHelperText>
                )
              }
        />}
    />
  )
}

const RHFUpload = ({ name, accept, helperText, onRemove, onRemoveAll, placeholder, multiple, onDrop, onDelete }: RU) => {

    const { control } = useFormContext();

  return (
    <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => {
        return <Upload
            accept={accept}
            placeholder={placeholder}
            multiple={multiple}
            file={field.value}
            files={field.value}
            onDelete={onDelete}
            onDrop={onDrop}
            error={!!error}
            onRemove={onRemove}
            onRemoveAll={onRemoveAll}
            helperText={
                (!!error || helperText) && (
                  <FormHelperText error={!!error} sx={{ px: 2 }}>
                    {error ? error?.message : helperText}
                  </FormHelperText>
                )
              }
        />}}
    />
  )
}

export default RHFUpload
