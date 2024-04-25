import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, List, ListItem, ListItemText, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import axiosInstance from '../../utils/axios';
import FormProvider from '../../components/hook-form/FormProvider';
import RHFTextField from '../../components/hook-form/RHFTextField';
import { Add } from '@mui/icons-material';

interface IFD {
    open: boolean
    closeDialog: () => void;
    reloadHandler: () => void;
}

const AddTopicDialog = ({ closeDialog, reloadHandler, open }: IFD) => {

    const { enqueueSnackbar } = useSnackbar();

    const [addOpen, setAddOpen] = useState<boolean>(false);
    const [objValue, setObjValue] = useState<string>('');

    const TopicSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        description: Yup.string(),
        objectives: Yup.array().of(Yup.string()),
    });

    const defaultValues = {
        title: '',
        description: '',
        objectives: [],
    };

    const methods = useForm({ resolver: yupResolver(TopicSchema), defaultValues });

    const { handleSubmit, setError, setValue, watch, reset, formState: { isSubmitting, errors } } = methods;

    const values = watch();

    const closeHandler = () => {
        reset();
        closeDialog();
    };

    const addObjective = () => {
        if (objValue.length > 0) {
            setValue('objectives', [...values?.objectives || [], objValue]);
            setObjValue('');
            setAddOpen(false);
        }
    }

    const onSubmit = async (data: any) => {
        try {
            const response = await axiosInstance.post('/admin/create-topic', data);
            enqueueSnackbar(response.data.message, { variant: 'success' });
            closeHandler();
            reloadHandler();
        } catch (error: any) {
            setError('root', { ...error, message: error.message || error, });
        }
    }

  return (
    <Dialog open={open} onClose={closeHandler}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle>Create Topic</DialogTitle>
            <DialogContent>
                <Stack gap={2}>
                    {!!errors.root && <Alert severity="error">{errors.root.message}</Alert>}
                    <RHFTextField label='Title' name='title' placeholder='Title' required />
                    <RHFTextField label='Description' name='description' placeholder='Description' multiline rows={4} />
                    <Stack gap={1} direction='row' alignItems='center' justifyContent='space-between'>
                        <Typography textAlign='center'>Objectives</Typography>
                        <Button onClick={() => { setAddOpen(true) }}>Add</Button>
                    </Stack>
                    {addOpen && <TextField
                        name='objective'
                        value={objValue}
                        onChange={(e) => { setObjValue(e.target.value) }}
                        InputProps={{
                            endAdornment: <InputAdornment position='end'>
                                <IconButton onClick={addObjective}><Add /></IconButton>
                            </InputAdornment>
                        }}
                    />}
                    <List>
                        {values.objectives?.map((obj, index) => <ListItem key={index}>
                            <ListItemText primary={obj} />
                        </ListItem>)}
                    </List>
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

export default AddTopicDialog