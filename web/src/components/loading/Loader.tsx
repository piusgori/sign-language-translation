import { Stack } from "@mui/material";
import { Spinner } from "@nextui-org/spinner";

const Loader = () => {
  return (
    <Stack sx={{ height: '100%', width: '100%' }} alignItems='center' justifyContent='center'>
        <Spinner />
    </Stack>
  )
}

export default Loader