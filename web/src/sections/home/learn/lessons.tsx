import { Button, Card, CardContent, CardMedia, Grid, LinearProgress, Stack, Typography } from "@mui/material";
import { LESSON } from "../../../utils/types";
import { useState } from "react";
import { useSnackbar } from "notistack";
import axiosInstance from "../../../utils/axios";
import { useSearchParams } from "react-router-dom";

interface LES {
    lessons: LESSON[]
}

const Lessons = ({ lessons }: LES) => {

    const { enqueueSnackbar } = useSnackbar();
    const [searchParams, _] = useSearchParams();
    const topic = searchParams.get('topicId');
    const [lessonIndex, setLessonIndex] = useState<number>(0);

    const proceedHandler = async () => {
        try {
            await axiosInstance.post('/learn-lesson', { lessonId: lessons[lessonIndex]._id });
            setLessonIndex(prev => prev + 1);
            if (lessonIndex + 1 === lessons.length) await axiosInstance.post('/complete-topic', { topic: topic })
        } catch (err: any) {
            enqueueSnackbar(err, { variant: 'error' });
        }
    }

  return (
    <>
        <Stack gap={3}>
            <Typography variant='h6'>Lessons</Typography>

            {lessons.length === 0 && <Typography textAlign='center'>No Lesson Added</Typography>}
            {lessons.length > 0 && <Stack gap={3}>

                <Stack gap={1} direction='row' alignItems='center'>
                    <Typography>Progress</Typography>
                    <LinearProgress sx={{ width: '200px' }} variant='determinate' value={Math.round(((lessonIndex + 1) / lessons.length) * 100)} />
                    <Typography>{Math.round(((lessonIndex + 1) / lessons.length) * 100)} %</Typography>
                    <Button disabled={((lessonIndex + 1)) >= lessons.length} onClick={proceedHandler}>Next</Button>
                </Stack>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={4} xl={3}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="100"
                                image={lessons[lessonIndex].url}
                                alt={lessons[lessonIndex].title}
                            />
                            <CardContent>
                                <Typography variant='h6' fontWeight='500'>Meaning: {lessons[lessonIndex].title}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Stack>}
        </Stack>
    </>
  )
}

export default Lessons