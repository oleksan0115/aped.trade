import { motion } from 'framer-motion';
import React from 'react';
import Slider from 'react-slick';

// material
import { experimentalStyled as styled, useTheme } from '@material-ui/core/styles';
import { Typography, Stack, Container, Box } from '@material-ui/core';
//
import { varWrapEnter } from '../../animate';

import Image from '../../Image';
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

const discovers = [
  {
    name: 'COMMODITIES',
    value: 1
  },
  {
    name: 'FOREX',
    value: 2
  },
  {
    name: 'CRYPTO ',
    value: 3
  },
  {
    name: 'STOCKS',
    value: 4
  },
  {
    name: 'COMMODITIES',
    value: 1
  },
  {
    name: 'FOREX',
    value: 2
  },
  {
    name: 'CRYPTO ',
    value: 3
  },
  {
    name: 'STOCKS',
    value: 4
  },
  {
    name: 'COMMODITIES',
    value: 1
  },
  {
    name: 'FOREX',
    value: 2
  },
  {
    name: 'CRYPTO ',
    value: 3
  },
  {
    name: 'STOCKS',
    value: 4
  }
];

// ----------------------------------------------------------------------

export default function Discover() {
  const theme = useTheme();

  const settings = {
    dots: true,
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
          dots: true
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
          slidesToScroll: 1
        }
      }
    ]
  };

  const renderSlides = () =>
    discovers.map((slide, index) => (
      <div key={index}>
        <Box sx={{ position: 'relative' }}>
          <Image src={`/static/landing/discover-${slide.value}.png`} />
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
    ));
  // const finnhubClient = new finnhub.DefaultApi();
  // useEffect(() => {
  //   // Crypto candles
  //   finnhubClient.forexSymbols('OANDA', (error, data, response) => {
  //     console.log(data);
  //   });
  // }, []);
  return (
    <>
      <RootStyle initial="initial" animate="animate" variants={varWrapEnter}>
        <Container>
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
        </Container>
        <Slider {...settings}>{renderSlides()}</Slider>
      </RootStyle>
    </>
  );
}
