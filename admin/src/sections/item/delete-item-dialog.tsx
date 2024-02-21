import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { ITEM } from '../../utils/types';
import axiosInstance from '../../utils/axios';


interface DID {
    selectedItem: ITEM | null
    open: boolean
    closeDialog: () => void;
    reloadHandler: () => void;
}

const DeleteItemDialog = ({ closeDialog, reloadHandler, selectedItem, open }: DID) => {

    const { enqueueSnackbar } = useSnackbar();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const approveHandler = async () => {
        try {
            setIsLoading(true);
            await axiosInstance.delete(`/admin/delete-item?itemId=${selectedItem?._id}`);
            enqueueSnackbar('The resource has been deleted', { variant: 'success' });
            closeDialog();
            reloadHandler();
        } catch (error: any) {
            enqueueSnackbar(error, { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
            <DialogContentText>Are you sure you want to delete the selected resource?</DialogContentText>
        </DialogContent>
        <DialogActions>
            {!isLoading && <Button onClick={closeDialog}>No</Button>}
            <LoadingButton loading={isLoading} onClick={approveHandler} variant='contained'>Yes</LoadingButton>
        </DialogActions>
    </Dialog>
  )
}

export default DeleteItemDialog