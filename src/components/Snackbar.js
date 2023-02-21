/* eslint-disable */
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';

import { Typography, IconButton, Stack, Box } from '@material-ui/core';

// components
import Iconify from './Iconify';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

Snackbar.propTypes = {
  notiType: PropTypes.string,
  notiDuration: PropTypes.number,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

export default function Snackbar({ notiType, notiDuration, isOpen, onClose, marketLimit, longShort, currency }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    if (isOpen) {
      onSnackbar(notiType);
    }
    // eslint-disable-next-line
  }, [isOpen]);

  const onSnackbar = (notiType) => {
    enqueueSnackbar(
      <Stack direction="row" justifyContent="center" alignItems="center">
        <Box
          sx={{ padding: 2, py: 3, backgroundColor: '#232133', borderTopLeftRadius: 15, borderBottomLeftRadius: 15 }}
        >
          <Box component="img" src={`/static/icons/trading_ui/noti_${notiType}.png`} />
        </Box>
        <Stack spacing={1} sx={{ px: 2 }}>
          <Typography variant="h6" sx={{ textTransform: 'capitalize', color: 'text.primary' }}>
            {marketLimit} {longShort} {notiType}   
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
             {currency}
          </Typography>
        </Stack>
      </Stack>,
      {
        variant: 'default',
        autoHideDuration: notiDuration,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'left'
        },
        action: (key) => (
          <IconButton
            size="small"
            color="inherit"
            onClick={() => {
              closeSnackbar(key);
              onClose();
            }}
          >
            <Iconify icon="material-symbols:close" width={24} height={24} color="white" />
          </IconButton>
        )
      }
    );
  };

  return null;
}
