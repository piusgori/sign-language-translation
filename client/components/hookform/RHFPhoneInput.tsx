import React from 'react'
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import PhoneInput from 'react-native-phone-input';

interface RHFPI {
    name: string;
    placeholder: string;
}

const RHFPhoneInput = ({ name, placeholder }: RHFPI) => {

    const { control } = useFormContext();

  return (
    <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => {
            return (
                <>
                    <PhoneInput
                        initialCountry='ke'
                        initialValue={field.value}
                        style={styles.phoneInput}
                        textProps={{
                            placeholder,
                        }}
                        onChangePhoneNumber={(val) => field.onChange(val)}
                    />
                    {!!error && <Text style={{ color: 'red' }}>{error.message}</Text>}
                </>
            )
        }}
    />
  )
}

export default RHFPhoneInput;

const styles = StyleSheet.create({
    phoneInput: {
        borderColor: '#ddd',
        borderWidth: 2,
        borderRadius: 2,
        padding: 16,
      },
})