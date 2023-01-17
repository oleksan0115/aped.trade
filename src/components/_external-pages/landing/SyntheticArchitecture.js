import { motion } from 'framer-motion';
import { useState } from 'react';
// material
import { experimentalStyled as styled, withStyles, useTheme } from '@material-ui/core/styles';
import { Container, Stack, Typography, Box, Grid, Button } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
//
import { varWrapEnter, varFadeInRight } from '../../animate';
import Image from '../../Image';
import JoinWaitlistDialog from '../../JoinWaitlistDialog';

// ----------------------------------------------------------------------

const RootStyle = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  textAlign: 'left',
  padding: theme.spacing(5, 0, 15, 0),
  backgroundColor: theme.palette.grey[900]
}));

const ContentStyle = styled((props) => <Stack spacing={5} {...props} />)(({ theme }) => ({
  textAlign: 'center',
  paddingTop: theme.spacing(5),
  paddingBottom: theme.spacing(7)
}));

const BoxStyle = styled(Box)(({ theme }) => ({
  position: 'relative',
  background: 'rgba(255, 255, 255, 0.02)',
  marginTop: theme.spacing(15),
  padding: theme.spacing(5),
  backdropFilter: 'blur(445px)',
  color: 'white',
  border: '3px solid rgba(255, 255, 255, 0.16)',
  borderRadius: 10,
  zIndex: 2,
  textAlign: 'center',
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(10)
  }
}));

const AccordionStyle = withStyles(() => ({
  root: {
    zIndex: 1,
    margin: 1,
    background: 'rgba(33, 31, 50, 0.45)',
    border: '1px solid rgba(255, 255, 255, 0.16)',
    boxShadow: '0px 4px 19px rgba(0, 0, 0, 0.14)',
    borderRadius: '10px',

    '&.Mui-expanded': {
      boxShadow: '0px 4px 19px rgba(0, 0, 0, 0.14)'
    }
  }
}))(Accordion);

// ----------------------------------------------------------------------

export default function SyntheticArchitecture() {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <RootStyle initial="initial" animate="animate" variants={varWrapEnter} id="faq">
      <Container sx={{ position: 'relative' }}>
        <JoinWaitlistDialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)} />
        <Image
          src="/static/landing/text-shine.png"
          sx={{ position: 'absolute', left: '50%', top: 100, transform: 'translate(-50%, -50%)', zIndex: 1 }}
        />
        <ContentStyle>
          <Box>
            <Typography
              variant="h2"
              sx={{
                fontFamily: 'BarlowExtraBoldItalic',
                color: 'common.white',
                textAlign: 'center'
              }}
            >
              UNIQUE, FULLY-SYNTHETIC
              <br />
              ARCHITECTURE
            </Typography>
            <div
              style={{
                width: 160,
                height: 0,
                border: '1px solid #FE00C0',
                borderRadius: 5,
                margin: 'auto',
                marginTop: 20
              }}
            />
          </Box>
        </ContentStyle>

        <Grid container spacing={2}>
          {architectures.map((item, i) => (
            <Grid item xs={12} md={6} key={i}>
              <AccordionStyle expanded={expanded === `panel${i + 1}`} onChange={handleChange(`panel${i + 1}`)}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Stack direction="row" spacing={2}>
                    <Box component="img" src="/static/landing/tick-square.svg" sx={{ width: 25, height: 'auto' }} />
                    <Typography
                      sx={{
                        color: 'common.white',
                        fontFamily: 'monospace',
                        fontWeight: 100,
                        fontSize: '16px',
                        maxWidth: 220,
                        textTransform: 'capitalize',
                        [theme.breakpoints.up('md')]: { fontSize: '18px', maxWidth: '100%' }
                      }}
                      noWrap
                    >
                      {item.title}
                    </Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ marginLeft: 5, color: 'common.white', fontFamily: 'BarlowRegular' }}>
                    {item.content}
                  </Typography>
                </AccordionDetails>
              </AccordionStyle>
            </Grid>
          ))}
        </Grid>

        <Image
          src="/static/landing/borrow-ellipse.png"
          sx={{
            position: 'absolute',
            left: 0,
            top: 560,
            transform: 'translate(-50%, -15%)',
            [theme.breakpoints.up('md')]: { left: 0, top: 60 }
          }}
        />
        <Image
          src="/static/landing/borrow-ellipse.png"
          sx={{
            position: 'absolute',
            right: 0,
            top: 360,
            transform: 'translate(50%, -25%)',
            [theme.breakpoints.up('md')]: { right: 0, top: 60 }
          }}
        />

        <BoxStyle>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center" justifyContent="space-between">
            <Box sx={{ maxWidth: 500, textAlign: 'left' }}>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: 'BarlowExtraBoldItalic',
                  marginBottom: 1,
                  [theme.breakpoints.down('md')]: { fontSize: '28px', textAlign: 'center' }
                }}
              >
                JOIN <span className="gradient-text">DISCORD</span>
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'monospace',
                  [theme.breakpoints.down('md')]: {
                    fontSize: '12px',
                    textAlign: 'left'
                  }
                }}
              >
                Join Discord to become an early ape.
              </Typography>
            </Box>

            <motion.div variants={varFadeInRight}>
              <Button
                className="aped-button"
                variant="contained"
                // onClick={() => setDialogOpen(true)}
                href="https://discord.com/invite/FbFjCz4PAR"
                sx={{ zIndex: 3 }}
              >
                Join Discord
              </Button>
            </motion.div>
          </Stack>
          <Image
            src="/static/landing/pink-ellipse-left.png"
            sx={{ position: 'absolute', left: 0, top: 60, transform: 'translate(-60%, -15%)' }}
          />
          <Image
            src="/static/landing/borrow-ellipse.png"
            sx={{ position: 'absolute', right: 0, top: 60, transform: 'translate(50%, -15%)', zIndex: 1 }}
          />
        </BoxStyle>

        {/* <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <BoxStyle>
              <img
                src="/static/landing/bonding_curve.png"
                alt="bonding-curve"
                style={{ width: 231, height: 'auto', margin: 'auto' }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontFamily: 'BarlowExtraBold',
                  marginTop: 5,
                  marginBottom: 18,
                  [theme.breakpoints.down('md')]: { fontSize: '28px', textAlign: 'center' }
                }}
              >
                <span className="gradient-text-1">BONDING CURVE</span>
              </Typography>
              <Link
                className="aped-link-button"
                href="https://aped-xyz.gitbook.io/copy-of-aped.-xyz-perp-dex-litepaper/economics-structure/bonding-curve"
                target="_blank"
              >
                LEARN MORE
              </Link>
            </BoxStyle>
          </Grid>
          <Grid item xs={12} md={6}>
            <BoxStyle>
              <img
                src="/static/landing/deflationary.png"
                alt="deflationary"
                style={{ width: 231, height: 'auto', margin: 'auto' }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontFamily: 'BarlowExtraBold',
                  marginTop: 5,
                  marginBottom: 18,
                  [theme.breakpoints.down('md')]: { fontSize: '28px', textAlign: 'center' }
                }}
              >
                <span className="gradient-text-1">Deflationary</span>
              </Typography>
              <Link
                className="aped-link-button"
                href="https://aped-xyz.gitbook.io/copy-of-aped.-xyz-perp-dex-litepaper/tokenomics"
                target="_blank"
              >
                LEARN MORE
              </Link>
            </BoxStyle>
          </Grid>
        </Grid> */}
      </Container>
    </RootStyle>
  );
}

