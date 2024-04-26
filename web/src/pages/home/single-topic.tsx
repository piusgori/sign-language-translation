import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { TOPIC } from "../../utils/types";
import axiosInstance from "../../utils/axios";
import { Stack, Typography } from "@mui/material";
import Loader from "../../components/loading/Loader";
import Lessons from "../../sections/home/learn/lessons";

const SingleTopicPage = () => {
    const [searchParams, _] = useSearchParams();
    const topicId = searchParams.get('topicId');
    const { enqueueSnackbar } = useSnackbar();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [topic, setTopic] = useState<TOPIC | null>(null);

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

    useEffect(() => {
        getTopicDetails();
    }, [topicId])

  return (
    <Stack gap={3}>
        {isLoading && <Loader />}
        {!isLoading && <>
            {!topic && <Typography textAlign='center'>An error has occured while retrieving the details of the selected topic</Typography>}
            {topic && <Stack gap={3}>
                <Typography variant='h5' fontWeight='600'>{topic?.title}</Typography>
                <Typography>{topic?.description}</Typography>
                <Lessons lessons={topic.lessons} />
            </Stack>}
        </>}
    </Stack>
  )
}

export default SingleTopicPage