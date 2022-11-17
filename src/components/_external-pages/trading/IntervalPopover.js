import PropTypes from 'prop-types';

import { useRef, useState } from 'react';
// material
import { MenuItem, ListItemIcon, ListItemText, Stack } from '@material-ui/core';

// components
import MenuPopover from '../../MenuPopover';
import Iconify from '../../Iconify';

// ----------------------------------------------------------------------

IntervalPopover.propTypes = {
  onChangeInterval: PropTypes.func
};

export default function IntervalPopover({ onChangeInterval }) {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeInterval = (item) => {
    onChangeInterval(item.value);
    handleClose();
  };

  return (
    <>
      <Stack
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
        <img src="/static/icons/trading_ui/five_min_button.png" alt="two arrow" style={{ height: 40 }} />
      </Stack>

      <MenuPopover open={open} onClose={handleClose} anchorEl={anchorRef.current} sx={{ py: 1, width: 160 }}>
        {intervals.map((option) => (
          <MenuItem
            key={option.value}
            // selected={option.value === currentCurrency.value}
            onClick={() => handleChangeInterval(option)}
            sx={{ py: 1, px: 2.5 }}
          >
            <ListItemIcon>
              <Iconify icon="mdi:timer-sync-outline" sx={{ width: 20, height: 20 }} />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ variant: 'body2' }}>{option.label}</ListItemText>
          </MenuItem>
        ))}
      </MenuPopover>
    </>
  );
}

const intervals = [
  {
    label: '1min',
    value: 1
  },
  {
    label: '5min',
    value: 5
  },
  {
    label: '15min',
    value: 15
  },
  {
    label: '30min',
    value: 30
  },
  {
    label: '60min',
    value: 60
  }
];
