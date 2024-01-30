import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Text } from 'react-native-paper';

interface RHFS {
    name: string;
    label: string;
    options: { label: string, value: string }[]
}

const RHFSelect = ({ label, name, options }: RHFS) => {
    const { control } = useFormContext();

  return (
    <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => {
            return (
                <>
                    <Text>{label}</Text>
                    <Picker
                        selectedValue={field.value}
                        onValueChange={(val) => { field.onChange(val)}}
                        prompt={label}
                    >
                        <Picker.Item label={label} value='' />
                        {options.map((option, index) => {
                            return (
                                <Picker.Item key={index} label={option.label} value={option.value} />
                            )
                        })}
                    </Picker>
                    {!!error && <Text style={{ color: 'red' }}>{error.message}</Text>}
                </>
            )
        }}
    />
  )
}

export default RHFSelect