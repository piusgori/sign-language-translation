// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
// utils
//
import { fileData } from '../file-thumbnail';
import { fData } from '../../utils/utilities';

// ----------------------------------------------------------------------

interface RF {
  fileRejections?: any
}

export default function RejectionFiles({ fileRejections }: RF) {
  if (!fileRejections.length) {
    return null;
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        py: 1,
        px: 2,
        mt: 3,
        bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
        borderColor: (theme) => alpha(theme.palette.error.main, 0.24),
      }}
    >
      {fileRejections.map(({ file, errors }: { file: any, errors: any }) => {
        const { path, size } = fileData(file);

        return (
          <Box key={path} sx={{ my: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {path} - {size ? fData(size) : ''}
            </Typography>

            {errors.map((error: any) => (
              <Box key={error.code} component="span" sx={{ typography: 'caption' }}>
                - {error.message}
              </Box>
            ))}
          </Box>
        );
      })}
    </Paper>
  );
}