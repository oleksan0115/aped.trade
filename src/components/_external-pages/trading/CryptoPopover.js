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
  onChnageCurrencyDetail: PropTypes.func,
  onChangeCurrency: PropTypes.func,
  onChangeType: PropTypes.func
};

export default function CryptoPopover({ currency, onChnageCurrencyDetail, onChangeCurrency, onChangeType }) {
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
  }, []);

  useEffect(() => {
    const tmpPrices = [];
    let selectedPrice = CRYPTOS;
    let mPrice = '';
    switch (value) {
      case 0:
        if (cryptoPrices.length > 0) {
          selectedPrice = CRYPTOS;
          selectedPrice.map((item, idx) => {
            tmpPrices.push({
              ...item,
              price: cryptoPrices[idx][item.label],
              changes: cryptoPrices[idx].changes_24hrs
            });
            return 0;
          });
        }
        break;
      case 1:
        if (forexPrices.length > 0) {
          selectedPrice = FOREX;
          selectedPrice.map((item, idx) => {
            forexPrices.map((forex) => {
              if (forex[item.label]) mPrice = forex[item.label];
              return 0;
            });
            tmpPrices.push({ ...item, price: mPrice, changes: forexPrices[idx].changes_24hrs });
            return 0;
          });
        }
        break;
      case 2:
        if (stocksPrices.length > 0) {
          selectedPrice = STOCKS;
          selectedPrice.map((item, idx) => {
            tmpPrices.push({ ...item, price: stocksPrices[idx][item.label], changes: stocksPrices[idx].changes_24hrs });
            return 0;
          });
        }
        break;
      default:
        selectedPrice = CRYPTOS;
        break;
    }
    const cur = tmpPrices.find((curObj) => curObj.value === currency);
    onChnageCurrencyDetail(cur);
    setNewPrices([...tmpPrices]);
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
        else setStocksPrices(response);
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
          borderRadius: 1
        }}
      >
        <img
          src="/static/icons/trading_ui/trading_arrow_button.png"
          alt="two arrow"
          style={{ width: 40, height: 'auto', marginLeft: 5, marginRight: 10 }}
        />
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
              <ListItemText
                primaryTypographyProps={{ variant: 'caption' }}
                sx={{ color: '#2FD593', textAlign: 'right' }}
              >
                {option.price}
              </ListItemText>
              <ListItemText
                primaryTypographyProps={{ variant: 'caption' }}
                sx={{ color: option.changes > 0 ? '#2FD593' : '#FF4976', textAlign: 'right' }}
              >
                {option.changes > 0 ? '+' : ''}
                {option.changes?.toFixed(2)}%
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
                <Box
                  component="img"
                  alt={option.label}
                  src={option.icon}
                  sx={{ width: 30, height: 30, borderRadius: '50%' }}
                />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ variant: 'body2' }}>{option.label}</ListItemText>
              <ListItemText
                primaryTypographyProps={{ variant: 'caption' }}
                sx={{ color: '#2FD593', textAlign: 'right' }}
              >
                {option.price}
              </ListItemText>
              <ListItemText
                primaryTypographyProps={{ variant: 'caption' }}
                sx={{ color: option.changes > 0 ? '#2FD593' : '#FF4976', textAlign: 'right' }}
              >
                {option.changes > 0 ? '+' : ''}
                {option.changes?.toFixed(2)}%
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
                <Box
                  component="img"
                  alt={option.label}
                  src={option.icon}
                  sx={{ width: 30, height: 30, borderRadius: '50%' }}
                />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ variant: 'body2' }}>{option.label}</ListItemText>
              <ListItemText
                primaryTypographyProps={{ variant: 'caption' }}
                sx={{ color: '#2FD593', textAlign: 'right' }}
              >
                {option.price}
              </ListItemText>
              <ListItemText
                primaryTypographyProps={{ variant: 'caption' }}
                sx={{ color: option.changes > 0 ? '#2FD593' : '#FF4976', textAlign: 'right' }}
              >
                {option.changes > 0 ? '+' : ''}
                {option.changes?.toFixed(2)}%
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
    label: 'IOT/USD',
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
    icon: '/static/icons/forex/EU.svg'
  },
  {
    label: 'AUD/USD',
    value: 'aud',
    icon: '/static/icons/forex/AU.svg'
  },
  {
    label: 'GBP/USD',
    value: 'gbp',
    icon: '/static/icons/forex/GB.svg'
  },
  {
    label: 'CNH/USD',
    value: 'cnh',
    icon: '/static/icons/forex/CN.svg'
  },
  {
    label: 'JPY/USD',
    value: 'jpy',
    icon: '/static/icons/forex/JP.svg'
  },
  {
    label: 'MXN/USD',
    value: 'mxn',
    icon: '/static/icons/forex/MX.svg'
  }
];

const STOCKS = [
  {
    label: 'TSLA',
    value: 'tsla',
    icon: '/static/icons/stocks/tesla.svg'
  },
  {
    label: 'AAPL',
    value: 'aapl',
    icon: '/static/icons/stocks/apple.svg'
  },
  {
    label: 'AMZN',
    value: 'amzn',
    icon: '/static/icons/stocks/amazon.svg'
  },
  {
    label: 'MSFT',
    value: 'msft',
    icon: '/static/icons/stocks/microsoft.svg'
  },
  {
    label: 'SNAP',
    value: 'snap',
    icon: '/static/icons/stocks/snap.svg'
  },
  {
    label: 'AXP',
    value: 'axp',
    icon: '/static/icons/stocks/american-express.svg'
  },
  {
    label: 'CSCO',
    value: 'csco',
    icon: '/static/icons/stocks/cisco.svg'
  },
  {
    label: 'T',
    value: 't',
    icon: '/static/icons/stocks/at-and-t.svg'
  },
  {
    label: 'DIS',
    value: 'dis',
    icon: '/static/icons/stocks/walt-disney.svg'
  },
  {
    label: 'ABBV',
    value: 'abbv',
    icon: '/static/icons/stocks/abbvie.svg'
  },
  {
    label: 'MMM',
    value: 'mmm',
    icon: '/static/icons/stocks/3m.svg'
  },
  {
    label: 'JPM',
    value: 'jpm',
    icon: '/static/icons/stocks/jpmorgan-chase.svg'
  },
  {
    label: 'JNJ',
    value: 'jnj',
    icon: '/static/icons/stocks/johnson-and-johnson.svg'
  }
];
const PriceTypes = ['cryptos', 'forex', 'stocks'];
