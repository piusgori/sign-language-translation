import { Avatar, IconButton, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { ArrowBack } from '@mui/icons-material';
import { useAuthContext } from '../../../auth/auth-context';
import { useAppContext } from '../../../services/app-context';


const ChatHeader = () => {

  const { user } = useAuthContext();
  const { chats, selectedUser, unselectChat } = useAppContext();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const foundChat = chats.find(chat => chat.userOne?._id === selectedUser || chat.userTwo?._id === selectedUser);

  const theUser = foundChat?.userOne._id === user?._id ? foundChat?.userTwo : foundChat?.userOne

  return (
    <Stack gap={2} direction='row' alignItems='center' flexShrink={0} sx={{ minHeight: 72, ml: 2 }}>
      {isSmallScreen && <IconButton onClick={unselectChat} size='small'><ArrowBack fontSize='small' /></IconButton>}
      <Avatar sx={{ width: 32, height: 32 }}>{selectedUser ? theUser?.firstName[0] : user?.firstName[0]}</Avatar>
      <Stack>
          <Typography>{selectedUser ? `${theUser?.firstName}` : 'You'}</Typography>
      </Stack>
    </Stack>
  )
}

export default ChatHeader