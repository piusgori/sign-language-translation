import { AppBar, Avatar, Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Toolbar, Typography } from '@mui/material'
import { useAuthContext } from '../../auth/auth-context'
import Logo from '../../components/logo';
import { MouseEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logout } from '@mui/icons-material';

const TopBar = () => {

    const { user, logout } = useAuthContext();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const openMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    const navigationHandler = () => {
        closeMenu();
        navigate('/home/profile')
    }

    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={closeMenu}
            onClick={closeMenu}
            PaperProps={{
                elevation: 0,
                sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                    },
                    '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                    },
                },
            }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
            <ListItemText
                primary={`Hello ${user?.firstName}`}
                secondary={user?.email}
            />
        </MenuItem>
        {/* <Stack gap={1}>
            <Typography>Hello {user?.firstName}</Typography>
            <Typography variant='body2'>{user?.email}</Typography>
        </Stack> */}
        <MenuItem onClick={navigationHandler}><Typography noWrap>View profile</Typography></MenuItem>
        <Divider />
        <MenuItem onClick={() => { closeMenu(); logout() }}><ListItemIcon><Logout fontSize="small" /></ListItemIcon>Logout</MenuItem>
      </Menu>
    )

  return (
    <>
        {renderMenu}
        <AppBar color='transparent' position='static'>
            <Toolbar>
                <Stack sx={{ width: '100%' }} direction='row' alignItems='center' justifyContent='space-between'>
                    <Logo width='75px' />
                    <IconButton onClick={openMenu} aria-controls={open ? 'account-menu' : undefined} aria-haspopup="true" aria-expanded={open ? 'true' : undefined}><Avatar alt={user?.firstName} src={user?.photoURL} /></IconButton>
                </Stack>
            </Toolbar>
        </AppBar>
    </>
  )
}

export default TopBar