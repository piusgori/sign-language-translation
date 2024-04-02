import { Avatar, Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material"

import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useRef } from "react";
import { useAuthContext } from "../../../auth/auth-context";
import { useAppContext } from "../../../services/app-context";
import { MESSAGE } from "../../../utils/types";

dayjs.extend(relativeTime);

const ChatConversation = () => {

    const lastDivRef = useRef<HTMLDivElement | null>(null)
    
    const { user } = useAuthContext();
    const { chats, selectedUser } = useAppContext();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))

    const foundChat = chats.find(chat => chat.userOne?._id === selectedUser || chat.userTwo._id === selectedUser);
    
    useEffect(() => {
        lastDivRef.current?.scrollIntoView()
    }, [selectedUser, chats])

    const SingleMessage = ({ message }: { message: MESSAGE }) => {

        const theUser = foundChat?.userOne?._id === user?._id ? foundChat?.userTwo : foundChat?.userOne;

        const isMine = message.from === user?._id;
        return (
            <Stack direction='row' justifyContent={isMine ? 'flex-end' : 'unset' } sx={{ mb: 2 }}>
                {!isMine && <Avatar sx={{ width: 32, height: 32, mr: 2 }}>{theUser?.firstName[0]}</Avatar>}
                <Stack alignItems={isMine ? 'flex-end' : 'flex-start'}>
                    <Typography noWrap variant='caption' sx={{ mb: 1, color: 'text.disabled', mr: 'auto' }}>
                        {!isMine && `${theUser?.firstName} ${theUser?.lastName},`} &nbsp;
                        {dayjs(message.createdAt).fromNow(true)}
                    </Typography>
                    <Stack direction='row' alignItems='center' sx={{ position: 'relative' }}>
                        <Stack
                            sx={{
                                p: 1.5,
                                minWidth: 48,
                                maxWidth: 320,
                                borderRadius: '0 8px 8px 8px',
                                typography: 'body2',
                                bgcolor: '#f4f6f8'
                            }}
                            gap={2}
                        >
                            {message.message}
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
    )}

  return (
    <Stack sx={{ width: 1, height: '100%', overflow: 'auto', borderTop: '1px solid #ede6ea', ...(isSmallScreen && { flexGrow: 1 }) }}>
        <Box sx={{ px: 3, py: 5, height: '100%', overflow: 'auto' }}>
            {!selectedUser && <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography>Please select a chat to view conversation</Typography>
            </Box>}
            {selectedUser && foundChat?.messages?.map((mes, index) => {
                return (
                    <SingleMessage message={mes} key={index} />
                )
            })}
            {selectedUser && <div ref={lastDivRef} />}
        </Box>
    </Stack>
  )
}

export default ChatConversation