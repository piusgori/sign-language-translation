import { Box, Card, Stack, styled } from "@mui/material";
import { ReactNode } from "react";
import Logo from "../../components/logo";

const OverallContainer = styled('div')(() => ({
    width: '100%',
    height: '100vh',
    display: 'flex'
}))

const ContentBox = styled(Box)(() => ({
    padding: '20px',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const InformationContainer = styled(Card)(({  }) => ({
    padding: 32,
    border: '1px solid #dadada',
    borderRadius: 8,
}));


const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <OverallContainer>
        <ContentBox>
            <InformationContainer elevation={0}>
                <Stack gap={2} alignItems='center'>
                    <Logo />
                    {children}
                </Stack>
            </InformationContainer>
        </ContentBox>
    </OverallContainer>
  )
}

export default AuthLayout