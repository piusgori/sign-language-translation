import { Controller, useFormContext } from "react-hook-form";
import { KeyboardTypeOptions, ReturnKeyType, View } from "react-native";
import { Text, TextInput } from "react-native-paper";

interface RHFT {
    name: string;
    keyboardType?: KeyboardTypeOptions;
    label: string;
    placeholder: string;
    secureTextEntry?: boolean;
    icon?: string;
    right?: any;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    returnKeyType?: ReturnKeyType;
    width?: any;
    multiline?: boolean;
    outlineColor?: string;
    disabled?: boolean;
    numberOfLines?: number;
}


const RHFTextField = ({ name, keyboardType, label, disabled, placeholder, secureTextEntry, right, returnKeyType, autoCapitalize, width = '100%', multiline, outlineColor, numberOfLines }: RHFT) => {

    const { control } = useFormContext()

  return (
    <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => {
            return (
                <View style={{ width }}>
                    <TextInput
                        label={label}
                        mode="flat"
                        value={field.value} 
                        keyboardType={keyboardType} 
                        // label={label}
                        secureTextEntry={secureTextEntry}
                        placeholder={placeholder}
                        disabled={disabled}
                        onChangeText={value => field.onChange(value)}
                        error={!!error}
                        style={{ width: '100%' }}
                        dense
                        right={right}
                        outlineColor={outlineColor}
                        autoCapitalize={autoCapitalize}
                        returnKeyType={returnKeyType}
                        multiline={multiline}
                        numberOfLines={numberOfLines}
                        enablesReturnKeyAutomatically
                    />
                    {!!error && <Text style={{ color: 'red' }}>{error.message}</Text>}
                </View>
            )
        }}
    />
  )
}

export default RHFTextField