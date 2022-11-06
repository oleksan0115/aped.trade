/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React from 'react';
import { NavLink as RouterLink } from 'react-router-dom';

import '../../assets/css/low-dai-notify.css';
// material
import { useTheme } from '@material-ui/core/styles';
import { Box, AppBar, Toolbar, Container, Button, Stack } from '@material-ui/core';
// hooks
// components
import Logo from '../../components/Logo';
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

export default function MainNavbar() {
  const theme = useTheme();

  return (
    <AppBar color="default" sx={{ [theme.breakpoints.up('md')]: { position: 'relative', boxShadow: 0 } }}>
      <Toolbar
        disableGutters
        sx={{ bgcolor: 'background.default', boxShadow: 'none', borderBottom: '1px solid rgba(255, 255, 255, 0.22)' }}
      >
        <Container
          maxWidth="xl"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <RouterLink to="#">
            <Logo />
          </RouterLink>
          <Stack direction="row" spacing={1} sx={{ position: 'relative' }}>
            <Button
              fullWidth
              className="trading-gradient-button"
              variant="contained"
              color="error"
              sx={{ px: 4 }}
              startIcon={<Box component="img" src="/static/trading/connect-wallet-icon.png" sx={{ width: 20 }} />}
            >
              CONNECT
            </Button>

            <Button className="trading-gradient-button no-padding" variant="contained" color="error">
              <Box component="img" src="/static/trading/hexagon.png" sx={{ width: 20 }} />
              <Iconify icon="ci:line-xl" sx={{ height: 30 }} />
              <Iconify icon="bi:three-dots-vertical" sx={{ width: 20 }} />
            </Button>
          </Stack>
        </Container>
      </Toolbar>
    </AppBar>
  );
}
