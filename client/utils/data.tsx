import { Dimensions } from "react-native";

export const windowWidth = Dimensions.get('window').width;
export const screenWidth = Dimensions.get('screen').width;
export const windowHeight = Dimensions.get('window').height;
export const screenHeight = Dimensions.get('screen').height;

export const imageFallback = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png';

export const PACKAGE_TYPES = ['Small Box', 'Large Box', 'Envelope'];

import AsyncStorage from "@react-native-async-storage/async-storage"

export const lsGetItem = async (key: string) => {
    const value = await AsyncStorage.getItem(key);
    return value;
}

export const lsSetItem = async (key: string, value: string) => {
    await AsyncStorage.setItem(key, value);
}

export const lsRemoveItem = async (key: string) => {
    await AsyncStorage.removeItem(key);
}