import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import axiosInstance from "../utils/axios";
import { useAuthContext } from "../auth/auth-context";
import { CHAT, NOTIFICATION } from "../utils/types";
import { useSnackbar } from "notistack";
import { v4 as uuidv4 } from 'uuid';


const AppContext = createContext({
  isLoading: false,
  isRefreshing: false,
  messageInput: '',
  selectedUser: null as string | null,
  chats: [] as CHAT[],
  notifications: [] as NOTIFICATION[],
  isGettingNotifications: false,
  setMessageInput: (_: string) => {},
  selectChatHandler: (_: string) => {},
  unselectChat: () => {},
  sendMessage: () => {},
  refreshHandler: () => {},
  getNotificationsHandler: () => {},
});

export const useAppContext = () => {
    const context = useContext(AppContext);
    return context;
};

export default function AppContextProvider ({ children }: { children: ReactNode }) {

    const { enqueueSnackbar } = useSnackbar();

    const { isAuthenticated, user } = useAuthContext();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [messageInput, setMessageInput] = useState<string>('');
    // const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [chats, setChats] = useState<CHAT[]>([]);
    const [notifications, setNotifications] = useState<NOTIFICATION[]>([]);
    const [isGettingNotifications, setIsGettingNotifications] = useState<boolean>(false);

    const getNotificationsHandler = async () => {
      try {
        setIsGettingNotifications(true);
        const { data } = await axiosInstance.get('/notifications');
        setNotifications(data.notifications);
      } catch (err: any) {
        enqueueSnackbar(err, { variant: 'error' })
      } finally {
        setIsGettingNotifications(false);
      }
    }

    const getChatsHandler = async () => {
      try {
        const { data } = await axiosInstance.get('/chats');
        setChats(data.chats);
      } catch (err: any) {
        enqueueSnackbar(err, { variant: 'error' })
      } 
    }

    const selectChatHandler = (userId: string) => {
      const foundChat = chats.find(each => (each.userOne?._id === userId || each.userTwo?._id === userId));
      if (foundChat) setSelectedUser(userId);
    }
  
    const unselectChat = () => {
        setSelectedUser(null);
    }

    const refreshHandler = async () => {
      try {
        setIsRefreshing(true);
        await getChatsHandler()
      } catch (err: any) {
        console.log(err);
      } finally {
        setIsRefreshing(false);
      }
    }

    const initialization = async () => {
      try {
        setIsLoading(true);
        await getChatsHandler();
        await getNotificationsHandler();
        setIsLoading(false);
      } catch (err: any) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    
      const sendMessage = async () => {
        const mes = messageInput;
        if (messageInput.length === 0) return;
        try {
            if (!mes && !selectedUser) return;
            const createdMessage = { message: mes, from: user?._id, to: selectedUser || '', createdAt: new Date(), id: uuidv4() as string };
            setChats(each => each.map((ch) => {
                if (ch.userOne?._id === selectedUser || ch.userTwo?._id === selectedUser) {
                    return {
                        ...ch,
                        lastMessage: createdMessage,
                        messages: [...ch.messages || [], createdMessage]
                    }
                }
                return ch;
            }));
            await axiosInstance.post('/send-message', createdMessage);
            setMessageInput('');
            getChatsHandler();
        } catch (err: any) {
            console.log(err);
        }
      }

      useEffect(() => {
        if (isAuthenticated) {
          initialization();
        }
      }, [isAuthenticated]);

    const value = useMemo(() => ({
      isLoading,
      messageInput,
      selectedUser,
      chats,
      setMessageInput,
      selectChatHandler,
      unselectChat,
      sendMessage,
      refreshHandler,
      isRefreshing,
      isGettingNotifications,
      getNotificationsHandler,
      notifications,
    }), [
      isLoading,
      messageInput,
      selectedUser,
      chats,
      setMessageInput,
      selectChatHandler,
      unselectChat,
      sendMessage,
      refreshHandler,
      isRefreshing,
      isGettingNotifications,
      getNotificationsHandler,
      notifications,
    ]);

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>

}