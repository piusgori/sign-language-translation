import { createTheme, CssBaseline, ThemeProvider as MuiThemeProvider } from "@mui/material";
import { ReactNode } from "react";
import GlobalStyles from "./global-styles";
import { PRIMARY_MAIN, SECONDARY_MAIN } from "../config";

const fontFamily = "'Urbanist', sans-serif"

const theme = createTheme({
    palette: {
        primary: {
            main: PRIMARY_MAIN,
        },
        secondary: {
            main: SECONDARY_MAIN
        }
    },
    typography: {
        fontFamily
    },
    components: {
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
            styleOverrides: {
                root: ({ ownerState }) => ({
                    textTransform: 'capitalize',
                    borderRadius: '100px',
                    ...(ownerState.variant === 'contained' && { color: 'white' })
                })
            }
        },
    }
});

export default function ThemeProvider ({ children }: { children: ReactNode }) {
    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <GlobalStyles />
            {children}
        </MuiThemeProvider>
    )
}