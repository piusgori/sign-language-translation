import { Box, Drawer, IconButton, Link, List, ListItem, ListItemButton, ListItemText, Stack, styled, useMediaQuery, useTheme } from "@mui/material";
import { Link as RouterLink, useLocation } from 'react-router-dom';
import Logo from "../../components/logo";
import { pages } from "./config-navigation"
import { Close } from "@mui/icons-material";
import { useAppContext } from "../../contexts/app-context";

const StyledDrawer = styled(Drawer)(() => ({
    width: 200,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
        width: 200,
        boxSizing: 'border-box',
    }
}))

const AdminDrawer = () => {

    const { pathname } = useLocation();
    const { drawerOpen, setDrawerOpen } = useAppContext();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <StyledDrawer open={drawerOpen} onClose={() => { setDrawerOpen(false) }} variant={isSmallScreen ? 'temporary' : 'permanent'}>
        <Box sx={{ p: 2 }}>
            <Stack direction='row' alignItems='center' gap={1} justifyContent='space-between'>
                <Logo />
                {isSmallScreen && <IconButton onClick={() => { setDrawerOpen(false) }} size='small'><Close fontSize="small" /></IconButton>}
            </Stack>
        </Box>
        <Box sx={{ overflow: 'auto' }}>
            <List component='nav'>
                {pages.map((page, index) => (
                    <Link onClick={() => { setDrawerOpen(false) }} color='inherit' component={RouterLink} underline="none" to={page.path} key={index}>
                        <ListItem>
                            <ListItemButton selected={pathname === page.path}>
                                <ListItemText primary={page.name} />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                ))}
            </List>
        </Box>
    </StyledDrawer>
  )
}

export default AdminDrawer