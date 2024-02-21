import { AppBar, Avatar, IconButton, Stack, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material"
import { useAuthContext } from "../../auth/auth-context"
import { Menu } from "@mui/icons-material";
import { useAppContext } from "../../contexts/app-context";

const AdminTopBar = () => {
    const { user } = useAuthContext();
    const { setDrawerOpen } = useAppContext();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    
  return (
    <AppBar position="static" elevation={0} color="inherit">
        <Toolbar>
          <Stack sx={{ width: '100%' }} alignItems='center' gap={2} direction='row' justifyContent='space-between'>
            {isSmallScreen && <IconButton onClick={() => { setDrawerOpen(true) }} size='small'><Menu fontSize="small" /></IconButton>}
            <Stack sx={{ width: '100%' }} alignItems='center' gap={2} direction='row' justifyContent='flex-end'>
                <Avatar alt={user?.name} src={user?.photoURL} sx={{ ...(isSmallScreen && { width: 24, height: 24 }) }} />
                {!isSmallScreen && <Typography>Hi {user?.name}</Typography>}
            </Stack>
          </Stack>
        </Toolbar>
    </AppBar>
  )
}

export default AdminTopBar