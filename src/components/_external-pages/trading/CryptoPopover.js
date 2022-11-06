import { useRef, useState } from 'react';
// material
import { alpha } from '@material-ui/core/styles';
import { Box, MenuItem, ListItemIcon, ListItemText } from '@material-ui/core';
// hooks
// components
import MenuPopover from '../../MenuPopover';
import { MIconButton } from '../../@material-extend';

// ----------------------------------------------------------------------

export default function CryptoPopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const [currentLang, setCurrentLang] = useState(LANGS[0]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeLang = (value) => {
    setCurrentLang(value);
    handleClose();
  };

  return (
    <>
      <MIconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          position: 'relative',
          padding: 0,
          width: 31,
          height: 31,
          mr: 1,
          ...(open && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity)
          })
        }}
      >
        <img src={currentLang.icon} alt={currentLang.label} />
        <img src="/static/icons/popup_arrow.svg" alt="arrow" style={{ position: 'absolute', bottom: 0, right: -5 }} />
      </MIconButton>

      <MenuPopover open={open} onClose={handleClose} anchorEl={anchorRef.current} sx={{ py: 1 }}>
        {LANGS.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === currentLang.value}
            onClick={() => handleChangeLang(option)}
            sx={{ py: 1, px: 2.5 }}
          >
            <ListItemIcon>
              <Box component="img" alt={option.label} src={option.icon} sx={{ width: 30, height: 30 }} />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ variant: 'body2' }}>{option.label}</ListItemText>
          </MenuItem>
        ))}
      </MenuPopover>
    </>
  );
}

const LANGS = [
  {
    value: 'dai',
    label: 'DAI',
    icon: '/static/icons/crypto/dai.webp'
  },
  {
    value: 'btc',
    label: 'Bitcoin',
    icon: '/static/icons/crypto/btc.webp'
  },
  {
    value: 'eth',
    label: 'Ethereum',
    icon: '/static/icons/crypto/eth.webp'
  },
  {
    value: 'ada',
    label: 'Cardano',
    icon: '/static/icons/crypto/ada.webp'
  }
];
