import { Link as RouterLink } from 'react-router-dom';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Typography, Stack, Box, Container, Button, Link } from '@material-ui/core';
// components
import Page from '../components/Page';
import Image from '../components/Image';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)({
  backgroundImage: 'radial-gradient(circle, #161616, #161616, #000000)',
  height: '100%'
});

const ContainerStyle = styled(Container)(({ theme }) => ({
  height: '100%',
  overflow: 'hidden',
  position: 'relative',
  paddingTop: theme.spacing(3)
}));

const HeaderStyle = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  width: '100%'
}));

const ContentBox = styled((props) => <Stack spacing={3} {...props} />)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  textAlign: 'center',
  padding: theme.spacing(2, 1),
  width: '100%'
}));

// ----------------------------------------------------------------------

export default function MarketingFunnel() {
  return (
    <RootStyle title="Marketing Funnel | LVRJ" id="move_top" className="gradient-background">
      <ContainerStyle>
        <HeaderStyle>
          <Link underline="none" component={RouterLink} to="/">
            <Stack spacing={1} direction="row" alignItems="center">
              <Image src="/static/marketing-funnel/logo.png" />
              <Typography variant="h4" sx={{ fontWeight: 200, color: 'white', fontFamily: 'monospace' }}>
                APED
              </Typography>
            </Stack>
          </Link>
        </HeaderStyle>
        <ContentBox>
          <Typography variant="h2" color="white" sx={{ fontFamily: 'arial black', fontWeight: 900 }}>
            Trade Perpetual Futures
          </Typography>
          <Typography variant="h6" color="white" sx={{ fontFamily: 'arial', fontWeight: 400 }}>
            Low Fees. No KYC. High Leverage.
          </Typography>
          <Button variant="contained" className="gradient-button">
            Launch App
          </Button>
          <Stack spacing={5} alignItems="center" justifyContent="center" direction="row">
            <Image src="/static/marketing-funnel/logo-twitter.png" />
            <Image src="/static/marketing-funnel/logo-discord.png" />
          </Stack>
        </ContentBox>
      </ContainerStyle>
    </RootStyle>
  );
}
