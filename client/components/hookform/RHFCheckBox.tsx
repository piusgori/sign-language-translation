import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { Checkbox, Text } from 'react-native-paper';

interface RHFCB {
    name: string;
    label: string;
}

const RHFCheckBox = ({ label, name }: RHFCB) => {
    const { control } = useFormContext()

    return (
      <Controller
          name={name}
          control={control}
          render={({ field, fieldState: { error } }) => {
              return (
                  <View style={styles.container}>
                    <Checkbox
                        status={!!field.value ? 'checked' : 'unchecked'}
                        onPress={() => field.onChange(!field.value)}
                    />
                    <Text>{label}</Text>
                  </View>
              )
          }}
      />
    )
}

export default RHFCheckBox;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center'
    }
})