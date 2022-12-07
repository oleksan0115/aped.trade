import { upperCase } from 'change-case-all';
import PropTypes from 'prop-types';

import { useRef, useState, useEffect } from 'react';
// material
import { useTheme } from '@material-ui/core/styles';
import { Box, MenuItem, ListItemIcon, ListItemText, Stack, Typography, Tabs, Tab } from '@material-ui/core';

// components
import MenuPopover from '../../MenuPopover';
import Iconify from '../../Iconify';

// ----------------------------------------------------------------------

CryptoPopover.propTypes = {
  currency: PropTypes.string,
  onChangeCurrency: PropTypes.func,
  onChangeType: PropTypes.func
};

export default function CryptoPopover({ currency, onChangeCurrency, onChangeType }) {
  const theme = useTheme();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);

  const [cryptoPrices, setCryptoPrices] = useState([]);
  const [forexPrices, setForexPrices] = useState([]);
  const [stocksPrices, setStocksPrices] = useState([]);

  const [newPrices, setNewPrices] = useState([]);

  useEffect(() => {
    fetchData(PriceTypes[0]);
    fetchData(PriceTypes[1]);
    fetchData(PriceTypes[2]);
    console.log(STOCKS);
  }, []);

  useEffect(() => {
    if (cryptoPrices.length > 0 && forexPrices.length > 0) {
      // if (cryptoPrices.length > 0 && forexPrices.length > 0 && stocksPrices.length > 0) {
      const tmpPrices = [];
      let selectedPrice = CRYPTOS;
      let mPrice = '';
      switch (value) {
        case 0:
          selectedPrice = CRYPTOS;
          selectedPrice.map((item, index) => {
            tmpPrices.push({ ...item, price: cryptoPrices[index][item.label] });
            return 0;
          });
          break;
        case 1:
          selectedPrice = FOREX;
          selectedPrice.map((item) => {
            forexPrices.map((forex) => {
              if (forex[item.label]) mPrice = forex[item.label];
              return 0;
            });
            tmpPrices.push({ ...item, price: mPrice });
            return 0;
          });
          break;
        case 2:
          // selectedPrice = STOCKS;
          // selectedPrice.map((item, index) => {
          //   tmpPrices.push({ ...item, price: stocksPrices[index][item.label] });
          //   return 0;
          // });
          break;
        default:
          selectedPrice = CRYPTOS;
          break;
      }
      // const cur = selectedPrice.filter((curObj) => curObj.value === currency);

      setNewPrices([...tmpPrices]);
    }
  }, [currency, cryptoPrices, forexPrices, stocksPrices, value]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeCurrency = (price) => {
    onChangeCurrency(price.value);
    onChangeType(value);
    handleClose();
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchData = async (currencyName) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_CHART_API_URL}/${currencyName}`).then((res) => res.json());
      if (response.length) {
        if (currencyName === 'cryptos') setCryptoPrices(response);
        else if (currencyName === 'forex') setForexPrices(response);
        else setStocksPrices(response.prices);
      }
    } catch (e) {
      console.error(e);
    }
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

      <MenuPopover open={open} onClose={handleClose} anchorEl={anchorRef.current} sx={{ py: 1, width: 320 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
          sx={{ '& .MuiButtonBase-root:not(:last-child)': { marginRight: 0 } }}
        >
          <Tab icon={<Iconify icon="cib:bitcoin" sx={{ width: 20, height: 20 }} />} label="Crypto" {...a11yProps(0)} />
          <Tab
            icon={<Iconify icon="cryptocurrency:usd" sx={{ width: 20, height: 20 }} />}
            label="Forex"
            {...a11yProps(1)}
          />
          <Tab
            icon={<Iconify icon="ant-design:stock-outlined" sx={{ width: 20, height: 20 }} />}
            label="Stocks"
            {...a11yProps(2)}
          />
        </Tabs>
        <TabPanel value={value} index={0} dir={theme.direction} sx={{ maxHeight: 400 }}>
          {newPrices.map((option) => (
            <MenuItem
              key={option.value}
              // selected={option.value === currentCurrency.value}
              onClick={() => handleChangeCurrency(option)}
              sx={{ py: 1, px: 2.5 }}
            >
              <ListItemIcon>
                <Box component="img" alt={option.label} src={option.icon} sx={{ width: 30, height: 30 }} />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ variant: 'body2' }}>{option.label}</ListItemText>
              <ListItemText primaryTypographyProps={{ variant: 'caption' }} sx={{ color: '#2FD593' }}>
                {option.price}
              </ListItemText>
            </MenuItem>
          ))}
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          {newPrices.map((option) => (
            <MenuItem
              key={option.value}
              // selected={option.value === currentCurrency.value}
              onClick={() => handleChangeCurrency(option)}
              sx={{ py: 1, px: 2.5 }}
            >
              <ListItemIcon>
                <Box component="img" alt={option.label} src={option.icon} sx={{ width: 30, height: 30 }} />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ variant: 'body2' }}>{option.label}</ListItemText>
              <ListItemText primaryTypographyProps={{ variant: 'caption' }} sx={{ color: '#2FD593' }}>
                {option.price}
              </ListItemText>
            </MenuItem>
          ))}
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          {newPrices.map((option) => (
            <MenuItem
              key={option.value}
              // selected={option.value === currentCurrency.value}
              onClick={() => handleChangeCurrency(option)}
              sx={{ py: 1, px: 2.5 }}
            >
              <ListItemIcon>
                <Box component="img" alt={option.label} src={option.icon} sx={{ width: 30, height: 30 }} />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ variant: 'body2' }}>{option.label}</ListItemText>
              <ListItemText primaryTypographyProps={{ variant: 'caption' }} sx={{ color: '#2FD593' }}>
                {option.price}
              </ListItemText>
            </MenuItem>
          ))}
        </TabPanel>
      </MenuPopover>
    </>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box mt={1} maxHeight={500} sx={{ overflowY: 'auto' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`
  };
}

