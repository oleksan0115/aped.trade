import { motion } from 'framer-motion';
import Slider from 'react-slick';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Box, Stack } from '@material-ui/core';
//
import { varWrapEnter } from '../../animate';

// ----------------------------------------------------------------------

const RootStyle = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.grey[800],
  border: `1px solid ${theme.palette.grey[500_32]}`
}));

const ContentStyle = styled((props) => <Stack spacing={5} {...props} />)(({ theme }) => ({
  maxWidth: 1400,
  margin: 'auto',
  alignContent: 'center',
  padding: theme.spacing(5, 0),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(10, 0)
  }
}));

const ImageStyle = styled(Box)(({ theme }) => ({
  // height: 15,
  margin: 'auto',
  // marginLeft: '10px !important',
  [theme.breakpoints.up('md')]: {
    // marginLeft: '40px !important',
    height: 40
  }
}));

// ----------------------------------------------------------------------

export default function PoweredBy() {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
    initialSlide: 0,
    responsive: [
      // {
      //   breakpoint: 1024,
      //   settings: {
      //     slidesToShow: 3,
      //     slidesToScroll: 3,
      //     infinite: true,
      //     dots: false
      //   }
      // },
      // {
      //   breakpoint: 600,
      //   settings: {
      //     slidesToShow: 2,
      //     slidesToScroll: 2,
      //     initialSlide: 2
      //   }
      // },
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true
        }
      }
    ]
  };

  const renderSlides = () =>
    POWEREDBY.map((slide, index) => (
      <div key={index}>
        <ImageStyle component="img" src={slide} />
      </div>
    ));

  return (
    <>
      <RootStyle initial="initial" animate="animate" variants={varWrapEnter}>
        <ContentStyle>
          <Slider {...settings}>{renderSlides()}</Slider>
        </ContentStyle>
      </RootStyle>
    </>
  );
}

const POWEREDBY = [
  '/static/landing/poweredby/zksync.png',
  '/static/landing/poweredby/arbitrum.png',
  '/static/landing/poweredby/polygon.png',
  '/static/landing/poweredby/chainlink.svg',
  '/static/landing/poweredby/marker.png'
];
