import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { useAppContext } from "../../services/app-context";
import Loader from "../../components/loading/Loader";
import ChatNav from "../../sections/home/conversation/chat-nav";
import ChatHeader from "../../sections/home/conversation/chat-header";
import ChatConversation from "../../sections/home/conversation/chat-conversation";
import ChatMessageInput from "../../sections/home/conversation/chat-message-input";

const HomePage = () => {

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const { isLoading, selectedUser } = useAppContext();

  return (
    <Stack direction='row' sx={{ height: 1,border: '1px solid #ede6ea', borderRadius: 4, }}>
      {isLoading && <Loader />}
      {!isLoading && <Stack direction='row' sx={{ width: '100%' }}>
        {(!isSmallScreen || (isSmallScreen && !selectedUser)) && <ChatNav />}
        {(!isSmallScreen || (isSmallScreen && selectedUser)) && <Stack sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
          <ChatHeader />
          <ChatConversation />
          <ChatMessageInput />
        </Stack>}
      </Stack>}
    </Stack>
  )
}

export default HomePage;