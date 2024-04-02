import { alpha, createTheme, CssBaseline, ThemeProvider as MuiThemeProvider, tableCellClasses, tableRowClasses } from "@mui/material";
import { ReactNode } from "react";
import GlobalStyles from "./global-styles";
import { FONT_FAMILY, PRIMARY_MAIN } from "../config";

const fontFamily = FONT_FAMILY

const theme = createTheme({
    palette: {
        primary: {
            main: PRIMARY_MAIN,
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
        MuiCard: {
            styleOverrides: {
              root: ({ theme }) => ({
                position: 'relative',
                boxShadow: '0px 2px 8px rgba(0,0,0,0.32)',
                borderRadius: theme.shape.borderRadius * 2,
                zIndex: 0, // Fix Safari overflow: hidden with border radius
              }),
            },
        },
        MuiCardHeader: {
            styleOverrides: {
              root: ({ theme }) => ({
                padding: theme.spacing(3, 3, 0),
              }),
            },
        },
        MuiCardContent: {
            styleOverrides: {
              root: ({ theme }) => ({
                padding: theme.spacing(3),
              }),
            },
        },
        MuiTableContainer: {
            styleOverrides: {
              root: {
                position: 'relative',
              },
            },
          },
          MuiTableRow: {
            styleOverrides: {
              root: ({ theme }) => ({
                [`&.${tableRowClasses.selected}`]: {
                  backgroundColor: alpha(theme.palette.primary.dark, 0.04),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.dark, 0.08),
                  },
                },
                '&:last-of-type': {
                  [`& .${tableCellClasses.root}`]: {
                    borderColor: 'transparent',
                  },
                },
              }),
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                borderBottomStyle: 'dashed',
              },
              head: ({ theme }) => ({
                fontSize: 14,
                color: theme.palette.text.secondary,
                fontWeight: theme.typography.fontWeightMedium,
                backgroundColor: theme.palette.background.paper,
              }),
              stickyHeader: ({ theme }) => ({
                backgroundColor: theme.palette.background.paper,
                backgroundImage: `linear-gradient(to bottom, ${theme.palette.background.paper} 0%, ${theme.palette.background.paper} 100%)`,
              }),
              paddingCheckbox: ({ theme }) => ({
                paddingLeft: theme.spacing(1),
              }),
            },
          },
          MuiTablePagination: {
            styleOverrides: {
              root: {
                width: '100%',
              },
              toolbar: {
                height: 64,
              },
              actions: {
                marginRight: 8,
              },
              select: ({ theme }) => ({
                paddingLeft: 8,
                '&:focus': {
                  borderRadius: theme.shape.borderRadius,
                },
              }),
              selectIcon: {
                right: 4,
                width: 16,
                height: 16,
                top: 'calc(50% - 8px)',
              },
            },
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