// @mui
import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

interface SFP {
  imgUrl?: any;
}

export default function SingleFilePreview({ imgUrl = '' }: SFP) {
  return (
    <Box
      sx={{
        p: 1,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        position: 'absolute',
      }}
    >
      <img
        alt="file preview"
        src={imgUrl}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: 1,
        }}
      />
    </Box>
  );
}
