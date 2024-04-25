import { Button, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import { LESSON } from "../../utils/types";
import { useState } from "react";
import { Image } from "@nextui-org/image";
import AddLessonDialog from "./add-lesson-dialog";

interface LES {
    lessons: LESSON[],
    reload: () => void;
}

const Lessons = ({ lessons, reload }: LES) => {

    const [formOpen, setFormOpen] = useState<boolean>(false);

  return (
    <>
        <AddLessonDialog closeDialog={() => { setFormOpen(false) }} open={formOpen} reloadHandler={reload} />
        <Stack gap={3}>
            <Stack gap={1} direction='row' alignItems='center' justifyContent='space-between'>
                <Typography variant='h6'>Lessons</Typography>
                <Button onClick={() => { setFormOpen(true) }}>Add Lesson</Button>
            </Stack>

            {lessons.length === 0 && <Typography textAlign='center'>No Lesson Added</Typography>}
            {lessons.length > 0 && <Grid container spacing={3}>
                {lessons.map((lesson, index) => {
                    return (
                        <Grid item xs={12} md={6} lg={4} key={index}>
                            <Card key={index} style={{ marginTop: '10px', backgroundColor: '#f9f9f9' }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>{lesson.title}</Typography>
                                    <Typography variant="body1" gutterBottom>{lesson.content}</Typography>
                                    <Image src={lesson.url} alt={lesson.title} className="h-[200px]" />
                                </CardContent>
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>}
        </Stack>
    </>
  )
}

export default Lessons