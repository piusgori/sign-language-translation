// @mui
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { ArrowCircleDown } from '@mui/icons-material';

// ----------------------------------------------------------------------

interface DB {
  onDownload?: any
}

export default function DownloadButton({ onDownload }: DB) {
  const theme = useTheme();

  return (
    <IconButton
      onClick={onDownload}
      sx={{
        p: 0,
        top: 0,
        right: 0,
        width: 1,
        height: 1,
        zIndex: 9,
        opacity: 0,
        position: 'absolute',
        borderRadius: 'unset',
        justifyContent: 'center',
        bgcolor: 'grey.800',
        color: 'common.white',
        transition: theme.transitions.create(['opacity']),

        '&:hover': {
          opacity: 1,
        },
      }}
    >
      <ArrowCircleDown />
    </IconButton>
  );
}

DownloadButton.propTypes = {
  onDownload: PropTypes.func,
};
