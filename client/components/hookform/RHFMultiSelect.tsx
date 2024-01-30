import { View, Text } from 'react-native'
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import MultiSelect from 'react-native-multiple-select';
import { PRIMARY_MAIN } from '@/config';

interface RHFMS {
    name: string;
    label: string;
    placeholder: string;
    options: { label: string, value: string }[];
}

const RHFMultiSelect = ({ label, name, options, placeholder }: RHFMS) => {

    const { control } = useFormContext();

  return (
    <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => {
            return (
                <>
                    <Text>{label}</Text>
                    <MultiSelect
                        items={options}
                        uniqueKey='value'
                        onSelectedItemsChange={(items) => field.onChange(items)}
                        selectedItems={field.value}
                        selectText={placeholder}
                        selectedItemTextColor="#CCC"
                        displayKey="label"
                        submitButtonColor={PRIMARY_MAIN}
                        tagBorderColor={PRIMARY_MAIN}
                        tagTextColor={PRIMARY_MAIN}
                    />
                </>
            )
        }}
    />
  )
}

export default RHFMultiSelect