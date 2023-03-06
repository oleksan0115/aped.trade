import { upperCase } from 'change-case-all';
import PropTypes from 'prop-types';

import { useRef, useState, useEffect } from 'react';
// material
import { useTheme } from '@material-ui/core/styles';
import { Box, MenuItem, ListItemIcon, ListItemText, Stack, Tabs, Tab, Typography } from '@material-ui/core';

// components
import MenuPopover from '../../MenuPopover';
import Iconify from '../../Iconify';
import { fCurrency } from '../../../utils/formatNumber';

// consts
import { CRYPTOS, FOREX, STOCKS, PriceTypes } from './chart/Consts';

// ----------------------------------------------------------------------

CryptoPopover.propTypes = {
  price: PropTypes.number,
  openPrice: PropTypes.number,
  currency: PropTypes.string,
  onChangeCurrency: PropTypes.func
};

export default function CryptoPopover({ price, openPrice, currency, onChangeCurrency }) {
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
          console.log('useEffect: cryptos: ', tmpPrices);
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
          console.log('useEffect: forex: ', tmpPrices);
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
    // const cur = tmpPrices.find((curObj) => curObj.value === currency);
    setNewPrices([...tmpPrices]);
  }, [currency, cryptoPrices, forexPrices, stocksPrices, value]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeCurrency = (price) => {
    onChangeCurrency(price.value, value);
    handleClose();
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchData = async (currencyName) => {
    try {
      if (currencyName === 'crypto') currencyName += 's';
      const response = await fetch(`${process.env.REACT_APP_CHART_API_URL}/${currencyName}`).then((res) => res.json());
      console.log('fetchData', response);
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
        <Typography variant="h4">{currency ? upperCase(currency) : 'BTC'}</Typography>
        <img
          src={
            price > openPrice
              ? '/static/icons/trading_ui/two_up_arrow.svg'
              : '/static/icons/trading_ui/two_down_arrow.svg'
          }
          alt="two arrow"
          style={{ width: 18, margin: '0 5px' }}
        />
        <Typography variant="h6" sx={{ color: price > openPrice ? '#05FF00' : '#FF0000', minWidth: 100 }}>
          {price === 0 ? 'processing...' : price === -1 ? 'channel closed!' : `$${price}`}
        </Typography>
        <img
          src="/static/icons/trading_ui/trading_arrow_button.png"
          alt="two arrow"
          style={{ width: 35, height: 'auto', marginLeft: 5, marginRight: 10 }}
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
