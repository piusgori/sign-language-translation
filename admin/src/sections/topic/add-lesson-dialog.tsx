import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { LoadingButton } from '@mui/lab';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useSnackbar } from 'notistack';
import { storage } from '../../utils/firebase';
import axiosInstance from '../../utils/axios';
import FormProvider from '../../components/hook-form/FormProvider';
import RHFTextField from '../../components/hook-form/RHFTextField';
import { RHFUploadAvatar } from '../../components/hook-form/RHFUpload';
import { useSearchParams } from 'react-router-dom';

interface ALD {
    open: boolean
    closeDialog: () => void;
    reloadHandler: () => void;
}

const AddLessonDialog = ({ closeDialog, reloadHandler, open }: ALD) => {

    const { enqueueSnackbar } = useSnackbar();
    const [searchParams, setSearchParams] = useSearchParams();
    const topic = searchParams.get('topicId');

    const LessonSchema = Yup.object().shape({
        topic: Yup.string().required('Please select a topic'),
        title: Yup.string().required('Title Is Required'),
        url: Yup.mixed(),
    });

    const defaultValues = {
        topic: '',
        title: '',
        url: '',
    };

    const methods = useForm({ resolver: yupResolver(LessonSchema), defaultValues });

    const { handleSubmit, setError, setValue, reset, formState: { isSubmitting, errors } } = methods;

    const closeHandler = () => {
        reset();
        closeDialog();
    };

    const selectImage = useCallback((acceptedFiles: any) => {
        const file = acceptedFiles[0];
        const newFile = Object.assign(file, { preview: URL.createObjectURL(file), });
        if (file) setValue('url', newFile, { shouldValidate: true });
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
            if (data?.url && data?.url?.name) {
                const url = await uploadImage(data?.url);
                submitForm.url = url;
            };
            const response = await axiosInstance.post('/admin/add-lesson', submitForm);
            enqueueSnackbar(response.data.message, { variant: 'success' });
            closeHandler();
            reloadHandler();
        } catch (error: any) {
            setError('root', { ...error, message: error.message || error, });
        }
    }

    useEffect(() => {
        if (topic) {
            setValue('topic', topic);
        }
    }, [topic]);

  return (
    <Dialog open={open} onClose={closeHandler}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle>Add a lesson for the selected topic</DialogTitle>
            <DialogContent>
                <Stack gap={2}>
                    {!!errors.root && <Alert severity="error">{errors.root.message}</Alert>}
                    <Typography>Sign Language</Typography>
                    <RHFUploadAvatar name='url' onDrop={selectImage} placeholder='Select An Image' />
                    <RHFTextField label='Meaning' name='title' placeholder='Meaning' required />
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

export default AddLessonDialog