import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
// material
import { alpha, experimentalStyled as styled, useTheme } from '@material-ui/core/styles';
import { Box, Drawer, Link, ListItem, ListItemText, Stack, Button } from '@material-ui/core';
// components
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import { MIconButton } from '../../components/@material-extend';
import JoinWaitlistDialog from '../../components/JoinWaitlistDialog';
//
import menuConfig from './MenuConfig';

// ----------------------------------------------------------------------

const ITEM_SIZE = 55;
const PADDING = 2.5;

const ListItemStyle = styled(ListItem)(({ theme }) => ({
  ...theme.typography.body2,
  height: ITEM_SIZE,
  textTransform: 'capitalize',
  paddingLeft: theme.spacing(PADDING),
  paddingRight: theme.spacing(2.5),
  color: theme.palette.text.secondary
}));

const LinkStyle = styled(Link)(({ theme }) => ({
  fontFamily: 'BarlowExtraBold',
  height: ITEM_SIZE,
  fontSize: '20px',
  textTransform: 'uppercase',
  padding: theme.spacing(1.8, 0),
  margin: `${theme.spacing(2, 0)} !important`,
  color: 'white'
}));

// ----------------------------------------------------------------------

MenuMobileItem.propTypes = {
  item: PropTypes.object,
  isActive: PropTypes.bool
};

function MenuMobileItem({ item, isActive }) {
  const { title, path } = item;
  return (
    <ListItemStyle
      button
      key={title}
      to={path}
      component={RouterLink}
      sx={{
        ...(isActive && {
          color: 'primary.main',
          fontWeight: 'fontWeightMedium',
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
        })
      }}
    >
      <ListItemText disableTypography primary={title} />
    </ListItemStyle>
  );
}

MenuMobile.propTypes = {
  isOffset: PropTypes.bool,
  isHome: PropTypes.bool
};

export default function MenuMobile({ isOffset, isHome }) {
  const theme = useTheme();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      handleDrawerClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleDrawerOpen = () => {
    setMobileOpen(true);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <MIconButton
        onClick={handleDrawerOpen}
        sx={{
          fontSize: 30,
          ml: 1,
          ...(isHome && { color: 'common.white' }),
          ...(isOffset && { color: 'text.primary' })
        }}
      >
        <Icon icon={menu2Fill} />
      </MIconButton>
      <JoinWaitlistDialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)} />

      <Drawer
        open={mobileOpen}
        onClose={handleDrawerClose}
        ModalProps={{ keepMounted: true }}
        PaperProps={{ sx: { pb: 5, width: '100%' } }}
        sx={{ '& .MuiPaper-root': { backgroundColor: theme.palette.grey[900] } }}
      >
        <MIconButton onClick={handleDrawerClose} sx={{ position: 'absolute', right: 5, top: 5 }}>
          <Iconify icon="line-md:menu-to-close-alt-transition" sx={{ width: 30, height: 30 }} />
        </MIconButton>
        <Scrollbar>
          <Box sx={{ textAlign: 'center' }}>
            <Stack direction="column" spacing={1} sx={{ marginTop: 20 }}>
              {menuConfig.map((link) => (
                <LinkStyle key={link.title} href={link.path} onClick={handleDrawerClose}>
                  {link.title}
                </LinkStyle>
              ))}
            </Stack>
            <Button className="aped-button" variant="contained" onClick={() => setDialogOpen(true)} sx={{ mt: 5 }}>
              JOIN WAITLIST
            </Button>
          </Box>
        </Scrollbar>
      </Drawer>
    </>
  );
}
