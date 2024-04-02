import { styled } from "@mui/material"
import { Spinner } from "@nextui-org/spinner"

const OverallContainer = styled('div')(() => ({
    height: '100vh',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}))

const Preloader = () => {
  return (
    <OverallContainer>
        <Spinner />
    </OverallContainer>
  )
}

export default Preloader