import { BottomNavigation, BottomNavigationAction, styled } from "@mui/material"
import { ReactNode, useEffect, useState } from "react"
import TopBar from "./top-bar"
import { BookOnline, ChatBubbleOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const OverallContainer = styled('div')(() => ({
    height: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
}));

const ContentContainer = styled('div')(() => ({
    flex: 1,
    padding: '24px',
    overflow: 'auto'
}))

interface DL {
    children: ReactNode
}

const DashboardLayout = ({ children }: DL) => {

    const navigate = useNavigate();

    const [value, setValue] = useState<any>(0);


    useEffect(() => {
        if (value === 0) navigate('/home');
        else if (value === 1) navigate('/home/learn');
    }, [value])

  return (
    <OverallContainer>
        <TopBar />
        <ContentContainer>{children}</ContentContainer>
        <BottomNavigation
            showLabels
            sx={{ width: '100%' }}
            value={value}
            onChange={(_, newValue) => { setValue(newValue) }}
        >
            <BottomNavigationAction label='Conversations' icon={<ChatBubbleOutline />} />
            <BottomNavigationAction label='Learn' icon={<BookOnline />} />
        </BottomNavigation>
    </OverallContainer>
  )
}

export default DashboardLayout