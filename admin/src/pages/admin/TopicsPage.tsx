import { useEffect, useState } from "react"
import { TOPIC } from "../../utils/types";
import { useSnackbar } from "notistack";
import axiosInstance from "../../utils/axios";
import { Button, Card, CardActions, CardContent, Grid, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import LoadingScreen from "../../components/loading-screen";
import AddTopicDialog from "../../sections/topic/add-topic-dialog";
import { useNavigate } from "react-router-dom";

const TopicsPage = () => {

    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [topics, setTopics] = useState<TOPIC[]>([]);
    const [formOpen, setFormOpen] = useState<boolean>(false);


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
    <>
        <AddTopicDialog closeDialog={() => { setFormOpen(false) }} open={formOpen} reloadHandler={getTopics} />
        <Stack gap={3}>
            <Stack direction='row' alignItems='center' justifyContent='space-between' gap={1}>
                <Typography variant='h5' fontWeight='600'>Topics</Typography>
                <Button variant='contained' onClick={() => { setFormOpen(true) }}>Add Topic</Button>
            </Stack>
            {isLoading && <LoadingScreen />}
            {!isLoading && <>
                {topics.length === 0 && <Typography textAlign='center'>Topics not added yet</Typography>}
                {topics.length > 0 && <Grid container spacing={3}>
                    {topics.map((topic, index) => {
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
                                    </CardContent>
                                    <CardActions>
                                        <Button onClick={() => { navigate(`/admin/topic?topicId=${topic?._id}`) }}>View</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        )
                    })}
                </Grid>}
            </>}
        </Stack>
    </>
  )
}

export default TopicsPage