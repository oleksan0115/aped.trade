import { upperCase } from 'change-case-all';
import PropTypes from 'prop-types';
import { useRef, useState, useEffect } from 'react';
// material
import { Box, MenuItem, ListItemIcon, ListItemText, Stack, Typography } from '@material-ui/core';
// hooks
// components
import MenuPopover from '../../MenuPopover';

// ----------------------------------------------------------------------

CryptoPopover.propTypes = {
  currency: PropTypes.string,
  onChangeCurrency: PropTypes.func
};

export default function CryptoPopover({ currency, onChangeCurrency }) {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const [currentCurrency, setCurrentCurrency] = useState(CURRENCIES[0]);

  useEffect(() => {
    const cur = CURRENCIES.filter((curObj) => curObj.value === currency);
    setCurrentCurrency(cur[0]);
  }, [currency]);

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
        <Typography variant="h4">{currency ? upperCase(currency) : 'BTC'}</Typography>
        <img src="/static/icons/trading_ui/two_down_arrow.svg" alt="two arrow" style={{ width: 25 }} />
      </Stack>

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
  },
  {
    value: 'ltc',
    label: 'Lite coin',
    icon: '/static/icons/crypto/ltc.png'
  },
  {
    value: 'xlm',
    label: 'XLM',
    icon: '/static/icons/crypto/xlm.png'
  },
  {
    value: 'neo',
    label: 'NEO',
    icon: '/static/icons/crypto/neo.png'
  },
  {
    value: 'iota',
    label: 'IOTA',
    icon: '/static/icons/crypto/iota.png'
  },
  {
    value: 'sol',
    label: 'Solana',
    icon: '/static/icons/crypto/sol.png'
  },
  {
    value: 'vet',
    label: 'VET',
    icon: '/static/icons/crypto/vet.png'
  },
  {
    value: 'eos',
    label: 'EOS',
    icon: '/static/icons/crypto/eos.png'
  },
  {
    value: 'matic',
    label: 'MATIC',
    icon: '/static/icons/crypto/matic.webp'
  },
  {
    value: 'dot',
    label: 'DOT',
    icon: '/static/icons/crypto/dot.png'
  },
  {
    value: 'axs',
    label: 'AXS',
    icon: '/static/icons/crypto/axs.png'
  },
  {
    value: 'uni',
    label: 'UNI',
    icon: '/static/icons/crypto/uni.png'
  },
  {
    value: 'link',
    label: 'LINK',
    icon: '/static/icons/crypto/link.png'
  },
  {
    value: 'fil',
    label: 'FIL',
    icon: '/static/icons/crypto/fil.png'
  }
];
