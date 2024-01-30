import { PRIMARY_MAIN } from "@/config";
import { ReactNode } from "react";
import { DefaultTheme, Provider } from "react-native-paper";

export const colors = {
    primary: PRIMARY_MAIN,
    black: '#434343',
};

export const fontSize = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 30,
}

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: PRIMARY_MAIN,
    },
    // fonts: configureFonts({ config: { fontFamily: 'Poppins-Regular' }, isV3: true })
};

const PaperProvider = ({ children }: { children: ReactNode }) => {
    return <Provider theme={theme}>{children}</Provider>
}

export default PaperProvider