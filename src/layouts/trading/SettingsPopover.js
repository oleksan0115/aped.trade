import PropTypes from 'prop-types';

import { useRef, useState } from 'react';
// material
import { MenuItem, ListItemIcon, ListItemText, Button, Box, Divider, Typography } from '@material-ui/core';

// components
import MenuPopover from '../../components/MenuPopover';
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

SettingsPopover.propTypes = {
  settingValue: PropTypes.string,
  onChangeSettingValue: PropTypes.func
};

export default function SettingsPopover({ settingValue, onChangeSettingValue }) {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    console.log(settingValue);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeSettingValue = (value) => {
    onChangeSettingValue(value);
    handleClose();
  };

  return (
    <>
      <Box
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          pl: 1
        }}
      >
        <Button className="trading-gradient-button no-padding" variant="contained" color="error">
          <Box component="img" src="/static/trading/hexagon.png" sx={{ width: 20 }} />
          <Iconify icon="ci:line-xl" sx={{ height: 30 }} />
          <Iconify icon="bi:three-dots-vertical" sx={{ width: 20 }} />
        </Button>
      </Box>

      <MenuPopover open={open} onClose={handleClose} anchorEl={anchorRef.current} sx={{ py: 1, width: 160 }}>
        <Typography variant="caption" sx={{ px: 2 }}>
          Networks
        </Typography>
        <Divider />
        <MenuItem
          // selected={option.value === currentCurrency.value}
          onClick={() => handleChangeSettingValue('polygon')}
          sx={{ py: 1, px: 2.5 }}
        >
          <ListItemIcon>
            <Iconify icon="mdi:shape-polygon-plus" sx={{ width: 20, height: 20 }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ variant: 'body2' }}>Polygon</ListItemText>
        </MenuItem>
        <MenuItem
          // selected={option.value === currentCurrency.value}
          onClick={() => handleChangeSettingValue('avalanche')}
          sx={{ py: 1, px: 2.5 }}
        >
          <ListItemIcon>
            <Iconify icon="mdi:avalanche" sx={{ width: 20, height: 20 }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ variant: 'body2' }}>Avalanche</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem
          // selected={option.value === currentCurrency.value}
          onClick={() => handleChangeSettingValue('settings')}
          sx={{ py: 1, px: 2.5 }}
        >
          <ListItemIcon>
            <Iconify icon="ep:setting" sx={{ width: 20, height: 20 }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ variant: 'body2' }}>Settings</ListItemText>
        </MenuItem>
        <MenuItem
          // selected={option.value === currentCurrency.value}
          onClick={() => handleChangeSettingValue('language')}
          sx={{ py: 1, px: 2.5 }}
        >
          <ListItemIcon>
            <Iconify icon="iconoir:language" sx={{ width: 20, height: 20 }} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ variant: 'body2' }}>Languages</ListItemText>
        </MenuItem>
      </MenuPopover>
    </>
  );
}
