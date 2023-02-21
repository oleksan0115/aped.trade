/* eslint-disable */
import React, { useEffect, useState, useContext } from 'react';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';

import '../../assets/css/low-dai-notify.css';
// material
import { experimentalStyled as styled, useTheme } from '@material-ui/core/styles';
import { Box, AppBar, Toolbar, Container, Button, Stack } from '@material-ui/core';
// paths
import { PATH_PAGE } from '../../routes/paths';
// components
import Logo from '../../components/Logo';
// import Iconify from '../../components/Iconify';
import SettingsPopover from './SettingsPopover';
import SettingsDialog from './SettingsDialog';

import Web3 from 'web3';
import { ContractContext } from 'src/contexts/ContractContext';
// ----------------------------------------------------------------------

const WrongNetwork = styled('div')(({ theme }) => ({
  width: 'fit-content',
  margin: 'auto',
  borderRadius: theme.spacing(1),
  backgroundColor: '#FF0000BF',
  padding: theme.spacing(0.5, 2),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(0.5),
    fontSize: '12px'
  }
}));

export default function MainNavbar() {
  const theme = useTheme();
  const { pathname } = useLocation();

  const [settingValue, setSettingValue] = useState('');

  const [showSettingDialog, setShowSettingDialog] = useState(false);

  const {user, setUser} = useContext(ContractContext);

  const connectWallet = async (e) => {
    e.preventDefault();
    if(window.ethereum) {
       await window.ethereum.request({ method: "eth_requestAccounts"});
       window.web3 = new Web3(window.ethereum);

       const account = web3.eth.accounts;

       const walletAddress = account.givenProvider.selectedAddress;
       setUser(walletAddress);

       console.log(`Wallet: ${walletAddress}`);
    } else {
     console.log("No wallet");
    }
};

  useEffect(() => {
    if (settingValue === 'settings') setShowSettingDialog(true);
  }, [settingValue]);

  const isMatched = (path) => pathname === path;

  return (
    <AppBar color="default" sx={{ [theme.breakpoints.up('md')]: { position: 'relative', boxShadow: 0 } }}>
      <SettingsDialog
        isOpen={showSettingDialog}
        onClose={() => {
          setShowSettingDialog(false);
          setSettingValue('');
        }}
      />
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
          <RouterLink to={PATH_PAGE.root}>
            <Logo />
          </RouterLink>

          {!isMatched(PATH_PAGE.contactUs) && (
            <Stack direction="row" spacing={1} sx={{ position: 'relative' }}>
              {!WRONG_NETWORK ? (
                <Button
                  fullWidth
                  className="trading-gradient-button"
                  variant="contained"
                  color="error"
                  sx={{ px: 1, [theme.breakpoints.up('md')]: { px: 4 } }}
                  startIcon={<Box component="img" src="/static/trading/connect-wallet-icon.png" sx={{ width: 20 }} />}
                  onClick={(e) => connectWallet(e)}
                >
                  {user
                     ? <h4>{user}</h4>
                     : <h4>CONNECT</h4>
                   }
                </Button>
              ) : (
                <WrongNetwork className="wrong-network-alert">WRONG NETWORK</WrongNetwork>
              )}

              <SettingsPopover settingValue={settingValue} onChangeSettingValue={(value) => setSettingValue(value)} />
            </Stack>
          )}
        </Container>
      </Toolbar>
    </AppBar>
  );
}

const WRONG_NETWORK = false;
