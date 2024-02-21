import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { LoadingButton } from '@mui/lab';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useSnackbar } from 'notistack';
import { ITEM } from '../../utils/types';
import { storage } from '../../utils/firebase';
import axiosInstance from '../../utils/axios';
import FormProvider from '../../components/hook-form/FormProvider';
import RHFTextField from '../../components/hook-form/RHFTextField';
import { RHFUploadAvatar } from '../../components/hook-form/RHFUpload';

interface IFD {
    selectedItem: ITEM | null
    open: boolean
    closeDialog: () => void;
    reloadHandler: () => void;
}

const ItemFormDialog = ({ closeDialog, reloadHandler, selectedItem, open }: IFD) => {

    const { enqueueSnackbar } = useSnackbar();

    const ItemSchema = Yup.object().shape({
        _id: Yup.string(),
        meaning: Yup.string().required('Meaning Is Required'),
        image: Yup.mixed(),
    });

    const defaultValues = {
        _id: '',
        meaning: '',
        image: '',
    };

    const methods = useForm({ resolver: yupResolver(ItemSchema), defaultValues });

    const { handleSubmit, setError, setValue, reset, formState: { isSubmitting, errors } } = methods;

    const closeHandler = () => {
        reset();
        closeDialog();
    };

    const selectImage = useCallback((acceptedFiles: any) => {
        const file = acceptedFiles[0];
        const newFile = Object.assign(file, { preview: URL.createObjectURL(file), });
        if (file) setValue('image', newFile, { shouldValidate: true });
      },
      [setValue]
    );

    const uploadImage = async (file: any) => {
        const documentRef = ref(storage, `learning/${file.name}`);
        const res = await uploadBytes(documentRef, file);
        const documentUrl = await getDownloadURL(res.ref);
        return documentUrl;
    }

    const onSubmit = async (data: any) => {
        try {
            const submitForm = data;
            if (data?.image && data?.image?.name) {
                const url = await uploadImage(data?.image);
                submitForm.image = url;
            };
            if (selectedItem) await axiosInstance.patch('/admin/edit-item', submitForm);
            else if (!selectedItem) await axiosInstance.post('/admin/add-item', submitForm);
            enqueueSnackbar('Resource Data Has Been Saved', { variant: 'success' });
            closeHandler();
            reloadHandler();
        } catch (error: any) {
            setError('root', { ...error, message: error.message || error, });
        }
    }

    useEffect(() => {
        if (selectedItem) {
            setValue('_id', selectedItem._id);
            setValue('meaning', selectedItem.meaning);
            setValue('image', selectedItem.image || '');
        }
    }, [selectedItem]);

  return (
    <Dialog open={open} onClose={closeHandler}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle>{selectedItem ? 'Edit the selected' : 'Add A New'} learning resource</DialogTitle>
            <DialogContent>
                <Stack gap={2}>
                    {!!errors.root && <Alert severity="error">{errors.root.message}</Alert>}
                    <Typography>Resource Image</Typography>
                    <RHFUploadAvatar name='image' onDrop={selectImage} placeholder='Select Resource Image' />
                    <RHFTextField label='Meaning' name='meaning' placeholder='Meaning' required />
                </Stack>
            </DialogContent>
            <DialogActions>
                {!isSubmitting && <Button onClick={closeHandler}>Cancel</Button>}
                <LoadingButton loading={isSubmitting} type='submit' variant='contained'>Save</LoadingButton>
            </DialogActions>
        </FormProvider>
    </Dialog>
  )
}

export default ItemFormDialog