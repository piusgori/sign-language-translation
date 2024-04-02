import { Search } from "@mui/icons-material"
import { Avatar, Badge, Box, Button, ClickAwayListener, InputAdornment, ListItemButton, ListItemText, Stack, TextField, Typography, useMediaQuery, useTheme } from "@mui/material"
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import { useAuthContext } from "../../../auth/auth-context";
import { CHAT, USER } from "../../../utils/types";
import { useAppContext } from "../../../services/app-context";
import { useState } from "react";
import NewConversationDialog from "./new-conversation-dialog";

dayjs.extend(relativeTime);

const ChatNav = () => {

    const { user } = useAuthContext();
    const { selectChatHandler, chats, selectedUser } = useAppContext();

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [newOpen, setNewOpen] = useState<boolean>(false);


    const SingleProfile = ({ profile, theChat }: { profile: USER, theChat: CHAT }) => {

        return (
            <ListItemButton onClick={() => { selectChatHandler(profile?._id || '') }} disableGutters sx={{ py: 1.5, px: 2.5, ...(selectedUser === profile?._id && { backgroundColor: '#edeff2' }) }}>
                <Avatar>{profile?.firstName[0]}</Avatar>
                 
                 <ListItemText 
                    sx={{ ml: 2 }}
                    primary={`${profile?.firstName}`}
                    primaryTypographyProps={{
                        noWrap: true,
                        variant: 'subtitle2',
                    }}
                    secondary={theChat.lastMessage?.message}
                    secondaryTypographyProps={{
                        noWrap: true,
                        component: 'span',
                        variant: 'body2',
                        color: 'text.secondary',
                      }}
                />
                <Stack alignItems="flex-end" sx={{ ml: 2 }}>
                    <Typography noWrap variant="body2" component='span' sx={{ mb: 1.5, fontSize: 12, color: 'text.disabled' }}>{dayjs(theChat.lastMessage?.createdAt).fromNow(true)}</Typography>
                </Stack>
            </ListItemButton>
        )
    }

  return (
    <>
        <NewConversationDialog closeDialog={() => { setNewOpen(false) }} open={newOpen} />
        <Stack sx={{ height: 1, flexShrink: 0, width: 300, borderRight: '1px solid #ede6ea', ...(isSmallScreen && { borderRight: '0px', width: '100%' }) }}>
            <Stack direction="row" gap={2} alignItems="center" justifyContent="center" sx={{ p: 2.5, pb: 0, }}>
                <>
                    <Badge variant='standard' anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                        <Avatar sx={{ width: 48, height: 48 }} src={user?.photoURL} alt='Person' />
                    </Badge>
                </>
                <Stack gap={0.5} sx={{ flexGrow: 1 }}>
                    <Typography noWrap color='primary'>{user?.firstName} {user?.lastName}</Typography>
                    <Box sx={{ px: 0.5, backgroundColor: '#f4c7fd', width: 'fit-content', borderRadius: 1 }}>
                        <Typography textTransform='uppercase' fontWeight={600} color='primary.dark' variant="caption" fontSize={10}>{user?.specialization}</Typography>
                    </Box>
                </Stack>
            </Stack>
            <Button onClick={() => { setNewOpen(true) }} sx={{ m: 2 }}>Start New Conversation</Button>
            <Box sx={{ p: 2.5, pt: 0 }}>
                <ClickAwayListener onClickAway={() => {}}>
                    <TextField 
                        placeholder="Search user..." 
                        fullWidth 
                        size='small'
                        sx={{ mt: 2.5 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'><Search /></InputAdornment>
                            )
                        }}
                    />
                </ClickAwayListener>
            </Box>
            <Box sx={{ height: 1, overflow: 'auto' }}>
                {chats.map((pro, ind) => {
                    const theUser = pro.userOne._id === user?._id ? pro.userTwo : pro.userOne;
                    return (
                        <SingleProfile profile={theUser} theChat={pro} key={ind} />
                )})}
            </Box>
        </Stack>
    </>
  )
}

export default ChatNav