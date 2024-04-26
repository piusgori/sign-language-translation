import { Button, Card, Grid, LinearProgress, Stack, Typography } from "@mui/material";
import { QUESTION } from "../../../utils/types";
import { useState } from "react";
import { useSnackbar } from "notistack";
// import { useSearchParams } from "react-router-dom";

interface QUIZ {
    questions: QUESTION[]
}

const Quiz = ({ questions }: QUIZ) => {

    const { enqueueSnackbar } = useSnackbar();
    // const [searchParams, _] = useSearchParams();
    // const topic = searchParams.get('topicId');
    const [questionIndex, _] = useState<number>(0);

    const answerQuestion = async () => {
        try {
            // await axiosInstance.post('/learn-lesson', { lessonId: lessons[lessonIndex]._id });
            // setLessonIndex(prev => prev + 1);
            // if (lessonIndex + 1 === lessons.length) await axiosInstance.post('/complete-topic', { topic: topic })
        } catch (err: any) {
            enqueueSnackbar(err, { variant: 'error' });
        }
    }

  return (
    <>
        <Stack gap={3}>
            <Typography variant='h6'>Lessons</Typography>

            {questions.length === 0 && <Typography textAlign='center'>No Question Added</Typography>}
            {questions.length > 0 && <Stack gap={3}>

                <Stack gap={1} direction='row' alignItems='center'>
                    <Typography>Progress</Typography>
                    <LinearProgress sx={{ width: '200px' }} variant='determinate' value={Math.round((questionIndex + 1 / questions.length) * 100)} />
                    <Typography>{Math.round((questionIndex + 1 / questions.length) * 100)} %</Typography>
                    <Button disabled={(questionIndex + 1) >= questions.length} onClick={answerQuestion}>Next</Button>
                </Stack>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={4} xl={3}>
                        <Card>
                        </Card>
                    </Grid>
                </Grid>
            </Stack>}
        </Stack>
    </>
  )
}

export default Quiz