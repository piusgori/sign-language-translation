import { View } from 'react-native'
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import OTPTextView from 'react-native-otp-textinput';
import { Text } from 'react-native-paper';
import { PRIMARY_MAIN } from '@/config';

interface RFHO {
    name: string;
    inputCount?: number
}

const RHFOtp = ({ name, inputCount = 4 }: RFHO) => {

    const { control } = useFormContext();

  return (
    <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => {
            return (
                <View>
                    <OTPTextView 
                        defaultValue={field.value} 
                        handleTextChange={(value) => field.onChange(value)}
                        inputCount={inputCount}
                        keyboardType='numeric'
                        tintColor={PRIMARY_MAIN}
                    />
                    {!!error && <Text style={{ color: 'red' }}>{error.message}</Text>}
                </View>
            )
        }}
    />
  )
}

export default RHFOtp;