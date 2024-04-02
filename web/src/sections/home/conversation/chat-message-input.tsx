import { Camera, Send } from "@mui/icons-material"
import { IconButton, InputBase, Stack } from "@mui/material"
import { useAppContext } from "../../../services/app-context"
import { useState } from "react";
import CameraDialog from "./camera-dialog";

const ChatMessageInput = () => {

    const { selectedUser, messageInput, setMessageInput, sendMessage } = useAppContext();

    const [camOpen, setCamOpen] = useState<boolean>(false);

  return (
    <div style={{ width: '100%' }}>
        <CameraDialog closeDialog={() => { setCamOpen(false) }} open={camOpen} />
        <InputBase
            disabled={!!selectedUser == false}
            value={messageInput}
            fullWidth
            multiline
            onChange={(e) => { setMessageInput(e.target.value) }}
            placeholder='Type a message'
            endAdornment={
                <Stack direction='row' sx={{ flexShrink: 0 }}>
                    <IconButton disabled={messageInput.length === 0} onClick={sendMessage}><Send fontSize='small' /></IconButton>
                    <IconButton onClick={() => { setCamOpen(true) }}><Camera fontSize='small' /></IconButton>
                </Stack>
            }
            sx={{ px: 1, height: 56, flexShrink: 0, borderTop: (theme) => `1px solid ${theme.palette.divider}` }}
        />
    </div>
  )
}

export default ChatMessageInput