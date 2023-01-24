import PropTypes from 'prop-types';

import { useRef, useState } from 'react';
// material
import { MenuItem, ListItemIcon, ListItemText, Stack, Box } from '@material-ui/core';

// components
import MenuPopover from '../../MenuPopover';
import Iconify from '../../Iconify';

// ----------------------------------------------------------------------

IntervalPopover.propTypes = {
  interval: PropTypes.string,
  onChangeInterval: PropTypes.func
};

export default function IntervalPopover({ interval, onChangeInterval }) {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeInterval = (item) => {
    onChangeInterval(item);
    handleClose();
  };

  return (
    <>
      <Box
        ref={anchorRef}
        onClick={handleOpen}
        direction="row"
        spacing={0}
        alignItems="center"
        sx={{
          cursor: 'pointer',
          pl: 1,
          borderRadius: 1,
          '&:hover': { backgroundColor: '#00000047' }
        }}
      >
        {/* <img src="/static/icons/trading_ui/five_min_button.png" alt="two arrow" style={{ height: 40 }} /> */}
        <Stack
          direction="row"
          spacing={1}
          sx={{ backgroundColor: '#232133', py: 1, px: 2, borderRadius: '10px', fontWeight: 500 }}
        >
          {interval}
          <img src="/static/icons/trading_ui/trangle_icon.svg" alt="two arrow" />
        </Stack>
      </Box>

      <MenuPopover open={open} onClose={handleClose} anchorEl={anchorRef.current} sx={{ py: 1, width: 160 }}>
        {intervals.map((option) => (
          <MenuItem
            key={option}
            // selected={option.value === currentCurrency.value}
            onClick={() => handleChangeInterval(option)}
            sx={{ py: 1, px: 2.5 }}
          >
            <ListItemIcon>
              <Iconify icon="mdi:timer-sync-outline" sx={{ width: 20, height: 20 }} />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ variant: 'body2' }}>{option}</ListItemText>
          </MenuItem>
        ))}
      </MenuPopover>
    </>
  );
}

const intervals = ['1 min', '5 min', '15 min', '30 min', '1 hour', '4 hour', '1 day'];
