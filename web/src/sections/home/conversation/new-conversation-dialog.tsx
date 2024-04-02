import { Button, Card, CardActions, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { USER } from "../../../utils/types";
import axiosInstance from "../../../utils/axios";
import { useSnackbar } from "notistack";
import { useAppContext } from "../../../services/app-context";
import { LoadingButton } from "@mui/lab";

interface NCD {
    open: boolean;
    closeDialog: () => void;
}

const NewConversationDialog = ({ closeDialog, open }: NCD) => {

    const { enqueueSnackbar } = useSnackbar();
    const { selectChatHandler } = useAppContext();

    const [input, setInput] = useState<string>('');
    const [searchUser, setSearchUser] = useState<USER | null>(null);
    const [isSearching, setIsSearching] = useState<boolean>(false);

    const searchUserHandler = async () => {
        try {
            setIsSearching(true);
            const { data } = await axiosInstance.get(`/search-user?email=${input}`);
            setSearchUser(data.user)
        } catch (err: any) {
            enqueueSnackbar(err, { variant: 'error' })
        } finally {
            setIsSearching(false);
        }
    }

    const selectUserHandler = () => {
        selectChatHandler(searchUser?._id || '');
        closeDialog();
    }

  return (
    <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>Search For User To Start Communication With</DialogTitle>
        <DialogContent>
        {!searchUser && <TextField
            value={input}
            onChange={(e) => { setInput(e.target.value) }}
            type='email'
            placeholder='Email Address'
            label='Email Address'
            fullWidth
        />}
        {searchUser && <Card>
                <CardHeader subheader='User Found' />
                <CardContent>
                    <Typography>{searchUser.firstName} {searchUser.lastName} - {searchUser.email}</Typography>
                    <Typography>This user {searchUser.disabled ? 'has' : 'does not have'} a hearing or listening impairement</Typography>
                </CardContent>
                <CardActions>
                    <Button onClick={closeDialog}>Cancel</Button>
                    <Button variant='contained' onClick={selectUserHandler}>Select</Button>
                </CardActions>
            </Card>}
        </DialogContent>
        {!searchUser && <DialogActions>
            <Button onClick={closeDialog}>Cancel</Button>
            <LoadingButton variant='contained' loading={isSearching} onClick={searchUserHandler}>Search</LoadingButton>
        </DialogActions>}
    </Dialog>
  )
}

export default NewConversationDialog