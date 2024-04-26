import { Button, Card, CardActions, CardContent, Chip, Grid, List, ListItem, ListItemText, Stack, Typography } from "@mui/material"
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TOPIC } from "../../utils/types";
import axiosInstance from "../../utils/axios";
import Loader from "../../components/loading/Loader";
import { useAuthContext } from "../../auth/auth-context";

const LearnPage = () => {

    const { enqueueSnackbar } = useSnackbar();
    const { user } = useAuthContext();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [topics, setTopics] = useState<TOPIC[]>([]);


    const getTopics = async () => {
        try {
            setIsLoading(true);
            const { data } = await axiosInstance.get('/topics');
            setTopics(data.topics);
        } catch (err: any) {
            enqueueSnackbar(err, { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getTopics();
    }, [])

  return (
    <Stack gap={3}>
        <Typography variant='h5' fontWeight='600'>Topics</Typography>
        {isLoading && <Loader />}
        {!isLoading && <>
            {topics.length === 0 && <Typography textAlign='center'>Topics not added yet</Typography>}
            {topics.length > 0 && <Grid container spacing={3}>
                {topics.map((topic, index) => {
                    const completed = topic.users?.includes(user?._id)
                    return (
                        <Grid item key={index} xs={12} md={6} lg={4}>
                            <Card variant="outlined" style={{ margin: '20px', padding: '20px' }}>
                                <CardContent>
                                    <Typography variant="h5" gutterBottom>{topic.title}</Typography>
                                    <Typography variant="body1" gutterBottom>{topic.description}</Typography>

                                    <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>Learning Objectives: </Typography>
                                    <List>
                                        {topic.objectives.map((objective, index) => (
                                            <ListItem key={index}>
                                                <ListItemText primary={objective} />
                                            </ListItem>
                                        ))}
                                    </List>
                                    {completed && <Chip variant="filled" color='success' label='Completed' />}
                                </CardContent>
                                <CardActions>
                                    <Button onClick={() => { navigate(`/home/topic?topicId=${topic?._id}`) }}>View</Button>
                                    {completed && <Button onClick={() => { navigate(`/home/topic?topicId=${topic?._id}&quiz=view`) }}>Quiz</Button>}
                                </CardActions>
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>}
        </>}
    </Stack>
  )
}

export default LearnPage