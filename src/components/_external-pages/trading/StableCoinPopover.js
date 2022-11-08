import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
// material
import { alpha } from '@material-ui/core/styles';
import { Box, MenuItem, ListItemIcon, ListItemText } from '@material-ui/core';
// hooks
// components
import MenuPopover from '../../MenuPopover';
import { MIconButton } from '../../@material-extend';

// ----------------------------------------------------------------------

CryptoPopover.propTypes = {
  onChangeCurrency: PropTypes.func
};

export default function CryptoPopover({ onChangeCurrency }) {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const [currentCurrency, setCurrentCurrency] = useState(CURRENCIES[0]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeLang = (value) => {
    setCurrentCurrency(value);
    onChangeCurrency(value.value);
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
        <img src={currentCurrency.icon} alt={currentCurrency.label} />
        <img src="/static/icons/popup_arrow.svg" alt="arrow" style={{ position: 'absolute', bottom: 0, right: -5 }} />
      </MIconButton>

      <MenuPopover open={open} onClose={handleClose} anchorEl={anchorRef.current} sx={{ py: 1 }}>
        {CURRENCIES.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === currentCurrency.value}
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

const CURRENCIES = [
  {
    value: 'dai',
    label: 'DAI',
    icon: '/static/icons/crypto/dai.png'
  },
  {
    value: 'tether',
    label: 'Tether',
    icon: '/static/icons/crypto/tether.png'
  },
  {
    value: 'usdc',
    label: 'USD Coin',
    icon: '/static/icons/crypto/usdc.png'
  },
  {
    value: 'busd',
    label: 'Binance USD',
    icon: '/static/icons/crypto/busd.png'
  },
  {
    value: 'frax',
    label: 'Frax',
    icon: '/static/icons/crypto/frax.png'
  },
  {
    value: 'pax',
    label: 'Pax Dollar',
    icon: '/static/icons/crypto/pax.webp'
  },
  {
    value: 'tusd',
    label: 'TrueUSD',
    icon: '/static/icons/crypto/tusd.png'
  },
  {
    value: 'gemd',
    label: 'Gemini Dollar',
    icon: '/static/icons/crypto/gemd.png'
  }
];