const architectures = [
  {
    title: 'No Sign-Up Required',
    content:
      'Keep what’s important to you. We don’t believe in having access to your funds or identity past what is required for us to operate. As of now, we only need trader collateral on a trade-by-trade basis. Your keys, your crypto.'
  },
  {
    title: 'Most Accurate Asset Pricing Available',
    content:
      'The most accurate asset pricing. We average prices from multiple exchanges to eliminate the need for an order book.'
  },
  {
    title: 'Completely Decentralized architecture',
    content:
      'Trust returned to you. Limit orders, liquidations and rebalancing in a decentralized fashion. All handled by the power of Chainlink Keepers.'
  },
  {
    title: 'Eliminate scam wicks',
    content:
      'No more scam wicks. Many exchanges accept scam wicks as a norm in times of low volume. Using custom Chainlink Dons, we average prices from multiple exchanges to protect traders.'
  },
  {
    title: 'Chain-Agnostic',
    content: 'Trade on your preferred network. Planning to launch on Polygon, Arbitrum & Optimism.'
  },
  {
    title: 'Up to 1000x Leverage',
    content: 'Crypto up to 150x, Forex up to 1000x, Stocks and Commodities up to 100x'
  },
  {
    title: 'Fully Synthetic',
    content:
      'Synthetic architectures means no underlying assets being traded are actually bought or sold by us. We simulate these actions through smart contracts. Critical trade statistics are tracked algorithmically.'
  },
  {
    title: 'Lower Trading Fees',
    content: 'Lower overhead means lower fees. Decentralized architecture passes savings back to users.'
  },
  {
    title: 'Superior capital efficiency',
    content:
      'With no order book and trades handled synthetically, we only need one liquidity pool. Adding new pairs is instant. Specific pair liquidity is no longer a problem.'
  },
  {
    title: 'USDC, USDT & DAI Accepted',
    content: 'Trade and get paid in the stablecoin of your choice. Initially accepting USDC, USDT & DAI.'
  },
  {
    title: 'Bonding Curve',
    content:
      "The Aped token's bonding curve ensures that its price is always reflective of its underlying value. As more and more users participate in the Aped ecosystem and demand for the token increases, the price of the Aped token will naturally rise along the bonding curve."
  },
  {
    title: 'Proof of Reserve',
    content:
      'Proof of Reserves built in by default. The on-chain vault provides full transparency and guaranteed liquidity.'
  }
];
