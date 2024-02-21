import { Button, Card, CardActions, CardContent, Stack, Typography, styled } from "@mui/material"
import { ITEM } from "../../utils/types";
import { Image } from '@nextui-org/image';

const TopImage = styled(Image)(() => ({
    objectFit: 'contain',
    objectPosition: 'center',
    maxHeight: '200px'
}));

interface SI {
    item: ITEM,
    isRequest?: boolean,
    openEdit?: (item: ITEM) => void,
    openDelete?: (item: ITEM) => void,
    openApprove?: (item: ITEM) => void,
}

const SingleItem = ({ item, isRequest, openEdit, openApprove, openDelete }: SI) => {

    const handleEdit = () => {
        if (!isRequest && openEdit) openEdit(item);
    }

    const handleDelete = () => {
        if (!isRequest && openDelete) openDelete(item);
    }

    const handleApprove = () => {
        if (isRequest && openApprove) openApprove(item);
    }

  return (
    <Card>
        <CardContent>
            <Stack gap={3}>
                <TopImage alt={item.meaning} src={item.image} />
                <Typography>{item.meaning}</Typography>
            </Stack>
        </CardContent>
        <CardActions>
            {!isRequest && <Button size='small' onClick={handleEdit}>Edit</Button>}
            {!isRequest && <Button size='small' onClick={handleDelete}>Delete</Button>}
            {isRequest && <Button size='small' onClick={handleApprove}>Approve</Button>}
        </CardActions>
    </Card>
  )
}

export default SingleItem