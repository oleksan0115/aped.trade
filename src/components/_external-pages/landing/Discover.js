import { motion } from 'framer-motion';
import React from 'react';
import Slider from 'react-slick';

// material
import { experimentalStyled as styled, useTheme } from '@material-ui/core/styles';
import { Typography, Stack, Container, Box, useMediaQuery } from '@material-ui/core';
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
    name: 'COMMODITIES',
    value: 4
  },
  {
    name: 'STOCKS',
    value: 5
  },
  {
    name: 'NFTS RESORT',
    value: 6
  }
];

// ----------------------------------------------------------------------

export default function Discover() {
  const theme = useTheme();

  const upMd = useMediaQuery(theme.breakpoints.up('md'));

  const renderSlides = () =>
    discovers.map((slide, index) => (
      <div key={index}>
        <Box sx={{ position: 'relative', margin: 1, [theme.breakpoints.up('md')]: { margin: 1.5 } }}>
          <Image src={`/static/landing/discover-${index + 1}.jpg`} sx={{ borderRadius: '9px' }} />
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
                color="whtie"
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
        <Box
          sx={{
            width: '160%',
            transform: 'translateX(-18.5%)',
            [theme.breakpoints.up('md')]: {
              width: '130%',
              transform: 'translateX(-11.5%)'
            }
          }}
        >
          <Slider
            dots={false}
            slidesToShow={upMd ? 5 : 3}
            slidesToScroll={1}
            autoplay
            autoplaySpeed={3000}
            // style={{
            //   width: '160%',
            //   transform: 'translateX(-11.5%)',
            //   [theme.breakpoints.up('md')]: {
            //     width: '130%',
            //     transform: 'translateX(-11.5%)'
            //   }
            // }}
          >
            {renderSlides()}
          </Slider>
        </Box>
      </RootStyle>
    </>
  );
}
