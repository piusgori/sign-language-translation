import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"
import { TOPIC } from "../../utils/types";
import axiosInstance from "../../utils/axios";
import { Stack, Tab, Tabs, Typography } from "@mui/material";
import LoadingScreen from "../../components/loading-screen";
import Lessons from "../../sections/topic/lessons";
import Quiz from "../../sections/topic/quiz";

const SingleTopicPage = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const topicId = searchParams.get('topicId');
    const { enqueueSnackbar } = useSnackbar();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [topic, setTopic] = useState<TOPIC | null>(null);
    const [tabValue, setTabValue] = useState<number>(0);

    const getTopicDetails = async () => {
        try {
            setIsLoading(true)
            const { data } = await axiosInstance.get(`/single-topic?topicId=${topicId}`);
            setTopic(data.topic);
        } catch (err: any) {
            enqueueSnackbar(err, { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const TABS = [
        <Lessons lessons={topic?.lessons || []} reload={getTopicDetails} />,
        <Quiz />
    ]

    useEffect(() => {
        getTopicDetails();
    }, [topicId])

  return (
    <Stack gap={3}>
        {isLoading && <LoadingScreen />}
        {!isLoading && <>
            {!topic && <Typography textAlign='center'>An error has occured while retrieving the details of the selected topic</Typography>}
            {topic && <Stack gap={3}>
                <Typography variant='h5' fontWeight='600'>{topic?.title}</Typography>
                <Typography>{topic?.description}</Typography>
                <Tabs
                    value={tabValue}
                    onChange={(_, newValue) => { setTabValue(newValue) }}
                >
                    <Tab label='Lessons' />
                    <Tab label='Quiz' />
                </Tabs>

                {TABS[tabValue]}
            </Stack>}
        </>}
    </Stack>
  )
}

export default SingleTopicPage