const CRYPTOS = [
  {
    value: 'btc',
    label: 'BTC/USD',
    icon: '/static/icons/crypto/btc.webp'
  },
  {
    value: 'eth',
    label: 'ETH/USD',
    icon: '/static/icons/crypto/eth.webp'
  },
  {
    value: 'ltc',
    label: 'LTC/USD',
    icon: '/static/icons/crypto/ltc.png'
  },
  {
    value: 'xlm',
    label: 'XLM/USD',
    icon: '/static/icons/crypto/xlm.png'
  },
  {
    value: 'ada',
    label: 'ADA/USD',
    icon: '/static/icons/crypto/ada.webp'
  },
  {
    value: 'neo',
    label: 'NEO/USD',
    icon: '/static/icons/crypto/neo.png'
  },
  {
    value: 'eos',
    label: 'EOS/USD',
    icon: '/static/icons/crypto/eos.png'
  },
  {
    value: 'iota',
    label: 'IOTA/USD',
    icon: '/static/icons/crypto/iota.png'
  },
  {
    value: 'sol',
    label: 'SOL/USD',
    icon: '/static/icons/crypto/sol.png'
  },
  {
    value: 'vet',
    label: 'VET/USD',
    icon: '/static/icons/crypto/vet.png'
  },
  {
    value: 'matic',
    label: 'MATIC/USD',
    icon: '/static/icons/crypto/matic.webp'
  },
  {
    value: 'dot',
    label: 'DOT/USD',
    icon: '/static/icons/crypto/dot.png'
  },
  {
    value: 'axs',
    label: 'AXS/USD',
    icon: '/static/icons/crypto/axs.png'
  },
  {
    value: 'uni',
    label: 'UNI/USD',
    icon: '/static/icons/crypto/uni.png'
  },
  {
    value: 'link',
    label: 'LINK/USD',
    icon: '/static/icons/crypto/link.png'
  },
  {
    value: 'fil',
    label: 'FIL/USD',
    icon: '/static/icons/crypto/fil.png'
  }
];

const FOREX = [
  {
    label: 'EUR/USD',
    value: 'eur',
    icon: '/static/icons/crypto/fil.png'
  },
  {
    label: 'AUD/USD',
    value: 'aud',
    icon: '/static/icons/crypto/fil.png'
  },
  {
    label: 'GBP/USD',
    value: 'gbp',
    icon: '/static/icons/crypto/fil.png'
  },
  {
    label: 'USD/CNH',
    value: 'cnh',
    icon: '/static/icons/crypto/fil.png'
  },
  {
    label: 'USD/JPY',
    value: 'jpy',
    icon: '/static/icons/crypto/fil.png'
  },
  {
    label: 'USD/MXN',
    value: 'mxn',
    icon: '/static/icons/crypto/fil.png'
  }
];

const STOCKS = [
  {
    label: 'TSLA',
    value: 'tsla',
    icon: '/static/icons/crypto/stock.png'
  },
  {
    label: 'AAPL',
    value: 'aapl',
    icon: '/static/icons/crypto/stock.png'
  },
  {
    label: 'AMZN',
    value: 'amzn',
    icon: '/static/icons/crypto/stock.png'
  },
  {
    label: 'MSFT',
    value: 'msft',
    icon: '/static/icons/crypto/stock.png'
  },
  {
    label: 'SNAP',
    value: 'snap',
    icon: '/static/icons/crypto/stock.png'
  },
  {
    label: 'AXP',
    value: 'axp',
    icon: '/static/icons/crypto/stock.png'
  },
  {
    label: 'CSCO',
    value: 'csco',
    icon: '/static/icons/crypto/stock.png'
  },
  {
    label: 'T',
    value: 't',
    icon: '/static/icons/crypto/stock.png'
  },
  {
    label: 'DIS',
    value: 'dis',
    icon: '/static/icons/crypto/stock.png'
  },
  {
    label: 'ABBV',
    value: 'abbv',
    icon: '/static/icons/crypto/stock.png'
  },
  {
    label: 'MMM',
    value: 'mmm',
    icon: '/static/icons/crypto/stock.png'
  },
  {
    label: 'JPM',
    value: 'jpm',
    icon: '/static/icons/crypto/stock.png'
  },
  {
    label: 'JNJ',
    value: 'jnj',
    icon: '/static/icons/crypto/stock.png'
  }
];
const PriceTypes = ['cryptos', 'forex', 'stocks'];
