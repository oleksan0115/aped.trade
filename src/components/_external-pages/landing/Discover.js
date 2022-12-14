import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';

// material
import { experimentalStyled as styled, useTheme } from '@material-ui/core/styles';
import { MenuItem, ListItemIcon, ListItemText, Typography, Stack, Container, Box } from '@material-ui/core';
//
import { varWrapEnter } from '../../animate';
import { SkeletonPriceLists } from '../../skeleton';

// import Image from '../../Image';
// const finnhub = require('finnhub');

// const api_key = finnhub.ApiClient.instance.authentications['api_key'];
// api_key.apiKey = 'c9r0paiad3ibg4fjln3g'; // Replace this
// ----------------------------------------------------------------------

const RootStyle = styled(motion.div)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  position: 'relative',
  backgroundColor: theme.palette.grey[900]
}));

const ContentStyle = styled((props) => <Stack spacing={5} {...props} />)(({ theme }) => ({
  textAlign: 'center',
  paddingTop: theme.spacing(5),
  paddingBottom: theme.spacing(5),
  zIndex: 10
}));

// ----------------------------------------------------------------------

export default function Discover() {
  const theme = useTheme();

  const [cryptoPrices, setCryptoPrices] = useState([]);
  const [forexPrices, setForexPrices] = useState([]);
  const [stocksPrices, setStocksPrices] = useState([]);

  const [newDiscovers, setNewDiscovers] = useState(discovers);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true
        }
      }
    ]
  };

  const renderSlides = () =>
    newDiscovers.map((slide, index) => (
      <div key={index}>
        <div className="flip-card">
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <Box sx={{ position: 'relative' }}>
                <img
                  src={`/static/landing/discover-${slide.value}.png`}
                  alt={`slide-${index}`}
                  style={{ width: '100%' }}
                />
                <Typography
                  className="solid-text"
                  sx={{
                    position: 'absolute',
                    bottom: 10,
                    left: 0,
                    width: '100%',
                    textAlign: 'center',
                    fontSize: '16px',
                    fontFamily: 'BarlowBlackItalic',
                    [theme.breakpoints.up('md')]: {
                      fontSize: '30px',
                      bottom: 20
                    }
                  }}
                >
                  {slide.name}
                </Typography>
              </Box>
            </div>
            <div className="flip-card-back">
              <Typography variant="subtitle1" my={1}>
                {slide.name}
              </Typography>
              {slide.prices.length > 0 ? (
                <>
                  {slide.prices.slice(0, 5).map((option) => (
                    <MenuItem key={option.value} sx={{ py: 1, px: 2.5 }}>
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
                  {slide.prices.length > 5 && (
                    <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                      {slide.prices.length - 5} more pairs available
                    </Typography>
                  )}
                </>
              ) : (
                <Box sx={{ py: 1, px: 2.5 }}>
                  {index === 3 ? <Typography variant="body2">Comming Soon...</Typography> : <SkeletonPriceLists />}
                </Box>
              )}
            </div>
          </div>
        </div>
      </div>
    ));

  useEffect(() => {
    let selectedPrice = CRYPTOS;
    let mPrice = '';

    const tmpDiscovers = [];

    discovers.map((item, index) => {
      if (index === 0 && cryptoPrices.length > 0) {
        const tmpPrices = [];
        selectedPrice = CRYPTOS;
        selectedPrice.map((item, idx) => {
          tmpPrices.push({
            ...item,
            price: cryptoPrices[idx][item.label],
            changes: cryptoPrices[idx].changes_24hrs
          });
          return 0;
        });
        tmpDiscovers.push({
          ...item,
          prices: tmpPrices
        });
      } else if (index === 1 && forexPrices.length > 0) {
        const tmpPrices = [];
        selectedPrice = FOREX;
        selectedPrice.map((item, idx) => {
          forexPrices.map((forex) => {
            if (forex[item.label]) mPrice = forex[item.label];
            return 0;
          });
          tmpPrices.push({ ...item, price: mPrice, changes: forexPrices[idx].changes_24hrs });
          return 0;
        });
        tmpDiscovers.push({
          ...item,
          prices: tmpPrices
        });
      } else if (index === 2 && stocksPrices.length > 0) {
        const tmpPrices = [];
        selectedPrice = STOCKS;
        selectedPrice.map((item, idx) => {
          tmpPrices.push({
            ...item,
            price: stocksPrices[idx][item.label],
            changes: stocksPrices[idx].changes_24hrs
          });
          return 0;
        });
        tmpDiscovers.push({
          ...item,
          prices: tmpPrices
        });
      } else {
        tmpDiscovers.push({
          ...item,
          prices: []
        });
      }
      return tmpDiscovers;
    });

    setNewDiscovers([...tmpDiscovers]);
  }, [cryptoPrices, forexPrices, stocksPrices]);

  useEffect(() => {
    fetchData(PriceTypes[0]);
    fetchData(PriceTypes[1]);
    fetchData(PriceTypes[2]);
  }, []);

  const fetchData = async (currencyName) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_CHART_API_URL}/${currencyName}`).then((res) => res.json());
      if (response) {
        if (currencyName === 'cryptos') setCryptoPrices(response);
        else if (currencyName === 'forex') setForexPrices(response);
        else setStocksPrices(response);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <RootStyle initial="initial" animate="animate" variants={varWrapEnter} id="discover">
      <Container sx={{ maxWidth: '1400px !important' }}>
        <ContentStyle>
          <Box>
            <Typography
              variant="h2"
              sx={{
                fontFamily: 'BarlowExtraBoldItalic',
                color: 'common.white',
                textAlign: 'center',
                [theme.breakpoints.down('md')]: {
                  fontSize: '28px'
                }
              }}
            >
              DISCOVER{' '}
              <Typography
                component="span"
                variant="h2"
                className="gradient-text"
                sx={{
                  fontFamily: 'BarlowExtraBoldItalic',
                  [theme.breakpoints.down('md')]: {
                    fontSize: '26px'
                  }
                }}
              >
                TRADABLE ASSETS
              </Typography>
            </Typography>
            <div
              style={{
                width: 160,
                height: 0,
                border: '1px solid #FE00C0',
                borderRadius: 5,
                margin: 'auto',
                marginTop: 6,
                marginBottom: 6
              }}
            />
            <Typography
              variant="subtitle1"
              color="white"
              sx={{
                fontFamily: 'BarlowExtraBoldItalic',
                [theme.breakpoints.down('md')]: {
                  fontSize: '26px'
                }
              }}
            >
              50+ PAIRS
            </Typography>
          </Box>
        </ContentStyle>
        <Slider {...settings}>{renderSlides()}</Slider>
      </Container>
    </RootStyle>
  );
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
    label: 'CNH/USD',
    value: 'cnh',
    icon: '/static/icons/crypto/fil.png'
  },
  {
    label: 'JPY/USD',
    value: 'jpy',
    icon: '/static/icons/crypto/fil.png'
  },
  {
    label: 'MXN/USD',
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

const discovers = [
  {
    name: 'CRYPTO',
    value: 1,
    prices: []
  },
  {
    name: 'FOREX',
    value: 2,
    prices: []
  },
  {
    name: 'STOCKS',
    value: 3,
    prices: []
  },
  {
    name: 'COMMODITIES',
    value: 4,
    prices: []
  }
];
