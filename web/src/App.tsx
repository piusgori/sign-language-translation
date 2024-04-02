import AuthContextProvider from "./auth/auth-context"
import { NextUIProvider } from "@nextui-org/system";
import ThemeProvider from "./utils/theme"
import { SnackbarProvider } from "notistack";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Router from "./routes";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_OAUTH_CLIENT_ID } from "./config";
import AppContextProvider from "./services/app-context";

function App() {
  return (
    <AuthContextProvider>
      <AppContextProvider>
        <ThemeProvider>
          <NextUIProvider>
            <SnackbarProvider anchorOrigin={{ horizontal: 'right', vertical: 'top' }} autoHideDuration={3000}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <GoogleOAuthProvider clientId={GOOGLE_OAUTH_CLIENT_ID}>
                  <Router />
                </GoogleOAuthProvider>
              </LocalizationProvider>
            </SnackbarProvider>
          </NextUIProvider>
        </ThemeProvider>
      </AppContextProvider>
    </AuthContextProvider>
  )
}

export default App
