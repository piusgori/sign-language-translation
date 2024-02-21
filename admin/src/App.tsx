import AuthContextProvider from "./auth/auth-context";
import ScrollToTop from "./components/scroll-to-top";
import AppContextProvider from "./contexts/app-context";
import Router from "./routes";
import ThemeProvider from "./utils/theme";
import { SnackbarProvider } from 'notistack';
import { NextUIProvider } from "@nextui-org/system";
import './index.css';

function App() {

  return (
    <AuthContextProvider>
      <AppContextProvider>
        <ThemeProvider>
          <NextUIProvider>
            <SnackbarProvider anchorOrigin={{ horizontal: 'right', vertical: 'top' }}>
              <ScrollToTop />
              <Router />
            </SnackbarProvider>
          </NextUIProvider>
        </ThemeProvider>
      </AppContextProvider>
    </AuthContextProvider>
  )
}

export default App
