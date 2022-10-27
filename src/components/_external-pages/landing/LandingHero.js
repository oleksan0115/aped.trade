import { useState } from 'react';
import { motion } from 'framer-motion';
// material
import { experimentalStyled as styled, useTheme } from '@material-ui/core/styles';
import { Button, Container, Typography, Stack } from '@material-ui/core';
// routes
//
import { varWrapEnter, varFadeInRight } from '../../animate';
// components
import Image from '../../Image';
import { MHidden } from '../../@material-extend';
import JoinWaitlistDialog from '../../JoinWaitlistDialog';
// ----------------------------------------------------------------------

const RootStyle = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  paddingTop: theme.spacing(7),
  backgroundColor: theme.palette.grey[900],
  [theme.breakpoints.up('md')]: {
    top: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    paddingTop: theme.spacing(14),
    alignItems: 'center'
  }
}));

const ContentStyle = styled((props) => <Stack spacing={5} {...props} />)(({ theme }) => ({
  zIndex: 10,
  maxWidth: 600,
  margin: 'auto',
  textAlign: 'center',
  position: 'relative',
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(10),
  justifyContent: 'center',
  [theme.breakpoints.up('md')]: {
    margin: 'unset',
    marginLeft: theme.spacing(5),
    paddingTop: theme.spacing(15),
    paddingBottom: theme.spacing(15),
    textAlign: 'left'
  }
}));

const HeroImgContainer = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  right: '-24px',
  zIndex: 10,
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}));

const HeroImgStyle = styled(motion.img)(() => ({
  width: 'auto'
}));

// ----------------------------------------------------------------------

export default function LandingHero() {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <RootStyle initial="initial" animate="animate" variants={varWrapEnter}>
        <JoinWaitlistDialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)} />
        <Container maxWidth="xl">
          <Stack direction="row" spacing={1} justifyContent="space-between">
            <ContentStyle>
              <motion.div variants={varFadeInRight}>
                <Typography
                  sx={{
                    textAlign: 'center',
                    fontSize: '32px',
                    lineHeight: '42px',
                    fontFamily: 'BarlowExtraBoldItalic',
                    color: 'common.white',
                    fontWeight: 900,
                    [theme.breakpoints.up('md')]: {
                      textAlign: 'left',
                      lineHeight: '66px',
                      fontSize: '54px'
                    }
                  }}
                >
                  DECENTRALIZED <br />
                  <span className="gradient-text">LEVERAGED</span> TRADING
                </Typography>
              </motion.div>
              <motion.div variants={varFadeInRight}>
                <Button className="aped-button" variant="contained" onClick={() => setDialogOpen(true)}>
                  JOIN WAITLIST
                </Button>
              </motion.div>

              <MHidden width="mdUp">
                <HeroImgStyle alt="hero" src="/static/landing/landing-mobile-hero.png" />
              </MHidden>
            </ContentStyle>

            <HeroImgContainer>
              <HeroImgStyle alt="hero" src="/static/landing/desktop-trading-hero.png" sx={{ marginBottom: 5 }} />
            </HeroImgContainer>
          </Stack>

          <Image
            src="/static/landing/pink-ellipse-left.png"
            sx={{
              position: 'absolute',
              left: 0,
              top: 60,
              transform: 'translate(-30%, -25%)',
              [theme.breakpoints.down('md')]: {
                width: '100%',
                height: '100%',
                '& .MuiBox-root': { objectFit: 'initial' }
              }
            }}
          />

          <Image src="/static/landing/grey-ellipse-2.png" sx={{ position: 'absolute', right: 0, top: 0, zIndex: 1 }} />
          <Image
            src="/static/landing/grey-ellipse-1.png"
            sx={{ position: 'absolute', right: 100, top: 0, zIndex: 1 }}
          />
        </Container>
      </RootStyle>
    </>
  );
}
