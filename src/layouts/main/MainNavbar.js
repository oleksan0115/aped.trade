import { useState } from 'react';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
// material
import { useTheme } from '@material-ui/core/styles';
import { Box, Button, AppBar, Toolbar, Container } from '@material-ui/core';
// hooks
import useOffSetTop from '../../hooks/useOffSetTop';
// components
import Logo from '../../components/Logo';
import JoinWaitlistDialog from '../../components/JoinWaitlistDialog';
// import Label from '../../components/Label';
import { MHidden } from '../../components/@material-extend';
import Iconify from '../../components/Iconify';
//
import MenuMobile from './MenuMobile';
import navConfig from './MenuConfig';

// ----------------------------------------------------------------------

export default function MainNavbar() {
  const theme = useTheme();
  const isOffset = useOffSetTop(100);
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <AppBar
      sx={{ boxShadow: 0, position: 'absolute', top: 0, left: 0, width: '100%', backgroundColor: 'rgba(0,0,0,0)' }}
    >
      <Toolbar sx={{ [theme.breakpoints.down('md')]: { paddingLeft: 0, paddingRight: 0 } }}>
        <JoinWaitlistDialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)} />
        <Container
          maxWidth="xl"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            [theme.breakpoints.down('md')]: { paddingLeft: 0, paddingRight: 0 }
          }}
        >
          <RouterLink to="/">
            <Logo />
          </RouterLink>
          <Box sx={{ flexGrow: 1 }} />

          <MHidden width="mdDown">
            <Button
              className="aped-button"
              variant="contained"
              onClick={() => setDialogOpen(true)}
              sx={{ marginLeft: 9 }}
            >
              JOIN WAITLIST
            </Button>
            <Button
              className="aped-button"
              variant="contained"
              // onClick={() => setDialogOpen(true)}
              href="/#discover"
              sx={{ marginLeft: 9, paddingLeft: '5px !important', paddingRight: '5px !important' }}
            >
              <Iconify icon="fluent-mdl2:world" sx={{ width: 30, height: 30 }} />
            </Button>
          </MHidden>
          <MHidden width="mdUp">
            <MenuMobile isOffset={isOffset} isHome={isHome} navConfig={navConfig} />
          </MHidden>
        </Container>
      </Toolbar>
    </AppBar>
  );
}
