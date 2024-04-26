import { Button, Card, CardContent, Grid, Stack, Typography } from "@mui/material"
import { useState } from "react";
import { QUESTION } from "../../utils/types";
import AddQuestionForm from "./add-question-form";
import { Image } from "@nextui-org/image";

interface QUIZ {
  questions: QUESTION[],
  reload: () => void;
}

const Quiz = ({ questions, reload }: QUIZ) => {

  const [formOpen, setFormOpen] = useState<boolean>(false);

  return (
    <>
      <AddQuestionForm closeDialog={() => { setFormOpen(false) }} open={formOpen} reloadHandler={reload} />
      <Stack gap={3}>
        <Stack gap={1} direction='row' alignItems='center' justifyContent='space-between'>
          <Typography variant='h6'>Questions</Typography>
          <Button onClick={() => { setFormOpen(true) }}>Add Question</Button>
        </Stack>

        {questions.length === 0 && <Typography textAlign='center'>No questions added</Typography>}
        {questions.length > 0 && <Grid container>
          {questions.map((ques, index) => {
            return (
              <Grid item key={index}>
                <Card variant="outlined" style={{ margin: '20px', padding: '20px' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>{ques.text}</Typography>
                    <Grid container spacing={2}>
                      {ques.options.map((option, index) => (
                        <Grid key={index} item xs={12} md={6}>
                          <Image src={option} alt={`${index}`} className="h-[150px]" />
                        </Grid>
                      ))}
                    </Grid>
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

export default Quiz