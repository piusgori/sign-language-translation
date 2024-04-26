import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, Typography } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { LoadingButton } from '@mui/lab';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useSnackbar } from 'notistack';
import { storage } from '../../utils/firebase';
import axiosInstance from '../../utils/axios';
import FormProvider from '../../components/hook-form/FormProvider';
import RHFTextField from '../../components/hook-form/RHFTextField';
import RHFUpload from '../../components/hook-form/RHFUpload';
import { useSearchParams } from 'react-router-dom';
import { RHFSelect } from '../../components/hook-form/RHFSelect';
import { Image } from '@nextui-org/image';

interface AQF {
    open: boolean
    closeDialog: () => void;
    reloadHandler: () => void;
}

const AddQuestionForm = ({ closeDialog, reloadHandler, open }: AQF) => {

    const { enqueueSnackbar } = useSnackbar();
    const [searchParams, _] = useSearchParams();
    const topic = searchParams.get('topicId');

    const QuestionSchema = Yup.object().shape({
        topic: Yup.string().required('Please select a topic'),
        text: Yup.string().required('Question Is Required'),
        options: Yup.mixed(),
        correctAnswer: Yup.string(),
    });

    const defaultValues = {
        topic: '',
        text: '',
        options: [],
        correctAnswer: ''
    };

    const methods = useForm({ resolver: yupResolver(QuestionSchema), defaultValues });

    const { handleSubmit, setError, setValue, watch, reset, formState: { isSubmitting, errors } } = methods;

    const values = watch();

    const closeHandler = () => {
        reset();
        closeDialog();
    };

    const addImage = useCallback((acceptedFiles: any) => {
        const files = values.options || [];
        const newFiles = acceptedFiles.map((file: any) => Object.assign(file, { preview: URL.createObjectURL(file), }) );
        setValue('options', [...files, ...newFiles], { shouldValidate: true });
      },
      [setValue, values.options]
    );

    const removeImages = useCallback((inputFile: any) => {
        const filtered = values.options?.filter((file: any) => file.name !== inputFile.name);
        setValue('options', filtered);
        },
        [setValue, values]
    );

    const uploadImages = async (files: any) => {
        const uploadedImages = files;
        for (let i = 0; i < files.length; i += 1) {
        if (files[i]?.name) {
            const documentRef = ref(storage, `questions/${files[i].name}`);
            const res = await uploadBytes(documentRef, files[i]);
            const documentUrl = await getDownloadURL(res.ref);
            uploadedImages[i] = documentUrl;
        }
        };
        return uploadedImages;
    }

    const onSubmit = async (data: any) => {
        try {
            const submitForm = data;
            if (data.options) {
                const uploadedImages = await uploadImages(data.options);
                submitForm.options = uploadedImages;
            }
            const response = await axiosInstance.post('/admin/add-quiz', submitForm);
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
            <DialogTitle>Add a question for the quiz</DialogTitle>
            <DialogContent>
                <Stack gap={2}>
                    {!!errors.root && <Alert severity="error">{errors.root.message}</Alert>}
                    <RHFTextField label='Question' name='text' placeholder='Question' required />
                    <Typography>Options</Typography>
                    <RHFUpload name='options' accept={{ 'image/*': [] }} onDrop={addImage} multiple onRemove={removeImages} placeholder='Select images' />
                    <RHFSelect name='correctAnswer' label='Select Correct Answer' placeholder='Select Correct Answer'>
                        {values.options.map((opt: any, index: any) => <MenuItem key={index} value={index}><Image alt='image' src={opt?.preview || opt} className='h-[100px]' /></MenuItem>)}
                    </RHFSelect>
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

export default AddQuestionForm